/**
 * Created by litao on 2018/8/9.
 */
'use strict';

import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

NProgress.configure({ showSpinner: false });

let whiteList = ['/login'];

let RouterBeforeJumpFunc = undefined;

const addWhiteList = function (list) {
    whiteList = whiteList.concat(list || []);
    _console.log(`路由白名单列表： ${whiteList.join(' | ')}`);
};

const registryRouterBeforeJumpFunc = function (func) {
    if(func && Object.prototype.toString.call(func).toLowerCase() === '[object function]'){
        RouterBeforeJumpFunc = func;
        return;
    }

    throw `[60001] 要注册的路由跳转拦截不是一个可执行函数，请核对!`;
};

const bindHookFunc = function (router, store) {
    router.beforeEach((to, from, next) => {
        NProgress.start();
        const isToLogin = to.path === '/login';

        if(whiteList.includes(to.path)){
            routerChangeFunc(next);
        }else{
            //获取当前登录用户信息
            const currentUser = store.getters.userInfo;
            const successMenus = store.getters.menuInfo.successMenus;
            if(true || (currentUser && currentUser.id)){
                if(successMenus.length > 0){
                    routerChangeFunc(next, isToLogin ? '/' : true);
                }else{
                    //请求服务器，获取当前登录用户信息
                    store.dispatch('loadUserInfo').then(() => {
                        //TODO 此处可以处理用户加载完成之后的操作 by:litao 2018年08月21日15:44:58
                        store.dispatch('loadMenuInfo').then((menus) => {
                            //TODO 此处可以处理菜单加载完成之后的操作 by:litao 2018年08月21日15:44:58
                            store.dispatch('mergeMenus', { menus, router}).then((result) => {
                                if(!result || result.length === 0){
                                    routerChangeFunc(next, {name: '401'});
                                    return;
                                }

                                routerChangeFunc(next, to.path);
                            });
                        }).catch(error => {
                            alert(error.message || error || '未获取到权限信息!');
                        });
                    }).catch(error => {
                        alert(error.message || error);
                    });
                }
            }else{
                routerChangeFunc(next, {name: 'login'});
            }
        }
    });

    router.afterEach((to, from) => {

    });
};

function routerChangeFunc(next, toObj = true) {
    if(Object.prototype.toString.call(toObj).toLowerCase() === '[object boolean]'){
        if(toObj === true){
            beforeRouterChange().then(() => {
                next();
                NProgress.done();
            });
            return;
        }
        next(false);
        NProgress.done();
    }else{
        beforeRouterChange().then(() => {
            next(toObj);
            NProgress.done();
        })
    }

    //业务端进行验证，是否允许跳转
    async function beforeRouterChange() {
        if(!RouterBeforeJumpFunc || Object.prototype.toString.call(RouterBeforeJumpFunc).toLowerCase() !== '[object function]')
            return true;

        const isJump = await RouterBeforeJumpFunc(toObj, next) || false;
        if(isJump){
            return true;
        }
        throw `[${401}] 不允许跳转该页面`;
    }
}

export {
    addWhiteList,
    bindHookFunc,
    registryRouterBeforeJumpFunc
}