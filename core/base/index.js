/**
 * Created by litao on 2018/8/9.
 */
'use strict';
import './common/style/animate.css';
import './common/style/system-component.scss';
import './util/pwd-string';
import promise from 'es6-promise';
import packageJson from '../../package.json';
import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import VueI18n from 'vue-i18n'
import ajaxProxy, { ajaxApi, setTokenFunc } from './ajax/proxy';
import user from './store/modules/user.js';
import menu from './store/modules/menu.js';
import button from './store/modules/button.js';
import getters from './store/getters.js';
import * as methods from './common/methods/index.js';
import * as filters from './common/filters/index.js';

import {addWhiteList, bindHookFunc, registryRouterBeforeJumpFunc, registrySystemPermissionFunc} from './router';

Vue.prototype.$EZV_zIndex = 3000;
Vue.prototype.$EZV_messageTop = 100;

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
                if(i < logLevel){
                    window.console[level].apply(this, arguments);
                }
            };
        }
    },

    //初始化扩展方法
    initExtendMethods (){
        if(!methods || Object.keys(methods).length === 0)
            return;

        Object.keys(methods).forEach(method => Vue.prototype[method] = methods[method]);
    },

    //初始化扩展过滤器
    initExtendFilter (){
        if(!filters || Object.keys(filters).length === 0){
            return;
        }

        Object.keys(filters).forEach(filter => Vue.filter(filter, filters[filter]));
    },

    //全局内置配置
    globalSetting ({ filters, methods, directives }){
        //通用方法
        function commonHandler(vuePropertyKey, source, valueTypes) {
            Object.keys(source).forEach(key => {
                let value = source[key];
                if(valueTypes.includes(getObjProType(value))){
                    Vue[vuePropertyKey](key, value);
                    _console.log('%c[globalSettingCommon] %c===>%c %s', "color: #409EFF;", "color: #f6b05f;" , "color: red;", key);
                }
            });
        }

        if(filters){ //内置过滤器
            if(getObjProType(filters) !== '[object object]'){
                _console.warn('全局过滤器配置异常，参数类型需为object');
            }else{
                commonHandler('filter', filters, ['[object function]']);
            }
        }

        if(directives){ //内置指令
            if(getObjProType(directives) !== '[object object]'){
                _console.warn('全局指令配置异常，参数类型需为object');
            }else{
                commonHandler('directive', directives, ['[object object]', '[object function]']);
            }
        }

        if(methods){ //内置方法
            if(getObjProType(methods) !== '[object object]'){
                _console.warn('全局方法配置异常，参数类型需为object');
            }else{
                Object.keys(methods).forEach(methodName => {
                    Vue.prototype[methodName] = methods[methodName];
                    _console.log('%c[globalMethod] %c===>%c %s', "color: #409EFF;", "color: #f6b05f;" , "color: red;", methodName);
                });
            }
        }
    },

    //初始化自己封装的http
    initHttp: (context) => {
        if(!context)
            throw new Error('扫描api路径时，未获取到上下文！');

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

        store.commit('SAVE_MENU', {
            type: 'permission',
            menus: routes.permissionRouterMap
        });

        bindHookFunc(router, store);

        return router;
    },

    //初始化状态树
    initStore (){
        Vue.use(Vuex);

        return new Vuex.Store({
            modules: {
                user,
                menu,
                button
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
            throw new Error('初始化异常，传入的实例为空！');

        instance = instance.default || instance;

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
function EasyVue(Root) {
    Core.initExtendMethods();

    Core.initExtendFilter();

    const returnInstance = {
        //版本号
        version: packageJson.version,

        customComponentsContext: undefined,

        __logoInit: false,

        __iconInit: false,

        log (logLevel = EasyVue.LOG_LEVEL){
            this.__logoInit = true;
            //初始化日志打印
            Core.initLog(logLevel);
            return this;
        },

        //设置路由
        setRouters (routers){
            this.routers = routers || [];
            return this;
        },

        //设置路由拦截器
        setRouterIntercept (intercept){
            registryRouterBeforeJumpFunc(intercept);
            return this;
        },

        //设置系统权限处理拦截器
        setSystemPermissionFunc (intercept){
            registrySystemPermissionFunc(intercept);
            return this;
        },

        //设置获取token的方法
        setGetTokenFunc (func){
            setTokenFunc(func);
            return this;
        },

        //设置接口
        setRestApi (api){
            Core.initHttp(api);
            return this;
        },

        //设置http代理
        setHttpProxy (proxy){
            window.console.groupCollapsed('ezv-console-mockApi');
            ajaxProxy(proxy);
            window.console.groupEnd();
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

        //注册组件
        registryComponents (componentsContext){
            this.customComponentsContext = componentsContext;
            return this;
        },

        //全局配置 过滤器、方法、指令
        globalSetting (params){
            window.console.groupCollapsed('eav-console-globalSetting');
            Core.globalSetting(params);
            window.console.groupEnd();
            return this;
        },

        //运行
        run (){
            //注入内置组件
            window.console.groupCollapsed('eav-console-evAutoWired');

            require('./common/component')(Vue, this.customComponentsContext);

            window.console.groupEnd();

            window.__easyVueInstance__ = Core.init(this.routers, Root);
            window.__evRoot__ = this;

            return this;
        },

        //获取实例
        getInstance (){
            return window.__easyVueInstance__;
        }
    };

    return beforeReturnInstance(returnInstance);
}

/**
 * 方法拦截处理，用于自动初始化log
 * @param returnInstance 实例
 */
function beforeReturnInstance(returnInstance) {
    Object.getOwnPropertyNames(returnInstance).forEach(function (property) {
        let value = returnInstance[property];

        if(getObjProType(value) === '[object function]'){
            returnInstance[property] = function instanceFuncProxy () {
                //执行日志初始化
                if(!returnInstance.__logoInit && value.name !== 'log'){
                    returnInstance.log(EasyVue.LOG_LEVEL.ALL);
                }
                return value.apply(returnInstance, arguments);
            };
        }
    });

    return returnInstance;
}

/**
 * 获取对象的prototype
 * @param obj
 * @return {*}
 */
function getObjProType(obj) {
    return obj ? Object.prototype.toString.call(obj).toLowerCase() : undefined;
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