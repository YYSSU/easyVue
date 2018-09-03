/**
 * Created by litao on 2018/8/21.
 */

import request from 'core/base/ajax';

const isJson = true;

/**
 * 获取当前登录用户的菜单列表
 * @param data
 */
export function getCurrentMenu(data) {
    return request({
        url: '/sysMenu/list',
        method: 'get'
    })
}