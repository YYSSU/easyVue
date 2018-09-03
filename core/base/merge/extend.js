/**
 * 此文件为核心文件，后面的数据、方法、监听等封装，都是在此处完成合并的。
 * Created by litao on 2018/8/29.
 */

import mergeBase from './merge';

//忽略转换的字段
const ignoreTransformFields = ['name', 'componentName', 'registryName', 'beforeCreate', 'create', 'beforeMount', 'mounted', 'beforeUpdate', 'update', 'beforeDestroy', 'destroyed', 'computed', 'watch', '$module'];

class packageMerge extends mergeBase {
    constructor (options){
        super();

        this.options = options;

        this._extend = this.deepObjectMerge({}, mergeBase.baseMixin);
    }

    list (){
        this._extend = this.deepObjectMerge(this._extend, mergeBase.listMixin);
        return this;
    }

    form (){
        this._extend = this.deepObjectMerge(this._extend, mergeBase.formMixin);
        return this;
    }

    build (){
        return this.transform2VueStructure();
    }

    transform2VueStructure() {
        let extend = this.dataPropertyInit();

        let transformResult = this.dataTransform(extend);

        this.bindingVueHook(transformResult);

        return extend;
    }

    //初始化字段
    dataPropertyInit (){
        let extend = this.deepObjectMerge({}, this._extend);
        extend.methods = extend.methods || {};
        extend.initData = extend.data || {};
        extend.computed = extend.computed || {};
        extend.watch = extend.watch || {};
        extend.$module = this.$module || extend.$module;
        return extend;
    }

    //数据转换
    dataTransform (extend){
        Object.keys(this.options).forEach(key => {
            let value = this.options[key];

            if(ignoreTransformFields.includes(key)){
                extend[key] = value;
                return;
            }

            if(this.getObjType(value) === '[object function]'){ //methods
                if(key === 'data'){
                    extend.initData = Object.assign({}, extend.initData, value());
                }else{
                    extend.methods[key] = value;
                }
            }else{
                extend.initData[key] = value;
            }
        });

        delete extend.data;

        return extend;
    }

    //绑定vue生命周期钩子
    bindingVueHook (vueOptions){
        const _self = this;

        vueOptions.mixins = [
            {
                beforeCreate (){
                    _self.initInstance(this);
                    if(_self.moduleInfo && mergeBase.globalExtends && Object.keys(mergeBase.globalExtends).length > 0){
                        Object.keys(mergeBase.globalExtends).filter(extendKey => _self.moduleInfo && _self.moduleInfo === extendKey).forEach(extendKey => {

                            let extendInfo = _self.mixinExtendMerge(mergeBase.globalExtends[extendKey]);

                            //数据处理
                            _self.instanceDataMerge([extendInfo.data, this.$options.initData]);

                            //方法处理
                            _self.instancePropertyMerge('methods', extendInfo.methods);

                            //计算属性处理
                            _self.instancePropertyMerge('computed', extendInfo.computed);

                            //属性监听处理
                            _self.instancePropertyMerge('watch', extendInfo.watch);
                        });
                    }
                }
            }
        ];
    }
}

export default function evBase() {
    window.ev = (options) => new packageMerge(options)
};

evBase.initGlobalExtends = function (extendInfo) {
    mergeBase.initGlobalExtends(extendInfo)
};
