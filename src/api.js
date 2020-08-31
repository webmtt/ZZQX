import ajax from './ajax.js';

export const login = params => ajax.fetchPost('/login', params);
// -----------------------------------------------------------作业区域相关接口-----------------------------------------------------
// 作业区域时间列表接口
export const getWorkAreaTimeList = params => ajax.fetchGet('/operatingArea/getTimes', params);
// 作业区域按时间查询所有区域记录
export const getWorkAreaDataList = params => ajax.fetchGet('/operatingArea/getOperatingAreaByTime', params);
// 作业区域点新增或编辑操作
export const workAreaAddPoint = params => ajax.fetchPost('/operatingArea/insertOrUpdateOperatingArea', params);
// 作业区域点删除操作
export const workAreaDeletePoint = params => ajax.fetchGet('/operatingArea/delOperatingArea', params);
// 获得新增站点时的站点初始值(作业区域和作业效果获得的站点都是此接口)
export const getAllWorkSationData = params => ajax.fetchGet('/operatingArea/getAreaStation', params);
// 获得站点数据接口(除实时雨晴外地图上加载的数据都是此接口)
export const getStationLoc = params => ajax.fetchGet('/sysUser/getAllStation', params);

// -----------------------------------------------------------作业指令相关接口-----------------------------------------------------
// 作业指令时间列表接口
export const getWorkOrderTimeList = params => ajax.fetchGet('/operatingArea/getOrderTimes', params);
// 作业指令时间列表查询接口
export const getWorkOrderDataList = params => ajax.fetchGet('/operatingArea/getOrderByTime', params);
// 发送指令
export const sendOrder = params => ajax.fetchGet('/operatingArea/sendAll', params);
// 发送指令
export const StoveSendOrder = params => ajax.fetchGet('/operatingStove/sendAll', params);
// 修改和新增指令
export const updateOrAddOrder = params => ajax.fetchPost('/operatingArea/updateOrderById', params);
// 发送语音指令
export const sendVoiceOrder = params => ajax.fetchGet('/callNotify/doCallNotify', params);
// 指令生成
export const generateOrder = params => ajax.fetchGet('/operatingArea/generateJobInstructions', params);
// 删除指令数据
export const deleteOrderData = params => ajax.fetchGet('/operatingArea/delOrderById', params);
// -----------------------------------------------------------实时雨晴令相关接口-----------------------------------------------------
// 获取实时雨晴数据
export const getInTimeRainData = params => ajax.fetchGet('/rain/StationHour/getData', params);
// 获取实时雨晴时间段数据
export const getInTimeRainTimes = params => ajax.fetchGet('/rain/StationHour/getNewTimes', params);

// -----------------------------------------------------------作业效果相关接口-----------------------------------------------------
// 获得作业效果上报相关接口
export const getWorkResultData = params => ajax.fetchGet('/situation/select', params);
// 获得作业效果上报删除接口
export const deleteWorkResultData = params => ajax.fetchDelete('/situation/delete', params);
// 获得作业效果上报新增或删除
export const updateWorkResultData = params => ajax.fetchPost('/situation/saveOrUpdate', params);
// 获得作业效果上报导出
export const exoportWorkResultData = params => ajax.fetchGet('/situation/export', params);

export const getOperatingHistory = params => ajax.fetchGet('/operatingHistory/list', params);

export const estimateResultHistory = params => ajax.fetchGet('/operatingHistory/assess', params);

export const getsituationAssess = params => ajax.fetchGet('/situationAssess/list', params);

//获得作业点信息上报相关接口
export const getPointReportData = params => ajax.fetchGet('/pointReport/list', params);
//获得作业点信息上报删除接口
export const deletePointReportData = params => ajax.fetchGet('/pointReport/delete', params);
//修改作业点信息
export const updatePointReportInfo = params => ajax.fetchPost('/pointReport/update', params);
//新增作业点信息
export const insertPointReportInfo = params => ajax.fetchPost('/pointReport/insert', params);


