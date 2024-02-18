<template>
  <div class="content">
    <h4 class="content_title">· 大气环境要素数据产品加工 ·</h4>
    <div class="desc">
      参照气象行业标准《地面气象观测资料质量控制》，对自动气象观测站观测的逐时地面气象要素（气温、降水量、湿度、风速、大气压等）和辐射要素数据（L0级数据）进行质量控制、数据插补和统计分析等处理，生成日尺度、月尺度和年尺度的大气环境要素数据产品（L1-L3级数据）。
    </div>

    <div class="list">
      <Table :columns="columns" :data="data">
        <template slot-scope="{ row }" slot="action">
            <div class="btn">
                <Button @click="handleEnter(row)">进入</Button>
                <Button @click="handShowInstructions(row)">说明</Button>
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
</template>

<script>
export default {
  data() {
    return {
      page: 1,
      limit: 10,
      total: 30,
      columns: [
        {
          title: "名称",
          key: "name",
        },
        {
          title: "描述信息",
          key: "age",
        },
        {
          title: "创建时间",
          key: "address",
        },
        {
          title: "操作",
          slot: "action",
          width: 200,
          align: "center"
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
  methods: {
    handleEnter(row){
        console.log(row)
    },
    handShowInstructions(row){
        console.log(row)
    },
    onPageChange(pageNo) {
      this.page = pageNo;
      this.getTableData()
    },

    onPageSizeChange(pageSize) {
      this.limit = pageSize;
      this.getTableData()
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../index.scss";
::v-deep .list {
  margin-top: 32px;
  .ivu-table {
    .ivu-table-header thead tr {
      th {
        background: linear-gradient(180deg, #3974aa 0%, #2f587d 100%);
        color: #fff;
        line-height: 65px;
        font-size: 14px;
        padding: 0;
        &:not(:last-child){
            position: relative;
            &::after{
                content: '|';
                position: absolute;
                right: 0;
                top: 0;
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
        td{
            background: #f7f9fa;
        }
    }
  }
}
.btn{
    button{
        line-height: 24px;
        height: 24px;
        font-size: 11px;
        padding: 0 12px;
        margin-right: 8px;
        border-radius: 8px;
        &:first-child{
            background: #006FEE;
            color: #fff;
        }
        &:last-child{
            background: #F2EAFA;
            border:1px solid #6020A0;
            color: #6020A0;
            box-sizing: border-box;
        }
    }
}
.page{
    display: flex;
    justify-content: end;
    margin-top: 32px;
}
</style>