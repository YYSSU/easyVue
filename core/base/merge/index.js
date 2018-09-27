/**
 * 此文件为核心文件，后面的数据、方法、监听等封装，都是在此处完成合并的。
 * Created by litao on 2018/8/29.
 */

import mergeBase from './merge';

window.ezv = (options) => new wrapMerge(options);

class wrapMerge extends mergeBase {
    constructor (options){
        super();

        this.options = options;

        this._extend = [];
    }

    list (){
        this._extend.push('list');
        return this;
    }

    form (){
        this._extend.push('form');
        return this;
    }

    build (){
        let _self = this;
        this.options.mixins = this.options.mixins || [];
        this.options.mixins.push(mergeBase.baseMixin);
        this.options.mixins.push({
            beforeCreate (){
                _self._extend.forEach(mixinKey => {
                    let mixin = _self.getExtendInfo(mixinKey);
                    mixin && Object.keys(mixin).length > 0 && _self.mixinMerge(mixin, this);
                });
            }
        });
        return this.options;
    }

    mixinMerge (mixin, vm){
        mixin && Object.keys(mixin).forEach(key => {
            if(['$module'].includes(key)){
                let parentMixin = this.getExtendInfo(mixin[key]);
                if(parentMixin && Object.keys(parentMixin).length > 0){
                    this.mixinMerge(parentMixin, vm);
                }
                return;
            }

            let mergeFunc = this.mergeObj[key];
            if(mergeFunc && typeof mergeFunc === 'function'){
                let mixinObj = mixin[key];
                if(['props'].concat(this.$lifecycle).includes(key)){
                    if(!this.objectIsArray(mixinObj)){
                        mixinObj = [mixinObj];
                    }
                }
                vm.$options[key] = mergeFunc(mixinObj, vm.$options[key], vm, key);
            }
        });
    }
}

export default function (extendInfo){
    mergeBase.initOtherExtends(extendInfo)
};