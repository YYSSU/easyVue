/**
 * 此文件为http请求的文件，文件建议按照模块分割
 * Created by litao on 2018/9/27.
 */

import request from 'core/base/ajax';

const isJson = true;

export function testGetInfo(data) {
    return request({
        url: '/test/testGetInfo', //请求地址
        method: 'post', //请求方式
        data, //请求参数
        isJson //添加此参数则为json提交， 不添加则为form表单提交
    })
}