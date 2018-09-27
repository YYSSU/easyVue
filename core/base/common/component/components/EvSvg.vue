<template>
    <svg :class="svgClass">
        <use :xlink:href="'#' + iconName"></use>
    </svg>
</template>

<script>
    let evSvgConfig = {
        name: 'evSvg',

        componentName: 'evSvg',

        registryName: 'ev-svg',

        props: {
            className: String,

            iconName: {
                required: true,
                type: String
            }
        },

        computed: {
            svgClass (){
                return `ev-svg-class ${this.className ? this.className : ''}`;
            }
        }
    };

    export default evSvgConfig;
</script>

<style lang="scss" scoped>
    .ev-svg-class{
        width: 2em;
        height: 2em;
        vertical-align: -0.15em;
        fill: currentColor;
        overflow: hidden;
    }
</style>