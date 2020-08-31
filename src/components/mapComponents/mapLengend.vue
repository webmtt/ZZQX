<template>
  <div v-if="lengendName" style="right: 10px;bottom: 50px;position: absolute;z-index: 1;">
    <img style="width: 100%;height: 100%" v-if="lengendName" :src="imageUrl" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'mapLengend',
  data () {
    return {
      lengends: {
        satelliteCloudClass: require('@/assets/images/cloudType.png'),
        satelliteCloudHigh: require('@/assets/images/cloudHeight.png'),
        satelliteRainFall: require('@/assets/images/rainFall.png'),
        radarBackWaveData: require('@/assets/images/radarBackWare.png'),
        rationRainData: require('@/assets/images/rainFall.png'),
        temperRainData: require('@/assets/images/rainFall.png'),
        severeConvectionData: '',
        rainingEstimate: require('@/assets/images/rainFall.png'),
        localRadar: require('@/assets/images/localRadar.png'),
      }
    }
  },
  computed: {
    ...mapState(['lengendName']),
    imageUrl() {
      return this.lengends[this.lengendName];
    }
  },
  methods: {},
  mounted() {}
}
</script>
