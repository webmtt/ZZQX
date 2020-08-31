<template>
    <div class="zoom-controller">当前地图级别为 {{level}}</div>
</template>
<script>
export default {
    data () {
        return { level: 0 };
    },
    mounted() {
        this.$bus.on(this.$eventTypes.MAPCREATED, (map) => {
            // 监听地图分辨率的变化更新缩放级别的显示;
            this.level = parseInt(map.getView().getZoom());
            map.getView().on('change:resolution', evt => this.level = parseInt(map.getView().getZoom()));
        });
    }
}
</script>
<style scoped>
    .zoom-controller {
        position: absolute;
        bottom: 5px;
        left: 5px;
        color: red;
        z-index: 10;
    }
</style>
