<template>
<Modal  :mask-closable="false"  :closable="false" :z-index="10" width="610px" v-model="show" :title="title">
    <Form ref="pointReportForm" inline :model="formModel" v-if="show" :label-width="100" :rules="ruleValidate">
        <FormItem label="站点名称" prop="stationName">
            <Select @on-change="NameOptionsChanged" v-model="formModel.stationName" :label-in-value="true" style="width: 162px">
                <Option v-for="(item,index) in stationNameOptions" :value="item.workStationName" :key="index">{{item.workStationName}}</Option>
            </Select>
        </FormItem>
        <FormItem label="站点编号" prop="stationCode">
            <Input size="small" disabled v-model="formModel.stationCode" placeholder="站点编号" style="width: 160px" />
        </FormItem>
        <!--<FormItem label="作业方式" prop="workType">
            <Select v-model="formModel.workType" multiple :label-in-value="true" style="width: 162px">
                <Option v-for="(item,ix) in workTypeOptions" :value="item" :key="ix">{{item}}</Option>
            </Select>
        </FormItem>-->
        <FormItem label="装备类型" prop="equipmentType">
            <Select v-model="formModel.equipmentType" multiple :label-in-value="true" style="width: 162px">
                <!--<Option v-for="(item,ix) in equipmentOptions" :value="item.type" :key="ix">{{item.equipment+'('+item.type+')'}}</Option>-->
                <Option v-for="(item,ix) in equipmentOptions" :value="item.type" :key="ix">{{item.name+' '+item.type+' '}}</Option>
            </Select>
        </FormItem>
        <FormItem label="车辆数">
            <InputNumber size="small" type='number' v-model.number="formModel.carCount" placeholder="车辆" style="width: 160px" />
        </FormItem>
        <FormItem label="作业人数">
            <InputNumber size="small" type='number' v-model.number="formModel.peopleCount" placeholder="作业人数" style="width: 160px" />
        </FormItem>
        <FormItem label="指挥人员" prop="commander">
            <Select v-model="formModel.commander" size="small" :label-in-value="true" @on-change="optionsChanged" style="width: 250px">
              <Option v-for="(item,ix) in contactMultipleList" :label="item.name+' '+item.phone"  :value="item.name" :key="ix">{{item.name+' '+item.phone}}</Option>
            </Select>
        </FormItem>
    </Form>
    <template #footer>
        <i-button :disabled="loading" type="primary" @click="closeModal">取消</i-button>
        <i-button :loading="loading" type="primary" @click="updateOrAddPointReport('pointReportForm')">保存</i-button>
    </template>
    </Modal>
</template>

<script>
    export default {
        data () {
            return {
                // commanderPhone: '',
                loading: false,
                formModel: this.resetFormModel(),
                contactMultipleList: [],
                equipmentType: [],
                stationName: '',
                // workType: [],
                equipmentOptions: [],
                stationNameOptions: [],
                workTypeOptions: ['高炮','火箭','烟炉'],
                show: this.modalData.show,
                title: '新增作业点信息',
                ruleValidate: {
                    stationName: [{ required: true,  message: '站点名称不能为空', trigger: 'change' }],
                    stationCode: [{ required: true, message: '站点编号不能为空', trigger: 'change' }],
                    equipmentType: [{ required: true, type: 'array', message: '作业器具类型不能为空', trigger: 'change' }],
                    // workType: [{ required: true, type: 'array', message: '作业方式不能为空', trigger: 'change' }],
                    commander: [{ required: true, message: '指挥人员不能为空', trigger: 'change' }],
                }
            }
        },
        computed: {},
        watch: {
            modalData(newValue) {
                this.title = newValue.data ? '编辑作业点信息' : '新增作业点信息';
                this.show = newValue.show;

                const plainModel = this.resetFormModel();
                if (this.modalData.data) {
                    Object.keys(plainModel).forEach(key => {
                        if (key === 'equipmentType') {
                            plainModel[key] = this.modalData.data[key].split(',');
                        } else if (key === 'workType') {
                            plainModel[key] = this.modalData.data[key].split(',');
                        } else if (key === 'stationName') {
                            plainModel[key] = this.modalData.data[key].split(',');
                        } else {
                            plainModel[key] = this.modalData.data[key];
                        }
                        plainModel.commanderPhone = this.modalData.data.commander + this.modalData.data.phone
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
                    stationName: '', // 站点名称
                    stationCode: '', // 站点编号
                    peopleCount: 0, // 作业人数
                    commander: '',  //指挥人员
                    equipmentType: '',  //装备类型
                    // workType: '',  //作业方式
                    carCount: 0,  //车辆
                    equipmentModel: '',
                    phone: '',

                };
            },
            NameOptionsChanged(e){
                for(var i=0;i<this.stationNameOptions.length;i++){
                    if(this.formModel.stationName == this.stationNameOptions[i].workStationName){
                      this.formModel.stationCode = this.stationNameOptions[i].workStationCode
                    }
                }
            },
            optionsChanged(e) {
                const labelPhone=e.label;
                this.formModel.phone=labelPhone.substr(labelPhone.indexOf('+') );
            },
            closeModal() {
                this.$refs['pointReportForm'].resetFields();
                this.show = false;
            },
            getPhones() {
                this.$api.userNameAndPhone()
                .then(res => {
                    this.contactMultipleList = res.data})
                .catch(err => this.contactMultipleList = []);
            },
            equimentChanged(val) {
                this.formModel.equipmentModel = val.map(item => item.label.split(' ')[0]).join(',');
            },
            updateOrAddPointReport(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        const titlePreText = this.modalData.data ? '更新' : '新增';
                        if (!this.modalData.data) {
                            var {id, ...params} = this.formModel;
                        } else {
                            var {...params} = this.formModel;
                        }
                        params.equipmentType = params.equipmentType.join(',');
                        // params.workType = params.workType.join(',');
                        this.loading = true;
                        if(titlePreText=='新增'){
                            this.$api.insertPointReportInfo(params)
                             .then(res => {
                            this.$Message.info(`${titlePreText}成功`);
                            this.show = false;
                            this.$emit('handleSucc');
                        }).finally(res => this.loading = false);
                        }else{
                            this.$api.updatePointReportInfo(params)
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
            updateOrAddWorkResult(name) {
                this.$refs[name].validate(valid => {
                    if (valid) {
                        const titlePreText = this.modalData.data ? '更新' : '新增';
                        if (!this.modalData.data) {
                            var {id, ...params} = this.formModel;
                        } else {
                            var {...params} = this.formModel;
                        }
                        params.equipmentType = params.equipmentType.join(',');
                        // params.workType = params.workType.join(',');
                        params.stationName = params.stationName.join(',');
                        this.loading = true;
                        this.$api.updateWorkResultData(params)
                        .then(res => {
                            this.$Message.info(`${titlePreText}成功`);
                            this.$emit('handleSucc');
                        })
                        .finally(res => {
                            this.show = false;
                            this.loading = false;
                        });
                    } else {
                        console.log('fail');
                    }
                })
            },
        },
        mounted() {
            this.getPhones();
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
