<template>
  <div class="content">
    <Flow
      mode="edit"
      ref="flow"
      :flowInfo="publishInfo"
      @nameMap="handleNameMap"
    />
    <div class="history">
      <div class="history_btn">
        <Button @click="historyIsShow = !historyIsShow"
          >历史记录
          <Icon
            :type="historyIsShow ? 'md-arrow-dropup' : 'md-arrow-dropdown'"
          />
        </Button>
        <div>
          <Button class="stop" @click="handleSave()">暂存</Button>
          <Button class="run" @click="handleReName()">运行</Button>
        </div>
      </div>
      <div v-show="historyIsShow" class="history_list">
        <Table :columns="columns" :data="historyData" :loading="loading">
          <template slot-scope="{ row }" slot="action">
            <div class="btn">
              <Button @click="handleEnter(row)">查看</Button>

              <template v-if="!row.dataProductList.some((v) => v.file)">
                <Button @click="handleShowLog(row)">日志查看</Button>
                <Button
                  v-if="
                    !row.dataProductList.length ||
                      !row.dataProductList.some((v) => v.state === 5)
                  "
                  @click="handleDelete(row)"
                  >删除</Button
                >
              </template>
              <template v-else>
                <Button
                  v-if="row.dataProductList.some((v) => v.file)"
                  @click="handleDownDataProduct(row)"
                  >数据产品下载</Button
                >
                <Button
                  v-if="row.dataProductList.some((v) => v.state === 3)"
                  @click="handDataPublish(row)"
                  >数据产品发布</Button
                >

                <Button
                  v-if="row.dataProductList.every((v) => v.state === 5)"
                  disabled
                  class="disabled"
                  @click="handDataPublish(row)"
                  >数据产品已发布</Button
                >

                <Dropdown :transfer="true" >
                  <a href="javascript:void(0)" style="font-size: 11px;">
                    更多
                    <Icon type="ios-arrow-down"></Icon>
                  </a>
                  <DropdownMenu slot="list">
                    <DropdownItem>
                      <Button @click="handleShowLog(row)">日志查看</Button>
                    </DropdownItem>
                    <DropdownItem
                      v-if="
                        !row.dataProductList.length ||
                          !row.dataProductList.some((v) => v.state === 5)
                      "
                    >
                      <Button @click="handleDelete(row)"
                        >删除</Button
                      ></DropdownItem
                    >
                  </DropdownMenu>
                </Dropdown>
              </template>
            </div>
          </template>
        </Table>
        <div class="page">
          <Page
            show-elevator
            size="small"
            :total="total"
            :current="page"
            show-sizer
            @on-change="onPageChange"
            @on-page-size-change="onPageSizeChange"
          />
        </div>
      </div>
    </div>

    <PublishModal ref="PublishModalRef"  @onSubmit="getHistoryList"/>
    <Log ref="LogRef" />
    <Rename ref="RenameRef" @submit="handleRun" />
  </div>
</template>

<script>
import {
  getPublishingById,
  runPublishFlow,
  tempSaveFlow,
} from "@/apis/flowPublish";
import {
  getProcessPageByPublishingId,
  getLogUrl,
  getByProcessId,
  deleteForPublishing,
} from "@/apis/process";
import { download, downloadFileByIds } from "@/apis/file";
import PublishModal from "@/components/pages/DataProductManagement/Publish/PublishModal";
import Flow from "../components/flow";
import Log from "../components/Log";
import Rename from "../components/Rename";

