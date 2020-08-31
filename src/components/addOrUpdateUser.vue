<template>
    <Modal :mask-closable="false" :closable="false" :z-index="10" v-model="show" :title="title">
        <Form ref="userForm" :model="formModel" :label-width="100" v-if="show" :rules="ruleValidate">
            <FormItem label="用户名：" prop="userName">
                <Input :disabled="Boolean(modalData.data)" v-model="formModel.userName" placeholder="用户名" />
            </FormItem>
            <FormItem label="真实姓名：" prop="name">
                <Input v-model="formModel.name" placeholder="真实姓名" />
            </FormItem>
            <FormItem label="电  话：" prop="phone">
                <Input v-model="formModel.phone" placeholder="用户电话" />
            </FormItem>
            <FormItem label="用户角色：" prop="sys_role_id">
                <Select v-model="formModel.sys_role_id">
                    <Option v-for="(item, index) in roleOption" :value="item.id" :key="index">{{ item.name }}</Option>
                </Select>
            </FormItem>
            <FormItem v-if="!modalData.data" label="用户密码：" prop="password">
                <Input type="password" v-model="formModel.password" placeholder="用户密码" />
            </FormItem>
            <FormItem v-if="!modalData.data" label="确认密码：" prop="repassword">
                <Input type="password" v-model="formModel.repassword" placeholder="用户密码" />
            </FormItem>
            <FormItem label="所属站点：" v-if="stationOption.length" prop="workStationCode">
                <Select v-model="formModel.workStationCode">
                    <Option v-for="item in stationOption" :value="item.workStationCode" :key="item.workStationName">{{ item.workStationName }}</Option>
                </Select>
            </FormItem>
            <FormItem v-if="modalData.data" label="用户状态：" prop="status">
                <Select v-model.number="formModel.status">
                    <Option v-for="item in statusOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
        </Form>
        <template #footer>
            <i-button :disabled="loading" type="primary" @click="closeModal">取消</i-button>
            <i-button :loading="loading" type="primary" @click="updateOrAddUser('userForm')">保存</i-button>
        </template>
    </Modal>
</template>

<script>
    import sha1 from 'js-sha1';
    import addOrUpdateUser from '@/components/addOrUpdateUser';
    export default {
        data () {
            // 验证手机;
            const validatePhone = (rule, value, callback) => {
                const reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
                if (!reg.test(value)) {
                    callback(new Error('手机号不合法'));
                }
                callback();
            };
            // 验证用户名;
            const validateUserName = (rule, value, callback) => {
                const reg = /^[a-zA-Z0-9]{1,}$/
                if (!reg.test(value)) {
                    callback(new Error('用户名不合法,用户名只能由字母或数字组成'));
                }
                callback();
            };
            const validatePassword = (rule, value, callback) => {
                if (this.formModel.repassword !== '') {
                    // 对第二个密码框单独验证
                    this.$refs.userForm.validateField('repassword');
                }
                callback();
            };
            const validateRePassword = (rule, value, callback) => {
                if (value !== this.formModel.password) {
                    callback(new Error('两次输入的密码不相等'));
                }
                callback();
            };
            return {
                loading: false,
                stationOption: [],
                formModel: this.resetFormModel(),
                roleOption: [],
                statusOptions: [
                    { value: 0, label: '作废' },
                    { value: 1, label: '正常' },
                    { value: 2, label: '锁定' }
                ],
                show: this.modalData.show,
                title: '新增用户',
                ruleValidate: {
                    userName: [
                        { required: true, message: '用户名不能为空', trigger: 'blur' },
                        { validator: validateUserName, trigger: 'blur' }
                    ],
                    name: [{ required: true, message: '真实名不能为空', trigger: 'blur' }],
                    phone: [
                        { required: true, message: '电话不能为空', trigger: 'blur' },
                        { validator: validatePhone, trigger: 'blur' }
                    ],
                    sys_role_id: [{ required: true, type: 'number', message: '角色不能为空', trigger: 'change', type: 'number' }],
                    password: [
                        { required: true, message: '密码不能为空', trigger: 'blur' },
                        { validator: validatePassword, trigger: 'blur' }
                    ],
                    repassword: [
                        { required: true, message: '确认密码不能为空', trigger: 'blur' },
                        { validator: validateRePassword, trigger: 'blur' }
                    ],
                    workStationCode: [{ required: true, message: '站点不能为空', trigger: 'change'} ],
                }
            }
        },
        computed: {},
        watch: {
            modalData(newValue) {
                this.title = newValue.data ? '编辑用户信息' : '新增用户信息';
                this.show = newValue.show;

                const plainModel = this.resetFormModel();
                if (this.modalData.data) {
                    Object.keys(plainModel).forEach(key => plainModel[key] = this.modalData.data.row[key]);
                }
                this.formModel = plainModel;
            }
        },
        components: {addOrUpdateUser},
        props: ['modalData'],
        methods: {
            resetFormModel() {
                return {
                    name: '',
                    userName: '',
                    phone: '',
                    sys_role_id: '',
                    password: '',
                    repassword: '',
                    status: 1,
                    workStationCode: ''
                };
            },
            closeModal() {
                this.$refs['userForm'].resetFields();
                this.show = false;
            },
            updateOrAddUser(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        const titlePreText = this.modalData.data ? '更新' : '新增';
                        const functionName = this.modalData.data ? 'updateUserName' : 'InsertUserName';
                        if (this.modalData.data) {
                            var {password, repassword, ...params} = this.formModel;
                        } else {
                            var {repassword, ...params} = this.formModel;
                            params.password = sha1(params.password);
                        }
                        this.loading = true;
                        this.$api[functionName](params)
                        .then(res => {
                            this.$Message.info(`${titlePreText}成功`);
                            this.show = false;
                            this.$emit('handleSucc');
                        }).finally(res => this.loading = false);
                    } else {
                        console.log('fail');
                    }
                })
                
            },
        },
        mounted() {
            //
            this.$api.getStationLoc()
                .then(res => this.stationOption = res.data)
                .catch(err => this.stationOption = []);
            // this.$api.getStationLocStove()
            //     .then(res => this.stationOption = res.data)
            //     .catch(err => this.stationOption = []);
            // 查询所有角色;
            this.$api.getRoleLists()
                .then(res => {
                    this.roleOption = res.data;
                })
                .catch(error => {
                    this.roleOption = [];
                });
        }
    }
</script>
