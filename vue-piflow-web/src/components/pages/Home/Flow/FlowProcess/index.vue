<template>
  <div class="content">
    <p class="return" @click="$router.go(-1)"><Icon type="ios-arrow-back" />返回</p>
    <Flow mode="process" :flowInfo="publishInfo" />
    <div class="progress">
      <div>
        <p v-for="item in processIng" class="processIng" :key="item.id">
          正在进行 {{ item.name }} ...
        </p>
      </div>
      <Progress :percent="process" :stroke-width="12" status="active" />
      <div class="btn">
        <Button @click="handShowInstructions()">数据产品下载</Button>
        <Button @click="handDataPublish()">数据产品发布</Button>
      </div>
    </div>
      <PublishModal ref="PublishModalRef"/>
  </div>
</template>
    
    <script>
import { getAppInfo,getByProcessId } from "@/apis/process";
import PublishModal from '@/components/pages/DataProductManagement/Publish/PublishModal'

import Flow from "../components/flow";
export default {
  components: {
    Flow,PublishModal
  },
  data() {
    return {
      publishInfo: {},
      process: 0,
      processIng: [ ],
      completedStatus: ["COMPLETED", "FAILED", "KILLED"],
    };
  },
  created() {

    this.init();
  },
  methods: {
   async init() {
      const res = await getByProcessId(this.$route.query.processId)
      this.data =res.data.data
      this.publishInfo = this.data.flowPublishingVo;
      this.processMonitoring(this.data.appId);
    },
    
    async processMonitoring(appid) {
      const res = await getAppInfo({ appid });
      if (res.data.code === 200) {
        this.process = Number(res.data.progress);
        this.state = res.data.state;
        const data = res.data.processVo;
        this.startTime = data.startTime;
        this.endTime = data.endTime;
        // this.processIng = data.processStopVoList.filter(
        //   (v) => v.state === "STARTED"
        // );
        // console.log(this.processIng);

        if (
          res.data.state !== "COMPLETED" &&
          res.data.state !== "FAILED" &&
          res.data.state !== "KILLED"
        ) {
          this.timer = setTimeout(() => {
            this.processMonitoring(appid);
          }, 5000);
        } else {
          clearTimeout(this.timer);
        }
      } else {
      }
    },
    handDataPublish(){
      this.$refs.PublishModalRef.handleAdd(this.data)
    },
  },
  beforeDestroy() {
    clearTimeout(this.timer);
  },
};
</script>
    
<style lang="scss" scoped>
@import "../../index.scss";
.processIng{
  text-align: center;
  animation: dong 2s linear 1s infinite;
}
@keyframes dong{
  0%{
    opacity: 0.3;
  }
  50%{
    opacity: 1;
  }
  100%{
    opacity: 0.3;
  }
}


::v-deep .progress {
  i {
    font-size: 16px;
  }
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
</style>