<template>
    <div class="sys-login">
        <div class="logo">
            <img src="~sysStatic/images/logo.png" alt="" style="width:80%;">
            <div style="margin-top:50px;">
                <span style="font-size:15px;color:#EFF2F7;">构建数据中心，实现智能决策</span>
            </div>
        </div>
        <div class="login-area">
            <el-card body-style="padding-top:20px;background:#75808e;">
                <div class="login_logo_header">
                    <img src="~sysStatic/images/pamp2.png" alt="">
                </div>
                <div class="form-group">
                    <el-form :model="loginForm" status-icon :rules="loginRules" ref="loginForm" label-position="left" label-width="0px">
                        <el-form-item prop="staffId">
                            <!-- $t i18n国际化写法 -->
                            <el-input v-model="loginForm.staffId" size="small" type="text" placeholder="教师工号或号码">
                                <template slot="prepend">{{$t('global.staffIdTip')}}</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input v-model="loginForm.password" size="small" type="password" :placeholder="$t('global.password')">
                                <template slot="prepend">{{$t('global.passwordTip')}}</template>
                            </el-input>
                        </el-form-item>
                        <!-- 验证码 -->
                        <el-form-item prop="captcha" :required="captcha.show" v-if="captcha.show" class="captcha">
                            <!--<img :src="captcha.src" alt="">-->
                            <!-- 这个是验证码组件 -->
                            <el-input v-model="loginForm.captcha" size="small" type="text" :placeholder="$t('global.captcha')"></el-input>
                            <div class="code" @click="refreshCode" style="float:right;line-height:0px;margin-top:4px;">
                                <s-identify :identifyCode="identifyCode"></s-identify>
                            </div>
                        </el-form-item>
                        <p class="textR">{{$t('global.forgetPassword')}}</p>
                        <el-button class="btn-login" size="small" plain :loading="loginLoading" @click="submitForm()">{{$t('global.login')}}</el-button>
                    </el-form>
                    <!-- 显示错误信息
                    <div v-if="sysMsg" class="err-msg">{{sysMsg}}</div>
                    -->
                </div>
            </el-card>
            <!-- 
            <div class="lang-toggle">
                <span :class="{cur: lang=='zhCN'}" @click="changeLang('zhCN')">中</span> | 
                <span :class="{cur: lang=='en'}" @click="changeLang('en')">En</span>
            </div>
            <div class="lang-toggle">
                <span :class="{cur: theme=='theme-default'}" @click="changeTheme('theme-default')">浅</span> | 
                <span :class="{cur: theme=='theme-dark'}" @click="changeTheme('theme-dark')" >深</span>
            </div>
            -->
            <transition name="fade">
                <div class="el-form-item__error" v-show="false">{{$t('global.loginTip')}}</div>
            </transition>
            <!-- 
            <div class="tip">
                <p>{{$t('global.loginTip')}}</p>
            </div>
            -->
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import setTheme from "@/util/setTheme"
import SIdentify from './identify'

export default {
    data() {
        var checkCaptcha = (rule, value, callback) => {
            if(this.captcha.show){
                if (!value) {
                    callback(new Error(this.$t('global.errMsg.inputRequired', 
                        {cont: this.$t('global.captcha')})));
                } else if(this.identifyCode != this.loginForm.captcha.toUpperCase()){
                    callback(new Error(this.$t('global.errMsg.inputError', 
                        {cont: this.$t('global.captcha')})));
                } else {
                    callback();
                }
            } else {
                callback();
            }
        };
        return {
            identifyCodes: "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            identifyCode: "",
            loginLoading: false,
            loginForm: {
                staffId: '',
                password: '',
                captcha: ''
            },
            loginRules: {
                staffId: [
                    {required: true, message: '', trigger: 'blur'}
                ],
                password :[
                    {required: true, message: '', trigger: 'blur'}
                ],
                captcha: [
                    {validator:checkCaptcha, trigger: 'blur'}
                ]
            },
            captcha: {
                show: false,
                src: ''
            },
            sysMsg: ''
        }
    },
    mounted() {
        if(this.captcha.show){
            this.identifyCode = "";
            this.makeCode(this.identifyCodes, 4);
        }
    },
    computed: {
        /**
         * 当一个组件需要获取多个状态时候
         * mapState通过扩展运算符将store.state.orderList 映射this.orderList 
         * 这个this 很重要，这个映射直接映射到当前Vue的this对象上
         */
        ...mapState({
            lang: state => state.lang,
            theme: state => state.theme
        })
    },
    watch: {
        "captcha.show"(val){
            this.loginRules.captcha[0].required = val
        }
    },
    beforeMount(){
        // 初始化错误信息。保证单独点击input时可以弹出正确的错误提示
        this.setErrMsg()
    },
    methods: {
        /**
         * 从vuex中获取
         * 用了 ... 扩展符后，才可以放进一个对象里
         * 只不过是把a,b都拿出来跟其他方法放在一起了而已
         */
        ...mapActions({
            login: 'auth/loginByWorkId',
            loadLang: 'loadLang'
        }),
        //登录提交
        submitForm(){
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    this.loginLoading = true;
                    this.login({
                        staffId: this.loginForm.staffId,
                        staffPwd: this.loginForm.password
                    }).then(res => {
                        if(res != null) {
                            if(res.login){
                                //跳转页面
                                this.$router.push('home')
                                this.loginLoading = false;
                            } else {
                                this.loginLoading = false;
                                this.$message({
                                  showClose: true,
                                  message: res.errorMsg,
                                  type: 'error'
                                });
                                this.makeCode(this.identifyCodes, 4);
                                //this.sysMsg = res.errorMsg  //设置错误显示
                                this.captcha.show = true   //显示验证码
                                //this.captcha.src = res.captcha //设置验证码路径
                            }
                        } else {
                            this.loginLoading = false;
                        }
                    })
                } else {
                    return false
                }
            });
        },
        //切换语言
        changeLang(val){
            if(val == this.lang) return
            // 切换语言后重新加载语言包，并对重置登陆表单
            this.loadLang(val).then(() => {
                this.setErrMsg()
                this.$refs.loginForm.resetFields()
            })
        },
        //切换主题
        changeTheme(val){
            if(val == this.lang) return
            setTheme(val)
            this.$store.commit("setThemeColor", val)
        },
        //动态设置错误信息
        setErrMsg(){
            this.loginRules.staffId[0].message = this.$t('global.errMsg.inputRequired', {cont: this.$t('global.staffId')})
            this.loginRules.password[0].message = this.$t('global.errMsg.inputRequired', {cont: this.$t('global.password')})
            //this.loginRules.captcha[0].message = this.$t('global.errMsg.inputRequired', {cont: this.$t('global.captcha')})
        },
        //设置验证
        randomNum(min, max) {
          return Math.floor(Math.random() * (max - min) + min);
        },
        refreshCode() {
          this.identifyCode = "";
          this.makeCode(this.identifyCodes, 4);
        },
        makeCode(o, l) {
          for (let i = 0; i < l; i++) {
            this.identifyCode += this.identifyCodes[
              this.randomNum(0, this.identifyCodes.length)
            ];
          }
          console.log(this.identifyCode);
        }
    },
    components: { SIdentify }
}
</script>