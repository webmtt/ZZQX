<template>
    <div ref="workResultHistroy" class="workResultHistroy" style="padding: 10px 10px 0 10px">
        <Spin size="large" fix v-if="loading">加载中...</Spin>
        <div ref="formPart">
        <i-form :model="serachCondtion" inline :label-width="75" style="padding-top:15px">
            <Form-item prop="stationName" label="站点名称：">
                <i-input type="text" v-model="serachCondtion.stationName" placeholder="站点名称"></i-input>
            </Form-item>
            <Form-item label="预报时间：">
                <DatePicker @on-change="forecastTimeRangeChange" type="datetimerange" placeholder="选择预报时间所在的范围" style="width: 275px"></DatePicker>
            </Form-item>
            <Form-item style="margin-left: 24px;" label="创建时间：">
                <DatePicker @on-change="createTimeRangeChange" type="datetimerange" placeholder="选择创建时间所在的范围" style="width: 275px"></DatePicker>
            </Form-item>
            <Form-item style="margin-left: 24px;" label="是否评估：">
                <Select v-model.number="serachCondtion.isAssess" style="width:100px">
                    <Option v-for="(item, index) in estimateOptions" :value="item.value" :key="index">{{ item.label }}</Option>
                </Select>
            </Form-item>
            <Form-item :label-width="0">
                <i-button type="primary" v-has="'/operatingHistory/list'" @click="search">查询</i-button>
                <i-button type="primary" v-has="'/operatingHistory/assess'" @click="estimateWorkResult('insert')">评估</i-button>
            </Form-item>
        </i-form>
        </div>
        <Table @on-selection-change="selectChanged" ref="workResultTable" :height="tableHeight" border stripe :columns="columns1" :data="tableData"></Table>
        <!-- <br> -->
        <Page style="position: absolute;bottom: 22px;right: 11px;" :total="total" :page-size="serachCondtion.pageSize" :page-size-opts="[10,15,20,50]" :current.sync="serachCondtion.pageNum" @on-change="pageChanged" @on-page-size-change="pageOptionChanged" show-elevator show-sizer show-total />
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'workResultHistory',
    data() {
        return {
            loading: false,
            total: 0,
            modalOption: {
                show: false,
                data: null
            },
            selectionItemIds: [],
            estimateOptions: [
                { value: 0, label: '全部' },
                { value: 1, label: '已评估' },
                { value: 2, label: '未评估' },
                { value: 3, label: '评估失败' },
                { value: 4, label: '评估中' }
            ],
            currentHandleData: null,
            tableHeight: 300,
            serachCondtion: {
                stationName: '', // 站点名称
                isAssess: 0, // 是否评估
                startCreateTime: '', // 创建开始时间
                endCreateTime: '', // 创建结束时间
                startOpTime: '', // 预报开始时间
                endOpTime: '', // 预报结束时间
                pageSize: 10, // 每页显示个数
                pageNum: 1
            },
            columns1: [
                    {
                        type: 'selection',
                        width: 60,
                        // fixed: 'left',
                        align: 'center'
                    },
                    {
                        type: 'index',
                        title: '序号',
                        width: 60,
                        align: 'center',
                        indexMethod: this.getPageIndex
                    },
                    {
                        title: '站点名称',
                        key: 'stationName',
                        width: (window.innerWidth-800)/8,
                        tooltip: true
                    },
                    {
                        title: '站点编码',
                        key: 'stationID',
                        width: (window.innerWidth-800)/8,
                    },
                     {
                        title: '预报时间',
                        key: 'opTime',
                        width: (window.innerWidth-395)/8,
                    },
                    {
                        title: '创建时间',
                        key: 'createTime',
                        tooltip: true,
                        width: (window.innerWidth-380)/8,
                    },
                    {
                        title: '指令',
                        key: 'optCMD',
                        tooltip: true,
                        width: (window.innerWidth +2655)/8,
                    },
                    // {
                    //     title: '发送次数',
                    //     key: 'sendCount',
                    //     tooltip: true,
                    //     width: 100
                    // },
                    {
                        title: '是否自动',
                        key: 'isAuto',
                        width: 100,
                        render: (h, params) => {
                            return h('div', [
                                h('span', {}, params.row.isAuto == '1' ? '是' : '否')
                            ]);
                        },
                        width: (window.innerWidth-1100)/8,
                    },
                    {
                        title: '适合作业',
                        key: 'isFit',
                        width: 150,
                        tooltip: true,
                        render: (h, params) => {
                            return h('div', [
                                h('span', {}, params.row.isFit == '1' ? '不适合' : '适合')
                            ]);
                        },
                        width: (window.innerWidth-1100)/8,
                    },
                    {
                        title: '是否评估',
                        key: 'isAssess',
                        tooltip: true,
                        width: 150,
                        render: (h, params) => {
                            return h('div', [
                                h('span', {}, this.estimateOptions[params.row.isAssess].label)
                            ]);
                        },
                        width: (window.innerWidth-800)/8,
                    }
                ],
                tableData: []
        }
    },
    methods: {
        getPageIndex(row) {
            return (this.serachCondtion.pageNum - 1) * this.serachCondtion.pageSize + row._index + 1;
        },
        selectChanged(selection, row) {
            this.selectionItemIds = [...selection.map(item => item.id)];
        },
        forecastTimeRangeChange(val) {
            this.serachCondtion.startOpTime = val[0];
            this.serachCondtion.endOpTime = val[1];
        },
        createTimeRangeChange(val) {
            this.serachCondtion.startCreateTime = val[0];
            this.serachCondtion.endCreateTime = val[1];
        },
        searchWorkResult() {
            console.log(this.tableHeight);
            console.log(this.$refs.workResultHistroy.offsetHeight);
            this.loading = true;
            this.selectionItemIds = [];
            const params = (this.serachCondtion.isAssess == '0') ? Object.assign({}, this.serachCondtion, {isAssess: ''}) : this.serachCondtion;
            return this.$api.getOperatingHistory(params)
                .then(res => {
                    this.total = res.data.total;
                    this.tableData = res.data.list.map(item => {
                        item._disabled = ![2, 3].includes(item.isAssess);
                        return item;
                    });
                })
                .catch(error => {
                    this.total = 0;
                    this.tableData = [];
                })
                .finally(() => this.loading = false);
        },
        search() {
            this.serachCondtion.pageNum = 1;
            this.searchWorkResult();
        },
        pageChanged() {
            this.searchWorkResult();
        },
        pageOptionChanged(val) {
            this.serachCondtion.pageSize = val;
            this.searchWorkResult();
        },

        /**
         * @method estimateWorkResult
         * 评估作业效果
         */
        estimateWorkResult() {
            if (!this.selectionItemIds.length) {
                this.$Message.error("您没有选中任何数据");
            } else {
                this.$Modal.confirm({
                    title: '提示',
                    content: '<p>确定要评估已选指令吗？</p>',
                    loading: true,
                    onOk: () => {
                        this.$api.estimateResultHistory({ ids: this.selectionItemIds.join(',') })
                            .then(res => {
                                this.$Modal.remove();
                                this.$nextTick(() => {
                                    this.$Notice.info({
                                        title: '消息提示：',
                                        desc: res.message,
                                        duration: 5
                                    });
                                    this.searchWorkResult();
                                });
                            })
                            .catch(err => {
                                this.$Modal.remove();
                            });
                    },
                    onCancel: () => {}
                });
            }
        }
    },
    components: {},
    mounted() {
        this.tableHeight = this.$refs.workResultHistroy.offsetHeight - this.$refs.formPart.offsetHeight-90;
        this.searchWorkResult();
    }
}
</script>

<style scoped>
    .workResultHistroy {
        display: flex;
        height: 100%;
        flex-direction: column;
        background-color: #1D2437;
    }
</style>