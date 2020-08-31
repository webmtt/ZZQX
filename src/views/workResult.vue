<!--
 * @Author: your name
 * @Date: 2019-10-10 10:25:11
 * @LastEditTime: 2019-10-24 12:30:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ZZQX\src\views\workResult.vue
 -->
<template>
    <div ref="workResult" class="workResult" style="padding: 10px 10px 0 10px;background: #FFF;">
        <i-form :model="serachCondtion" ref="searchPart" inline :label-width="80">
            <div style="height: 45px;margin-top: 10px;"><span  style="color: black;font-size: 13px;">站点名称：</span>
            <Form-item prop="name" style="margin-bottom:5px;position: absolute;left: 3px;top: 13px;">
                <i-input type="text" style="width: 270px;background-color: #FFF !important;border: 1px solid #E5E5E5;" v-model="serachCondtion.name" placeholder="站点名称"></i-input>
            </Form-item></div>
            <div style="height: 45px;"><span  style="color: black;font-size: 13px;">开始时间：</span>
            <Form-item style="margin-bottom:5px;position: absolute;left: 3px;top: 59px;">
                <DatePicker @on-change="startTimeRangeChange" :options="options1" type="datetime" placeholder="选择作业开始时间" style="width: 245px;background-color: #FFF;border: 1px solid #E5E5E5;"></DatePicker>
            </Form-item></div>
            <div style="height: 45px;"><span  style="color: black;font-size: 13px;">结束时间：</span>
            <Form-item style="margin-bottom:10px;position: absolute;left: 3px;top: 105px;">
                <DatePicker @on-change="endTimeRangeChange" :options="options2" type="datetime" placeholder="选择作业结束时间" style="width: 245px;background-color: #FFF;border: 1px solid #E5E5E5;"></DatePicker>
            </Form-item></div>
            <Form-item :label-width="0" style="margin-bottom:5px;float:right;margin-right: 0px;">
                <i-button type="primary" v-has="'/situation/select'" @click="search(4)">查询</i-button>
                <i-button type="primary" v-has="'/situation/saveOrUpdate'" @click="openModal('insert')">新增</i-button>
            </Form-item>
        </i-form>
        <Scroll :height="tableHeight" style="width: 100%;" :loading-text="text" :on-reach-bottom="handleReachBottom">
          <Card class="card" style="margin-bottom: 2px" v-for="(data,index) in tableData" :key="index">
            <div slot="title" style="color:black;">
              <span class="icon"></span>
              <span class="icon_"></span>
              {{++index}} {{data.name}}
            </div>
            <div style="display:inline-block;posititon:relative;">
              <div><span style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display:block;">器具类型：{{data.equipmentModel}}</span></div>
              <div>开始时间：<span>{{data.beginTime}}</span></div>
              <div>结束时间：<span>{{data.endTime}}</span></div>
            </div>
            <hr>
            <!--<a href="#" slot="extra" style="top: 10px;">-->
            <div style="float:right;margin-top: -6px;">
            <i-button type="primary" v-has="'/situation/saveOrUpdate'" size="small" @click="openModal('update',data)">编辑</i-button>
            <i-button style="background-color:indianred;border:none;" size="small" type="primary" v-has="'/situation/delete'" @click="deleteData(data)">删除</i-button>
            </div>  
            <!--</a>-->
          </Card>
        </Scroll>
      <!-- 编辑/新增作业结果的模态框 -->
        <work-result-submit class="inPageModal" @handleSucc="search(tableData.length + 1)" :modalData="modalOption"></work-result-submit>
    </div>
</template>

