/**
 * 此文件为需要挂到vue实例上的全局方法，例：$testGlobalMethod 实例内部调用时，直接 this.$testGlobalMethod() 即可
 * Created by litao on 2018/9/26.
 */
export default {
    $testGlobalMethod (){
        this.$info('this is testGlobalMethod');
    }
}