<template>
    <Form :model="formModel" :label-width="80">
        <FormItem label="点位信息：">
            <Row>
                <Col span="6" style="margin: 0 5px">
                <AutoComplete :disabled="editMode==='update'" v-model="formModel.name" :data="pointNameOptions" @on-change="stationChanged" placeholder="查找站点"></AutoComplete>
                </Col>
                <Col style="margin: 0 5px" span="6"><Input disabled v-model="formModel.code" placeholder="作业站点编码" /></Col>
                <Col style="margin: 0 5px" span="4"><Input disabled v-model="formModel.lon" placeholder="经度" /></Col>
                <Col style="margin: 0 5px" span="4"><Input disabled v-model="formModel.lat" placeholder="纬度" /></Col>
            </Row>
        </FormItem>
        <FormItem label="起始时间：">
            <Date-picker @on-change="formModel.begintime=$event" type="datetime" v-model="formModel.begintime" placeholder="选择日期和时间"></Date-picker>
        </FormItem>
        <FormItem label="使用装备：">
            <div style="display: flex;margin: 3px 0"><span style="width: 100px;justify-content: center;display: flex;font-weight: bold">飞机：</span><span style="width: 50px">催化剂</span><InputNumber :min="0" v-model="formModel.airplane" placeholder="飞机"></InputNumber><span style="width: 100px;justify-content: center;display: flex;">千克</span></div>
            <div style="display: flex;margin: 3px 0"><span style="width: 100px;justify-content: center;display: flex;font-weight: bold">火箭：</span><span style="width: 50px">火箭</span><InputNumber :min="0" v-model="formModel.rocket" placeholder="火箭"></InputNumber><span style="width: 100px;justify-content: center;display: flex;">枚</span></div>
            <div style="display: flex;margin: 3px 0"><span style="width: 100px;justify-content: center;display: flex;font-weight: bold">火炮：</span><span style="width: 50px">炮弹</span><InputNumber :min="0" v-model="formModel.gun" placeholder="炮弹"></InputNumber><span style="width: 100px;justify-content: center;display: flex;">个</span></div>
            <div style="display: flex;margin: 3px 0"><span style="width: 100px;justify-content: center;display: flex;font-weight: bold">烟炉：</span><span style="width: 50px">烟条</span><InputNumber :min="0" v-model="formModel.stove" placeholder="烟条"></InputNumber><span style="width: 100px;justify-content: center;display: flex;">条</span></div>
        </FormItem>
        <FormItem label="责任人：">
            <Input v-model="formModel.liable" placeholder="责任人" />
        </FormItem>
        <FormItem label="效果评价：">
            <Input v-model="formModel.comment" type="textarea" :autosize="{minRows: 2, maxRows: 5}" placeholder="效果评价" />
        </FormItem>
    </Form>
</template>

<script>
    export default {
        data () {
            return {
                editMode: 'insert',
                pointNameOptions: [],
                points: [],
                formModel: {
                    name: '',
                    code: '',
                    lon: 0,
                    lat: 0,
                    begintime: '',
                    airplane: 0,
                    rocket: 0,
                    gun: 0,
                    stove: 0,
                    liable: '',
                    comment: ''
                }
            }
        },
        watch: {
            formModel: {
                handler: function (nowVal, oldVal) {
                    this.formModel.lon = parseFloat(this.formModel.lon);
                    this.formModel.lat = parseFloat(this.formModel.lat);
                    this.formModel.begintime = this.$moment(this.formModel.begintime ? this.formModel.begintime : new Date()).format('YYYY-MM-DD HH:mm:ss');
                    this.$emit('formModel', this.formModel);
                },
                deep:true
            }
        },
        props: ['handleFlag', 'value'],
        methods: {
            stationChanged(val) {
                const currentData = this.points.filter(item => item.workStationName === val)[0];
                this.formModel.code = currentData.workStationCode;
                this.formModel.lon = currentData.longitude;
                this.formModel.lat = currentData.latitude;
            }
        },
        mounted() {
            this.editMode = this.handleFlag;
            Object.assign(this.formModel, this.value);
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
        }
    }
</script>
