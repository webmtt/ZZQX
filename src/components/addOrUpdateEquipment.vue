<template>
<Modal :mask-closable="false" :closable="false" width="610px" v-model="show" :title="title">
    <Form ref="equipmentForm" inline :model="formModel" v-if="show" :label-width="100" :rules="ruleValidate">
        <FormItem label="装备名称" prop="name">
            <Input size="small" v-model="formModel.name" placeholder="装备名称" style="width: 160px" />
        </FormItem>
        <FormItem label="型号" prop="type">
            <Input size="small" v-model="formModel.type" placeholder="型号" style="width: 160px" />
        </FormItem>
        <FormItem label="射程" prop="gunshot">
            <InputNumber :min="0" size="small" v-model.number="formModel.gunshot" placeholder="射程" style="width: 160px" />
        </FormItem>
        <FormItem label="最大高度" prop="heigthest">
            <InputNumber :min="0" size="small" v-model.number="formModel.heigthest" placeholder="最大高度" style="width: 160px" />
        </FormItem>
        <FormItem label="数量" prop="number">
            <InputNumber :min="0" size="small" v-model.number="formModel.number" placeholder="数量" style="width: 160px" />
        </FormItem>
        <FormItem label="填报人" prop="filler">
             <Input size="small" v-model="formModel.filler" placeholder="填报人" style="width: 160px" />
        </FormItem>
        <FormItem label="单位名称"  prop="companyName">
            <Input size="small" v-model="formModel.companyName" placeholder="单位名称" style="width: 160px" />
        </FormItem>
    </Form>
    <template #footer>
        <i-button :disabled="loading" type="primary" @click="closeModal">取消</i-button>
        <i-button :loading="loading" type="primary" @click="updateOrAddEquipment('equipmentForm')">保存</i-button>
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
                title: '新增作业装备',
                ruleValidate: {
                    name: [{ required: true, message: '装备名称不能为空', trigger: 'blur' }],
                    type: [{ required: true, message: '型号不能为空', trigger: 'blur' }],
                    gunshot: [{ required: true, type: 'number', message: '射程不能为空', trigger: 'blur' }],
                    heigthest: [{ required: true, type: 'number', message: '最大高度不能为空', trigger: 'blur' }],
                    number: [{ required: true, type: 'number', message: '数量不能为空', trigger: 'blur' }],
                    filler: [{ required: true, message: '填表人不能为空', trigger: 'blur' }],
                    filldata: [{ required: true, type: 'date', message: '填表日期不能为空', trigger: 'change' }],
                    companyName: [{ required: true, message: '公司名称不能为空', trigger: 'blur' }],
                }
            }
        },
        computed: {},
        watch: {
            modalData(newValue) {
                this.title = newValue.data ? '编辑作业装备' : '新增作业装备';
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
                    id: 0,
                    companyName: '', // 公司名称
                    name: '', // 装备名称：
                    filldata: '',
                    filler: '', // 填表人
                    gunshot: 0, // 射程
                    heigthest: 0, // 最大高度：
                    number: 0,
                    type: '', // 型号
                };
            },
            closeModal() {
                this.$refs['equipmentForm'].resetFields();
                this.show = false;
            },
            updateOrAddEquipment(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        const titlePreText = this.modalData.data ? '更新' : '新增';
                        var {...params} = this.formModel;
                        params.filldata = this.$moment(params.filldata).format('YYYY-MM-DD');
                        params.gunshot += '';
                        params.heigthest += '';
                        this.loading = true;
                        if(titlePreText == '更新'){
                            this.$api.updateOrUpdateEquipment(params)
                            .then(res => {
                                this.$Message.info(`${titlePreText}成功`);
                                this.show = false;
                                this.$emit('handleSucc');
                            }).finally(res => this.loading = false);
                        }else{
                            this.$api.insertOrUpdateEquipment(params)
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
