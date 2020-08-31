<template>
  <div id="areaHeight" ref="workArea" class="workArea">
    <div id="area">
      <!-- 数据筛选 -->
    <div id="searchCondtion" ref="searchCondtion" style="background-color: #343B57;height: 39px;padding: 0px 18px;" class="searchCondtion">
      <el-form :inline="true">
        <span style="color: #b5c4e0;margin: 12px 5px 0px 0px;display: inline-block;">预报时间</span>
        <el-form-item>
          <el-select v-model="searchCondtion.date" @change="getData" placeholder="请选择日期时间">
            <el-option v-for="(item, index) in searchCondtion.timeList" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <span @click="playOrStop" style="margin-top: 10px;display: inline-block;cursor:pointer;">
          <Icon :type="playStatus ? 'md-pause' : 'md-play'" />
        </span>
        <RadioGroup style="margin-left: 5px;color: #b5c4e0;"  @on-change="selectTimePeriod" v-model="period">
          <Radio label="全时段"></Radio>
          <Radio label="工作时段 (24:00-06:00)"></Radio>
        </RadioGroup>
        <Icon id="arrow" style="color:#dae2ff;" @click="arrowDropdown" type="md-arrow-dropdown"/>
        <!-- 添加新作业位置 -->
    <div ref="handleArea" class="handleArea">
      <el-form :inline="true" :model="newLocation" class="newLocation">
        <el-form-item>
           <el-select v-model="newLocation.station" @change="stationSelected" filterable placeholder="站点选择">
            <el-option
              v-for="item in stationOptions"
              :key="item.code"
              :label="item.label"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 100px;">
          <el-input disabled v-model="newLocation.lon" placeholder="经度"></el-input>
        </el-form-item>
        <el-form-item style="width: 100px;">
          <el-input disabled v-model="newLocation.lat" placeholder="纬度"></el-input>
        </el-form-item>
        <el-form-item class="datePicker">
          <!--<el-time-picker @change="timeChange" :focus="timeOnFoucs" v-model="newLocation.date" :picker-options="getTimePickerOption" placeholder="选择时间"></el-time-picker>-->
          <el-date-picker type="datetime" @change="timeChange" :focus="timeOnFoucs" v-model="newLocation.date" placeholder="选择时间"></el-date-picker>
        </el-form-item>
        <el-form-item class="addButton">
          <!--<el-button style="border-radius: 4px;background-color: #1E74F1;border: none;" type="primary"  v-has-hide="'/operatingArea/insertOrUpdateOperatingArea'" :disabled="!newLocation.station || !newLocation.lon || !newLocation.date || addButtonDisable" @click="addNewPoint()">添加</el-button>-->
          <i-button style="border-radius: 4px;border: none;" type="primary"  :disabled="!newLocation.station || !newLocation.lon || !newLocation.date || addButtonDisable" @click="addNewPoint()" v-has="'/operatingArea/insertOrUpdateOperatingArea'">添加</i-button>
        </el-form-item>
      </el-form>
    </div>
      </el-form>
    </div>
    <div style="display:none" id="workArea" class="tablePadding">
      <img style="vertical-align: text-bottom;" :src="img">
      <div class="workAreaTitle">根据数值预报生成作业区域</div>
    <!-- 数据显示 -->
    <table-list :emptyString="noDataText" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.5)" class="dataArea" v-if="tableHeight" :total="total" :showHeader="false" :tableHeight="tableHeight" :tableWidth="tableWidth" :headerData="tableHeader" :dataList="tableData">
      <!-- 自定义列 -->
      <template v-slot:deleteColoum>
        <el-table-column width="90" label="操作" fixed="right">
          <template slot-scope="scope">
              <!--<el-button type="primary" class="operate-download" v-has-hide="'/operatingArea/delOperatingArea'" size="mini" @click="deleteWorkAreaData($event, scope.row)">删 除</el-button>-->
              <i-button type="primary" class="operate-download"  @click="deleteWorkAreaData($event, scope.row)" v-has="'/operatingArea/delOperatingArea'">删 除</i-button>
          </template>
        </el-table-column>
      </template>
    </table-list>
    </div>
    </div>  
  </div>
</template>

