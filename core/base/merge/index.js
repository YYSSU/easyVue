/**
 * 此文件为核心文件，后面的数据、方法、监听等封装，都是在此处完成合并的。
 * Created by litao on 2018/8/21.
 */

import mergeBase from './merge';

class protoMerge extends mergeBase{

    constructor (Vue, extendInfo){
        super();
        const self = this;

        mergeBase.initGlobalExtends(extendInfo);

        const mixin = {
            beforeCreate (){
                self.initInstance(this);

                self.mixinHandler();
            }
        };
        Vue.mixin(mixin);
    }

    //获取基础的mixin
    get mixinInfo (){
        let mixin = this.$systemModules.includes(this.moduleInfo) ? this.moduleInfo === 'list' ? mergeBase.listMixin : mergeBase.formMixin : mergeBase.globalExtends[this.moduleInfo];
        if(mixin && Object.keys(mixin).length > 0){
            return this.deepObjectMerge(mergeBase.baseMixin, mixin);
        }
    }

    mixinHandler (){
        if(!this.mixinInfo)
            return;

        //处理完继承关系的mixin
        const mixin = this.mixinExtendMerge(this.mixinInfo);

        //基础数据处理
        this.instanceDataMerge(mixin.data);

        //计算属性处理
        this.instancePropertyMerge('computed', mixin.computed);

        //方法处理
        this.instancePropertyMerge('methods', mixin.methods);

        //属性监听处理
        this.instancePropertyMerge('watch', mixin.watch);
    }
}

export default (Vue, extendInfo) => new protoMerge(Vue, extendInfo);