<template>
    <div class="ev-app-container">
        <!-- iconfont -->
        <ev-importFile href="//at.alicdn.com/t/font_827121_q3cfy2fwyf.css" type="css"></ev-importFile>
        <ev-importFile href="//at.alicdn.com/t/font_827121_q3cfy2fwyf.js" type="js"></ev-importFile>

        <ev-importFile href="//at.alicdn.com/t/font_853002_vhb0km9l9jd.css" type="css"></ev-importFile>
        <ev-importFile href="//at.alicdn.com/t/font_853002_vhb0km9l9jd.js" type="js"></ev-importFile>

        <router-view></router-view>
    </div>
</template>

<script>
    export default{
        name: 'App'
    }
</script>