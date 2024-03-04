<template>
  <div class="content">
    <Flow mode="edit" ref="flow" :flowInfo="publishInfo" />
    <div class="history">
      <div class="history_btn">
        <Button class="run" @click="handleRun()">运行</Button>

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
              <Button @click="handleEnter(row)">查看</Button>
              <!-- <Button @click="handleShowLog(row)">日志查看</Button> -->
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
  </div>
</template>
  
  <script>
import { getPublishingById, runPublishFlow } from "@/apis/flowPublish";
import { getProcessPageByPublishingId } from "@/apis/process";
import { downloadFile, download, downloadFileByIds } from "@/apis/file";
import PublishModal from "@/components/pages/DataProductManagement/Publish/PublishModal";
import Flow from "../components/flow";
import axios from "axios";
export default {
  components: {
    PublishModal,
    Flow,
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
            return h("span", [params.row.state.text]);
          },
          width: 150,
          align: "center",
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
    async handleRun() {
      this.$event.emit("loading", true);
      if(this.publishInfo.id === '1764490182175752192'){
        this.publishInfo.stops.find(v=>v.stopId === 'fac92355d0eb42358d7711d21302735f').stopPublishingPropertyVos.find(v=>v.id === '1764493523953909763').customValue =  this.publishInfo.stops.find(v=>v.stopId === '7cd9ccfb5c16432cab698a05b0e2b7f9').stopPublishingPropertyVos.find(v=>v.id === '1764493523953909762').customValue
        this.publishInfo.stops.find(v=>v.stopId === 'fac92355d0eb42358d7711d21302735f').stopPublishingPropertyVos.find(v=>v.id === '1764493523953909764').customValue =  this.publishInfo.stops.find(v=>v.stopId === '7cd9ccfb5c16432cab698a05b0e2b7f9').stopPublishingPropertyVos.find(v=>v.id === '1764493523953909761').customValue
      }

      const res = await runPublishFlow(this.publishInfo);
      this.$event.emit("loading", false);
      if (res.data.code === 200) {
        this.$router.push(
          `/home/flowProcess?processId=${res.data.data.processId}`
        );
      } else {
        this.$Message.error({
          content: res.data.errorMsg,
          duration: 3,
        });
      }
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

    handleEnter(row) {
      this.$router.push(`/home/flowProcess?processId=${row.id}`);
    },
    handShowInstructions(row) {
      console.log(row);
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