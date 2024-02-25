<template>
  <Modal
    v-model="open"
    :title="formData.id ? '编辑' : '发布'"
    :ok-text="$t('modal.ok_text')"
    :cancel-text="$t('modal.cancel_text')"
  >
    <div class="modal-warp">
      <Form
        ref="formValidate"
        :model="formData"
        :rules="ruleValidate"
        :label-width="120"
      >
        <FormItem label="发布名称：" prop="name">
          <Input v-model="formData.name" placeholder="Enter your name"></Input>
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
                  child.stopPublishingPropertyName
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
              <div class="item" @click="handleClickUpload(index, idx)">
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
import { getDataProductType,getStopsInfoByFlowId,publishingStops } from "@/apis/dataProduct";
import { findTree } from '@/utils/tree';

export default {
  data() {
    return {
      formData: {},
      open: false,
      currentUpload: 0,
      stops: [],
      treeData:[],
      fileList:[],
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
  async getTreeData() {
      const formData = await getDataProductType();
      const data = JSON.parse(formData.getAll("data")[0]);
      this.treeData = data;
    },
    async handleAdd(id) {
      this.formData.flowId = id
      this.open = true;
      const  res = await getStopsInfoByFlowId(id)
      console.log(res)
      this.stops =res.data.data.map(v=>{
        return {
          stopId:v.id,
          stopName:v.name,
          stopPublishingPropertyVos:v.properties.map(item=>({
            propertyId:item.id,
            stopPublishingPropertyName:item.name,
            fileName:item.fileName,
            name:item.name,
          }))
        }
      })
    },
    handleEdit() {
      this.open = true;
    },
    // 编辑或者更新
    async handleSaveUpdateData() {
      const productNode = findTree(this.treeData,this.formData.productTypeId)
      this.formData.productTypeName = productNode.name
      this.formData.productTypeDescription = productNode.description

      let errMsg = '';
      // 筛选选中项
      const filteredArray = this.stops
        .filter((item) => item.checked)
        .map((item) => ({
          ...item,
          stopPublishingPropertyVos: item.stopPublishingPropertyVos.filter((prop) => {
            if (prop.checked && !prop.fileName){
              errMsg = `请确保组件 ${item.stopPublishingPropertyName} 的参数 ${prop.stopPublishingPropertyName} 的文件不为空`
            };
            return prop.checked;
          }),
        }));
        if(errMsg){
          this.$Message.error({
                  content: errMsg,
                  duration: 3,
          });
          return 
        }
        this.formData.stops = filteredArray
      console.log(this.formData,filteredArray);
      const formData = new FormData()
      this.fileList.forEach(v => {
        formData.append('files',v)
      });
        formData.append('flowPublishingVo',JSON.stringify(this.formData))
      // const data= this.objectToFormData(filteredArray)

      // const formData = new FormData();
      // formData.append("stops", this.stops);
      const res = await publishingStops(formData);
      console.log(res)
      // console.log(this.formData, this.stops);
    },
    // 将对象递归转换为formData
    objectToFormData(obj, form, namespace) {
      var fd = form || new FormData();
      var formKey;
      if (obj instanceof Array) {
        for (var item of obj) {
          if (typeof item === "object" && !(item instanceof File)) {
            this.objectToFormData(item, fd, namespace + "[]");
          } else {
            // 若是数组则在关键字后面加上[]
            fd.append(namespace + "[]", item);
          }
        }
      } else {
        for (var property in obj) {
          if (obj.hasOwnProperty(property) && obj[property]) {
            if (namespace) {
              // 若是对象，则这样
              formKey = namespace + "[" + property + "]";
            } else {
              formKey = property;
            }
            if (
              typeof obj[property] === "object" &&
              !(obj[property] instanceof File)
            ) {
              // 此处将formKey递归下去很重要，因为数据结构会出现嵌套的情况
              this.objectToFormData(obj[property], fd, formKey);
            } else {
              // if it's a string or a File object
              fd.append(formKey, obj[property]);
            }
          }
        }
      }
      return fd;
    },
    // 标记选择上传的节点
    handleClickUpload(index, idx) {
      this.currentProps = this.stops[index].stopPublishingPropertyVos[idx];
    },
    handleBeforeUpload(e) {
      if(this.fileList.findIndex(v=>v.name === e.name) !== -1){
        this.$Message.error({
                  content: '文件名重复，请修改文件名后再上传',
                  duration: 3,
          });
          return false
      }
      this.currentProps.fileName = e.name;
      this.fileList.push(e)
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

