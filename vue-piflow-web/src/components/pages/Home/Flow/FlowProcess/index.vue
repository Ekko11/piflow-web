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
import { getAppInfo } from "@/apis/process";
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
      processIng: [
        {
          id: "32fec2748618430ead78f3546f4386cc",
          name: "土壤采样地数据加载",
          bundel: "cn.piflow.bundle.csv.CsvParser",
          groups: "CSV",
          owner: "xjzhu@cnic.cn",
          description: "Parse csv file or folder",
          inports: "Default",
          inPortType: {
            stringValue: "DEFAULT",
            text: "Default",
          },
          outports: "Default",
          outPortType: {
            stringValue: "DEFAULT",
            text: "Default",
          },
          state: "COMPLETED",
          startTime: "2024-02-29 23:09:37",
          endTime: "2024-02-29 23:10:24",
          pageId: "11",
          processStopPropertyVoList: [
            {
              name: "csvPath",
              displayName: "CsvPath",
              description: "The path of csv file or folder",
              customValue: "/work/nadc/dataset/dr1.csv",
              allowableValues: '[""]',
              required: true,
              sensitive: false,
            },
            {
              name: "delimiter",
              displayName: "Delimiter",
              description: "The delimiter of csv file",
              customValue: "|",
              allowableValues: '[""]',
              required: true,
              sensitive: false,
            },
            {
              name: "schema",
              displayName: "Schema",
              description: "The schema of csv file",
              customValue: "",
              allowableValues: '[""]',
              required: false,
              sensitive: false,
            },
            {
              name: "header",
              displayName: "Header",
              description: "Whether the csv file has a header",
              customValue: "true",
              allowableValues: '["true","false"]',
              required: true,
              sensitive: false,
            },
          ],
          processStopCustomizedPropertyVoList: [],
          isDataSource: false,
          endTimeStr: "2024-02-29 23:10:24.0",
          startTimeStr: "2024-02-29 23:09:37.0",
        },
      ],
      completedStatus: ["COMPLETED", "FAILED", "KILLED"],
    };
  },
  created() {
    this.data = {
      crtDttm: "2024-02-29 22:08:17",
      crtUser: "admin",
      lastUpdateDttm: "2024-02-29 22:14:16",
      lastUpdateUser: "syncTask",
      enableFlag: true,
      version: 67,
      crtDttmStr: "2024-02-29 22:08:17.0",
      id: "cf989685e3cc42c4b7ebfd9c6c48a66e",
      name: "test",
      driverMemory: "1g",
      executorNumber: "1",
      executorMemory: "1g",
      executorCores: "1",
      description: "",
      appId: "application_1685439587909_1366",
      processId: "application_1685439587909_1362",
      state: {
        stringValue: "STARTED",
        text: "STARTED",
      },
      startTime: "2024-02-29 22:08:49",
      endTime: "2024-02-29 22:14:12",
      progress: "100.00",
      runModeType: {
        stringValue: "RUN",
        text: "RUN",
      },
      processStopVoList: [],
      processPathVoList: [],
      flowPublishingVo: {
        crtDttm: "2024-02-29 21:54:17",
        crtUser: "admin",
        lastUpdateDttm: "2024-02-29 21:54:17",
        lastUpdateUser: "admin",
        enableFlag: true,
        version: 0,
        id: "1763201023326814208",
        name: "2154测试",
        flowId: "14b11ffde26d4d068515cc473a43f2f1",
        description: "111111111111",
        productTypeId: 4,
        productTypeName: "大气环境要素观测数据产品",
        productTypeDescription:
          "参照气象行业标准《地面气象观测资料质量控制》，对自动气象观测站观测的逐时地面气象要素（气温、降水量、湿度、风速、大气压等）和辐射要素数据（L0级数据）进行质量控制、数据插补和统计分析等处理，生成日尺度、月尺度和年尺度的大气环境要素数据产品（L1-L3级数据）。",
        stops: [
          {
            stopId: "2aa10667605f4e06a44cee4b7cab3257",
            stopPublishingPropertyVos: [
              {
                id: "1763201023326814209",
                publishingId: "1763201023326814208",
                stopId: "2aa10667605f4e06a44cee4b7cab3257",
                stopBundle: "cn.piflow.bundle.csv.CsvParser",
                propertyId: "e3b3c6407401465ab3800983c0430132",
                propertyName: "header",
                name: "header",
                type: 1,
                allowableValues: '["true","false"]',
                customValue: "true",
                description: "Whether the csv file has a header",
                propertySort: 2,
                example: "true",
                version: 0,
              },
            ],
          },
          {
            stopId: "54598a0f6d0e4dc98ba955292e67ff48",
            stopPublishingPropertyVos: [
              {
                id: "1763201023326814210",
                publishingId: "1763201023326814208",
                stopId: "54598a0f6d0e4dc98ba955292e67ff48",
                stopBundle: "cn.piflow.bundle.excel.ExcelWrite",
                propertyId: "b36b2e2ce6af4608b2b33f5cf3d8828a",
                propertyName: "filePath",
                name: "filePath",
                type: 2,
                allowableValues: '[""]',
                customValue: "/test/test1_1763204547150348288.xlsx",
                description: "The path of excel file",
                propertySort: 3,
                example: "/test/test.xlsx",
                version: 0,
              },
            ],
          },
        ],
        crtDttmString: "2024-02-29 22:44:48",
        lastUpdateDttmString: "2024-02-29 22:44:48",
      },
      endTimeStr: "2024-02-29 22:14:12.0",
      startTimeStr: "2024-02-29 22:08:49.0",
      crtDttmString: "2024-02-29 22:44:48",
      lastUpdateDttmString: "2024-02-29 22:44:48",
    };
    this.init();
  },
  methods: {
    init() {
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