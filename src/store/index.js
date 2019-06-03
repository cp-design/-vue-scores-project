import Vue from 'vue'
import Vuex from 'vuex'
import vuexModules from './modules'

import state from './state'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

export default new Vuex.Store({
    state,               //包含所有应用级别状态的对象
    mutations,           //唯一修改状态的事件的回调函数
    actions,             //包含异步操作、提交mutaions改变状态
    modules: vuexModules //引入自定义store模块,避免状态树过于臃肿
})