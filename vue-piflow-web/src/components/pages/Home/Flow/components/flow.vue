<template>
  <div>
    <h4 class="content_title">
      <span
        style="cursor: pointer"
        @click="$router.push(`/home/list?type=${publishInfo.productTypeId}`)"
        >{{ publishInfo.productTypeName }}</span
      >
      >>
      <span style="color: rgb(82, 82, 91)">{{ publishInfo.name }}</span>
    </h4>
    <div class="desc" v-if="publishInfo.description">
      {{ publishInfo.description }}
      <span v-if="flowInfo.instructionFileId"
        >（<span class="instruction" @click="handShowInstructions"
          >查看说明书</span
        >）</span
      >
    </div>

    <div v-if="list.length">
      <div class="config">
        <div class="config_r" @click="handleViewShow(true)">
          <Icon type="ios-expand" />
          <img :src="coverFileImg" alt="" />
        </div>

        <div v-if="list.length">
          <div
            v-for="(item, index) in list"
            class="config_l"
            :key="index"
          >
            <h4>{{ item.name }}</h4>
            <div>
              <div
                v-for="child in item.list"
                class="config_input"
                :key="child.id"
              >
                <!-- 文件输入 -->
                <div
                  v-if="child.showType === 'upload'"
                  class="config_input-upload"
                >
                  <div class="label">
                    <span class="title">{{ child.name }}</span>
                    <Poptip trigger="hover" placement="top">
                      <Icon
                        type="md-help-circle"
                        style="color: rgba(0, 0, 0, 0.4)"
                      />
                      <div class="toptipContent" slot="content">
                        <p>
                          所属组件：<span>{{ child.stopName }}</span>
                        </p>
                        <p>
                          描述：<span>{{ child.description }}</span>
                        </p>
                      </div>
                    </Poptip>
                    <span class="fileDonw" @click="handleDownload(child)"
                      >(样例下载)</span
                    >
                  </div>
                  <div>
                    <div @click="handleUpload(child)">
                      <Upload
                        :disabled="mode !== 'edit'"
                        action="/null"
                        :before-upload="handleBeforeUpload"
                      >
                        <Button class="uploadBtn" icon="md-cloud-upload"
                          >上传文件</Button
                        >
                      </Upload>
                      <p
                        class="fileName"
                        v-if="fileMap[child.id] || mode !== 'edit'"
                      >
                        {{
                          mode !== "edit"
                            ? child.customValue
                            : fileMap[child.id]
                        }}
                      </p>
                    </div>
                  </div>
                </div>
                <!-- 普通输入 -->
                <div
                  v-if="child.showType === 'input'"
                  class="config_input-input"
                >
                  <div class="label">
                    <span class="title">{{ child.name }}</span>
                    <Poptip trigger="hover" placement="top">
                      <Icon
                        type="md-help-circle"
                        style="color: rgba(0, 0, 0, 0.4)"
                      />
                      <div class="toptipContent" slot="content">
                        <p>
                          所属组件：<span>{{ child.stopName }}</span>
                        </p>
                        <p>
                          推荐值：<span>{{ child.customValue1 }}</span>
                        </p>
                        <p>
                          描述：<span>{{ child.description }}</span>
                        </p>
                      </div>
                    </Poptip>
                  </div>
                  <div>
                    <Input
                      :disabled="mode !== 'edit'"
                      :placeholder="child.customValue1"
                      v-model="child.customValue"
                    ></Input>
                  </div>
                </div>
                <!-- 选择器 -->
                <div
                  v-if="child.showType === 'select'"
                  class="config_input-select"
                >
                  <div class="label">
                    <span class="title">{{ child.name }}</span>
                    <Poptip trigger="hover" placement="top">
                      <Icon
                        type="md-help-circle"
                        style="color: rgba(0, 0, 0, 0.4)"
                      />
                      <div class="toptipContent" slot="content">
                        <p>
                          所属组件：<span>{{ child.stopName }}</span>
                        </p>
                        <p>
                          推荐值：<span>{{ child.customValue1 }}</span>
                        </p>
                        <p>
                          描述：<span>{{ child.description }}</span>
                        </p>
                      </div>
                    </Poptip>
                  </div>
                  <div>
                    <Select
                      :disabled="mode !== 'edit'"
                      :placeholder="child.customValue1"
                      v-model="child.customValue"
                    >
                      <Option
                        v-for="v in child.allowableValues1"
                        :key="v"
                        :value="v"
                        >{{ v }}</Option
                      >
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="preview" v-show="previewShow" @click="handleViewShow(false)">
      <img :src="`${coverFileImg}`" alt="" />
    </div>
  </div>
</template>

