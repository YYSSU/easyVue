/**
 * 此文件为全局指令，例：redColor 实例内部调用时，直接 v-redColor 即可
 * Created by litao on 2018/9/20.
 */

export default {
    redColor: {
        componentUpdated (el, binding, vnode, oldVnode){
            el.style.color = 'red';
        }
    }
};