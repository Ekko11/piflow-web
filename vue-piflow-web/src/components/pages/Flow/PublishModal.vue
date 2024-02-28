<template>
  <Modal
    v-model="open"
    :title="formData.id ? '编辑' : '发布'"
    :ok-text="$t('modal.ok_text')"
    :cancel-text="$t('modal.cancel_text')"
    width="600"
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
            style="width: 350px; height: 32px"
          />
        </FormItem>
        <FormItem label="描述：" prop="description">
          <Input
            v-model="formData.description"
            placeholder="Enter publish description"
          ></Input>
        </FormItem>
        <h4>选择发布组件</h4>
        <div v-for="(item, index) in stops" label="" class="stop" :key="index">
          <div class="stop_checked">
            <p>{{ item.stopName }}</p>
            <label><Checkbox v-model="item.checked"></Checkbox></label>
          </div>
          <div class="stop_props">
            <div
              v-for="(child, idx) in item.stopPublishingPropertyVos"
              :key="idx"
              class="stop_props-item"
            >
              <div class="item">
                <label>参数名称：</label>
                <Checkbox style="width: 200px" v-model="child.checked">{{
                  child.propertyName
                }}</Checkbox>
              </div>
              <div class="item">
                <label>发布名称：</label>
                <Input
                  v-model="child.name"
                  show-word-limit
                  maxlength="100"
                  :placeholder="$t('modal.placeholder')"
                  style="width: 200px"
                />
              </div>
              <div class="item">
                <label>发布类型：</label>
                <Radio-group v-model="child.type">
                  <!-- <Radio :label="0">文件</Radio>
                  <Radio :label="1">普通</Radio> -->
                  <Radio :label="1">输入</Radio>
                  <Radio :label="2">输出</Radio>
                </Radio-group>
              </div>
              <div class="item" v-if="child.type === 1">
                <label>发布类型：</label>
                <Radio-group v-model="child.type1">
                  <Radio :label="0">文件</Radio>
                  <Radio :label="1">普通</Radio>
                </Radio-group>
              </div>
              <div
                class="item"
                v-if="child.type1 === 0"
                @click="handleClickUpload(index, idx)"
              >
                <label>上传文件：</label>
                <div>
                  <Upload action="/aaa" :before-upload="handleBeforeUpload">
                    <Button icon="ios-cloud-upload-outline"
                      >Upload files</Button
                    >
                  </Upload>
                  <p>{{ child.fileName }}</p>
                </div>
              </div>
              <div class="item" v-if="child.type1 === 1">
                <label>自定义值：</label>
                <Input
                  disabled
                  v-model="child.customValue"
                  show-word-limit
                  :placeholder="$t('modal.placeholder')"
                  style="width: 200px"
                />
              </div>
            </div>
          </div>
        </div>
      </Form>
    </div>
    <div slot="footer">
      <Button @click="open = false" class="custom-btn-default">{{
        $t("modal.cancel_text")
      }}</Button>
      <Button @click="handleSaveUpdateData" class="custom-btn-primary">{{
        $t("modal.confirm")
      }}</Button>
    </div>
  </Modal>
</template>

<script>
import {
  getDataProductType,
  getStopsInfoByFlowId,
  publishingStops,
} from "@/apis/dataProduct";

import { getPublishingById } from "@/apis/flowPublish";
import { uploadFile } from "@/apis/file";

import { findTree } from "@/utils/tree";

