<template>
  <section>
    <div class="formWrap">
      <div>
        <label>颜色：</label>
        <Input v-model="series.lineStyle.color" />
      </div>
      <div>
        <label>线宽：</label>
        <Input v-model="series.lineStyle.width" />
      </div>
      <div>
        <label>对齐方法：</label>
        <Select v-model="series.lineStyle.type">
          <Option :value="'solid'">实线</Option>
          <Option :value="'dashed'">点线</Option>
          <Option :value="'dotted'">虚线</Option>
        </Select>
      </div>
      <div>
        <label>不透明度：</label>
        <Input v-model="series.lineStyle.opacity" />
      </div>
    </div>
  </section>
</template>
  
  <script>
export default {
  name: "BarChart",
  components: {},
  data() {
    return {
      series: {
        type: "bar",
        smooth: true,
        label: {
          show: true,
        },
        lineStyle: {
          color: "#000",
          width: "2",
          type: "solid",
          opacity: "1",
        },
      },
    };
  },
  watch: {
    series: {
      handler(val) {
        this.$emit('change',this.series)
      },
      deep: true,
      immediate:true
    },
  },
  created() {
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
.formWrap {
  > div {
    label {
      min-width: 100px;
      text-align: right;
    }
    display: flex;
    align-items: center;
    margin-bottom: 5px;
  }
}
</style>
  
  