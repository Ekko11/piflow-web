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
            <span>{{ currentNode.name }}</span>
          </div>
          <div class="right">
            <span class="button-warp" @click="handleAddChild(currentNode)">
              <Icon type="md-add" />
            </span>
          </div>
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
      </div>
    </div>

    <!-- add / update -->
    <Modal
      v-model="isOpen"
      :title="
        formData.id ? '编辑' : '新增'
      "
      :ok-text="$t('modal.ok_text')"
      :cancel-text="$t('modal.cancel_text')"
      @on-ok="handleComfirm"
    >
      <div class="modal-warp">
        <div class="item">
          <label>上级分类：</label>
          <treeselect
            v-model="formData.parentId"
            :placeholder="$t('modal.placeholder_select')"
            :normalizer="normalizer"
            :options="treeData"
            style="width: 350px"
          />
        </div>
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
          <label class="self">描述：</label>
          <Input
            v-model="formData.description"
            type="textarea"
            :rows="4"
            :placeholder="$t('modal.placeholder')"
            style="width: 350px"
          />
        </div>
      </div>
    </Modal>
  </section>
</template>
<script>
export default {
  data() {
    return {
      isOpen: false,

      InitFormData: {
        id: "",
        description: "",
        name: "",
        parentId: "",
      },
      formData: {},
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
      buttonProps: {
        type: "default",
        size: "small",
        type: "text",
      },
    };
  },
  created() {
    this.handleGetData();
  },
  methods: {

    handleComfirm() {
      if (this.formData.id) {
        // this.handleUpdate()
      } else {
        // this.handleAdd()
      }
    },

    handleAddChild(node) {
      this.isOpen = true;
      this.formData = { ...this.InitFormData };
      this.formData.parentId = node ? node.id : "";
    },
    handleEdit(node) {
      this.isOpen = true;
      this.formData = node;
      this.formData.parentId = this.currentNode.id
    },
    handleGetData() {
      const data = [
        {
          name: "生态系统要素数据",
          id: 1,
          children: [
            {
              name: "大气环境要素",
              id: 3,
            },
            {
              name: "生物要素",
              id: 4,
            },
          ],
        },
        {
          name: "生态系统服务功能数据",
          id: 2,
          children: [
            {
              name: "生产力和固碳功能",
              id: 5,
            },
            {
              name: "生物多样性维护功能生物多样性维护功能",
              id: 6,
            },
          ],
        },
      ];
      this.treeData = [
        {
          name: "数据产品分类",
          id:999,
          expand: true,
          children:data,
          ischecked:true
        }
      ]
      this.handleChangeSelectNode(null, this.treeData[0]);
      this.currentNode = this.treeData[0];
    },
    handleChangeSelectNode(list, node) {
      this.currentNode = node;
      this.tableData = node.children?.map(v=>({
        name:v.name,
        id:v.id
      }));
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
      .button{
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
    .btn{
      button{
        margin-right: 5px;
      }
    }
  }
}
</style>