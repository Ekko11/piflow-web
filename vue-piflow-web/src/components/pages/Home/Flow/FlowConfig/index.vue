<template>
  <div class="content">
    <Flow mode="edit" ref="flow" :flowInfo="publishInfo" />
    <div class="history">
      <div class="history_btn">
        <Button @click="historyIsShow = !historyIsShow"
          >历史记录
          <Icon
            :type="historyIsShow ? 'md-arrow-dropup' : 'md-arrow-dropdown'"
          />
        </Button>
        <div>
          <Button class="stop" @click="handleRun()">暂存</Button>
          <Button class="run" @click="handleRun()">运行</Button>
        </div>
      </div>
      <div v-show="historyIsShow" class="history_list">
        <Table :columns="columns" :data="historyData">
          <template slot-scope="{ row }" slot="action">
            <div class="btn">
              <Button @click="handleEnter(row)">查看</Button>
              <Button @click="handleShowLog(row)">日志查看</Button>
              <Button v-if="row.dataProductList.some((v) => v.file)" @click="handleDownDataProduct(row)">数据产品下载</Button>
              <Button
                v-if="
                  row.dataProductList &&
                  row.dataProductList.length &&
                  row.dataProductList.some((v) => v.state ===3)
                "
                @click="handDataPublish(row)"
                >数据产品发布</Button
              >
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

    <PublishModal ref="PublishModalRef" />
    <Log ref="LogRef" />
  </div>
</template>
  
  <script>
import { getPublishingById, runPublishFlow } from "@/apis/flowPublish";
import { getProcessPageByPublishingId,getLogUrl } from "@/apis/process";
import { downloadFile, download, downloadFileByIds } from "@/apis/file";
import PublishModal from "@/components/pages/DataProductManagement/Publish/PublishModal";
import Flow from "../components/flow";
import Log from "../components/Log";
export default {
  components: {
    PublishModal,
    Flow,
    Log
  },
  data() {
    return {
      page: 1,
      limit: 5,
      total: 0,
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
          key: "crtDttm",
          width: 200,
          align: "center",
        },
        {
          title: "运行状态",
          key: "state",
          render: (h, params) => {
            return h("span", [  (params.row.state && params.row.state.text) || 'INIT']);
          },
          width: 150,
          align: "center",
        },
         {
          title: "结束时间",
          key: "lastUpdateDttm",
        },
        {
          title: "操作",
          slot: "action",
          width: 400,
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
    handleBack() {
      this.$router.push(`/home/list?type=${this.$route.query.type}`);
    },
    handleDownDataProduct(row) {
      let ids = [];
      row.dataProductList.forEach((v) => {
        if (v.file && v.file.id) {
          ids.push(v.file.id);
        }
      });
      download(downloadFileByIds, ids, row.name, true);
    },
    handDataPublish(row) {
      this.$refs.PublishModalRef.handleAdd(row);
    },
    // 暂停
    async  handleStop(){
      
    },
    // 运行
    async handleRun() {
      this.$event.emit("loading", true);
      if(this.publishInfo.id === '1764900256811581440'){
        this.publishInfo.stops.find(v=>v.stopId === 'a01ef52f1d32459c9629f2f0ce8ed1ad').stopPublishingPropertyVos.find(v=>v.id === '1764900256811581448').customValue =  this.publishInfo.stops.find(v=>v.stopId === 'd1573fbedec54738943bd228d73040c1').stopPublishingPropertyVos.find(v=>v.id === '1764900256811581453').customValue
        this.publishInfo.stops.find(v=>v.stopId === 'a01ef52f1d32459c9629f2f0ce8ed1ad').stopPublishingPropertyVos.find(v=>v.id === '1764900256811581449').customValue =  this.publishInfo.stops.find(v=>v.stopId === 'd1573fbedec54738943bd228d73040c1').stopPublishingPropertyVos.find(v=>v.id === '1764900256811581452').customValue
      }
      const data =  JSON.parse(JSON.stringify(this.publishInfo))
      data.stops.forEach(v => {
          v.stopPublishingPropertyVos.forEach(k=>{
            k.customValue = k.customValue ? k.customValue:k.customValue1
            delete k.allowableValues1
          })
      });

      const res = await runPublishFlow(data);
      this.$event.emit("loading", false);
      this.$router.push(
          `/home/flowProcess?processId=${res.data.data.processId}`
        );

        
      // if (res.data.code === 200) {
      //   this.$router.push(
      //     `/home/flowProcess?processId=${res.data.data.processId}`
      //   );
      // } else {
      //   this.$Message.error({
      //     content: res.data.errorMsg,
      //     duration: 3,
      //   });
      // }
    },
    // 根据流水线id 获取组件发布信息
    async handleGetStopsById() {
      const res = await getPublishingById(this.$route.query.id);
      if (res.data.code === 200) {
       res.data.data.stops =  res.data.data.stops.map((v) => ({
          ...v,
          stopPublishingPropertyVos:v.stopPublishingPropertyVos.map(k=>({
            ...k,
            customValue1:k.customValue,
            customValue:'',
          }))
        }));
        this.publishInfo = res.data.data;
        this.getHistoryList();
      } else {
        this.$Message.error({
          content: res.data.errorMsg,
          duration: 3,
        });
      }
    },
    //查看进程
    handleEnter(row) {
      this.$router.push(`/home/flowProcess?processId=${row.id}`);
    },
    // 查看日志
    async handleShowLog(row){
      const res = await  getLogUrl({appId:row.appId})
      if(res.data.code === 200 && res.data.stderrLog.includes('http')){
          this.$refs.LogRef.handleOpen(res.data.stdoutLog,res.data.stderrLog)
      }else{
         this.$Message.warning({
          content: '暂无日志',
          duration: 3,
        });
      }
        console.log(row)
    },
    async getHistoryList() {
      const data = {
        limit: 10,
        page: this.page,
        publishingId: this.publishInfo.id,
      };
      const res = await getProcessPageByPublishingId(data);
      this.historyData = res.data.data;
      this.total = res.data.count;
      if (this.historyData.length) {
        this.historyIsShow = true;
      }
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
  padding: 48px 40px 0;
  border-radius: 8px 8px 0 0;
  margin-top: 32px;
}
::v-deep .history {
  background: #f7f9fa;
  padding: 0px 40px 48px;
  border-radius: 0 0 8px 8px;
  &_btn {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    button {
      background: #f2eafa;
      border: none;
      color: #6020a0;
      &.run {
        background: #006fee;
        color: #fff;
      }
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