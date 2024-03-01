
<template>
  <div class="main">
    <Header :width="width"></Header>
    <router-view></router-view>
    <Footer />

  </div>
</template>
<script>
import Header from "./compon/Header";
import Footer from "./compon/Footer";
export default {
  name: "mains",
  components: {
    Footer,
    Header
  },
  data() {
    return {
      width: "250px"
    };
  },

};
</script>

<style lang="scss" scoped>
.main {
  height: 100%;
}
.fullScreen{
  z-index: 9999;
}
</style>