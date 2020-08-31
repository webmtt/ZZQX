import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export const commonRoutes = [
    {
        path: '/login',
        name: 'login',
        hidden: true,
        component: () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? import('../pages/Login.vue') :  import('../pages/Login_.vue')
    },
    {
        path: '/phoneLogin',
        name: 'phoneLogin',
        hidden: true,
        component: () => import('../pages/phoneLogin.vue')
    },
    {
        path: '/operationeffect',
        name: 'operationeffect',
        hidden: true,
        component: () => import('../pages/workResult.vue')
    },
    {
        path: '/operationInfo',
        name: 'operationInfo',
        hidden: true,
        component: () => import('../pages/info.vue')
    },
    {
        path: '/error',
        name: 'error',
        hidden: true,
        component: () => import('../pages/Index.vue'),
        meta: { title: '404' },
        children: [
            {
                path: '',
                component: () => import('../pages/Error.vue'),
            }
        ]
    },
    { path: '/', hidden: true, redirect: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? '/phoneLogin' :  '/command/area' },
    { path: '/workResult', hidden: true, redirect: '/operationeffect' },
    { path: '/workInfo', hidden: true, redirect: '/operationInfo' },
];

// 前端全量路由配置,需要根据后端返回的用户菜单权限动态筛选然后动态添加路由;
export const dynamicRoutes = [
    // 数据分析;
    {
        path: '/weather',
        name: 'weather',
        component: () => import('../pages/Index.vue'),
        redirect: '/weather/rain',
        meta: { title: '天气识别', icon: 'md-sunny', roleMenuName: 'weather' },
        children: [
            {
                path: 'rain',
                name: 'rain',
                meta: { title: '实时雨情', icon: 'md-rainy', roleMenuName: 'rain' },
                component: () => import('../views/mainMap.vue'),
                children: [
                    {
                        path: '',
                        component: () => import('../views/weather/rain.vue'),
                    }
                ]
            },
            {
                path: 'radar',
                name: 'radar',
                meta: { title: '雷达数据', icon: 'ios-radio-outline', roleMenuName: 'radar' },
                component: () => import('../views/mainMap.vue'),
                children: [
                    {
                        path: '',
                        component: () => import('../views/weather/radar.vue'),
                    }
                ]
            },
            {
                path: 'forecast',
                name: 'forecast',
                meta: { title: '预报产品', icon: 'md-git-merge', roleMenuName: 'forecast' },
                component: () => import('../views/mainMap.vue'),
                children: [
                    {
                        path: '',
                        component: () => import('../views/weather/forecast.vue'),
                    }
                ]
            },
            {
                path: 'meteorological',
                name: 'meteorological',
                meta: { title: '卫星云图', icon: 'ios-planet', roleMenuName: 'meteorological' },
                component: () => import('../views/mainMap.vue'),
                children: [
                    {
                        path: '',
                        component: () => import('../views/weather/meteorological.vue'),
                    }
                ]
            }
        ]
    },
    // 指令下发;
    {
        path: '/command',
        name: 'command',
        component: () => import('../pages/Index.vue'),
        redirect: '/command/area',
        meta: { title: '指挥决策', icon: 'ios-clipboard-outline', roleMenuName: 'command' },
        children: [
            {
                path: 'area',
                name: 'area',
                component: () => import('../views/mainMap.vue'),
                meta: { title: '作业区域', icon: 'ios-map', roleMenuName: 'area' },
                children: [
                    {
                        path: '',
                        component: () => import('../views/command/area.vue'),
                    }
                ]
            },
            {
                path: 'order',
                name: 'order',
                component: () => import('../views/mainMap.vue'),
                meta: { title: '作业指令', icon: 'md-code-working', roleMenuName: 'order' },
                children: [
                    {
                        path: '',
                        component: () => import('../views/command/order.vue'),
                    }
                ]
            },
            {
                path: 'stove',
                name: 'stove',
                component: () => import('../views/mainMap.vue'),
                meta: { title: '烟炉指令', icon: 'md-battery-full', roleMenuName: 'stove' },
                children: [
                    {
                        path: '',
                        component: () => import('../views/command/stove.vue'),
                    }
                ]
            },
            {
                path: 'pointReport',
                name: 'pointReport',
                // component: () => import('../views/mainMap.vue'),
                meta: { title: '作业点准备情况上报', icon: 'ios-information-circle', roleMenuName: 'pointReport' },
                component: () => import('../views/command/info_.vue'),
            }
        ]
    },
    {
        path: '/work',
        name: 'work',
        component: () => import('../pages/Index.vue'),
        redirect: '/work/assess',
        meta: { title: '作业效果', icon: 'md-apps', roleMenuName: 'work' },
        children: [
            {
                path: 'situation',
                name: 'situation',
                component: () => import('../views/workResult_.vue'),
                meta: { title: '作业情况上报', icon: 'md-cloud-upload', roleMenuName: 'situation' },
            },
            {
                path: 'history',
                name: 'history',
                component: () => import('../views/workResultHistory.vue'),
                meta: { title: '历史作业指令', icon: 'md-time', roleMenuName: 'history' },
            },
            {
                path: 'assess',
                name: 'assess',
                component: () => import('../views/workResultAssess.vue'),
                meta: { title: '评估结果', icon: 'md-analytics', roleMenuName: 'assess' },
            }
        ]
    },
    {
        path: '/manage',
        name: 'manage',
        component: () => import('../pages/Index.vue'),
        redirect: '/manage/assess',
        meta: { title: '信息管理', icon: 'md-cube', roleMenuName: 'manage' },
        children: [
            {
                path: 'equipmentType',
                name: 'equipmentType',
                component: () => import('../views/equipmentType.vue'),
                meta: { title: '装备信息', icon: 'ios-briefcase', roleMenuName: 'equipmentType' },
            },
            // {
            //     path: 'equipmentInfo',
            //     name: 'equipmentInfo',
            //     component: () => import('../views/equipmentInfo.vue'),
            //     meta: { title: '装备信息', icon: 'ios-information-circle', roleMenuName: 'equipmentInfo' },
            // },
            {
                path: 'consumablesType',
                name: 'consumablesType',
                component: () => import('../views/consumablesType.vue'),
                meta: { title: '器材信息', icon: 'md-hammer', roleMenuName: 'consumablesType' },
            },
            // {
            //     path: 'consumablesInfo',
            //     name: 'consumablesInfo',
            //     component: () => import('../views/consumablesInfo.vue'),
            //     meta: { title: '器材信息', icon: 'md-git-merge', roleMenuName: 'consumablesInfo' },
            // },
            {
                path: 'workPoint',
                name: 'workPoint',
                component: () => import('../views/workPoint.vue'),
                meta: { title: '作业点位', icon: 'md-radio-button-on', roleMenuName: 'workPoint' },
            },
            {
                path: 'stovePoint',
                name: 'stovePoint',
                component: () => import('../views/stovePoint.vue'),
                meta: { title: '烟炉点位', icon: 'md-flame', roleMenuName: 'stovePoint' },
            },
            {
                path: 'log',
                name: 'log',
                component: () => import('../views/operationLog.vue'),
                meta: { title: '操作日志', icon: 'md-git-merge', roleMenuName: 'log' },
            },
            {
                path: 'userList',
                name: 'userList',
                component: () => import('../views/userList.vue'),
                meta: { title: '用户管理', icon: 'md-people', roleMenuName: 'userList' },
            },
            {
                path: 'roleManage',
                name: 'roleManage',
                component: () => import('../views/roleManage.vue'),
                meta: { title: '角色管理', icon: 'md-person-add', roleMenuName: 'roleManage' },
            },
            {
                path: 'password',
                name: 'password',
                component: () => import('../views/password.vue'),
                meta: { title: '修改密码', icon: 'md-lock', roleMenuName: 'password' },
            }
        ]
    }
];

const createRouter = () => new Router({
    routes: commonRoutes
});

const router = createRouter();

export function resetRouter() {
  const newRouter = createRouter();
  // 防止换角色登录导致越权的问题;
  router.matcher = newRouter.matcher;
}

export default router;
