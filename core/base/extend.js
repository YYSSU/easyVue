/**
 * 使用此入口文件，则代表使用ev对象封装
 * Created by litao on 2018/8/29.
 */

import setExtends from './merge';
import EZV from './index';

function wrapEZV(Root) {
    let baseInstance = new EZV(Root);
    baseInstance.setExtends = function (extendInfo) {
        setExtends(extendInfo);
        return this;
    };
    return baseInstance;
}

wrapEZV.LOG_LEVEL = EZV.LOG_LEVEL;

export default wrapEZV;