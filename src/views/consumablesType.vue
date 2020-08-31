<template>
  <div ref="equipmentWrapper" style="padding: 10px 10px 0 10px" class="equipmentWrapper">
    <Spin size="large" fix v-if="loading">加载中...</Spin>
    <i-form :model="serachCondtion" inline :label-width="80" style="padding-top:15px">
        <Form-item label="器材名称：">
            <i-input v-model="serachCondtion.name" placeholder="器材名称："></i-input>
        </Form-item>
        <Form-item label="型号：">
            <i-input v-model="serachCondtion.type" placeholder="型号："></i-input>
        </Form-item>
        <Form-item :label-width="0">
            <i-button type="primary" v-has="'/consumablesType/list'" @click="search">查询</i-button>
            <i-button type="primary" v-has="'/consumablesType/insert'" @click="openModal('insert')">新增</i-button>
        </Form-item>
    </i-form>
    <Table ref="workResultTable" :height="tableHeight" border stripe :columns="columns1" :data="tableData"></Table>
    <br>
    <Page style="text-align: right;padding-bottom: 20px;position: absolute;bottom: 20px;right: 14px;" :total="total" :page-size="serachCondtion.pageSize" :page-size-opts="[10,15,20,50]" :current.sync="serachCondtion.pageNum" @on-change="pageChanged" @on-page-size-change="pageOptionChanged" show-elevator show-sizer show-total />
    <!-- 编辑新增的模modalData态框 -->
    <add-or-update-consumables-type class="inPageModal" @handleSucc="getData" :modalData="modalOption"></add-or-update-consumables-type>
  </div>
</template>

<script>
import addOrUpdateConsumablesType from '@/components/addOrUpdateConsumablesType';
export default {
  name: "t1",
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
          name: '', // 器材名称：
          type: '', // 型号
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
          title: "器材名称",
          key: "name",
          width: 140,
          tooltip: true
        },
        {
          title: "型号",
          key: "type",
          width: 160
        },
        {
          title: "数量",
          key: "number",
          width: 140
        },
        {
          title: "描述",
          key: "description",
          width: 280
        },
        {
          title: "供应商",
          width: 297,
          key: "companyName",
          tooltip: true
        },
        {
          title: "填报人",
          key: "filler",
          width: 180
        },
        {
          title: "填报日期",
          width: 250,
          key: "createTime",
          tooltip: true
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
                        value: '/consumablesType/update'
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
                      value: '/consumablesType/delete'
                  }]
              }, '删除')
            ]);
          }
        }
      ],
      data1: []
    };
  },
  components: { addOrUpdateConsumablesType },
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
              this.$api.deleteOrUpdateConsumables({ id: rowParam.row.id })
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
      this.$api.selectConsumablesType(this.serachCondtion)
      .then(res => {
          if (!res) return;
          this.tableData = res.data.list.map(item => {
            return item;
          });
          this.total = res.data.total;
      })
      .finally(() => this.loading = false)
    },
    search() {
      this.serachCondtion.pageNum = 1;
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
    this.tableHeight = this.$refs.equipmentWrapper.offsetHeight-190;
    this.getData();
  }
};
</script>

<style scoped lang='less'>
.equipmentWrapper {
  display: flex;
  height: 100%;
  flex-direction: column;
  background-color: #1D2437;
}
</style>