<template>
  <section>
    <div class="formWrap" v-if="lineChart">
      <!-- <div>
        <label>颜色：</label>
        <Input v-model="lineChart.lineStyle.color" />
      </div> -->
      <div>
        <label>显示标签：</label>
        <Checkbox v-model="lineChart.label.show">是</Checkbox>
      </div>
      <div>
        <label>线宽：</label>
        <Input v-model="lineChart.lineStyle.width" />
      </div>
      <div>
        <label>线样式：</label>
        <Select v-model="lineChart.lineStyle.type">
          <Option :value="'solid'">实线</Option>
          <Option :value="'dotted'">点线</Option>
          <Option :value="'dashed'">虚线</Option>
        </Select>
      </div>
      <div>
        <label>不透明度：</label>
        <Input v-model="lineChart.lineStyle.opacity" />
      </div>
    </div>
  </section>
</template>
  
  <script>
import { mapGetters } from "vuex";
export default {
  name: "LineChart",
  computed: {
    ...mapGetters("graphConf", ["lineChart"]),
  },
};
</script>
<style lang="scss" scoped>
@import "../../../index.scss";
</style>
  
  