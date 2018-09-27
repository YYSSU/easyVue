/**
 * Created by litao on 2018/8/9.
 */

import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

NProgress.configure({ showSpinner: false });

let whiteList = ['/login'];

//默认系统跳转拦截
let RouterBeforeJumpFunc = () => true;

//默认系统权限拦截
let SystemPermissionFunc = callback => callback();

//白名单
const addWhiteList = function (list) {
    whiteList = whiteList.concat(list || []);
    window.console.groupCollapsed('ezv-console-routerWhiteList');
    _console.log('%c %s', "color: red;", whiteList.join(' | '));
    window.console.groupEnd();
};

//注册路由跳转拦截
const registryRouterBeforeJumpFunc = function (func) {
    if(func && Object.prototype.toString.call(func).toLowerCase() === '[object function]'){
        RouterBeforeJumpFunc = func;
        return;
    }

    throw new Error(`要注册的路由跳转拦截不是一个可执行函数，请核对!`);
};

//注册系统权限处理拦截
const registrySystemPermissionFunc = function (func) {
    if(func && Object.prototype.toString.call(func).toLowerCase() === '[object function]'){
        SystemPermissionFunc = func;
        return;
    }

    throw new Error(`要注册的系统权限处理不是一个可执行函数，请核对!`);
};

//绑定路由钩子
const bindHookFunc = function (router, store) {
    router.beforeEach((to, from, next) => {
        NProgress.start();
        const isToLogin = to.path === '/login';

        //获取当前登录用户信息
        const currentUser = store.getters.userInfo;
        const successMenus = store.getters.menuInfo.successMenus;

        if(currentUser && currentUser.id && successMenus && successMenus.length > 0){
            routerChangeFunc(next, isToLogin ? '/' : true);
        }else{
            if(whiteList.includes(to.path)){
                routerChangeFunc(next);
            }else{
                SystemPermissionFunc(router, store, to, next, store._vm);
                NProgress.done();
            }
        }
    });

    router.afterEach((to, from) => {
        // if(to.matched && to.matched.length === 0)
        //     router.app.$jump({ name: '404' });
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
    registryRouterBeforeJumpFunc,
    registrySystemPermissionFunc
}