<template>
  <section class="card">
    <h1>拓展属性</h1>
    <component @change="handleChange"  :is="currentType" />
  </section>
</template>
  
  <script>
import LineChart from './LineChart'
import BarChart from './BarChart'
import PieChart from './PieChart'
export default {
  name: "ExtraChartOptions",
  components: {
    LineChart,
    BarChart,
    PieChart
  },
  props:{
    type:String
  },
  data() {
    return {
        currentType:''
    };
  },
  watch: {
    type:{
      handler(val){
         this.currentType = val
      },
      immediate:true
    }
  },
  created() {

  },
  methods: {
    handleChange(val){
        this.$emit('extraOptionsChange',val)
    }
  },
};
</script>
<style lang="scss" scoped>
@import "../../index.scss";
</style>
  
  