<template>
    <Modal :mask-closable="false" :closable="false" :z-index="10" v-model="show" :title="title">
        <Form ref="userForm" :model="formModel" v-if="show" :label-width="100" :rules="ruleValidate">
            <FormItem label="角色名称：" prop="name">
                <Input v-model="formModel.name" placeholder="角色名称" />
            </FormItem>
            <FormItem label="角色备注：" prop="description">
                <Input v-model="formModel.description" placeholder="角色备注" />
            </FormItem>
        </Form>
        <template #footer>
            <i-button :disabled="loading" type="primary" @click="closeModal">取消</i-button>
            <i-button :loading="loading" type="primary" @click="updateOrAddRole('userForm')">保存</i-button>
        </template>
    </Modal>
</template>

<script>
    export default {
        data () {
            // 验证角色名称;
            const validateRoleName = (rule, value, callback) => {
                if (value.trim().length < 3 ) {
                    callback(new Error('角色名不合法,角色名长度不能小于3个字符'));
                } else if (value.trim().length > 12 ) {
                    callback(new Error('角色名不合法,角色名长度不能大于于12个字符'));
                }
                callback();
            };
            // 验证备注;
            const validateDescription = (rule, value, callback) => {
                if (value && value.length > 72) {
                    callback(new Error('备注不能超过72个字符'));
                }
                callback();
            };
            return {
                loading: false,
                formModel: this.resetFormModel(),
                show: this.modalData.show,
                title: '新增用户',
                ruleValidate: {
                    name: [
                        { required: true, message: '角色名称不能为空', trigger: 'blur' },
                        { validator: validateRoleName, trigger: 'blur' }
                    ],
                    description: [{ validator: validateDescription, trigger: 'blur' }],
                }
            }
        },
        computed: {
            stationOption() {
                return this.$store.state.stationLoc
            }
        },
        watch: {
            modalData(newValue) {
                this.title = newValue.data ? '编辑角色信息' : '新增角色信息';
                this.show = newValue.show;

                const plainModel = this.resetFormModel();
                if (this.modalData.data) {
                    Object.keys(plainModel).forEach(key => plainModel[key] = this.modalData.data.row[key]);
                }
                this.formModel = plainModel;
            }
        },
        components: {},
        props: ['modalData'],
        methods: {
            resetFormModel() {
                return {
                    name: '',
                    description: '',
                    id: ''
                };
            },
            closeModal() {
                this.$refs['userForm'].resetFields();
                this.show = false;
            },
            updateOrAddRole(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        const titlePreText = this.modalData.data ? '更新' : '新增';
                        const functionName = this.modalData.data ? 'updateRole' : 'insertRole';
                        if (!this.modalData.data) {
                            var {id, ...params} = this.formModel;
                        } else {
                            var {...params} = this.formModel;
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
        mounted() {}
    }
</script>
