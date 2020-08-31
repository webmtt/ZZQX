<template>
    <div ref="userList" class="userList"  style="padding: 10px 10px 0 10px">
        <Spin size="large" fix v-if="loading">加载中...</Spin>
        <i-form :model="serachCondtion" inline :label-width="80" style="padding-top:15px">
            <Form-item prop="name" label="用户名：">
                <i-input search type="text" v-model="serachCondtion.name" placeholder="用户名"></i-input>
            </Form-item>
            <Form-item :label-width="0" style="margin-left: 30px;">
                <i-button type="primary" v-has="'/sysUser/user/list'" @click="search">查询</i-button>
                <i-button type="primary" v-has="'/sysUser/user/insert'" @click="openModal('insert')">新增</i-button>
            </Form-item>
        </i-form>
        <Table ref="workResultTable" :height="tableHeight" border stripe :columns="columns1" :data="tableData"></Table>
        <br>
        <Page style="text-align: right;padding-bottom: 20px;position: absolute;bottom: 20px;right: 14px;" :total="total" :page-size="serachCondtion.pageSize" :page-size-opts="[10,15,20,50]" :current.sync="serachCondtion.pageNum" @on-change="pageChanged" @on-page-size-change="pageOptionChanged" show-elevator show-sizer show-total />
        <!-- 编辑新增的模modalData态框 -->
        <add-or-update-user class="inPageModal" @handleSucc="searchUserResult" :modalData="modalOption"></add-or-update-user>
    </div>
</template>

<script>

import axios from 'axios';
import addOrUpdateUser from '@/components/addOrUpdateUser';
export default {
    name: 'workResultPart',
    data() {
        return {
            loading: false,
            total: 0,
            modalOption: {
                show: false,
                data: null
            },
            currentHandleData: null,
            tableHeight: 300,
            serachCondtion: {
                name: '', // 站点名称
                pageSize: 10, // 每页显示个数
                pageNum: 1
            },
            columns1: [
                    {
                        type: 'index',
                        title: '序号',
                        width: 70,
                        align: 'center',
                        // fixed: 'left',
                        indexMethod: this.getPageIndex
                    },
                    {
                        title: '用户名',
                        key: 'userName',
                        tooltip: true,
                        width: (window.innerWidth-600)/7
                    },
                    {
                        title: '真实姓名',
                        key: 'name',
                        width: (window.innerWidth-595)/7
                    },
                    {
                        title: '角色',
                        key: 'realName',
                        width: (window.innerWidth-590)/7
                    },
                    {
                        title: '站点',
                        key: 'workStationCode',
                        width: (window.innerWidth-550)/7
                    },
                    {
                        title: '电话',
                        key: 'phone',
                        width: (window.innerWidth-550)/7
                    },
                    {
                        title: '状态',
                        key: 'status',
                        render: (h, params) => {
                            return h('div', [
                                h('span', {}, ['作废', '正常', '锁定'][params.row.status])
                            ]);
                        },
                        width: (window.innerWidth-550)/7
                    },
                    {
                        title: '创建时间',
                        key: 'createTime',
                        width: (window.innerWidth-550)/7
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        width: 260,
                        // fixed: 'right',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: { type: 'primary' },
                                    style: { marginRight: '5px' },
                                    on: {
                                        click: () => this.openModal('update', params)
                                    },
                                    directives: [{
                                        name: 'has',
                                        value: '/sysUser/user/update'
                                    }]
                                }, '编辑'),
                                h('Button', {
                                    props: { type: 'error' },
                                    style: { marginRight: '5px' },
                                    on: {
                                        click: () => this.deleteData(params)
                                    },
                                    directives: [{
                                        name: 'has',
                                        value: '/sysUser/user/delete'
                                    }]
                                }, '废除'),
                                h('Button', {
                                    props: { type: 'info' },
                                    on: {
                                        click: () => this.resetPwd(params)
                                    },
                                    directives: [{
                                        name: 'has',
                                        value: '/sysUser/user/resetPwd'
                                    }]
                                }, '重置密码')
                            ]);
                        }
                    },
                ],
                tableData: []
        }
    },
    components: {addOrUpdateUser},
    methods: {
        getPageIndex(row) {
            return (this.serachCondtion.pageNum - 1) * this.serachCondtion.pageSize + row._index + 1;
        },
        beginTiemChange(val) {
            this.serachCondtion.begintime = val;
        },
        search() {
            this.serachCondtion.pageNum = 1;
            this.searchUserResult();
        },
        searchUserResult() {
            this.loading = true;
            return this.$api.getUserList(this.serachCondtion)
                .then(res => {
                    this.total = res.data.total;
                    this.tableData = res.data.list;
                })
                .catch(error => {
                    this.total = 0;
                    this.tableData = [];
                })
                .finally(() => this.loading = false);
        },
        pageChanged() {
            this.searchUserResult();
        },
        pageOptionChanged(val) {
            this.serachCondtion.pageSize = val;
            this.searchUserResult();
        },
        openModal(flag, rowParam) {
            this.modalOption = { show: true, data: rowParam }
        },
        deleteData(rowParam) {
            this.$Modal.confirm({
                title: '提示',
                content: '<p>确定要废除吗？</p>',
                loading: true,
                onOk: () => {
                    this.$api.deleteUserByUserName({ userName: rowParam.row.userName })
                        .then(res => {
                            this.$Modal.remove();
                            this.$Message.success('废除成功');
                            this.searchUserResult();
                        })
                },
                onCancel: () => {}
            });
        },
        resetPwd(rowParam) {
            this.$Modal.confirm({
                title: '提示',
                content: '<p>确定要重置密码吗？</p>',
                loading: true,
                onOk: () => {
                    this.$api.resetUserPassword({ userName: rowParam.row.userName })
                        .then(res => {
                            this.$Modal.remove();
                            this.$Message.success('密码重置成功');
                        })
                },
                onCancel: () => {}
            });
        }
    },
    mounted() {
        this.tableHeight = this.$refs.userList.offsetHeight - 230;
        this.searchUserResult();
    }
}
</script>

<style scoped>
    .userList {
        display: flex;
        height: 100%;
        flex-direction: column;
        background-color: #1D2437;
    }
</style>