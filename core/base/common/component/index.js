/**
 * Created by litao on 2018/8/9.
 */
'use strict';
module.exports = (Vue, customComponentsContext) => {
    let components = require.context('./', true, /\.vue$/);

    while (components) {
        componentsHandler(Vue, components);
        components = customComponentsContext;
        customComponentsContext = undefined;
    }
};

function componentsHandler(Vue, components) {
    components.keys().forEach(item => {
        let component = components(item);
        if(component && component.default){
            let componentName = component.default.registryName || component.default.componentName;
            if(componentName){
                Vue.component(componentName, component.default);
                _console.log('%c %s', "color: red;", componentName);
            }
        }
    });
}