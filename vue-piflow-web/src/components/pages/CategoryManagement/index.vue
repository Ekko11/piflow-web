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
          <div class="right">
            <span class="button-warp" @click="handleAddChild(parentNode)">
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
      :title="formData.id ? '编辑' : '新增'"
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
        <div class="item">
          <label>上传封面：</label>
          <div>
            <Upload
              action="/null"
              :before-upload="handleBeforeUpload"
              :show-upload-list="false"
              style="width: 350px"
              accept=".jpg, .jpeg, .png"
              class="upload"
            >
              <div>
                <img
                  v-if="this.file"
                  style="width: 100px; height: 40px"
                  :src="this.file"
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
      </div>
    </Modal>
  </section>
</template>
<script>
import {
  getDataProductType,
  saveDataProductType,
  deleteDataProductType,
} from "@/apis/dataProduct";
import { findTree } from "@/utils/tree";
import {downloadFile} from '@/apis/file'
export default {
  data() {
    return {
      isOpen: false,
      file:null,
      InitFormData: {
        description: "",
        name: "",
        parentId: "",
        file: "",
      },
      formData: {},
      parentNode: {},
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
    async handleComfirm() {
      this.$event.emit("loading", true);
      if (!this.formData.id) this.formData.level = this.parentNode.level + 1;
      this.formData.associateType = 0;
      const res = await saveDataProductType(this.formData);
      this.$event.emit("loading", false);
      if (res.data.code == 200) {
        this.$Modal.success({
          title: this.$t("tip.title"),
          content: this.$t("tip.update_success_content"),
        });
        this.handleGetData();
      } else {
        this.$Modal.error({
          title: this.$t("tip.title"),
          content: this.$t("tip.update_fail_content"),
        });
      }
      console.log(res);
    },

    handleDelete(row) {
      this.$Modal.confirm({
        title: this.$t("tip.title"),
        okText: this.$t("modal.confirm"),
        cancelText: this.$t("modal.cancel_text"),
        content: `${this.$t("modal.delete_content")} ${row.name}?`,
        onOk: async () => {
          const res = await deleteDataProductType(row.id);
          if (res.data.code === 200) {
            this.$Modal.success({
              title: this.$t("tip.title"),
              content: `${row.name} ` + this.$t("tip.delete_success_content"),
            });
            this.handleGetData();
          } else {
            this.$Message.error({
              content: this.$t("tip.delete_fail_content"),
              duration: 3,
            });
          }
        },
      });
    },

    handleAddChild(node) {
      this.isOpen = true;
      this.formData.file = null;
      this.formData = { ...this.InitFormData };
      this.formData.parentId = node ? node.id : "";
    },
    async handleEdit(row) {
      this.isOpen = true;
      const { id, parentId, level, name, description} = row;
      this.formData = { id, parentId, level, name, description};
      if(row.fileId){
        const res =await downloadFile(row.fileId)
        this.renderImg(res.data)
      }
    },
    async handleGetData() {
      const res = await getDataProductType();
      const data = res.data.data;
      this.treeData = [
        {
          name: "数据产品分类",
          id: 0,
          expand: true,
          level: 0,
          children: data,
          ischecked: true,
        },
      ];
      this.handleChangeSelectNode(null, this.treeData[0]);
      this.parentNode = this.treeData[0];
    },
    handleChangeSelectNode(list, node) {
      this.parentNode = node;
      this.tableData = node.children?.map((v) => {
        const obj = { ...v };
        delete obj.children;
        return obj;
      });
    },
    handleBeforeUpload(e) {
      this.formData.file = e;
      this.renderImg(e)
      return false;
    },
    renderImg(file){
      console.log(file)
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.file = reader.result;
      };
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

.upload {
  background: #fff;
  border: 1px dashed #dcdee2;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
  width: 350px;
  padding: 20px 0;
}
</style>