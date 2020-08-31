<template>
<Modal  :mask-closable="false"  :closable="false" :z-index="10" width="610px" v-model="show" :title="title">
    <Form ref="stovePointForm" inline :model="formModel" v-if="show" :label-width="100" :rules="ruleValidate">
        <FormItem label="站点名称" prop="workStationName">
            <Input size="small" v-model="formModel.workStationName" placeholder="站点名称" style="width: 160px" />
        </FormItem>
        <FormItem label="海拔高度">
            <InputNumber size="small" type='number' v-model.number="formModel.altitude" placeholder="海拔高度" style="width: 160px" />
        </FormItem>
        <FormItem class="longitudeStyle" label="经度" prop="longitude">
            <Input size="small" v-model="formModel.longitude" placeholder="经度" style="width: 160px" />
        </FormItem>
        <FormItem class="longitudeStyle" label="纬度" prop="latitude">
            <Input size="small" v-model="formModel.latitude" placeholder="纬度" style="width: 160px" />
        </FormItem>
        <FormItem label="主导风向" prop="prevailingWindDirection">
            <Select v-model="formModel.prevailingWindDirection" :label-in-value="true" size="small" style="width: 162px">
                <Option v-for="(item,ix) in prevailingWindDirections" :value="item" :key="ix">{{item}}</Option>
            </Select>
        </FormItem>
        <FormItem label="迎风/背风坡" prop="windwardLeewardSlope">
            <Select v-model="formModel.windwardLeewardSlope" size="small" style="width: 162px">
                <Option v-for="(item,ix) in windwardLeewardSlopes" :value="item.value" :key="ix">{{item.label}}</Option>
            </Select>
        </FormItem>
        <FormItem label="烟炉型号" prop="smokeOvenType">
            <Input size="small" v-model="formModel.smokeOvenType" placeholder="烟炉型号" style="width: 160px" />
        </FormItem>
        <FormItem label="移动信号" prop="is4G">
            <Select v-model="formModel.is4G" size="small" style="width:160px">
              <Option v-for="(item, ix) in booleanOption" :value="item.value" :key="ix">{{item.label}}</Option>
            </Select>
        </FormItem>
        <FormItem label="联系方式" prop="tels">
            <Select v-model="formModel.tels" multiple size="small" style="width: 430px">
              <Option v-for="(item,ix) in contactMultipleList" :value="item.phone" :key="ix">{{item.name+' '+item.phone}}</Option>
            </Select>
        </FormItem>
    </Form>
    <template #footer>
        <i-button :disabled="loading" type="primary" @click="closeModal">取消</i-button>
        <i-button :loading="loading" type="primary" @click="updateOrAddWorkPoint('stovePointForm')">保存</i-button>
    </template>
    </Modal>
</template>

<script>
    export default {
        data () {
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
                prevailingWindDirections: ['北','东北','东','东南','南','西南','西','西北'],
                show: this.modalData.show,
                title: '新增烟炉点位',
                booleanOption: [
                    { label: '有', value: 1 },
                    { label: '没有', value: 0 }
                ],
                windwardLeewardSlopes: [
                    { label: '背风坡', value: 1 },
                    { label: '迎风坡', value: 0 }
                ],
                ruleValidate: {
                    workStationName: [{ required: true, message: '站点名称不能为空', trigger: 'blur' }],
                    smokeOvenType: [{ required: true, message: '烟炉型号不能为空', trigger: 'blur' }],
                    longitude: [{ required: true, message: '经度不能为空', trigger: 'blur' }, { validator: validateLongitude, trigger: 'blur' }],
                    latitude: [{ required: true, message: '纬度不能为空', trigger: 'blur' }, { validator: validateLatitude, trigger: 'blur' }],
                }
            }
        },
        computed: {},
        watch: {
            modalData(newValue) {
                this.title = newValue.data ? '编辑烟炉点位' : '新增烟炉点位';
                this.show = newValue.show;

                const plainModel = this.resetFormModel();
                if (this.modalData.data) {
                    Object.keys(plainModel).forEach(key => {
                        if (key === 'altitude') {
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
                    workStationName: '', // 烟炉站点名称
                    longitude: '', // gps经度
                    latitude: '', // gps纬度
                    altitude: 0, // 海拔高度
                    smokeOvenType: '', // 烟炉型号
                    tels: '', // 联系方式,
                    is4G: '',  //是否移动
                    windwardLeewardSlope: '',  //迎风坡/背风坡
                    prevailingWindDirection: '',
                };
            },
            closeModal() {
                this.$refs['stovePointForm'].resetFields();
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
                        if(params.tels){
                            params.tels = params.tels.join(',');
                        }
                        this.loading = true;
                        if(titlePreText=='新增'){
                            this.$api.insertStoveStationInfo(params)
                             .then(res => {
                            this.$Message.info(`${titlePreText}成功`);
                            this.show = false;
                            this.$emit('handleSucc');
                        }).finally(res => this.loading = false);
                        }else{
                            this.$api.updateStoveStationInfo(params)
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
            this.getPhones();
        }
    }
</script>
