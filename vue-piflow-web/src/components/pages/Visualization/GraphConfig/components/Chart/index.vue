<template>
  <section class="card chart_wrap" ref="chart_wrap">
    <h1>图表展示</h1>
    <div class="chart_wrap-btn">
      <Button type="primary" size="small" @click="handleShowData"
        >原始数据</Button
      >

      <Poptip placement="top">
        <Button type="primary" size="small" style="margin-right: 5px"
          >保存配置</Button
        >
        <template #content>
          <Button type="primary" size="small" @click="handleSave('add')"
            >新增</Button
          >
          <Button type="primary" size="small" @click="handleSave('update')"
            >更新</Button
          >
        </template>
      </Poptip>

      <Button type="primary" size="small" @click="handleDown">下载图表</Button>
    </div>
    <div>
        <div class="chart" ref="chart" style="width: 100%"></div>
    </div>
  </section>
</template>
<script>
import echarts from "echarts";
export default {
  name: "Chart",
  props: {
    options: Object,
  },
  data(){
    return {
      chart:null
    }
  },
  methods: {
    handleInit() {
      if (this.chart) {
        this.chart.clear();
        this.chart.setOption(this.options);
      } else {
        // 某些浏览器大小下，由于父元素设置了flex-grow:1,导致获取高度异常
        console.log(this.$refs.chart.offsetHeight)
        setTimeout(() => {
          this.chart = echarts.init(this.$refs.chart);
          this.chart.setOption(this.options);
        }, 1000);
      }

    },
    
    handleSave(type) {
      this.$emit("saveOptions", type);
    },
    handleShowData() {
      this.$emit("showTableData");
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
    resizeChart(){
      if(this.chart) this.chart.resize();
    }
  },
  mounted(){
    window.addEventListener("resize",this.resizeChart);
    this.resizeObserver = new ResizeObserver(this.resizeChart);  
    this.resizeObserver.observe(this.$refs.chart);  
  },

  beforeDestroy() {
    if (this.chart) {
      this.chart.clear();
      this.resizeObserver.disconnect(); 
      window.removeEventListener("resize",this.resizeChart)
    }
  },
  watch: {
    options(newVal, oldVal) {
      if (newVal.grid) {
        if (oldVal.series.length || oldVal.xAxis.data.length) {
          //防止每次渲染时加载默认配置调用保存接口
          this.$emit("autoSave");
        }
        this.handleInit();
      }
    },
  },
};
</script>

<style lang="scss">
@import "../../index.scss";
.chart {
  width: 100%;
}
.chart_wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  > div:first-child {
    height: 100px;
    overflow: hidden;
  }
  > div:last-child {
    height: calc( 100% - 60px);
    margin-top: 20px;
      > div {
        width: 100%;
        height: 100%;
      }
  }
  .chart_wrap-btn {
    position: absolute;
    right: 7px;
    top: 5px;
    button {
      margin-right: 5px;
    }
  }
}
</style>