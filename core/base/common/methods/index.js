/**
 * Created by litao on 2018/8/10.
 */
import Api from '../../api';

import Vue from 'vue';

import request from '../../ajax';

var loadingInstance;

/**
 * 事件传递用
 */
const bus = new Vue();

/**
 * 事件广播
 * @param eventName
 * @param params
 */
export function $busBroadcast(eventName, params) {
    if(checkEventName.call(this, eventName)){
        bus.$emit(eventName, params);
    }
}

/**
 * 监听事件
 * @param eventName
 * @return {Promise}
 */
export function $busListener(eventName, callback) {
    if(checkEventName.call(this, eventName) && callback && Object.prototype.toString.call(callback).toLowerCase() === '[object function]'){
        bus.$on(eventName, callback);
    }else{
        reject(`广播事件名[${eventName}]非法`);
    }
}


/**
 * 检测事件名称
 * @param eventName
 * @return {boolean}
 */
function checkEventName(eventName) {
    if(!eventName || Object.prototype.toString.call(eventName).toLowerCase() !== '[object string]'){
        this.$error(`广播事件名[${eventName}]非法`);
        return false;
    }
    return true;
}

/**
 * 下载
 * @param url
 * @param setting
 * @param params
 */
export function $download(url, setting = {}, params) {
    let ajax = new XMLHttpRequest();

    ajax.open(setting.method || 'get', url);

    if (setting.isJson) {
        ajax.setRequestHeader("Content-type", "application/json;charset=UTF-8");
        params = JSON.stringify(params);
    } else {
        ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        let paramStr = "";

        for (let key in params) {
            if (paramStr) {
                paramStr += '&';
            }
            let fieldValue = params[key];
            paramStr += key + '=' + fieldValue
        }

        params = paramStr;
    }

    if (setting.headers && setting.headers.length > 0) {
        for (let key in setting.headers) {
            if (setting.headers[key] && setting.headers[key] !== 'null' && setting.headers[key] !== 'undefined') {
                ajax.setRequestHeader(key,setting.headers[key]);
            }
        }
    }

    ajax.responseType = 'blob';
    ajax.onreadystatechange = function () {
        if (ajax.readyState === 4 && ajax.status === 200) {
            let responseName = ajax.getResponseHeader('download-fileName');
            let filename = responseName || new Date().getTime() + '.xls';
            let blob = new Blob([ajax.response]);
            let csvUrl = URL.createObjectURL(blob);
            let link = document.createElement('a');
            link.href = csvUrl;
            link.download = filename;
            link.click();
        }
    };

    // 判断data send发送数据
    if (params) {
        // 如果有值 从send发送
        ajax.send(params);
    } else {
        // 木有值 直接发送即可
        ajax.send();
    }
}

/**
 * 单文件上传
 * @param ref
 * @param readonly
 * @param echo
 * @param callback
 */
export function $fileUploadSingle({ref = 'uploadDialog', readonly = false, echo, callback}) {
    if(readonly) return;
    let uploadComponentInstance = this.$getRef(ref);
    if(!uploadComponentInstance){
        this.$error('调用上传组件时，未获取到组件实例，请检查是否引入上传组件！');
        return
    }
    uploadComponentInstance.__open({
        echo: echo,
        isMultiple: false
    }).then(fileList => {
        callback(fileList);
    });
}

/**
 * 预览文件
 * @param file
 */
export function $preViewFile(file) {
    window.open(file.previewurl, '_blank');
}

//导出ajax
export const $ajax = request;

/**
 * 跳转页面
 * @param options
 */
export function $jump(options = {name: '404'}) {
    this.$router.push(options);
}

/**
 * 获取指定名称slot插槽的实例
 * @param slotName
 * @param self
 * @return {undefined}
 */
export function $getSlotInstance(slotName = '', self = this) {
    let slot = self.$getSlot(slotName);
    return slot ? slot.componentInstance : undefined;
}

/**
 * 获取指定名称的slot插槽
 * @param slotName
 * @param self
 * @return {*}
 */
export function $getSlot(slotName = '', self = this) {
    let result;
    if(slotName){
        let slots = self.$slots;
        if(slots && slots[slotName] && slots[slotName].length > 0){
            return slots[slotName][0]
        }
    }
    return result;
}

