/**
 * Created by litao on 2018/8/10.
 */
import axios from 'axios';
import qs from 'qs';

/**
 * 默认token获取函数
 * 需要返回
 *      tokenKey 请求携带的token名称
 *      tokenValue 请求携带的token值
 * 该方法允许被覆盖替换
 * @return {{tokenKey: string, tokenValue: (V|*|string)}}
 */
function getHttpToken() {
    return {
        tokenKey: 'token',
        tokenValue: ''
    }
}

const service = axios.create({
    baseURL: process.env.BASE_API,
    timeout: 5000
});

service.interceptors.request.use(config => {
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    let { tokenKey, tokenValue } = getHttpToken.call(window.__easyVueInstance__) || {};
    if (tokenKey){
        config.headers[tokenKey] = tokenValue;// 让每个请求携带token
    }
    if (config.isJson) {
        config.data = JSON.stringify(config.data);
        config.headers['Content-Type'] = 'application/json;charset=UTF-8';
        axios.defaults.isJson = false;
    } else {
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
        config.data = qs.stringify(config.data, {allowDots: true});
    }
    return config
}, error => {
    _console.log(error);
    Promise.reject(error);
});

service.interceptors.response.use(response => {
    if (response.status === 500) {
        return Promise.reject('服务器异常！');
    }else if (response.status === 502) {
        return Promise.reject('啊哦，链接超时了,请联系管理员！');
    }else if(response.data.state !== 1){
        return Promise.reject(response.data.message || '请求异常');
    }

    return Promise.resolve(response.data);
}, error => {
    if(!error.response){
        return Promise.reject(error || '啊哦，系统异常');
    }else if (error.response.status === 502) {
        return Promise.reject('啊哦，链接超时了,请联系管理员！');
    } else {

        if (!error.response) {
            return Promise.reject('啊哦，链接服务器超时了！');
        } else {
            let message = error.message;
            if (error.response && error.response.data && error.response.data.message) {
                message = error.response.data.message
            }
            return Promise.reject(message);
        }
    }
});

export default service

export function setTokenFunc(func) {
    if(func && Object.prototype.toString.call(func).toLowerCase() === '[object function]'){
        getHttpToken = func;
    }
}