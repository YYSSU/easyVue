<template>
    <i :class="`iconfont ${icon}`" :style="size ? `font-size: ${size.endsWith('px') ? size : size + 'px'}` : ''"></i>
</template>

<script>
    let evIconFontConfig = {
        name: 'evIconFont',

        componentName: 'evIconFont',

        registryName: 'ev-iconFont',

        props: {
            icon: {
                required: true,
                type: String
            },

            size: String
        }
    };

    export default evIconFontConfig;
</script>