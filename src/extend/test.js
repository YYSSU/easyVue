/**
 * Created by litao on 2018/8/30.
 */
export default {
    $module: 'baseTest', //继承自何处

    data (){ //合并的数据
        return {
            extendInfo: 'this is extendInfo test!'
        }
    },

    methods: { //合并的方法
        extendTest (){
            console.log('我是测试的扩展方法，extendTest');
        },

        listms (){
            console.log('this is test');
        }
    },

    computed: { //合并的计算属性

    },

    watch: { //合并的监听

    }
}