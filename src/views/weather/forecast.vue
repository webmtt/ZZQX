<template>
  <div class="rainForecastWrapper">
    <div>
      <!--<h3 style="color:white;margin-bottom: 5px;">雷达外推</h3>-->
      <RadioGroup style="margin:10px;" @on-change="radarHandleFunction" v-model="radarRadioValue">
          <!--<el-radio style="color: #fff" label="radarBackWaveData" border>雷达回波</el-radio>-->
          <Radio style="color: #fff;border:none;margin-right:15px;" label="1" border>定量降水</Radio>
          <Radio style="color: #fff;border:none;margin-right:15px;" label="2" border>瞬时雨强</Radio>
          <Radio style="color: #fff;border:none;margin-right:0px;" label="3" border>强对流</Radio>
      </RadioGroup>
    </div>
    <!--<h3 style="color:white;margin-bottom: 5px;">数值预报</h3>
    <el-radio-group @change="rainEstimateHandleFunction" v-model="rainEstimateValue">
        <el-radio style="color: #fff" label="rainingEstimate" border>降水预报</el-radio>
    </el-radio-group>-->
  </div>
</template>

<script>
export default {
  name: "forecast",
  data() {
    return {
      radarRadioValue: '1',
      rainEstimateValue: ''
    };
  },
  computed: {},
  components: {},
  props: [],
  methods: {
     getRadarImage () {
      const falg = this.radarRadioValue === '1' ? 'rationRainData' : this.radarRadioValue === '2' ? 'temperRainData' : 'severeConvectionData';
      const lengendName = this.radarRadioValue === '1' ? 'rationRainData' : this.radarRadioValue === '2' ? 'temperRainData' : 'severeConvectionData';
      this.$store.dispatch(falg)
        .then(res => {
            this.$bus.emit(this.$eventTypes.ADDPASSINGVALUEURL, { extent: this.$mapConfig.staticImageExtent.radarForecast, data: res, lengendName });
            this.$bus.emit(this.$eventTypes.ADDPOINTMARKER, { points: this.$store.state.stationLoc, type: 'stations-vectLayer' });
        })
        .finally(() => {
            this.$store.commit('setMapLoading', false);
        });
    },
    radarHandleFunction(){
      this.getRadarImage();
    }
  },
  mounted() {
    this.getRadarImage();
  },
  destroyed() {
    this.$bus.emit(this.$eventTypes.ADDPASSINGVALUEURL, { extent: [], data: [], lengendName: '' });
    this.$store.commit('setTimePlayerOptions', []);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>
.rainForecastWrapper {
    background-color: #343B57;
    height: 38px;
    width:2000px;
}
</style>
