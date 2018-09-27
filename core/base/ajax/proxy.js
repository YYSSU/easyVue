/**
 * Created by litao on 2018/8/21.
 */

import mockJs from 'mockjs';
import request, { setTokenFunc } from './index';

export {
    setTokenFunc
}

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

                _console.log(`%c ${key} | ${mockObj.method} | ${mockObj.url}`, "color: red;")
            }
        });
    }
}

export function ajaxApi(apiSource) {
    if(!this.$error){
        let errorFn = this.prototype.$error;
        this.prototype.$error = function () {
            if(errorFn && Object.prototype.toString.call(errorFn).toLowerCase() === '[object function]'){
                errorFn.apply(this, arguments);
            }else{
                alert(`httpProxyError: ${arguments}`);
            }
        }
    }else if(Object.prototype.toString.call(this.$error).toLowerCase() !== '[object function]'){
        _console.error('Vue实例属性[$error]为框架内置属性，不允许用作其他用途');
        alert('Vue实例属性[$error]为框架内置属性，不允许用作其他用途');
    }

    if(!apiSource || Object.keys(apiSource).length === 0){
        throw new Error('未设置api目录，无法正常初始化');
    }

    //扩展http
    this.prototype.$http = async function (moduleName, methodName, param = {}) {
        const module = apiSource[moduleName] || {};

        const method = module[methodName];

        if(!method || Object.prototype.toString.call(method).toLowerCase() !== '[object function]'){
            let errorMsg = `rest接口[${moduleName}]请求方法[${methodName}]不存在，或不是一个可执行方法！`;
            this.$error(errorMsg);
            _console.error(errorMsg);
        }

        return new Promise((resolve, reject) => {
            method(param).then(resolve).catch(error => {
                this.$error(getHttpErrorContent(error));
                reject(error);
            });
        })
    };

    this.prototype.$ajax = async function (){
        return request.apply(this, arguments).then(response => Promise.resolve(response))
            .catch(error => {
                this.$error(getHttpErrorContent(error));
                return Promise.reject(error);
            });
    };
}

function getHttpErrorContent(error) {
    return error ? (error.message || error.msg || error) : 'http请求异常'
}