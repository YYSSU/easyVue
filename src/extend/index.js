/**
 * 自定义混入继承的格式为
 * {
 *      $module: //如果继承自其他混入对象，则为对应对象的key值  例如  $module: 'list' 或者 $module: 'baseTest'
 *      data: //属性 也可表示为 data(){return{aaa:111}}
 *      methods: //方法
 *      computed: //计算属性
 *      watch: //监听属性
 * }
 * Created by litao on 2018/8/22.
 */
import baseTest from './baseTest';
import test from './test';

export default {
    baseTest,
    test
}