/**
 * Created by litao on 2018/8/21.
 */

import mockJs from 'mockjs';

export default (options) => {
    if(options && Object.keys(options).length > 0){
        Object.keys(options).forEach(key => {
            let mockObjFunc = options[key];
            if(mockObjFunc && Object.prototype.toString.call(mockObjFunc).toLowerCase() === '[object function]'){
                let mockObj = mockObjFunc();

                if(!mockObj.url){
                    _console.warn(`mockApi[${key}]未设置请求拦截url！`);
                    return this;
                }else if(!mockObj.handler || Object.prototype.toString.call(mockObj.handler).toLowerCase() !== '[object function]'){
                    _console.warn(`mockApi[${key}]未设置执行方法，或设置的值不是一个可执行函数！`);
                    return this;
                }

                mockJs.mock(mockObj.url, mockObj.method || 'post', mockObj.handler);

                _console.log(`%c[mockApi] %c===>%c ${key} | ${mockObj.method} | ${mockObj.url}`, "color: #409EFF;", "color: #f6b05f;" , "color: red;")
            }
        });
    }
}

export function ajaxApi(apiSource) {
    if(apiSource && Object.keys(apiSource).length > 0){
        //扩展http
        this.prototype.$http = async (moduleName, methodName, param = {}) => {
            const module = apiSource[moduleName];
            if(!module)
                throw 'rest接口请求模块不存在！';

            const method = module[methodName];
            if(!method || Object.prototype.toString.call(method).toLowerCase() !== '[object function]')
                throw 'rest接口请求方法不存在，或不是一个可执行方法！';

            return await method(param);
        }
    }
}