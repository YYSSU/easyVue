/**
 * Created by litao on 2018/8/9.
 */
'use strict';
module.exports = (Vue) => {
    let components = require.context('./', true, /\.vue/);
    components.keys().forEach(item => {
        let component = components(item);
        if(component && component.default){
            let componentName = component.default.registryName || component.default.componentName;
            if(componentName){
                Vue.component(componentName, component.default);
                _console.log('%c[evAutoWired] %c===>%c %s', "color: #409EFF;", "color: #f6b05f;" , "color: red;", componentName);
            }
        }
    });
};