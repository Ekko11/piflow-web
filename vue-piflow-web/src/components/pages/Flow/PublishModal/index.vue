<template>
  <Drawer
    width="90%"
    :title="formData.id ? '编辑' : '发布'"
    :scrollabl="true"
    :closable="false"
    v-model="open"
  >
    <!-- content  -->
    <div class="content">
      <!-- 左 -->
      <div class="content_l">
        <h4>组件列表</h4>
        <div>
          <ul>
            <li
              v-for="(item, index) in stops"
              :key="index"
              @click="currentStop = item"
            >
              <span>
                <Icon
                  v-if="item.checked"
                  style="color: #2f7ae1; font-size: 16px"
                  type="md-checkbox-outline"
                />
                {{ item.stopName }}</span
              >
            </li>
          </ul>
        </div>
      </div>

      <!-- 中 -->
      <div class="content_m">
        <h4>属性列表</h4>
        <template v-if="currentStop">
          <div
            v-for="(child, idx) in currentStop.stopPublishingPropertyVos"
            :key="idx"
            class="stop_item"
          >
            <h4>
              <span>
                <input
                  type="checkbox"
                  class="checkbox"
                  @click="handleCheckboxClick($event, child)"
                  :checked="child.checked"
                />
                {{ child.propertyName }}</span
              >
            </h4>

            <div class="stop_item-content">
              <div class="item">
                <label>发布名称：</label>
                <Input
                  v-model="child.name"
                  show-word-limit
                  maxlength="100"
                  :placeholder="$t('modal.placeholder')"
                  style="width: 300px"
                />
              </div>
              <div class="item">
                <label>发布描述：</label>
                <Input
                  v-model="child.description1"
                  type="textarea"
                  :rows="3"
                  :placeholder="child.description"
                  style="width: 300px"
                />
              </div>
              <div class="item">
                <label>发布类型：</label>
                <Cascader
                  :data="cascaderData"
                  trigger="hover"
                  style="width: 300px"
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
                  <Upload action="/aaa" :before-upload="handleBeforeUpload">
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
                  style="width: 300px"
                />
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- 右 -->
      <div class="content_r">
        <h4>发布信息</h4>

        <Collapse simple>
          <Panel name="1">
            发布信息
            <div slot="content">
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
                    type="textarea"
                    :rows="3"
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
                        style="width: 100px"
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
                    <Button icon="ios-cloud-upload-outline"
                      >Upload files</Button
                    >
                  </Upload>
                  <p v-if="instructionFile">{{ instructionFile.name }}</p>
                  <p v-if="!instructionFile && formData.instructionFileName">
                    {{ formData.instructionFileName }}
                  </p>
                </FormItem>
              </Form>
            </div>
          </Panel>

          <Panel name="2">
            组件分组
            <div slot="content">
              <h4>当前已选中组件</h4>
              <!-- 待选列表 -->
              <div>
                <ul class="drop_content" @dragover.prevent @drop="handleDrop($event,waitingList)">
                  <li
                    v-for="item in waitingList"
                    :key="item.id"
                    draggable="true"
                    @dragstart="handleDropStart($event,item,waitingList)"
                  >
                    <p>{{ item.stopName }}</p>
                  </li>
                </ul>
              </div>

              <h4>分组列表</h4>

              <div v-for="(item,index) in groupList" :key="index">
                <div class="item">
                  <label>分组名称：</label>
                  <Input
                    v-model="item.name"
                    show-word-limit
                    maxlength="100"
                    :placeholder="$t('modal.placeholder')"
                    style="width: 300px"
                  />
                </div>
                <div class="drop_content"  @dragover.prevent @drop="handleDrop($event,item.list)">
                    <p v-for="child in item.list" :key="child.stopId"                      
                    draggable="true"
                    @dragstart="handleDropStart($event,child,item.list)">{{child.stopName}}</p>
                </div>
              </div>


              <div>
                <Button @click="handleAddGroupList">添加分组</Button>
              </div>
            </div>
          </Panel>
        </Collapse>
      </div>
    </div>

    <!-- footer -->
    <div class="footer">
      <Button @click="handleSave" class="custom-btn-primary">{{
        $t("modal.confirm")
      }}</Button>
      <Button @click="open = false" class="custom-btn-default">{{
        $t("modal.cancel_text")
      }}</Button>
    </div>
  </Drawer>
</template>

