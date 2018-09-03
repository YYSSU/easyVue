/**
 * Created by litao on 2018/8/20.
 */
const _import = require('core/base/router/_import_' + process.env.NODE_ENV);

export default (toObj, jump) => {
    _console.log(`routerIntercept: `, toObj);
    return true;
}

const routes = {
    //不需要权限过滤的路由列表
    constantRouterMap: [
        {
            name: 'login',
            path: '/login',
            component: _import('layout/EvLogin')
        },
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
            component: _import('layout/index'),
            meta: { title: '根菜单', permissionCode: 'root' },
            redirect: getRedirectPath,
            children: [
                {
                    name: 'index',
                    path: 'index',
                    component: _import('index'),
                    meta: { title: '首页', permissionCode: 'index' }
                },
                {
                    name: 'index1',
                    path: 'index1',
                    component: _import('index1'),
                    meta: { title: '首页', permissionCode: 'index' }
                }
            ]
        },
        {
            name: '404',
            path: '*',
            component: _import('error/404'),
            meta: { title: '页面不存在', permissionCode: '*' }
        }
    ]
};

function getRedirectPath(to) {
    let instance = routes.permissionRouterMap.filter(item => item.path === to.path)[0];
    if(instance && instance.children && instance.children.length > 0){
        return instance.path + instance.children[0].path;
    }
}

export {
    routes
}