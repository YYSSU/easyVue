<template>
    <div class="ev-app-container">
        <!-- iconfont -->
        <ev-importFile href="//at.alicdn.com/t/font_785396_v540buj5lx.css" type="css"></ev-importFile>
        <ev-importFile href="//at.alicdn.com/t/font_785396_v540buj5lx.js" type="js"></ev-importFile>

        <router-view></router-view>
    </div>
</template>

<script>
    export default{
        name: 'App'
    }
</script>

<style lang="scss">
    html{
        height: 100%;
        min-width: 1366px;
        overflow-x: auto;
        & body{
            margin: 0;
            padding: 0;
            height: 100%;
            width: 100%;
            font-family: Microsoft YaHei!important;
            -webkit-font-smoothing: antialiased;
            text-rendering: optimizeLegibility;
            & .ev-app-container{
                width: 100%;
                height: 100%;
            }
        }
    }
</style>