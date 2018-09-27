/**
 * Created by litao on 2018/8/20.
 */
const _import = require('core/base/router/_import_' + process.env.NODE_ENV);

//路由跳转之前的拦截
export default (toObj, jump) => {
    _console.log(`routerIntercept: `, toObj);
    return true;
}

const routes = {
    //不需要权限过滤的路由列表
    constantRouterMap: [
        {
            name: '401',
            path: '/401',
            component: _import('error/401')
        }
    ],

    //需要权限过滤的路由列表
    permissionRouterMap: [
        {
            name: '/',
            path: '/',
            meta: { title: '根路径', permissionCode: '*' },
            component: _import('root'),
            redirect: 'index',
            children: [
                {
                    name: 'index',
                    path: '/index',
                    component: _import('index'),
                    meta: { title: 'ezv测试页面', permissionCode: 'index' }
                },
                {
                    name: 'index1',
                    path: '/index1',
                    component: _import('index1'),
                    meta: { title: 'ezv测试页面1', permissionCode: 'index1' }
                },
            ]
        },
        {
            name: '404',
            path: '*',
            component: _import('error/404'),
            meta: { title: '页面不存在' }
        }
    ]
};

export {
    routes
}