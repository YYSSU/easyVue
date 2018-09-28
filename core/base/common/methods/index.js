/**
 * Created by litao on 2018/8/10.
 */
import cookie from 'js-cookie';

import Vue from 'vue';

/**
 * 事件传递用
 */
const bus = new Vue();

//cookie
export const $cookie = cookie;

/**
 * 获取object对象的原型类型
 * @param obj
 * @return {*}
 */
export function $getObjectType(obj) {
    return obj ? Object.prototype.toString.call(obj).toLowerCase() : undefined;
}

/**
 * 深度合并
 * @param firstObj
 * @param secondObj
 * @return {{}}
 */
export function $deepObjectMerge(firstObj = {}, secondObj = {}) { // 深度合并对象
    for (let key in secondObj) {
        firstObj[key] = firstObj[key] && this.$getObjectType(firstObj[key]) === "[object object]" ?
            this.$getObjectType(secondObj[key]) === '[object function]' ? this.$deepObjectMerge(firstObj[key], secondObj[key]()) :
                this.$deepObjectMerge(firstObj[key], secondObj[key]) : firstObj[key] = secondObj[key];
    }
    return firstObj;
}

/**
 * 加载图片
 * @param path 图片路径
 * @return {*}
 */
export const $loadImg = (path) => {
    try {
        return require('@/assets/' + path);
    } catch (e) {
        return '';
    }
};

/**
 * 加密字符数据
 * @param param 加密的数据
 * @param pwd 加密密码
 * @return {{routeParams: *}}
 */
export function $encrypt(param, pwd = '') {
    let paramStr = Object.prototype.toString.call(param).toLowerCase() === '[object string]' ? param : JSON.stringify(param);
    return {routeParams: window.pwdString.encrypt(paramStr, pwd)};
}

/**
 * 解密字符数据
 * @param str 解密的字符串
 * @param pwd 解密密码
 * @return {*}
 */
export function $decrypt(str, pwd) {
    let result = window.pwdString.decrypt(str, pwd);

    result = JSON.parse(result);

    return result;
}

/**
 * 根据传入的loopNum循环指定次数
 * @param loopNum 循环次数
 * @param callback 回调
 */
export function $loop(loopNum = 0, callback) {
    if (!callback || Object.prototype.toString.call(callback).toLowerCase() !== '[object function]')
        return;

    for (let i = 0; i < loopNum; i++) {
        callback(i);
    }
}

/**
 * 事件广播
 * @param eventName
 * @param params
 */
export function $busBroadcast(eventName, params) {
    if (checkEventName.call(this, eventName)) {
        bus.$emit(eventName, params);
    }
}

/**
 * 监听事件
 * @param eventName
 * @return {Promise}
 */
export function $busListener(eventName, callback) {
    if (checkEventName.call(this, eventName) && callback && Object.prototype.toString.call(callback).toLowerCase() === '[object function]') {
        bus.$on(eventName, callback);
    } else {
        reject(`广播事件名[${eventName}]非法`);
    }
}


/**
 * 检测事件名称
 * @param eventName
 * @return {boolean}
 */
