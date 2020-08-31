<template>
<div ref="meteorological" class="equipmentWrapper">
  <div class="sateliteCloud">
    <RadioGroup style="margin:10px;" @on-change="radioChanged" v-model="radioValue">
        <Radio style="color: #fff;border:none;margin-right:15px;" label="1" border>降水估计</Radio>
        <Radio style="color: #fff;border:none;margin-right:15px;" label="2" border>云分类</Radio>
        <Radio style="color: #fff;border:none;margin-right:0px;" label="3" border>云顶高</Radio>
    </RadioGroup>
  </div>
</div>
</template>

<script>
export default {
  name: "meteorological",
  data() {
    return { radioValue: '1' };
  },
  computed: {},
  components: {},
  props: [],
  methods: {
    getSateliteImage () {
      const falg = this.radioValue === '1' ? 'satelliteCloudData' : this.radioValue === '2' ? 'satelliteCloudClassData' : 'satelliteCloudHightData';
      const lengendName = this.radioValue === '1' ? 'satelliteRainFall' : this.radioValue === '2' ? 'satelliteCloudClass' : 'satelliteCloudHigh';
      this.$store.dispatch(falg)
        .then(res => {
            this.$bus.emit(this.$eventTypes.ADDPASSINGVALUEURL, { extent: this.$mapConfig.staticImageExtent.satelliteCloud, data: res, lengendName });
            this.$bus.emit(this.$eventTypes.ADDPOINTMARKER, { points: this.$store.state.stationLoc, type: 'stations-vectLayer' });
        })
        .finally(() => {
            this.$store.commit('setMapLoading', false);
        });
    },
    radioChanged() {
      this.getSateliteImage();
    }
  },
  mounted() {
    this.getSateliteImage()
  },
  destroyed() {
    this.$bus.emit(this.$eventTypes.ADDPASSINGVALUEURL, { extent: [], data: [], lengendName: '' });
    this.$store.commit('setTimePlayerOptions', []);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.equipmentWrapper {
  display: flex;
  height: 100%;
  flex-direction: column;
}
.sateliteCloud {
     background-color: #343B57;
     height: 38px;
     width:2000px;
}
</style>
