<template>
    <section class="content">
      <div class="contain">
        <div class="contain_l">
          <Tree
            :data="treeData"
            :render="renderContent"
            expand-node
            @on-select-change="handleChangeSelectNode"
          ></Tree>
        </div>
        <div class="contain_r">
          <div class="navbar">
            <div class="left">
              <span>{{ parentNode.name }}</span>
            </div>
          </div>
          <Table :data="tableData" :columns="columns">
            <template slot-scope="{ row }" slot="action">
              <div class="btn">
                <Icon @click="handleSet(row)" :type="row.preference === 1?'ios-heart':'ios-heart-outline'" />
              </div>
            </template>
          </Table>
        </div>
      </div>
  

    </section>
  </template>
  <script>
  import { getDataProductType,setDataProductPreference } from "@/apis/dataProduct";
  
  export default {
    data() {
      return {
        isOpen: false,
        parentNode: {},
        treeData: [],
        tableData: [],
        columns: [
          {
            title: "名称",
            key: "name",
          },
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
      this.handleGetData();
    },
    methods: {
     async handleSet(row){
        const data = {
            id:row.id,
            preference: row.preference === 2?1:2
        }
        const res = await setDataProductPreference(data)
     },
      async handleGetData() {
        const res = await getDataProductType();
        this.treeData = [
          {
            name: "数据产品分类",
            id: 0,
            expand: true,
            level:0,
            children: res.data.data,
            ischecked: true,
          },
        ];
        this.handleChangeSelectNode(null, this.treeData[0]);
        this.parentNode = this.treeData[0];
      },
      handleChangeSelectNode(list, node) {
        this.parentNode = node;
        this.tableData = node.children?.map((v) => {
          const obj = {...v}
          delete obj.children
          return obj
        });
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