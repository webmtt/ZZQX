<template>
  <div id="orderHeight" ref="workOrder" class="workOrder">
      <div ref="searchCondtion" style="background-color: #343B57;height: 39px;padding: 0px 18px;" class="searchCondtion">
      <el-form :inline="true">
        <span style="color: #b5c4e0;margin: 12px 5px 0px 0px;display: inline-block;">预报时间</span>
        <el-form-item>
          <el-select size="small" style="width:180px" v-model="searchCondtion.date" @change="getData" placeholder="请选择日期时间">
            <el-option v-for="(item, index) in searchCondtion.timeList" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <RadioGroup style="color: #b5c4e0;"  @on-change="selectTimePeriod" v-model="period">
          <Radio label="全时段"></Radio>
          <Radio label="工作时段 (24:00-06:00)"></Radio>
		    </RadioGroup>
        <div style="display: inline-block;color:#b5c4e0;font-size:15px;margin-right:10px;">dbz</div>
        <el-form-item id="dbz">
          <el-select v-model="model1" style="width: 70px;" size="small">
            <el-option v-for="item in dbzList" :value="item.value" :key="item.value">{{ item.label }}</el-option>
          </el-select>
        </el-form-item>
        <Icon id="arrow" style="color:#dae2ff;" @click="arrowDropdown" type="md-arrow-dropdown"/>
      </el-form>
    </div>
    <div style="display:none" id="workOrder" class="tablePadding">
      <img style="vertical-align: text-bottom;" :src="img">
      <div class="workOderTitle">作业指令</div>
       <!-- 数据筛选 -->
    <!-- 数据显示 -->
    <table-list :emptyString="noDataText" v-loading="loading" element-loading-text="拼命加载中"  element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.5)" class="dataArea" v-if="tableHeight" :total="total" :showHeader="false" :tableHeight="tableHeight" :headerData="tableHeader" :dataList="tableData">
      <!-- 自定义列 -->
      <template v-slot:deleteColoum>
        <el-table-column width="90" align="center" label="操作" fixed="right">
          <template slot-scope="scope">
              <!--<el-button type="primary" class="operate-download" v-has-hide="'/operatingArea/delOrderById'" size="mini" @click="deleteWorkOrderData($event, scope.row)">删 除</el-button>-->
              <i-button type="primary" class="operate-download" @click="deleteWorkOrderData($event, scope.row)" v-has="'/operatingArea/delOrderById'">删 除</i-button>
          </template>
        </el-table-column>
      </template>
    </table-list>
    <!-- 添加新作业位置 -->
    <div ref="handleArea" class="handleArea">
      <div class="orderEdit" style="flex: 1;width: 100%;background: #242A40;margin-top: 25px;">
        <el-form v-show="activeRow.stationName" :inline="true" style="margin:9px 15px;width: 100%;height: 105px;">
            <!--<span style="color:#fff; font-weight: bold">{{activeRow.stationName}}</span>-->
            <el-form-item>
              <el-input style="width:1066px;" type="textarea" rows="3" cols="35" v-model="activeRow.order">{{activeRow.order}}</el-input>
            </el-form-item>
            <!--<el-form-item>
                <el-button width="100" type="primary" v-has-hide="'/operatingArea/updateOrderById'" :loading="ajaxLoding" @click="updateOrder">{{activeRow.originOrder ? '修改指令' : '新增指令'}}</el-button>
            </el-form-item>-->
        </el-form>
      </div>
      <div>
        <!--<el-button style="border-raidius: 4px;background-color: #1E74F1;border: none;position: absolute;right: 134px;margin-top: 18px;" width="100" type="primary" v-has-hide="'/operatingArea/updateOrderById'" :loading="ajaxLoding" @click="generateOrder">生成指令</el-button>-->
        <i-button style="border-radius: 4px;border: none;position: absolute;right: 249px;margin-top: 18px;bottom: 50px;" width="100" type="primary" :loading="ajaxLoding" @click="generateOrder" v-has="'/operatingArea/generateJobInstructions'">生成指令</i-button>
      </div>
      <div>
        <!--<el-button style="border-radius: 4px;background-color: #1E74F1;border: none;position: absolute;right: 249px;margin-top: 18px;" width="100" type="primary" v-has-hide="'/operatingArea/updateOrderById'" :loading="ajaxLoding" @click="updateOrder">{{activeRow.originOrder ? '修改指令' : '新增指令'}}</el-button>-->
        <!--<el-button style="border-radius: 4px;background-color: #1E74F1;border: none;position: absolute;right: 249px;margin-top: 18px;" width="100" type="primary" v-has-hide="'/operatingArea/updateOrderById'" :loading="ajaxLoding" @click="updateOrder">修改指令</el-button>-->
        <i-button style="border-radius: 4px;border: none;position: absolute;right: 134px;margin-top: 18px;bottom: 50px;" width="100" type="primary" :loading="ajaxLoding" @click="updateOrder" v-has="'/operatingArea/updateOrderById'">修改指令</i-button>
      </div>
      <div>
          <!--<el-button style="border-radius: 4px;background-color: #1E74F1;border: none;position: absolute;right: 19px;margin-top: 18px;" :loading="generateOrderLoding" :disabled="total == 0" v-has-hide="'/operatingArea/generateJobInstructions'" @click="generateOrder" type="primary">指令生成</el-button>-->
          <!--<el-button style="border-radius: 4px;background-color: #1E74F1;border: none;position: absolute;right: 19px;margin-top: 18px;" :loading="assignOrderLoading" :disabled="total == 0" v-has-hide="'/operatingArea/sendAll'" @click="assignOrder" type="primary">一键发送</el-button>-->
          <i-button style="border-radius: 4px;border: none;position: absolute;right: 19px;margin-top: 18px;bottom: 50px;" :loading="assignOrderLoading" @click="assignOrder" type="primary" v-has="'/operatingArea/sendAll'">一键发送</i-button>
      </div>
    </div>
    <Modal v-model="showModal" title="请选择指令生成时间">
      <Form ref="timeChoice" :model="formModel" v-if="showModal" :label-width="100" :rules="ruleValidate">
        <FormItem label="时间段选择" prop="generateOrderTime">
          <DatePicker style="width: 388px" type="datetimerange" format="yyyy-MM-dd HH:mm" v-model="formModel.generateOrderTime" placeholder="时间段选择"></DatePicker>
        </FormItem>
        <FormItem label="作业类型选择" prop="type">
          <Select v-model="formModel.type" :label-in-value="true">
              <Option v-for="(item, ix) in typeOptions" :value="item" :key="ix">{{item}}</Option>
          </Select>
        </FormItem>
      </Form>
        <template #footer>
            <i-button type="primary" @click="handleCancel">取消</i-button>
            <i-button type="primary" @click="handleOk">确定</i-button>
        </template>
    </Modal>
    </div>
  </div>
