/**
 * Created by litao on 2018/9/1.
 */

import Vue from 'vue';

import baseMixin from './base';
import listMixin from './list';
import formMixin from './form';

//扩展设置module
Object.defineProperty(Object.prototype, 'module' ,{
    value: function setCurrentExtendModule() {
        for(let i=0; i<arguments.length; i++){
            let $module = arguments[i];

            if(!$module) continue;

            if(i > 0) {
                this._extend.push($module);
                continue;
            }

            if(this._extend){
                let objType = Object.prototype.toString.call(this._extend).toLowerCase();
                if(objType === '[object string]'){
                    this._extend = [$module];
                }else if(objType === '[object array]'){
                    this._extend.push($module);
                }
            }else{
                this._extend = [$module];
            }
        }

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
    static initOtherExtends (extendInfo){
        this.$otherExtends = extendInfo || {};
    }
    
    //全部可继承实例
    static get allExtends (){
        return Object.assign({}, this.$otherExtends || {}, {
            base: mergeBase.baseMixin,
            list: mergeBase.listMixin,
            form: mergeBase.formMixin
        });
    }

    constructor (){
        this.$systemModules = ['list', 'form'];
        this.$lifecycle = ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'activated', 'deactivated', 'beforeDestroy', 'destroyed'];
    }

    //获取合并函数对象
    get mergeObj (){
        return Vue.config.optionMergeStrategies;
    }

    //判断是否为array类型
    objectIsArray (obj){
        return obj && Object.prototype.toString.call(obj).toLowerCase() === '[object array]';
    }

    getExtendInfo (module){
        return mergeBase.allExtends[module];
    }
};