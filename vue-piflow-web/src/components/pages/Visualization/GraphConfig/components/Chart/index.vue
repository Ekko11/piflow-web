<template>
  <section class="card">
    <h1>图表展示</h1>
    <div>
      <div class="chart" ref="chart" style="width: 100%"></div>
    </div>
    <button @click="handleSave">保存配置</button>
    <button @click="handleDown">下载图表</button>
  </section>
</template>
<script>
import echarts from "echarts";
export default {
  name: "Chart",
  props: {
    options: Object,
  },
  methods: {
    handleInit() {
      this.chart = echarts.init(this.$refs.chart);
      this.chart.setOption(this.options);
      window.addEventListener("resize", () => {
        this.chart.resize();
      });
    },
    handleSave(){
      this.$emit('saveOptions')
    },
    handleDown() {
      // 获取ECharts生成的图片对应的base64数据
      var base64 = this.chart.getDataURL({
        type: "png",
        pixelRatio: 1.5, // 放大两倍下载，之后压缩到同等大小展示
      });

      // 将base64数据保存到本地
      var link = document.createElement("a");
      link.href = base64;
      link.download = "image.png"; // 可以自定义文件名
      link.click();
    },
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.clear();
    }
  },
  watch: {
    options(newVal) {
      if (newVal.grid) {
        this.handleInit();
      }
    },
  },
  mounted() {
  },
};
</script>

<style lang="scss">
@import "../../index.scss";
.chart {
  width: 100%;
  height: 500px;
}
</style>