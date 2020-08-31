<template>
  <div v-loading="mapLoad" ref="map" element-loading-text="正在初始化地图数据，请稍等..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" id="sysMap">
    <slot name="sysFunTabs"></slot>
    <slot name="mapSwitch"></slot>
    <slot name="timePlayer"></slot>
    <slot name="mapLengend"></slot>
    <div id="mouseWithOverlay">在地图上点击选取坐标</div>
    <zoom :map="sysMap"></zoom>
    <div id="popup" ref="container" :class="{'ol-popup': true, 'work': isWork, 'unWork': !isWork}">
      <a href="#" ref="popupCloser" id="popup-closer" class="ol-popup-closer"></a>
      <div ref="popupContent" id="popup-content"></div>
    </div>
  </div>
</template>

<script>
import ol from "ol";
import GeoJSON from 'ol/format/GeoJSON';
import olFeature from 'ol/Feature';
import olSelect from 'ol/interaction/Select';
import 'ol/ol.css';
import { Map, View, Feature } from "ol";
import { Circle, Fill, Stroke, Style, Icon, Text, RegularShape } from "ol/style.js";
import Overlay from 'ol/Overlay.js';
import {transform, fromLonLat, transformExtent} from 'ol/proj'
import {getArea} from 'ol/sphere';
import Projection from "ol/proj/Projection.js";
import LayerGroup from 'ol/layer/Group';
import VectorLayer from 'ol/layer/Vector'
import ImageLayer from "ol/layer/Image.js";
import VectorSource from 'ol/source/Vector'
import Static from "ol/source/ImageStatic.js";
import {toStringHDMS} from 'ol/coordinate';
import { Point, LineString, Polygon} from 'ol/geom';
import geojson, { geoData } from '../config/geojson';
// 县界,省界,市界
import { xianGeoData } from '../config/xiangeojson';
import { henanGeoData } from '../config/henangeojson';
// 引入控件分析库
import * as spatialKit from '@turf/turf'
import {defaults as defaultControls, ScaleLine} from 'ol/control.js';

