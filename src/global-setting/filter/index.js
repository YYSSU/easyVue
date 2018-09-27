/**
 * 此文件为全局过滤器，例：testFilter 实例内部调用时，直接 {{form.dateTime | testFilter}} 即可
 * Created by litao on 2018/9/26.
 */

export default {
    testFilter (){
        return 'this is test filter';
    }
}