/**
 * axios全局配置
 * 1.修改的目的：在用户登录时服务器应给前台返回一个token，以后前台每次调用接口时都需要带上这个token，
 *   服务端获取到这个token后进行比对，如果通过则可以访问。
 * 2.我们通过对axios进行简单的设置，增加请求拦截器，为每个请求的Header信息中增加Token。
 */
import axios from 'axios'
import store from '../store'
import router from '../router'
import { Message } from 'element-ui'
import Auth from '@/util/auth'

//axios.defaults.baseURL = process.env.API_ROOT;
axios.defaults.baseURL = 'http://127.0.0.1:8080/SP';
//支持cookie跨域,保证每次请求的session一致
axios.defaults.withCredentials=true;

var getTokenLock = false,CancelToken = axios.CancelToken,requestList = [];

/**
 * Token校验
 * @param {function} cancel - 中断函数
 * @param {function} callback -  回调
 * 自动获取Token：过期时自动调用获取Token接口。
 * 注意：当有任一请求在获取Token时，其余请求将顺延，直至新Token获取完毕
 * 1.刷新页面时若token失效了则 index.vue、request都会去请求getNewToken,有一个请求将被取消
 * 2.登录时这个方法不会被调用，token会由登录获取
 */
function checkToken(cancel, callback){
    if(!Auth.hasToken()){
        // 自动获取Token
        if(Auth.tokenTimeoutMethod == "getNewToken"){
            // 如果当前有请求正在获取Token
            if(getTokenLock){
                // 延迟其他请求执行
                setTimeout(function(){
                    checkToken(cancel, callback)
                }, 1000)
            } else {
                getTokenLock = true
                //store.dispatch("auth/getNewToken").then(() => {
                console.log("ajax");
                store.dispatch("auth/getNewToken").then(() => {
                    callback()
                    getTokenLock = false
                })
            }
        }
    } else {
        callback()
    }
}

/**
 * 阻止短时间内的重复请求
 * @param {string} url - 当前请求地址
 * @param {function} c - 中断请求函数
 * @description 每个请求发起前先判断当前请求是否存在于RequestList中，
 *              如果存在则取消该次请求，如果不存在则加入RequestList中，
 *              当请求完成后500ms时，清除RequestList中对应的该请求。
 */
function stopRepeatRequest(url, c){
    for( let i = 0; i < requestList.length; i++){
        if(requestList[i] == url){
            c()
            return
        }
    }
    requestList.push(url)
}

// 超时设置
const service = axios.create({
    // 请求超时时间
    timeout: 5000                 
});

// http request 拦截器
// 每次请求都为http头增加Authorization字段，其内容为token
service.interceptors.request.use(
    config => {
        let cancel
        config.cancelToken = new CancelToken(function executor(c) {
            cancel = c;
        })
        console.log(config.url);
        if(config.url.indexOf('loginByWorkId') < 0){
            checkToken(cancel, function(){
                Auth.setLoginStatus()
                config.headers.Authorization = `${store.state.auth.token}`
            })
        }
        //只对重复获取token的请求进行拦截取消
        console.log(requestList);
        if(config.url.indexOf("getToken") >= 0){
            stopRepeatRequest(config.url, cancel)    
        }
        //stopRepeatRequest(config.url, cancel)
        return config
    },
    err => {
        Message.error({message: '请求超时!'});
        return Promise.reject(err);
    }
);

// http response 拦截器
// 针对响应代码确认跳转到对应页面
service.interceptors.response.use(
    response => {
        for( let i = 0; i < requestList.length; i++){
            //response的url是全路径,request的url不是全路径
            var url = response.config.url;
            if(url.replace(response.config.baseURL,"") == requestList[i]){
                setTimeout(function(){
                    requestList.splice(i,1)
                }, 500)
                break
            }
        }
        return Promise.resolve(response.data)
    },
    error => {
        requestList = [];
        if(axios.isCancel(error)){
            console.log(error)
            //返回一个被拒绝的Promise对象将不会返回到调用方法,针对短时间内重复调用
            return Promise.reject("Ajax Abort: 重复请求在axios拦截器中被中断")
        } else if (error.response) {
            //需设置跳转统一错误页面
            console.log(error.response)
            switch (error.response.status) {
                case 401:
                    router.push('error/401');
                case 404:
                    router.push('error/404');
                default: 
                    Message({
                        message: `服务器错误！错误代码：${error.response.status}`,
                        type: 'error'
                    })
                    router.push('error/401');
            }
            return Promise.reject(error.response.data)
        } else {
            console.log(error)
            Message({
                showClose: true,
                message: "请求服务器异常！",
                type: 'error'
            });
            //console.log("移除用户缓存...")
            //Auth.removeToken();
            //Auth.removeLoginStatus();
            //返回到调用方法中值为null
            return Promise.resolve()
        }
    }
);

export default service;