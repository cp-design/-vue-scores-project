import Cookies from 'js-cookie'
import axios from '@/api/ajax'
import Auth from '@/util/auth'
import router from '@/router'
import { Message } from 'element-ui'

const state = {
    token: '',
    navList: []
}

//变更state
const mutations = {
    setNavList: (state, data) => {
        state.navList = data
    },

    setToken: (state, data) => {
        if(data){
            //token加载到缓存
            Auth.setToken(data)
            //登录状态加载到缓存
            Auth.setLoginStatus()
        } else {
            Auth.removeToken()
            Auth.removeLoginStatus()
        }
        state.token = data
    }
}

//调用mutations
const actions = {
    //工号登录
    loginByWorkId({ commit }, userInfo) {
        return new Promise((resolve) => {
            var p = JSON.parse(JSON.stringify(userInfo));
            axios.post('/loginAction.do?method=loginByWorkId',p).then(res => {
                if(res != null){
                    if(res.login){
                        //设置token令牌到缓存
                        commit('setToken', res.token)
                        //设置用户信息到缓存
                        commit('user/setName', res.userName, { root: true })
                    }
                }
                resolve(res)
            })
        });
    },

    // 登出
    logout({commit}) {
        return new Promise((resolve) => {
            axios.post('/loginAction.do?method=loginOut').then(res => {
                Message({
                  title: '成功',
                  message: '系统退出成功！',
                  type: 'success'
                });
            })
            commit('setToken', '')
            commit('setNavList', '')
            commit('user/setName', '', { root: true })
            commit('tagNav/removeTagNav', '', {root: true})
            resolve()
        })
    },

    // 重新获取用户信息及Token
    // 这里不需要提供用户名和密码，实际中请根据接口自行修改
    relogin({dispatch, commit}){
        return new Promise((resolve) => {
            // 根据Token进行重新登录
            let token = Cookies.get('token'),
                userName = Cookies.get('userName')
            // 重新登录时校验Token是否存在，若不存在则获取
            if(!token){
                console.log("token已经失效,正在获取新令牌...")
                dispatch("getNewToken")
            } else {
                commit('setToken', token)
            }
            // 刷新/关闭浏览器再进入时获取用户名
            commit('user/setName', decodeURIComponent(userName), { root: true })
            resolve()
        })
    },

    // 获取新Token
    getNewToken({commit}){
        return new Promise((resolve) => {
            axios.post('/loginUtilsAction.do?method=getToken').then((res) =>{
                if(res != null){
                    if(res.token.length > 0){
                        console.log("已获取新token...")
                        commit("setToken", res.token)
                    }
                } else {
                    //获取不到时说明服务器异常,重新登录
                    Auth.removeToken();
                    Auth.removeLoginStatus();
                    Message({
                        showClose: true,
                        message: "获取令牌异常，请重新登录！",
                        type: 'error'
                    });
                    router.push("/login");
                    return;
                }
                resolve()
            })
        })
    },
   
    // 获取该用户的菜单列表
    getNavList({commit}){
        return new Promise((resolve) =>{
            axios.post('/loginUtilsAction.do?method=userNavLimitList').then((res) => {
                if(res != null){
                    commit("setNavList", res.limitList)
                    console.log("权限数据加载成功...")
                    resolve(res.limitList)
                } else {
                    //获取不到时说明服务器异常,重新登录
                    Auth.removeToken();
                    Auth.removeLoginStatus();
                    //Message({
                    //    showClose: true,
                    //    message: "获取权限异常，请重新登录！",
                    //    type: 'error'
                    //});
                    router.push("/login");
                    return;
                }
            })
        })
    },

    // 将菜单列表扁平化形成权限列表
    getPermissionList({state}){
        return new Promise((resolve) =>{
            let permissionList = []
            // 将菜单数据扁平化为一级
            function flatNavList(arr){
                for(let v of arr){
                    if(v.child && v.child.length){
                        flatNavList(v.child)
                    } else{
                        permissionList.push(v)
                    }
                }
            }
            flatNavList(state.navList)
            console.log("权限数据扁平化处理成功...")
            resolve(permissionList)
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}