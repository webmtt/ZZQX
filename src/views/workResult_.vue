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
    <i-form :model="serachCondtion" inline :label-width="100" style="padding-top:15px">
      <Form-item prop="name" label="站点名称：">
        <i-input type="text" v-model="serachCondtion.name" placeholder="站点名称">
        </i-input>
      </Form-item>
      <Form-item label="作业开始时间：">
        <DatePicker @on-change="timeRangeChange" type="datetimerange" placeholder="选择作业开始时间所在的范围" style="width: 300px"></DatePicker>
      </Form-item>
      <Form-item :label-width="0" style="margin-left:25px;">
        <i-button type="primary" v-has="'/situation/select'" @click="search">查询</i-button>
        <i-button type="primary" v-has="'/situation/saveOrUpdate'" @click="openModal('insert')">新增</i-button>
        <i-button type="primary" v-has="'/situation/export'" @click="exoportExcel">导出EXCEL</i-button>
      </Form-item>
    </i-form>
    <Table ref="workResultTable" :height="tableHeight" border stripe :columns="columns1" :data="tableData"></Table>
    <Page style="position: absolute;bottom: 22px;right: 11px;" :total="total" :page-size="serachCondtion.pageSize" :page-size-opts="[10,15,20,50]" :current.sync="serachCondtion.pageNum" @on-change="pageChanged" @on-page-size-change="pageSizeOptionChanged" show-elevator show-sizer show-total />
    <!-- 编辑/新增作业结果的模态框 -->
    <work-result-submit class="inPageModal" @handleSucc="searchWorkResult" :modalData="modalOption"></work-result-submit>
  </div>
</template>

<script>
    import axios from 'axios';
    import workResultSubmit from '@/components/addOrUpdateWorkResult';

    export default {
        name: 'workResultPart',
        data() {
            return {
                loading: false,
                total: 0,
                modalOption: {
                    show: false,
                    data: null
                },
                currentHandleData: null,
                tableHeight: 300,
                serachCondtion: {
                    name: '', // 站点名称
                    startDate: '', // 起始时间
                    endDate: '', // 起始时间
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
                        width: 130
                    },
                    {
                        title: '作业器具类型',
                        key: 'equipmentModel',
                        tooltip: true,
                        width: 130,
                    },
                    {
                        title: '作业类型',
                        key: 'taskType',
                        tooltip: true,
                        width: 110
                    },
                    {
                        title: '使用装备器材',
                        key: 'equipment',
                        width: 300,
                        tooltip: true,
                    },
                    {
                        title: '作业开始时间',
                        key: 'beginTime',
                        tooltip: true,
                        width: 180
                    },
                    {
                        title: '作业结束时间',
                        key: 'endTime',
                        tooltip: true,
                        width: 180
                    },
                    {
                        title: '填写日期',
                        key: 'createTime',
                        tooltip: true,
                        width: 130,
                    },
                    {
                        title: '作业效果',
                        key: 'comment',
                        width: 155,
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
                                    style: { marginRight: '5px' },
                                    on: {
                                        click: () => this.openModal('update', params)
                                    },
                                    directives: [{
                                        name: 'has',
                                        value: '/situation/saveOrUpdate'
                                    }]
                                }, '编辑'),
                                h('Button', {
                                    props: { type: 'error' },
                                    on: {
                                        click: () => this.deleteData(params)
                                    },
                                    directives: [{
                                        name: 'has',
                                        value: '/situation/delete'
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
                console.log(this.tableHeight);
                this.loading = true;
                return this.$api.getWorkResultData(this.serachCondtion)
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
                        this.$api.deleteWorkResultData({ id: rowParam.row.id })
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

            /**
             * 以excel的方式导出当前查询条件下的所有数据
             * @method exoportExcel
             * @returns {undefined}
             */
            exoportExcel() {
                axios.get('/situation/export', { responseType: 'blob', params: this.serachCondtion })
                    .then(res => {
                        //这里res.data是返回的blob对象
                        const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' });
                        const downloadElement = document.createElement('a');
                        const href = window.URL.createObjectURL(blob);
                        downloadElement.href = href;
                        downloadElement.download = '作业效果数据.xls';
                        document.body.appendChild(downloadElement);
                        downloadElement.click();
                        document.body.removeChild(downloadElement);
                        window.URL.revokeObjectURL(href);
                    });
            }
        },
        components: {workResultSubmit},
        mounted() {
            // 动态计算显示数据表格的高度,目的是固定表头,防止当一页数据量大滚动数据不知道数据列的属性;
            this.tableHeight = this.$refs.workResult.offsetHeight-210;

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