// -----------------------------------------------------------用户相关接口开始-----------------------------------------------------
// 获得用户列表接口
export const getUserList = params => ajax.fetchGet('/sysUser/user/list', params);
export const deleteUserByUserName = params => ajax.fetchGet('/sysUser/user/delete', params);
export const updateUserName = params => ajax.fetchPost('/sysUser/user/update', params);
export const InsertUserName = params => ajax.fetchPost('/sysUser/user/insert', params);
export const resetUserPassword = params => ajax.fetchPost('/sysUser/user/resetPwd', params);
export const updatePassword = params => ajax.fetchPost('/sysUser/user/updatePwd', params);
export const userNameAndPhone = params => ajax.fetchGet('/sysUser/user/userNameAndPhone', params);

// -----------------------------------------------------------角色相关接口开始-----------------------------------------------------
export const getAllRoleList = params => ajax.fetchGet('/role/findAllRoleList', params);
export const getRoleLists = params => ajax.fetchGet('/role/name', params);
export const deleteRoleById = params => ajax.fetchGet('/role/deleteRoleById', params);
export const insertRole = params => ajax.fetchPost('/role/insertRole', params);
export const updateRole = params => ajax.fetchPost('/role/updateRole', params);
export const getPowersByRoleId = params => ajax.fetchGet('/permission/getPermissionIdsByRoleId', params); // 根据角色id获取权限
export const getAllPower = params => ajax.fetchGet('/permission/all', params); // 获取所有菜单接口
export const updatePower = params => ajax.fetchPost('/permission/addRolePermissionBatch', params); // 修改权限

// -----------------------------------------------------------卫星云图三个接口-----------------------------------------------------
// 卫星云图
export const satelliteCloud = params => ajax.fetchGet('/Meteorological/cloud/getCloud', params);
// 卫星云图云分类
export const getSatelliteCloudClass = params => ajax.fetchGet('/Meteorological/getCloudSort', params);
// 卫星云图云顶高
export const getSatelliteCloudHigh = params => ajax.fetchGet('/Meteorological/getcloudTop', params);

//张艳军本地雷达接口
export const getRadarLocal = params => ajax.fetchGet('/radar/info', params);
//喻文杰雷达回波接口
export const getRadarBackWave = params => ajax.fetchGet('/forecastProduct/getRadar', params);
//喻文杰定量降水接口
export const getRationRain = params => ajax.fetchGet('/forecastProduct/getQP', params);
//喻文杰雷电接口
export const getTemperRain = params => ajax.fetchGet('/forecastProduct/getRaininess', params);
//喻文杰强对流
export const getSevereConvection = params => ajax.fetchGet('/forecastProduct/getConvect', params);
//喻文杰降水预报
export const getRainingEstimate = params => ajax.fetchGet('/forecastProduct/getWater', params);
//赵晓君装备分页查询接口
export const selectEquipment = params => ajax.fetchGet('/equipmentType/list', params);
//赵晓君装备删除接口
export const deleteEquipment = params => ajax.fetchGet('/equipmentType/delete', params);
//赵晓君装备分页查询接口
export const selectWorkStationInfo = params => ajax.fetchGet('/workStationInfo/selectWorkStationInfo', params);
//赵晓君装备删除接口
export const deleteWorkStationInfo = params => ajax.fetchPost('/workStationInfo/deleteWorkStationInfo', params);
//赵晓君装备添加接口
export const insertOrUpdateEquipment = params => ajax.fetchPost('/equipmentType/insert', params);
//赵晓君装备修改接口
export const updateOrUpdateEquipment = params => ajax.fetchPost('/equipmentType/update', params);
export const getAllStationName = params => ajax.fetchGet('/sysUser/getAllStation', params);
//赵晓君点位修改添加接口
export const insertOrUpdateWorkStationInfo = params => ajax.fetchPost('/workStationInfo/insertOrUpdateWorkStationInfo', params);
export const getEquipmentTypes = params => ajax.fetchGet('/equipment/type', params);

