<template>
    <div class="ev-system-info-container">
        <div class="ev-l-h-c-logo">
            <ev-iconFont icon="icon-kx0011193395easyiconnet" size="45px"></ev-iconFont>
        </div>
        <div class="ev-l-h-c-system_name">
            <span>easy-vue</span>
            <em>基于vue快速开发</em>
        </div>
    </div>
</template>

<script>
    let evSystemConfig = {
        name: 'evSystem'
    };

    export default evSystemConfig;
</script>

<style lang="scss">
    .ev-system-info-container{
        width: 275px;
        height: 75px;
        float: left;
        & .ev-l-h-c-logo{
            width: 65px;
            height: 100%;
            float: left;
            margin-left: 5px;
            text-align: center;
            line-height: 65px;
            cursor: pointer;
            color: #0175c1;
        }
        & .ev-l-h-c-system_name{
            line-height: 65px;
            font-weight: 300;
            float: left;
            & span{
                font-size: 25px;
                color: #0175c1;
            }
            & em{
                font-size: 12px;
            }
        }
    }
</style>