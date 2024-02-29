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
                  <div>
                    <Upload :disabled="mode !== 'edit'" action="/null" :before-upload="handleBeforeUpload">
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

          <div class="wrap"  v-if="textInput.length">
            <p>普通输入</p>
            <div>
              <div v-for="child in textInput" :key="child.id">
                <div class="label">
                  {{ child.name }}
                </div>
                <div>
                  <Input :disabled="mode !== 'edit'" v-model="child.customValue"></Input>
                </div>
              </div>
            </div>
          </div>

          <div class="wrap"  v-if="output.length">
            <p>输出</p>
            <div>
              <div v-for="child in output" :key="child.id">
                <div class="label">
                  {{ child.name }}
                </div>
                <div>
                  <Input :disabled="mode !== 'edit'" v-model="child.customValue"></Input>
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
  </div>
</template>
    
    <script>
import { getPublishingById, runPublishFlow } from "@/apis/flowPublish";
import { getProcessPageByPublishingId } from "@/apis/process";
import { downloadFile, download } from "@/apis/file";
export default {
  props: {
    mode: String,
    flowInfo: Object,
  },
  watch: {
    flowInfo: {
      handler(val) {
        if(val.id)  this.init(val)
      },
      deep:true,
      immediate:true
    },
  },
  data() {
    return {
      publishInfo: {},
      fileInput: [],
      textInput: [],
      output: [],
    };
  },

  methods: {
    init(val){
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
    async handleDownload(id, fileName) {
      download(downloadFile, id, fileName);
    },
    handleBeforeUpload(e) {
      this.currentProps.fileName = e.name;
      this.fileList.push({ id: this.currentProps.propertyId, file: e });
    },
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
        padding:0 20px 20px;
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
</style>