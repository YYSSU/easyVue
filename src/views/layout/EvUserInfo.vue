<template>
    <div class="ev-user-info-container">
        <div class="ev-user-info">
            <img :src="$store.getters.userInfo.headImg" alt="">
            <em>{{$store.getters.userInfo.name}}</em>
        </div>
        <ev-iconFont icon="icon-tuichu"></ev-iconFont>
    </div>
</template>

<script>
    let evUserInfoConfig = {
        name: 'evUserInfo'
    };

    export default evUserInfoConfig;
</script>

<style lang="scss" scoped>
    .ev-user-info-container{
        float: right;
        height: 65px;
        line-height: 65px;
        padding: 0 15px;
        /*border-left: 1px solid #e4e7ed;*/
        & i{
            cursor: pointer;
            &:hover{
                color: black;
            }
        }
        & .ev-user-info{
            float: left;
            margin-right: 20px;
            & img{
                width: 35px;
                height: 35px;
                margin: 15px 5px 0 0;
                float: left;
                border-left: 1px solid #e4e7ed;
                padding-left: 15px;
            }
            & em{
                float: left;
                font-style: normal;
                font-size: 14px;
                cursor: pointer;
                &:hover{
                    color: black;
                }
            }
        }
    }
</style>