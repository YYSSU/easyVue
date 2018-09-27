/**
 * Created by litao on 2018/8/9.
 */
'use strict';

import EZV from 'ez-vue'; // import frame
import '@/style/index.scss' // import frame style
import App from './App.vue'; // import root file
import * as httpProxy from './http-proxy'; // import http proxy
import routerIntercept, { routes } from './router'; // import router setting
import systemPermissionFunc from './router/permission-intercept'; // import permission intercept
import extendInfo from './extend'; // import extend
import globalSettingConfig from './global-setting'; // import global-setting config

const restApi = require.context('@/api', true, /\.js$/); // import rest API
const components = require.context('@/components', true, /\.vue$/); // import extend components
const routerWhiteList = ['/401', '/404']; // whiteList

//以下扩展配置，可根据个人需要进行开启

const app = new EZV(App)
    .log(EZV.LOG_LEVEL.ALL) //全部日志， 默认全部
    .setExtends(extendInfo) //初始化其他继承
    .setRouters(routes) //设置路由
    .setRouterIntercept(routerIntercept) //路由跳转拦截
    .setSystemPermissionFunc(systemPermissionFunc) //系统权限处理拦截
    .setGetTokenFunc(function () { //获取请求要携带的token 此处this默认指向当前vue根实例
        return {
            tokenKey: 'ALPHA-TOKEN',
            tokenValue: this.$cookie.get('ALPHA-TOKEN') || '' //在登录成功后，调用this.$cookie.set('ALPHA-TOKEN', '我是token')，即可在此处获取
        }
    })
    .setHttpProxy(httpProxy) //http代理
    .setRestApi(restApi) //接口
    .addRouterWhiteList(routerWhiteList) //添加路由白名单
    // .install(ElementUI) //注册elementUI，如果还有其他需要注册的，可以继续往下 .install(other)
    .registryComponents(components) //注册组件
    .globalSetting(globalSettingConfig) //全局内置属性
    .run() //运行
;

console.log(`初始化完成：`, app.getInstance());