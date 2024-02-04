<template>
  <section class="card">
    <h1>拓展属性</h1>
    <component :is="currentType" />
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
    type:String    //已有配置初始值
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
};
</script>
<style lang="scss" scoped>
@import "../../index.scss";
</style>
  
  