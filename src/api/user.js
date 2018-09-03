/**
 * Created by litao on 2018/8/10.
 */

import request from 'core/base/ajax';

const isJson = true;

/**
 * 获取当前登录用户
 * @param data
 */
export function getCurrentUser(data) {
    return request({
        url: '/sysUser/info',
        method: 'get'
    })
}