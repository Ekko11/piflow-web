<template>
  <div class="process">
    <div v-for="(item, index) in list" :key="index">
      <div class="process_title">
        <img src="@/assets/img/home/title.png" alt="" />
        <h4>{{ item.name }}生产流水线</h4>
      </div>
      <div class="process_list">
        <div
          v-for="(child, idx) in item.children"
          :key="idx"
          @click="handleEnter(child.id)"
        >
          <img :src="imgList[0]" alt="" />
          <div>
            <p>{{ child.name }}生产流水线</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getDataProductType } from "@/apis/dataProduct";
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
      this.$router.push(`/home/list?type=${id}`);
    },
    async getList() {
      const res = await getDataProductType();
      this.list = res.data.data
    },

  },
};
</script>

<style lang="scss" scoped>
@import "../index.scss";
</style>