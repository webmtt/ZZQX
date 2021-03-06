export default [
    {
        size: 18,
        type: 'ios-map',
        text: '数据分析',
        path: '/dataAnalysis',
        children: [
            {
                name: 'inTimeRain',
                text: '实时雨晴',
                path: '/dataAnalysis/inTimeRain',
            },
            {
                name: 'radarData',
                text: '雷达数据',
                path: '/dataAnalysis/radarData',
            },
        ]
    },
    {
        name: 'equipment',
        path: '/equipment',
        size: 18,
        type: 'ios-medical',
        text: '装备器材'
    },
    {
        name: 'workPoint',
        path: '/workPoint',
        size: 18,
        type: 'ios-locate',
        text: '作业点位'
    },
    {
        text: '作业效果',
        path: '/',
        type: 'ios-list-box',
        children: [
            {
                name: 'situation',
                path: '/situation',
                text: '效果上报'
            },
            {
                name: 'history',
                path: '/history',
                text: '历史作业指令'
            },
            {
                name: 'assess',
                path: '/assess',
                text: '效果结果'
            }
        ]
    },
    {
        text: '人员权限',
        type: 'md-people',
        path: '/',
        children: [
            {
                type: 'ios-grid',
                name: 'userList',
                path: '/userList',
                text: '用户管理'
            },
            {
                type: 'ios-notifications-outline',
                name: 'roleManage',
                path: '/roleManage',
                text: '角色管理'
            },
            {
                type: 'md-lock',
                name: 'password',
                path: '/password',
                text: '修改密码'
            }
        ]
    },
];

