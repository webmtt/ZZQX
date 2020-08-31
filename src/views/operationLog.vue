<template>
  <div ref="workPoint" style="padding: 10px 10px 0 10px" class="workPoint">
    <Spin size="large" fix v-if="loading">加载中...</Spin>
    <i-form :model="serachCondtion" inline :label-width="96" style="padding-top:15px">
        <Form-item label="用户：">
            <i-input v-model="serachCondtion.userName" ></i-input>
        </Form-item>
        <Form-item label="作业开始时间：">
            <DatePicker @on-change="timeRangeChange" type="datetimerange" placeholder="选择作业开始时间所在的范围" style="width: 300px"></DatePicker>
        </Form-item>
        <Form-item :label-width="0">
            <i-button type="primary" v-has="'/stove/list'" @click="search">查询</i-button>
        </Form-item>
    </i-form>
    <Table ref="workResultTable" :height="tableHeight" border stripe :columns="columns1" :data="tableData"></Table>
    <br>
    <Page style="text-align: right;padding-bottom: 20px;position: absolute;bottom: 20px;right: 14px;" :total="total" :page-size="serachCondtion.pageSize" :page-size-opts="[10,15,20,50]" :current.sync="serachCondtion.pageNum" @on-change="pageChanged" @on-page-size-change="pageOptionChanged" show-elevator show-sizer show-total />
    <!-- 编辑新增的模modalData态框 -->
    <add-or-insert-stove-point class="inPageModal" @handleSucc="getData" :modalData="modalOption"></add-or-insert-stove-point>
  </div>
</template>

<script>
import addOrInsertStovePoint from '@/components/addOrInsertStovePoint';
export default {
  name: "workPointPart",
  data() {
    return {
      loading: false,
      tableData: [],
      total: 0,
      tableHeight: 300,
      modalOption: {
          show: false,
          data: null
      },
      serachCondtion: {
          userName: '', // 站点名称
          pageSize: 10, // 每页显示个数
          pageNum: 1,   //当前页
          startTime: '',  //操作时间-开始
          endTime: ''  //操作时间-结束
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
          title: "操作用户名称",
          key: "name",
          width: (window.innerWidth-700)/8,
        },
        {
          title: "操作用户",
          key: "userName",
          minWidth: 100,
          tooltip: true,
          width: (window.innerWidth-700)/8,
        },
        {
          title: "描述",
          key: "description",
          minWidth: 90,
          tooltip: true,
          width: (window.innerWidth+1400)/8,
        },
        {
          title: "IP地址",
          key: "ip",
          minWidth: 90,
          width: (window.innerWidth-700)/8,
        },
        {
          title: "URL",
          key: "uri",
          minWidth: 70,
          tooltip: true,
          width: (window.innerWidth-400)/8,
        },
        {
          title: "请求方式",
          key: "requestMethod",
          minWidth: 90,
          tooltip: true,
          width: (window.innerWidth-1000)/8,
        },
        {
          title: "参数",
          key: "requestParams",
          minWidth: 90,
          tooltip: true,
          width: (window.innerWidth-185)/8,
        },
        {
          title: "操作时间",
          key: "createTime",
          minWidth: 120,
          tooltip: true,
          width: (window.innerWidth-200)/8,
        }
      ],
      data1: []
    };
  },
  components: { addOrInsertStovePoint },
  methods: {
    timeRangeChange(val) {
        this.serachCondtion.startTime = val[0];
        this.serachCondtion.endTime = val[1];
    },
    getPageIndex(row) {
        return (this.serachCondtion.pageNum - 1) * this.serachCondtion.pageSize + row._index + 1;
    },
    /**
     * @method deleteData
     * 删除作业点位
     */
    deleteData(rowParam) {
      this.$Modal.confirm({
          title: '提示',
          content: '<p>确定要删除吗？</p>',
          loading: true,
          onOk: () => {
              this.$api.deleteStoveStationInfo({ id: rowParam.row.id })
              .then(res => {
                  this.$Modal.remove();
                  this.$Message.success('删除成功');
                  this.getData();
              })
              .catch(err => {
                  this.$Modal.remove();
              });
          },
          onCancel: () => {}
      });
    },
    /**
     * @method getData
     * 获取作业点位查询数据
     */
    getData() {
      this.loading = true;
      this.$api.selectOperationLog(this.serachCondtion)
      .then(res => {
        console.log(res);
          this.tableData = res.data.list.map(item => {
            item.tels = item.tels ? item.tels.split(',') : '';
            return item;
          });
          this.total = res.data.total;
      })
      .finally(res => this.loading = false);
    },
    search() {
      this.getData();
    },
    pageChanged() {
        this.getData();
    },
    pageOptionChanged(val) {
        this.serachCondtion.pageSize = val;
        this.getData();
    },
    openModal(flag, rowParam) {
        this.modalOption = { show: true, data: rowParam };
    }
  },
  mounted() {
    // 计算表格的最大高度;
    this.tableHeight = this.$refs.workPoint.offsetHeight - 230;
    this.getData();
  }
}
</script>

<style scoped>
    .workPoint {
        display: flex;
        height: 100%;
        flex-direction: column;
        background-color: #1D2437;
    }
</style>