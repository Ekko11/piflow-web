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
            v-model="formData.parentId"
            :placeholder="$t('modal.placeholder_select')"
            :normalizer="normalizer"
            :options="treeData"
            style="width: 350px; height: 32px"
          />
        </FormItem>
        <h4>选择发布组件</h4>
        <div v-for="(item, index) in stops" label="" class="stop" :key="index">
          <div class="stop_checked">
            <p>{{ item.name }}</p>
            <label><Checkbox v-model="item.checked"></Checkbox></label>
          </div>
          <div class="stop_props">
            <div
              v-for="(child, idx) in item.props"
              :key="idx"
              class="stop_props-item"
            >
              <div class="item">
                <label>参数名称：</label>
                <Checkbox style="width: 200px" v-model="child.checked">{{
                  child.name
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
                  <p>{{ child.file.name }}</p>
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
import { saveDataProduct } from "@/apis/dataProduct";
export default {
  data() {
    return {
      formData: {},
      open: true,
      currentUpload: 0,
      stops: [],
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
    this.handleAdd();
  },
  methods: {
    getTreeData() {
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
      this.treeData = data;
    },
    handleAdd(id) {
      this.open = true;
      this.stops = [
        {
          name: "CheckPoint-1707034274860",
          id: "067ce994de4c4f65b3d572c182d9b5dc",
          checked: true,
          props: [
            {
              name: "参数1",
              checked: true,
              id: "参数1的id",
              publishName: "",
              file: "",
            },
            {
              name: "参数2",
              id: "参数2的id",
              publishName: "",
              file: "",
            },
          ],
        },
        {
          name: "ExcelWriteMultipleSheetsExcelWriteMultipleSheets",
          id: "0d29686378ff4570b121d999201c473e",
          props: [
            {
              name: "参数1",
              id: "参数1的id",
              publishName: "",
              file: "",
            },
            {
              name: "参数2",
              id: "参数1的id",
              publishName: "",
              file: "",
            },
          ],
        },
        {
          name: "ExcelWriteMultipleSheets",
          id: "29cdb70fccae4076a27bb43faba917ae",
        },
        {
          name: "CheckPoint",
          id: "2b684d2c4bc04611af6a68dd914d35c2",
        },
        {
          name: "CheckPoint-1707034274860",
          id: "38ca38fe711146c787084aa2d982a352",
        },
        {
          name: "ExcelRead",
          id: "56005ead871a4ce3b69098e3c58bf2a7",
        },
        {
          name: "CheckPoint-1707034268302",
          id: "9d3440440ae84d78acf37dcfa7bbed7c",
        },
        {
          name: "CsvParser",
          id: "b41e9aa428034230bc9980b5b4e916c8",
        },
      ];
    },
    handleEdit() {},
    // 编辑或者更新
    async handleSaveUpdateData() {
      this.formData.stops = this.stops;
      let errMsg = '';
      // 筛选选中项
      const filteredArray = this.stops
        .filter((item) => item.checked)
        .map((item) => ({
          ...item,
          props: item.props.filter((prop) => {
            if (prop.checked && !prop.file){
              errMsg = `请确保组件 ${item.name} 的参数 ${prop.name} 的文件不为空`
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
      console.log(errMsg, filteredArray);
      // const data= this.objectToFormData(filteredArray)

      // const formData = new FormData();
      // formData.append("stops", this.stops);
      // const res = await saveDataProduct(data);

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
      this.currentProps = this.stops[index].props[idx];
    },
    handleBeforeUpload(e) {
      this.currentProps.file = e;
      console.log(e, this.currentUpload);
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

