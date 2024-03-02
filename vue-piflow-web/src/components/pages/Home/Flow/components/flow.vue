<template>
  <div>
    <h4 class="content_title">· {{ publishInfo.name }} ·</h4>
    <div class="desc" v-if="publishInfo.description">
      {{ publishInfo.description }}
    </div>

    <div class="contain" v-if="publishInfo.stops">
      <div class="config">
        <div class="config_l">
          <!-- 输入 -->
          <div class="wrap" v-if="fileInput.length">
            <p>文件输入</p>
            <div>
              <div v-for="child in fileInput" :key="child.id">
                <div class="label">
                  {{ child.name }}
                </div>
                <div>
                  <p
                    @click="handleDownload(child.fileId, child.fileName)"
                    class="fileExample"
                  >
                    <span>{{ child.fileName }}</span>
                    <Icon type="md-cloud-download" />
                  </p>
                  <div @click="handleUpload(child)">
                    <Upload
                      :disabled="mode !== 'edit'"
                      action="/null"
                      :before-upload="handleBeforeUpload"
                    >
                      <Button class="uploadBtn" icon="md-cloud-upload"
                        >Upload files</Button
                      >
                    </Upload>
                    <p v-if="child.customFile">{{ child.customValue }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="wrap" v-if="textInput.length">
            <p>普通输入</p>
            <div>
              <div v-for="child in textInput" :key="child.id">
                <div class="label">
                  {{ child.name }}
                </div>
                <div>
                  <Input
                    :disabled="mode !== 'edit'"
                    v-model="child.customValue"
                  ></Input>
                </div>
              </div>
            </div>
          </div>

          <div class="wrap" v-if="output.length">
            <p>输出</p>
            <div>
              <div v-for="child in output" :key="child.id">
                <div class="label">
                  {{ child.name }}
                </div>
                <div>
                  <Input
                    :disabled="mode !== 'edit'"
                    v-model="child.customValue"
                  ></Input>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="config_r">
          <img src="@/assets/img/home/p1.png" alt="" />
        </div>
      </div>
    </div>


    <div class="notice" v-if="noticeOpen">
      <div class="close" @click="handleNoticeClose">
        <Icon type="ios-close" />
      </div>
      <div class="logo">
        <Icon type="ios-information-circle-outline" />
      </div>
      <div class="notice_content">
        <div>正在下载中，请稍等</div>
        <div v-if="progress">当前已下载：{{ progress }}% </div>
      </div>

    </div>
  </div>
</template>
    
    <script>
import { getPublishingById } from "@/apis/flowPublish";
import { getFileNameByHeaders,downloadByBlob, uploadFile } from "@/apis/file";
export default {
  props: {
    mode: String,
    flowInfo: Object,
  },
  watch: {
    flowInfo: {
      handler(val) {
        if (val.id && JSON.stringify(val) !== JSON.stringify(this.publishInfo))
          this.init(val);
      },
      deep: true,
      immediate: true,
    },
  },
  data() {
    return {
      publishInfo: {},
      fileInput: [],
      textInput: [],
      output: [],
      progress:0,
      noticeOpen:false
    };
  },

  methods: {
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

      this.publishInfo.stops.forEach((item) => {
        item.stopPublishingPropertyVos.forEach((v) => {
          if (v.type === 0) {
            this.fileInput.push(v);
          } else if (v.type === 1) {
            this.textInput.push(v);
          } else {
            this.output.push(v);
          }
        });
      });
    },
    handDataPublish(row) {
      this.$refs.PublishModalRef.handleAdd(row);
    },

    async handleGetStopsById() {
      const res = await getPublishingById(this.$route.query.id);
    },
     handleDownload(id, fileName) {
      this.noticeOpen = true
      const _this = this
      this.$axios({
        method: "get",
        url: `/file/getFileById?id=${id}`,
        responseType: "blob",
        onDownloadProgress(ProgressEvent) {
          const load = ProgressEvent.loaded;
          const total = 314572800;
          const progress = Math.floor((load / total) * 100);
          _this.progress = progress
          if(progress === 100){
            _this.noticeOpen =false
          }
        },
      })
        .then((res) => {
          if (res.data.code) {
            this.$Message.error({
              content: '下载失败',
              duration: 3,
            });
          } else {
            this.noticeOpen = false
            const file = res.data;
            const blob = new Blob([file]);
            fileName = getFileNameByHeaders(res.headers, fileName);
            downloadByBlob(blob, fileName);
          }
        })
        .catch((error) => {
          this.$Message.error({
            content: this.$t("tip.fault_content"),
            duration: 3,
          });
        });
      // download(downloadFile, id, fileName);
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
      this.currentPropos.customValue = res.data.data.filePath;
    },
    handleBeforeUpload(e) {
      this.realUpload(e);
      return false;
      // this.currentProps.fileName = e.name;
      // this.fileList.push({ id: this.currentProps.propertyId, file: e });
    },
    handleNoticeClose(){
      this.noticeOpen = false
    }
  },
};
</script>
    
    <style lang="scss" scoped>
@import "../../index.scss";
::v-deep .contain {
  background: #f7f9fa;
  padding: 48px 40px;
  margin-top: 32px;
  .config {
    display: flex;
    justify-content: space-between;
    &_l {
      margin-right: 20px;
      flex-grow: 1;
      .wrap {
        border: 1px dashed #006fee;
        background: #e6f1fe;
        margin-bottom: 20px;
        padding: 0 20px 20px;
        border-radius: 8px;
        .fileExample {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #005bc4;
          cursor: pointer;
          font-size: 14px;
          span {
            max-width: 80%;
            display: inline-block;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }
        }
        > p {
          font-size: 16px;
          font-weight: 400;
          margin: 10px 0;
        }
        > div {
          display: flex;
          flex-wrap: wrap;
          margin-bottom: 20px;
          > div {
            &:nth-child(2n + 1) {
              margin-right: 4%;
            }
            width: 48%;
          }
        }
      }
      .label {
        font-size: 16px;
        color: #18181b;
        margin-bottom: 16px;
        i {
          font-size: 18px;
          cursor: pointer;
          margin-left: 5px;
        }
      }
      .uploadBtn {
        background: #a7cbf6;
        border: none;
        color: #005bc4;
      }
      .ivu-input {
        border-radius: 6px;
      }
    }
    &_r {
      width: 528px;
      height: 283px;
      > img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .run {
    background: #006fee;
    color: #fff;
  }
  .progress {
    margin: 40px 0;
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
.notice{
  position: fixed;
  top: 85px;
  right: 20px;
  width: 335px;
  position: fixed;
  padding: 16px;
  border-radius: 4px;
  box-shadow: 0 1px 6px rgba(0,0,0,.2);
  background: #fff;
  line-height: 1;
  display: flex;
  .close{
    position: absolute;
    right: 4px;
    top: 0;
    cursor: pointer;
    font-size: 30px;
  }
  .logo{
    i{
      font-size: 36px;
      color: #2d8cf0;
      font-size: 36px;
      color: #2d8cf0;
      margin-right: 20px;
    }
  }
  &_content{
    div{
      margin-bottom: 6px;
    }
  }

}
</style>