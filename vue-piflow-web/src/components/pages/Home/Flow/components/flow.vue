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
    </div>

    <div class="config1">
      <div
        class="config_r"
        ref="imgWrap"
        :style="{ backgroundImage: `url(${coverFileImg})` }"
        @click="handleViewShow(true)"
      ></div>
      <!-- <div
        class="config_input"
        v-for="child in list"
        :key="child.id"
      >
        <div v-if="child.type === 0">
          <div class="label">
            {{ child.name }}
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
              <p class="fileName" v-if="fileMap[child.id] || mode !== 'edit'">
                {{ mode !== "edit" ? child.customValue : fileMap[child.id] }}
              </p>
            </div>
          </div>
        </div>
        <div v-if="child.type === 1">
          <div class="label">
            {{ child.name }}
            <Poptip trigger="hover" placement="top">
              <Icon type="md-help-circle" style="color: rgba(0, 0, 0, 0.4)" />
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
              :placeholder="child.description"
              v-model="child.customValue"
            ></Input>
          </div>
        </div>
      </div> -->

      <div
        v-for="(item, index) in list1"
        :class="`config_l config_l${index}`"
        :key="index"
      >
      <h4>{{item.name}}</h4>
        <div v-for="child in item.list" class="config_input" :key="child.id">
          <!-- 文件输入 -->
          <div v-if="child.type === 0">
            <div class="label">
              {{ child.name }}
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
                <p class="fileName" v-if="fileMap[child.id] || mode !== 'edit'">
                  {{ mode !== "edit" ? child.customValue : fileMap[child.id] }}
                </p>
              </div>
            </div>
          </div>
          <!-- 普通输入 -->
          <div v-if="child.type === 1">
            <div class="label">
              {{ child.name }}
              <Poptip trigger="hover" placement="top">
                <Icon type="md-help-circle" style="color: rgba(0, 0, 0, 0.4)" />
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
                :placeholder="child.description"
                v-model="child.customValue"
              ></Input>
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
          if (val.id === "1764490182175752192") {
            this.mock(val);
          } else {
            this.init(val);
          }
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
      list1: [],
      fileMap: {}, //已上传文件map
      progress: 0,
      coverFileImg: null,
      ismock: false,
      previewShow:false,
    };
  },

  methods: {
    handleViewShow(flag) {
      console.log(flag)
      this.previewShow = flag
    },
    mock(val) {
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

      this.getCoverImg(val.coverFileId || "1763853768035663872");
      const list = [];
      let tongliang = [];
      let weizhi = [];
      let yiqi = [];
      let jiangyu = [];
      let yuzhitichu = [];
      let yichangshuju = [];
      let mocafengsu = [];
      let chabiaofa = [];
      // case "1764493523953909763":
      // case "1764493523953909764":
      this.publishInfo.stops.forEach((item) => {
        item.stopPublishingPropertyVos.forEach((v) => {
          switch (v.id) {
            case "1764490182179946496":
            case "1764493523949715456":
            case "1764493523953909760":
              tongliang.push(v);
              break;
            case "1764493523953909762":
            case "1764493523953909761":
              weizhi.push(v);
              break;
            case "1764493523953909765":
            case "1764493524008435712":
              yiqi.push(v);
              break;
            case "1764493524012630016":
              jiangyu.push(v);
              break;
            case "1764493524012630017":
            case "1764493524016824320":
            case "1764493524016824321":
              yuzhitichu.push(v);
              break;
            case "1764493524016824324":
            case "1764493524016824323":
            case "1764493524016824322":
              yichangshuju.push(v);
              break;
            case "1764493524016824325":
              mocafengsu.push(v);
              break;
            case "1764490182179946497":
            case "1764493524021018624":
            case "1764493524016824326":
              chabiaofa.push(v);
              break;
          }
        });
      });
      list.push(
        {
          name: "通量、气象输入数据文件",
          list: tongliang,
        },
        {
          name: "通量站位置信息",
          list: weizhi,
        },
        {
          name: "仪器安装高度信息",
          list: yiqi,
        },
        {
          name: "降雨数据剔除",
          list: jiangyu,
        },
        {
          name: "阈值剔除",
          list: yuzhitichu,
        },
        {
          name: "异常数据检测剔除",
          list: yichangshuju,
        },
        {
          name: "摩擦风速校正",
          list: mocafengsu,
        },
        {
          name: "查表法插补",
          list: chabiaofa,
        }
      );
      this.list1 = list;
      this.ismock = true;
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
      this.getCoverImg(val.coverFileId || "1763853768035663872");
      const list = [];
      this.publishInfo.stops.forEach((item) => {
        item.stopPublishingPropertyVos.forEach((v) => {
          if (v.type === 1 || v.type === 0) {
            list.push(v);
          }
        });
      });
      this.list = list;
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

::v-deep .config {
  overflow: hidden;
  background: #f7f9fa;
  padding: 48px 40px;
  margin-top: 32px;
  border-radius: 8px 8px 0 0;
  &_r {
    float: right;
    width: 44%;
    background-size: contain;
    background-repeat: no-repeat;
    height: 340px;
    margin-bottom: 20px;
  }
  &_input {
    float: left;
    width: 25%;
    padding: 0 20px 20px 0;
    box-sizing: border-box;
    height: 120px;

    .ivu-input {
      border-radius: 6px;
    }
    .label {
      color: #18181b;
      font-size: 14px;
      margin-bottom: 16px;
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
  }
}
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
  background: rgba(0,0,0,0.3);
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
  }
}

::v-deep .config1 {
  overflow: hidden;
  background: #f7f9fa;
  padding: 48px 40px;
  margin-top: 32px;
  border-radius: 8px 8px 0 0;
  &_r {
    float: right;
    width: 44%;
    background-size: contain;
    background-repeat: no-repeat;
    height: 340px;
    margin-bottom: 20px;
    cursor: pointer;
  }
  .config_l {
    overflow: hidden;
    border: 1px dashed rgb(0, 111, 238);
    margin-bottom: 10px;
    h4{
        line-height: 26px;
        background: #E6F1FE;
        text-indent: 10px;
    }
  }
  .config_l0,
  .config_l1 {
    width: 50%;
    overflow: hidden;
    .config_input {
      width: 50%;
    }
  }

  .config_input {
    float: left;
    width: 25%;
    padding: 10px ;
    box-sizing: border-box;
    height: 120px;

    .ivu-input {
      border-radius: 6px;
    }
    .label {
      color: #18181b;
      font-size: 14px;
      margin-bottom: 16px;
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
  }
}
</style>