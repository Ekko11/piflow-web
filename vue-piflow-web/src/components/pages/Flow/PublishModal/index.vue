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
              :class="{ active: currentStop.stopId === item.stopId }"
            >
              <span>
                {{ item.stopName }}
                <Icon
                  v-if="item.checked"
                  style="color: #2f7ae1; font-size: 16px"
                  type="md-checkbox-outline"
                />
              </span>
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
                  :rows="2"
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
                @click="handleClickUpload(child)"
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
        <h4>发布配置</h4>

        <Collapse simple accordion v-model="collapseValue">
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
                <FormItem label="分类：" prop="productTypeId">
                  <treeselect
                    v-model="formData.productTypeId"
                    :placeholder="$t('modal.placeholder_select')"
                    :normalizer="normalizer"
                    :flat="true"
                    :options="treeData"
                    :disable-branch-nodes="true"
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

                <FormItem label="封面：" prop="coverFileImgName">
                  <Upload
                    action="/null"
                    :before-upload="handleBeforeCoverFileUpload"
                    :show-upload-list="false"
                    style="width: 100%"
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

                <FormItem label="说明书：" prop="instructionFileName">
                  <Upload
                    action="/aaa"
                    accept=".pdf"
                    :before-upload="handleBeforeinstructionFileUpload"
                    style="width: 100%;"
                  >
                    <Button icon="ios-cloud-upload-outline"
                      >Upload files</Button
                    >
                  </Upload>
                  <p v-if="formData.instructionFileName">
                    {{ formData.instructionFileName }}
                  </p>
                </FormItem>
              </Form>
            </div>
          </Panel>

          <Panel name="2">
            组件分组
            <div slot="content">
              <h4>
                待分组组件
              </h4>
              <!-- 待选列表 -->
              <div
                class="drop_content"
                @dragover.prevent
                @drop="handleDrop($event, waitingList)"
              >
                <p
                  v-for="item in waitingList"
                  :key="item.id"
                  draggable="true"
                  @dragstart="handleDropStart($event, item, waitingList)"
                >
                  {{ item.stopName }}
                </p>
              </div>

              <h4 class="group_title">
                分组排序
                <Button size="small" @click="handleAddGroupList"
                  >添加分组</Button
                >
              </h4>
              <draggable
                v-model="groupList"
                group="site"
                animation="300"
                dragClass="dragClass"
                ghostClass="ghostClass"
                chosenClass="chosenClass"
                handle=".move"
              >
                <transition-group>
                  <div
                    v-for="(item, index) in groupList"
                    class="group_item"
                    :key="index"
                  >
                    <Icon
                      type="md-close-circle"
                      class="close"
                      @click="handleDeleteGroupItem(index)"
                    />

                    <div class="item">
                      <label>
                        <Icon type="ios-menu" class="move" /> 名称：</label
                      >
                      <Input
                        v-model="item.name"
                        show-word-limit
                        maxlength="100"
                        :placeholder="$t('modal.placeholder')"
                        style="width: 300px"
                      />
                    </div>

                    <div class="item">
                      <label>组件：</label>
                      <div
                        class="drop_content"
                        @dragover.prevent
                        @drop="handleDrop($event, item.list)"
                      >
                        <div v-show="!item.list.length" class="placeholder">
                          请将上方待分组组件拖入该区域
                        </div>
                        <p
                          v-for="child in item.list"
                          :key="child.stopId"
                          draggable="true"
                          @dragstart="handleDropStart($event, child, item.list)"
                        >
                          {{ child.stopName }}
                        </p>
                      </div>
                    </div>
                  </div>
                </transition-group>
              </draggable>
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
import { uploadFile, downloadFile } from "@/apis/file";

