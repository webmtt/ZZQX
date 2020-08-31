import router from './router';
import store from './store'
import { resetTokenAndClearUser } from './utils'
import { LoadingBar } from 'iview'

function getAllMenus (arr, menus) {
    menus.forEach(item => {
        if (item.ename) {
            if (item.child) {
                getAllMenus(arr, item.child)
            }
            arr.push(item.ename);
        }
    });
}

// 是否有菜单数据
let hasMenus = false
router.beforeEach(async (to, from, next) => {
    LoadingBar.start()
    if (localStorage.getItem('token')) {
        if (to.path === '/login') {
            next({path: '/'})
        } else {
            if (hasMenus) {
                next()
            } else {
                try {
                    // 请求后台数据来生成路由
                    const userMenus = await store.dispatch('getUserPermission', localStorage.getItem('roleId'));
                    const result = [];
                    getAllMenus(result, userMenus)
                    const accessRoutes = await store.dispatch('permission/generateRoutes', result);
                    console.log(accessRoutes)
                    router.addRoutes(accessRoutes)
                    hasMenus = true
                    next({path: to.path || '/'})
                } catch (error) {
                    resetTokenAndClearUser()
                    next(`/login?redirect=${to.path}`)
                }
            }
        }
    } else {
        hasMenus = false
        if (to.path === '/login') {
            next();
        } else {
            next(`/login?redirect=${to.path}`)
        }
    }
})

router.afterEach(() => {
    LoadingBar.finish()
})
