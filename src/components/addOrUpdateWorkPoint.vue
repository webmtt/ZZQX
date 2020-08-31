<template>
<Modal  :mask-closable="false"  :closable="false" :z-index="10" width="610px" v-model="show" :title="title">
    <Form ref="workPointForm" inline :model="formModel" v-if="show" :label-width="100" :rules="ruleValidate">
        <FormItem label="作业站点编码" prop="workStationCode">
            <Input size="small" :disabled="title==='编辑作业点位'" v-model="formModel.workStationCode" placeholder="作业站点编码" style="width: 160px" />
        </FormItem>
        <FormItem label="作业站点名称" prop="workStationName">
            <Input size="small" v-model="formModel.workStationName" placeholder="作业站点名称" style="width: 160px" />
        </FormItem>
        <FormItem label="GPS经度" prop="longitude" class="longitudeStyle">
            <Input size="small" v-model="formModel.longitude" placeholder="GPS经度" style="width: 160px" />
        </FormItem>
        <FormItem label="GPS纬度" prop="latitude" class="longitudeStyle">
            <Input size="small" v-model="formModel.latitude" placeholder="GPS纬度" style="width: 160px" />
        </FormItem>
        <!--<FormItem label="装备类型" prop="workStationType">
            <Select v-model="formModel.workStationType" multiple :label-in-value="true" size="small" style="width: 162px">
                <Option v-for="(item,ix) in equipmentOptions" :value="item.type" :key="ix">{{item.name+' '+item.type}}</Option>
            </Select>
        </FormItem>-->
        <!--<FormItem label="作业半径">
            <InputNumber size="small" disabled v-model.number="formModel.workRadius" placeholder="作业半径" style="width: 160px" />
        </FormItem>-->
        <FormItem label="海拔高度">
            <InputNumber size="small" type='number' v-model.number="formModel.altitude" placeholder="海拔高度" style="width: 160px" />
        </FormItem>
        <FormItem label="是否标准站点" prop="isStandardized">
            <Select v-model.number="formModel.isStandardized" size="small" style="width:160px">
              <Option v-for="(item, ix) in booleanOption" :value="item.value" :key="ix">{{item.label}}</Option>
            </Select>
        </FormItem>
        <FormItem label="是否移动站点" prop="isMove">
            <Select v-model.number="formModel.isMove" size="small" style="width:160px">
              <Option v-for="(item, ix) in booleanOption" :value="item.value" :key="ix">{{item.label}}</Option>
            </Select>
        </FormItem>
        <FormItem label="作业点地址">
            <Input size="small" v-model="formModel.workStationAddr" placeholder="作业点地址" style="width: 160px" />
        </FormItem>
        <FormItem label="飞行管制分区">
            <Input size="small" v-model="formModel.flightControlArea" placeholder="飞行管制分区" style="width: 160px" />
        </FormItem>
        <FormItem label="通报管制部门">
            <Input size="small" v-model="formModel.notifyControlDepartment" placeholder="通报管制部门" style="width: 160px" />
        </FormItem>
        <!--<FormItem label="联系方式" prop="stationTels">
            <Select v-model="formModel.stationTels" multiple size="small" style="width: 430px">
              <Option v-for="(item,ix) in contactMultipleList" :value="item.phone" :key="ix">{{item.name+' '+item.phone}}</Option>
            </Select>
        </FormItem>-->
    </Form>
    <template #footer>
        <i-button :disabled="loading" type="primary" @click="closeModal">取消</i-button>
        <i-button :loading="loading" type="primary" @click="updateOrAddWorkPoint('workPointForm')">保存</i-button>
    </template>
    </Modal>
</template>

