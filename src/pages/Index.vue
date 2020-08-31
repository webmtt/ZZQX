<template>
    <div class="index-vue">
        <!-- 侧边栏 -->
        <aside v-show="isShowAsideTitle" :class="asideClassName">
            <!-- logo -->
            <div class="logo-c">
                <span v-show="isShowAsideTitle">郑州气象局人影作业指挥系统</span>
            </div>
            <!-- 菜单栏 -->
            <Menu ref="asideMenu" theme="light" style="z-index:auto;background-color: #262e43;color:#dcf0ff;" width="100%" @on-select="gotoPage"
            accordion :open-names="openMenus" :active-name="currentPage" @on-open-change="menuChange">
                <!-- 动态菜单（这里可以写成递归组件，以后有时间再改） -->
                <div v-for="(item, index) in menuItems" :key="index">
                    <template v-if="!item.hidden">
                        <!--<template v-if="item.children && item.children.length > 1">-->
                        <template v-if="item.children">
                            <Submenu :name="item.name">
                                <template v-if="item.meta && item.name" slot="title">
                                    <Icon :size="18" :type="item.meta.icon"/>
                                    <span v-show="isShowAsideTitle">{{item.meta.title}}</span>
                                </template>
                                <div v-for="(subItem, i) in item.children" :key="index + i">
                                    <MenuItem style="background:#262e43;" v-show="isShowAsideTitle" :name="item.path+'/'+subItem.path">
                                        <Icon :size="16" :type="subItem.meta.icon"/>
                                        <span style="color:#dcf0ff;" v-show="isShowAsideTitle">{{subItem.meta.title}}</span>
                                    </MenuItem>
                                </div>
                            </Submenu>
                        </template>
                        <MenuItem v-else :name="item.path">
                            <Icon :size="18" :type="item.meta.icon" />
                            <span v-show="isShowAsideTitle">{{item.meta.title}}</span>
                        </MenuItem>
                    </template>
                </div>
            </Menu>
        </aside>
        <!-- 右侧部分 -->
        <section class="sec-right">
            <!-- 头部 -->
            <div class="top-c">
                <header>
                    <div class="h-left">
                        <div class="pointer" @click="isShrinkAside" title="收缩/展开">
                            <Icon type="ios-apps" />
                        </div>
                        <!-- 面包屑功能 -->
                        <p class="crumbs">{{crumbs}}</p>
                    </div>
                    <div class="h-right">
                        <!-- 消息 -->
                        <!-- <div class="notice-c" @click="info" title="查看新消息">
                            <div :class="{newMsg: hasNewMsg}"></div>
                            <Icon type="ios-notifications-outline" />
                        </div> -->
                        <!-- 用户头像 -->
                        <!-- <div class="user-img-c">
                            <img :src="userImg">
                        </div> -->
                        <!-- 下拉菜单 -->
                        <Dropdown trigger="click" @on-click="userOperate" @on-visible-change="showArrow">
                            <div class="pointer">
                                <span>{{userName}}</span>
                                <Icon v-show="arrowDown" type="md-arrow-dropdown"/>
                                <Icon v-show="arrowUp" type="md-arrow-dropup"/>
                            </div>
                            <DropdownMenu slot="list">
                                <!-- name标识符 -->
                                <!--<DropdownItem v-has-hide="'/sysUser/user/updatePwd'" name="1">修改密码</DropdownItem>-->
                                <DropdownItem  name="1">修改密码</DropdownItem>
                                <DropdownItem divided  name="3">退出登录</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </header>
            </div>
            <!-- 页面主体 -->
            <div class="main-content">
                <div class="view-c">
                    <router-view v-if="isShowRouter"/>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import { resetTokenAndClearUser } from '../utils';
