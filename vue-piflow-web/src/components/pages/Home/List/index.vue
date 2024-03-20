<template>
  <div class="content">
    <!-- <div class="parentList" v-if="parentList.length" >
      <p v-for="(item,index) in parentList" :key="item.id"  class="return"  @click="handleChangeNode(item.id)">
        <span class="name"> {{ item.name }}</span>
        <span class="legend" v-if="index !== parentList.length -1"><Icon type="ios-arrow-forward" /></span>
      </p>
    </div> -->
    <h4 class="content_title">
      <span @click="$router.push('/home')" style="cursor: pointer;text-decoration: underline;">{{
        parentList.length && parentList[0].name
      }}</span>
      >>
      <span style="color:rgb(82, 82, 91)">{{ currentNode.name }}</span>
    </h4>
    <div class="desc">
      {{ currentNode.description }}
    </div>

    <!-- <div v-if="currentNode.children && currentNode.children.length" class="process flow_process" >
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
    </div> -->

    <div class="list">
      <Table :columns="columns" :data="tableData">
        <template slot-scope="{ row }" slot="action">
          <div class="btn">
            <Button @click="handleEnter(row)">进入</Button>
            <Button v-if="row.instructionFileId" @click="handShowInstructions(row)">说明</Button>
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
import { findTree, findTreeStructure } from "@/utils/tree";
import { getDataProductType } from "@/apis/dataProduct";
import { getflowPublishListByProductTypeId } from "@/apis/flowPublish";
import { getProcessPageByPublishingId } from "@/apis/process";
import { downloadFile } from "@/apis/file";
import Cookies from "js-cookie";
export default {
  data() {
    return {
      page: 1,
      limit: 10,
      total: 0,
      tableData: [],
      parentList: [],
      currentNode: {},
      imgList: [require("@/assets/img/home/p2.png")],
      columns: [
        {
          title: "名称",
          key: "name",
        },
        {
          title: "描述信息",
          key: "description",
          className:'desc',
        },
        {
          title: "所属类型",
          key: "productTypeName",
        },
        {
          title: "创建时间",
          key: "crtDttm",
          width:'180',
          align: "center",
        },
        {
          title: "操作",
          slot: "action",
          width: 200,
          align: "center",
        },
      ],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      const res = await getDataProductType();
      this.list = res.data.data;
      this.handleSetCurrentNode(this.$route.query.type);
    },
    handleChangeNode(id) {
      this.$router.replace(`/home/list?type=${id}`);
      this.handleSetCurrentNode(id);
    },
    handleSetCurrentNode(id) {
      //获取当前节点
      const node = findTree(this.list, id);
      this.currentNode = node;
      //获取当前节点及直系父节点
      let nodeList = findTreeStructure(
        this.list,
        (node) => node.id === id,
        true
      );
      const parentList = [];
      let child = nodeList[0];
      while (child) {
        parentList.push(child);
        child = Array.isArray(child.children) ? child.children[0] : undefined;
      }
      parentList.pop();
      this.parentList = parentList;

      this.getTableData();
    },
    async getTableData() {
      const data = {
        page: this.page,
        limit: this.limit,
        productTypeId: this.currentNode.id,
      };
      const res = await getflowPublishListByProductTypeId(data);
      this.tableData = res.data.data;
      this.total = res.data.count;
    },
    async handleEnter(row) {
      if (Cookies.get("setUser")) {
        this.$event.emit("loading", true);
        const res = await getProcessPageByPublishingId({limit:10,page:1,publishingId:row.id});
        this.$event.emit("loading", false);
        let link;
        if (res.data.data.length && res.data.data[0].state && (res.data.data[0].state.text === "STARTED" || res.data.data[0].state.text === "INIT"  )) {  //如果正在运行，直接进入运行界面
          link = `/home/flowProcess?processId=${res.data.data[0].id}&type=${this.$route.query.type}`;
        } else {
          link = `/home/flowConfig?id=${row.id}&type=${this.$route.query.type}`;
        }
        this.$router.push(link);

      } else {
        this.$router.push({
          path: "/login",
          query: { redirect: `/home/list?type=${this.$route.query.type}` },
        });
      }
    },
    async handShowInstructions(row) {
      this.$event.emit('loading',true)
      const res = await downloadFile(row.instructionFileId);
      // 将文件流转化为本地blod地址
      var binaryData = [];
      binaryData.push(res.data);
      // 记得一定要设置application的类型
      let url = window.URL.createObjectURL(
        new Blob(binaryData, {
          type: "application/pdf;charset=utf-8",
        })
      );
      if (url != null && url != undefined && url) {
        const { href } = this.$router.resolve({
          path: "/pdf",
          query: {
            url: url,
          },
        });
        // 新页面打开
        window.open(href, "_blank");
      }
      this.$event.emit('loading',false)
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
.flow_process {
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
.parentList {
  display: flex;
  .name {
    color: #3974aa;
    cursor: pointer;
  }
  .legend {
    margin: 0 4px;
  }
}


::v-deep  .desc span{
    display: -webkit-box;  
    -webkit-line-clamp: 2;  
    -webkit-box-orient: vertical;  
    overflow: hidden;  
    text-overflow: ellipsis;  
}
</style>