import draggable from "vuedraggable";
import { Form, FormItem } from "view-design";
export default {
  components: { draggable },
  data() {
    const isEmpty = (rule, value, callback) => {
        if (value == null || value == undefined || value == "") {
          callback(new Error('The productTypeId cannot be empty'))
        } else {
          callback();
        }
 };

    return {
      formData: {},
      collapseValue: "1",
      open: false,
      stops: [], //组件列表
      activeStopLi: 0,
      treeData: [],
      fileList: [],
      currentStop: null, //当前展示组件
      coverFile: null,
      coverFileImg: null,
      instructionFile: null,
      selectedList: [], //已选列表
      waitingList: [], //待选列表
      //分组
      groupList: [
        {
          name: "",
          list: [],
        },
      ],
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
        productTypeId: [
          {required: true, message: 'The productTypeId cannot be empty', trigger: 'blur', type: 'number', validator: isEmpty},
        ],
        coverFileImgName:[
          {
            required: true, trigger: 'blur', message: "The coverFileImg cannot be empty",
          }
        ],
        instructionFileName:[
          {
            required: true, trigger: 'blur', message: "The instructionFile cannot be empty",
          }
        ]
      },
    };
  },
  methods: {
    async handleAdd(row) {
      if (row.id !== this.formData.flowId) {
        this.$event.emit("loading", true);
        this.reSet();
        this.formData.flowId = row.id;
        this.formData.description = row.description;
        await this.handleGetFlowStops(row.id);
        this.$event.emit("loading", false);
      }
      this.open = true;
    },

    async handleEdit(row) {
      this.reSet();
      this.open = true;
      this.groupList = [];
      this.$event.emit("loading", true);
      await this.handleGetFlowStops(row.flowId);
      const res = await getPublishingById(row.id);
      this.$event.emit("loading", false);
      const publishInfo = res.data.data;
      this.formData.flowId = row.flowId;
      const {
        id,
        name,
        productTypeId,
        description,
        version,
        coverFileId,
        instructionFileName,
      } = publishInfo;
      this.formData = {
        flowId: row.flowId,
        id,
        name,
        productTypeId,
        description,
        version,
        instructionFileName,
      };
      this.getCoverFileImg(coverFileId);
      const publishStops = publishInfo.stops;

      if (publishStops.length) {
        this.selectedList = publishStops;
        publishStops.forEach((item) => {
          let t = this.groupList.findIndex((v) => v.name === item.bak2);
          if (t === -1) {
            this.groupList.push({
              name: item.bak2,
              sort: item.bak1,
              list: [item],
            });
          } else {
            this.groupList[t].list.push(item);
          }

          // 属性回填
          let index = this.stops.findIndex((v) => v.stopId === item.stopId);
          this.stops[index].checked = true;
          this.stops[index].bak1 = item.bak1;
          this.stops[index].bak2 = item.bak2;
          item.stopPublishingPropertyVos.forEach((child) => {
            let idx = this.stops[index].stopPublishingPropertyVos.findIndex(
              (v) => v.propertyId === child.propertyId
            );
            this.stops[index].bak1 = child.bak1;
            this.stops[index].stopPublishingPropertyVos[idx].checked = true;
            this.stops[index].stopPublishingPropertyVos[idx].id = child.id;
            this.stops[index].stopPublishingPropertyVos[idx].name = child.name;
            this.stops[index].stopPublishingPropertyVos[idx].description =
              child.description;
            this.stops[index].stopPublishingPropertyVos[idx].description1 =
              child.description;

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

        this.groupList.sort((a, b) => a.sort - b.sort);
      }
    },

    // 点击保存  处理数据
    handleSave() {
      if (this.waitingList.length) {
        this.$Message.error({
          content: "请将所有已选组件进行分组",
          duration: 3,
        });
        return;
      }
      this.$refs.formValidate.validate((valid) => {});
      if (
        !this.formData.productTypeId ||
        !this.formData.name ||
        !this.coverFileImg ||
        !this.formData.instructionFileName
      ) {
        this.$Message.error({
          content: "请将发布信息补充完整",
          duration: 3,
        });
        return;
      }
      // 组件添加分类名称和排序属性
      let stopList = [];
      this.groupList.forEach((v, i) => {
        v.list.forEach((it) => {
          it.bak1 = i + "";
          it.bak2 = v.name;
        });
        stopList = stopList.concat(v.list);
      });

      if (!stopList.length) {
        this.$Message.error({
          content: "请至少选择一个组件",
          duration: 3,
        });
        return;
      }
      // 获取分类信息
      const productNode = findTree(this.treeData, this.formData.productTypeId);
      this.formData.productTypeId = Number(this.formData.productTypeId);
      this.formData.productTypeName = productNode.name;
      this.formData.productTypeDescription = productNode.description;

      let errMsg = "";
      // 筛选stops中的选中项
      stopList = stopList.map((item) => ({
        ...item,
        stopPublishingPropertyVos: item.stopPublishingPropertyVos.filter(
          (prop) => {
            if (prop.checked) {
              prop.description = prop.description1 || prop.description;
              //输入类型
              if (prop.cascaderType.length === 2) {
                if (prop.cascaderType[1] === 0 && !prop.fileName) {
                  //文件
                  errMsg = `请确保组件 ${item.stopName} 的参数 ${prop.propertyName} 的文件不为空`;
                }
                prop.type = prop.cascaderType[1];
              } else {
                prop.type = prop.cascaderType[0] || 1; //默认普通输入
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
        return;
      }
      this.handlePublish(stopList);
    },
    // 请求发送接口
    async handlePublish(data) {
      this.formData.stops = data;
      const params = JSON.parse(JSON.stringify(this.formData))
      delete  params.coverFileImgName
      this.$event.emit("loading", true);
      const res = await publishingStops(params);
      if (res.data.code === 200) {
        //需要上传文件
        let promiseList = [];
        if (this.fileList.length || this.coverFile || this.instructionFile) {
          const returnPropsList = res.data.data;
          if (returnPropsList.length && this.fileList.length) {
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
              this.$emit('publishOver')
              this.reSet();
            } else {
              this.$Message.error({
                content: this.$t("tip.fault_content"),
                duration: 3,
              });
              this.open = false;
            }
          });
        } else {
          //编辑不需要上传文件
          this.$event.emit("loading", false);
          this.$emit('publishOver')
          this.open = false;
          this.$Message.success({
            content: this.$t("tip.success"),
            duration: 3,
          });
        }
      } else {
        this.$event.emit("loading", false);
        this.$emit('publishOver')
        this.$Message.error({
          content: this.$t("tip.fault_content"),
          duration: 3,
        });
        this.open = false;
      }
    },

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
      this.sortArrayByPinyin(this.stops);
      this.currentStop = this.stops[0];
    },

    // 删除分组
    handleDeleteGroupItem(index) {
      this.waitingList = this.waitingList.concat(this.groupList[index].list);
      this.groupList.splice(index, 1);
    },
    // 添加分组
    handleAddGroupList() {
      this.groupList.unshift({
        name: "",
        list: [],
      });
    },
    // 开始拖拽
    handleDropStart(e, item, list) {
      this.dragItem = item; //当前操作项
      this.actionList = list; //当前操作的列表（从哪个列表拖走的）
    },
    // 放到目的区域
    handleDrop(e, list) {
      if (!this.dragItem) return;
      const i = this.actionList.findIndex(
        (v) => v.stopId === this.dragItem.stopId
      );
      list.push(this.dragItem); //拖拽放入目标列表
      this.actionList.splice(i, 1);

      this.dragItem = "";
      this.actionList = [];
    },

    // 重置
    reSet() {
      this.formData = {
        name: null,
        productTypeId: null,
        description: null,
        instructionFileName:null
      };
      this.$refs.formValidate.resetFields();
      this.fileList = [];
      this.coverFile = null;
      this.coverFileImg = null;
      this.instructionFile = null;
      this.selectedList = [];
      this.waitingList = [];
      this.groupList = [
        {
          name: "",
          list: [],
        },
      ];
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
        // 如果选中且未加入已选中列表，加入已分组待分组列表
        const index = this.selectedList.findIndex(
          (v) => v.stopId === stop.stopId
        );
        if (index === -1) {
          this.selectedList.push(stop);
          this.waitingList.push(stop);
        }
      }
      this.$set(stop, "checked", flag);
    },

    // 标记选择上传的节点
    handleClickUpload(item) {
      this.currentProps = item;
    },
    handleBeforeCoverFileUpload(e) {
      this.coverFile = e;
      const reader = new FileReader();
      reader.readAsDataURL(e);
      reader.onload = () => {
        this.$set(this.formData,'coverFileImgName','占位')
        this.coverFileImg = reader.result;
      };
      return false;
    },
    handleBeforeinstructionFileUpload(e) {
      this.$set(this.formData,'instructionFileName',e.name)
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
        this.$set(this.formData,'coverFileImgName','占位')
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
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
