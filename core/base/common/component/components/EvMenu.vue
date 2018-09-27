<template>
    <ul :class="`ev-${type}-menu-container`" @click="menuClickHandler($event)">
        <li v-for="(menu, index) in menus" :ref="`evMenuLi-${menu[props.code]}`" :track-by="index" :key="index" :class="{'ev-menu-item': true, 'active': isActive(menu)}">
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
                currentActiveCode: ''
            }
        },

        computed: {
            activeBorderX (){
                let itemInstances = this.$getRef(`evMenuLi-${this.currentActiveCode}`);
                if(itemInstances && itemInstances.length > 0){
                    return itemInstances[0].offsetLeft;
                }
            }
        },

        methods: {
            isActive (menu){
                const menuCode = menu[this.props.code];
                let isActive = false;

                if(this.activeCode){
                    isActive = this.activeCode === menuCode;
                }else if(this.currentActiveCode){
                    isActive = this.currentActiveCode === menuCode;
                }else{
                    isActive = this.menus[0][this.props.code] === menuCode;
                }

                if(isActive){
                    this.currentActiveCode = menuCode;
                }

                return isActive;
            },

            menuClickHandler (event){
                let menuItemDom = event.target;

                try {
                    let itemCode = menuItemDom.getAttribute('ev-menu-item-code');
                    this.currentActiveCode = itemCode;
                    this.$emit('update:activeCode', itemCode);
                    this.$emit('ev-menuItemClick', itemCode);
                } catch (e) {
                    this.$error('页面跳转异常');
                    _console.error(e);
                }
            }
        },

        watch: {
            '$route':{
                immediate: true,
                handler (v, o){
                    let filterResult = v.matched.filter(menu => menu.meta && menu.meta.menu);
                    if(filterResult && filterResult.length > 0){
                        this.$nextTick(function () {
                            this.currentActiveCode = filterResult[filterResult.length - 1].name;
                        });
                    }
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
        margin: 0 0 0 35px;
        position: relative;
        & .ev-menu-item{
            float: left;
            font-weight: 500;
            font-size: 16px;
            color: #ffffff;
            /*padding: 0 31px;*/
            cursor: pointer;
            & em{
                padding: 0 31px;
                height: 65px;
                display: block;
                font-style: normal;
                position: relative;
                z-index: 1;
                letter-spacing: 2.5px;
            }
            &:hover{
                background-color: #91582a5c;
            }
        }
        & .menu-active-bottom-border{
            transition: transform .3s cubic-bezier(.645,.045,.355,1);
            background-color: #91582a;
            cursor: pointer;
            width: 99px;
            height: 65px;
            position: absolute;
            top: 0;
            left: 0;
            border-bottom: 2px solid #ffffff;
        }
    }

    /**页内顶部菜单样式*/
    .ev-in-page-top-menu-container{
        list-style: none;
        padding: 0;
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