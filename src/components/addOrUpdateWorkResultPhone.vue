<template>
    <Modal class="addWorkResultPhone" width="670" :mask-closable="false" :closable="false" :z-index="10" v-model="show" :title="editMode ==='insert' ? '新增作业效果' : '编辑作业效果'">
        <div style="height: 400px;overflow: hidden">
            <el-scrollbar style="height: 100%;">
            <Form ref="workResultForm" :model="formModel" inline v-if="show" :label-width="110" :rules="ruleValidate">
                <FormItem label="点位信息：" prop="name">
                    <Select :disabled="editMode==='update'" @on-change="stationChanged" v-model="formModel.name" style="width: 162px" placeholder="选择站点">
                        <Option v-for="(item,ix) in pointNameOptions" :value="item" :key="ix">{{item}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="作业器具类型：" prop="equipmentType">
                    <Select v-model="formModel.equipmentType" multiple :label-in-value="true" @on-change="equimentChanged" style="width: 162px">
                        <Option v-for="(item,ix) in equipmentOptions" :value="item.type" :key="ix">{{item.name+' '+item.type}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="作业类型：" prop="taskType">
                    <Select v-model="formModel.taskType" :label-in-value="true" style="width: 162px">
                        <Option v-for="(item, ix) in typeOptions" :value="item" :key="ix">{{item}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="作业面积：" prop="area">
                    <InputNumber style="width: 162px" :min="0" v-model="formModel.area" placeholder="作业面积" />
                </FormItem>
                <FormItem label="作业起始时间：" prop="beginTime">
                    <Date-picker type="datetime" :transfer="true" style="width: 162px" v-model="formModel.beginTime" placeholder="选择起始时间"></Date-picker>
                </FormItem>
                <FormItem label="作业结束时间：" prop="endTime">
                    <Date-picker type="datetime" :transfer="true" style="width: 162px" v-model="formModel.endTime" placeholder="选择结束时间"></Date-picker>
                </FormItem>
                <FormItem label="作业前天气：" prop="beforeWeather">
                    <Input v-model="formModel.beforeWeather" placeholder="作业前天气状况" />
                </FormItem>
                <FormItem label="作业后天气：" prop="afterWeather">
                    <Input v-model="formModel.afterWeather" placeholder="作业后天气状况" />
                </FormItem>
                <FormItem label="高炮弹药用量：" prop="gun">
                    <InputNumber :min="0" style="width: 162px" v-model="formModel.gun" placeholder="高炮用弹量" />
                </FormItem>
                <FormItem label="火箭弹用量：" prop="rocket">
                    <InputNumber :min="0" style="width: 162px" v-model="formModel.rocket" placeholder="火箭弹用量" />
                </FormItem>
                <FormItem label="烟条用料：" prop="stove">
                    <InputNumber :min="0" style="width: 162px" v-model="formModel.stove" placeholder="烟条用料" />
                </FormItem>
                <FormItem label="其他用量：" prop="other">
                    <InputNumber :min="0" style="width: 162px" v-model="formModel.other" placeholder="其他用量" />
                </FormItem>
                <FormItem label="作业效果：" prop="comment">
                    <Input v-model="formModel.comment" placeholder="作业效果" />
                </FormItem>
                <FormItem label="填报人：" prop="reporter">
                    <Input v-model="formModel.reporter" placeholder="填报人" />
                </FormItem>
                <FormItem label="填报单位：" prop="department">
                    <Input v-model="formModel.department" placeholder="填报单位" />
                </FormItem>
                <FormItem label="作业弹药型号：" prop="ammoType">
                    <Input v-model="formModel.ammoType" placeholder="作业弹药型号" />
                </FormItem>
                <FormItem label="备注：">
                    <Input v-model="formModel.remark" placeholder="备注" />
                </FormItem>
            </Form>
            </el-scrollbar>
        </div>
        <template #footer>
            <i-button :disabled="loading" type="primary" @click="closeModal">取消</i-button>
            <i-button :loading="loading" type="primary" @click="updateOrAddWorkResult('workResultForm')">保存</i-button>
        </template>
    </Modal>
</template>

<script>
    export default {
        data () {
            const isPositiveInteger = (rule, value, callback) => {
                const reg = /^[+]{0,1}(\d+)$/;
                if (!reg.test(value)) {
                    callback(new Error('输入不合法,该字段必须为正整数'));
                }
                callback();
            };
            const validateBeginTime = (rule, value, callback) => {
                if (this.formModel.endTime) {
                    if (value.valueOf() > this.$moment(this.formModel.endTime).valueOf()) {
                        callback(new Error('开始时间不能大于结束时间'));
                    }
                    callback();
                }
                callback();
            };
            const validateEndTime = (rule, value, callback) => {
                if (this.formModel.beginTime) {
                    if (value.valueOf() < this.$moment(this.formModel.beginTime).valueOf()) {
                        callback(new Error('结束时间不能小于开始时间'));
                    }
                    callback();
                }
                callback();
            };
            // const validateStationName = (rule, value, callback) => {
            //     if (!value) {
            //         callback(new Error('站点名称不能为空'));
            //     } else {
            //         const matchDatas = this.points.filter(item => item.workStationName === value);
            //         if (!matchDatas.length) {
            //             callback(new Error('站点名称不合法'));
            //         }
            //         callback();
            //     }
            //     callback();
            // };
            return {
                loading: false,
                editMode: 'insert',
                pointNameOptions: [],
                points: [],
                typeOptions: ['增雨', '减雨'],
                equipmentOptions: [],
                equipment: [],
                formModel: this.resetFormModel(),
                show: this.modalData.show,
                ruleValidate: {
                    name: [{ required: true, message: '站点不能为空', trigger: 'change' }],
                    equipmentType: [{ required: true, type: 'array', message: '作业器具类型不能为空', trigger: 'change' }],
                    taskType: [{ required: true, message: '作业类型不能为空', trigger: 'blur' }],
                    area: [{ required: true, type: 'number', message: '作业面积不能为空', trigger: 'blur' }],
                    beginTime:  [{ required: true, type: 'date', message: '起始时间不能为空', trigger: 'change' }, { validator: validateBeginTime, trigger: 'blur' }],
                    endTime:  [{ required: true, type: 'date', message: '结束时间不能为空', trigger: 'change' }, { validator: validateEndTime, trigger: 'blur' }],
                    beforeWeather: [{ required: true, message: '作业前天气状况不能为空', trigger: 'blur' }],
                    afterWeather: [{ required: true, message: '作业后天气状况不能为空', trigger: 'blur' }],
                    other: [{ required: true, type: 'number', message: '其他用量不能为空', trigger: 'blur' }, { validator: isPositiveInteger, trigger: 'blur' }],
                    rocket: [{ required: true, type: 'number', message: '火箭弹用量不能为空', trigger: 'blur' }, { validator: isPositiveInteger, trigger: 'blur' }],
                    gun: [{ required: true, type: 'number', message: '高炮弹药用量不能为空', trigger: 'blur' }, { validator: isPositiveInteger, trigger: 'blur' }],
                    stove: [{ required: true, type: 'number', message: '烟条用量不能为空', trigger: 'blur' }, { validator: isPositiveInteger, trigger: 'blur' }],
                    comment: [{ required: true, message: '作业效果不能为空', trigger: 'blur' }],
                    reporter: [{ required: true, message: '填报人不能为空', trigger: 'blur' }],
                    department: [{ required: true, message: '填报单位不能为空', trigger: 'blur' }]
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
                this.editMode = newValue.data ? 'update' : 'insert';
                this.show = newValue.show;

                const plainModel = this.resetFormModel();
                if (this.modalData.data) {
                    Object.keys(plainModel).forEach(key => {
                        if (key === 'equipmentType') {
                            plainModel[key] = this.modalData.data[key].split(',');
                        } else {
                            plainModel[key] = this.modalData.data[key];
                        }
                    });
                }

                this.formModel = plainModel
            }
        },
        props: ['modalData'],
        methods: {
            resetFormModel() {
                return {
                    id: '',
                    name: '',
                    code: '',
                    equipmentModel: '',
                    equipmentType: [],
                    taskType: '',
                    area: 0,
                    beginTime: '',
                    endTime: '',
                    beforeWeather: '',
                    afterWeather: '',
                    other: 0,
                    rocket: 0,
                    gun: 0,
                    stove: 0,
                    comment: '',
                    reporter: '',
                    department: '',
                    ammoType: '',
                    remark: ''
                };
            },
            stationChanged(val) {
                const matchDatas = this.points.filter(item => item.workStationName === val);
                if (matchDatas.length) {
                    const currentData = matchDatas[0];
                    this.formModel.code = currentData.workStationCode;
                }
            },
            equimentChanged(val) {
                this.formModel.equipmentModel = val.map(item => item.label.split(' ')[0]).join(',');
            },
            closeModal() {
                this.$refs['workResultForm'].resetFields();
                this.show = false;
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
                        params.beginTime = this.$moment(params.beginTime).format('YYYY-MM-DD HH:mm:ss');
                        params.endTime = this.$moment(params.endTime).format('YYYY-MM-DD HH:mm:ss');
                        params.equipmentType = params.equipmentType.join(',');
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
            this.$api.getStationLoc()
            .then(res => {
                this.points = res.data;
                const options = [];
                res.data.forEach(item => {
                    if (options.every(innerItem => innerItem !== item.workStationName)) {
                        options.push(item.workStationName);
                    }
                });
                this.pointNameOptions = options;
            });
            // this.$api.getStationLocStove()
            // .then(res => {
            //     this.points = res.data;
            //     const options = [];
            //     res.data.forEach(item => {
            //         if (options.every(innerItem => innerItem !== item.workStationName)) {
            //             options.push(item.workStationName);
            //         }
            //     });
            //     this.pointNameOptions = options;
            // });

            // 获得所有装备类型;
            this.$api.getAllEquipmentType()
            .then(res => {
                this.equipments = res.data;
                const options = [];
                res.data.forEach(item => {
                    if (options.every(innerItem => innerItem !== item.type)) {
                        options.push(item);
                    }
                });
                this.equipmentOptions = options;
            });
        }
    }
</script>
