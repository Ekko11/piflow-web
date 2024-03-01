<template>
  <div id="app">
    <transition name="show">
      <router-view/>
    </transition>
    <transition name="show">
      <div class="fullScreen" v-if="loading">
        <div style="margin-top: 15%;">
          <p><img src="@/assets/img/loading.gif" /></p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "app",
 data() {
    return {
      loading: false,
    };
  },
  created() {
    this.$event.on("loading", val => {
      this.loading = val;
    });
  },
  mounted() {
    //*****************************解决刷新页面数据丢失开始**************************************** */
    if (sessionStorage.getItem("store")) {
      this.$store.replaceState(
        Object.assign(
          {},
          this.$store.state,
          JSON.parse(sessionStorage.getItem("store"))
        )
      );
      sessionStorage.removeItem("store");
    }
    //在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener("beforeunload", () => {
      sessionStorage.setItem("store", JSON.stringify(this.$store.state));
    });
  }
};
</script>

