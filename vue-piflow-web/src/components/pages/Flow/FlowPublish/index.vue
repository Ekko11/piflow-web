<template>
  <section>
    <!-- header -->
    <div class="navbar">
      <div class="left">
        <span>流水线发布管理</span>
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
    <el-table :data="tableData" border>
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="productTypeName" label="类型" />
      <el-table-column label="描述" >
        <template slot-scope="scope">
          <Tooltip :content="scope.row.description" placement="top"  maxWidth="340">
              <span class="desc">{{scope.row.description}}</span>
          </Tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="crtUser" label="创建人"  width="120" />
      <el-table-column prop="crtDttm" label="创建时间"  width="180" />
      <el-table-column label="操作" width="180"  align="center">
        <template slot-scope="scope">
        <div class="btn">
           <Button @click="handleEdit(scope.row)">编辑</Button>
          <Button @click="handleDelete(scope.row)">删除</Button>
        </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- <Table border :columns="columns" :data="tableData" >
      <template slot-scope="{ row }" slot="action">
        <div class="btn">
          <Button @click="handleEdit(row)">编辑</Button>
          <Button @click="handleDelete(row)">删除</Button>
        </div>
      </template>
    </Table> -->
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
      columns:[
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
          tooltip:true,
          width:480,
          resizable:true
        },
        {
          title: "创建人",
          key: "crtUser",
          width:'120',
          align:'center'
        },
        {
          title: "创建时间",
          key: "crtDttm",
          width:'180',
          align:'center'
        },
        {
          title: '操作',
          slot: "action",
          width: 180,
          align: "center",
        }
      ]
    };
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

::v-deep .el-table {
  th.el-table__cell>.cell{
    color: #515a6e;
    font-size: 14px;
  }
   th{
    background: #f8f8f9;
  }
  .el-table__cell{
    padding: 8px 0;
  }

  .desc{
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
  }
}




</style>

