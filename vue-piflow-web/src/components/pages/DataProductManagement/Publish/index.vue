<template>
  <section>
    <!-- header -->
    <div class="navbar">
      <div class="left">
        <span>数据产品发布管理</span>
      </div>
    </div>
    <!-- search -->
    <div class="input">
      <Input
        suffix="ios-search"
        v-model="param"
        :placeholder="$t('modal.placeholder')"
        style="width: 300px"
      />
    </div>
    <!-- Table button -->
    <Table border :columns="columns" :data="tableData">
      <template slot-scope="{ row }" slot="action">
        <div class="btn">
          <Button @click="handleEdit(row)">编辑</Button>
          <Button @click="handleDown(row)">下载</Button>
          <Button
            v-if="user !== 'ADMIN'"
            :disabled="row.status === '审核中'"
            @click="handleEdit(row)"
            >发布</Button
          >
          <Button v-if="user === 'ADMIN'" @click="handleOpenDelist(row)"
            >下架</Button
          >
          <Button v-if="user === 'ADMIN'" @click="handleOpenApply(row)"
            >审核</Button
          >
          <Button @click="handleDelete(row)">删除</Button>
        </div>
      </template>
    </Table>
    <!-- paging -->
    <div class="page">
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

    <!-- 编辑 -->
    <Modal
      v-model="isOpen"
      title="编辑"
      :ok-text="$t('modal.ok_text')"
      :cancel-text="$t('modal.cancel_text')"
      @on-ok="handleComfirm"
    >
      <div class="modal-warp">
        <div class="item">
          <label>名称：</label>
          <Input
            v-model="formData.name"
            show-word-limit
            maxlength="100"
            :placeholder="$t('modal.placeholder')"
            style="width: 350px"
          />
        </div>
        <div class="item">
          <label class="self">分类：</label>
          <treeselect
            v-model="formData.parentId"
            :placeholder="$t('modal.placeholder_select')"
            :normalizer="normalizer"
            :options="treeData"
            style="width: 350px"
          />
        </div>
        <div class="item">
          <label>权限：</label>
          <RadioGroup v-model="formData.permission">
            <Radio value="0">公开</Radio>
            <Radio value="1">授权</Radio>
          </RadioGroup>
        </div>
        <div class="item">
          <label>简介：</label>
          <Input
            v-model="formData.description"
            type="textarea"
            :rows="4"
            :placeholder="$t('modal.placeholder')"
            style="width: 350px"
          />
        </div>
        <div class="item">
          <label>关键词：</label>
          <Input
            v-model="formData.keyword"
            show-word-limit
            maxlength="100"
            :placeholder="$t('modal.placeholder')"
            style="width: 350px"
          />
        </div>

        <div class="item">
          <label>发布者姓名：</label>
          <Input
            v-model="formData.sdPublisher"
            show-word-limit
            maxlength="100"
            :placeholder="$t('modal.placeholder')"
            style="width: 350px"
          />
        </div>

        <div class="item">
          <label>发布者邮箱：</label>
          <Input
            v-model="formData.email"
            show-word-limit
            maxlength="100"
            :placeholder="$t('modal.placeholder')"
            style="width: 350px"
          />
        </div>

        <div class="item">
          <label class="self">封面：</label>
          <Upload
            action="/null"
            :on-success="handleFileSuccess"
            :on-error="handleFileError"
            :before-upload="handleFileBefore"
            :show-upload-list="false"
            style="width: 350px"
            class="upload"
          >
            <div>
              <img
                v-if="formData.file || formData.fileName"
                style="width: 100px; height: 40px"
                :src="formData.fileName"
                alt=""
              />
              <Icon
                v-else
                type="ios-cloud-upload"
                size="52"
                style="color: #3399ff"
              ></Icon>
              <p>Click or drag files here to upload</p>
            </div>
          </Upload>
        </div>
      </div>
    </Modal>

    <!-- 审核 -->
    <Modal
      v-model="applyIsOpen"
      width="520px"
      title="审核"
      :ok-text="$t('modal.ok_text')"
      :cancel-text="$t('modal.cancel_text')"
      @on-ok="handleResultApply"
      class="custom-modal"
    >
      <div style="width: 100%; height: 100%">
        <Form
          class="formApplyInfo"
          ref="formApplyInfo"
          :model="formApplyInfo"
          :label-width="100"
        >
          <Form-item label="审核">
            <Radio-group v-model="formApplyInfo.state">
              <Radio :label="5">允许发布</Radio>
              <Radio :label="6">拒绝发布</Radio>
            </Radio-group>
          </Form-item>
          <Form-item label="理由">
            <Input
              type="textarea"
              :rows="3"
              v-model="formApplyInfo.opinion"
              placeholder="请输入"
            ></Input>
          </Form-item>
        </Form>
      </div>
    </Modal>

    <!-- 下架 -->
    <Modal
      v-model="delistIsOpen"
      width="520px"
      title="下架"
      :ok-text="$t('modal.ok_text')"
      :cancel-text="$t('modal.cancel_text')"
      @on-ok="handleDelist"
      class="custom-modal"
    >
      <div style="width: 100%; height: 100%">
        <Form class="formDelistData" :model="formDelistData" :label-width="100">
          <Form-item label="下架理由：">
            <Input
              type="textarea"
              :rows="3"
              v-model="formDelistData.downReason"
              placeholder="请输入"
            ></Input>
          </Form-item>
        </Form>
      </div>
    </Modal>
  </section>
