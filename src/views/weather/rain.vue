<template>
  <div id="rainHeight" ref="inTimeRain" class="inTimeRain">
    <div ref="searchCondtion" style="height: 38px;display: flex;align-items: center;justify-content: flex-start;padding: 0px 20px;background-color: #343B57;" class="searchCondtion">
      <el-form :inline="true">
        <span style="color: #b5c4e0;margin: 12px 5px 0px 0px;display: inline-block;">日期时间</span>
        <el-form-item>
          <span style="color: rgb(181, 196, 224);border: 1px solid #565e7d;padding: 4px 11px;width: 132px;border-radius: 6px;background-color: #3d4866;">{{this.searchCondtion.timeList}}</span>
        </el-form-item>
        <RadioGroup style="color: #b5c4e0;"  @on-change="selectProvince" v-model="sWitch">
          <Radio label="省"></Radio>
          <Radio label="市"></Radio>
          <Radio label="县"></Radio>
		    </RadioGroup>
        <RadioGroup v-model="chosenOrder" @on-change="changeModel" style="margin-top: 1px;">
          <span style="color:#b5c4e0;">过去</span>
          <Radio v-for="(item, index) in workOrderList" :label="item.key" :key="index">
            <span style="color:#b5c4e0;">{{item.text}}</span>
          </Radio>
        </RadioGroup>
        <Icon id="arrow" style="color:#dae2ff;margin-top: 2px;" @click="arrowDropdown" type="md-arrow-dropdown"/>
      </el-form>
    </div>
    <div style="display:none;" id="workrain" class="tablePadding">
      <img style="vertical-align: text-bottom;" :src="img">
      <div class="workRainTitle">实时雨晴</div>
       <!-- 数据显示 -->
      <table-list :emptyString="noDataText" v-loading="loading" element-loading-text="拼命加载中"  element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.5)" class="dataArea" v-if="tableHeight" :showHeader="false" :total="total" :tableHeight="tableHeight" :headerData="tableHeader" :dataList="tableData"></table-list>
    </div>
  </div>
</template>

<script>
import tableList from '@/components/tableList';
export default {
  name: 'workArea',
  data () {
    return {
        loading: true,
        noDataText: ' ',
        tableHeight: 0,
        total: 0,
        searchCondtion: { date: '', timeList: [] ,type: 'city'},
        tableHeader: [
            { prop: 'station_name', label: '站点名称', width: (window.innerWidth - 312)/4,sortable: true,},
            { prop: 'pre_1h', label: '降雨量(mm)', width: (window.innerWidth - 310)/4,sortable: true,
              tooltip: true,
              render: (h, params) => {
                  return h('div', [
                      h('span', params.row.pre_1h + ' mm ')
                  ]);
              }
            },
            { prop: 'lon', label: '经度', width: (window.innerWidth - 310)/4 },
            { prop: 'lat', label: '纬度', width: (window.innerWidth - 310)/4 },
        ],
        tableData: [],
        workOrderList:[
          {
            text: '1小时',
            key: '1'
          },
          {
            text: '3小时',
            key: '3'
          },
          {
            text: '6小时',
            key: '6'
          },
          {
            text: '12小时',
            key: '12'
          },
          {
            text: '24小时',
            key: '24'
          },
          {
            text: '48小时',
            key: '48'
          },
          {
            text: '72小时',
            key: '72'
          }
          ],
        chosenOrder: '1',
        type: null,
		    sWitch: '市',
        img: require('../../assets/images/assign.png')
    }
  },
  computed: {},
  components: { tableList },
  props: ['parentHeight'],
  methods: {
    arrowDropdown(){
      if(document.getElementById("workrain").style.display == "none"){
        document.getElementById("workrain").style.display="block";
        document.getElementById("arrow").style.transform="rotate(180deg)";
        document.getElementById("rainHeight").style.height="93vh";
      }else{
        document.getElementById("workrain").style.display="none";
        document.getElementById("rainHeight").style.height="0vh";
        document.getElementById("arrow").style.transform="rotate(0deg)";
      }
    },
    selectProvince(){
      this.searchCondtion.type = this.sWitch === '省' ? 'province' : this.sWitch === '市' ? 'city' : 'county';
      this.getData();
    },
    changeModel(index){
        var paramsIndex = this.chosenOrder;
        this.searchCondtion.date = this.searchCondtion.timeList+','+paramsIndex;
        this.getData();
    },
    bindEvents() {
      this.$bus.on(this.$eventTypes.TABLELINESELECTED, val => this.$bus.emit(this.$eventTypes.POINTLOCATION, [val.lon, val.lat]));
    },
    getData() {
      this.loading = true;
      const params ={ time: this.searchCondtion.date,type: this.searchCondtion.type };
      this.$api.getInTimeRainData(params)
        .then(res => {
            this.tableData = res.data.map(item => {
              item.pre_1h = parseFloat(item.pre_1h);
              return item;
            });
            this.total = res.data.length;
            // 加载实时雨晴点位图层
            this.$bus.emit(this.$eventTypes.ADDPOINTMARKER, { points: res.data, type: 'inTimeRainLayer' });
        })
        .catch(err => {
            this.tableData = [];
            this.total = 0;
        })
        .finally(() => {
            this.loading = false;
            this.noDataText = this.total ? '' : '暂无数据';
        });
    }
  },
  mounted() {
    this.bindEvents();
    this.tableHeight = window.innerHeight-305;
    this.$bus.emit(this.$eventTypes.LAYERVISIBLECHANGE, { layerName: 'stations-vectLayer', visible: false });
    this.$bus.emit(this.$eventTypes.LAYERVISIBLECHANGE, { layerName: 'getinTimeRainDistribution-vectLayer', visible: true});
    // 先获取筛选时间列表;
    this.$api.getInTimeRainTimes()
      .then(res => {
        this.searchCondtion.timeList = res.data;
        this.searchCondtion.date = res.data+','+this.chosenOrder;
        // 加载实时雨晴数据;
        return this.getData();
      })
      .catch(error => {
        this.searchCondtion.timeList = [];
        this.searchCondtion.date = '';
        throw new Error(error);
      });
  },
  destroyed() {
    this.$bus.off(this.$eventTypes.TABLELINESELECTED);
    this.$bus.emit(this.$eventTypes.LAYERVISIBLECHANGE, { layerName: 'getinTimeRainDistribution-vectLayer', visible: false});
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .workRainTitle{
    color: #eef4ff;
    font-size: 21px;
    margin: 24px 0px;
    display: inline-block;
    margin-left: 5px;
  }
  .inTimeRain{
      display: flex;
      flex-direction: column;
  }
  .inTimeRain .dataArea {
      flex: 1
  }
  .inTimeRain .handleArea {
    height: 80px;
    display: flex;
    align-items: center;
    padding: 0 20px;
  }
</style>
