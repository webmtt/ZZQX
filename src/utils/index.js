import { resetRouter } from '../router';


// 将菜单信息转成对应的路由信息 动态添加
export function generateRoutes(routes) {
    const res = [];
    routes.forEach(route => {
        const tmp = { ...route };
        if (tmp.children) {
            tmp.children = generateRoutes(tmp.children)
        }
        res.push(tmp)
    })

    return res
}
// export function menusToRoutes() {// data
//     const result = []
//     const children = []

//     result.push({
//         path: '/',
//         component: () => import('../pages/Index.vue'),
//         children
//     })

//     data.forEach(item => {
//         generateRoutes(children, item)
//     })

//     children.push({
//         path: '/error',
//         name: 'error',
//         component: () => import('../pages/Error.vue')
//     })

//     // 最后添加404页面 否则会在登陆成功后跳到404页面
//     result.push(
//         {path: '*', redirect: '/error'},
//     )

//     return result
// }

export function resetTokenAndClearUser() {
    // 退出登陆 清除用户资料
    localStorage.setItem('token', '')
    localStorage.setItem('roleId', '')
    localStorage.setItem('userName', '')
    // 重设路由
    resetRouter()
}
