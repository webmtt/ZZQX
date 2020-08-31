<template>
  <div v-show="timeOptions && timeOptions.length" class="timeLineContainer">
    <Tabs @on-click="timeTabOnClick" size="small" class="tabStyler">
      <TabPane style="color:white;" :label="currentDate" v-for="(item, index) in timeOptions" :key="index" class="subTabs">
        <ul>
          <li @click="playOrStop"><Icon :type="playStatus ? 'md-pause' : 'md-play'" /></li>
          <li v-for="(subItem,subIndex) in item" v-show="index===dateIndex" :title="subItem.datatime" :key="subIndex" @click="clickTabsLi(subIndex)" :class="{activeTabs:timeIndex === subIndex}">
            {{subItem.datatime.split(' ')[1]}}
          </li>
        </ul>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import LayerGroup from 'ol/layer/Group';
export default {
  name: 'timePlayer',
  data () {
    return {
      timeIndex: 0,
      dateIndex: 0,
      playSpeed: 1000,
      playStatus: false,
      interValTimer: null
    }
  },
  computed: {
    timeOptions() {
      return this.$store.state.timePlayerOptions;
    },
    sysMap() {
      return this.$store.state.pieSatMap;
    },
    currentDate () {
      return this.timeOptions.length && this.timeOptions[0].filter((item, index) => index === this.timeIndex)[0].showLabel || '';
    }
  },
  watch: {
    '$store.state.timePlayerOptions'(newValue, oldValue) {
      this.resetTimePlayer();
      this.stopPlay();
    }
  },
  methods: {
    resetTimePlayer() {
      this.timeIndex = 0;
      this.dateIndex = 0;
    },
    setLayerDisplay () {
      // 保证只会有一个当前显示的静态图片图层组;
      const currentLayerGroup = this.sysMap.getLayers().getArray().filter(layer => layer instanceof LayerGroup)[0];
      currentLayerGroup.getLayers().forEach((groupLayer, index) => groupLayer.setOpacity(index === this.timeIndex));
    },
    stopPlay() {
      this.playStatus = false;
      this.interValTimer && window.clearInterval(this.interValTimer);
    },
    // 停止或者播放;
    playOrStop() {
      this.playStatus = !this.playStatus;
      if (!this.playStatus) return this.stopPlay();
      // 全局定时器;
      this.interValTimer = window.setInterval(() => {
        this.timeIndex++;
        this.timeIndex = this.timeIndex % this.timeOptions[this.dateIndex].length;
        this.setLayerDisplay();
      }, this.playSpeed);
    },
    // 点击日期轴的逻辑;
    timeTabOnClick(val) {
      if (val === this.dateIndex) return;

      this.dateIndex = val;
      this.timeIndex = 0;
      this.stopPlay();
      this.$bus.emit(this.$eventTypes.ADDPASSINGVALUEURL, {
        extent: this.$mapConfig.staticImageExtent.radarNumberForecast,
        data: [this.timeOptions[this.dateIndex]],
        lengendName: 'rainingEstimate'
      });
    },
    // 点击时间轴的逻辑;
    clickTabsLi(subIndex) {
      this.timeIndex = subIndex;
      this.setLayerDisplay();
    },
  },
  mounted() {},
  beforeDestroy() {
    this.stopPlay();
  }
}
</script>
<style scoped lang="less">
  .timeLineContainer {
    background-color: #262E43;
    position: absolute;
    bottom:0px;
    z-index: 1000;
    .tabStyler {
      color:white;
    }
    ul {
      height: 34px;
      margin: 0 auto;
      padding-left: 0;
      float: left;
      cursor: pointer;
      li {
        float: left;
        color: #fff;
        list-style: none;
        height: 34px;
        line-height: 34px;
        padding: 0 5px;
        text-align: center;
      }
    }
  }
  .activeTabs {
    background-color: rgba(135, 206, 235, 0.6) !important;
  }
</style>
