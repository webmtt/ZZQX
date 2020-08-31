<template>
    <div ref="workResultAssess" class="workResultAssess" style="padding: 10px 10px 0 10px">
        <Spin size="large" fix v-if="loading">加载中...</Spin>
        <div ref="formPart">
        <i-form :model="serachCondtion" inline :label-width="80" style="padding-top:15px">
            <Form-item label="站点名称：">
                <i-input type="text" v-model="serachCondtion.name" placeholder="站点名称"></i-input>
            </Form-item>
            <Form-item label="评估时间：">
                <DatePicker @on-change="estimateTimeRangeChange" type="datetimerange" placeholder="选择评估时间所在的范围" style="width: 275px"></DatePicker>
            </Form-item>
            <Form-item :label-width="100" label="作业开始时间：" style="margin-left: 24px;">
                <DatePicker @on-change="createTimeRangeChange" type="datetimerange" placeholder="选择作业开始时间所在的范围" style="width: 275px"></DatePicker>
            </Form-item>
            <Form-item label="作业类型：" style="margin-left: 24px;">
                <Select v-model="serachCondtion.taskType" style="width:100px">
                    <Option v-for="(item, index) in workTypeOptions" :value="item.value" :key="index">{{ item.label }}</Option>
                </Select>
            </Form-item>
            <Form-item :label-width="10" style="margin-left: -22px;">
                <i-button type="primary" v-has="'/situationAssess/list'" @click="search">查询</i-button>
            </Form-item>
        </i-form>
        </div>
        <Table ref="workResultTable" :height="tableHeight" border stripe :columns="columns1" :data="tableData"></Table>
        <!-- <br> -->
        <Page style="text-align: right;margin-top: 20px;padding-bottom: 20px;" :total="total" :page-size="serachCondtion.pageSize" :page-size-opts="[10,15,20,50]" :current.sync="serachCondtion.pageNum" @on-change="pageChanged" @on-page-size-change="pageOptionChanged" show-elevator show-sizer show-total />
        <!-- 编辑/新增作业结果的模态框 -->
        <image-switcher :modalData="modalOption"></image-switcher>
    </div>
</template>

<script>
import imageSwitcher from '@/components/imageSwitcher';
import axios from 'axios';
export default {
    name: 'workResultAssess',
    data() {
        return {
            loading: false,
            total: 0,
            modalOption: {
                show: false,
                data: null
            },
            workTypeOptions: [
                { value: '0', label: '全部' },
                { value: '增雨', label: '增雨' },
                { value: '减雨', label: '减雨' }
            ],
            currentHandleData: null,
            tableHeight: 300,
            serachCondtion: {
                name: '', // 站点名称
                startCreateTime: '',
                endCreateTime: '',
                startDate: '',
                endDate: '',
                taskType: '0', // 作业类型
                pageSize: 10, // 每页显示个数
                pageNum: 1
            },
            columns1: [
                    {
                        type: 'index',
                        title: '序号',
                        width: 70,
                        align: 'center',
                        // fixed: 'left',
                        indexMethod: this.getPageIndex
                    },
                    {
                        title: '站点名称',
                        key: 'name',
                        width: 130,
                        tooltip: true
                    },
                    {
                        title: '站点编码',
                        key: 'code',
                        width: 110
                    },
                    {
                        title: '作业开始时间',
                        key: 'beginTime',
                        width: 180,
                    },
                    {
                        title: '作业结束时间',
                        key: 'endTime',
                        width: 180,
                    },
                    {
                        title: '作业器具类型',
                        key: 'equipmentModel',
                        tooltip: true,
                        width: 120,
                    },
                    {
                        title: '作业类型',
                        key: 'taskType',
                        tooltip: true,
                        width: 100
                    },
                    {
                        title: '评估时间',
                        key: 'createTime',
                        tooltip: true,
                        width: 180
                    },
                    {
                        title: '作业效果',
                        key: 'comment',
                        width: 447,
                        tooltip: true,
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 160,
                        align: 'center',
                        // fixed: 'right',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: { type: 'primary' },
                                    directives: [{
                                        name: 'has',
                                        value: '/situationAssess'
                                    }],
                                    on: {
                                        click: () => this.openModal('update', params)
                                    },
                                }, '结果对比')
                            ]);
                        }
                    },
                ],
                tableData: []
        }
    },
    methods: {
        getPageIndex(row) {
            return (this.serachCondtion.pageNum - 1) * this.serachCondtion.pageSize + row._index + 1;
        },
        estimateTimeRangeChange(val) {
            this.serachCondtion.startCreateTime = val[0];
            this.serachCondtion.endCreateTime = val[1];
        },
        createTimeRangeChange(val) {
            this.serachCondtion.startDate = val[0];
            this.serachCondtion.endDate = val[1];
        },
        searchWorkResult() {
            this.loading = true;
            const params = (this.serachCondtion.taskType == '0') ? Object.assign({}, this.serachCondtion, {taskType: ''}) : this.serachCondtion;
            return this.$api.getsituationAssess(params)
                .then(res => {
                    this.total = res.data.total;
                    this.tableData = res.data.list;
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
        openModal(flag, rowParam) {
            this.modalOption = { show: true, data: rowParam }
        }
    },
    components: {imageSwitcher},
    mounted() {
        this.tableHeight = this.$refs.workResultAssess.offsetHeight - this.$refs.formPart.offsetHeight -90;
        this.searchWorkResult();
    }
}
</script>

<style scoped>
    .workResultAssess {
        display: flex;
        height: 100%;
        flex-direction: column;
        background-color: #1D2437;
    }
</style>