<template>
  <div class="product">
    <div class="search">
      <Input
      v-model="keyword"
        search
        enter-button
        @on-search="handleSearch"
        placeholder="关键词搜索"
      />
    </div>
    <div class="contain">
      <div class="contain_l">
        <h4  style="cursor: pointer;" @click="handleChangeSelectNode(null,null)">数据产品分类</h4>
        <Tree
          :data="treeData"
          expand-node
          :render="renderContent"
          @on-select-change="handleChangeSelectNode"
        ></Tree>
      </div>
      <div class="contain_r">
        <div v-for="item in tableData" :key="item.id" class="product_item">
          <img :src=" fileMap[item.coverFile.id] || '@/assets/img/home/p1.png'" alt="" />
          <div>
            <h4>{{ item.name }}</h4>
            <div class="contain_r-desc">
              {{ item.description }}
            </div>
            <div class="contain_r-btn">
              <Button v-if="(role === 'ADMIN' || userName === item.crtUser) || item.permission === 0" @click="handleDown(item.file.id)">在线下载</Button>
              <!-- <Button>查看</Button> -->
            </div>
          </div>
        </div>
        
        <!-- paging -->
        <div class="page" v-if="total">
          <Page
            :prev-text="$t('page.prev_text')"
            :next-text="$t('page.next_text')"
            show-elevator
            :show-total="true"
            :total="total"
            show-sizer
            @on-change="onPageChange"
            @on-page-size-change="onPageSizeChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getDataProductType, getDataProductByPage } from "@/apis/dataProduct";
import { downloadFileByIds } from "@/apis/file";
import Cookies from "js-cookie";
import JSZip from 'jszip'
export default {
  data() {
    return {
      treeData: [],
      tableData: [],
      fileMap: {},
      total: 0,
      page: 1,
      limit: 10,
      keyword:'',
      role:'USER',
      userName:''
    };
  },
  created() {
    this.handleGetData();
    this.handleGetRole()
  },
  methods: {
    handleGetRole(){
      let user = JSON.parse(Cookies.get("setUser"));
      this.userName = Cookies.get("usre");
      if (user && user[0].role.stringValue) {
        console.log(user[0].role.stringValue);
        this.role = user[0].role.stringValue;
      } else {
        this.role = "USER";
      }
    },
    async handleGetData() {
      const res = await getDataProductType();
      this.treeData = res.data.data;
      // this.handleChangeSelectNode(null, this.treeData[0]);
      this.getTableData();
    },
    handleSearch() {
      this.page = 1
      this.getTableData();
    },
    handleChangeSelectNode(list, node) {
      if(node)  this.$set(node, "expand", !node.expand);
      this.currentNode = node;
      this.getTableData();
    },
    async getTableData() {
      const data = {
        page: this.page,
        limit: this.limit,
      }
      if(this.currentNode)  data.productTypeId = Number(this.currentNode.id)
      if(this.keyword)  data.keyword = this.keyword
      const res = await getDataProductByPage(data);
      this.tableData = res.data.data;
      const ids = [];
      res.data.data.forEach((item) => {
        if (item.coverFile.id && !this.fileMap[item.coverFile.id]) {
          ids.push(item.coverFile.id);
          this.$set(this.fileMap, item.coverFile.id, item.coverFile.fileName);
        }
      });
      this.total = res.data.count;
      ids.length &&this.getImg(ids.join(","));
    },
    async getImg(ids) {
      const _this = this;
      const res = await downloadFileByIds(ids);
      const zip = new JSZip();
      zip.loadAsync(res.data).then((res) => {
        for (const file in res.files) {
          console.log(file,_this.fileMap)
          var base = res.file(file).async("base64");
          base.then(function (res) {
            for (const fileId in _this.fileMap) {
              if (file === _this.fileMap[fileId]) {
                  _this.$set(_this.fileMap,fileId, "data:image/png;base64," + res);
              }
            }
          });
        }
      });
    },
    onPageChange(pageNo) {
      this.page = pageNo;
      this.getTableData();
    },

    onPageSizeChange(pageSize) {
      this.limit = pageSize;
      this.getTableData();
    },
    renderContent(h, { root, node, data }) {
      return h(
        "span",
        {
          style: {
            display: "inline-block",
            width: "100%",
          },
        },
        [h("span", [h("span", data.name)])]
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.page {
  display: flex;
  justify-content: flex-end;
}
</style>