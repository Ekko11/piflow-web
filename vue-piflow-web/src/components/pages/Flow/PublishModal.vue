<template>
  <Drawer
    width="600"
    :title="formData.id ? '编辑' : '发布'"
    :scrollabl="true"
    :closable="false"
    v-model="open"
  >
    <!-- 
  <Modal
    v-model="open"
    :title="formData.id ? '编辑' : '发布'"
    :ok-text="$t('modal.ok_text')"
    :cancel-text="$t('modal.cancel_text')"
    width="600"
    @on-ok="handleSaveUpdateData"
  > -->
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
            :flat="true"
            style="width: 100%; height: 32px"
          />
        </FormItem>
        <FormItem label="描述：" prop="description">
          <Input
            v-model="formData.description"
            placeholder="Enter publish description"
          ></Input>
        </FormItem>

        <FormItem label="封面：" prop="coverFile">
          <Upload
            action="/null"
            :before-upload="handleBeforeCoverFileUpload"
            :show-upload-list="false"
            style="width: 350px"
            accept=".jpg, .jpeg, .png"
            class="upload"
          >
            <div>
              <img
                v-if="this.coverFileImg"
                style="width: 100px;"
                :src="this.coverFileImg"
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
        </FormItem>

        <FormItem label="说明书：" prop="coverFile">
          <Upload
            action="/aaa"
            accept=".pdf"
            :before-upload="handleBeforeinstructionFileUpload"
          >
            <Button icon="ios-cloud-upload-outline">Upload files</Button>
          </Upload>
          <p v-if="instructionFile">{{ instructionFile.name}}</p>
          <p v-if="!instructionFile && formData.instructionFileName">{{ formData.instructionFileName }}</p>
        </FormItem>

        <h4>选择发布组件</h4>

        <Collapse simple>
          <Panel :name="item.id" v-for="(item, index) in stops" :key="index">
            <span>
              <input type="checkbox" class="checkbox" @click.stop="item.checked = !item.checked" :checked="item.checked">
              {{ item.stopName }}</span
            >

            <div slot="content">
              <Collapse simple>
                <Panel
                  :name="child.id"
                  v-for="(child, idx) in item.stopPublishingPropertyVos"
                  :key="idx"
                >
                  <span>
                  <input type="checkbox" class="checkbox" @click.stop="child.checked = !child.checked" :checked="child.checked">
                    {{ child.propertyName }}</span
                  >
                  <div slot="content">
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
                      <Cascader
                        :data="cascaderData"
                        trigger="hover"
                        v-model="child.cascaderType"
                      ></Cascader>
                    </div>
                    <div
                      class="item"
                      v-if="child.cascaderType[1] === 0"
                      @click="handleClickUpload(index, idx)"
                    >
                      <label>上传文件：</label>
                      <div>
                        <Upload
                          action="/aaa"
                          :before-upload="handleBeforeUpload"
                        >
                          <Button icon="ios-cloud-upload-outline"
                            >Upload files</Button
                          >
                        </Upload>
                        <p>{{ child.fileName }}</p>
                      </div>
                    </div>
                    <div class="item" v-if="child.cascaderType[1] === 1">
                      <label>自定义值：</label>
                      <Input
                        disabled
                        v-model="child.customValue"
                        :placeholder="$t('modal.placeholder')"
                        style="width: 200px"
                      />
                    </div>
                  </div>
                </Panel>
              </Collapse>
            </div>
          </Panel>
        </Collapse>
      </Form>
    </div>
    <div class="footer">
      <Button @click="open = false" class="custom-btn-default">{{
        $t("modal.cancel_text")
      }}</Button>
      <Button @click="handleSaveUpdateData" class="custom-btn-primary">{{
        $t("modal.confirm")
      }}</Button>
    </div>
    <!-- </Modal> -->
  </Drawer>
</template>

<script>
import { getDataProductType, getStopsInfoByFlowId } from "@/apis/dataProduct";

import { getPublishingById, publishingStops } from "@/apis/flowPublish";
import { uploadFile,downloadFile  } from "@/apis/file";

import { findTree } from "@/utils/tree";

