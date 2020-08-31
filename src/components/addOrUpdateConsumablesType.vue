<template>
<Modal :mask-closable="false" :closable="false" width="610px" v-model="show" :title="title">
    <Form ref="equipmentForm" inline :model="formModel" v-if="show" :label-width="100" :rules="ruleValidate">
        <FormItem label="器材名称" prop="name">
            <Input size="small" v-model="formModel.name" placeholder="器材名称" style="width: 160px" />
        </FormItem>
        <FormItem label="型号" prop="type">
            <Input size="small" v-model="formModel.type" placeholder="型号" style="width: 160px" />
        </FormItem>
        <FormItem label="数量" prop="number">
            <InputNumber :min="0" size="small" v-model.number="formModel.number" placeholder="数量" style="width: 160px" />
        </FormItem>
        <FormItem label="描述"  prop="description">
            <Input size="small" v-model="formModel.description" placeholder="描述" style="width: 160px" />
        </FormItem>
        <FormItem label="供应商"  prop="companyName">
            <Input size="small" v-model="formModel.companyName" placeholder="供应商" style="width: 160px" />
        </FormItem>
        <FormItem label="填报人" prop="filler">
             <Input size="small" v-model="formModel.filler" placeholder="填报人" style="width: 160px" />
        </FormItem>
    </Form>
    <template #footer>
        <i-button :disabled="loading" type="primary" @click="closeModal">取消</i-button>
        <i-button :loading="loading" type="primary" @click="updateOrAddConsumables('equipmentForm')">保存</i-button>
    </template>
    </Modal>
</template>

<script>
    export default {
        data () {
            return {
                loading: false,
                formModel: this.resetFormModel(),
                workStationOption: [],
                show: this.modalData.show,
                title: '新增器材类型',
                ruleValidate: {
                    number: [{ required: true, type: 'number', message: '数量不能为空', trigger: 'blur' }],
                    name: [{ required: true, message: '器材名称不能为空', trigger: 'blur' }],
                    type: [{ required: true, message: '型号不能为空', trigger: 'blur' }],
                    filler: [{ required: true, message: '填表人不能为空', trigger: 'blur' }],
                    companyName: [{ required: true, message: '供应商名称不能为空', trigger: 'blur' }],
                    description: [{ required: true, message: '描述不能为空', trigger: 'blur' }],
                }            }
        },
        computed: {},
        watch: {
            modalData(newValue) {
                this.title = newValue.data ? '编辑器材类型' : '新增器材类型';
                this.show = newValue.show;

                const plainModel = this.resetFormModel();
                if (this.modalData.data) {
                    Object.keys(plainModel).forEach(key => {
                        if (['gunshot', 'heigthest'].includes(key)) {
                            plainModel[key] = parseFloat(this.modalData.data.row[key]);
                        } else {
                            plainModel[key] = this.modalData.data.row[key];
                        }
                    });
                }
                this.formModel = plainModel;
            }
        },
        components: {},
        props: ['modalData'],
        methods: {
            resetFormModel() {
                return {
                    number: 0,
                    id: 0,
                    companyName: '', // 公司名称
                    description: '', // 描述
                    filler: '', // 填表人
                    name: '',
                    type: '', // 型号
                };
            },
            closeModal() {
                this.$refs['equipmentForm'].resetFields();
                this.show = false;
            },
            updateOrAddConsumables(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        const titlePreText = this.modalData.data ? '更新' : '新增';
                        var {...params} = this.formModel;
                        this.loading = true;
                        if(titlePreText=='新增'){
                            this.$api.insertOrUpdateConsumables(params)
                            .then(res => {
                                this.$Message.info(`${titlePreText}成功`);
                                this.show = false;
                                this.$emit('handleSucc');
                            }).finally(res => this.loading = false);
                        }else{
                           this.$api.updateOrUpdateConsumables(params)
                            .then(res => {
                                this.$Message.info(`${titlePreText}成功`);
                                this.show = false;
                                this.$emit('handleSucc');
                            }).finally(res => this.loading = false);
                        }
                    } else {
                        console.log('fail');
                    }
                })
            },
        },
        mounted() {}
    }
</script>
