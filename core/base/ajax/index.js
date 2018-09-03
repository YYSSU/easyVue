/**
 * Created by litao on 2018/8/10.
 */
import axios from 'axios';
import qs from 'qs';

const service = axios.create({
    baseURL: process.env.BASE_API,
    timeout: 5000
});

service.interceptors.request.use(config => {
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    let token = '';
    if (token) {
        config.headers['ALPHA-TOKEN'] = token;// 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
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
        alert('服务器异常！');
    }else if (response.status === 502) {
        alert('啊哦，链接超时了,请联系管理员！');
    }else if(response.data.state !== 1){
        return Promise.reject(response.data.message || '请求异常');
    }

    return Promise.resolve(response.data);
}, error => {
    if (error.response.status === 502) {
        alert('啊哦，链接超时了,请联系管理员！');
    } else {

        if (!error.response) {
            alert('啊哦，链接服务器超时了！');
        } else {
            let message = error.message;
            if (error.response && error.response.data && error.response.data.message) {
                message = error.response.data.message
            }
            alert(message);
        }
    }
    return Promise.reject(error)
});

export default service
