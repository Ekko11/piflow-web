<template>
  <div class="content">
    <h4 class="content_title">· {{ publishInfo.name }} ·</h4>
    <div class="desc" v-if="publishInfo.description">
      {{ publishInfo.description }}
    </div>

    <div class="contain" v-if="publishInfo.stops">
      <div class="config">
        <div class="config_l">
          <!-- 输入 -->
          <p>文件输入</p>
          <div class="wrap">
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
                    <Upload action="/null" :before-upload="handleBeforeUpload">
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

          <div class="wrap">
            <p>普通输入</p>
            <div>
              <div v-for="child in textInput" :key="child.id">
                <div class="label">
                  {{ child.name }}
                </div>
                <div>
                  <Input v-model="child.customValue"></Input>
                </div>
              </div>
            </div>
          </div>

          <div class="wrap">
            <p>输出</p>
            <div>
              <div v-for="child in output" :key="child.id">
                <div class="label">
                  {{ child.name }}
                </div>
                <div>
                  <Input v-model="child.customValue"></Input>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="config_r">
          <img src="@/assets/img/home/p1.png" alt="" />
        </div>
      </div>

      <div>
        <Button class="run" @click="handleRun()">运行</Button>
      </div>
      <div class="progress">
        <Progress :percent="25" :stroke-width="12" status="active" />
      </div>

      <div class="history">
        <div class="history_btn">
          <Button @click="historyIsShow = !historyIsShow"
            >历史记录
            <Icon
              :type="historyIsShow ? 'md-arrow-dropup' : 'md-arrow-dropdown'"
            />
          </Button>
        </div>
        <div v-show="historyIsShow" class="history_list">
          <Table :columns="columns" :data="historyData">
            <template slot-scope="{ row }" slot="action">
              <div class="btn">
                <Button @click="handleEnter(row)">日志查看</Button>
                <Button @click="handShowInstructions(row)">数据产品下载</Button>
                <Button @click="handDataPublish(row)">数据产品发布</Button>
              </div>
            </template>
          </Table>
          <div class="page">
            <Page
              show-elevator
              size="small"
              :total="total"
              show-sizer
              @on-change="onPageChange"
              @on-page-size-change="onPageSizeChange"
            />
          </div>
        </div>
      </div>

      <PublishModal ref="PublishModalRef"/>
    </div>
  </div>
</template>
  
  <script>
import { getPublishingById, runPublishFlow } from "@/apis/flowPublish";
import { getProcessPageByPublishingId } from "@/apis/process";
import { downloadFile, download } from "@/apis/file";
import PublishModal from '@/components/pages/DataProductManagement/Publish/PublishModal'
export default {
  components:{
    PublishModal
  },
  data() {
    return {
      page: 1,
      limit: 5,
      total: 30,
      historyIsShow: false,
      publishInfo: {},
      fileInput: [],
      textInput: [],
      output: [],

      columns: [
        {
          title: "名称",
          key: "name",
        },
        {
          title: "运行时间",
          key: "startTime",
        },
        {
          title: "运行状态",
          key: "state.text",
          render: (h, params) => {
            return h("span", [params.row.state.text]);
          },
        },
        {
          title: "操作",
          slot: "action",
          width: 340,
          align: "center",
        },
      ],
      historyData: [],
    };
  },
  created() {
    this.handleGetStopsById();
  },
  methods: {
    handDataPublish(row){
      this.$refs.PublishModalRef.handleAdd(row)
    },
    async handleRun() {
      const res = await runPublishFlow(this.publishInfo);
      console.log(res);
    },
    async handleGetStopsById() {
      const res = await getPublishingById(this.$route.query.id);
      delete res.data.data.crtDttm;
      delete res.data.data.crtDttmString;
      delete res.data.data.crtUser;
      delete res.data.data.lastUpdateDttm;
      delete res.data.data.lastUpdateDttmString;
      delete res.data.data.lastUpdateUser;
      delete res.data.data.enableFlag;
      this.publishInfo = res.data.data;
      this.getHistoryList();

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
    async handleDownload(id, fileName) {
      download(downloadFile, id, fileName);
    },
    handleBeforeUpload(e) {
      this.currentProps.fileName = e.name;
      this.fileList.push({ id: this.currentProps.propertyId, file: e });
    },
    handleEnter(row) {
      console.log(row);
    },
    handShowInstructions(row) {
      console.log(row);
    },

    async getHistoryList() {
      const data = {
        limit: this.limit,
        page: this.page,
        publishingId: this.publishInfo.id,
      };
      const res = await getProcessPageByPublishingId(data);
      console.log(res);
      this.historyData = res.data.data;
      this.total = res.data.count;
    },
    onPageChange(pageNo) {
      this.page = pageNo;
      this.getTableData();
    },

    onPageSizeChange(pageSize) {
      this.limit = pageSize;
      this.getTableData();
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
      .wrap {
        border: 1px dashed #006fee;
        background: #e6f1fe;
        margin-bottom: 20px;
        padding: 20px;
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
          font-size: 20px;
          font-weight: 400;
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
::v-deep .history {
  &_btn {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 12px;
    button {
      background: #f2eafa;
      border: none;
      color: #6020a0;
    }
  }
  &_list {
    padding: 20px;
    border: 1px dashed #7828c8;
    border-radius: 8px;
    .ivu-table {
      .ivu-table-header thead tr {
        th {
          background: #f4f4f5;
          color: #3f3f46;
          line-height: 48px;
          font-size: 14px;
          padding: 0;
          &:not(:last-child) {
            position: relative;
            &::after {
              content: "|";
              position: absolute;
              right: 0;
              top: 0;
              color: #d4d4d8;
            }
          }
          &:first-child {
            border-radius: 8px 0 0 0;
          }
          &:last-child {
            border-radius: 0 8px 0 0;
          }
        }
      }
      .ivu-table-tbody {
        td {
          background: #f7f9fa;
        }
      }
    }
  }
}
::v-deep .list {
  margin-top: 32px;
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