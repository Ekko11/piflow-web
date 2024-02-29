<template>

    
  <Modal
    v-model="open"
    :title="formData.id ? '编辑' : '发布'"
    :ok-text="$t('modal.ok_text')"
    :cancel-text="$t('modal.cancel_text')"
    width="600"
    @on-ok="handleSaveUpdateData"
  >
    <div class="modal-warp">
      <Form
        ref="formValidate"
        :model="formData"
        :rules="ruleValidate"
        :label-width="120"
      >
        <FormItem label="发布名称：" prop="name">
          <Input
            v-model="formData.name"
            placeholder="Enter publish name"
          ></Input>
        </FormItem>
        <FormItem label="分类：" prop="name">
          <treeselect
            v-model="formData.productTypeId"
            :placeholder="$t('modal.placeholder_select')"
            :normalizer="normalizer"
            :options="treeData"
            style="width: 100%; height: 32px"
          />
        </FormItem>
        <FormItem label="描述：" prop="description">
          <Input
            v-model="formData.description"
            placeholder="Enter publish description"
          ></Input>
        </FormItem>

      </Form>
    </div>
    </Modal>
</template>

<script>
import {
  getDataProductType,
} from "@/apis/dataProduct";
import { uploadFile } from "@/apis/file";
import { findTree } from "@/utils/tree";

export default {
  data() {
    return {
      formData: {},
      open: false,
      treeData: [],
      ruleValidate: {
        name: [
          {
            required: true,
            message: "The name cannot be empty",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getTreeData();
  },
  methods: {
    // 获取数据产品分类
    async getTreeData() {
      const res = await getDataProductType();
      this.treeData = res.data.data;
    },

    async handleAdd(row) {
      this.open = true;
    },

    async handleEdit(row) {
      this.formData = {}
      this.open = true;

    },
    // 保存（编辑或者更新）
    async handleSaveUpdateData() {

    },

    handleBeforeUpload(e) {
      this.file = e
      return false;
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

</style>

