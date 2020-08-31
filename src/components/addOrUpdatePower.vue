<template>
    <Modal :mask-closable="false" :closable="false" :z-index="10" v-model="show" :title="title">
        <div style="height: 300px; overflow: hidden;">
            <el-scrollbar style="height: 100%;">
                <Tree ref="treeObj" :data="treeDatas" show-checkbox></Tree>
            </el-scrollbar>
        </div>
        <template #footer>
            <i-button :disabled="loading" type="primary" @click="closeModal">取消</i-button>
            <i-button :loading="loading" type="primary" @click="updatePower">保存</i-button>
        </template>
    </Modal>
</template>

<script>
    export default {
        data () {
            return {
                loading: false,
                treeDatas: [],
                show: this.modalData.show,
                title: '权限分配',
            }
        },
        computed: {
            selectedPowerIds() {
                if (this.$refs.treeObj) {
                    return this.$refs.treeObj.getCheckedAndIndeterminateNodes().filter(item => item.id).map(item => item.id);
                }
                return [];
            }
        },
        watch: {
            modalData(newValue) {
                this.show = newValue.show;
                this.treeDatas = this.modalData.data;
            }
        },
        components: {},
        props: ['modalData'],
        methods: {
            /**
             * @method closeModal
             * 关闭模态框
             */
            closeModal() { this.show = false; },
            /**
             * @method updatePower
             * 分配权限
             */
            updatePower() {
                this.$api.updatePower({ roleId: this.modalData.rowId, permissionIds: this.selectedPowerIds })
                .then(res => {
                    this.$Message.success('权限分配成功');
                })
                .finally(res => {
                    this.show = false;
                    this.loading = false
                });
            }
        },
        mounted() {}
    }
</script>
