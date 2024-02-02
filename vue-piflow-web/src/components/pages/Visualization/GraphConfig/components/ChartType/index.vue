<template>
  <section>
    <h1>图表类型</h1>
    <div>
        <div v-for="item  in  typeList" :key="item.name" @click="handleClick(item.type)">{{item.name}}</div>
    </div>
  </section>
</template>
  
  <script>
export default {
  name: "ChartType",
  components: {},
  data() {
    return {
      typeList: [
        {
          type: "lineChart",
          name: "折线图",
        },
        {
          type: "barChart",
          name: "柱状图",
        },
        {
          type: "PieChart",
          name: "饼状图",
        },
      ],
    };
  },

  created() {},
  methods: {
    handleClick(type){
      this.$emit('typeChange',type)
    }
  },
};
</script>
  <style lang="scss" scoped>
</style>
  
  