export const serverMenus = [
    {
        "ename":"weather",
        "code":"101",
        "name":"天气识别",
        "description":"天气识别",
        "pid":0,
        "remark":"一级菜单",
        "sortNum":0,
        "id":1,
        "is_button":0,
        "url":"",
        "child":[
            {
                "ename":"rain",
                "code":"101001",
                "name":"实时雨情",
                "description":"天气识别/实时雨情",
                "pid":1,
                "remark":"二级菜单",
                "sortNum":0,
                "id":5,
                "is_button":0,
                "url":"",
                "child":[
                    {
                        "ename":"",
                        "code":"101001001",
                        "name":"实时雨情展示",
                        "description":"天气识别/实时雨情/实时雨情",
                        "pid":5,
                        "remark":"接口",
                        "sortNum":0,
                        "id":20,
                        "is_button":2,
                        "url":"/rain/StationHour/getData",
                        "child":[

                        ]
                    }
                ]
            },
            {
                "ename":"radar",
                "code":"101002",
                "name":"雷达数据",
                "description":"天气识别/雷达数据",
                "pid":1,
                "remark":"二级菜单",
                "sortNum":0,
                "id":6,
                "is_button":0,
                "url":"",
                "child":[
                    {
                        "ename":"",
                        "code":"101002001",
                        "name":"本地雷达",
                        "description":"天气识别/雷达数据/本地雷达",
                        "pid":6,
                        "remark":"接口",
                        "sortNum":0,
                        "id":22,
                        "is_button":2,
                        "url":"/radar/info",
                        "child":[

                        ]
                    },
                    {
                        "ename":"",
                        "code":"101002002",
                        "name":"外推雷达回波",
                        "description":"天气识别/雷达数据/外推雷达回波",
                        "pid":6,
                        "remark":"接口",
                        "sortNum":0,
                        "id":23,
                        "is_button":2,
                        "url":"/forecastProduct/getRadar",
                        "child":[

                        ]
                    }
                ]
            },
            {
                "ename":"forecast",
                "code":"101003",
                "name":"预报产品",
                "description":"天气识别/预报产品",
                "pid":1,
                "remark":"二级菜单",
                "sortNum":0,
                "id":7,
                "is_button":0,
                "url":"",
                "child":[
                    {
                        "ename":"",
                        "code":"101003001",
                        "name":"雷达外推-定量降水展示",
                        "description":"天气识别/预报产品/雷达外推-定量降水",
                        "pid":7,
                        "remark":"接口",
                        "sortNum":0,
                        "id":24,
                        "is_button":2,
                        "url":"/forecastProduct/getQP",
                        "child":[

                        ]
                    },
                    {
                        "ename":"",
                        "code":"101003002",
                        "name":"雷达外推-瞬时雨强展示",
                        "description":"天气识别/预报产品/雷达外推-瞬时雨强",
                        "pid":7,
                        "remark":"接口",
                        "sortNum":0,
                        "id":25,
                        "is_button":2,
                        "url":"/forecastProduct/getRaininess",
                        "child":[

                        ]
                    },
                    {
                        "ename":"",
                        "code":"101003003",
                        "name":"雷达外推-强对流展示",
                        "description":"天气识别/预报产品/雷达外推-强对流",
                        "pid":7,
                        "remark":"接口",
                        "sortNum":0,
                        "id":26,
                        "is_button":2,
                        "url":"/forecastProduct/getConvect",
                        "child":[

                        ]
                    },
                    {
                        "ename":"",
                        "code":"101003004",
                        "name":"数值预报-降水预报展示",
                        "description":"天气识别/预报产品/数值预报-降水预报",
                        "pid":7,
                        "remark":"接口",
                        "sortNum":0,
                        "id":27,
                        "is_button":2,
                        "url":"/forecastProduct/getWater",
                        "child":[

                        ]
                    }
                ]
            },
            {
                "ename":"meteorological",
                "code":"101004",
                "name":"卫星云图",
                "description":"天气识别/卫星云图",
                "pid":1,
                "remark":"二级菜单",
                "sortNum":0,
                "id":8,
                "is_button":0,
                "url":"",
                "child":[
                    {
                        "ename":"",
                        "code":"101004001",
                        "name":"降水估计展示",
                        "description":"天气识别/卫星云图/降水估计",
                        "pid":8,
                        "remark":"接口",
                        "sortNum":0,
                        "id":28,
                        "is_button":2,
                        "url":"/Meteorological/cloud/getCloud",
                        "child":[

                        ]
                    },
                    {
                        "ename":"",
                        "code":"101004002",
                        "name":"云分类展示",
                        "description":"天气识别/卫星云图/云分类",
                        "pid":8,
                        "remark":"接口",
                        "sortNum":0,
                        "id":29,
                        "is_button":2,
                        "url":"/Meteorological/getCloudSort",
                        "child":[

                        ]
                    },
                    {
                        "ename":"",
                        "code":"101004003",
                        "name":"云顶高展示",
                        "description":"天气识别/卫星云图/云顶高",
                        "pid":8,
                        "remark":"接口",
                        "sortNum":0,
                        "id":30,
                        "is_button":2,
                        "url":"/Meteorological/getcloudTop",
                        "child":[

                        ]
                    }
                ]
            }
        ]
    },
    {
        "ename":"command",
        "code":"102",
        "name":"指挥决策",
        "description":"指挥决策",
        "pid":0,
        "remark":"一级菜单",
        "sortNum":0,
        "id":2,
        "is_button":0,
        "url":"",
        "child":[
            {
                "ename":"area",
                "code":"102001",
                "name":"作业区域",
                "description":"指挥决策/作业区域",
                "pid":2,
                "remark":"二级菜单",
                "sortNum":0,
                "id":9,
                "is_button":0,
                "url":"",
                "child":[
                    {
                        "ename":"",
                        "code":"102001001",
                        "name":"作业区域展示",
                        "description":"指挥决策/作业区域/按时间查询所有区域记录",
                        "pid":9,
                        "remark":"接口",
                        "sortNum":0,
                        "id":31,
                        "is_button":2,
                        "url":"/operatingArea/getOperatingAreaByTime",
                        "child":[

                        ]
                    },
                    {
                        "ename":"",
                        "code":"102001004",
                        "name":"添加作业区域",
                        "description":"指挥决策/作业区域/添加作业区域",
                        "pid":9,
                        "remark":"接口",
                        "sortNum":0,
                        "id":34,
                        "is_button":2,
                        "url":"/operatingArea/insertOrUpdateOperatingArea",
                        "child":[

                        ]
                    },
                    {
                        "ename":"",
                        "code":"102001005",
                        "name":"删除作业区域",
                        "description":"指挥决策/作业区域/删除作业区域和对应指令",
                        "pid":9,
                        "remark":"接口",
                        "sortNum":0,
                        "id":35,
                        "is_button":2,
                        "url":"/operatingArea/delOperatingArea",
                        "child":[

                        ]
                    }
                ]
            },
            {
                "ename":"order",
                "code":"102002",
                "name":"作业指令",
                "description":"指挥决策/作业指令",
                "pid":2,
                "remark":"二级菜单",
                "sortNum":0,
                "id":10,
                "is_button":0,
                "url":"",
                "child":[
                    {
                        "ename":"",
                        "code":"102002001",
                        "name":"作业指令展示",
                        "description":"指挥决策/作业指令/按时间查询所有指令记录",
                        "pid":10,
                        "remark":"接口",
                        "sortNum":0,
                        "id":36,
                        "is_button":2,
                        "url":"/operatingArea/getOrderByTime",
                        "child":[

                        ]
                    },
                    {
                        "ename":"",
                        "code":"102002003",
                        "name":"生成作业指令",
                        "description":"指挥决策/作业指令/生成作业指令",
                        "pid":10,
                        "remark":"接口",
                        "sortNum":0,
                        "id":38,
                        "is_button":2,
                        "url":"/operatingArea/generateJobInstructions",
                        "child":[

                        ]
                    },
                    {
                        "ename":"",
                        "code":"102002004",
                        "name":"修改作业指令",
                        "description":"指挥决策/作业指令/修改作业指令",
                        "pid":10,
                        "remark":"接口",
                        "sortNum":0,
                        "id":39,
                        "is_button":2,
                        "url":"/operatingArea/updateOrderById",
                        "child":[

                        ]
                    },
                    {
                        "ename":"",
                        "code":"102002005",
                        "name":"删除作业指令",
                        "description":"指挥决策/作业指令/根据id作删除作业指令",
                        "pid":10,
                        "remark":"接口",
                        "sortNum":0,
                        "id":40,
                        "is_button":2,
                        "url":"/operatingArea/delOrderById",
                        "child":[

                        ]
                    },
                    {
                        "ename":"",
                        "code":"102002007",
                        "name":"一键发送指令",
                        "description":"指挥决策/作业指令/发送作业指令-语音",
                        "pid":10,
                        "remark":"接口",
                        "sortNum":0,
                        "id":42,
                        "is_button":2,
                        "url":"/callNotify/doCallNotify",
                        "child":[

                        ]
                    }
                ]
            },
            {
                "ename":"stove",
                "code":"102003",
                "name":"烟炉指令",
                "description":"指挥决策/烟炉指令",
                "pid":2,
                "remark":"二级菜单",
                "sortNum":0,
                "id":11,
                "is_button":0,
                "url":"",
                "child":[
                    {
                        "ename":"",
                        "code":"102003001",
                        "name":"作业指令展示",
                        "description":"指挥决策/烟炉指令/按时间查询所有指令记录",
                        "pid":11,
                        "remark":"接口",
                        "sortNum":0,
                        "id":43,
                        "is_button":2,
                        "url":"",
                        "child":[

                        ]
                    },
                    {
                        "ename":"",
                        "code":"102003003",
                        "name":"删除作业指令",
                        "description":"指挥决策/烟炉指令/根据id作删除作业指令",
                        "pid":11,
                        "remark":"接口",
                        "sortNum":0,
                        "id":45,
                        "is_button":2,
                        "url":"",
                        "child":[

                        ]
                    },
                    {
                        "ename":"",
                        "code":"102003005",
                        "name":"一键发送指令",
                        "description":"指挥决策/烟炉指令/发送作业指令-语音",
                        "pid":11,
                        "remark":"接口",
                        "sortNum":0,
                        "id":47,
                        "is_button":2,
                        "url":"",
                        "child":[

                        ]
                    }
                ]
            }
        ]
    },
    {
        "ename":"work",
        "code":"103",
        "name":"作业效果",
        "description":"作业效果",
        "pid":0,
        "remark":"一级菜单",
        "sortNum":0,
        "id":3,
        "is_button":0,
        "url":"",
        "child":[
            {
                "ename":"situation",
                "code":"103001",
                "name":"效果上报",
                "description":"作业效果/效果上报",
                "pid":3,
                "remark":"二级菜单",
                "sortNum":0,
                "id":12,
                "is_button":0,
                "url":"",
                "child":[
                    {
                        "ename":"",
                        "code":"103001001",
                        "name":"列表展示查询",
                        "description":"作业效果/效果上报/作业效果分页条件查询",
                        "pid":12,
                        "remark":"接口",
                        "sortNum":0,
                        "id":48,
                        "is_button":2,
                        "url":"/situation/select",
                        "child":[

                        ]
                    },
                    {
                        "ename":"",
                        "code":"103001002",
                        "name":"新增或修改作业效果",
                        "description":"作业效果/效果上报/新增或修改作业效果",
                        "pid":12,
                        "remark":"接口",
                        "sortNum":0,
                        "id":49,
                        "is_button":2,
                        "url":"/situation/saveOrUpdate",
                        "child":[

                        ]
                    },
                    {
                        "ename":"",
                        "code":"103001003",
                        "name":"删除作业效果",
                        "description":"作业效果/效果上报/删除作业效果",
                        "pid":12,
                        "remark":"接口",
                        "sortNum":0,
                        "id":50,
                        "is_button":2,
                        "url":"/situation/delete",
                        "child":[

                        ]
                    },
                    {
                        "ename":"",
                        "code":"103001004",
                        "name":"导出作业效果",
                        "description":"作业效果/效果上报/导出作业效果",
                        "pid":12,
                        "remark":"接口",
                        "sortNum":0,
                        "id":51,
                        "is_button":2,
                        "url":"/situation/export",
                        "child":[

                        ]
                    }
                ]
            },
            {
                "ename":"history",
                "code":"103002",
                "name":"历史作业指令",
                "description":"作业效果/历史作业指令",
                "pid":3,
                "remark":"二级菜单",
                "sortNum":0,
                "id":13,
                "is_button":0,
                "url":"",
                "child":[
                    {
                        "ename":"",
                        "code":"103002001",
                        "name":"列表展示查询",
                        "description":"作业效果/历史作业指令/分页列表+条件查询",
                        "pid":13,
                        "remark":"接口",
                        "sortNum":0,
                        "id":52,
                        "is_button":2,
                        "url":"/operatingHistory/list",
                        "child":[

                        ]
                    },
                    {
                        "ename":"",
                        "code":"103002002",
                        "name":"效果评估",
                        "description":"作业效果/历史作业指令/效果评估",
                        "pid":13,
                        "remark":"接口",
                        "sortNum":0,
                        "id":53,
                        "is_button":2,
                        "url":"/operatingHistory/assess",
                        "child":[

                        ]
                    }
                ]
            },
            {
                "ename":"assess",
                "code":"103003",
                "name":"评估结果",
                "description":"作业效果/评估结果",
                "pid":3,
                "remark":"二级菜单",
                "sortNum":0,
                "id":14,
                "is_button":0,
                "url":"",
                "child":[
                    {
                        "ename":"",
                        "code":"103003001",
                        "name":"列表展示查询",
                        "description":"作业效果/评估结果/分页列表+条件查询",
                        "pid":14,
                        "remark":"接口",
                        "sortNum":0,
                        "id":54,
                        "is_button":2,
                        "url":"/situationAssess/list",
                        "child":[

                        ]
                    },
                    {
                        "ename":"",
                        "code":"103003002",
                        "name":"结果比对",
                        "description":"作业效果/评估结果/结果比对",
                        "pid":14,
                        "remark":"接口",
                        "sortNum":0,
                        "id":55,
                        "is_button":2,
                        "url":"/situationAssess",
                        "child":[

                        ]
                    }
                ]
            }
        ]
    },
    {
        "ename":"manage",
        "code":"104",
        "name":"信息管理",
        "description":"信息管理",
        "pid":0,
        "remark":"一级菜单",
        "sortNum":0,
        "id":4,
        "is_button":0,
        "url":"",
        "child":[
            {
                "ename":"equipment",
                "code":"104001",
                "name":"装备器材",
                "description":"信息管理/装备器材",
                "pid":4,
                "remark":"二级菜单",
                "sortNum":0,
                "id":15,
                "is_button":0,
                "url":"",
                "child":[
                    {
                        "ename":"",
                        "code":"104001001",
                        "name":"列表展示查询",
                        "description":"信息管理/装备器材/按条件查询装备器材",
                        "pid":15,
                        "remark":"接口",
                        "sortNum":0,
                        "id":56,
                        "is_button":2,
                        "url":"/equipment/selectEquipment",
                        "child":[

                        ]
                    },
                    {
                        "ename":"",
                        "code":"104001002",
                        "name":"添加或修改装备器材",
                        "description":"信息管理/装备器材/添加或修改装备器材",
                        "pid":15,
                        "remark":"接口",
                        "sortNum":0,
                        "id":57,
                        "is_button":2,
                        "url":"/equipment/insertOrUpdateEquipment",
                        "child":[

                        ]
                    },
                    {
                        "ename":"",
                        "code":"104001003",
                        "name":"删除装备器材",
                        "description":"信息管理/装备器材/删除装备器材",
                        "pid":15,
                        "remark":"接口",
                        "sortNum":0,
                        "id":58,
                        "is_button":2,
                        "url":"/equipment/deleteEquipment",
                        "child":[

                        ]
                    }
                ]
            },
            {
                "ename":"workPoint",
                "code":"104002",
                "name":"作业点位",
                "description":"信息管理/作业点位",
                "pid":4,
                "remark":"二级菜单",
                "sortNum":0,
                "id":16,
                "is_button":0,
                "url":"",
                "child":[
                    {
                        "ename":"",
                        "code":"104002001",
                        "name":"列表展示查询",
                        "description":"信息管理/作业点位/作业点位-分页查询",
                        "pid":16,
                        "remark":"接口",
                        "sortNum":0,
                        "id":60,
                        "is_button":2,
                        "url":"/workStationInfo/selectWorkStationInfo",
                        "child":[

                        ]
                    },
                    {
                        "ename":"",
                        "code":"104002003",
                        "name":"添加或修改作业点位",
                        "description":"信息管理/作业点位/添加或修改作业点位",
                        "pid":16,
                        "remark":"接口",
                        "sortNum":0,
                        "id":62,
                        "is_button":2,
                        "url":"/workStationInfo/insertOrUpdateWorkStationInfo",
                        "child":[

                        ]
                    },
                    {
                        "ename":"",
                        "code":"104002004",
                        "name":"删除作业点位信息",
                        "description":"信息管理/作业点位/删除作业点位信息",
                        "pid":16,
                        "remark":"接口",
                        "sortNum":0,
                        "id":63,
                        "is_button":2,
                        "url":"/workStationInfo/deleteWorkStationInfo",
                        "child":[

                        ]
                    }
                ]
            },
            {
                "ename":"userList",
                "code":"104003",
                "name":"用户管理",
                "description":"信息管理/用户管理",
                "pid":4,
                "remark":"二级菜单",
                "sortNum":0,
                "id":17,
                "is_button":0,
                "url":"",
                "child":[
                    {
                        "ename":"",
                        "code":"104003001",
                        "name":"列表展示查询",
                        "description":"信息管理/用户管理/分页列表+条件查询",
                        "pid":17,
                        "remark":"接口",
                        "sortNum":0,
                        "id":64,
                        "is_button":2,
                        "url":"/sysUser/user/list",
                        "child":[

                        ]
                    },
                    {
                        "ename":"",
                        "code":"104003004",
                        "name":"新增用户",
                        "description":"信息管理/用户管理/新增用户",
                        "pid":17,
                        "remark":"接口",
                        "sortNum":0,
                        "id":67,
                        "is_button":2,
                        "url":"/sysUser/user/insert",
                        "child":[

                        ]
                    },
                    {
                        "ename":"",
                        "code":"104003005",
                        "name":"修改用户",
                        "description":"信息管理/用户管理/修改用户",
                        "pid":17,
                        "remark":"接口",
                        "sortNum":0,
                        "id":68,
                        "is_button":2,
                        "url":"/sysUser/user/update",
                        "child":[

                        ]
                    },
                    {
                        "ename":"",
                        "code":"104003006",
                        "name":"重置密码",
                        "description":"信息管理/用户管理/重置密码",
                        "pid":17,
                        "remark":"接口",
                        "sortNum":0,
                        "id":69,
                        "is_button":2,
                        "url":"/sysUser/user/resetPwd",
                        "child":[

                        ]
                    },
                    {
                        "ename":"",
                        "code":"104003007",
                        "name":"删除用户",
                        "description":"信息管理/用户管理/删除用户",
                        "pid":17,
                        "remark":"接口",
                        "sortNum":0,
                        "id":70,
                        "is_button":2,
                        "url":"/sysUser/user/delete",
                        "child":[

                        ]
                    }
                ]
            },
            {
                "ename":"roleManage",
                "code":"104004",
                "name":"角色管理",
                "description":"信息管理/角色管理",
                "pid":4,
                "remark":"二级菜单",
                "sortNum":0,
                "id":18,
                "is_button":0,
                "url":"",
                "child":[
                    {
                        "ename":"",
                        "code":"104004001",
                        "name":"列表展示查询",
                        "description":"信息管理/角色管理/分页列表+条件查询",
                        "pid":18,
                        "remark":"接口",
                        "sortNum":0,
                        "id":71,
                        "is_button":2,
                        "url":"/role/findAllRoleList",
                        "child":[

                        ]
                    },
                    {
                        "ename":"",
                        "code":"104004002",
                        "name":"新增角色",
                        "description":"信息管理/角色管理/新增角色",
                        "pid":18,
                        "remark":"接口",
                        "sortNum":0,
                        "id":72,
                        "is_button":2,
                        "url":"/role/insertRole",
                        "child":[

                        ]
                    },
                    {
                        "ename":"",
                        "code":"104004003",
                        "name":"修改角色",
                        "description":"信息管理/角色管理/修改角色",
                        "pid":18,
                        "remark":"接口",
                        "sortNum":0,
                        "id":73,
                        "is_button":2,
                        "url":"/role/updateRole",
                        "child":[

                        ]
                    },
                    {
                        "ename":"",
                        "code":"104004004",
                        "name":"删除角色",
                        "description":"信息管理/角色管理/删除角色",
                        "pid":18,
                        "remark":"接口",
                        "sortNum":0,
                        "id":74,
                        "is_button":2,
                        "url":"/role/deleteRoleById",
                        "child":[

                        ]
                    },
                    {
                        "ename":"",
                        "code":"104004007",
                        "name":"修改操作权限",
                        "description":"信息管理/角色管理/修改操作权限",
                        "pid":18,
                        "remark":"接口",
                        "sortNum":0,
                        "id":77,
                        "is_button":2,
                        "url":"/permission/addRolePermissionBatch",
                        "child":[

                        ]
                    }
                ]
            },
            {
                "ename":"password",
                "code":"104005",
                "name":"修改密码",
                "description":"信息管理/修改密码",
                "pid":4,
                "remark":"二级菜单",
                "sortNum":0,
                "id":19,
                "is_button":0,
                "url":"",
                "child":[
                    {
                        "ename":"",
                        "code":"104005001",
                        "name":"修改密码",
                        "description":"信息管理/修改密码/修改密码",
                        "pid":19,
                        "remark":"接口",
                        "sortNum":0,
                        "id":79,
                        "is_button":2,
                        "url":"/sysUser/user/updatePwd",
                        "child":[

                        ]
                    }
                ]
            }
        ]
    }
]