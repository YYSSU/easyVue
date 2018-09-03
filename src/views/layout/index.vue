<template>
    <div class="ev-layout-container">
        <ev-head></ev-head>

        <div class="ev-layout-content">
            <keep-alive :include="[]">
                <router-view></router-view>
            </keep-alive>
        </div>
    </div>
</template>

<script>
    let layoutConfig = {
        name: 'layout',

        components: {
            'ev-head': require('./EvHead.vue').default
        }
    };

    export default layoutConfig;
</script>

<style lang="scss">
    .ev-layout-container{
        width: 100%;
        height: 100%;
        & .ev-layout-content{
            height: calc(100% - 130px);
            width: calc(100% - 40px);
            background-color: #ffffff;
            margin-top: 45px;
            padding: 10px 20px 10px 20px;
        }
    }
</style>