export default {
    name: 'index',
    components: {},
    data () {
        return {
            // 用于储存页面路径
            paths: {},
            // 当前显示页面
            currentPage: '',
            openMenus: [this.$route.path.split('/')[1]], // 要打开的菜单名字 name属性
            hasNewMsg: true, // 是否有新消息
            isShowRouter: true,
            msgNum: '10', // 新消息条数
            arrowUp: false, // 用户详情向上箭头
            arrowDown: true, // 用户详情向下箭头
            isShowAsideTitle: true, // 是否展示侧边栏内容
            main: null, // 页面主要内容区域
            asideClassName: 'aside-big', // 控制侧边栏宽度变化
            asideArrowIcons: [], // 缓存侧边栏箭头图标 收缩时用
            // 面包屑
            crumbs: '',
            userName: '',
            userImg: '',
        }
    },
    created() {},
    mounted() {
        this.currentPage = this.$route.path;
        // 初始化this.path;
        this.menuItems.forEach(item => this.processNameToTitle(item));
        // 初始进入页面设置面包屑
        const routeName = this.$route.path.split('/').pop();
        this.crumbs = routeName === 'error' ? '404' : this.paths[routeName];

        // 设置用户信息
        this.userName = localStorage.getItem('userName')
        this.userImg = localStorage.getItem('userImg')

        this.main = document.querySelector('.sec-right')
        this.asideArrowIcons = document.querySelectorAll('aside .ivu-icon-ios-arrow-down')
        let w = document.documentElement.clientWidth || document.body.clientWidth
        
        window.onresize = () => {
            // 可视窗口宽度太小 自动收缩侧边栏
            if (w < 1300 && this.isShowAsideTitle
                && w > (document.documentElement.clientWidth || document.body.clientWidth)) {
                this.shrinkAside()
            }

            w = document.documentElement.clientWidth || document.body.clientWidth
        }
    },
    watch: {
        $route(to) {
            const name = to.path.split('/').pop();
            this.currentPage = to.path;
            // 更新菜单的状态;
            this.$nextTick(() => {
                this.crumbs = name === 'error' ? '404' : this.paths[name];
                this.$refs.asideMenu.updateOpened();
            });
        }
    },
    computed: {
        // 菜单栏
        menuItems() {
            return this.$store.state.permission.routes;
        },
    },
    methods: {
        // 判断当前标签页是否激活状态
        isActive(name) {
            return this.$route.name === name;
        },

        // 跳转页面 路由名称和参数
        gotoPage(path, params) {
            this.$router.replace({ path, params });
        },

        // 用户操作
        userOperate(name) {
            switch(name) {
                case '1':
                    // 修改密码
                    this.gotoPage('/manage/password')
                    break
                case '2':
                    // 基本资料
                    this.gotoPage('userinfo')
                    break
                case '3':
                    resetTokenAndClearUser()
                    this.$router.replace({name: 'login'})
                    break
            }
        },

        // 控制用户三角箭头显示状态
        showArrow(flag) {
            this.arrowUp = flag
            this.arrowDown = !flag
        },

        // 判断
        isShrinkAside() {
            this.isShowAsideTitle? this.shrinkAside() : this.expandAside();
            // 收缩后重新计算地图视口大小;
            setTimeout(() => {
                this.$store.state.pieSatMap && this.$store.state.pieSatMap.updateSize();
            }, 200);
        },

        // 收缩
        shrinkAside() {
            this.asideArrowIcons.forEach(e => {
                e.style.display = 'none'
            })
            this.isShowAsideTitle = false
            this.$nextTick(() => {
                this.$refs.asideMenu.updateOpened()
            })
            setTimeout(() => {
                this.asideClassName =''
                this.main.style.width = 'calc(100% - 80px)'
            }, 0)
        },

        // 展开
        expandAside() {
            setTimeout(() => {
                this.isShowAsideTitle = true
                this.asideArrowIcons.forEach(e => {
                    e.style.display = 'block'
                })
                this.$nextTick(() => {
                    this.$refs.asideMenu.updateOpened()
                })
            }, 200)
            this.asideClassName = 'aside-big'
            this.main.style.width = 'calc(100% - 220px)'
        },

        // 消息通知
        info() {
            const self = this
            this.$Notice.info({
                title: `您有${this.msgNum}条消息`,
                render(h) {
                    return h('Button', {
                        attrs: {
                            type: 'info',
                            size: 'small'
                        },
                        on: {
                            click() {
                                // 点击查看跳转到消息页
                                self.gotoPage('msg')
                                self.hasNewMsg = false,
                                self.msgNum = 0
                            }
                        }
                    }, [
                        '点击查看',
                    ])
                }
            })
        },
        // 菜单栏改变事件
        menuChange(data) {
            this.openMenus = data;
        },
        processNameToTitle(data, text) {
            if (data.meta && data.meta.roleMenuName) {
                this.paths[data.meta.roleMenuName] = text? `${text} / ${data.meta.title}` : data.meta.title;
            }
            if (data.children) {
                data.children.forEach(e => {
                    this.processNameToTitle(e, text? `${text} / ${data.meta.title}` : data.meta.title);
                })
            }
        }
    }
}
</script>