export default {
  data() {
    return {
      formData: {},
      open: false,
      currentUpload: 0,
      stops: [],
      treeData: [],
      fileList: [],
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
    // 获取流水线组件列表
    async handleGetFlowStops(id) {
      const res = await getStopsInfoByFlowId(id);
      this.stops = res.data.data.map((v) => {
        return {
          stopId: v.id,
          stopName: v.name,
          stopBundle: v.bundel,
          checked: false,
          stopPublishingPropertyVos: v.properties.map((item) => ({
            propertyId: item.id,
            checked: false,
            propertyName: item.name,
            fileName: item.fileName,
            name: item.name,
            type: item.type,
            allowableValues: item.allowableValues,
            customValue: item.customValue,
            description: item.description,
            propertySort: item.propertySort,
            example: item.example,
          })),
        };
      });
    },
    async handleAdd(row) {
      this.$event.emit("loading", true);
      this.reSet();
      this.formData.flowId = row.id;
      this.formData.description = row.description;
      this.open = true;
      await this.handleGetFlowStops(row.id);
      this.$event.emit("loading", false);
    },

    async handleEdit(row) {
      this.reSet();
      this.open = true;
      this.$event.emit("loading", true);
      await this.handleGetFlowStops(row.flowId);
      const res = await getPublishingById(row.id);
      this.$event.emit("loading", false);
      const publishInfo = res.data.data;
      this.formData.flowId = row.flowId;
      this.formData.id = publishInfo.id;
      this.formData.name = publishInfo.name;
      this.formData.productTypeId = publishInfo.productTypeId;
      this.formData.description = publishInfo.description;
      const publishStops = publishInfo.stops;
      if (publishStops.length) {
        publishStops.forEach((item) => {
          let index = this.stops.findIndex((v) => v.stopId === item.stopId);
          this.stops[index].checked = true;
          item.stopPublishingPropertyVos.forEach((child) => {
            let idx = this.stops[index].stopPublishingPropertyVos.findIndex(
              (v) => v.propertyId === child.propertyId
            );
            this.stops[index].stopPublishingPropertyVos[idx].checked = true;
            this.stops[index].stopPublishingPropertyVos[idx].name = child.name;
            this.stops[index].stopPublishingPropertyVos[idx].fileName =
              child.fileName;
            this.stops[index].stopPublishingPropertyVos[idx].publishingId =
              child.publishingId;
            this.stops[index].stopPublishingPropertyVos[idx].type = child.type;
          });
        });
      }
      console.log(this.stops);
    },
    // 保存（编辑或者更新）
    async handleSaveUpdateData() {
      this.$event.emit("loading", true);
      // 获取分类信息
      const productNode = findTree(this.treeData, this.formData.productTypeId);
      this.formData.productTypeId = Number(this.formData.productTypeId)
      this.formData.productTypeName = productNode.name;
      this.formData.productTypeDescription = productNode.description;

      let errMsg = "";
      // 筛选stops中的选中项
      const filteredArray = this.stops
        .filter((item) => item.checked)
        .map((item) => ({
          ...item,
          stopPublishingPropertyVos: item.stopPublishingPropertyVos.filter(
            (prop) => {
              if (prop.checked) {
                if (prop.type === 1) {
                  //输出类型
                  if (prop.type === 0 && !prop.fileName) {
                    //文件
                    errMsg = `请确保组件 ${item.stopName} 的参数 ${prop.propertyName} 的文件不为空`;
                  }
                  prop.type = prop.type1;
                  delete prop.type1
                }
              }
              return prop.checked;
            }
          ),
        }));
      // 选中项空文件提示
      if (errMsg) {
        this.$Message.error({
          content: errMsg,
          duration: 3,
        });
        this.$event.emit("loading", false);
        return;
      }
      this.formData.stops = filteredArray;
      // 发布
      const res = await publishingStops(this.formData);
      //新增需要上传文件
      if (this.fileList.length) {
        const returnPropsList = res.data.data;
        if (res.data.code == 200 && returnPropsList.length) {
          let promiseList = [];
          // 多次上传文件
          this.fileList.forEach((item) => {
            const resObj = returnPropsList.find(
              (v) => v.propertyId === item.id
            );
            if (resObj) {
              const res = uploadFile({
                associateType: 3,
                associateId: resObj.id,
                file: item.file,
              });
              promiseList.push(res);
            }
          });
          // 判断多次上传文件是否成功
          Promise.all(promiseList).then((res) => {
            let errPromise = res.filter((v) => v.data.code !== 200);
            this.$event.emit("loading", false);
            if (!errPromise.length) {
              this.$Message.success({
                content: this.$t("tip.success"),
                duration: 3,
              });
              this.open = false;
              this.reSet();
            } else {
              this.$Message.error({
                content: this.$t("tip.fault_content"),
                duration: 3,
              });
              this.open = false;
            }
            console.log(res);
          });
        } else {
          this.$event.emit("loading", false);
          this.$Message.error({
            content: this.$t("tip.fault_content"),
            duration: 3,
          });
          this.open = false;
        }
      } else {
        //编辑不需要上传文件
        this.$event.emit("loading", false);
        this.open = false;
        this.$Message.success({
          content: this.$t("tip.success"),
          duration: 3,
        });
      }
    },
    reSet() {
      this.formData = {};
      this.fileList = [];
    },
    // 标记选择上传的节点
    handleClickUpload(index, idx) {
      this.currentProps = this.stops[index].stopPublishingPropertyVos[idx];
      console.log(this.currentProps);
    },
    handleBeforeUpload(e) {
      if (this.fileList.findIndex((v) => v.name === e.name) !== -1) {
        this.$Message.error({
          content: "文件名重复，请修改文件名后再上传",
          duration: 3,
        });
        return false;
      }
      this.currentProps.fileName = e.name;
      this.fileList.push({ id: this.currentProps.propertyId, file: e });
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
.item {
  margin: 12px 0px;
  display: flex;
  label {
    display: inline-block;
    width: 70px;
    text-align: right;
    margin-top: 5px;
  }
  .ivu-checkbox-wrapper {
    text-align: left;
  }
}
.stop {
  border: 1px solid #eee;
  margin-bottom: 5px;
  display: flex;
  &_checked {
    width: 160px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    border-right: 1px solid #eee;
    padding: 0 10px;
    p {
      word-break: break-all;
    }
  }
  &_props {
    flex-grow: 1;
    &-item {
      padding-left: 10px;
      border-bottom: 1px solid #eee;
      &:last-child {
        border: none;
      }
    }
  }
}
h4 {
  margin-bottom: 5px;
}
::v-deep .ivu-modal {
  max-height: 80vh;
  overflow: auto;
}
</style>