</template>

<script>
import {
  saveDataProduct,
  getDataProductList,
  downProductFile,
  deleteDataProduct,
  permissionForPublishing,
  delistDataProduct,
} from "@/apis/dataProduct";
import Cookies from "js-cookie";
export default {
  name: "VisualizationDataBase",
  components: {},
  data() {
    return {
      isOpen: false,
      applyIsOpen: false,
      delistIsOpen: false,
      page: 1,
      limit: 10,
      total: 0,
      user: "USER",
      tableData: [],
      treeData: [],
      param: "",
      formData: {},
      // 审核
      formApplyInfo: {
        id: "",
        state: 5, //默认通过
        opinion: "",
      },
      // 下架
      formDelistData: {
        id: "",
        downReason: "",
      },
    };
  },
  computed: {
    columns() {
      return [
        {
          title: "标题",
          key: "name",
          sortable: true,
        },
        {
          title: "描述",
          key: "description",
        },
        {
          title: this.$t("database.action"),
          slot: "action",
          width: this.user === "ADMIN" ? 360 : 300,
          align: "center",
        },
      ];
    },
  },
  created() {
    this.getRole();
    this.getTableData();
  },
  watch: {
    param(val) {
      this.page = 1;
      this.limit = 10;
      this.getTableData();
    },
  },
  methods: {
    // 下架
    handleOpenDelist(row) {
      this.delistIsOpen = true;
      this.formDelistData.id = row.id;
    },
    async handleDelist() {
      const res = await delistDataProduct(this.formDelistData);
      this.applyIsOpen = false;
    },
    // 下载
    async handleDown(row) {
      const res = await downProductFile(row.id);
      console.log(res);
    },
    // 审核
    handleOpenApply(row) {
      this.applyIsOpen = true;
      this.formApplyInfo.id = row.id;
    },
    async handleResultApply() {
      const res = await permissionForPublishing(this.formApplyInfo);
      this.applyIsOpen = false;
    },
    getRole() {
      let user = JSON.parse(Cookies.get("setUser"));
      if (user && user[0].role.stringValue) {
        console.log(user[0].role.stringValue);
        this.user = user[0].role.stringValue;
      } else {
        this.user = "USER";
      }
    },

    handleEdit(row) {
      const {
        id,
        name,
        description,
        permission,
        keyword,
        sdPublisher,
        email,
        file,
      } = row;
      this.formData = {
        id,
        name,
        description,
        permission,
        keyword,
        sdPublisher,
        email,
        file,
      };
      this.isOpen = true;
    },
    async handleComfirm() {
      const formData = new FormData();
      for (const key in this.formData) {
        formData.append(key, this.formData[key]);
      }
      const rss = await saveDataProduct(formData);
      console.log(res);
    },

    handleDelete(row) {
      this.$Modal.confirm({
        title: this.$t("tip.title"),
        okText: this.$t("modal.confirm"),
        cancelText: this.$t("modal.cancel_text"),
        content: `${this.$t("modal.delete_content")} ${row.name}?`,
        onOk: async () => {
          const res = await deleteDataProduct(row.id);
          if (res.data.code === 200) {
            this.$Modal.success({
              title: this.$t("tip.title"),
              content: `${row.name} ` + this.$t("tip.delete_success_content"),
            });
            this.getTableData();
          } else {
            this.$Message.error({
              content: res.data.msg,
              duration: 3,
            });
          }
        },
      });
    },
    async getTableData() {
      let data = { page: this.page, limit: this.limit };
      if (this.param) {
        data.keyword = this.param;
      }
      const res = await getDataProductList(data);
      console.log(res);
      this.tableData = [{ name: 123, id: 999 }];
      // this.$axios({
      //     method:'POST',
      //     url:'/visual/getDatabaseList',
      //     data
      // }).then(res=>{
      //       if (res.data.code === 200) {
      //         this.tableData = res.data.data;
      //         this.total = res.data.totalCount;
      //       } else {
      //         this.$Message.error({
      //           content: this.$t("tip.request_fail_content"),
      //           duration: 3
      //         });
      //       }
      //     }).catch(error => {
      //       console.log(error);
      //       this.$Message.error({
      //         content: this.$t("tip.fault_content"),
      //         duration: 3
      //       });
      //     });
    },

    // 手动上传
    handleFileSuccess(response, file, fileList) {},
    handleFileError(error, file, fileList) {},
    handleFileBefore(file) {
      this.formData.file = file;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.formData.fileName = reader.result;
      };
      return false;
    },
    onPageChange(pageNo) {
      this.page = pageNo;
      this.getTableData();
    },

    onPageSizeChange(pageSize) {
      this.limit = pageSize;
      this.getTableData();
    },
    normalizer(node) {
      return {
        id: node.id,
        label: node.name,
        children:
          node.children && node.children.length ? node.children : undefined,
      };
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
.item {
  display: flex;
  label {
    margin-top: 5px;
  }
}
.upload {
  background: #fff;
  border: 1px dashed #dcdee2;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
  width: 350px;
  padding: 20px 0;
}
.btn button {
  margin-right: 3px;
}
</style>

