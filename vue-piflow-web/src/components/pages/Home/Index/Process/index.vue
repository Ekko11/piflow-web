<template>
  <div class="process">
    <div v-for="(item, index) in list" v-show="item.state !== 2" :key="index">
      <div class="process_title">
        <img src="@/assets/img/home/title.png" alt="" />
        <h4>{{ item.name }}生产流水线</h4>
      </div>
      <div class="process_list">
        <div
          v-for="(child, idx) in item.children"
          v-show="child.state !== 2"
          :key="idx"
          @click="handleEnter(child.id)"
        >
          <img :src="child.filePath || imgList[0]" alt="" />
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
import { downloadFileByIds } from "@/apis/file";
import JSZip from 'jszip'
export default {
  data() {
    return {
      list: [],
      fileMap:{},
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
      let fileMap = {}
      res.data.data.forEach(item => {
          item.children.forEach(v=>{
            if(v.fileId){
              fileMap[v.fileId] = v.fileName
            }
          })
      });
      // if(Object.keys(fileMap).length){
      //   this.getImg(Object.keys(fileMap).join(','),fileMap)
      // }
    },
    // async getImg(ids,fileMap){
    //   const _this = this
    //   const res = await downloadFileByIds(ids)
    //   const zip = new JSZip()
    //   zip.loadAsync(res.data).then((res) => {
    //     for (const key in fileMap) {
    //       var base = res.file(res.files[fileMap[key]].name).async("base64");
    //       base.then(function (res) {
    //         _this.$set(_this.fileMap,key,'data:image/png;base64,' + res)
    //        })
    //     }
    //   }) 
    // }

  },
};
</script>

<style lang="scss" scoped>
@import "../index.scss";
</style>