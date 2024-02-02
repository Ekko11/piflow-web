<template>
  <div class="chart" ref="chart"></div>
</template>
<script>
import echarts from "echarts";
export default {
  name: "Chart",
  methods: {
    handleInit() {
      this.chart = echarts.init(this.$refs.chart);
      this.chart.setOption({
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [150, 230, 224, 218, 135, 147, 260],
            type: "line",
          },
        ],
      });
    },
  },
  mounted() {
    this.handleInit();
  }
};
</script>

<style lang="scss">
.chart{
    width: 500px;
    height: 500px;
}
</style>