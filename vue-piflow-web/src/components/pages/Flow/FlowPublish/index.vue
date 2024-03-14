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

    <PublishModal ref="PublishModal" @publishOver="getTableData"/>
  </section>
</template>

<script>
import PublishModal from '../PublishModal/index.vue'

import { deleteFlowPublish,getflowPublishList } from "@/apis/flowPublish";

export default {
  name: "FlowPublish",
  components: { PublishModal },
  data() {
    return {
      page: 1,
      limit: 10,
      total: 0,
      tableData: [],
      param: "",
    };
  },
  computed: {
    columns() {
      return [
        {
          title: "名称",
          key: "name",
        },
        {
          title: "类型",
          key: "productTypeName",
        },
        {
          title: "描述",
          key: "description",
        },
        {
          title: "创建人",
          key: "crtUser",
        },
        {
          title: "创建时间",
          key: "crtDttm",
        },
        {
          title: this.$t("database.action"),
          slot: "action",
          width: 180,
          align: "center",
        },
      ];
    },
  },
  created() {
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

    handleEdit(row) {
      this.$refs.PublishModal.handleEdit(row);
    },
    handleDelete(row) {
      this.$Modal.confirm({
        title: this.$t("tip.title"),
        okText: this.$t("modal.confirm"),
        cancelText: this.$t("modal.cancel_text"),
        content: `${this.$t("modal.delete_content")} ${row.name}?`,
        onOk: async () => {
          const res = await deleteFlowPublish(row.id);
          if (res.data.code === 200) {
            this.$Message.success({
              content: `${row.name} ` + this.$t("tip.delete_success_content"),
            });
            this.getTableData();
          } else {
            this.$Message.error({
              content: res.data.errorMsg,
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
      const res = await getflowPublishList(data)
      this.tableData = res.data.data;
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
@import "../index.scss";
.item {
  display: flex;
  label {
    margin-top: 5px;
  }
}

.btn button {
  margin-right: 3px;
}
</style>