export default {
  components: {
    PublishModal,
    Flow,
    Log,
    Rename,
  },
  data() {
    return {
      page: 1,
      loading: false,
      limit: 10,
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
          width: 180,
          align: "center",
        },
        {
          title: "结束时间",
          key: "lastUpdateDttm",
          width: 180,
          align: "center",
        },
        {
          title: "运行状态",
          key: "state",
          render: (h, params) => {
            return h("span", [
              (params.row.state && params.row.state.text) || "INIT",
            ]);
          },
          width: 140,
          align: "center",
        },
        {
          title: "备注",
          key: "pageId",
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
    handleNameMap(val) {
      this.nameMap = val;
    },
    // 暂存
    async handleSave() {
      this.$event.emit("loading", true);
      const data = JSON.parse(JSON.stringify(this.publishInfo));
      data.stops.forEach((v) => {
        v.stopPublishingPropertyVos.forEach((k) => {
          k.tempSaveValue = k.customValue; //暂存
          k.customValue = k.customValue1; //推荐值
          delete k.allowableValues1;
          delete k.customValue1;
        });
      });
      const res = await tempSaveFlow(data);
      this.$event.emit("loading", false);
    },
    handleReName() {
      this.$refs.RenameRef.handleOpen(this.publishInfo.name);
    },
    // 运行
    async handleRun(formData) {
      this.$event.emit("loading", true);
      const data = JSON.parse(JSON.stringify(this.publishInfo));
      data.name = formData.name;
      data.bak1 = formData.bak1;
      data.stops.forEach((v) => {
        v.stopPublishingPropertyVos.forEach((k) => {
          k.customValue = k.customValue ? k.customValue : k.customValue1;
          // 同名属性 赋值
          for (const key in this.nameMap) {
            const i = this.nameMap[key].findIndex((t) => t === k.id);
            if (i !== -1) {
              let targetProp;
              data.stops.forEach((q) => {
                let obj = q.stopPublishingPropertyVos.find((m) => m.id === key);
                if (obj) targetProp = obj;
              });
              k.customValue = targetProp.customValue
                ? targetProp.customValue
                : targetProp.customValue1;
            }
          }
          k.tempSaveValue = k.customValue;
          delete k.allowableValues1;
          delete k.customValue1;
        });
      });
      const res = await runPublishFlow(data);
      this.$event.emit("loading", false);
      if (res.data.code === 200) {
        this.$router.push(
          `/home/flowProcess?processId=${res.data.data.processId}&productTypeName=${this.$route.query.productTypeName}&type=${this.$route.query.type}`
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
      if (this.$route.query.processId) {
        const res = await getByProcessId(this.$route.query.processId);
        if (res.data.code === 200) {
          this.publishInfo = res.data.data.flowPublishing;
        } else {
          this.$Message.error({
            content: res.data.errorMsg,
            duration: 3,
          });
        }
      } else {
        const res = await getPublishingById(this.$route.query.id);
        if (res.data.code === 200) {
          res.data.data.stops = res.data.data.stops.map((v) => ({
            ...v,
            stopPublishingPropertyVos: v.stopPublishingPropertyVos.map((k) => ({
              ...k,
              customValue1: k.customValue,
              customValue: k.tempSaveValue,
            })),
          }));
          this.publishInfo = res.data.data;
        } else {
          this.$Message.error({
            content: res.data.errorMsg,
            duration: 3,
          });
        }
      }

      this.getHistoryList();
    },
    //查看进程
    handleEnter(row) {
      this.$router.push(
        `/home/flowProcess?processId=${row.id}&productTypeName=${this.$route.query.productTypeName}&type=${this.$route.query.type}`
      );
    },
    // 查看日志
    async handleShowLog(row) {
      const res = await getLogUrl({ appId: row.appId });
      if (res.data.code === 200 && res.data.stderrLog.includes("http")) {
        this.$refs.LogRef.handleOpen(res.data.stdoutLog, res.data.stderrLog);
      } else {
        this.$Message.warning({
          content: "暂无日志",
          duration: 3,
        });
      }
    },
    async getHistoryList() {
      const data = {
        limit: this.limit,
        page: this.page,
        publishingId: this.publishInfo.id,
      };
      this.loading = true;
      const res = await getProcessPageByPublishingId(data);
      this.loading = false;
      this.historyData = res.data.data;
      this.total = res.data.count;
      if (this.historyData.length) {
        this.historyIsShow = true;
      }
    },
    handleDelete(row) {
      this.$Modal.confirm({
        title: this.$t("tip.title"),
        okText: this.$t("modal.confirm"),
        cancelText: this.$t("modal.cancel_text"),
        content: `${this.$t("modal.delete_content")} ${row.name}?`,
        onOk: async () => {
          const res = await deleteForPublishing(row.id);
          if (res.data.code === 200) {
            this.$Modal.success({
              title: this.$t("tip.title"),
              content: `${row.name} ` + this.$t("tip.delete_success_content"),
            });
            this.getHistoryList();
          } else {
            this.$Message.error({
              content: res.data.errorMsg,
              duration: 3,
            });
          }
        },
      });
    },
    onPageChange(pageNo) {
      this.page = pageNo;
      this.getHistoryList();
    },

    onPageSizeChange(pageSize) {
      this.limit = pageSize;
      this.getHistoryList();
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
        margin-left: 10px;
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
::v-deep .ivu-dropdown-item {
  button {
    width: 100%;
  }
}
::v-deep .ivu-dropdown-item,
.btn {
  text-align: left;
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
  .disabled {
    background: #eee;
    color: #3f3f46;
  }
}
.page {
  display: flex;
  justify-content: flex-end;
  margin-top: 32px;
}
</style>
