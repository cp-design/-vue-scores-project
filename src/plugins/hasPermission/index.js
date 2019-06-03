const hasPermission = {
    install (Vue){
        //directives做权限按钮的功能
        Vue.directive('hasPermission', {
            /** el可以获取当前dom节点，并且进行编译，也可以操作事件 *  */
            /** binding指的是一个对象，一般不用 **/
            /** vnode 是 Vue 编译生成的虚拟节点 **/
            bind(el, binding, vnode){
                //获取当前路由信息-路径的权限信息
                let permissionList = vnode.context.$route.meta.permission
                if(!permissionList){
                    console.error(`权限判断不生效。因路由中不包含permission字段，请检查路由表设置。当前路由地址：${vnode.context.$route.path}`)
                    return
                }
                if(typeof (permissionList) != "object"){
                    console.error(`权限判断不生效。因路由中permission字段非数组类型，请检查路由表设置。当前路由地址：${vnode.context.$route.path}`)
                    return
                }
                //判断是否包含指定字符
                if(!permissionList.includes(binding.value)){
                    el.parentNode.removeChild(el)
                }
            }
        })
    }
}

export default hasPermission
