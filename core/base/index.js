/**
 * Created by litao on 2018/8/9.
 */
'use strict';
import promise from 'es6-promise';
import packageJson from '../../package.json';
import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import VueI18n from 'vue-i18n'
import ajaxProxy, { ajaxApi } from './ajax/proxy';
import user from './store/modules/user.js';
import menu from './store/modules/menu.js';
import getters from './store/getters.js';
import * as methods from './common/methods/index.js';

import {addWhiteList, bindHookFunc, registryRouterBeforeJumpFunc} from './router';

promise.polyfill();

const Core = {
    //初始化log
    initLog (logLevel){
        console.log(`%c当前打印日志级别为 ====> ${logLevel > 0 ? logLevel === 4 ? '全部打印' : logLevel : '全部不打印'}`, 'color: red;');

        const logLevelMap = ['log', 'info', 'warn', 'error'].reverse();
        window._console = {};
        for(let i=0; i<logLevelMap.length; i++){
            let level = logLevelMap[i];
            window._console[level] = function () {
                i < logLevel && this[level].apply(window.console, arguments);
            };
        }
    },

    //初始化扩展方法
    initExtendMethods (){
        if(!methods || Object.keys(methods).length === 0)
            return;

        Object.keys(methods).forEach(method => Vue.prototype[method] = methods[method]);
    },

    //初始化自己封装的http
    initHttp: (context) => {
        if(!context)
            throw '扫描api路径时，未获取到上下文！';

        let $apiSource = {};

        context.keys().forEach(path => {
            let arr = path.split('/');
            let module = arr[arr.length - 1] || '';
            module = module.replace('\.js', '');
            $apiSource[module] = context(path);
        });

        ajaxApi.call(Vue, $apiSource);
    },

    //初始化路由
    initRouter (store, routes){
        Vue.use(VueRouter);

        let router = new VueRouter({
            scrollBehavior: () => ({ y: 0 }),
            routes: routes.constantRouterMap
        });

        store.dispatch('savePermissionMenu', routes.permissionRouterMap);

        bindHookFunc(router, store);

        return router;
    },

    //初始化状态树
    initStore (){
        Vue.use(Vuex);

        return new Vuex.Store({
            modules: {
                user,
                menu
            },
            getters
        });
    },

    //初始化语言配置
    initLanguage (){
        Vue.use(VueI18n);

        return new VueI18n({

        });
    },

    //初始化实例
    init (routes, instance){
        if(!instance)
            throw '初始化异常，传入的实例为空！';

        instance = instance.default || instance;

        this.initExtendMethods();

        const store = this.initStore();

        return new Vue({
            el: '#app',
            store: store,
            router: this.initRouter(store, routes),
            i18n: this.initLanguage(),
            render: h => h(instance)
        });
    }
};

//暴露实例
function EasyVue({ App, routes, extendInfo, logLevel = EasyVue.LOG_LEVEL, packing }) {
    //初始化日志打印
    Core.initLog(logLevel);

    //注入内置组件
    require('./common/component')(Vue);

    return {
        //版本号
        version: packageJson.version,

        //设置路由拦截器
        setRouterIntercept (intercept){
            registryRouterBeforeJumpFunc(intercept);
            return this;
        },

        //设置接口
        setRestApi (api){
            Core.initHttp(api);
            return this;
        },

        //设置http代理
        setHttpProxy (proxy){
            ajaxProxy(proxy);
            return this;
        },

        //添加白名单
        addRouterWhiteList (whiteList){
            addWhiteList(whiteList);
            return this;
        },

        //安装第三方插件
        install (plugin){
            if(plugin){
                Vue.use(plugin);
            }
            return this;
        },

        //运行
        run (){
            window.__easyVueInstance__ = Core.init(routes, App);
            window.__evRoot__ = this;
            return this;
        },

        //获取实例
        getInstance (){
            return window.__easyVueInstance__;
        }
    }
}

//日志级别
EasyVue.LOG_LEVEL = {
    ALL: 4,
    INFO: 3,
    WARN: 2,
    ERROR: 1,
    CLOSE: 0
};

export default EasyVue;