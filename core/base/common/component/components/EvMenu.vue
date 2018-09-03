<template>
    <ul :class="`ev-${type}-menu-container`" @click="menuClickHandler($event)">
        <li v-for="(menu, index) in menus" :track-by="index" :key="index" :class="{'ev-menu-item': true, 'active': isActive(menu)}">
            <em :ev-menu-item-code="menu[props.code]">{{menu[props.label]}}</em>
        </li>
        <div class="menu-active-bottom-border" :style="`transform: translateX(${activeBorderX}px);`"></div>
    </ul>
</template>

<script>

    const menuTypes = ['head', 'in-page-top'];

    let evMenuConfig = {
        name: 'evMenu',

        componentName: 'evMenu',

        registryName: 'ev-menu',

        props: {
            type: {
                type: String,
                default (){
                    return "head"
                },
                validator: function (val) {
                    if(!menuTypes.includes(val)){
                        _console.error(`菜单仅支持以下类型：[${menuTypes}]，不支持您设置的类型[${val}]`);
                    }
                    return true;
                }
            },

            menus: {
                required: true,
                type: Array
            },

            props: {
                type: Object,
                default (){
                    return {
                        code: 'code',
                        label: 'label'
                    }
                }
            },

            activeCode: String
        },

        data (){
            return {
                currentActiveCode: '',
                activeBorderX: 0
            }
        },

        methods: {
            isActive (menu){
                const menuCode = menu[this.props.code];
                if(this.currentActiveCode){
                    return this.currentActiveCode === menuCode;
                }else{
                    if(this.activeCode){
                        return this.activeCode === menuCode;
                    }else{
                        return this.menus[0][this.props.code] === menuCode;
                    }
                }
            },

            menuClickHandler (event){
                let menuItemDom = event.target;

                try {
                    let itemCode = menuItemDom.getAttribute('ev-menu-item-code');
                    this.currentActiveCode = itemCode;
                    this.$emit('update:activeCode', itemCode);
                    this.$emit('ev-menuItemClick', itemCode);

                    if(menuItemDom.tagName && menuItemDom.tagName.toLocaleLowerCase() === 'em'){
                        this.activeBorderX = menuItemDom.parentElement.offsetLeft - 10;
                    }
                } catch (e) {
                    this.$error('页面跳转异常');
                    _console.error(e);
                }
            }
        }
    };

    export default evMenuConfig;
</script>

<style lang="scss" scoped>
    /**框架头部菜单样式*/
    .ev-head-menu-container{
        float: left;
        height: 65px;
        line-height: 65px;
        list-style: none;
        padding: 0;
        margin: 0 0 0 25px;
        position: relative;
        & .ev-menu-item{
            float: left;
            font-weight: 500;
            font-size: 16px;
            margin: 0 10px;
            color: #a2a2a2;
            & em{
                cursor: pointer;
                padding: 2px 0;
                font-style: normal;
                &:hover{
                    color: #000 !important;
                }
            }
            &.active{
                & em{
                    font-weight: 500;
                    color: #f6b05f;
                }
            }
        }
        & .menu-active-bottom-border{
            transition: transform .3s cubic-bezier(.645,.045,.355,1);
            height: 2px;
            background-color: #f6b05f;
            width: 64px;
            position: absolute;
            bottom: 18px;
            left: 10px;
        }
    }

    /**页内顶部菜单样式*/
    .ev-in-page-top-menu-container{
        position: absolute;
        left: 0;
        list-style: none;
        /*margin: 130px 20px 0 20px;*/
        margin: 80px 20px 0 20px;
        padding: 0;
        width: calc(100% - 40px);
        height: 30px;
        border-bottom: 1px solid #ffce94;
        & .ev-menu-item{
            float: left;
            font-size: 14px;
            line-height: 29px;
            padding: 0 10px;
            font-weight: 400;
            border: 1px solid #ffce94;
            color: #ffce94;
            border-bottom-color: transparent !important;
            border-top-left-radius: 4px;
            border-top-right-radius: 4px;
            cursor: pointer;
            & em{
                font-style: normal;
            }
            &:not(:first-child){
                margin-left: 10px;
            }
            &.active{
                border-bottom-color: #ffffff !important;
                color: #f6b05f !important;
                border-left-color: #f6b05f !important;
                border-right-color: #f6b05f !important;
                border-top-color: #f6b05f !important;
            }
            &:hover{
                border-left-color: #f6b05f !important;
                border-right-color: #f6b05f !important;
                border-top-color: #f6b05f !important;
                color: #f6b05f !important;
            }
        }
    }
</style>