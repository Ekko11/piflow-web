<template>
  <div style="background: #fff;" >
    <div class="head">
      <div class="head-l" >生态站监测数据产品生产系统</div>
      <div class="head-m"></div>
      <div class="head-r" >
        <div v-if="!user.username" @click="handleLogin">
          <img src="@/assets/img/home/user.png" alt="" />
          <span >登录</span>
        </div>
        <div v-else>
          <Icon type="md-person" style="font-size: 20px; margin-right: 5px" />
          <span>{{ user.username ? user.username : "游客" }}</span>
          <Icon
            type="md-log-out"
            style="font-size: 20px; margin-left: 3px"
            @click="handleLogout"
          />
        </div>
        <div v-if="role == 'ADMIN'"  @click="handleEnter"> 
          <img src="@/assets/img/home/setting.png" alt="" />
          <span>后台管理</span>
        </div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
import Cookies from "js-cookie";
export default {
  name: "home",
  data() {
    return {
      user: {},
      role:''
    };
  },
  created() {
    let state = Cookies.get("state"); //获取缓存看是否登录过
    if (state == "jwtok") {
      this.user = { username: Cookies.get("usre") };
      this.userName = Cookies.get("usre");
      let Role = JSON.parse(Cookies.get("setUser"));
       this.role = Role[0].role.stringValue;
    }


  },
  methods: {
    handleLogout() {
      this.$Modal.confirm({
        title: this.$t("tip.title"),
        okText: this.$t("modal.confirm"),
        cancelText: this.$t("modal.cancel_text"),
        content: `确定要退出登录吗？`,
        onOk: () => {
          window.sessionStorage.removeItem("menuName");
          Cookies.remove("state");
          Cookies.remove("token");
          Cookies.remove("user");
          Cookies.remove("setUser");
          this.$store.commit("setToken", "");
          this.$store.commit("setUser", {});
          this.user = {};
          this.$router.push("/login");
        },
      });
    },
    handleLogin() {
      this.$router.push({
        path:"/login",
        query: { redirect: this.$route.fullPath} 
      });
    },
    handleEnter() {
      let state = Cookies.get("state"); //获取缓存看是否登录过
      if (state == "jwtok") {
        this.$router.push("/manage");
      } else {
        this.$router.push("/login");
      }
    },
    handleBack() {
      this.$router.push("/home");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>