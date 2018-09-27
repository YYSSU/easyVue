/**
 * Created by litao on 2018/8/10.
 */

export default {
    state: {
        permissionButtons: [] //需要权限的按钮
    },

    mutations: {
        SAVE_PERMISSION_BUTTONS: (state, buttons) => {
            state.permissionButtons = buttons || [];
        },

        CLEAR_PERMISSION_BUTTONS: (state) => {
            state.permissionButtons = [];
        }
    }
};