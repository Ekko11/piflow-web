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
            :disabled="row.status !== 3"
            @click="handleEdit(row)"
            >发布</Button
          >
          <Button v-if="user === 'ADMIN'" @click="handleOpenDelist(row)"
            >下架</Button
          >
          <Button v-if="user === 'ADMIN' && row.status === 4" @click="handleOpenApply(row)"
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
    <PublishModal ref="PublishModalRef"/>
  </section>
</template>

<script>
import {
  getDataProductByPage,
  deleteDataProduct,
  permissionForPublishing,
  delistDataProduct,
} from "@/apis/dataProduct";
import { downloadFile, download } from "@/apis/file";
import Cookies from "js-cookie";
import PublishModal from "./PublishModal.vue";


export default {
  name: "VisualizationDataBase",
  components: {PublishModal},
  data() {
    return {
      applyIsOpen: false,
      delistIsOpen: false,
      page: 1,
      limit: 10,
      total: 0,
      user: "USER",
      tableData: [],
      param: "",
      state:{ 0:"已删除", 1:"生成中", 2:"生成失败", 3:"待发布", 4:"待审核", 5:"已发布", 6:"拒绝发布", 7:"已下架"},
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
        },
        {
          title: "描述",
          key: "description",
        },
        {
          title: "状态",
          key: "state",
          render:(h,params)=> {
            return h('span',this.state[params.row.state])
          },
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
      download(downloadFile, row.file.id);
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
      this.$refs.PublishModalRef.handleEdit(row)
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
      const res = await getDataProductByPage(data);
      this.tableData = res.data.data
      this.total = res.data.count
    },


    onPageChange(pageNo) {
      this.page = pageNo;
      this.getTableData();
    },

    onPageSizeChange(pageSize) {
      this.limit = pageSize;
      this.getTableData();
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./index.scss";

.btn button {
  margin-right: 3px;
}
</style>

