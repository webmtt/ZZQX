const eventTypes = {
    MAPCREATED: 'mapCreated',
    BASEMAPSWITCH: 'baseMapSwitch', // 底图切换事件
    SETNEWEXTENTION: 'setNewExtention', // 设置地图显示范围
    CLICKONMAP: 'clickOnMap', // 地图点击事件
    LAYERVISIBLECHANGE: 'layerVisibleChange', // 图层样式切换事件;
    ADDPOINTMARKER: 'addPointMarker', // 加载地图点图标
    REMOVELAYERBYNAME: 'removeLayerByName', // 根据图层名称移除图层
    POINTLOCATION: 'pointLocation', // 地图点位定位事件
    WORKRESULTDATA: 'workResultData', // 作业效果编辑传递数据;
    ADDPASSINGVALUE: 'addPassingValue', // 组件传值
    ADDPASSINGVALUEURL:'addPassingValueUrl', //组件传url
    ADDCOMPLEXPASSINGVALUE:'addComplexPassingValue', //组件传url
    ADDCOMPLEXPASSINGURL:'addComplexPassingUrl', //组件传url
    // ADDRADARWAVE:'addRadarWave', //雷达回波
    TABLELINESELECTED: 'tableLineSelected', // 行数据点击事件;
};

export default eventTypes;