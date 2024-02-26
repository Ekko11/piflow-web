<template>
  <div class="content">
    <h4 class="content_title">· {{ currentNode.name }} ·</h4>
    <div class="desc">
      {{ currentNode.description }}
    </div>

    <div v-if="currentNode.children && currentNode.children.length" class="process flow_process" >
      <div class="process_list">
        <div
          v-for="(child, idx) in currentNode.children"
          :key="idx"
          @click="handleChangeNode(child.id)"
        >
          <img :src="imgList[0]" alt="" />
          <div>
            <p>{{ child.name }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="list">
      <Table :columns="columns" :data="data">
        <template slot-scope="{ row }" slot="action">
          <div class="btn">
            <Button @click="handleEnter(row)">进入</Button>
            <Button @click="handShowInstructions(row)">说明</Button>
          </div>
        </template>
      </Table>
      <div class="page">
        <Page
          show-elevator
          size="small"
          :total="total"
          show-sizer
          @on-change="onPageChange"
          @on-page-size-change="onPageSizeChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { findTree } from "@/utils/tree";
import { getDataProductType } from "@/apis/dataProduct";
export default {
  data() {
    return {
      page: 1,
      limit: 10,
      total: 30,
      currentNode: {},
      imgList: [require("@/assets/img/home/p2.png")],
      columns: [
        {
          title: "名称",
          key: "name",
        },
        {
          title: "描述信息",
          key: "age",
        },
        {
          title: "创建时间",
          key: "address",
        },
        {
          title: "操作",
          slot: "action",
          width: 200,
          align: "center",
        },
      ],
      data: [
        {
          name: "John Brown",
          age: 18,
          address: "New York No. 1 Lake Park",
          date: "2016-10-03",
        },
        {
          name: "Jim Green",
          age: 24,
          address: "London No. 1 Lake Park",
          date: "2016-10-01",
        },
        {
          name: "Joe Black",
          age: 30,
          address: "Sydney No. 1 Lake Park",
          date: "2016-10-02",
        },
        {
          name: "Jon Snow",
          age: 26,
          address: "Ottawa No. 2 Lake Park",
          date: "2016-10-04",
        },
      ],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
        const formData = await getDataProductType();
      const fileList = formData.getAll("file");
      const list = JSON.parse(formData.getAll("data")[0]);
      this.list = list;
      this.handleSetCurrentNode(this.$route.query.type)
    },
    handleChangeNode(id){
       this.$router.replace(`/home/list?type=${id}`);
      this.handleSetCurrentNode(id)

    },
    handleSetCurrentNode(id){
      const node = findTree(this.list, id);
      this.currentNode = node;
    },
    handleEnter(row) {
      console.log(row);
      this.$router.push("/home/flowConfig");
    },
    handShowInstructions(row) {
      console.log(row);
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
@import "../Index/index.scss";
@import "../index.scss";
.flow_process{
    border: 1px dashed rgb(0, 111, 238);
    margin-top: 20px;
}
::v-deep .list {
  margin-top: 32px;
  .ivu-table {
    .ivu-table-header thead tr {
      th {
        background: linear-gradient(180deg, #3974aa 0%, #2f587d 100%);
        color: #fff;
        line-height: 65px;
        font-size: 14px;
        padding: 0;
        &:not(:last-child) {
          position: relative;
          &::after {
            content: "|";
            position: absolute;
            right: 0;
            top: 0;
          }
        }
        &:first-child {
          border-radius: 8px 0 0 0;
        }
        &:last-child {
          border-radius: 0 8px 0 0;
        }
      }
    }
    .ivu-table-tbody {
      td {
        background: #f7f9fa;
      }
    }
  }
}
.btn {
  button {
    line-height: 24px;
    height: 24px;
    font-size: 11px;
    padding: 0 12px;
    margin-right: 8px;
    border-radius: 8px;
    &:first-child {
      background: #006fee;
      color: #fff;
    }
    &:last-child {
      background: #f2eafa;
      border: 1px solid #6020a0;
      color: #6020a0;
      box-sizing: border-box;
    }
  }
}
.page {
  display: flex;
  justify-content: flex-end;
  margin-top: 32px;
}
</style>