function checkEventName(eventName) {
    if (!eventName || Object.prototype.toString.call(eventName).toLowerCase() !== '[object string]') {
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
                ajax.setRequestHeader(key, setting.headers[key]);
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
    if (slotName) {
        let slots = self.$slots;
        if (slots && slots[slotName] && slots[slotName].length > 0) {
            return slots[slotName][0]
        }
    }
    return result;
}


/**
 * 异常提示
 * @param msg
 * @param duration
 */
export function $error(msg = '', duration = 3000) {
    generateMessageDom('error', msg, duration);
}

/**
 * 警告提示
 * @param msg
 * @param duration
 */
export function $warn(msg = '', duration = 3000) {
    generateMessageDom('warn', msg, duration);
}

/**
 * 信息提示
 * @param msg
 * @param duration
 */
export function $info(msg = '', duration = 3000) {
    generateMessageDom('info', msg, duration);
}

/**
 * 成功提示
 * @param msg
 * @param duration
 */
export function $success(msg = '', duration = 3000) {
    generateMessageDom('success', msg, duration);
}

/**
 * 生成message容器
 * @param type
 * @param msg
 * @param duration
 * @return {*}
 */
function generateMessageDom(type, msg, duration = 3000) {
    const typeMap = {
        success: {
            backColor: '#e1f3d8',
            borderColor: '#e1f3d8',
            fontColor: '#67c23a',
            icon: 'icon-chenggong',
            inCls: 'animated bounceInDown',
            outCls: 'animated zoomOutRight'
        },
        info: {
            backColor: '#ebeef5',
            borderColor: '#ebeef5',
            fontColor: '#909399',
            icon: 'icon-tishi',
            inCls: 'animated bounceInDown',
            outCls: 'animated zoomOutRight'
        },
        warn: {
            backColor: '#faecd8',
            borderColor: '#faecd8',
            fontColor: '#e6a23c',
            icon: 'icon-jinggao',
            inCls: 'animated shake',
            outCls: 'animated zoomOutRight'
        },
        error: {
            backColor: '#fde2e2',
            borderColor: '#fde2e2',
            fontColor: '#f56c6c',
            icon: 'icon-shibai',
            inCls: 'animated shake',
            outCls: 'animated zoomOutRight'
        }
    };

    let currentTypeSetting = typeMap[type] || {};

    document.body.appendChild(new Vue({
        render (h){
            return h('transition', {
                props: {
                    enterActiveClass: currentTypeSetting.inCls,
                    leaveActiveClass: currentTypeSetting.outCls
                },
                on: {
                    enter: el => {
                        el.style.top = `${Vue.prototype.$EZV_messageTop}px`;
                        Vue.prototype.$EZV_messageTop = parseFloat(el.style.top) + parseFloat(el.offsetHeight) + 10;
                    },

                    leave: el => {
                        let currentDomTimeStamp = el.getAttribute('timeStamp');
                        let messageDomList = new Array(...document.getElementsByClassName('ev-system-message-container'))
                            .filter(dom => dom.getAttribute('timeStamp') !== currentDomTimeStamp);

                        if(messageDomList.length > 0){
                            messageDomList.forEach(dom => {
                                setTimeout(() => {
                                    let oldTopValue = dom.style.top;
                                    let newTopValue = parseFloat(oldTopValue) - el.offsetHeight - 10;
                                    dom.style.top = (newTopValue < 100 ? 100 : newTopValue) + 'px';
                                }, 100);
                                if(messageDomList.indexOf(dom) === messageDomList.length - 1){
                                    Vue.prototype.$EZV_messageTop = parseFloat(messageDomList.pop().style.top);
                                }
                            });
                        }
                    }
                }
            }, [this.show && h('div', {
                class: 'ev-system-message-container',
                attrs: {
                    timeStamp: new Date().getTime()
                },
                style: {
                    backgroundColor: currentTypeSetting.backColor,
                    borderColor: currentTypeSetting.borderColor,
                    zIndex: Vue.prototype.$EZV_zIndex++
                },
                on: {
                    mouseover: this.stopTimeOut,

                    mouseout: () => {
                        if(!this.show) return;

                        this.startTimeOut();
                    }
                }
            }, [
                h('i', {
                    class: 'iconfont icon-cuo ev-system-message-close-icon',
                    on: {
                        click: () => this.show = false
                    }
                }),
                h('i', {
                    class: `iconfont ${currentTypeSetting.icon} ev-system-message-icon`,
                    style: {
                        color: currentTypeSetting.fontColor
                    }
                }),
                h('p', {
                    class: 'ev-system-message-content',
                    style: {
                        color: currentTypeSetting.fontColor
                    }
                }, msg)
            ])])
        },

        data: {
            show: false
        },

        computed: {
        },

        mounted (){
            this.startTimeOut();

            ['warn', 'error'].includes(type) && this.consoleInfo(type);
        },

        methods: {
            startTimeOut (){
                this.stopTimeOut();
                this.show = true;
                this.timeOutId = setTimeout(() => {
                    this.show = false;
                }, duration);
            },

            stopTimeOut (){
                if (this.timeOutId)
                    clearTimeout(this.timeOutId);
            },

            consoleInfo (type){
                let route = window.__easyVueInstance__.$route;

                if(route && $getObjectType(route) === '[object object]'){
                    let errorSign;

                    if(route.meta && route.meta.title){
                        errorSign = route.meta.title;
                    }else if(route.name){
                        errorSign = route.name;
                    }

                    if(errorSign){

                        try{
                            throw new Error();
                        } catch (e) {
                            if(type === 'error'){
                                _console.error(e.stack.replace('Error', `[${errorSign}] 抛出了一个异常信息，信息内容为：${msg}，堆栈信息如下：`));
                            }else{

                                _console.warn(e.stack.replace('Error', `[${errorSign}] 抛出了一个警告信息，信息内容为：${msg}，堆栈信息如下：`));
                            }
                        }
                    }
                }
            }
        }
    }).$mount().$el);
}

/**
 * 确认框
 * @param title
 * @param msg
 * @param cancelFn
 */
export function $isOk(title = '提示', msg = '是否继续操作？', cancelFn) {
    return new Promise((resolve, reject) => {
        document.body.appendChild(new Vue({
            render (h){
                return h('div', {
                    class: 'ev-system-confirm-container',
                    domProps: {
                        id: 'evSystemConfirmContainerId'
                    },
                    style: {
                        zIndex: Vue.prototype.$EZV_zIndex++
                    }
                }, [
                    h('transition', {
                        props: {
                            name: 'zoomInDown',
                            enterActiveClass: 'animated zoomInDown',
                            // leaveActiveClass: 'animated zoomOutDown'
                        }
                    }, [
                        this.show && h('div', {
                            class: 'ev-system-confirm-content',
                            style: {
                                zIndex: Vue.prototype.$EZV_zIndex++
                            }
                        }, [
                            h('div', {
                                class: 'ev-system-confirm-content_head'
                            }, [
                                h('div', {
                                    class: 'ev-system-confirm-content_head-title'
                                }, title),
                                h('i', {
                                    class: 'iconfont icon-cuo ev-system-confirm-content_head-close',
                                    on: {
                                        click: () => this.closeEvConfirm(true)
                                    }
                                })
                            ]),
                            h('div', {
                                class: 'ev-system-confirm-content_center'
                            }, [
                                h('i', {
                                    class: 'iconfont icon-wenhaoyuanyiwenmianxing ev-system-confirm-content_center-icon'
                                }),
                                h('div', {
                                    class: 'ev-system-confirm-content_center-content'
                                }, msg)
                            ]),
                            h('div', {
                                class: 'ev-system-confirm-content_footer'
                            }, [
                                h('div', {
                                    class: 'ev-system-confirm-content_footer-cancel',
                                    on: {
                                        click: () => this.closeEvConfirm(true)
                                    }
                                }, '取消'),
                                h('div', {
                                    class: 'ev-system-confirm-content_footer-confirm',
                                    on: {
                                        click: this.confirmFn
                                    }
                                }, '确定')
                            ]),
                        ])
                    ])
                ]);
            },

            data (){
                return {
                    show: false
                }
            },

            mounted (){
                this.show = true;
            },

            methods: {
                closeEvConfirm (isCancel){
                    let dom = document.getElementById('evSystemConfirmContainerId');
                    document.body.removeChild(dom);
                    isCancel && this.$getObjectType(cancelFn) === '[object function]' && cancelFn();
                },

                confirmFn (){
                    this.closeEvConfirm();
                    resolve();
                }
            }
        }).$mount().$el);
    })
}

/**
 * 打开遮罩
 * @param target
 * @param text
 */
export function $openMask(target, text = '拼命加载中') {
    if(target){
        this.$closeMask(true);
        let instance;

        if(this.$getObjectType(target) === '[object string]'){ //传进来的是标识
            instance = this.$getRef(target);
            if(instance){
                instance = instance[0] || instance;
                if(!instance){
                    instance = document.getElementById(target);
                }else{
                    instance = instance.$el || instance;
                }
            }
        }else{
            instance = target.$el || target;
        }

        if(instance && instance instanceof HTMLElement){
            instance.classList.add('ev-system-mask-container_parent');

            instance.appendChild(new Vue({
                render (h){
                    return h('div', {
                        class: 'ev-system-mask-container',
                        domProps: {
                            id: 'evSystemMaskContainerId',
                        },
                        style: {
                            zIndex: Vue.prototype.$EZV_zIndex++
                        }
                    }, [
                        h('div', {
                            class: 'ev-system-mask-spinner',
                            style: {
                                zIndex: Vue.prototype.$EZV_zIndex++
                            }
                        }, [
                            h('i', {
                                class: 'iconfont icon-jiazai ev-system-mask-spinner_icon',
                                style: {
                                    zIndex: Vue.prototype.$EZV_zIndex++
                                }
                            }),
                            h('p', {
                                class: 'ev-system-mask-spinner_text'
                            }, text)
                        ])
                    ]);
                }
            }).$mount().$el);
        }
    }
}


/**
 * 对dom进行平滑滚动
 * @param el 滚动实例
 * @param from 开始值
 * @param to 结束值
 * @param duration 从开始到结束需要的时间 默认500ms
 * @param endCallback 结束之后的回调
 */
export function $scrollTop(el, from = 0, to, duration = 500, endCallback) {
    //为保证动画平滑度，避免直接使用timeout
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = (
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                return window.setTimeout(callback, 1000/60);
            }
        );
    }
    const difference = Math.abs(from - to);
    const step = Math.ceil(difference / duration * 50);

    function scroll(start, end, step) {
        if (start === end) {
            endCallback && endCallback();
            return;
        }

        let d = (start + step > end) ? end : start + step;
        if (start > end) {
            d = (start - step < end) ? end : start - step;
        }

        el.scrollTo(d, d);
        window.requestAnimationFrame(() => scroll(d, end, step));
    }
    scroll(from, to, step);
}

