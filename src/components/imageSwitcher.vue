<template>
    <Modal width="1060" @on-visible-change="visiableChange" :mask-closable="false" :closable="true" :z-index="100" v-model="show" title="作业效果对比">
        <div style="display: flex; height: 600px;">
            <div class="itemLabel">效果图片：</div>
            <div style="flex: 1;overflow: hidden;position: relative;">
                <div style="position: absolute;width: 100%;z-index: 10;text-align: center;font-weight: bold">{{times[activeImageIndex]}}</div>
                <Carousel easing='none' v-if="show" @on-change="switchImage" v-model="activeImageIndex" loop>
                    <CarouselItem v-for="(item, index) in images" :key="index">
                        <img style="width: 928px; height: 600px;" :src="item" />
                    </CarouselItem>
                </Carousel>
            </div>
        </div>
        <div style="display: flex;height: 30px">
            <div class="itemLabel">评估结果：</div>
            <div style="flex: 1;display: flex;justify-content: center;align-items: center;color: #fff;">{{info}}</div>
        </div>
        <template #footer>
            <div style="display: flex;justify-content: center;">
                <RadioGroup @on-change="radioOnChanged" v-model="activeButton" type="button" size="large">
                    <Radio style="margin-right:5px" :title="times[index]" v-for="(item,index) in labels" :key="index" :label="item"></Radio>
                </RadioGroup>
            </div>
        </template>
    </Modal>
</template>

<script>
    export default {
        data () {
            return {
                isShowComment: false,
                activeImageIndex: 0,
                activeButton: '作业前',
                loading: false,
                show: false,
                images: [],
                times: [],
                info: '',
                labels: ['作业前', '作业后', '作业后30分钟'],
            }
        },
        computed: {},
        watch: {
            modalData(newValue) {
                this.show = newValue.show;
                if (this.show) {
                    const itemData = this.modalData.data.row
                    this.images = !this.images.length ? [itemData.beforePicFilePath, itemData.afterPicFilePath, itemData.after30PicFilePath] : [];
                    this.times = !this.times.length ? [itemData.beforePicDateTime, itemData.afterPicDateTime, itemData.after30PicDateTime] : [];
                    this.info = itemData.comment;
                } else {
                    this.images = this.times = [];
                    this.info = '';
                }
            }
        },
        props: ['modalData'],
        methods: {
            visiableChange(val) {
                if (!val) {
                    this.images = this.times = [];
                    this.info = '';
                    this.activeImageIndex = 0;
                    this.activeButton = '作业前';
                }
            },
            switchImage(oldValue, value) {
                this.activeButton = this.labels[value];
            },
            radioOnChanged() {
                this.activeImageIndex = this.labels.indexOf(this.activeButton);
            }
        },
        mounted() {}
    }
</script>

<style scoped>
    .itemLabel {
        width: 100px;
        display: flex;
        align-items: center;
        font-weight: bold;
            color: white;
    }
</style>