/**
 * 获取dom实例
 * @param ref
 * @param self
 * @return {*}
 */
export function $getRef(ref = '', self) {
    if(self){
        return self.$refs[ref];
    }else{
        return this.$refs[ref];
    }
}

/**
 * 异常提示
 * @param msg
 * @param duration
 */
export function $error(msg = '', duration = 2000) {
    this.$message({message: msg, type: 'error', duration: duration});
}

/**
 * 警告提示
 * @param msg
 * @param duration
 */
export function $warn(msg = '', duration = 2000) {
    this.$message({message: msg, type: 'warning', duration: duration});
}

/**
 * 信息提示
 * @param msg
 * @param duration
 */
export function $info(msg = '', duration = 2000) {
    this.$message({message: msg, type: 'info', duration: duration});
}

/**
 * 成功提示
 * @param msg
 * @param duration
 */
export function $success(msg = '', duration = 2000) {
    this.$message({message: msg, type: 'success', duration: duration});
}

/**
 * 确认框
 * @param title
 * @param msg
 */
export function $isOk(title = '提示', msg = '是否继续操作？') {
    return new Promise((resolve, reject) => {
        MessageBox.confirm(msg, title, {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(resolve).catch(reject);
    })
}

/**
 * 打开遮罩
 * @param domInstance
 * @param text
 * @param background
 * @param spinner
 * @param customClass
 */
export function $openMask(domInstance, text = '拼命加载中', background = 'rgba(255, 253, 253, 0.92)', spinner = 'el-icon-loading', customClass = '') {
    if(Object.prototype.toString.call(domInstance).toLowerCase() === '[object string]'){
        let instance = this.$getRef(domInstance);
        if(instance){
            if(instance instanceof HTMLElement){
                domInstance = instance;
            }else{
                domInstance = instance.$el;
            }
        }else{
            domInstance = undefined;
        }
    }
    let config = {
        text: text,
        background: background,
        spinner: spinner,
        customClass: customClass,
        lock: true,
        fullscreen: false
    };
    if(domInstance){
        config.target = domInstance;
    }
    if(loadingInstance){
        this.$closeMask().then(() => {
            loadingInstance = Loading.service(config);
        });
    }else{
        loadingInstance = Loading.service(config);
    }
}

/**
 * 关闭遮罩
 * @return {Promise.<T>}
 */
export function $closeMask() {
    return new Promise(function (resolve, reject) {
        setTimeout(() => { //避免关闭时，遮罩不存在，无法关闭的问题
            if(loadingInstance){
                this.$nextTick(function () {
                    loadingInstance.close();
                    resolve();
                });
            }else{
                resolve();
            }
        });
    }.bind(this));
}






/**
 * 日期格式化
 * @param fmt
 * @returns {*}
 */
Date.prototype.format = function(fmt){
    let o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    for(var k in o){
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;
};

Date.prototype.datetimestr = function(){
    return this.format("yyyy-MM-dd hh:mm:ss") ;
} ;

Date.prototype.datestr = function(){
    return this.format("yyyy-MM-dd") ;
} ;

Date.prototype.timestr = function(){
    return this.format("hh:mm:ss") ;
} ;
Array.prototype.includes = function (searchStr) {
    if(!searchStr) return false;
    return this.indexOf(searchStr) !== -1;
};

String.prototype.endsWith = function (searchStr) {
    let searchIndex = this.indexOf(searchStr);
    return searchIndex === this.length - searchStr.length;
};

if(!Function.prototype.apply){
    Function.prototype.apply = function(obj, args){
        obj = obj === undefined ? window : Object(obj);
        let i = 0, ary = [], str;
        if(args){
            for( len=args.length; i<len; i++ ){
                ary[i] = "args[" + i + "]";
            }
        }
        obj._apply = this;
        str = 'obj._apply(' + ary.join(',') + ')';
        try{
            return eval(str);
        }catch(e){
        }finally{
            delete obj._apply;
        }
    };
}
if(!Function.prototype.call){
    Function.prototype.call = function(obj){
        let i = 1, args = [];
        for(let len=arguments.length; i<len; i++ ){
            args[i-1] = arguments[i];
        }
        return this.apply(obj, args);
    };
}