import zhElement from 'element-ui/lib/locale/lang/zh-CN'

export default {
    global: {
        staffIdTip: '账号',
        staffId: '请输入内容',
        passwordTip: '密码',
        password: '请输入内容',
        login: '登录',
        captcha: '验证码',
        forgetPassword: '忘记密码？',
        //loginTip: '当前登录结果随机。验证码随便填',
        loginTip: '目前可验证码随便填！',
        editpassword: '修改密码',
        logout: '退出登录',
        errMsg: {
            inputRequired: '请输入{cont}',
            inputError: '{cont}不正确',
            selectRequired: '请选择{cont}',
            loginTimeOut: '服务器连接异常，请稍后再试'
        }
    },
    ...zhElement
}