<style scoped>
.index-vue {
    height: 100%;
    display: flex;
    justify-content: space-between;
    color: #666;
}
/* 侧边栏 */
aside {
    min-width: 80px;
    background: #262e43;
    height: 100%;
    transition: all .5s;
    overflow: auto;
}
.logo-c {
    display: flex;
    align-items: center;
    background-color: #1f74f1;
    color: #f5f8ff;
    font-size: 16px;
    height: 70px;
    justify-content: center;
}
.logo {
    width: 40px;
    margin-right: 10px;
}
.aside-big {
    min-width: 220px;
}
/* 主体页面 */
.sec-right {
    height: 100%;
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: width .5s;
}
/* 主体页面头部 */
.top-c {
    background: rgba(230,230,230,.5);
    width: 100%;
}
header {
    height: 70px;
    border-bottom: none;
    box-shadow: 0 1px 2px 0 rgba(0,0,0,.05);
    background: #2e354f;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 40px;
    padding-left: 10px;
    font-size: 14px;
}
header .ivu-icon {
    font-size: 24px;
}
.refresh-c {
    margin: 0 30px;
    cursor: pointer;
}
.h-right {
    display: flex;
    align-items: center;
}
.h-left {
    display: flex;
    align-items: center;
}
.user-img-c img {
    width: 100%;
}
.notice-c {
    cursor: pointer;
    position: relative;
}
.newMsg {
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #FF5722;
    right: 0;
    top: 0;
}
.user-img-c {
    width: 34px;
    height: 34px;
    background: #ddd;
    border-radius: 50%;
    margin: 0 40px;
    overflow: hidden;
}
.tag-options {
    cursor: pointer;
    position: relative;
}
.div-tags {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.div-icons {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background: #fff;
    height: 34px;
    width: 160px;
    font-size: 18px;
}
/* 标签栏 */
.ul-c {
    height: 34px;
    margin-top: 2px;
    background: #fff;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 0 10px;
    overflow: hidden;
    width: calc(100% - 160px);
}
.ul-c li {
    border-radius: 3px;
    cursor: pointer;
    font-size: 12px;
    height: 24px;
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 3px 5px 2px 3px;
    border: 1px solid #e6e6e6;
}
a {
    color: #666;
    transition: none;
}
.li-a {
    max-width: 80px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.ul-c .ivu-icon {
    margin-left: 6px;
}
.active {
    background: #409eff;
    border: 1px solid #409eff;
}
.active a {
    color: #fff;
}
.active .ivu-icon {
    color: #fff;
}
/* 主要内容区域 */
.main-content {
    overflow: hidden;
    height: 100%;
    width: 100%;
    background: #eee;
}
.view-c {
    position: relative;
    height: 100%;
    background: #1D2437 !important;
}
.pointer {
    cursor: pointer;
    color: #d3dbf8;
}
/* loading */
.loading-c {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    background: rgba(255,255,255,.5);
    display: flex;
    align-items: center;
    justify-content: center;
}
.mask {
    position: fixed;
    background: #eee;
    height: 10px;
    width: 100%;
    top: 85px;
    z-index: 10;
}
.crumbs {
    margin-left: 10px;
    color: #d3dbf8;
    cursor: default;
}
.menu-level-3 .ivu-icon {
    font-size: 18px;
}
</style>
