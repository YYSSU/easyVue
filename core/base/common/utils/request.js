import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import qs from 'qs';

// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 5000 // request timeout
});

// request interceptor
service.interceptors.request.use(config => {
  // Do something before request is sent
  config.headers['X-Requested-With'] = 'XMLHttpRequest';
  let token = getToken() || '';
  if(token){
    config.headers['ALPHA-TOKEN'] =  token;// 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
  }
  if(config.isJson){
    config.data = JSON.stringify(config.data);
    config.headers['Content-Type'] = 'application/json;charset=UTF-8';
    axios.defaults.isJson = false;
  }else{
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
    config.data = qs.stringify(config.data , { allowDots: true });
  }
  return config
}, error => {
  // Do something with request error
  console.log(error); // for debug
  Promise.reject(error)
});

// respone interceptor
service.interceptors.response.use(
  response => {
    if(response.status === 500){
      Message({
        message: '啊哦，服务器出错了！',
        type: 'error',
        duration: 5 * 1000
      });
    }
    if(response.status === 502){
      Message({
        message: '啊哦，链接超时了,请联系管理员！',
        type: 'error',
        duration: 5 * 1000
      });
    }
    return Promise.resolve(response.data);
  },
  error => {
    if(error.response.status === 502){
      Message({
        message: '啊哦，链接超时了,请联系管理员！',
        type: 'error',
        duration: 5 * 1000
      });
    }else{

      if(!error.response){
        Message({
          message: '啊哦，链接服务器超时了！',
          type: 'error',
          duration: 5 * 1000
        });
      }else{
        let message = error.message;
        if(error.response && error.response.data && error.response.data.message){
          message = error.response.data.message
        }
        Message({
          message: message,
          type: 'error',
          duration: 5 * 1000
        });
      }
    }


    return Promise.reject(error)
  });

export default service
