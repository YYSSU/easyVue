/**
 * Created by litao on 2018/8/10.
 */
export default {
    state: {
        menuInfo: {
            constant: [], //不需要权限过滤的
            permission: [], //需要权限过滤的
            responseMenus: [], //服务器返回的菜单
            successMenus: [], //权限匹配成功的菜单
        }
    },

    mutations: {
        SAVE_MENU: (state, { type, menus }) => {
            if(!Object.keys(state.menuInfo).includes(type))
                throw `菜单存储错误，请传入正确类型[${Object.keys(state.menuInfo).join(',')}]`;

            state.menuInfo[type] = menus || [];
        },

        CLEAR_MENU: (state) => {
            state.menuInfo = {};
        }
    },

    actions: {
        saveConstantMenu ({ commit }, menus){
            commit('SAVE_MENU', {
                type: 'constant',
                menus
            });
        },

        savePermissionMenu ({ commit }, menus){
            commit('SAVE_MENU', {
                type: 'permission',
                menus
            });
        },

        async loadMenuInfo ({ commit }){
            let permissionMenus = this.getters.menuInfo.responseMenus;

            if(permissionMenus && permissionMenus.length > 0)
                return permissionMenus;

            const http = this._vm.$http;
            if(!http)
                throw '未获取到$http对象函数，请检查初始化时，是否启用[.restApi()]配置！';

            const response = await http('menu', 'getCurrentMenu');

            const responseMenus = response.data || [];

            commit('SAVE_MENU', {
                type: 'responseMenus',
                menus: responseMenus
            });

            return responseMenus;
        },

        async mergeMenus ({ commit }, { menus, router}){
            let permissionMenus = this.getters.menuInfo.permission;

            if(menus && menus.length > 0){
                const result = permissionMenuFilterFunc.call(menus, permissionMenus);

                _console.log(`当前用户有权限的菜单为：`, result);

                router.addRoutes(result);

                commit('SAVE_MENU', {
                    type: 'successMenus',
                    menus: result
                });

                return result;
            }else{
                return [];
            }
        }
    }
};

function permissionMenuFilterFunc(permissionMenus) {
    return permissionMenus.filter(item => {
        if(item.meta.permissionCode === '*'){
            childrenHandler.call(this, item);

            return true;
        }else{
            const returnMenu = this.filter(m => item.meta && item.meta.permissionCode === m.code)[0];

            item.meta.title = returnMenu.label;
            item.meta.path = returnMenu.path;

            const isPermission = returnMenu && Object.keys(returnMenu).length > 0;

            if(isPermission){
                childrenHandler.call(this, item);
            }

            return isPermission;
        }
    });

    function childrenHandler(item) {
        if(!item.children || item.children.length === 0)
            return [];

        let children = permissionMenuFilterFunc.call(this, item.children);

        if(!children || children.length === 0){
            delete item.children;
            delete item.redirect;
        }else{
            item.children = children;
        }
    }
}