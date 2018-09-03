/**
 * 使用此入口文件，则代表使用ev对象封装
 * Created by litao on 2018/8/29.
 */

import evInit from './merge/extend';
import EasyVue from './index';

//初始化easyVue包装对象
evInit();

function packEasyVue(options) {
    evInit.initGlobalExtends(options.extendInfo);
    return new EasyVue(options);
}

packEasyVue.LOG_LEVEL = EasyVue.LOG_LEVEL;

export default packEasyVue;