<script>
import tableList from '@/components/tableList';
import {toLonLat} from 'ol/proj'
export default {
  name: 'workArea',
  data () {
    return {
        img: require('../../assets/images/assign.png'),
        count: 1,
		    loopTime: 3000,
        timer: null,
        loading: true,
        noDataText: ' ',
        timeSelectValue: '',
        searchCondtion: { date: '', timeList: [],type: ''},
        total: 0,
        pickerOptions: {
          disabledDate: time => time.getDate() < new Date().getDate() || time.getDate() > new Date().getDate()
        },
        newLocation: { lon: '', lat: '', date: '', station: '' },
        stationOptions: [],
        tableHeight: 0,
        addButtonDisable: false,
        tableHeader: [
            { prop: 'loc', label: '站点坐标',width:(window.innerWidth-407)/3},
            { prop: 'rain', label: '预报雨量',width:(window.innerWidth-407)/3},
            { prop: 'flag', label: '包含点位',width:(window.innerWidth-407)/3 }
        ],
        tableData: [],
        type: null,
		    period: '全时段',
        tableWidth:0,
        playStatus: false,
    }
  },
  computed: {},
  components: { tableList },
  props: ['parentHeight', 'isClosed','isClosedSeries'],
  methods: {
    arrowDropdown(){
      if(document.getElementById("workArea").style.display == "none"){
        document.getElementById("workArea").style.display="block";
        document.getElementById("arrow").style.transform="rotate(180deg)";
        document.getElementById("areaHeight").style.height="93vh";
      }else{
        document.getElementById("workArea").style.display="none";
        document.getElementById("arrow").style.transform="rotate(0deg)";
        document.getElementById("areaHeight").style.height="0vh";
      }
    },
    stopPlay() {
      this.playStatus = false;
      this.timer && window.clearTimeout(this.timer);;
    },
    // 停止或者播放;
    playOrStop() {
      this.playStatus = !this.playStatus;
      if (!this.playStatus) return this.stopPlay();
      this.loop();
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
        const t = toLonLat([val.lon,val.lat])
        this.newLocation.lon = parseFloat(t[0].toFixed(2));
        this.newLocation.lat = parseFloat(t[1].toFixed(2));
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
              this.$api.workAreaDeletePoint({ id: row.id })
                  .then(res => {
                      this.$Modal.remove();
                      this.$Message.info('删除成功');
                      //重新刷新表格
                      this.$api.getWorkAreaTimeList()
                        .then(res => {
                          this.searchCondtion.timeList = res.data;
                          if (this.total === 1) {
                            this.searchCondtion.date = res.data[0];
                          }
                          // 更新站点数据
                          this.getStationData();
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
    loop() {
        this.timer = setTimeout(() => {
           this.searchCondtion.date=this.searchCondtion.timeList[this.count];
            this.getData().finally(() => {
              this.count++;
              this.count=this.count % this.searchCondtion.timeList.length;
              this.loop();
            });
          }, this.loopTime);
    },
    getTimePeriod(){
      const params ={ type: this.searchCondtion.type };
      this.$api.getWorkAreaTimeList(params)
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
      const params = { time: this.searchCondtion.date };
      return this.$api.getWorkAreaDataList(params)
          .then(res => {
              this.tableData = res.data.map(item => ({
                id: item.id,
                rain: `${item.pre} mm`,
                loc: `${item.lon}'E， ${item.lat}'N`,
                flag: item.isFixedStation ? '是' : '否',
                lon: item.lon,
                lat:  item.lat
              }));
              this.total = res.data.length;
              this.$bus.emit(this.$eventTypes.ADDPOINTMARKER, { points: res.data, type: 'workAreaDistribution' });
          })
          .catch(err => {
              this.tableData = [];
              this.total = 0;
              this.$bus.emit(this.$eventTypes.ADDPOINTMARKER, { points: [], type: 'workAreaDistribution' });
          })
          .finally(() => {
            this.loading = false;
            this.noDataText = this.total ? '' : '暂无数据';
            this.$bus.emit(this.$eventTypes.ADDPOINTMARKER, { points: this.$store.state.stationLoc, type: 'stations-vectLayer' });
          });
    },
    addNewPoint() {
      this.addButtonDisable = true;
      const param = {
        lon: this.newLocation.lon,
        lat: this.newLocation.lat,
        opTime: this.newLocation.date,
        stationID: this.newLocation.station,
        isFixedStation: 1
      };
      this.$api.workAreaAddPoint(param)
        .then(res => {
          this.newLocation.lon = '';
          this.newLocation.lat = '';
          this.newLocation.station = '';
          this.newLocation.date = '';
          this.$Message.success('新增成功');
          this.$bus.off(this.$eventTypes.CLICKONMAP);
          this.$store.commit('setIsGetPointTime', false);
          //重新刷新表格
          this.$api.getWorkAreaTimeList()
            .then(res => {
              this.searchCondtion.timeList = res.data;
              this.searchCondtion.date = res.data[0];
              // 更新站点数据
              this.getStationData();
              // 加载作业区域数据;
              return this.getData();
            });
        })
        .catch(error => {
          throw new Error(error);
        })
        .finally(() => this.addButtonDisable = false);
    },
    getStationData() {
      this.$api.getStationLoc()
        .then(res => {
            const options = [];
            res.data.forEach(item => {
                if (options.every(innerItem => innerItem.code !== item.workStationCode)) {
                  options.push({ label: item.workStationName, code: item.workStationCode, lon: item.longitude, lat: item.latitude });
                }
            });
            this.stationOptions = options;
        });
    }
  },
  mounted() {
    this.bindEvents();
    this.tableHeight = window.innerHeight-320;
    this.tableWidth = window.screen.width;
    // 先获取筛选时间列表;
    this.$api.getWorkAreaTimeList()
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

      // 获取可筛选的站点
      this.getStationData();
  },
  destroyed(){
    this.$bus.off(this.$eventTypes.TABLELINESELECTED);
    this.$store.commit('setIsGetPointTime', false);
    this.$bus.emit(this.$eventTypes.LAYERVISIBLECHANGE, { layerName: 'getWorkAreaDistribution-vectLayer', visible: false });
    clearTimeout(this.timer);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .workAreaTitle{
    color: #eef4ff;
    font-size: 21px;
    margin: 24px 0px;
    display: inline-block;
    margin-left: 5px;
  }
  .workArea{
      display: flex;
      width: 100%;
      background-color: #1d2437;
      flex-direction: column;
  }
  .workArea .dataArea {
      flex: 1
  }
  .workArea .handleArea {
    display: flex;
    padding: 0 10px 0px 0px;
    display: inline-block;
    position: absolute;
    top: 0px;
    right: 153px;
  }
  .workArea .handleArea .newLocation {
    display: flex;
    flex-direction: row;
  }
  .workArea .handleArea .newLocation .el-form-item{
    display: flex;
    flex-direction: row;
    margin-bottom: 0;
  }
</style>
