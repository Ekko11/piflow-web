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
    <Table :data="tableData" :columns="columns">
      <template slot-scope="{ row }" slot="action">
        <div class="btn">
          <Button @click="handleEdit(row)">编辑</Button>
          <Button @click="handleAddChild(row)">新增</Button>
          <Button @click="handleDelete(row)">删除</Button>
        </div>
      </template>
    </Table>
  </section>
</template>
<script>
import { getDataProductType } from "@/apis/dataProduct";
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
        // {
        //   title: "描述",
        //   key: "description",
        // },
        {
          title: "操作",
          slot: "action",
          width: 300,
          align: "center",
        },
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
        keyword: this.keyword,
      });
      console.log(res);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
::v-deep .contain {
  display: flex;
  padding: 20px;
  height: 100%;
  &_l {
    width: 308px;
    height: 100%;
    margin-right: 24px;
    flex-shrink: 0;
    box-shadow: 4px 4px 8px 0px #3974aa1f;
    border-radius: 8px;
    padding: 0 32px;
    h4 {
      font-size: 16px;
      margin-bottom: 16px;
      margin-top: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .button {
        font-size: 14px;
        font-weight: 400;
        border: 1px solid #eee;
        padding: 3px 6px;
        cursor: pointer;
      }
    }
    .ivu-tree ul li .ivu-tree-title {
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
      width: 100%;
    }
  }
  &_r {
    flex-grow: 1;
    .btn {
      button {
        margin-right: 5px;
      }
    }
  }
}
</style>