//----------------------------------------------------装备信息接口----------------------------------------------
//装备信息分页+条件查询接口
export const selectEquipmentInfo = params => ajax.fetchGet('/equipmentInfo/list', params);
//装备信息新增器材类型接口
export const insertOrUpdateEquipmentInfo = params => ajax.fetchPost('/equipmentInfo/insert', params);
//装备信息修改器材类型接口
export const updateOrUpdateEquipmentInfo = params => ajax.fetchPost('/equipmentInfo/update', params);
//装备信息删除器材类型接口
export const deleteOrUpdateEquipmentInfo = params => ajax.fetchGet('/equipmentInfo/delete', params);
//装备信息装备类型接口
export const getAllEquipmentType = params => ajax.fetchGet('/equipmentType/type', params);

//----------------------------------------------------器材类型接口----------------------------------------------
//器材类型分页+条件查询接口
export const selectConsumablesType = params => ajax.fetchGet('/consumablesType/list', params);
//器材类型新增器材类型接口
export const insertOrUpdateConsumables = params => ajax.fetchPost('/consumablesType/insert', params);
//器材类型修改器材类型接口
export const updateOrUpdateConsumables = params => ajax.fetchPost('/consumablesType/update', params);
//器材类型删除器材类型接口
export const deleteOrUpdateConsumables = params => ajax.fetchGet('/consumablesType/delete', params);

//----------------------------------------------------器材信息接口----------------------------------------------
//器材信息分页+条件查询接口
export const selectConsumablesInfo = params => ajax.fetchGet('/consumablesInfo/list', params);
//器材信息新增器材类型接口
export const insertOrUpdateConsumablesInfo = params => ajax.fetchPost('/consumablesInfo/insert', params);
//器材信息修改器材类型接口
export const updateOrUpdateConsumablesInfo = params => ajax.fetchPost('/consumablesInfo/update', params);
//器材信息删除器材类型接口
export const deleteOrUpdateConsumablesInfo = params => ajax.fetchGet('/consumablesInfo/delete', params);
//装备信息装备类型接口
export const getAllConsumablesType = params => ajax.fetchGet('/consumablesType/type', params);




// -----------------------------------------------------------烟炉点位接口-----------------------------------------------------
//烟炉点位分页查询接口
export const selectStoveStationInfo = params => ajax.fetchGet('/stove/list', params);
//新增烟炉点位接口
export const insertStoveStationInfo = params => ajax.fetchPost('/stove/insert', params);
//修改烟炉点位
export const updateStoveStationInfo = params => ajax.fetchPost('/stove/update', params);
//删除烟炉点位
export const deleteStoveStationInfo = params => ajax.fetchGet('/stove/delete', params);
// 获得站点数据接口
export const getStationLocStove = params => ajax.fetchGet('/stove/stoveInfo', params);

// -----------------------------------------------------------烟炉点位接口-----------------------------------------------------
//操作日志分页查询接口
export const selectOperationLog = params => ajax.fetchGet('/operationLog/list', params);


// -----------------------------------------------------------烟炉指令接口-----------------------------------------------------
//烟炉获取预报时间接口
export const getStoveDataList = params => ajax.fetchGet('/operatingStove/times', params);
//烟炉查询所有指令记录
export const getStoveDataRecord = params => ajax.fetchGet('/operatingStove/record', params);
//删除烟炉指令
export const deleteStoveData = params => ajax.fetchGet('/operatingStove/delete', params);
//发送烟炉短信指令
export const sendStoveNoteOrder = params => ajax.fetchGet('/operatingStove/sendDiffSms', params);
//发送烟炉语音指令
export const sendStoveVoiceOrder = params => ajax.fetchGet('/operatingStove/doCallNotify', params);