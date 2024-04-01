<template>
  <div style="background: #fff;" >
    <div class="h_head">
      <div class="h_head-l" @click="handleBack">生态站监测数据产品生产系统</div>
      <div class="h_head-m"></div>
      <div class="h_head-r" >
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
        <div  @click="handleEnter"> 
          <img src="@/assets/img/home/setting.png" alt="" />
          <span>后台管理</span>
        </div>
      </div>
    </div>
    <div class="h_content">
      <router-view></router-view>
    </div>

    <div class="h_footer">
          <div class="h_footer-l">
            <img src="/img/footer_logo.png" alt="">
          </div>
          <div class="h_footer-r">
                <p> <span>地址:{{add}}</span> <span>邮编:100101</span>  <span>电话:{{tel}}</span></p>
                <p>Email: {{email}}</p>
                <p>版权所有 &copy; {{copy}}</p>
          </div>
    </div>
  </div>
</template>
<script>
import Cookies from "js-cookie";
export default {
  name: "home",
  data() {
    return {
      user: {},
      add:window.$FOOTER_ADD,
      tel:window.$FOOTER_TEL,
      email:window.$FOOTER_EMAIL,
      copy:window.$FOOTER_COPY,

    };
  },
  created() {
    let state = Cookies.get("state"); //获取缓存看是否登录过
    if (state == "jwtok") {
      this.user = { username: Cookies.get("usre") };
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
        this.$router.push("/");
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