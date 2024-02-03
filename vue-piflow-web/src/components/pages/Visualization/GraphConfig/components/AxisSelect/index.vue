<template>
  <section class="card">
    <h1>维度选择</h1>
    <div class="select">
      <div>
        <Select v-model="xAxis" style="width: 100%">
          <template #prefix>
            <div class="prefix">X轴</div>
          </template>
          <Option
            v-for="item in tableData"
            :value="item.label"
            :key="item.label"
            >{{ item.label }}</Option
          >
        </Select>
      </div>
      <div>
        <Select v-model="yAxis" multiple style="width: 100%">
          <template #prefix>
            <div class="prefix">Y轴</div>
          </template>
          <Option
            v-for="item in tableData"
            :value="item.label"
            :key="item.label"
            >{{ item.label }}</Option
          >
        </Select>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "AxisSelect",
  props: {
    tableData: Array,
    xAxisType: String,
    yAxisType: Array,
  },
  watch: {
    xAxisType(val) {
      if(val === this.xAxis ) return
      this.xAxis = val;
    },
    yAxisType: {
      handler: function (val) {
       if(val === this.yAxis ) return
        this.yAxis = val;
      },
      deep:true
    },
    xAxis(val) {
      this.$emit("xAxisTypeChange", val);
    },
    yAxis(val) {
      this.$emit("yAxisTypeChange", val);
    },
  },
  data() {
    return {
      xAxis: "",
      yAxis: [],
    };
  },
  created() {
    console.log(this.tableData);
  },
};
</script>

<style lang="scss" scoped>
@import "../../index.scss";
.select {
  padding: 24px;
  > div {
    border-radius: 10px;
    margin-bottom: 10px;
  }
  .prefix {
    width: 60px;
    text-align: center;
    background: #eee;
    margin-right: 10px;
  }
}
</style>