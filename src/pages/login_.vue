<template>
  <div class="login-vue_" :style="bg">
    <div class="loginArea">
      <div class="sysLabel">郑州气象局人影作业指挥系统</div>
      <div class="container">
        <p class="title">登录</p>
        <Form style="margin-top: 220px !important;margin-right: 97px;" ref="fromModel" :model="fromModel" :rules="ruleInline">
          <FormItem prop="user">
            <Input type="text" v-model="fromModel.user" clearable placeholder="用户名">
              <!--<Icon style="color: black" type="ios-person-outline" slot="prepend"></Icon>-->
            </Input>
          </FormItem>
          <FormItem prop="password">
            <Input type="password" v-model="fromModel.password" placeholder="密码">
              <!--<Icon style="color: black" type="ios-lock-outline" slot="prepend"></Icon>-->
            </Input>
          </FormItem>
          <FormItem style="margin-top: 140px;">
            <Button :loading="isShowLoading" style="width: 50px;" class="submit" type="primary" @click="handleSubmit('fromModel')">登录</Button>
            <span class="reset" ><Button  style="width: 50px;margin-left:50px;" type="primary" @click="resetPwd('fromModel')">重置</Button></span>
          </FormItem>
        </Form>
      </div>
    </div>
  </div>
</template>

<script>
    import sha1 from 'js-sha1';
    export default {
        name: 'login',
        data() {
            return {
                fromModel: {
                    user: '',
                    password: ''
                },
                ruleInline: {
                    user: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                    password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
                },
                accountError: '',
                pwdError: '',
                isShowLoading: false,
                bg: {}
            }
        },
        created() {
            this.bg.backgroundImage = 'url(' + require('../assets/images/bg07.png') + ')'
        },
        watch: {
            $route: {
                handler: function(route) {
                    this.redirect = route.query && route.query.redirect
                },
                immediate: true
            }
        },
        methods: {
            resetPwd() {
                this.fromModel.user = '';
                this.fromModel.password = '';
            },
            register() {
                console.log('注册账号')
            },
            forgetPwd() {
                console.log('忘记密码')
            },
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.isShowLoading = true;
                        this.$api.login({ username:  this.fromModel.user, password: sha1(this.fromModel.password) })
                            .then(res => {
                                localStorage.setItem('userName', res.data.userName);
                                localStorage.setItem('token', res.data.token);
                                localStorage.setItem('roleId', res.data.roleId);
                                this.$router.push({path: this.redirect || '/'});
                            })
                            .finally(() => {
                                this.isShowLoading = false;
                            })
                    }
                });
            }
        }
    }
</script>

<style>
  .login-vue_ {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    background-color: #081324;
    background-position: 6%;
    background-size: 94%;
    background-repeat: no-repeat;
  }
  .loginArea {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .login-vue_ .sysLabel {
    font-size: 47px;
    position: absolute;
    letter-spacing: 3px;
    top: 50px;
    left: 125px;
  }
  .login-vue_ .container {
    padding: 48px 30px 40px 70px;
    position: absolute;
    top: 0px;
    right: -83px;
    background: #1D2436;
    height: 100%;
    width: 480px;
  }
  .login-vue_ .ivu-input {
    background-color: #151A2D;
    color: #fff;
    outline: #fff;
    border-color: #151A2D;
  }
  .login-vue_ ::-webkit-input-placeholder { /* WebKit, Blink, Edge */
    color: rgba(255, 255, 255, .8);
  }
  .login-vue_ :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color: rgba(255, 255, 255, .8);
  }
  .login-vue_ ::-moz-placeholder { /* Mozilla Firefox 19+ */
    color: rgba(255, 255, 255, .8);
  }
  .login-vue_ :-ms-input-placeholder { /* Internet Explorer 10-11 */
    color: rgba(255, 255, 255, .8);
  }
  .login-vue_ .title {
    font-size: 46px;
    margin-bottom: 20px;
    letter-spacing: 4px;
  }
  .login-vue_ .input-c {
    margin: auto;
    width: 300px;
  }
  .login-vue_ .error {
    color: red;
    text-align: left;
    margin: 5px auto;
    font-size: 12px;
    padding-left: 30px;
    height: 20px;
  }
  .login-vue_ .submit {
    width: 318px;
  }
  .login-vue_ .account {
    margin-top: 30px;
  }
  .login-vue_ .account span {
    cursor: pointer;
  }
  .login-vue_ .ivu-icon {
    color: #eee;
  }
  .login-vue_ .ivu-icon-ios-close-circle {
    color: #777;
  }
</style>


