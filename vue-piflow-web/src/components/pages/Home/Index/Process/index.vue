<template>
  <div class="process">
    <div v-for="(item, index) in list" :key="index">
      <div class="process_title">
        <img src="@/assets/img/home/title.png" alt="" />
        <h4>{{ item.name }}</h4>
      </div>
      <div class="process_list">
        <div
          v-for="(child, idx) in item.children"
          :key="idx"
          @click="handleEnter(child.id)"
        >
          <img :src="imgList[0]" alt="" />
          <div>
            <p>{{ child.name }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getDataProductType } from "@/apis/dataProduct";
import Cookies from "js-cookie";
export default {
  data() {
    return {
      list: [],
      imgList: [require("@/assets/img/home/p2.png")],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleEnter(id) {
      const link = `/home/list?type=${id}`
      if(Cookies.get("setUser")){
        this.$router.push(link);
      }else{
        this.$router.push({
          path:'/login',
          query: { redirect: link} 
        });
      }
      
    },
    async getList() {
      const formData = await getDataProductType();
      const fileList = formData.getAll("file");
      const list = JSON.parse(formData.getAll("data")[0]);
      this.list = list
    },

  },
};
</script>

<style lang="scss" scoped>
@import "../index.scss";
</style>