/**
 * 关闭遮罩
 * @param isImmediateExecution 是否立即执行 默认延迟执行
 * @return {Promise.<T>}
 */
export function $closeMask(isImmediateExecution = false) {
    function closeFn() {
        let maskInstance = document.getElementById('evSystemMaskContainerId');
        if(maskInstance){
            maskInstance.parentElement.removeChild(maskInstance);
        }
    }

    isImmediateExecution ? closeFn() : setTimeout(closeFn);
}

/**
 * 获取实例
 * @param ref
 * @param self
 * @return {*}
 */
export function $getRef(ref = '', self) {
    if (self) {
        return self.$refs[ref];
    } else {
        return this.$refs[ref];
    }
}

/**
 * 退出登录
 * @param sleep
 */
export function $logoutHandler (){
    this.$store.commit('CLEAR_USER');
    this.$store.commit('CLEAR_MENU');
    this.$store.commit('CLEAR_PERMISSION_BUTTONS');
    this.$cookie.remove(this.$httpTokenKey);
    this.$jump('/login');
    // if(sleep){
    //     setTimeout(() => window.location.reload(), sleep);
    // }else{
    //     window.location.reload();
    // }
}


/**
 * 日期格式化
 * @param fmt
 * @returns {*}
 */
Date.prototype.format = function (fmt) {
    let o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
};