<script>
import axios from 'axios';
import workResultSubmit from '@/components/addOrUpdateWorkResult';

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
                startDate: '', // 起始时间
                endDate: '', // 起始时间
                pageSize: 4, // 每页显示个数
                pageNum: 1
            },
            text:'正在加载中',
            tableData: [],
            options1: {
                disabledDate: date => {
                    if(this.serachCondtion.endDate){
                        let endTime=new Date(this.serachCondtion.endDate).valueOf();
                        return date && (date.valueOf() > endTime)
                    }else{
                        return false
                    }
                }
            },
            options2: {
                disabledDate: date => {
                    if(this.serachCondtion.startDate){
                        let startTime=new Date(this.serachCondtion.startDate).valueOf();
                        return date && (date.valueOf() < startTime)
                    }else{
                        return false
                    }
                }
            },
        }
    },
    methods: {
        /**
         * 动态计算列表的序号;
         * @method getPageIndex
         * @returns {number} 根据pageNum生成当前页数据的序号
         */
        getPageIndex(row) {
            return (this.serachCondtion.pageNum - 1) * this.serachCondtion.pageSize + row._index + 1;
        },

        /**
         * 查询时间段变化的事件监听,获得查询时间段起始和终止参数值;
         * @method timeRangeChange
         * @returns {undefined}
         */
        startTimeRangeChange(val) {
            this.serachCondtion.startDate = val;
        },
        endTimeRangeChange(val) {
            this.serachCondtion.endDate = val;
        },
        handleReachBottom () {
            const pageCount = Math.ceil(this.total / this.serachCondtion.pageSize);
            return new Promise(resolve => {
                if(this.serachCondtion.pageNum + 1 > pageCount) {
                    this.text= '数据已经到底了!';
                    return resolve();
                };
                // 可以不要这个延迟时间，只是为了更好看加载效果
                setTimeout(() => {
                    this.serachCondtion.pageNum++;
                    this.searchWorkResult().finally(() => resolve());
                }, 1000);
            });
        },

        /**
         * 获得效果上报数据结果集
         * @method searchWorkResult
         * @returns {undefined}
         */
        searchWorkResult() {
            this.loading = true;
            return this.$api.getWorkResultData(this.serachCondtion)
                .then(res => {
                    this.total = res.data.total;
                    this.tableData.push(...res.data.list);
                })
                .catch(error => {
                    this.total = 0;
                    this.tableData = [];
                })
                .finally(() => this.loading = false);
        },

        /**
         * 点击查询按钮的从查询从第一页开始的数据
         * @method search
         * @returns {undefined}
         */
        search(num) {
            this.tableData.splice(0);
            this.serachCondtion.pageNum = 1;
            this.serachCondtion.pageSize = num;
            this.searchWorkResult();
        },

        /**
         * 当前查询页发生变化请求当前页的数据
         * @method pageChanged
         * @returns {undefined}
         */
        pageChanged() {
            this.searchWorkResult();
        },

        /**
         * 当前查询页显示数据条数发生变化请求当前页的数据
         * @method pageSizeOptionChanged
         * @returns {undefined}
         */
        pageSizeOptionChanged(val) {
            this.serachCondtion.pageSize = val;
            this.searchWorkResult();
        },

        /**
         * 打开编辑/新增模态框
         * @method opendModal
         * @returns {undefined}
         */
        openModal(flag, rowParam) {
            this.modalOption = { show: true, data: rowParam }
        },

        /**
         * 删除一条数据
         * @method deleteData
         * @returns {undefined}
         */
        deleteData(rowParam) {
            this.$Modal.confirm({
                title: '提示',
                content: '<p>确定要删除吗？</p>',
                loading: true,
                onOk: () => {
                    this.$api.deleteWorkResultData({ id: rowParam.id })
                        .then(res => {
                            this.$Modal.remove();
                            this.$Message.success('删除成功');
                            this.search(4);
                        })
                        .catch(err => {
                            this.$Modal.remove();
                        });
                },
                onCancel: () => {}
            });
        },

        /**
         * 以excel的方式导出当前查询条件下的所有数据
         * @method exoportExcel
         * @returns {undefined}
         */
    },
    components: {workResultSubmit},
    mounted() {
        // 动态计算显示数据表格的高度,目的是固定表头,防止当一页数据量大滚动数据不知道数据列的属性;
        this.tableHeight = this.$refs.workResult.offsetHeight - this.$refs.searchPart.$el.clientHeight;

        this.searchWorkResult();
    }
}
</script>

<style scoped>
  .icon{
    display: inline-block;
    height: 15px;
    width: 2px;
    background: #0766EF;
    vertical-align: bottom;
    margin-right: -2px;
  }
  .icon_{
    display: inline-block;
    height: 15px;
    width: 1px;
    background: #0766EF;
    vertical-align: bottom;
    margin-right: 5px;
  }
  .workResult {
    display: flex;
    height: 100%;
    flex-direction: column;
  }
  .card li{position: relative;}
  .card li span{
    vertical-align: middle;
  }
  .card li span:nth-child(1){margin-right: 8px;}
  .card li span button{width: 38px;padding-left: 7px;height: 20px;padding-top:0px;}
  .order_number{
    width: 40px;
    float: right;
    position: absolute;
    right: -30px;
  }
  .ivu-scroll-container{
    height: 553px !important;
  }
  hr{margin:15px 0px 15px;background-color: #e4e7ed;height: 1px;border: none;}
</style>
