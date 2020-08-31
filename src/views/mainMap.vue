<template>
  <div class="mapView">
    <sys-map>
      <template v-slot:sysFunTabs>
        <div style="z-index: 100; position: absolute;width: 100%;background-color: #1d2437">
          <router-view />
        </div>
      </template>
      <template v-slot:mapSwitch><base-map-switcher></base-map-switcher></template>

      <template v-slot:timePlayer><time-player style="z-index: 100; position: absolute;width:100%;"></time-player></template>

      <template v-slot:mapLengend><map-lengend></map-lengend></template>

    </sys-map>
  </div>
</template>

<script>
import sysMap from "@/components/sysMap";
import { baseMapSwitcher, timePlayer, mapLengend } from "@/components/mapComponents/index";

export default {
  name: "mainMap",
  data() {
    return {};
  },
  components: { sysMap, baseMapSwitcher, timePlayer, mapLengend },
  computed: {},
  watch: {},
  methods: {},
  beforeCreate() {
    this.sysMap = null;
  },
  mounted() {},
  beforeDestroy() {
    this.$store.commit('setTimePlayerOptions', []);
    // 去掉图例;
    this.$store.commit('setLengendModuleName', '');
    this.$store.commit('setSysMapObject', null);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.mapView {
  height: 100%;
  .sysFunTabs {
    bottom: calc((100% - 502px)/2 + 10px) ;
    height: 502px;
    position: absolute;
    z-index: 1;
    left: 5px;
    display: flex;
    flex-flow: column wrap;
    justify-content: center;
    .itemWrap {
      padding: 10px 10px;
      background-color: rgba(8, 36, 53, 0.8);
      border: 1px solid #69ddf5;
      .tabItems {
        width: 100px;
        color: #fff;
        font-size: 12px;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        
        @media screen  and (min-width: 1400px){
            .itemImg {
              width: 50px;
              height: 50px;
            }
            .itemLabel {
              height: 30px;
              line-height: 30px;
            }
        }
        @media screen  and (max-width:1400px){
            .itemImg {
              width: 45px;
              height: 45px;
            }
            .itemLabel {
              height: 22px;
              line-height: 22px;
            }
        }
        .itemLabel {
          position: relative;
          display: flex;
          justify-content: center;
          letter-spacing: 1px;
          img {
            position: absolute;
          }
        }
      }
    }
  }
}
</style>