<script>
    export default {
        data () {
            const validateWorkStationCode = (rule, value, callback) => {
                console.log(value)
                const reg =  /^[0-9]{3,}$/;
                if (!reg.test(value)) {
                    callback(new Error('该字段必须由长度不能小于3的数字组成'));
                }
                callback();
            };
            const validateLongitude = (rule, value, callback) => {
                const reg =  /^-?(?:(?:180(?:\.0{1,4})?)|(?:(?:(?:1[0-7]\d)|(?:[1-9]?\d))(?:\.\d{1,4})?))$/;
                if (!reg.test(value)) {
                    callback(new Error('输入经度不合法,该字段合法范围为-180.0000~180.0000'));
                }
                callback();
            };
            const validateLatitude = (rule, value, callback) => {
                const reg = /^-?((0|[1-8]?[0-9]?)(([.][0-9]{1,4})?)|90(([.][0]{1,4})?))$/;
                if (!reg.test(value)) {
                    callback(new Error('输入经度不合法,该字段合法范围为-90.0000~90.0000'));
                }
                callback();
            };
            return {
                loading: false,
                formModel: this.resetFormModel(),
                contactMultipleList: [],
                equipmentOptions: [],
                show: this.modalData.show,
                title: '新增作业点位',
                equpmentOption: [
                    { label: '火箭', value: '1' },
                    { label: '高炮', value: '2' }
                ],
                booleanOption: [
                    { label: '是', value: 1 },
                    { label: '否', value: 0 }
                ],
                ruleValidate: {
                    workStationCode: [{ required: true, message: '站点编码不能为空', trigger: 'blur' }, { validator: validateWorkStationCode, trigger: 'blur' }],
                    workStationName: [{ required: true, message: '站点名称不能为空', trigger: 'blur' }],
                    longitude: [{ required: true, message: '经度不能为空', trigger: 'blur' }, { validator: validateLongitude, trigger: 'blur' }],
                    latitude: [{ required: true, message: '纬度不能为空', trigger: 'blur' }, { validator: validateLatitude, trigger: 'blur' }],
                    workStationType: [{ required: true, type: 'array', message: '装备类型不能为空', trigger: 'change' }],
                    stationTels: [{ required: true, type: 'array', message: '联系方式不能为空', trigger: 'change' }],
                    isMove: [{ required: true, type: 'number', message: '是否移动站点不能为空', trigger: 'change' },],
                    isStandardized: [{ required: true, type: 'number', message: '是否标准站点不能为空', trigger: 'change' }],
                }
            }
        },
        computed: {},
        watch: {
            modalData(newValue) {
                this.title = newValue.data ? '编辑作业点位' : '新增作业点位';
                this.show = newValue.show;

                const plainModel = this.resetFormModel();
                if (this.modalData.data) {
                    Object.keys(plainModel).forEach(key => {
                        if (key === 'workStationType') {
                            plainModel[key] = this.modalData.data.row[key].split(',');
                        } else if (key === 'altitude') {
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
                    workStationCode: '', // 作业站点编码
                    workStationName: '', // 作业站点名称
                    longitude: '', // gps经度
                    latitude: '', // gps纬度
                    altitude: 0, // 海拔高度
                    isStandardized: '', // 是否标准站点
                    workStationType: [], // 装备类型
                    workRadius: 0, // 作业半径
                    workStationAddr: '', // 作业点地址
                    flightControlArea: '', // 飞行管制区域
                    notifyControlDepartment: '', // 通报管制分区
                    stationTels: [], // 联系方式,
                    isMove: ''
                };
            },
            closeModal() {
                this.$refs['workPointForm'].resetFields();
                this.show = false;
            },
            getPhones() {
                this.$api.userNameAndPhone()
                .then(res => this.contactMultipleList = res.data)
                .catch(err => this.contactMultipleList = []);
            },
            // equimentChanged(val) {
            //     this.formModel.typeName = val.map(item => item.label.split(' ')[0]).join(',');
            // },
            updateOrAddWorkPoint(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        const titlePreText = this.modalData.data ? '更新' : '新增';
                        var {...params} = this.formModel;
                        params.workStationType = params.workStationType.join(',');
                        params.stationTels = params.stationTels.join(',');
                        this.loading = true;
                        this.$api.insertOrUpdateWorkStationInfo(params)
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
            this.getPhones();
            // 获得所有装备类型;
            this.$api.getAllEquipmentType()
            .then(res => {
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
