<template>
    <div ref="userList" class="userList"  style="padding: 10px 10px 0 10px">
        <Spin size="large" fix v-if="loading">加载中...</Spin>
        <i-form :model="serachCondtion" inline :label-width="80" style="padding-top:15px">
            <Form-item prop="name" label="角色名称：">
                <i-input search type="text" v-model="serachCondtion.name" placeholder="角色名称"></i-input>
            </Form-item>
            <Form-item :label-width="0" style="margin-left: 30px;">
                <i-button type="primary" v-has="'/role/findAllRoleList'" @click="search">查询</i-button>
                <i-button type="primary" v-has="'/role/insertRole'" @click="openModal('insert')">新增</i-button>
            </Form-item>
        </i-form>
        <Table ref="workResultTable" :height="tableHeight" border stripe :columns="columns1" :data="tableData"></Table>
        <br>
        <Page style="text-align: right;padding-bottom: 20px;position: absolute;bottom: 20px;right: 14px;" :total="total" :page-size="serachCondtion.pageSize" :page-size-opts="[10,15,20,50]" :current.sync="serachCondtion.pageNum" @on-change="pageChanged" @on-page-size-change="pageOptionChanged" show-elevator show-sizer show-total />
        <!-- 编辑新增的模modalData态框 -->
        <add-or-update-role class="inPageModal" @handleSucc="searchRoleResult" :modalData="modalOption"></add-or-update-role>
        <!-- 分配权限的模modalData态框 -->
        <add-or-update-power class="inPageModal" :modalData="powerModalOption"></add-or-update-power>
    </div>
</template>

<script>

import axios from 'axios';
import addOrUpdateRole from '@/components/addOrUpdateRole';
import addOrUpdatePower from '@/components/addOrUpdatePower';
export default {
    name: 'workResultPart',
    data() {
        return {
            loading: false,
            total: 0,
            currentRoleIds: [],
            modalOption: {
                show: false,
                data: null
            },
            powerModalOption: {
                show: false,
                data: null,
                roleId: ''
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
                        title: '角色名称',
                        key: 'name',
                        tooltip: true,
                        width: (window.innerWidth-590)/3,
                    },
                    {
                        title: '角色描述',
                        key: 'description',
                        width: (window.innerWidth-550)/3
                    },
                    {
                        title: '创建时间',
                        key: 'createTime',
                        width: (window.innerWidth-580)/3,
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
                                        click: () => this.openAssignPowerModal('update', params)
                                    },
                                    directives: [{
                                        name: 'has',
                                        value: '/permission/addRolePermissionBatch'
                                    }]
                                }, '菜单权限'),
                                h('Button', {
                                    props: { type: 'primary' },
                                    style: { marginRight: '5px' },
                                    on: {
                                        click: () => this.openModal('update', params)
                                    },
                                    directives: [{
                                        name: 'has',
                                        value: '/role/updateRole'
                                    }]
                                }, '编辑'),
                                h('Button', {
                                    props: { type: 'error' },
                                    on: {
                                        click: () => this.deleteData(params)
                                    },
                                    directives: [{
                                        name: 'has',
                                        value: '/role/deleteRoleById'
                                    }],
                                }, '删除')
                            ]);
                        }
                    },
                ],
                tableData: []
        }
    },
    components: {addOrUpdateRole, addOrUpdatePower},
    methods: {
        getPageIndex(row) {
            return (this.serachCondtion.pageNum - 1) * this.serachCondtion.pageSize + row._index + 1;
        },
        beginTiemChange(val) {
            this.serachCondtion.begintime = val;
        },
        getData() {
            this.serachCondtion.pageNum = 1;
            this.searchRoleResult();
        },
        searchRoleResult() {
            this.loading = true;
            return this.$api.getAllRoleList(this.serachCondtion)
                .then(res => {
                    this.total = res.data.total;
                    res.data.list.forEach(item => item.createTime = this.$moment(item.createTime).format('YYYY-MM-DD HH:mm:ss'));
                    this.tableData = res.data.list;
                })
                .catch(error => {
                    this.total = 0;
                    this.tableData = [];
                })
                .finally(() => this.loading = false);
        },
        pageChanged() {
            this.searchRoleResult();
        },
        search() {
            this.serachCondtion.pageNum = 1;
            this.searchRoleResult();
        },
        pageOptionChanged(val) {
            this.serachCondtion.pageSize = val;
            this.searchRoleResult();
        },
        openModal(flag, rowParam) {
            this.modalOption = { show: true, data: rowParam }
        },
        generateTreeData(obj, data) {
            if (data.length) {
                data.forEach((item, index) => {
                    obj[index] = { title: item.name, id: item.id, pid: item.pid, expand: false };
                    if (item.child.length) {
                        obj[index].children = [];
                        this.generateTreeData(obj[index].children, item.child);
                    } else {
                        obj[index].checked = this.currentRoleIds.includes(item.id);
                    }
                });
            }
        },
        getUserPermissionIds(arr, data) {
            data.forEach(item => {
                arr.push(item.id);
                if (item.child) {
                    this.getUserPermissionIds(arr, item.child);
                }
            });
        },
        openAssignPowerModal(flag, rowParam) {
            this.currentRoleIds = [];
            this.$api.getPowersByRoleId({ roleId: rowParam.row.id })
            .then(res => {
                this.getUserPermissionIds(this.currentRoleIds, res.data)
                this.$api.getAllPower()
                .then(result => {
                    const treeData = [{ title: '所有权限', expand: true, children: []}];
                    this.generateTreeData(treeData[0].children, result.data);
                    this.powerModalOption = { show: true, data: treeData, rowId: rowParam.row.id }
                });
            });
        },
        deleteData(rowParam) {
            this.$Modal.confirm({
                title: '提示',
                content: '<p>确定要删除吗？</p>',
                loading: true,
                onOk: () => {
                    this.$api.deleteRoleById({ id: rowParam.row.id })
                        .then(res => {
                            this.$Modal.remove();
                            this.$Message.success('删除成功');
                            this.searchRoleResult();
                        })
                        .catch(err => {
                            this.$Modal.remove();
                        });
                },
                onCancel: () => {}
            });
        }
    },
    mounted() {
        this.tableHeight = this.$refs.userList.offsetHeight - 230;
        this.searchRoleResult();
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