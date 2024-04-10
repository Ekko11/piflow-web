<template>
  <div class="content">
    <Flow mode="process" :flowInfo="publishInfo" />
    <div class="progressWrap">
      <div class="stop">
      <div>
        <Button  class="returnBtn"  icon="md-return-left"  @click="handleReturn">返回配置</Button>
      </div>
      <div>
        <Button  class="stopBtn" v-if="state == 'STARTED'" @click="handleStop">停止</Button>
        <Button class="log" v-if="appId" @click="handleShowLog">日志查看</Button>
      </div>

      </div>
      <div class="progress">
        <div v-if="state !== 'KILLED' && state !== 'FAILED'">
          <p v-if="process === 0 && !processIng.length" class="processIng">
            排队中
          </p>
          <p v-for="item in processIng" class="processIng" :key="item.id">
            正在进行 <span style="font-weight: 600">{{ item.name }} </span>
          </p>
        </div>
        <div v-else-if="state == 'FAILED'">
          <p class="process_failed">
            运行失败    <Icon type="ios-alert"  style="color: #e72525;cursor: pointer;" @click="getErrorLog"/>
          </p>

        </div>

        <Progress :percent="process" :stroke-width="12" :status="(state =='FAILED' || state =='KILLED')?'normal':'active'"  :stroke-color="(state =='FAILED' || state =='KILLED')?'#c4c4bf':'#3974aa'"/>
        <div class="btn">
          <Button
            v-if="
              data.dataProductList &&
              data.dataProductList.length &&
              data.dataProductList.some((v) => v.file)
            "
            @click="handleDownDataProduct()"
            >数据产品下载</Button
          >
          <Button
            v-if="
              state === 'COMPLETED' &&
              data.dataProductList &&
              data.dataProductList.some((v) => v.state === 3)
            "
            @click="handDataPublish()"
            >数据产品发布</Button
          >
        </div>
      </div>
    </div>

    <PublishModal ref="PublishModalRef" />
    <Log ref="LogRef" />
    <ErrorLog ref="ErrorLogRef" />
    
  </div>
</template>
    