<script>
import { uploadFile, download, downloadFile } from "@/apis/file";
export default {
  props: {
    mode: String,
    flowInfo: Object,
  },
  watch: {
    flowInfo: {
      handler(val) {
        if (
          val.id &&
          JSON.stringify(val) !== JSON.stringify(this.publishInfo)
        ) {
          this.init(val);
        }
      },
      deep: true,
      immediate: true,
    },
  },
  data() {
    return {
      publishInfo: {},
      list: [],
      fileMap: {}, //已上传文件map
      progress: 0,
      coverFileImg: null,
      ismock: false,
      previewShow: false,
    };
  },

  methods: {
    handleViewShow(flag) {
      this.previewShow = flag;
    },
    init(val) {
      this.fileInput = [];
      this.textInput = [];
      this.output = [];
      delete val.crtDttm;
      delete val.crtDttmString;
      delete val.crtUser;
      delete val.lastUpdateDttm;
      delete val.lastUpdateDttmString;
      delete val.lastUpdateUser;
      delete val.enableFlag;
      this.publishInfo = val;
      val.coverFileId && this.getCoverImg(val.coverFileId);
      let list = [];
      this.publishInfo.stops.forEach((item) => {
        let t = list.findIndex((v) => v.name === item.bak2);
          if (t === -1) {
            list.push({
              name: item.bak2,
              sort: item.bak1,
              list: [...item.stopPublishingPropertyVos],
            });
          } else {
            list[t].list = list[t].list.concat(item.stopPublishingPropertyVos);
          }


        item.stopPublishingPropertyVos.forEach((v) => {
          if (v.type === 1) {
            let type = "input";
            try {
              v.allowableValues1 = JSON.parse(v.allowableValues);
              if (v.allowableValues1.length > 0 && v.allowableValues1[0].trim()) {
                type = "select";
              }
            } catch (err) {}
            v.showType = type;
          } else if (v.type === 0) {
            v.showType = "upload";
          }
        });
      });
      // 分组排序
      list.sort((a, b) => a.sort - b.sort);
      // 去除全是输出的分组
      list = list.filter(v=>v.list.some(it=>it.showType))

      this.list = list;
    },
    async handShowInstructions() {
      this.$event.emit("loading", true);
      const res = await downloadFile(this.flowInfo.instructionFileId);
      // 将文件流转化为本地blod地址
      var binaryData = [];
      binaryData.push(res.data);
      // 记得一定要设置application的类型
      let url = window.URL.createObjectURL(
        new Blob(binaryData, {
          type: "application/pdf;charset=utf-8",
        })
      );
      if (url != null && url != undefined && url) {
        const { href } = this.$router.resolve({
          path: "/pdf",
          query: {
            url: url,
          },
        });
        // 新页面打开
        window.open(href, "_blank");
      }
      this.$event.emit("loading", false);
    },
    handDataPublish(row) {
      this.$refs.PublishModalRef.handleAdd(row);
    },
    async getCoverImg(id) {
      const res = await downloadFile(id);
      const reader = new FileReader();
      reader.readAsDataURL(res.data);
      reader.onload = () => {
        this.coverFileImg = reader.result;
      };
    },
    handleDownload(row) {
      download(downloadFile, row.fileId, row.fileName, true);
    },
    handleUpload(child) {
      this.currentPropos = child;
    },
    async realUpload(e) {
      const res = await uploadFile({
        file: e,
        associateType: 4,
        associateId: this.currentPropos.id,
      });

      this.$set(this.fileMap, this.currentPropos.id, e.name);
      this.currentPropos.customValue = res.data.data.filePath;
    },
    handleBeforeUpload(e) {
      this.realUpload(e);
      return false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../index.scss";

.btn {
  button {
    line-height: 24px;
    height: 24px;
    font-size: 11px;
    padding: 0 12px;
    margin-right: 8px;
    border-radius: 8px;
    background: #e6f1fe;
    color: #005bc4;
    border: none;
  }
}
.page {
  display: flex;
  justify-content: flex-end;
  margin-top: 32px;
}

.content_title {
  position: relative;
  i {
    position: absolute;
    left: 0;
    top: 0;
    line-height: 30px;
    cursor: pointer;
  }
}

.preview {
  background: rgba(0, 0, 0, 0.3);
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  img {
    max-width: 90%;
    max-height: 90%;
  }
}

::v-deep .config {
  overflow: hidden;
  background: #f7f9fa;
  padding: 48px 40px;
  margin-top: 32px;
  border-radius: 8px 8px 0 0;
  &_r {
    width: 100%;
    background-size: cover;
    background-repeat: no-repeat;
    margin-bottom: 20px;
    background-position: center;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    border-radius: 6px;
    position: relative;
    cursor: pointer;
      img{
        max-width: 100%;
        max-height: 100%;
      }
      i{
      position: absolute;
      right: 10px;
      top: 6px;
      font-size: 23px;
      opacity: 0.9;
      }
  }
  .config_l {
    overflow: hidden;
    border-radius: 6px;
    margin-bottom: 20px;
    border: 1px dashed #3974aa;
    h4 {
      line-height: 26px;
      background: #3974aa;
      text-indent: 10px;
      color: #fff;
    }
    > div {
      display: flex;
      flex-wrap: wrap;
      border-radius: 0 0 6px 6px;
      border-top: none;
    }
  }

  .config_input {
    width: 25%;
    padding: 10px 10px;
    box-sizing: border-box;

    .ivu-input,
    .ivu-select-selection {
      border-radius: 6px;
      border-color: #3974aa;
      &[disabled] {
        border-color: #dcdee2;
      }
    }
    .label {
      color: #18181b;
      font-size: 14px;
      margin-bottom: 11px;
      display: flex;
      .title {
        max-width: calc(100% - 22px);
        display: inline-block;
        word-break: break-all;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
    }
    .uploadBtn {
      background: #e6f1fe;
      border: none;
      color: #005bc4;
      font-size: 11px;
    }
    .fileName {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      width: 100%;
      color: #9b9393;
      font-size: 12px;
    }
    .fileDonw {
      color: #005bc4;
      font-size: 12px;
      text-decoration-line: underline;
      cursor: pointer;
    }
    .toptipContent {
      word-break: break-all;
      white-space: normal;
      max-width: 400px;
    }
    &-input,
    &-select {
      padding-bottom: 6px;
    }
  }
}
.instruction {
  color: #005bc4;
  cursor: pointer;
  text-decoration: underline;
}
</style>
