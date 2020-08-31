/*
 * @Author: your name
 * @Date: 2019-10-10 10:25:11
 * @LastEditTime: 2019-10-24 17:27:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ZZQX\src\utils\btnPermission.js
 */
import Vue from 'vue'
import store from '../store'

/**权限指令**/
const has = Vue.directive('has', {
    inserted: function (el, binding, vnode) {
        // 获取页面按钮权限
        if (!store.state.userInterface.includes(binding.value)) {
            // el.parentNode.removeChild(el);
            el.setAttribute('disabled', true); // 将隐藏没有权限的按钮改为不可用状态;
        }
    }
});

// const hasHide = Vue.directive('hasHide', {
//     inserted: function (el, binding, vnode) {
//         // 获取页面按钮权限
//         if (!store.state.userInterface.includes(binding.value)) {
//             el.parentNode.removeChild(el);
//         }
//     }
// });

export {has, hasHide}
