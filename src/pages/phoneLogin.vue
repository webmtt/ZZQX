<template>
  <div class="login-vue-Phone" :style="bg">
    <div style="color: #FFFFFF;padding: 10px;font-size: 13px;z-index:2000;position: absolute;top: 0px;right: 0px;">
      <div class="h-right" style="float: right;">
              <Dropdown trigger="click" @on-click="userOperate" @on-visible-change="showArrow">
                  <div class="pointer">
                      <span>{{userName}}</span>
                      <Icon v-show="arrowDown" type="md-arrow-dropdown"/>
                      <Icon v-show="arrowUp" type="md-arrow-dropup"/>
                  </div>
                  <DropdownMenu slot="list">
                      <!-- name标识符 -->
                      <!--<DropdownItem v-has-hide="'/sysUser/user/updatePwd'" name="1">修改密码</DropdownItem>-->
                      <DropdownItem divided  name="3">退出登录</DropdownItem>
                  </DropdownMenu>
              </Dropdown>
          </div>
      </div>
    <div class="loginAreaPhone">
      <div class="container" style="margin-top: 399px;">
        <Form ref="fromModel" :model="fromModel" :rules="ruleInline">
          <FormItem prop="user" style="display:none;">
            <Input type="text" v-model="fromModel.user" clearable placeholder="登录">
              <Icon style="color: black" type="ios-person-outline" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <FormItem prop="password" style="display:none;">
            <Input type="password" v-model="fromModel.password" placeholder="密码">
              <Icon style="color: black" type="ios-lock-outline" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <FormItem class="buttonSubmit">
            <Button :loading="isShowLoading"  class="submit" type="primary" @click="resultHandleSubmit('fromModel')">作业情况上报</Button>
          </FormItem>
          <FormItem class="buttonSubmits">
            <Button :loading="isShowLoadings" class="submit" type="primary" @click="infoHandleSubmit('fromModel')">作业点准备情况上报</Button>
          </FormItem>
        </Form>
      </div>
    </div>
  </div>
</template>

<script>
    import { resetTokenAndClearUser } from '../utils';
    import sha1 from 'js-sha1';
    export default {
        name: 'login',
        data() {
            return {
                arrowUp: false, // 用户详情向上箭头
                arrowDown: true, // 用户详情向下箭头
                userName: '',
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
                isShowLoadings: false,
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
            // 控制用户三角箭头显示状态
            showArrow(flag) {
                this.arrowUp = flag
                this.arrowDown = !flag
            },
            userOperate(name) {
              switch(name) {
                  case '1':
                      // 修改密码
                      this.gotoPage('/manage/password')
                      break
                  case '2':
                      // 基本资料
                      this.gotoPage('userinfo')
                      break
                  case '3':
                      resetTokenAndClearUser()
                      this.$router.replace({name: 'login'})
                      break
              }
            },
            register() {
                console.log('注册账号')
            },
            forgetPwd() {
                console.log('忘记密码')
            },
            resultHandleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.isShowLoading = true;
                        this.$api.login({ username:  this.fromModel.user, password: sha1(this.fromModel.password) })
                            .then(res => {
                                localStorage.setItem('userName', res.data.userName);
                                localStorage.setItem('token', res.data.token);
                                localStorage.setItem('roleId', res.data.roleId);
                                this.$router.push({path: '/workResult'});
                            })
                            .finally(() => {
                                this.isShowLoading = false;
                            })
                    }
                });
            },
            infoHandleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.isShowLoadings = true;
                        this.$api.login({ username:  this.fromModel.user, password: sha1(this.fromModel.password) })
                            .then(res => {
                                localStorage.setItem('userName', res.data.userName);
                                localStorage.setItem('token', res.data.token);
                                localStorage.setItem('roleId', res.data.roleId);
                                this.$router.push({path: '/workInfo'});
                            })
                            .finally(() => {
                                this.isShowLoadings = false;
                            })
                    }
                });
            }
        },
        mounted() {
        // 设置用户信息
        this.userName = localStorage.getItem('userName')
        }
    }
</script>

<style>
  .login-vue-Phone {
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
  .loginAreaPhone {
    padding: 65px 0 0;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0px;
    right: 0px;
    height: 100%;
  }
  .login-vue-Phone .sysLabel {
    display: flex;
    flex: 1;
    text-align: center;
    align-items: center;
    font-weight: bold;
    font-size: 26px;
    padding: 0 30px;
  }
  .login-vue-Phone .container {
    width: 400px;
    text-align: center;
    /*padding: 415px 30px 40px 30px;*/
  }
  .login-vue-Phone .ivu-input {
    background-color: transparent;
    color: #fff;
    outline: #fff;
    border-color: #fff;
  }
  .login-vue-Phone ::-webkit-input-placeholder { /* WebKit, Blink, Edge */
    color: rgba(255, 255, 255, .8);
  }
  .login-vue-Phone :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color: rgba(255, 255, 255, .8);
  }
  .login-vue-Phone ::-moz-placeholder { /* Mozilla Firefox 19+ */
    color: rgba(255, 255, 255, .8);
  }
  .login-vue-Phone :-ms-input-placeholder { /* Internet Explorer 10-11 */
    color: rgba(255, 255, 255, .8);
  }
  .login-vue-Phone .title {
    font-size: 60px;
    font-weight: bold;
    margin-bottom: 20px;
    letter-spacing: 10px;
  }
  .login-vue-Phone .input-c {
    margin: auto;
    width: 300px;
  }
  .login-vue-Phone .error {
    color: red;
    text-align: left;
    margin: 5px auto;
    font-size: 12px;
    padding-left: 30px;
    height: 20px;
  }
  .login-vue-Phone .submit {
    width: 260px;
  }
  .login-vue-Phone .account {
    margin-top: 30px;
  }
  .login-vue-Phone .account span {
    cursor: pointer;
  }
  .login-vue-Phone .ivu-icon {
    color: #eee;
  }
  .login-vue-Phone .ivu-icon-ios-close-circle {
    color: #777;
  }
</style>