import zoom from './mapComponents/zoomController'
export default {
  name: "sysMap",
  data() {
    return {
      mouseWithOverlayIsShow: false,
      rainEstimateUrl: "https://imgs.xkcd.com/comics/online_communities.png",
      layers: [],
      sysMap: null,
      isWork: false
    };
  },
  components: {zoom},
  computed: {
    mapLoad() {
      return this.$store.state.mapLoading;
    }
  },
  props: ["activeFunTab"],
  methods: {
    refreshMap() {
      this.layers.forEach(
        item => !this.sysMap.getLayers().getArray().includes(item) && this.sysMap.addLayer(item)
      );
    },
    getStationsVectorLayer (val) {
        const features = val.map(item => {
          return new Feature({
              name: "stationPoint",
              geometry: new Point(fromLonLat([Number(item.longitude), Number(item.latitude)])),
              showText: item.workStationName,
              isWork: item.isWorkStation,
          })
        });
        const pointLayer = new VectorLayer({ name: "stations-vectLayer",
          source: new VectorSource({ features }),
          zIndex: 3,
          style: this.getStationStyle,
        });
        return pointLayer;
    },
    // 获取站点范围方框的样式函数
    getStationDistributionStyleFunction(feature, resolution){
      const radius = Math.sqrt(Math.pow(5000, 2) * 2) / resolution;
      const flag = feature.getProperties().flag;
      return [
        new Style({
          image: new RegularShape({
            radius: radius,
            points: 4,
            angle: Math.PI / 4,
            stroke: new Stroke({ color: flag ? 'red' : '#1f74f1', width: flag ? 2 : 1 })
          })
        })
      ];
    }, 

    // 获取站点方框的图层
    getWorkAreaDistributionVectorLayer(val) {
      const features = val.map(item => new Feature({ name: "stationDistributionPoint", geometry: new Point(fromLonLat([Number(item.lon), Number(item.lat)])), flag: item.isFixedStation }));
      const pointLayer = new VectorLayer({
        name: "getWorkAreaDistribution-vectLayer",
        zIndex: 2,
        source: new VectorSource({ features }),
        style: this.getStationDistributionStyleFunction
      });
      return pointLayer;
    },
    getinTimeRainDistributionStyleFunction(feature, resolution) {
      return [
        new Style({
          image: new Icon({src: require("@/assets/images/station1.png")}),
          text: new Text({
            offsetY: -20,
            fill: new Fill({ color: 'rgb(0, 132, 255)' }),
            textBaseline: "middle",
            font: "16px 微软雅黑",
            text: this.sysMap.getView().getZoom() >=12 ? feature.getProperties().showText : '',
          })
        })
      ];
    },
    // 获取站点marker样式函数
    getStationStyle(feature, resolution) {
      const imageFlag = feature.getProperties().isWork ? 2 : 1
      const styles =  [
        new Style({
          image: new Icon({ src: require(`@/assets/images/station${imageFlag}.png`) }),
          text: new Text({
            offsetY: -20,
            fill: new Fill({ color: 'rgb(0, 132, 255)' }),
            textBaseline: "middle",
            font: "16px 微软雅黑",
            text: this.sysMap.getView().getZoom() >=12 ? feature.getProperties().showText : '',
          })
        })
      ];
      return styles;
    },
    getinTimeRainDistributionVectorLayer(val) {
      const features = val.map(item => new Feature({ name: "inTimeRainDistributionPoint", geometry: new Point(fromLonLat([Number(item.lon), Number(item.lat)])), pre: item.pre_1h, showText: `${item.station_name} ${item.pre_1h}` }));
      const pointLayer = new VectorLayer({
        name: "getinTimeRainDistribution-vectLayer",
        zIndex: 3,
        source: new VectorSource({ features }),
        style: this.getinTimeRainDistributionStyleFunction
      });
      return pointLayer;
    },
    getstoveDirectiveDistributionVectorLayer(val) {
      const features = val.map(item => new Feature({ name: "stoveDirectiveDistributionPoint", geometry: new Point(fromLonLat([Number(item.longitude), Number(item.latitude)])), isWork: item.isWorkStation,  showText: item.workStationName }));
      const pointLayer = new VectorLayer({
        name: "getstoveDirectiveDistribution-vectLayer",
        zIndex: 3,
        source: new VectorSource({ features }),
        style: this.getStationStyle
      });
      return pointLayer;
    },
    setExtentToMap(extent) {
      this.sysMap.getView().fit(extent);
    },

    bindEventFromVueComponent() {
      // 监听站点信息加载事件;
      this.$bus.on(this.$eventTypes.ADDPOINTMARKER, val => {
        let indexFlag = -1;
        let newLayer = null;
        switch(val.type) {
          case 'inTimeRainLayer':
            newLayer = this.getinTimeRainDistributionVectorLayer(val.points);
            break;
          case 'stoveDirectiveLayer':
            newLayer = this.getstoveDirectiveDistributionVectorLayer(val.points);
            break;
          case 'workAreaDistribution':
            newLayer = this.getWorkAreaDistributionVectorLayer(val.points);
            break;
          case 'stations-vectLayer':
            newLayer = this.getStationsVectorLayer(val.points);
            break;
        }
        this.layers.forEach((item, index) => {
          if (item.get('name') === newLayer.get('name')) {
            indexFlag = index
          }
        });
        if (indexFlag === -1) {
          this.layers.push(newLayer);
        } else {
          const deleteLayer = this.layers[indexFlag];
          this.sysMap.removeLayer(deleteLayer);
          this.layers.splice(indexFlag, 1, newLayer);
        }
        this.refreshMap();
      });
      // 监听点位定位事件;
      this.$bus.on(this.$eventTypes.POINTLOCATION, point => {
        this.sysMap.getView().animate({ center: fromLonLat(point), duration: 2000 });
      });
      // 监听图层显示或隐藏变换事件
      this.$bus.on(this.$eventTypes.LAYERVISIBLECHANGE, val => {
        const layers = this.layers.filter(item => item.get('name') === val.layerName);
        if (!layers.length) return;
        layers.forEach(item => item.getVisible() !== val.visible  && item.setVisible(val.visible));
      });
      // 绑定各种静态图片显示事件;
      this.$bus.on(this.$eventTypes.ADDPASSINGVALUEURL, val => {
        // 每次进来先清理掉原来的图层组;
        if (!this.sysMap) return;
        this.sysMap.getLayers().forEach(item => item instanceof LayerGroup && this.sysMap.removeLayer(item));
        // 设置图例的名字
        this.$store.commit('setLengendModuleName', val.lengendName);
        if (!val.data.length) return;
        val.extent = transformExtent(val.extent, 'EPSG:4326', 'EPSG:3857');
        const projection = new Projection({ units: "degrees", extent: val.extent });
        const imageLayerGroup = val.data.map((item, index) => {
          const groupLayers = item.map((innerItem, innerIndex) => (new ImageLayer({
            visible: index === 0 ? true : false,
            opacity: index === 0 && innerIndex === 0 ? 1 : 0,
            source: new Static({ url: innerItem.filePath, projection: projection, imageExtent: val.extent })
          })));
          return new LayerGroup({ name: `static-layerGroup#${index}`, layers: groupLayers, extent: val.extent });
        });
        this.sysMap.addLayer(...imageLayerGroup);
      });
    },
    registerEventFromMap() {
      // 注册地图点击事件;
      this.sysMap.on('click', evt => {
        this.$bus.emit(this.$eventTypes.CLICKONMAP, { lon: evt.coordinate[0], lat: evt.coordinate[1] });
        document.getElementById('mouseWithOverlay').style.display = 'none';
        this.$store.state.isGetPointTime = !this.$store.state.isGetPointTime;
      });
      this.sysMap.on('pointermove', evt => {
        if (!this.$store.state.isGetPointTime) {
          if (document.getElementById('sysMap').style.cursor !=='default') {
            document.getElementById('sysMap').style.cursor = 'default';
            document.getElementById('mouseWithOverlay').style.display = 'none';
          }
        } else {
          this.mouseWithOverlayIsShow = true;
          document.getElementById('sysMap').style.cursor = 'pointer';
          const overLay = this.sysMap.getOverlayById('mouseWithOverlay');
          document.getElementById('mouseWithOverlay').style.display = 'block';
          if (overLay) {
            overLay.setPosition(evt.coordinate);
          } else {
            const marker = new Overlay({
              id: 'mouseWithOverlay',
              position: evt.coordinate,
              element: document.getElementById('mouseWithOverlay'),
              stopEvent: false
            });
            this.sysMap.addOverlay(marker);
          }
        }
        // popup效果;
        this.popOverLay.setPosition(undefined);
        document.getElementById('sysMap').style.cursor = 'default';
        this.sysMap.forEachFeatureAtPixel(evt.pixel, f => {
            this.isWork = f.getProperties().isWork;
            if (!f.getProperties().showText || this.sysMap.getView().getZoom() >= 12) return;
            document.getElementById('sysMap').style.cursor = 'pointer';
            const coordinate = evt.coordinate;
            this.$refs.popupContent.innerHTML = `<p>${f.getProperties().showText}</p>`;
            this.popOverLay.setPosition(coordinate);
            return true;
        });
      });

    },
    // 绘制郑州市界限
    drawDistract () {
        const areaLineLayer = new VectorLayer({
            title: "区域线图层",
            name: 'cityBoundary',
            zIndex: 1,
            source: new VectorSource({ features: (new GeoJSON()).readFeatures(geoData, {dataProjection: 'EPSG:4326',featureProjection:'EPSG:3857'}) }),
            style: new Style({ stroke: new Stroke({ width: 2, color: '#48dad5' }) })
        });
        this.layers.push(areaLineLayer);
        this.refreshMap();
    },
    // 绘制郑州市县界限
    xianDrawDistract () {
        const areaLineLayer = new VectorLayer({
            title: "区域线图层",
            name: "countryBoundary",
            zIndex: 1,
            source: new VectorSource({ features: (new GeoJSON()).readFeatures(xianGeoData, {dataProjection: 'EPSG:4326',featureProjection:'EPSG:3857'}) }),
            style: new Style({ stroke: new Stroke({ width: 2, color: '#be4eff' }) })
        });
        this.layers.push(areaLineLayer);
        this.refreshMap();
    },
    // 绘制河南省界限
    henanDrawDistract () {
        const areaLineLayer = new VectorLayer({
            title: "区域线图层",
            zIndex: 1,
            name: 'provinceBoundary',
            source: new VectorSource({ features: (new GeoJSON()).readFeatures(henanGeoData, {dataProjection: 'EPSG:4326',featureProjection:'EPSG:3857'}) }),
            style: new Style({ stroke: new Stroke({ width: 2, color: '#2e354f' })
          })
        });
        this.layers.push(areaLineLayer);
        this.refreshMap();
    },
    // 初始化地图;
    initMap() {
        this.popOverLay = new Overlay({ element: this.$refs.container, autoPan: true, autoPanAnimation: { duration: 250 } });

        this.$refs.popupCloser.onclick = () => {
            this.popOverLay.setPosition(undefined);
            this.$refs.popupCloser.blur();
        };
        this.sysMap = new Map({
          controls: defaultControls({ zoom: false }).extend([new ScaleLine()]),
          target: "sysMap",
          overlays: [this.popOverLay],
          view: new View({ center: fromLonLat([113.5361, 34.7410]), zoom: 9 })
        });
        this.$bus.emit(this.$eventTypes.MAPCREATED, this.sysMap);
        this.$store.commit('setSysMapObject', this.sysMap);


        // 绑定组件事件;
        this.bindEventFromVueComponent();
        // 注册地图事件;
        this.registerEventFromMap();
        this.xianDrawDistract();
        this.drawDistract();
        this.henanDrawDistract();
    },
  },
  beforeCreate() {
    this.$store.dispatch('getStationLoc');
  },
  mounted() {
    // 初始化底图数据;
    this.initMap();
  },
  beforeDestroy() {
    this.$store.commit('setSysMapObject', null);
  }
};
</script>

