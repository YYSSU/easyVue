/**
 * 此文件为系统权限管理拦截，router改变时，如果未获取到全局状态中的用户信息时，则会执行此拦截
 *
 * 保存用户信息  commit('SAVE_USER', userInfo)
 *
 * 保存服务器返回的菜单 commit('SAVE_MENU', { type: 'responseMenus', menus: menuInfo })
 *
 * tips: 执行此操作时，系统会默认执行 router.addRoutes(successMenus) 无需再次手动执行
 * 保存拥有访问权限的菜单 commit('SAVE_MENU', { type: 'successMenus', menus: successMenus })
 *
 * 保存服务器返回的按钮 commit('SAVE_PERMISSION_BUTTONS', buttonInfo)
 *
 * Created by litao on 2018/9/21.
 */

export default (router, store, to, next, vm) => {
    let { commit, getters } = store;

    //保存当前用户
    commit('SAVE_USER', {
        name: '我是测试用户',
        id: -1
    });

    //保存菜单
    commit('SAVE_MENU', {
        type: 'responseMenus',
        menus: []
    });

    //保存按钮权限
    commit('SAVE_PERMISSION_BUTTONS', []);

    //获取到需要权限过滤的菜单
    let permissionMenus = getters.menuInfo.permission || [];

    let permissionMenuCodes = ['index', 'index1'];

    //保存有权限的菜单
    commit('SAVE_MENU', {
        type: 'successMenus',
        router,
        menus: permissionMenuHandler(permissionMenus, permissionMenuCodes)
    });

    //处理完毕后，记得执行回调！！！
    //处理完毕后，记得执行回调！！！
    //处理完毕后，记得执行回调！！！
    next(to.path);
}

function permissionMenuHandler(permissionMenus, permissionMenuCodes) {
    return permissionMenus.filter(menu => {
        if(menu.meta && menu.meta.permissionCode && (menu.meta.permissionCode === '*' || permissionMenuCodes.includes(menu.meta.permissionCode))){
            if(menu.children && menu.children.length > 0){
                menu.children = permissionMenuHandler(menu.children, permissionMenuCodes) || [];
            }
            return menu;
        }
    });
}