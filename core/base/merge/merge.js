/**
 * Created by litao on 2018/9/1.
 */

import baseMixin from './base';
import listMixin from './list';
import formMixin from './form';

//扩展设置module
Object.defineProperty(Object.prototype, 'module' ,{
    value: function setCurrentExtendModule() {
        const $module = arguments[0];

        if(!$module)
            throw '调用内置module方法时，未传入要继承的module属性';

        this.$module = $module;

        return this;
    }
});

export default class mergeBase {
    static get baseMixin (){
        return baseMixin;
    }

    static get listMixin (){
        return listMixin;
    }

    static get formMixin (){
        return formMixin;
    }

    //设置继承
    static initGlobalExtends (extendInfo){
        this.$globalExtends = extendInfo || {};
    }

    static get globalExtends (){
        return this.$globalExtends || {};
    }

    constructor (){
        this.$systemModules = ['list', 'form'];
    }

    //设置vue实例
    initInstance (instance){
        this.$instance = instance;
    }

    //获取实例module
    get moduleInfo (){
        return this.$instance ? this.$instance.$options.$module || undefined : undefined;
    }

    //mixin继承关系处理
    mixinExtendMerge (mixinSource){
        let copyResult = this.deepObjectMerge({}, mixinSource);

        let $module = copyResult.$module;

        delete copyResult.$module;

        if(!$module) return copyResult;

        if(!Object.keys(mergeBase.globalExtends).concat(this.$systemModules).includes($module)){
            throw `[60009]未找到扩展属性[${$module}]中所继承的父类。`;
        }

        let mixin = this.$systemModules.includes($module) ? $module === 'list' ? listMixin : formMixin : mergeBase.globalExtends[$module];

        mixin = this.mixinExtendMerge(mixin);

        return this.deepObjectMerge(mixin, copyResult);
    }

    //合并实例数据
    instanceDataMerge (value){
        let data = this.$instance.$options.data;
        data = this.$instance._data = typeof data === 'function'
            ? data.call(this.$instance, this.$instance)
            : data || {};
        if(value){
            if(this.getObjType(value) === '[object array]'){
                value.forEach(v => {
                    data = this.deepObjectMerge(this.getObjType(v) === '[object function]' ? v() : v || {}, data);
                })
            }else{
                data = this.deepObjectMerge(this.getObjType(value) === '[object function]' ? value() : value || {}, data);
            }
        }

        this.$instance.$options.data = this.$instance.$options._data = JSON.parse(JSON.stringify(data));
    }

    //合并实例属性
    instancePropertyMerge (key, value){
        this.$instance.$options[key] = this.deepObjectMerge(value || {}, this.$instance.$options[key] || {});
    }

    //深度合并
    deepObjectMerge (FirstOBJ, SecondOBJ){ // 深度合并对象
        for (let key in SecondOBJ) {
            FirstOBJ[key] = FirstOBJ[key] && this.getObjType(FirstOBJ[key]) === "[object object]" ?
                this.deepObjectMerge(FirstOBJ[key], SecondOBJ[key]) : FirstOBJ[key] = SecondOBJ[key];
        }
        return FirstOBJ;
    }

    //获取obj类型
    getObjType (obj) {
        return obj ? Object.prototype.toString.call(obj).toLowerCase() : undefined;
    }
};