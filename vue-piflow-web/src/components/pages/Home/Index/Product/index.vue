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
          <img  :src=" item.coverFile.filePath || '@/assets/img/home/p1.png'" alt="" />
          <div>
            <h4>{{ item.name }}</h4>
            <div class="contain_r-desc">
              {{ item.description }}
            </div>
            <div class="contain_r-btn">
              <Button v-if="(role === 'ADMIN' || userName === item.crtUser) || item.permission === 0" @click="handleDown(item)">在线下载</Button>
              <Button v-else @click="handleApply(item)">在线申请</Button>
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
            :current="page"
            show-sizer
            @on-change="onPageChange"
            @on-page-size-change="onPageSizeChange"
          />
        </div>
      </div>
    </div>
<!-- 申请 -->
    <Modal
    v-model="isOpen"
    width="520px"
    title="申请"
    footer-hide
    class="custom-modal"
  >
    <div style="width: 100%; height: 100%">
      <Form
        class="formApplyInfo"
        :model="formApplyInfo"
        :rules="ruleValidate"
        ref="formValidate"
        :label-width="100"
      >
        <Form-item label="理由" prop="reason">
          <Input
          v-model="formApplyInfo.reason"
            type="textarea"
            :rows="3"
            placeholder="请输入"
          ></Input>
        </Form-item>
      </Form>
    </div>
    <div class="footer">
      <Button @click="isOpen = false" class="custom-btn-default">{{
        $t("modal.cancel_text")
      }}</Button>
      <Button @click="handleConfirmApply" class="custom-btn-primary">{{
        $t("modal.confirm")
      }}</Button>
    </div>
  </Modal>
  </div>
</template>
<script>
import { getDataProductType, getDataProductByPage,applyPermission } from "@/apis/dataProduct";
import { downloadFileByIds,downloadFile,download } from "@/apis/file";
import Cookies from "js-cookie";
import JSZip from 'jszip'
export default {
  data() {
    return {
      treeData: [],
      tableData: [],
      fileMap: {},
      copyFileMap:{},
      total: 0,
      page: 1,
      limit: 10,
      keyword:'',
      role:'USER',
      userName:'',
      formApplyInfo:{
        reason:''
      },
      ruleValidate:{
        reason: [
          {
            required: true,
            message: "The reason cannot be empty",
            trigger: "blur",
          },
        ],
      },
      isOpen:false,
    };
  },
  created() {
    this.handleGetData();
    this.handleGetRole()
  },
  methods: {
    handleConfirmApply(){
      this.$refs.formValidate.validate(async (valid) => {
        if(valid){
          const res = await applyPermission(this.formApplyInfo)
          if(res.data.code === 200){
            this.$Message.success({
              content: '申请成功',
              duration: 3,
            });
            this.isOpen  = false
          }
        }
      })
    },
    handleApply(row){
      if(!this.userName){
        this.$router.push({
          path: "/login",
          query: { redirect: `/home/product` },
        });
        return 
      }
      this.$refs.formValidate.resetFields();
      this.formApplyInfo  = {
        reason:'',
        productId:row.id
      }
      this.isOpen =true
    },
    handleGetRole(){
      this.userName = Cookies.get("usre");
      if (Cookies.get("setUser") && user[0].role.stringValue) {
        let user = JSON.parse(Cookies.get("setUser"));
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
      this.total = res.data.count;
      // const ids = [];
      // res.data.data.forEach((item) => {
      //   if (item.coverFile && item.coverFile.id && !this.copyFileMap[item.coverFile.id]) {
      //     ids.push(item.coverFile.id);
      //     this.$set(this.copyFileMap, item.coverFile.id, item.coverFile.fileName);
      //   }
      // });
      // ids.length &&this.getImg(ids.join(","));
    },
        // 下载
    async handleDown(row) {
      if(!this.userName){
        this.$router.push({
          path: "/login",
          query: { redirect: `/home/product` },
        });
        return 
      }
      download(downloadFile, row.file.id,row.file.fileName,true);
    },
    async getImg(ids) {
      const _this = this;
      const res = await downloadFileByIds(ids);
      const zip = new JSZip();
      zip.loadAsync(res.data).then((res) => {
        for (const file in res.files) {
          var base = res.file(file).async("base64");
          base.then(function (res) {
            for (const fileId in _this.copyFileMap) {
              if (file === _this.copyFileMap[fileId]) {
                  _this.$set(_this.copyFileMap,fileId, "data:image/png;base64," + res);
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
.footer {
  height: 40px;
  padding-left: 20px;
  border-top: 1px solid #dedede;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-top: 10px;
  button {
    margin-right: 10px;
  }
}
</style>