<template>
    <div class="ev-app-container">
        <!-- iconfont -->
        <ev-importFile href="//at.alicdn.com/t/font_827121_q3cfy2fwyf.css" type="css"></ev-importFile>
        <ev-importFile href="//at.alicdn.com/t/font_827121_q3cfy2fwyf.js" type="js"></ev-importFile>

        <ev-importFile href="//at.alicdn.com/t/font_853002_wa5wxrqov1.css" type="css"></ev-importFile>
        <ev-importFile href="//at.alicdn.com/t/font_853002_wa5wxrqov1.js" type="js"></ev-importFile>

        <router-view></router-view>
    </div>
</template>

<script>
    export default{
        name: 'App'
    }
</script>