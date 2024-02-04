<template>
  <section class="card">
    <h1>维度选择</h1>
    <div class="select">
      <div>
        <Select
          v-model="xAxisType"
          @on-change="handleXChange"
          style="width: 100%"
        >
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
        <Select
          :value="yAxisType"
          @on-change="handleYChange"
          multiple
          style="width: 100%"
        >
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
import { mapGetters } from "vuex";
export default {
  name: "AxisSelect",
  props: {
    tableData: Array,
  },
  methods: {
    handleXChange(val) {
      this.$store.dispatch("graphConf/changexAxisType", val);
    },
    handleYChange(val) {
      this.$store.dispatch("graphConf/changeyAxisType", val);
    },
  },
  computed: {
    ...mapGetters("graphConf", ["xAxisType", "yAxisType"]),
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