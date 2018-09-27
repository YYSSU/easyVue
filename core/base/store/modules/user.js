/**
 * Created by litao on 2018/8/10.
 */
export default {
    state: {
        userInfo: {}
    },

    mutations: {
        SAVE_USER: (state, userInfo) => {
            state.userInfo = userInfo || {};
        },

        CLEAR_USER: (state) => {
            state.userInfo = {};
        }
    }
};