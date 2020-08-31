<template>
  <div class="login-vue" :style="bg">
    <div class="loginArea">
      <div class="sysLabel">郑州气象局人影作业指挥系统</div>
      <div class="container">
        <Form ref="fromModel" :model="fromModel" :rules="ruleInline">
          <FormItem prop="user" class="buttonSubmit">
            <Input prefix="ios-contact" style="width:213px;margin-right:84px;" type="text" v-model="fromModel.user" clearable placeholder="登录">
            </Input>
          </FormItem>
          <FormItem prop="password" class="buttonSubmit">
            <Input prefix="md-lock" style="width:213px;margin-right:84px;"  type="password" v-model="fromModel.password" placeholder="密码">
            </Input>
          </FormItem>
          <FormItem class="buttonSubmitss">
            <Button :loading="isShowLoading" class="submit" type="primary" @click="handleSubmit('fromModel')">登录</Button>
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
  .login-vue {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    background: #0D111D;
    background-size: 127%;
    background-position: -49% 27%;
    background-repeat: no-repeat;
  }
  .loginArea {
    padding: 65px 0 0;
    justify-content: center;
    align-items: center;
    top: 0px;
    right: 0px;
    height: 100%;
  }
  .login-vue .sysLabel {
    font-weight: bold;
    font-size: 26px;
    position: absolute;
    top: 78px;
    left: 42px;
  }
  .login-vue .container {
    width: 400px;
    text-align: center;
    /*padding: 484px 30px 40px 30px;*/
    padding: 374px 30px 40px 30px;
  }
  .login-vue .ivu-input {
    background-color: transparent;
    color: #fff;
    outline: #fff;
    border-color: #fff;
  }
  .login-vue ::-webkit-input-placeholder { /* WebKit, Blink, Edge */
    color: rgba(255, 255, 255, .8);
  }
  .login-vue :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color: rgba(255, 255, 255, .8);
  }
  .login-vue ::-moz-placeholder { /* Mozilla Firefox 19+ */
    color: rgba(255, 255, 255, .8);
  }
  .login-vue :-ms-input-placeholder { /* Internet Explorer 10-11 */
    color: rgba(255, 255, 255, .8);
  }
  .login-vue .title {
    font-size: 60px;
    font-weight: bold;
    margin-bottom: 20px;
    letter-spacing: 10px;
  }
  .login-vue .input-c {
    margin: auto;
    width: 300px;
  }
  .login-vue .error {
    color: red;
    text-align: left;
    margin: 5px auto;
    font-size: 12px;
    padding-left: 30px;
    height: 20px;
  }
  .login-vue .submit {
    width: 260px;
    margin-right: -3px;
  }
  .login-vue .account {
    margin-top: 30px;
  }
  .login-vue .account span {
    cursor: pointer;
  }
  .login-vue .ivu-icon {
    color: #eee;
  }
  .login-vue .ivu-icon-ios-close-circle {
    color: #777;
  }
</style>


