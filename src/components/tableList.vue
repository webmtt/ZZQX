<template>
    <div class="tableList">
        <!-- 数据表格 -->
        <el-table ref="multipleDownTable" :empty-text="emptyString" @current-change="singleSelected" highlight-current-row :row-style="{height:'20px', fontSize: '12px'}" :height="tableHeight" :data="dataList" tooltip-effect="dark" border @select="handleSelectionChange" @select-all="handleSelectionAll">
             <!-- 是否显示复选框 -->
            <el-table-column v-if="showHeader" type="selection" width="50" fixed="left" align="center"></el-table-column>
            <!-- 是否显示索引 -->
            <el-table-column v-if="showIndex" type="index" width="49" label="序号"></el-table-column>
            <template v-for="(item,index) in headerData">
                <el-table-column :width="item.width" :label="item.label" :sortable="item.sortable ? item.sortable : false" :prop="item.prop" show-overflow-tooltip :key="index" align="center"></el-table-column>
            </template>
            <!-- 自定义列 -->
            <slot name="deleteColoum"></slot>
        </el-table>

      <!-- 分页组件 -->
        <!-- <el-pagination
            v-if="dataList.length"
            :current-page="currentPage"
            :page-sizes="[15]"
            :page-size="pageSize"
            :total="total"
            style="display: flex;justify-content: flex-end;padding: 5px 20px;"
            header-row-class-name="color"
            layout="total, prev, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange">
        </el-pagination> -->
    </div>
</template>

<script>
export default {
    data(){
        return {
            currentPage: 1,
        };
    },
    props: {
        tableHeight: { type: Number, default: 300 },
        showHeader: { type: Boolean, default: false },
        showIndex: { type: Boolean, default: true },
        pageSize: { type: Number, default: 15 },
        total: { type: Number, default: 0 },
        dataList: { type: Array, default: () => [] },
        headerData: { type: Array, default: () => [] },
        loading:  { type: Boolean, default: false },
        emptyString: { type: String, default: '' },
    },
    computed: {},
    watch: {
        // 数据变化后初始化滚动条位置;
        dataList(newValue) {
            this.$refs.multipleDownTable.bodyWrapper.scrollTop = 0;
        }
    },
    methods: {
        // 表格单选事件;
        singleSelected(val) {
            if (!val) return;
            this.$bus.emit(this.$eventTypes.TABLELINESELECTED, val);
        },
        /**
         * 点击页码监听函数
         * @method handleCurrentChange
         */
        handleCurrentChange(currentPage) {
            this.currentPage = currentPage;
            const start = (this.currentPage - 1) * this.pageSize;
        },
        handleSizeChange(pageSize) {
            const start = (this.currentPage - 1) * this.pageSize;
        },
        handleSelectionAll(selection){
            this.$emit('selectChange', selection);
        },
        handleSelectionChange(selection) {
            this.$emit('selectChange', selection);
        },
        indexMethod(index) {
            return (this.currentPage - 1) * this.pageSize + 1 + index;
        }
    },
    mounted() {}
}
</script>