<script>
import { pinyin } from "pinyin-pro";
import { findTree } from "@/utils/tree";
import { getDataProductType, getStopsInfoByFlowId } from "@/apis/dataProduct";
import { getPublishingById, publishingStops } from "@/apis/flowPublish";

export default {
  data() {
    return {
      formData: {},
      open: true,
      stops: [], //组件列表
      treeData: [],
      fileList: [],
      currentStop: null, //当前展示组件
      coverFile: null,
      coverFileImg: null,
      instructionFile: null,
      selectedList: [], //已选列表
      waitingList: [], //待选列表
       //分组
      groupList: [{
        name:'',
        sort:'',
        list:[]
      }],
      cascaderData: [
        //级联选项
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
  methods: {
    handleAddGroupList(){
        this.groupList.push({
        name:'',
        sort:'',
        list:[]
      })
    },
    // 开始拖拽
    handleDropStart(e,item,list){
        this.dragItem = item   //当前操作项
        this.actionList = list      //当前操作的列表（从哪个列表拖走的）
    },
    // 放到目的区域
    handleDrop(e,list){ 
      const i =  this.actionList.findIndex(v=>v.stopId === this.dragItem.stopId)
      list.push(this.dragItem)    //拖拽放入目标列表
      this.actionList.splice(i,1)
    },

    handleSave() {},

    // 获取流水线原始组件列表
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
            description1: "",
            propertySort: item.propertySort,
            example: item.example,
          })),
        };
      });
      // 筛选有属性的组件
      this.stops = this.stops.filter(
        (v) => v.stopPublishingPropertyVos && v.stopPublishingPropertyVos.length
      );
      this.currentStop = this.stops[0];
      this.sortArrayByPinyin(this.stops);
    },

    // 重置
    reSet() {
      this.formData = {
        name: null,
        productTypeId: null,
        description: null,
      };
      this.$refs.formValidate.resetFields();
      this.fileList = [];
      this.coverFile = null;
      this.coverFileImg = null;
      this.instructionFile = null;
    },

    // 属性选中  组件自动选中
    handleCheckboxClick(e, item) {
      const stop = this.currentStop;
      this.$set(item, "checked", !item.checked);
      const flag = stop.stopPublishingPropertyVos.some((v) => v.checked);
      if (!flag) {
        // 如果所有子节点都未选中， 从已选中列表删除  再从待分组或者已分组列表删除
        const index = this.selectedList.findIndex(
          (v) => v.stopId === stop.stopId
        );
        this.selectedList.splice(index, 1);
        const i = this.waitingList.findIndex((v) => v.stopId === stop.stopId);
        if (i === -1) {
          //已分组
          this.groupList.forEach((v) => {
            const x = v.list.findIndex((k) => k.stopId === stop.stopId);
            if (x !== -1) {
              v.list.splice(x, 1);
            }
          });
        } else {
          //未分组
          this.waitingList.splice(index, 1);
        }
      } else {
        console.log(stop, this.selectedList);
        // 如果选中且未加入已选中列表，加入已分组待分组列表
        const index = this.selectedList.findIndex(
          (v) => v.stopId === stop.stopId
        );
        console.log(index);
        if (index === -1) {
          this.selectedList.push(stop);
          this.waitingList.push(stop);
        }
      }
      this.$set(stop, "checked", flag);
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

    // 编辑获取封面
    async getCoverFileImg(id) {
      if (!id) return;
      const res = await downloadFile(id);
      const reader = new FileReader();
      reader.readAsDataURL(res.data);
      reader.onload = () => {
        this.coverFileImg = reader.result;
      };
    },

    // 获取数据产品分类
    async getTreeData() {
      const res = await getDataProductType();
      this.treeData = res.data.data;
    },

    // 按拼音排序
    sortArrayByPinyin(arr) {
      return arr.sort((a, b) => {
        // 将汉字转换为拼音，不包含声调
        const pinyinA = pinyin(a.stopName, {
          toneType: "none",
        }).toLocaleLowerCase();
        const pinyinB = pinyin(b.stopName, {
          toneType: "none",
        }).toLocaleLowerCase();
        // 比较拼音
        return pinyinA.localeCompare(pinyinB);
      });
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
  created() {
    this.getTreeData();
    this.handleGetFlowStops("d06c0c87f3cb45059bf88eab24d7ed25");
  },
};
</script>


<style lang="scss" scoped>
@import "./index.scss";
</style>
