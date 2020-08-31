<template>
    <div style="padding: 20px;background-color: #1D2437;">
        <Form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="80">
            <FormItem label="旧 密 码：" prop="password">
                <Input style="width: 400px" type="password" v-model="formCustom.password"></Input>
            </FormItem>
            <FormItem label="新 密 码：" prop="newPassword">
                <Input style="width: 400px" type="password" v-model="formCustom.newPassword"></Input>
            </FormItem>
            <FormItem label="确认密码：" prop="passwordCheck">
                <Input style="width: 400px" type="password" v-model="formCustom.passwordCheck"></Input>
            </FormItem>
            <FormItem class="passWordModefy">
                <Button type="primary" @click="handleSubmit('formCustom')">提交修改</Button>
                <!--<Button @click="handleReset('formCustom')" style="margin-left: 8px">取消</Button>-->
                <Button @click="returnPage" style="margin-left: 8px">取消</Button>
            </FormItem>
        </Form>
    </div>
</template>
<script>
    import sha1 from 'js-sha1';
    import { resetTokenAndClearUser } from '../utils';
    export default {
        data () {
            const validateOldPass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('旧密码不能为空'));
                }
                callback();
            };
            const validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('密码不能为空'));
                } else {
                    if (this.formCustom.passwordCheck !== '') {
                        // 对第二个密码框单独验证
                        this.$refs.formCustom.validateField('passwordCheck');
                    }
                    callback();
                }
            };
            const validatePassCheck = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                }else if(this.formCustom.password == this.formCustom.newPassword){
                    callback(new Error('新密码不能与旧密码一致'));
                } else if (value !== this.formCustom.newPassword) {
                    callback(new Error('两次输入的密码不相等'));
                } else {
                    callback();
                }
            };  
            return {
                formCustom: {
                    password: '',
                    newPassword: '',
                    passwordCheck: ''
                },
                ruleCustom: {
                    password: [{ validator: validateOldPass, trigger: 'blur' }],
                    newPassword: [{ validator: validatePass, trigger: 'blur' }],
                    passwordCheck: [{ validator: validatePassCheck, trigger: 'blur' }]
                }
            }
        },
        methods: {
            returnPage() {
                this.formCustom.password = '';
                this.formCustom.newPassword = '';
                this.formCustom.passwordCheck = '';
            },
            handleSubmit (name) {
                const userName = localStorage.getItem('userName');
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        const param = { userName, password: sha1(this.formCustom.password), newPassword: sha1(this.formCustom.newPassword) };
                        this.$api.updatePassword(param)
                            .then(res => {
                                this.$Modal.success({
                                    title: '提示',
                                    content: '密码修改成功!',
                                    zIndex: 15000,
                                    onOk: () => {
                                        this.$refs[name].resetFields();
                                        resetTokenAndClearUser();
                                        this.$router.replace({name: 'login'})
                                    }
                                });
                            });
                    }
                })
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            }
        }
    }
</script>