<template>
    <div class="ev-layout-head-container">
        <ev-system></ev-system>

        <ev-menu :menus="headMenus" activeCode="base"></ev-menu>

        <ev-menu type="in-page-top" :menus="topMenus" :activeCode="pageTopMenuActiveCode" @ev-menuItemClick="menuItemClickFunc"></ev-menu>

        <ev-userInfo></ev-userInfo>
    </div>
</template>

<script>
    let evHeadConfig = {
        name: 'evHead',

        components: {
            'ev-system': require('./EvSystem.vue').default,
            'ev-userInfo': require('./EvUserInfo.vue').default
        },

        data (){
            return {
                headMenus: [
                    {label: '基本演示', code: 'base'},
                    {label: '其他页面', code: 'other'},
                ],
                topMenus: [
                    {label: '列表页面', code: 'index'},
                    {label: '表单页面', code: 'index1'}
                ],

                pageTopMenuActiveCode: this.$route.name || 'index'
            }
        },

        methods: {
            menuItemClickFunc (code){
                this.$jump({ name: code });
            }
        }
    };

    export default evHeadConfig;
</script>

<style lang="scss" scoped>
    .ev-layout-head-container{
        height: 64px;
        width: 100%;
        background-color: #f9f8f8;
        border-bottom: solid 1px #e6e6e6;
        color: #605e5e;
    }
</style>