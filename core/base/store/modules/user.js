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
    },

    actions: {
        async loadUserInfo ({ commit }){
            const http = this._vm.$http;
            if(!http)
                throw '未获取到$http对象函数，请检查初始化时，是否启用[.restApi()]配置！';

            const response = await http('user', 'getCurrentUser');
            const userInfo = response.data || {};
            commit('SAVE_USER', userInfo);
            return userInfo;
        }
    }
};