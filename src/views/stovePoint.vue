<template>
  <div ref="workPoint" style="padding: 10px 10px 0 10px" class="workPoint">
    <Spin size="large" fix v-if="loading">加载中...</Spin>
    <i-form :model="serachCondtion" inline :label-width="90" style="padding-top:15px">
        <Form-item label="站点名称：">
            <i-input v-model="serachCondtion.workStationName" placeholder="名称："></i-input>
        </Form-item>
        <Form-item :label-width="0">
            <i-button type="primary" v-has="'/stove/list'" @click="search">查询</i-button>
            <i-button type="primary" v-has="'/stove/insert'" @click="openModal('insert')">新增</i-button>
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
          workStationName: '', // 站点名称
          pageSize: 10, // 每页显示个数
          pageNum: 1   //当前页
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
          width: (window.innerWidth-500)/9,
        },
        {
          title: "经度",
          key: "longitude",
          minWidth: 100,
          tooltip: true,
          width: (window.innerWidth-500)/9,
        },
        {
          title: "纬度",
          key: "latitude",
          minWidth: 90,
          width: (window.innerWidth-500)/9,
        },
        {
          title: "海拔高度",
          key: "altitude",
          minWidth: 90,
          width: (window.innerWidth-450)/9,
        },
        {
          title: "主导风向",
          key: "prevailingWindDirection",
          minWidth: 70,
          width: (window.innerWidth-600)/9,
        },
        {
          title: "迎风/背风坡",
          key: "windwardLeewardSlope",
          minWidth: 90,
          tooltip: true,
          render: (h, params) => {
              return h('div', [
                  h('span', {}, params.row.windwardLeewardSlope == '0' ? '迎风坡' : '背风坡')
              ]);
          },
          width: (window.innerWidth-200)/9,
        },
        {
          title: "烟炉型号",
          key: "smokeOvenType",
          minWidth: 90,
          width: (window.innerWidth-560)/9,
        },
        {
          title: "是否有移动信号",
          key: "is4G",
          minWidth: 120,
          tooltip: true,
          render: (h, params) => {
              return h('div', [
                  h('span', {}, params.row.is4G == '0' ? '没有' : params.row.is4G == '1' ? '有' : ' ')
              ]);
          },
          width: (window.innerWidth-500)/9,
        },
        {
         title: "联系方式",
          key: "tels",
          minWidth: 135,
          tooltip: true,
          render: (h, params) => {
              return h('div', [
                  h('span', {}, params.row.tels+'  ')
              ]);
          },
          width: (window.innerWidth-400)/9,
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
                        value: '/stove/update'
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
                      value: '/stove/delete'
                  }]
              }, '删除')
            ]);
          }
        }
      ],
      data1: []
    };
  },
  components: { addOrInsertStovePoint },
  methods: {
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
      this.$api.selectStoveStationInfo(this.serachCondtion)
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