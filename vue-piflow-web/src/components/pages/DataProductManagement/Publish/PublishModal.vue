<template>

  <Modal
  v-model="open"
  title="编辑"
  :ok-text="$t('modal.ok_text')"
  :cancel-text="$t('modal.cancel_text')"
  @on-ok="handleComfirm"
>
  <div class="modal-warp">
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
      <label class="self">分类：</label>
      <treeselect
        v-model="formData.productTypeId"
        :placeholder="$t('modal.placeholder_select')"
        :normalizer="normalizer"
        :options="treeData"
        :flat="true"
        style="width: 350px"
      />
    </div>
    <div class="item">
      <label>权限：</label>
      <Select v-model="formData.permission"  style="width: 350px">
        <Option :value="0">公开</Option>
        <Option :value="1">授权</Option>
      </Select>
    </div>
    <div class="item">
      <label>简介：</label>
      <Input
        v-model="formData.description"
        type="textarea"
        :rows="4"
        :placeholder="$t('modal.placeholder')"
        style="width: 350px"
      />
    </div>
    <div class="item">
      <label>关键词：</label>
      <Input
        v-model="formData.keyword"
        show-word-limit
        maxlength="100"
        :placeholder="$t('modal.placeholder')"
        style="width: 350px"
      />
    </div>

    <div class="item">
      <label>发布者姓名：</label>
      <Input
        v-model="formData.sdPublisher"
        show-word-limit
        maxlength="100"
        :placeholder="$t('modal.placeholder')"
        style="width: 350px"
      />
    </div>

    <div class="item">
      <label>发布者邮箱：</label>
      <Input
        v-model="formData.email"
        show-word-limit
        maxlength="100"
        :placeholder="$t('modal.placeholder')"
        style="width: 350px"
      />
    </div>

    <div class="item">
      <label class="self">封面：</label>
      <Upload
        action="/null"
        :before-upload="handleFileBefore"
        :show-upload-list="false"
        style="width: 350px"
        class="upload"
      >
        <div>
          <img
            v-if="this.file"
            style="width: 100px;"
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
</Modal>
</template>

<script>
import {
  getDataProductType,saveDataProduct
} from "@/apis/dataProduct";

export default {
  data() {
    return {
      formData: {},
      open: false,
      treeData: [],
      file:'',
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
      this.formData = {
        name:row.flowPublishing.name,
        description:row.flowPublishing.description,
        productTypeId:row.flowPublishing.productTypeId,
        productTypeName:row.flowPublishing.productTypeName,
        version:row.dataProductList[0].version,
        state:3,
        id:row.dataProductList[0].id
      }
      this.open = true;
    },

    async handleEdit(row) {
      const { id,name,productTypeId,productTypeName,keyword,description,permission,sdPublisher,email,state,version} = row
      this.formData = { id,name,productTypeId,productTypeName,keyword,description,permission,sdPublisher,email,state,version}
      this.open = true;

    },
    // 保存
    async handleComfirm() {
      console.log(this.formData)
      this.$event.emit("loading", true);
      const res = await saveDataProduct(this.formData);
      this.$event.emit("loading", false);
      if(res.data.code === 200){
        this.$Message.success({
              content: res.data.errorMsg,
              duration: 3
        });
        this.$emit('onSubmit')
      }else{
        this.$Message.error({
              content: res.data.errorMsg,
              duration: 3
        });
      }
      this.$emit('loading',false)
    },

    // 手动上传
    handleFileBefore(file) {
      this.formData.file = file;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.file = reader.result;
      };
      return false;
    },
    normalizer(node) {
      return {
        id: node.id,
        label: node.name,
        isDisabled: node.parentId == 0,
        children:
          node.children && node.children.length ? node.children : undefined,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";


</style>

