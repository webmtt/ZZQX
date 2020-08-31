const baseMapLayer = [
    {
        source: 'http://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}',
        label: '地图',
        visible: true,
        type: 'Tile'
    },
    {
        source: 'http://www.google.cn/maps/vt?lyrs=y@189&gl=cn&x={x}&y={y}&z={z}',
        label: '影像',
        visible: false,
        type: 'Tile'
    }
];
// 静态播放动态图片类型的范围配置;
const staticImageExtent = {
    radar: [111.32086150372189, 32.75136773128521, 116.0736027748427, 36.65750434450502], // 本地雷达extent
    radarForecast: [111.397, 32.404, 115.997, 37.0004],
    radarNumberForecast: [109, 30, 117, 37], 
    satelliteCloud: [69.99, 0.99, 150.01, 56.01] // 卫星云图extent
};

const map = {
    baseMapLayer,
    staticImageExtent
}

export default map;