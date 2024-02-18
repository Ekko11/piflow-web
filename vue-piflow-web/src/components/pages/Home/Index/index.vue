<template>
  <div>
    <div class="bg">
      <div class="menu">
        <div
          v-for="(item, index) in list"
          :key="item.route"
          :class="{ active: index === active }"
          @click="handleEnter(item.route)"
        >
          <img :src="item.img" alt="" />
          <p>-{{ item.name }}-</p>
        </div>
      </div>
    </div>
    <div class="content">
      <router-view></router-view>
   </div>
  </div>
</template>
<script>
export default {
  name: "homeInedx",
  data() {
    return {
      active: 0,
      list: [
        {
          img: require("@/assets/img/home/process.png"),
          name: "数据处理",
          route: "/",
        },
        {
          img: require("@/assets/img/home/product.png"),
          name: "数据产品",
          route: "/product",
        },
        {
          img: require("@/assets/img/home/visualization.png"),
          name: "可视化",
          route: "/visualization",
        },
        {
          img: require("@/assets/img/home/intro.png"),
          name: "系统简介",
          route: "/intro",
        },
      ],
    };
  },
  watch: {
    $route: {
      handler: function (val) {
        switch (val.name) {
          case "homeProduct":
            this.active = 1;
            break;
          case "homeIntro":
            this.active = 3;
            break;
          case "homeVisualization":
            this.active = 2;
            break;
          default:
            this.active = 0;
        }
      },
      immediate: true,
    },
  },
  methods:{
    handleEnter(link){
        this.$router.push('/home'+link)
    }
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>