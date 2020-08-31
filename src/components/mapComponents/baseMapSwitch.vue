<template>
  <div style="right: 20px;top: 0px;position: absolute;z-index: 1000;">
    <img style="position: absolute;top: 12px;z-index: 1000;" :src="img">
    <img style="position: absolute;top: 10px;z-index: 1000;right: 51px;" :src="imgVedio">
    <el-radio-group v-model="activeBaseLayer" @change="baseMapChange">
        <el-radio-button v-for="item in baseMapOptions" :label="item.label" :key="item.label"></el-radio-button>
    </el-radio-group>
</div>
</template>

<script>
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import { mapState } from 'vuex'

export default {
  name: 'baseMapSwitcher',
  data () {
    return {
      img: require('../../assets/images/map.png'),
      imgVedio: require('../../assets/images/vedio.png'),
      activeBaseLayer: this.$mapConfig.baseMapLayer.filter(item => item.visible)[0].label,
      baseMapOptions: this.$mapConfig.baseMapLayer,
      baseMapLayers: []
    }
  },
  computed: mapState({
    sysMap: 'pieSatMap'
  }),
  watch: {
    'sysMap'(newValue, oldValue) {
      if (newValue && !oldValue) {
        const baseLayers = this.baseMapOptions.map(item => (new TileLayer({
          name: item.label,
          source: new XYZ({ url: item.source }),
          visible: item.visible
        })));
        // 初始化底图;
        this.baseMapLayers.push(...baseLayers);
        baseLayers.forEach(item => this.sysMap.addLayer(item))
      }
    }
  },
  methods: {
    baseMapChange(val) {
      this.baseMapOptions.forEach(item => item.visible = (item.label === val));
      this.activeBaseLayer = val;
      this.baseMapLayers.forEach(item => {
        item.setVisible(item.get("name") === val)
      });
    }
  },
  mounted() {}
}
</script>
