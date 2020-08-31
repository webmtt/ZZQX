import Vue from 'vue';
import App from './App';
import moment from 'moment';
import router from './router';
import store from './store';
// vuebus事件总线来处理一些地图交互;
import vueBus from './eventBus.js';
import './permission';
import './utils/btnPermission'
// 使用element ui;
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// 引入iview;
import iView from 'iview';
import 'iview/dist/styles/iview.css';
// 引入公共样式
import '@/assets/css/public.css'

// 将axios的封装作为vue的全局方法;
import * as api from './api'
Vue.prototype.$api = api;
import eventTypes from './config/eventTypes.js'
import mapConfig from './config/mapConfig.js'
Vue.prototype.$eventTypes = eventTypes;
Vue.prototype.$mapConfig = mapConfig;
Vue.prototype.$moment = moment;

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(iView);
Vue.use(vueBus);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
