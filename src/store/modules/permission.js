import { dynamicRoutes, commonRoutes } from '@/router';

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roleMenus, route) {
  if (route.name) {
    return roleMenus.includes(route.meta.roleMenuName);
  } else {
    return true;
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roleMenus) {
  const res = [];

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roleMenus, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roleMenus)
      }
      res.push(tmp)
    }
  })

  return res;
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = commonRoutes.concat(routes)
  }
}

const actions = {
    generateRoutes({ commit }, roleMenus) {
        return new Promise(resolve => {
            const accessedRoutes = filterAsyncRoutes(dynamicRoutes, roleMenus);
            // 最后添加404页面 否则会在登陆成功后跳到404页面
            accessedRoutes.push({path: '*', redirect: '/error', hidden: true})
            commit('SET_ROUTES', accessedRoutes);
            resolve(accessedRoutes);
        })
    }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
