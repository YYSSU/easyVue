/**
 * 引入此文件，则同时使用ev对象封装&原生封装
 * Created by litao on 2018/9/3.
 */
import Vue from 'vue';
import evInit from './merge/extend';
import EasyVue from './index';
import original from './merge/index';

//初始化easyVue包装对象
evInit();

function all(options) {
    evInit.initGlobalExtends(options.extendInfo);
    new original(Vue, options.extendInfo);
    return new EasyVue(options);
}

all.LOG_LEVEL = EasyVue.LOG_LEVEL;

export default all;