<script>
import {
  getAppInfo,
  getByProcessId,
  getAppIdByProcessId,
  stopProcessOrProcessGroup,
  getLogUrl,
  getErrorLogInfo
} from "@/apis/process";
import PublishModal from "@/components/pages/DataProductManagement/Publish/PublishModal";
import { download, downloadFileByIds } from "@/apis/file";
import Flow from "../components/flow";
import Log from "../components/Log";
import ErrorLog from "../components/ErrorLog";
export default {
  components: {
    Flow,
    PublishModal,
    Log,
    ErrorLog
  },
  data() {
    return {
      publishInfo: {},
      process: 0,
      data: {},
      processIng: [],
      state: "",
      appId:'',
      completedStatus: ["COMPLETED", "FAILED", "KILLED"],
    };
  },
  created() {
    this.init();
  },
  methods: {
    async handleStop() {
      const data = { id: this.$route.query.processId, processType: "PROCESS" };
      this.$Modal.confirm({
        title: this.$t("tip.title"),
        okText: this.$t("modal.confirm"),
        cancelText: this.$t("modal.cancel_text"),
        content: `确定要停止当前进程吗？`,
        onOk: async () => {
          const res = await stopProcessOrProcessGroup(this.$qs.stringify(data));
          if (res.data.code === 200) {
            clearTimeout(this.timer);
            this.processIng = []
            this.state = 'KILLED'
            this.$Message.success({
              content: this.$t("tip.stop_success_content"),
              duration: 3,
            });
          } else {
            this.$Message.error({
              content: this.$t("tip.stop_fail_content"),
              duration: 3,
            });
          }
        },
      });
    },
    async getAppId() {
      const res = await getAppIdByProcessId(this.$route.query.processId);
      if (res.data.code === 200 && res.data.appId) {
        if (this.appIdTimer) clearTimeout(this.appIdTimer);
        this.processMonitoring(res.data.appId);
      } else {
        this.appIdTimer = setTimeout(() => {
          this.getAppId();
        }, 5000);
      }
    },
    async init() {
      const res = await getByProcessId(this.$route.query.processId);
      this.data = res.data.data;
      this.publishInfo = this.data.flowPublishing;
      if (res.data.data.appId) {
        this.processMonitoring(res.data.data.appId);
      } else {
        this.getAppId();
      }
    },

    async processMonitoring(appid) {
      this.appId = appid
      const res = await getAppInfo({ appid });
      if (res.data.code === 200) {
        this.process = Number(res.data.progress);
        this.state = res.data.state;
        const data = res.data.processVo;
        this.startTime = data.startTime;
        this.endTime = data.endTime;
        this.processIng = data.processStopVoList.filter(
          (v) => v.state === "STARTED"
        );

        if (
          res.data.state !== "COMPLETED" &&
          res.data.state !== "FAILED" &&
          res.data.state !== "KILLED"
        ) {
          this.timer = setTimeout(() => {
            this.processMonitoring(appid);
          }, 5000);
        } else {
          this.handleClear()
        }
      } else {
      }
    },
    getErrorLog(){
          this.$refs.ErrorLogRef.handleOpen(this.appId)
    },
   async handleClear(){
      clearTimeout(this.timer);
          const res = await getByProcessId(this.$route.query.processId);
          this.data = res.data.data;
          this.publishInfo = this.data.flowPublishing;
          this.state = res.data.data.state.text
    },
    handDataPublish() {
      this.$refs.PublishModalRef.handleAdd(this.data);
    },
    // 查看日志
    async handleShowLog() {
      this.$event.emit("loading", true);
      const res = await getLogUrl({ appId: this.appId });
      this.$event.emit("loading", false);
      if (res.data.code === 200 && res.data.stderrLog.includes("http")) {
        this.$refs.LogRef.handleOpen(res.data.stdoutLog, res.data.stderrLog);
      } else {
        this.$Message.warning({
          content: "暂无日志",
          duration: 3,
        });
      }
    },
    handleDownDataProduct() {
      let ids = [];
      this.data.dataProductList.forEach((v) => {
        if (v.file && v.file.id) {
          ids.push(v.file.id);
        }
      });
      download(downloadFileByIds, ids, this.data.name, true);
    },
    handleReturn(){
      this.$router.push(`/home/flowConfig?id=${this.publishInfo.id}&type=${this.publishInfo.productTypeId}&processId=${this.$route.query.processId}&productTypeName=${this.$route.query.productTypeName}`)
    }
  },
  beforeDestroy() {
   if(this.timer)clearTimeout(this.timer);
    if(this.appIdTimer) clearTimeout(this.appIdTimer)
  },
};
</script>
    
<style lang="scss" scoped>
@import "../../index.scss";

.processIng {
  text-align: center;
  animation: dong 2s linear 1s infinite;
}
@keyframes dong {
  0% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.3;
  }
}

::v-deep .progress {
  i {
    font-size: 16px;
  }
}

.process_failed{
  text-align: center;
}

.progressWrap {
  background: #f7f9fa;
  padding: 0px 40px 48px;
  border-radius: 0 0 8px 8px;
}

.btn {
  margin-top: 20px;
  text-align: right;
  button {
    line-height: 28px;
    height: 28px;
    font-size: 14px;
    padding: 0 12px;
    margin-right: 8px;
    border-radius: 8px;
    background: #e6f1fe;
    color: #005bc4;
    border: none;
  }
}
.stop {
  display: flex;
  padding-right: 20px;
  margin-bottom: 20px;
  justify-content: space-between;
  >div{
    display: flex;
  }
  .returnBtn {
    background: #fff;
    color: #3974AA;
  }
  .stopBtn {
    background: #724343;
    color: #fff;
  }
  .log{
    background: #fff;
    color: #006fee;
    margin-left: 10px;
  }
}
</style>