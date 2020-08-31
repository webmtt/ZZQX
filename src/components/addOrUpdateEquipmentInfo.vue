<template>
<Modal :mask-closable="false" :closable="false" width="610px" v-model="show" :title="title">
    <Form ref="equipmentForm" inline :model="formModel" v-if="show" :label-width="100" :rules="ruleValidate">
        <FormItem label="装备类型" prop="name">
            <Select v-model="formModel.name" :label-in-value="true" @on-change="optionsChanged" style="width: 162px">
                <Option v-for="(item,ix) in equipmentOptions" :label="item.name+' '+item.type" :value="item.name" :key="ix">{{item.name+' '+item.type}}</Option>
            </Select>
        </FormItem>
        <FormItem label="作业站点" prop="stationName">
            <Select v-model="formModel.stationName" :label-in-value="true" @on-change="NameOptionsChanged" style="width: 162px">
                <Option v-for="(item,index) in stationNameOptions"  :value="item.workStationName" :key="index">{{item.workStationName}}</Option>
            </Select>
        </FormItem>
        <FormItem label="数量" prop="number">
            <InputNumber size="small" type='number' v-model="formModel.number" placeholder="数量" style="width: 160px" />
        </FormItem>
        <FormItem label="填报人" prop="filler">
             <Input size="small" v-model="formModel.filler" placeholder="填报人" style="width: 160px" />
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
                equipmentOptions: [],
                stationNameOptions: [],
                loading: false,
                formModel: this.resetFormModel(),
                workStationOption: [],
                show: this.modalData.show,
                title: '新增器材信息',
                ruleValidate: {
                    name: [{ required: true, message: '器材类型不能为空', trigger: 'blur' }],
                    filler: [{ required: true, message: '填表人不能为空', trigger: 'blur' }],
                    number: [{ required: true,type:'number', message: '数量不能为空', trigger: 'blur' }],
                    stationName: [{ required: true, message: '作业站点不能为空', trigger: 'blur' }],
                }
            }
        },
        computed: {},
        watch: {
            modalData(newValue) {
                this.title = newValue.data ? '编辑器材信息' : '新增器材信息';
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
            optionsChanged(e) {
                const labelType=e.label;
                this.formModel.type=labelType.substr(labelType.indexOf(' ') + 1);
            },
            NameOptionsChanged(e) {
                for(var i=0;i<this.stationNameOptions.length;i++){
                    if(this.formModel.stationName == this.stationNameOptions[i].workStationName){
                      this.formModel.stationCode = this.stationNameOptions[i].workStationCode
                    }
                }
            },
            resetFormModel() {
                return {
                    id: 0,
                    filler: '', // 填表人
                    number: 0,
                    stationName: '', // 作业站点
                    name: '',  //器材类型
                    type: '',
                    stationCode: ''
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
                        this.loading = true;
                        if(titlePreText == '新增'){
                            this.$api.insertOrUpdateEquipmentInfo(params)
                            .then(res => {
                                this.$Message.info(`${titlePreText}成功`);
                                this.show = false;
                                this.$emit('handleSucc');
                            }).finally(res => this.loading = false);
                        }else{
                            this.$api.updateOrUpdateEquipmentInfo(params)
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
        mounted() {
             // 获得所有装备类型;
            this.$api.getAllEquipmentType()
            .then(res => {
                // this.equipments = res.data;
                const options = [];
                // const options_ = [];
                res.data.forEach(item => {
                    if (options.every(innerItem => innerItem !== item.type)) {
                        options.push(item);
                    }
                    // if (options_.every(innerItem => innerItem !== item.equipment)) {
                    //     options_.push(item);
                    // }
                });
                this.equipmentOptions = options;
                // this.workTypeOptions = options_;
            });
            this.$api.getAllStationName()
            .then(res => {
                const nameOptions = [];
                res.data.forEach(item => {
                    if (nameOptions.every(innerItem => innerItem !== item.workStationName)) {
                        nameOptions.push(item);
                    }
                });
                this.stationNameOptions = nameOptions;
            });
        }
    }
</script>
