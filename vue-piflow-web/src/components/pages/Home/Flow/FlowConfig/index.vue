<template>
  <div class="content">
    <h4 class="content_title">· {{ publishInfo.name }} ·</h4>
    <div class="desc" v-if="publishInfo.description">
      {{ publishInfo.description }}
    </div>

    <div class="contain" v-if="publishInfo.stops">
      <div class="config">
        <div class="config_l">
          <template v-for="item in publishInfo.stops">
            <div
              v-for="child in item.stopPublishingPropertyVos"
              :key="child.id"
            >
              <div class="label">
                {{ child.name }} <Icon type="md-cloud-download"  @click="handleDownload(child.id)"/>
              </div>
              <div>
                <Upload action="/null" :before-upload="handleBeforeUpload">
                  <Button class="uploadBtn" icon="md-cloud-upload"
                    >Upload files</Button
                  >
                </Upload>
                <p v-if="child.file">{{ child.fileName }}</p>
              </div>
            </div>
          </template>
        </div>
        <div class="config_r">
          <img src="@/assets/img/home/p1.png" alt="" />
        </div>
      </div>

      <div>
        <Button class="run" @click="handleRun(row)">运行</Button>
      </div>
      <div class="progress">
        <Progress :percent="25" :stroke-width="12" status="active" />
      </div>

      <div class="history">
        <div class="history_btn">
          <Button @click="historyIsShow = !historyIsShow">历史记录 <Icon :type="historyIsShow ?'md-arrow-dropup':'md-arrow-dropdown'" /> </Button>
        </div>
        <div v-show="historyIsShow" class="history_list">
          <Table :columns="columns" :data="data">
            <template slot-scope="{ row }" slot="action">
              <div class="btn">
                <Button @click="handleEnter(row)">日志查看</Button>
                <Button @click="handShowInstructions(row)">数据产品下载</Button>
                <Button @click="handShowInstructions(row)">数据产品发布</Button>
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
    </div>
  </div>
</template>
  
  <script>
import { getPublishingById } from "@/apis/flowPublish";
import { downloadFile } from "@/apis/file";

export default {
  data() {
    return {
      page: 1,
      limit: 5,
      total: 30,
      historyIsShow:false,
      publishInfo:{},
      columns: [
        {
          title: "名称",
          key: "name",
        },
        {
          title: "运行人",
          key: "age",
        },
        {
          title: "运行时间",
          key: "address",
        },
        {
          title: "运行状态",
          key: "address",
        },
        {
          title: "操作",
          slot: "action",
          width: 340,
          align: "center",
        },
      ],
      data: [
        {
          name: "John Brown",
          age: 18,
          address: "New York No. 1 Lake Park",
          date: "2016-10-03",
        },
        {
          name: "Jim Green",
          age: 24,
          address: "London No. 1 Lake Park",
          date: "2016-10-01",
        },
        {
          name: "Joe Black",
          age: 30,
          address: "Sydney No. 1 Lake Park",
          date: "2016-10-02",
        },
        {
          name: "Jon Snow",
          age: 26,
          address: "Ottawa No. 2 Lake Park",
          date: "2016-10-04",
        },
      ],
    };
  },
  created(){
    this.handleGetStopsById()
  },
  methods: {
    async handleGetStopsById(){
      const res = await getPublishingById(this.$route.query.id);
      this.publishInfo = res.data.data
    },
  async handleDownload(id){
      const  res = await downloadFile(id)
    },
    handleEnter(row) {
      console.log(row);
    },
    handShowInstructions(row) {
      console.log(row);
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
.contain {
  background: #f7f9fa;
  padding: 48px 100px;
  margin-top: 32px;
  .config {
    display: flex;
    justify-content: space-between;
    &_l {
      display: flex;
      flex-wrap: wrap;
      flex-grow: 1;
      margin-right: 16px;
      justify-content: space-between;
      > div {
        width: 48%;
        height: 50px;
      }
      .label {
        font-size: 14px;
        color: #18181b;
        margin-bottom: 16px;
        i {
          font-size: 18px;
          color: #005bc4;
          cursor: pointer;
          margin-left: 5px;
        }
      }
      .uploadBtn {
        background: #e6f1fe;
        border: none;
        color: #005bc4;
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
              color: #D4D4D8;
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
    background: #E6F1FE;
    color: #005BC4;
    border: none;
  }
}
.page {
  display: flex;
  justify-content: flex-end;
  margin-top: 32px;
}
</style>