</template>

<script>
import tableList from '@/components/tableList';
import { Promise } from 'q';
export default {
  name: 'workOrder',
  data () {
    const validateTimeRange = (rule, value, callback) => {
        if (value.length != 2) {
            callback(new Error('时间段不完整'));
        }
        if (!value[0] || !value[1]) {
            callback(new Error('时间段不完整'));
        }
        if (this.$moment(value[0]).valueOf() > this.$moment(value[1]).valueOf()) {
          callback(new Error('开始时间不能大于结束时间'));
        }
        callback();
    };
    return {
        img: require('../../assets/images/assign.png'),
        loading: true,
        noDataText: ' ',
        ajaxLoding: false,
        showModal: false,
        generateOrderLoding: false,
        assignOrderLoading: false,
        searchCondtion: { date: '', timeList: [], type: ''},
        total: 0,
        tableHeight: 0,
        activeRow: { order: '', stationName: '', originOrder: '', id: '' },
        tableHeader: [
            { prop: 'name', label: '点位名称',width:(window.innerWidth-410)/5},
            { prop: 'isFit', label: '适合作业',width:(window.innerWidth-410)/5},
            { prop: 'sendCount', label: '发送次数',width:(window.innerWidth-410)/5},
            { prop: 'isAuto', label: '自动生成',width:(window.innerWidth-415)/5},
            { prop: 'taskType', label: '作业类型',width:(window.innerWidth-415)/5}
        ],
        tableData: [],
        typeOptions: ['增雨', '减雨'],
        formModel: {
          generateOrderTime: [],
          type: '增雨'
        },
        ruleValidate: {
            generateOrderTime: [{ validator: validateTimeRange, trigger: 'change' }]
        },
        period: '全时段',
        dbzList: [
                    {
                        value: '35',
                        label: '35'
                    },
                    {
                        value: '30',
                        label: '30'
                    },
                    {
                        value: '25',
                        label: '25'
                    },
                    {
                        value: '20',
                        label: '20'
                    },
                    {
                        value: '15',
                        label: '15'
                    }
                ],
                model1: '30'
            }
  },
  computed: {
  },
  components: { tableList },
  props: ['parentHeight'],
  methods: {
    arrowDropdown(){
      if(document.getElementById("workOrder").style.display == "none"){
        document.getElementById("workOrder").style.display="block";
        document.getElementById("arrow").style.transform="rotate(180deg)";
        document.getElementById("orderHeight").style.height="93vh";
      }else{
        document.getElementById("workOrder").style.display="none";
        document.getElementById("arrow").style.transform="rotate(0deg)";
        document.getElementById("orderHeight").style.height="0vh";
      }
    },
    getDataList(){
      const params ={ type: this.searchCondtion.type };
      this.$api.getWorkOrderTimeList(params)
      .then(res => {
        this.searchCondtion.timeList = res.data;
        this.searchCondtion.date = res.data[0];
        // 加载作业区域数据;
        return this.getData();
      })
      .catch(error => {
        throw new Error(error);
      });
    },
    selectTimePeriod(){
      this.searchCondtion.type = this.period === '工作时段 (24:00-06:00)' ? 'work' : 'all';
      this.getDataList();
    },
    bindEvents() {
      this.$bus.on(this.$eventTypes.TABLELINESELECTED, val => {
        this.activeRow = { order: val.order, stationName: val.name, originOrder: val.order, id: val.id };
        this.$bus.emit(this.$eventTypes.POINTLOCATION, [val.lon, val.lat]);
      });
    },
    deleteWorkOrderData(event, row) {
      // 点击删除阻止定位事件;
      event.stopPropagation();
      this.$Modal.confirm({
          title: '提示',
          content: '<p>确定要删除吗？</p>',
          loading: true,
          onOk: () => {
              this.$api.deleteOrderData({ id: row.id })
                  .then(res => {
                      this.$Modal.remove();
                      this.$Message.info('删除成功');
                      return this.getData();
                  })
                  .catch(err => {
                      this.$Modal.remove();
                  });
          },
          onCancel: () => {}
      });
    },
    getData() {
      this.loading = true;
      const params = { time: this.searchCondtion.date };
      this.$api.getWorkOrderDataList(params)
          .then(res => {
              this.tableData = res.data.map(item => ({
                id: item.id,
                name: item.stationName,
                rain: `${item.pre} mm`,
                loc: `${item.lon}'E， ${item.lat}'N`,
                isAuto: item.isAuto == '1' ? '是' : '否',
                taskType: item.taskType,
                sendCount: item.sendCount,
                isFit: item.isFit == '0' ? '是' : '否',
                order: item.optCMD,
                lon: item.lon,
                lat: item.lat,
                stationId: item.stationID
              }));
              this.total = res.data.length;
              if (this.tableData.length) {
                this.$nextTick(() => {
                  this.activeRow = { order: this.tableData[0].order, stationName: this.tableData[0].name, originOrder: this.tableData[0].order, id: this.tableData[0].id };
                });
              }
          })
          .catch(err => {
              this.tableData = [];
              this.total = 0;
          })
          .finally(() => {
            this.loading = false;
            this.noDataText = this.total ? '' : '暂无数据';
            const workStationIds = this.tableData.map(item => item.stationId);
            const data = this.$store.state.stationLoc.map(item => {
                const temp = {};
                for (let key in item) {
                  temp[key] = item[key];
                }
                temp.isWorkStation = workStationIds.includes(item.workStationCode);
                return temp;
            });
            this.$bus.emit(this.$eventTypes.ADDPOINTMARKER, { points: data, type: 'stations-vectLayer' });
          });
    },
    updateOrder() {
      const param = {
        id: this.activeRow.id,
        optCMD: this.activeRow.order
      };
      this.$Modal.confirm({
          title: '提示',
          content: '<p>确定要更新该条指令吗？</p>',
          loading: true,
          onOk: () => {
              this.ajaxLoding = true;
              this.$api.updateOrAddOrder(param)
                .then(res => {
                  //重新刷新表格
                  this.$Message.success(`更新指令成功`);
                  return this.getData();
                })
                .catch(error => {
                  throw new Error(error);
                })
                .finally(res => {
                  this.$Modal.remove();
                  this.ajaxLoding = false;
                });
          }
      });
    },
    handleOk() {
      this.$refs['timeChoice'].validate((valid) => {
          if (valid) {
              this.$Modal.confirm({
                  title: '提示',
                  content: '<p>确定要生成指令吗？</p>',
                  loading: true,
                  onOk: () => {
                      this.generateOrderLoding = true;
                      this.showModal = false;
                      this.$api.generateOrder({
                        startTime: this.$moment(this.formModel.generateOrderTime[0]).format('YYYY-MM-DD HH:mm:ss'),
                        endTime: this.$moment(this.formModel.generateOrderTime[1]).format('YYYY-MM-DD HH:mm:ss'),
                        opTime: this.searchCondtion.date,
                        type: this.formModel.type,
                        dbz: this.model1
                      })
                        .then(res => {
                          this.$Message.success(res.message);
                          this.getData();
                          this.$api.getWorkOrderTimeList()
                              .then(res => {
                                this.searchCondtion.timeList = res.data;
                                this.searchCondtion.date = res.data[0];
                                // 加载作业区域数据;
                              })
                              .catch(error => {
                                throw new Error(error);
                              });
                        })
                        .finally(() => {
                          this.$Modal.remove();
                          this.generateOrderLoding = false
                        });
                  },
                  onCancel: () => {
                    this.$refs['timeChoice'].resetFields();
                    this.showModal = false;
                  }
              });
          } else {
              console.log('fail');
          }
      })
      
    },
    handleCancel() {
      this.showModal = false;
    },
    generateOrder() {
      this.showModal = true;
    },
    assignOrder() {
      const notFitLen = this.tableData.filter(item => item.isFit === '否').length;
      if (notFitLen) {
        this.$Modal.info({
            title: '提示',
            content: '该时间段下存在不适合作业的站点，请修改或删除后再进行操作!',
            zIndex: 15000
        });
      } else {
        this.$Modal.confirm({
          title: '提示',
          content: '<p>确定要发送指令吗？</p>',
          loading: true,
          onOk: () => {
              this.assignOrderLoading = true
              this.$api.sendOrder({ opTime: this.searchCondtion.date })
              .then(res => {
                this.$Message.info(res.message);
                return this.getData()
                })
              .finally(() => {
                this.assignOrderLoading = false;
                this.$Modal.remove();
              });
          }
        });
      }
    }
  },
  mounted() {
    this.tableHeight = window.innerHeight-428;
    this.bindEvents();
    // 先获取筛选时间列表;
    this.$api.getWorkOrderTimeList()
      .then(res => {
        this.searchCondtion.timeList = res.data;
        this.searchCondtion.date = res.data[0];
        // 加载作业区域数据;
        return this.getData();
      })
      .catch(error => {
        throw new Error(error);
      });
    },
  beforeDestroy() {
    this.$bus.off(this.$eventTypes.TABLELINESELECTED);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .workOderTitle{
    color: #eef4ff;
    font-size: 21px;
    margin: 24px 0px;
    display: inline-block;
    margin-left: 5px;
  }
  .workOrder{
      display: flex;
      width: 100%;
      background-color: #1D2437;
      flex-direction: column;
  }
  .workOrder .dataArea {
      flex: 1
  }
  .workOrder .handleArea {
    height: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