<style scoped>
#sysMap {
  height: 100%;
}
#mouseWithOverlay{
   display: none;
   position: absolute;
   z-index: 1000;
   top: 0;
   left: 10px;
   color: red;
   width: 200px;
   font-size: 18px;
   font-weight: bold
}

.ol-popup {
    position: absolute;
    color: #fff;
    -webkit-filter: drop-shadow(0 1px 4px rgba(0,0,0,0.2));
    filter: drop-shadow(0 1px 4px rgba(0,0,0,0.2));
    padding: 15px;
    border-radius: 10px;
    /* border: 1px solid #1f74f1; */
    bottom: 12px;
    left: -50px;
    word-break: keep-all;
	  white-space:nowrap;
    min-width: 100px;
    text-align: center;
  }
  .unWork {
      background-color: #1f74f1;
  }
  .work {
      background-color: #fb7157;
  }
  .ol-popup:after, .ol-popup:before {
    top: 100%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
  }
  .ol-popup:after {
    border-width: 10px;
    left: 48px;
    margin-left: -10px;
  }
  .ol-popup:before {
    border-width: 11px;
    left: 48px;
    margin-left: -11px;
  }
  .ol-popup.unWork:before,
  .ol-popup.unWork:after {
      border-top-color: #1f74f1
  }
  .ol-popup.work:before,
  .ol-popup.work:after {
      border-top-color: #fb7157
  }
  .ol-popup-closer {
    text-decoration: none;
    position: absolute;
    top: 2px;
    right: 8px;
  }
</style>