export default {
  data() {
    return {
      formData: {},
      open: false,
      currentUpload: 0,
      coverFile: null,
      coverFileImg: null,
      instructionFile: null,
      stops: [],
      treeData: [],
      fileList: [],
      cascaderData: [
        {
          label: "输入",
          value: 1,
          children: [
            {
              label: "文件输入",
              value: 0,
            },
            {
              label: "普通输入",
              value: 1,
            },
          ],
        },
        {
          label: "输出",
          value: 2,
        },
      ],
      ruleValidate: {
        name: [
          {
            required: true,
            message: "The name cannot be empty",
            trigger: "blur",
          },
        ],
        coverFile: [
          {
            required: true,
            message: "The coverFile cannot be empty",
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
            cascaderType: [],
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
      const {id,name,productTypeId,description,version,coverFileId,instructionFileName} = publishInfo
      this.formData = {
        flowId:row.flowId,
        id,name,productTypeId,description,version,instructionFileName
      }
      this.getCoverFileImg(coverFileId)
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
            this.stops[index].stopPublishingPropertyVos[idx].id = child.id;
            this.stops[index].stopPublishingPropertyVos[idx].name = child.name;
            this.stops[index].stopPublishingPropertyVos[idx].fileId =
              child.fileId;
            this.stops[index].stopPublishingPropertyVos[idx].fileName =
              child.fileName;
            this.stops[index].stopPublishingPropertyVos[idx].version =
              child.version;
            this.stops[index].stopPublishingPropertyVos[idx].publishingId =
              child.publishingId;
            this.stops[index].stopPublishingPropertyVos[idx].type = child.type;
            this.stops[index].stopPublishingPropertyVos[idx].cascaderType =
              child.type === 2 ? [child.type] : [1, child.type];
          });
        });
      }
      console.log(this.stops);
    },

  async  getCoverFileImg(id){
    if(!id) return 
      const res =await downloadFile(id)
      const reader = new FileReader();
      reader.readAsDataURL(res.data);
      reader.onload = () => {
        this.coverFileImg = reader.result;
      };
    },
    // 保存（编辑或者更新）
    async handleSaveUpdateData() {
      if(!this.formData.productTypeId || !this.formData.name){
        this.$refs.formValidate.validate((valid) => {})
        this.$Message.error({
          content: '请按要求填写表单',
          duration: 3,
        });
        return 
      }
      // 获取分类信息
      const productNode = findTree(this.treeData, this.formData.productTypeId);
      this.formData.productTypeId = Number(this.formData.productTypeId);
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
                //输入类型
                if (prop.cascaderType.length === 2) {
                  if (prop.cascaderType[1] === 0 && !prop.fileName) {
                    //文件
                    errMsg = `请确保组件 ${item.stopName} 的参数 ${prop.propertyName} 的文件不为空`;
                  }
                  prop.type = prop.cascaderType[1];
                } else {
                  prop.type = prop.cascaderType[0];
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
      if(!this.formData.stops.length){
        this.$Message.error({
          content: '请至少选择一个组件',
          duration: 3,
        });
        return
      }
      // 发布
      this.$event.emit("loading", true);

      const res = await publishingStops(this.formData);
      if(res.data.code === 200){
      //需要上传文件
      let promiseList = [];
      if (this.fileList.length || this.coverFile || this.instructionFile) {
        const returnPropsList = res.data.data;
        if (returnPropsList.length &&
          this.fileList.length
        ) {
          // 多次上传文件
          this.fileList.forEach((item) => {
            const resObj = returnPropsList.find(
              (v) => v.propertyId === item.id
            );
            if (resObj) {
              // 组件stop上传文件
              const res = uploadFile({
                associateType: 3,
                associateId: resObj.id,
                file: item.file,
              });
              promiseList.push(res);
            }
          });
        } 

        // 上传封面文件
        if (this.coverFile) {
          const coverFileRes = uploadFile({
            associateType: 5,
            associateId: res.data.data[0].publishingId,
            file: this.coverFile,
          });
          promiseList.push(coverFileRes);
        }
        // 上传说明书
        if (this.instructionFile) {
          const instructionFileRes = uploadFile({
            associateType: 6,
            associateId: res.data.data[0].publishingId,
            file: this.instructionFile,
          });
          promiseList.push(instructionFileRes);
        }

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
        //编辑不需要上传文件
        this.$event.emit("loading", false);
        this.open = false;
        this.$Message.success({
          content: this.$t("tip.success"),
          duration: 3,
        });
      }
    }else {
          this.$event.emit("loading", false);
          this.$Message.error({
            content: this.$t("tip.fault_content"),
            duration: 3,
          });
          this.open = false;
        }

    },
    reSet() {
      this.formData = {
        name:null,
        productTypeId:null,
        description:null,
      };
      this.$refs.formValidate.resetFields();
      this.fileList = [];
      this.coverFile = null;
      this.coverFileImg = null;
      this.instructionFile = null;
    },
    // 标记选择上传的节点
    handleClickUpload(index, idx) {
      this.currentProps = this.stops[index].stopPublishingPropertyVos[idx];
    },
    handleBeforeCoverFileUpload(e) {
      this.coverFile = e;
      const reader = new FileReader();
      reader.readAsDataURL(e);
      reader.onload = () => {
        this.coverFileImg = reader.result;
      };
      return false;
    },
    handleBeforeinstructionFileUpload(e) {
      this.instructionFile = e;
      return false;
    },
    handleBeforeUpload(e) {
      this.currentProps.fileName = e.name;
      this.fileList.push({ id: this.currentProps.propertyId, file: e });
      return false;
    },
    handleCheckboxClick(item){
      console.log(this.stops)
      this.$set(item,'checked',!item.checked)
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

.ivu-collapse {
  border: 0;
  > .ivu-collapse-item {
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.06);
    border: none;
    margin: 0 10px 5px;
  }
}
.checkbox{
  position: relative;
  top: 1px;
}

h4 {
  margin-bottom: 5px;
}
::v-deep .ivu-modal {
  max-height: 80vh;
  overflow: auto;
}

::v-deep .ivu-drawer-body {
  height: calc(100% - 51px);
  background: rgb(247, 248, 250);
  padding: 0;
  input {
    border-radius: 6px;
  }
  .modal-warp {
    padding: 16px;
    height: calc(100% - 40px);
    overflow: auto;
  }
  .footer {
    height: 40px;
    padding-left: 20px;
    border-top: 1px solid #dedede;
    display: flex;
    align-items: center;
    button {
      margin-right: 10px;
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

