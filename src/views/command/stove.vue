<template>
  <div id="stoveHeight" ref="workArea" class="workArea">
    <!-- 数据筛选 -->
    <div ref="searchCondtion" style="background-color: #343B57;height: 39px;padding: 0px 18px;" class="searchCondtion">
      <el-form :inline="true">
        <span style="color: #b5c4e0;margin: 12px 5px 0px 0px;display: inline-block;">预报时间</span>
        <el-form-item>
          <el-select v-model="searchCondtion.date" @change="getData" placeholder="请选择日期时间">
            <el-option v-for="(item, index) in searchCondtion.timeList" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <RadioGroup style="color:#b5c4e0;"  @on-change="selectTimePeriod" v-model="period">
          <Radio label="全时段"></Radio>
          <Radio label="工作时段 (24:00-06:00)"></Radio>
        </RadioGroup>
        <Icon id="arrow" style="color:#dae2ff;" @click="arrowDropdown" type="md-arrow-dropdown"/>
      </el-form>
    </div>
    <div style="display:none" id="workStove" class="tablePadding">
      <img style="vertical-align: text-bottom;" :src="img">
      <div class="workStoveTitle">烟炉指令</div>
      <!-- 数据显示 -->
    <table-list :emptyString="noDataText" v-loading="loading" element-loading-text="拼命加载中"  element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.5)" class="dataArea" v-if="tableHeight" :total="total" :showHeader="false" :tableHeight="tableHeight" :headerData="tableHeader" :dataList="tableData">
      <!-- 自定义列 -->
      <template v-slot:deleteColoum>
        <el-table-column width="90" label="操作" fixed="right">
          <template slot-scope="scope">
              <!--<el-button type="primary" class="operate-download" v-has-hide="'/operatingArea/delOperatingArea'" size="mini" @click="deleteWorkAreaData($event, scope.row)">删 除</el-button>-->
              <i-button type="primary" class="operate-download"  @click="deleteWorkAreaData($event, scope.row)" v-has="'/operatingStove/delete'">删 除</i-button>
          </template>
        </el-table-column>
      </template>
    </table-list>
    <!-- 添加新作业位置 -->
    <div ref="handleArea" class="handleArea">
      <el-form :inline="true" :model="newLocation" class="newLocation">
        <!--<el-button style="border-radius: 4px;background-color: #1E74F1;border: none;position: absolute;right: 19px;margin-top: 18px;" :loading="assignOrderLoading" :disabled="total == 0" v-has-hide="'/operatingArea/sendAll'" @click="assignOrder" type="primary">一键发送</el-button>-->
        <i-button style="border-radius: 4px;border: none;position: absolute;right: 19px;margin-top: 18px;bottom: 50px;" :loading="assignOrderLoading" @click="assignOrder" type="primary" v-has="'/operatingStove/sendAll'">一键发送</i-button>
      </el-form>
    </div>
    </div>
  </div>
</template>

