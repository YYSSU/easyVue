/**
 * Created by litao on 2018/8/9.
 */
'use strict';
import EasyVue from 'evAll';
// import EasyVue from 'evOriginal';
// import EasyVue from 'evPacking';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import * as httpProxy from './http-proxy';
import routerIntercept, { routes } from './router';
import extendInfo from './extend';

const restApi = require.context('@/api', true, /\.js/);
const routerWhiteList = ['/401', '/404'];

/**
 * TODO 关于log的选项
 * EasyVue.LOG_LEVEL.CLOSE 为关闭打印
 * EasyVue.LOG_LEVEL.ALL 全部打印 默认次选项
 * EasyVue.LOG_LEVEL.INFO 打印此级别包括下面的
 * EasyVue.LOG_LEVEL.WARN 打印此级别包括下面的
 * EasyVue.LOG_LEVEL.ERROR 打印此级别
 */

const app = new EasyVue({ App, routes, extendInfo, logLevel: EasyVue.LOG_LEVEL.ALL })
    .setRouterIntercept(routerIntercept) //路由跳转拦截
    .setHttpProxy(httpProxy) //http代理
    .setRestApi(restApi) //接口
    .addRouterWhiteList(routerWhiteList) //添加路由白名单
    .install(ElementUI) //注册elementUI，如果还有其他需要注册的，可以继续往下 .install(other)
    .run() //运行
;

console.log(`初始化完成：`, app.getInstance());