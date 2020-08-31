<template>
  <div ref="workPoint" style="padding: 10px 10px 0 10px" class="workPoint">
    <Spin size="large" fix v-if="loading">加载中...</Spin>
    <i-form :model="serachCondtion" inline :label-width="90" style="padding-top:15px">
        <Form-item label="站点编码：">
            <i-input v-model="serachCondtion.workStationCode" placeholder="作业站点编码："></i-input>
        </Form-item>
        <Form-item label="站点名称：">
            <i-input v-model="serachCondtion.workStationName" placeholder="作业站点名称："></i-input>
        </Form-item>
        <Form-item label="作业点地址：">
            <i-input v-model="serachCondtion.workStationAddr" placeholder="作业点地址："></i-input>
        </Form-item>
        <Form-item :label-width="0">
            <i-button type="primary" v-has="'/workStationInfo/selectWorkStationInfo'" @click="search">查询</i-button>
            <i-button type="primary" v-has="'/workStationInfo/insertOrUpdateWorkStationInfo'" @click="openModal('insert')">新增</i-button>
        </Form-item>
    </i-form>
    <Table ref="workResultTable" :height="tableHeight" border stripe :columns="columns1" :data="tableData"></Table>
    <br>
    <Page style="text-align: right;padding-bottom: 20px;position: absolute;bottom: 20px;right: 14px;" :total="total" :page-size="serachCondtion.pageSize" :page-size-opts="[10,15,20,50]" :current.sync="serachCondtion.startPage" @on-change="pageChanged" @on-page-size-change="pageOptionChanged" show-elevator show-sizer show-total />
    <!-- 编辑新增的模modalData态框 -->
    <add-or-update-work-point class="inPageModal" @handleSucc="getData" :modalData="modalOption"></add-or-update-work-point>
  </div>
</template>

<script>
import addOrUpdateWorkPoint from '@/components/addOrUpdateWorkPoint';
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
          workStationCode: '', // 站点名称
          workStationName: '', // 站点名称
          workStationAddr: '', // 作业点地址
          pageSize: 10, // 每页显示个数
          startPage: 1
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
          title: "站点名称",
          key: "workStationName",
          tooltip: true,
          width: 230,
        },
        {
          title: "站点编码",
          key: "workStationCode",
          width: 230,
        },
        {
          title: "经度",
          key: "longitude",
          width: 230
        },
        {
          title: "纬度",
          key: "latitude",
          width: 230,
        },
        {
          title: "海拔",
          key: "altitude",
          width: 197,
        },
        // {
        //   title: "装备类型",
        //   key: "typeName",
        //   minWidth: 150,
        //   tooltip: true,
        //   // render: (h, params) => {
        //   //     return h('div', [
        //   //         h('span', {}, params.row.workStationType.split(',').map(item => ['火箭','高炮'][parseInt(item) - 1]).join(', '))
        //   //     ]);
        //   // }
        //   width: (window.innerWidth-500)/8,
        // },
        // {
        //   title: "作业半径",
        //   key: "workRadius",
        //   minWidth: 150,
        //   width: (window.innerWidth-500)/8,
        // },

        {
          title: "作业点地址",
          key: "workStationAddr",
          tooltip: true,
          width: 330,
        },
        {
          title: "操作",
          key: "modified",
          align: "center",
          width: 160,
          // fixed: 'right',
          render: (h, params) => {
            return h("div", [
              h(
                "Button", {
                    props: { type: 'primary' },
                    style: { marginRight: '5px' },
                    on: {
                        click: () => this.openModal('update', params)
                    },
                    directives: [{
                        name: 'has',
                        value: '/workStationInfo/insertOrUpdateWorkStationInfo'
                    }]
                }, "编辑"),
              h('Button', {
                  props: { type: 'error' },
                  style: { marginRight: '5px' },
                  on: {
                      click: () => this.deleteData(params)
                  },
                  directives: [{
                      name: 'has',
                      value: '/workStationInfo/deleteWorkStationInfo'
                  }]
              }, '删除')
            ]);
          }
        }
      ],
      data1: []
    };
  },
  components: { addOrUpdateWorkPoint },
  methods: {
    getPageIndex(row) {
        return (this.serachCondtion.startPage - 1) * this.serachCondtion.pageSize + row._index + 1;
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
              this.$api.deleteWorkStationInfo({ i: rowParam.row.id })
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
      this.$api.selectWorkStationInfo(this.serachCondtion)
      .then(res => {
          this.tableData = res.data.data.map(item => {
            item.stationTels = item.stationTels ? item.stationTels.split(',') : [];
            return item;
          });
          this.total = res.data.total;
      })
      .finally(res => this.loading = false);
    },
    search() {
      this.serachCondtion.startPage = 1;
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
    this.tableHeight = this.$refs.workPoint.offsetHeight - 220;
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