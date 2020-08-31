<template>
  <div ref="radarData" class="equipmentWrapper">
     <div class="radarWrapper">
      <RadioGroup style="margin:10px;" @on-change="radarChangeFunction" v-model="radarRadioValue">
          <Radio style="color: #b5c4e0;border:none;margin-right:15px;" label="1" border>本地雷达</Radio>
          <Radio style="color: #b5c4e0;border:none;" label="2" border>雷达回波</Radio>
      </RadioGroup>
  </div>
  </div>
</template>

<script>
export default {
  name: "radarData",
  data() {
    return {
      radarRadioValue: '1',
    };
  },
  components: { },
  methods: {
    getRadarImage () {
      const falg = this.radarRadioValue === '1' ? 'radarData' : 'radarBackWaveData';
      const lengendName = this.radarRadioValue === '1' ? 'localRadar' : 'radarBackWaveData';
      this.$store.dispatch(falg)
        .then(res => {
            this.$bus.emit(this.$eventTypes.ADDPASSINGVALUEURL, { extent: this.$mapConfig.staticImageExtent.radar, data: res, lengendName });
            this.$bus.emit(this.$eventTypes.ADDPOINTMARKER, { points: this.$store.state.stationLoc, type: 'stations-vectLayer' });
        })
        .finally(() => {
            this.$store.commit('setMapLoading', false);
        });
    },
    radarChangeFunction(){
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

<style scoped lang='less'>
.equipmentWrapper {
  display: flex;
  height: 100%;
  flex-direction: column;
}
.radarWrapper{
  background-color: #343B57;
  height: 38px;
  width: 2000px;
}
</style>