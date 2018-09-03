/**
 * 使用此入口文件，则代表使用原生封装
 * Created by litao on 2018/9/3.
 */
import Vue from 'vue';
import original from './merge/index';
import EasyVue from './index';

function packEasyVue(options) {
    new original(Vue, options.extendInfo);
    return new EasyVue(options);
}

packEasyVue.LOG_LEVEL = EasyVue.LOG_LEVEL;

export default packEasyVue;