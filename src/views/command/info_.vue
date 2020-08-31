<!--
 * @Author: your name
 * @Date: 2019-10-12 15:34:16
 * @LastEditTime: 2019-10-24 11:10:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ZZQX\src\views\workResult_.vue
 -->
<template>
  <div ref="workResult" class="workResult" style="padding: 10px 10px 0 10px">
    <Spin size="large" fix v-if="loading">加载中...</Spin>
    <div ref="searchCondtion">
    <i-form :model="serachCondtion" inline :label-width="100" style="padding-top:15px">
      <Form-item prop="stationName" label="站点名称：">
        <i-input type="text" v-model="serachCondtion.stationName" placeholder="站点名称">
        </i-input>
      </Form-item>
      <Form-item label="时间段：" style="margin-left: 24px;">
        <Select v-model="serachCondtion.type" style="width:100px">
            <Option v-for="(item, index) in workTypeOptions" :value="item.value" :key="index">{{ item.label }}</Option>
        </Select>
      </Form-item>
      <Form-item :label-width="0" style="margin-left:25px;">
        <i-button type="primary" v-has="'/pointReport/list'" @click="search">查询</i-button>
        <i-button type="primary" v-has="'/pointReport/insert'" @click="openModal('insert')">新增</i-button>
      </Form-item>
    </i-form>
    </div>
    <Table ref="workResultTable" :height="tableHeight" border stripe :columns="columns1" :data="tableData"></Table>
    <Page style="position: absolute;bottom: 22px;right: 11px;" :total="total" :page-size="serachCondtion.pageSize" :page-size-opts="[10,15,20,50]" :current.sync="serachCondtion.pageNum" @on-change="pageChanged" @on-page-size-change="pageSizeOptionChanged" show-elevator show-sizer show-total />
    <!-- 编辑/新增作业结果的模态框 -->
    <add-or-insert-info-point class="inPageModal" @handleSucc="searchWorkResult" :modalData="modalOption"></add-or-insert-info-point>
  </div>
</template>

<script>
    import axios from 'axios';
    import addOrInsertInfoPoint from '@/components/addOrInsertInfoPoint';

    export default {
        name: 'workResultPart',
        data() {
            return {
                workTypeOptions: [
                    { value: 'all', label: '全部' },
                    { value: 'day', label: '24小时' }
                ],
                loading: false,
                total: 0,
                modalOption: {
                    show: false,
                    data: null
                },
                currentHandleData: null,
                tableHeight: 300,
                serachCondtion: {
                    stationName: '', // 站点名称
                    pageNum: 1, // 起始页
                    pageSize: 10, // 每页条数
                    type: 'all'
                },
                columns1: [
                    {
                        type: 'index',
                        title: '序号',
                        width: 100,
                        align: 'center',
                        // fixed: 'left',
                        indexMethod: this.getPageIndex
                    },
                    {
                        title: '站点名称',
                        key: 'stationName',
                        width: 220,
                        tooltip: true
                    },
                    {
                        title: '站点编码',
                        key: 'stationCode',
                        width: 220
                    },
                    // {
                    //     title: '作业方式',
                    //     key: 'workType',
                    //     tooltip: true,
                    //     width: 200,
                    // },
                    {
                        title: '装备类型',
                        key: 'equipmentTypeName',
                        tooltip: true,
                        width: 300
                    },
                    {
                        title: '指挥人员',
                        key: 'commander',
                        width: 190,
                        tooltip: true,
                    },
                    {
                        title: "联系方式",
                        key: "phone",
                        minWidth: 220,
                        tooltip: true,
                        render: (h, params) => {
                            return h('div', [
                                h('span', {}, params.row.phone+'  ')
                            ]);
                        }
                    },
                    {
                        title: '上报时间',
                        key: 'createTime',
                        tooltip: true,
                        width: 200
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 200,
                        align: 'center',
                        // fixed: 'right',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: { type: 'primary' },
                                    style: { marginRight: '5px' },
                                    on: {
                                        click: () => this.openModal('update', params)
                                    },
                                    directives: [{
                                        name: 'has',
                                        value: '/pointReport/update'
                                    }]
                                }, '编辑'),
                                h('Button', {
                                    props: { type: 'error' },
                                    on: {
                                        click: () => this.deleteData(params)
                                    },
                                    directives: [{
                                        name: 'has',
                                        value: '/pointReport/delete'
                                    }]
                                }, '删除')
                            ]);
                        }
                    },
                ],
                tableData: []
            }
        },
        methods: {
            selectTimePeriod(){
                this.searchCondtion.type = this.period === '24小时' ? 'day' : 'all';
                this.searchWorkResult();
            },
            /**
             * 动态计算列表的序号;
             * @method getPageIndex
             * @returns {number} 根据pageNum生成当前页数据的序号
             */
            getPageIndex(row) {
                return (this.serachCondtion.pageNum - 1) * this.serachCondtion.pageSize + row._index + 1;
            },

            /**
             * 查询时间段变化的事件监听,获得查询时间段起始和终止参数值;
             * @method timeRangeChange
             * @returns {undefined}
             */
            timeRangeChange(val) {
                this.serachCondtion.startDate = val[0];
                this.serachCondtion.endDate = val[1];
            },

            /**
             * 获得效果上报数据结果集
             * @method searchWorkResult
             * @returns {undefined}
             */
            searchWorkResult() {
                this.loading = true;
                return this.$api.getPointReportData(this.serachCondtion)
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

            /**
             * 点击查询按钮的从查询从第一页开始的数据
             * @method search
             * @returns {undefined}
             */
            search() {
                this.serachCondtion.pageNum = 1;
                this.searchWorkResult();
            },

            /**
             * 当前查询页发生变化请求当前页的数据
             * @method pageChanged
             * @returns {undefined}
             */
            pageChanged() {
                this.searchWorkResult();
            },

            /**
             * 当前查询页显示数据条数发生变化请求当前页的数据
             * @method pageSizeOptionChanged
             * @returns {undefined}
             */
            pageSizeOptionChanged(val) {
                this.serachCondtion.pageSize = val;
                this.searchWorkResult();
            },

            /**
             * 打开编辑/新增模态框
             * @method opendModal
             * @returns {undefined}
             */
            openModal(flag, rowParam) {
                this.modalOption = { show: true, data: rowParam ? rowParam.row : null };
            },

            /**
             * 删除一条数据
             * @method deleteData
             * @returns {undefined}
             */
            deleteData(rowParam) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '<p>确定要删除吗？</p>',
                    loading: true,
                    onOk: () => {
                        this.$api.deletePointReportData({ id: rowParam.row.id })
                            .then(res => {
                                this.$Modal.remove();
                                this.$Message.success('删除成功');
                                this.searchWorkResult();
                            })
                            .catch(err => {
                                this.$Modal.remove();
                            });
                    },
                    onCancel: () => {}
                });
            },
        },
        components: {addOrInsertInfoPoint},
        mounted() {
            // 动态计算显示数据表格的高度,目的是固定表头,防止当一页数据量大滚动数据不知道数据列的属性;
            this.tableHeight = this.$refs.workResult.offsetHeight - this.$refs.searchCondtion.offsetHeight-270;

            this.searchWorkResult();
        }
    }
</script>

<style scoped>
  .workResult {
    display: flex;
    height: 100%;
    flex-direction: column;
    background-color: #1D2437;
  }
</style>