Date.prototype.datetimestr = function () {
    return this.format("yyyy-MM-dd hh:mm:ss");
};

Date.prototype.datestr = function () {
    return this.format("yyyy-MM-dd");
};

Date.prototype.timestr = function () {
    return this.format("hh:mm:ss");
};
if (!Array.prototype.includes) {
    Array.prototype.includes = function (searchStr) {
        if (!searchStr) return false;
        return this.indexOf(searchStr) !== -1;
    };
}

if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (searchStr) {
        let searchIndex = this.indexOf(searchStr);
        return searchIndex === this.length - searchStr.length;
    };
}

if (!Function.prototype.apply) {
    Function.prototype.apply = function (obj, args) {
        obj = obj === undefined ? window : Object(obj);
        let i = 0, ary = [], str;
        if (args) {
            for (len = args.length; i < len; i++) {
                ary[i] = "args[" + i + "]";
            }
        }
        obj._apply = this;
        str = 'obj._apply(' + ary.join(',') + ')';
        try {
            return eval(str);
        } catch (e) {
        } finally {
            delete obj._apply;
        }
    };
}
if (!Function.prototype.call) {
    Function.prototype.call = function (obj) {
        let i = 1, args = [];
        for (let len = arguments.length; i < len; i++) {
            args[i - 1] = arguments[i];
        }
        return this.apply(obj, args);
    };
}