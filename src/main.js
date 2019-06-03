// 生产环境中注释掉以下语句
import 'sysStatic/css/theme-default.scss'  //开发环境下设置手动切换主题
//import 'sysStatic/css/theme-dark.scss'  //开发环境下设置手动切换主题
//import '../mock/index.js'  //拦截ajax返回数据集

import 'babel-polyfill'
import Vue from "vue"
import App from './index'
import Vuex from 'vuex'
import store from './store'
import router from './router'  //路由器,会自动识别下面的index.js文件(并不能是别的名字)
import axios from './api/ajax'  //网络请求组件。PS：vue-resource已经不维护了
import i18n from './util/i18n' //国际化
import {StrToGMT} from './util/timeUtils' //工具类
import ElementUI from 'element-ui'
//import 'element-ui/lib/theme-chalk/index.css'
//import 'element-ui/lib/theme-chalk/base.css'
import 'font-awesome/css/font-awesome.min.css'  //字体样式
import './components/install'
import './plugins/install'  //自定义的功能权限模块

Vue.prototype.$axios = axios
Vue.prototype.$StrToGMT = StrToGMT

// 注册组件到Vue
Vue.use(Vuex)
// 注册组件到Vue,设置国际化
Vue.use(ElementUI, {
    i18n: (key, value) => i18n.t(key, value)
})

/*
new Vue({
	el: '#app', //vue1.0的写法,挂载到id为app的元素上,将内容显示在index.html页面
    i18n,
    axios,
    router,
    store,
    template: '<App/>',
  	components: { App }  //vue1.0的写法
})
*/

new Vue({
    i18n,
    axios,
    router,
    store,
    template: '<App/>',
    render: h => h(App) //vue2.0的写法
}).$mount('#app')  //vue2.0的写法

