import Vue from 'vue';
import Vuex from 'vuex';
import * as api from '../api.js';
import menuConfig, { serverMenus } from '../config/menuConfig';
import permissionModule from './modules/permission';

Vue.use(Vuex)

const generateTreeData = function(obj, data, menuConfigData) {
    data.forEach((item, index) => {
        if (/菜单/.test(item.remark)) {
            obj[index] = { text: item.name, id: item.id };
            if (menuConfigData[index].children) { obj[index].children = []}
            if (item.ename) { obj[index].name = item.ename }
            generateTreeData(obj[index].children, item.child, menuConfigData[index].children);
        }
    });
}

const getUserPermissionIds = function(arr, data) {
    data.forEach(item => {
        arr.push(item.id);
        if (item.child) {
            getUserPermissionIds(arr, item.child);
        }
    });
};

const getUserInterfaces = function(arr, data) {
    data.forEach(item => {
        if (item.url) arr.push(item.url);
        if (item.child) {
            getUserInterfaces(arr, item.child);
        }
    });
};

const store = new Vuex.Store({
    modules: {
        permission: permissionModule
    },
    state: {
        isGetPointTime: false,
        mapTabActiveId: 0,
        lengendName: '',
        mapLoading: false, // 地图加载效果状态控制,
        pieSatMap: null, // openlayer地图实例,
        stationLoc: [],
        timePlayerOptions: [],
        staticLayerOption: [],

        userInterface: [], // 用户所有可用接口
        userPermissionIds: [], // 登录用户的权限id
        menuItems: [], // 左侧菜单栏数据
    },
    mutations: {
        setMenus(state, items) {
            state.menuItems = [...items]
        },
        setStationLoc(state, param) {
            state.stationLoc = param;
        },
        getStationLocStove(state, param) {
            state.stationLoc = param;
        },
        setMapTabActiveId(state, val) {
            state.mapTabActiveId = val;
        },
        setIsGetPointTime(state, val) {
            state.isGetPointTime = val;
        },
        setStaticLayerOption(state, val) {
            state.staticLayerOption = val;
        },
        setMapLoading(state, val) {
            state.mapLoading = val;
        },
        setSysMapObject(state, val) {
            state.pieSatMap = val;
        },
        setTimePlayerOptions(state, val) {
            state.timePlayerOptions = val;
        },
        setLengendModuleName(state, val) {
            state.lengendName = val;
        },
        setAllPermissions(state, val) {
            state.allPermissions = val;
        },
        setUserPermissionIds(state, val) {
            state.userPermissionIds = val;
        },
        setUserInterface(state, val) {
            state.userInterface = val;
        },
    },
    actions: {
        // 获得作业站点数据;
        getStationLoc(context) {
            return api.getStationLoc()
            .then(res => {
                context.commit('setStationLoc', res.data);
                return res.data;
            });
        },
        getStationLocStove(context) {
            return api.getStationLocStove()
            .then(res => {
                context.commit('setStationLocStove', res.data);
                return res.data;
            });
        },
        // 获得雷达回波数据;
        radarBackWaveData(context) {
            return api.getRadarBackWave()
            .then(res => {
                res.data.forEach(item => item.showLabel = item.datatime.split(' ')[0]);
                context.commit('setTimePlayerOptions', [res.data]);
                return [res.data];
            })
        },
        // 获得定量降水数据;
        rationRainData(context) {
            return api.getRationRain()
            .then(res => {
                res.data.forEach(item => item.showLabel = item.datatime.split(' ')[0]);
                context.commit('setTimePlayerOptions', [res.data]);
                return [res.data];
            })
        },
        // 获得瞬时雨强数据;
        temperRainData(context){
            return api.getTemperRain()
            .then(res => {
                res.data.forEach(item => item.showLabel = item.datatime.split(' ')[0]);
                context.commit('setTimePlayerOptions', [res.data]);
                return [res.data];
            })
        },
        // 获得强对流数据;
        severeConvectionData(context) {
            return api.getSevereConvection()
            .then(res => {
                res.data.forEach(item => item.showLabel = item.datatime.split(' ')[0]);
                context.commit('setTimePlayerOptions', [res.data]);
                return [res.data];
            })
        },
        // 获得降水预报数据;
        rainingEstimate(context) {
            return api.getRainingEstimate()
            .then(res => {
                res.data.forEach((item, index) => item.forEach(innerItem => innerItem.showLabel = (index + 1) * 24 + 'h'));
                context.commit('setTimePlayerOptions', res.data);
                return [res.data[0]];
            })
        },
        // 获得雷达数据;
        radarData(context) {
            return api.getRadarLocal()
            .then(res => {
                res.data.forEach(item => item.showLabel = item.datatime.split(' ')[0]);
                context.commit('setTimePlayerOptions', [res.data]);
                return [res.data];
            });
        },
        // 获得卫星云图数据;
        satelliteCloudData(context) {
            return api.satelliteCloud()
            .then(res => {
                res.data.forEach(item => item.showLabel = item.datatime.split(' ')[0]);
                context.commit('setTimePlayerOptions', [res.data]);
                return [res.data];
            });
        },
        // 获得卫星云分类数据;
        satelliteCloudClassData(context) {
            return api.getSatelliteCloudClass()
            .then(res => {
                res.data.forEach(item => item.showLabel = item.datatime.split(' ')[0]);
                context.commit('setTimePlayerOptions', [res.data]);
                return [res.data];
            });
        },
        // 获得卫星云顶高数据;
        satelliteCloudHightData(context) {
            return api.getSatelliteCloudHigh()
            .then(res => {
                res.data.forEach(item => item.showLabel = item.datatime.split(' ')[0]);
                context.commit('setTimePlayerOptions', [res.data]);
                return [res.data];
            });
        },
        // 获得用户的所有菜单和权限；
        getUserPermission(context, roleId) {
            return api.getPowersByRoleId({ roleId})
            .then(res => {
                const menus = [];
                const ids = [];
                const interfaces = [];
                getUserPermissionIds(ids, res.data);
                context.commit('setUserPermissionIds', ids);
                getUserInterfaces(interfaces, res.data);
                context.commit('setUserInterface', interfaces);
                
                // menuConfig.forEach((item, index) => {
                //     res.data.forEach(innerItem => {
                //         if (item.text === innerItem.name && /菜单/.test(innerItem.remark)) {
                //             menus.push({ text: innerItem.name, id: innerItem.id, type: item.type });
                //             if (innerItem.ename) { menus[menus.length - 1].name = innerItem.ename; }
                //             if (innerItem.child.length && innerItem.name != '地图监控' && item.children) {
                //                 menus[menus.length - 1].children = [];
                //                 generateTreeData(menus[menus.length - 1].children, innerItem.child, item.children);
                //             }
                //         }
                //     });
                // });
                context.commit('setMenus',res.data);
                return res.data;
            });
        }
    }
})

export default store