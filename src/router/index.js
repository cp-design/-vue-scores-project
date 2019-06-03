import Vue from 'vue'
import VueRouter from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { Message } from 'element-ui'
import Auth from '@/util/auth'
import store from '../store'
//引入页面组件
import staticRoute from './staticRoute'
//引入白名单组件
import whiteList from './whiteList'

var permissionList = []

function initRoute(router){
    //返回一个以给定值解析后的Promise对象有then、catch方法可以直接用
    return new Promise((resolve) => {
        if(store.state.auth.navList.length == 0 || permissionList.length == 0){
            //菜单权限
            store.dispatch('auth/getNavList').then((res) => {
                if(res != null){
                    //扁平化形成权限列表
                    store.dispatch('auth/getPermissionList').then((res) => {
                        permissionList = res
                        //循环权限列表
                        res.forEach(function(v){
                            //在路由中匹配上每一个路径
                            let routeItem = router.match(v.path)
                            if(routeItem){
                                //进行按钮权限赋值到当前路由路径
                                routeItem.meta.permission = v.permission ? v.permission : []
                                routeItem.meta.name = v.name
                            }
                        })
                        console.log("按钮权限加载成功...")
                        resolve()
                    })
                }
            })
        } else{
            console.log("检测到权限数据已存在,无需再加载...")
            resolve()
        }
    })
}


NProgress.configure({ showSpinner: false });

Vue.use(VueRouter)

//装载路由器
const router = new VueRouter({
    mode: 'hash',
    routes: staticRoute
})

// 路由跳转前验证
router.beforeEach((to, from, next) => {
    // 开启进度条
    NProgress.start();
    // 判断用户是否处于登录状态
    if (Auth.isLogin()) {
        // 如果当前处于登录状态，并且跳转地址为login，直接跳回系统首页
        if (to.path === '/login') {
            next({path: "/home", replace: true})
        } else if(to.path.indexOf("/error") >= 0){
            // 防止因重定向到error页面造成beforeEach死循环
            next()
        } else {
            initRoute(router).then(() => {
                let isPermission = false
                console.log("开始菜单权限判断...")
                permissionList.forEach((v) => {
                    // 判断跳转的页面是否在权限列表中
                    if(v.path == to.fullPath){
                        isPermission = true
                    }
                })
                // 没有权限时跳转到401页面
                if(!isPermission){
                    next({path: "/error/401", replace: true})
                } else {
                    next()
                }
            })
        }
    } else {
        // 如果是免登陆的页面则直接进入，否则跳转到登录页面
        if (whiteList.indexOf(to.path) >= 0) {
            console.log('该页面无需登录即可访问')
            next()
        } else {
            console.warn('当前未处于登录状态，请登录')
            next({path: "/login", replace: true})
            // 如果store中有token，同时Cookie中没有登录状态
            if(store.state.auth.token){
                Message({
                    message: '登录超时，请重新登录'
                })
            }
            NProgress.done()
        }
    }
})

router.afterEach(() => {
    NProgress.done(); // 结束Progress
})

export default router