<template>
  <section class="content">
    <div class="navbar">
      <div class="left">
        <span>运行历史</span>
      </div>
    </div>
    <div class="input">
      <Input
        suffix="ios-search"
        v-model="keyword"
        :placeholder="$t('modal.placeholder')"
        style="width: 300px"
      />
    </div>
    <Table border :data="tableData" :columns="columns">
      <!-- <template slot-scope="{ row }" slot="action">
        <div class="btn"> -->
          <!-- <Button @click="handleEnter(row)">查看</Button> -->
          <!-- <Button @click="handleShowLog(row)">日志查看</Button>
          <Button @click="handleDownDataProduct(row)">数据产品下载</Button>
          <Button v-if="row.dataProductList && row.dataProductList.length" @click="handDataPublish(row)">数据产品发布</Button> -->
        <!-- </div>
      </template> -->
    </Table>
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
  </section>
</template>
<script>
import { getProcessHistoryPageOfSelf } from "@/apis/process";

export default {
  data() {
    return {
      isOpen: false,
      limit: 10,
      keyword:"",
      page: 1,
      total: 0,
      currentNode: {},
      treeData: [],
      tableData: [],
      columns: [
        {
          title: "名称",
          key: "name",
        },
        {
          title: "运行时间",
          key: "startTime",
        },
        {
          title: "结束时间",
          key: "lastUpdateDttm",
        },
        {
          title: "运行状态",
          key: "state.text",
          render: (h, params) => {
            return h("span", [params.row.state.text]);
          },
        },
        // {
        //   title: "操作",
        //   slot: "action",
        //   width: 430,
        //   align: "center",
        // },
      ],
    };
  },
  created() {
    this.handleGetTableData();
  },
  methods: {
    async handleGetTableData() {
      const res = await getProcessHistoryPageOfSelf({
        limit: this.limit,
        page: this.page,
      });
      this.tableData = res.data.data
      this.total = res.data.count
      if(this.total) this.isOpen = true 
    },
    handleEnter(row) {
      this.$router.push(
          `/home/flowProcess?processId=${row.id}`
        );
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