/**
 * Created by litao on 2018/8/10.
 */

const menuType = ['constant', 'permission', 'responseMenus', 'successMenus'];

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
        SAVE_MENU: (state, { type, router, menus }) => {
            if(!menuType.includes(type))
                throw new Error(`菜单存储错误，请传入正确类型[${Object.keys(state.menuInfo).join(',')}]`);

            if(type === 'successMenus'){
                if(!router)
                    throw new Error('存储权限菜单时，请传入router实例');

                if(!router.addRoutes || Object.prototype.toString.call(router.addRoutes).toLowerCase() !== '[object function]')
                    throw new Error('存储权限菜单时，传入的router实例非法');

                router.addRoutes(menus || []);
            }

            state.menuInfo[type] = menus || [];
        },

        CLEAR_MENU: (state) => {
            let permission = state.menuInfo.permission || [];
            state.menuInfo = { permission };
        }
    }
};