<script>
import tableList from '@/components/tableList';
export default {
  name: 'workArea',
  data () {
    return {
        img: require('../../assets/images/assign.png'),
        assignOrderLoading: false,
        loading: true,
        noDataText: ' ',
        timeSelectValue: '',
        searchCondtion: { date: '', timeList: [],type: 'all'},
        total: 0,
        pickerOptions: {
          disabledDate: time => time.getDate() < new Date().getDate() || time.getDate() > new Date().getDate()
        },
        newLocation: { lon: '', lat: '', date: '', station: '' },
        stationOptions: [],
        tableHeight: 0,
        addButtonDisable: false,
        tableHeader: [
            { prop: 'stationName', label: '站点', width: (window.innerWidth - 407)/3 },
            { prop: 'optCMD', label: '作业指令', width: (window.innerWidth - 407)/3 },
            { prop: 'sendCount', label: '发送次数', width: (window.innerWidth - 407)/3 }
        ],
        tableData: [],
        type: null,
		    period: '全时段'
    }
  },
  computed: {
    getTimePickerOption() {
      const nowDate = new Date();
      const currentHour = nowDate.getHours();
      const currentMinute = nowDate.getMinutes();
      const currentSeconds = nowDate.getSeconds();
      return { selectableRange: `${currentHour}:${currentMinute}:${currentSeconds} - ${currentHour + 6}:59:59` }
    }
  },
  components: { tableList },
  props: ['parentHeight', 'isClosed','isClosedSeries'],
  methods: {
    arrowDropdown(){
      if(document.getElementById("workStove").style.display == "none"){
        document.getElementById("workStove").style.display="block";
        document.getElementById("arrow").style.transform="rotate(180deg)";
        document.getElementById("stoveHeight").style.height="93vh";
      }else{
        document.getElementById("workStove").style.display="none";
        document.getElementById("arrow").style.transform="rotate(0deg)";
        document.getElementById("stoveHeight").style.height="0vh";
      }
    },
    assignOrder() {
      const notFitLen = this.tableData.length;
      if (!notFitLen) {
        this.$Modal.info({
            title: '提示',
            content: '发送失败，没有可发送的指令!',
            zIndex: 15000
        });
      } else {
        this.$Modal.confirm({
          title: '提示',
          content: '<p>确定要发送指令吗？</p>',
          loading: true,
          onOk: () => {
              this.assignOrderLoading = true
              this.$api.StoveSendOrder({ opTime: this.searchCondtion.date })
              .then(res => this.$Message.info(res.message))
              .finally(() => {
                this.assignOrderLoading = false;
                this.$Modal.remove();
              });
          }
        });
      }
    },
    bindEvents() {
      this.$bus.on(this.$eventTypes.TABLELINESELECTED, val => {
        this.$bus.emit(this.$eventTypes.POINTLOCATION, [val.lon, val.lat]);
      });
    },
    timeOnFoucs() {
      this.timeSelectValue = new Date();
    },
    timeChange(val){
      this.newLocation.date = this.$moment(val).format('YYYY-MM-DD HH:mm:ss');
    },
    stationSelected(val) {
      const currentStation = this.stationOptions.filter(item => item.code === val)[0];
      // 给地图发送点击事件
      this.$store.commit('setIsGetPointTime', true);
      this.$bus.on(this.$eventTypes.CLICKONMAP, val => {
        this.newLocation.lon = parseFloat(val.lon.toFixed(2));
        this.newLocation.lat = parseFloat(val.lat.toFixed(2));
      });
    },
    deleteWorkAreaData(event, row) {
      // 点击删除阻止定位事件;
      event.stopPropagation();
      this.$Modal.confirm({
          title: '提示',
          content: '<p>确定要删除吗？</p>',
          loading: true,
          onOk: () => {
              this.$api.deleteStoveData({ id: row.id })
                  .then(res => {
                      this.$Modal.remove();
                      this.$Message.info('删除成功');
                      //重新刷新表格
                      this.$api.getStoveDataList()
                        .then(res => {
                          this.searchCondtion.timeList = res.data;
                          if (this.total === 1) {
                            this.searchCondtion.date = res.data[0];
                          }
                          // 加载作业区域数据;
                          return this.getData();
                        });
                  })
                  .catch(err => {
                      this.$Modal.remove();
                  });
          },
          onCancel: () => {}
      });
    },
   
    getTimePeriod(){
      const params ={ type: this.searchCondtion.type };
      this.$api.getStoveDataList(params)
      .then(res => {
        this.searchCondtion.timeList = res.data;
        this.searchCondtion.date = res.data[0];
        // 加载作业区域数据;
        return this.getData();
      })
      .catch(error => {
        this.searchCondtion.timeList = [];
        this.searchCondtion.date = '';
        throw new Error(error);
      });
    },
    selectTimePeriod(){
      this.searchCondtion.type = this.period === '工作时段 (24:00-06:00)' ? 'work' : 'all';
      this.getTimePeriod();
    },
    getData() {
      this.loading = true;
      const params = { opTime: this.searchCondtion.date };
      this.$api.getStoveDataRecord(params)
          .then(res => {
              this.tableData = res.data.map(item => ({
                id: item.id,
                stationName: item.stationName,
                optCMD:item.optCMD,
                sendCount:item.sendCount,
                stationId: item.stationID
              }));
              this.total = res.data.length;
          })
          .catch(err => {
              this.tableData = [];
              this.total = 0;
          })
          .finally(() => {
            this.loading = false;
            this.noDataText = this.total ? '' : '暂无数据';
            // 加载烟炉点位
            this.$api.getStationLocStove()
              .then(res=>{
                  const workStationIds = this.tableData.map(item => parseInt(item.stationId));
                  res.data.forEach(item => item.isWorkStation = workStationIds.includes(item.id));
                  this.$bus.emit(this.$eventTypes.ADDPOINTMARKER, { points: res.data, type: 'stoveDirectiveLayer' });
              });
          });
      
      },
  },
  mounted() {
    this.$bus.emit(this.$eventTypes.LAYERVISIBLECHANGE, { layerName: 'stations-vectLayer', visible: false });
    this.$bus.emit(this.$eventTypes.LAYERVISIBLECHANGE, { layerName: 'getstoveDirectiveDistribution-vectLayer', visible: true });
    // this.bindEvents();
    //this.tableHeight = this.$refs.workArea.offsetHeight - this.$refs.searchCondtion.offsetHeight - this.$refs.handleArea.offsetHeight-150;
    this.tableHeight = window.innerHeight-300;
    const params ={ type: this.searchCondtion.type };
    // 先获取筛选时间列表;
    this.$api.getStoveDataList(params)
      .then(res => {
        this.searchCondtion.timeList = res.data;
        this.searchCondtion.date = res.data[0];
        // 加载作业区域数据;
        return this.getData();
      })
      .catch(error => {
        this.searchCondtion.timeList = [];
        this.searchCondtion.date = '';
        throw new Error(error);
      });
  },
  destroyed(){
    this.$bus.off(this.$eventTypes.TABLELINESELECTED);
    this.$store.commit('setIsGetPointTime', false);
    this.$bus.emit(this.$eventTypes.LAYERVISIBLECHANGE, { layerName: 'getstoveDirectiveDistribution-vectLayer', visible: false });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .workStoveTitle{
    color: #eef4ff;
    font-size: 21px;
    margin: 24px 0px;
    display: inline-block;
    margin-left: 5px;
  }
  .workArea{
      display: flex;
      width: 100%;
      background-color: #1D2437;
      flex-direction: column;
  }
  .workArea .dataArea {
      flex: 1
  }
  .workArea .handleArea {
    height: 80px;
    display: flex;
    align-items: center;
    padding: 0 5px;
  }
  .workArea .handleArea .newLocation {
    margin-left:257px;
  }
  .workArea .handleArea .newLocation .el-form-item{
    display: flex;
    flex-direction: row;
    margin-bottom: 0;
  }
</style>
