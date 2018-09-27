<template>
    <div>
        <p>
            <em>菜单：</em>
            <span style="cursor: pointer;" @click="$jump('/index')">listDemo</span>
            <span style="cursor: pointer;" @click="$jump('/index1')">formDemo</span>
        </p>

        <router-view></router-view>
    </div>
</template>