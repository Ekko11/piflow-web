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
          @click="handleEnter"
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
    handleEnter() {
      this.$router.push("/home/list");
    },
    async getList() {
      const formData = await getDataProductType();
      const fileList = formData.getAll("file");
      const list = JSON.parse(formData.getAll("data")[0]);
      console.log(list);
      this.list = list.map((v) => {
        return {
          ...v,
          children: this.flatArr(v.children),
        };
      });
      this.list;
    },
    flatArr(arr) {
      if (!arr) return [];
      let result = [];
      arr.forEach((item) => {
        var res = JSON.parse(JSON.stringify(item)); // 先克隆一份数据作为第一层级的填充
        delete res["children"];
        result.push(res);
        if (item.children instanceof Array && item.children.length > 0) {
          // 如果当前children为数组并且长度大于0，才可进入flag()方法
          result = result.concat(this.flatArr(item.children));
        }
      });
      return result;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../index.scss";
</style>