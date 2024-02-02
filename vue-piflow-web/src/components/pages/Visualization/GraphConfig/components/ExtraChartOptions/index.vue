<template>
  <section>
    <h1>拓展属性</h1>
    <component @change="handleChange"  :is="currentType" />
  </section>
</template>
  
  <script>
import LineChart from './LineChart'
export default {
  name: "ExtraChartOptions",
  components: {
    LineChart
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
</style>
  
  