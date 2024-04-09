<template>
  <section>
    <!-- header -->
    <div class="navbar">
      <div class="left">
        <span>数据产品授权管理</span>
      </div>
    </div>
    <!-- Table button -->
    <Table border :columns="columns" :data="tableData">
      <template slot-scope="{ row }" slot="action">
        <div class="btn">
          <Button  v-if="row.state === 1" @click="handleVerify(row)">审核</Button>
          <span v-else>{{stateArr[row.state]}}</span>
        </div>
      </template>
    </Table>
    <!-- paging -->
    <div class="page">
      <Page
        :prev-text="$t('page.prev_text')"
        :next-text="$t('page.next_text')"
        show-elevator
        :show-total="true"
        :total="total"
        :current="page"
        show-sizer
        @on-change="onPageChange"
        @on-page-size-change="onPageSizeChange"
      />
    </div>

    <!-- 审核 -->
    <Modal
      v-model="applyIsOpen"
      width="520px"
      title="审核"
      :ok-text="$t('modal.ok_text')"
      :cancel-text="$t('modal.cancel_text')"
      @on-ok="handleComfirm"
      class="custom-modal"
    >
      <div style="width: 100%; height: 100%">
        <Form
          class="formApplyInfo"
          :model="formApplyInfo"
          :label-width="100"
        >
          <Form-item label="审核">
            <Radio-group  v-model="formApplyInfo.state">
              <Radio :label="2">通过</Radio>
              <Radio :label="3">拒绝</Radio>
            </Radio-group>
          </Form-item>
          <Form-item label="理由">
            <Input
            v-model="formApplyInfo.opinion"
              type="textarea"
              :rows="3"
              placeholder="请输入"
            ></Input>
          </Form-item>
        </Form>
      </div>
    </Modal>

  </section>
</template>

<script>
import {getByPageForPermission,permissionForUse} from '@/apis/dataProduct'
export default {
  name: "Accredit",
  components: {},
  data() {
    
    return {
      applyIsOpen: false,
      page: 1,
      limit: 10,
      total: 0,
      tableData: [],
      stateArr: {
        0:'失效',
        1:'待审核',
        2:'审核通过',
        3:'审核拒绝',
      },
      // 审核
      formApplyInfo: {
        id: "",
        state: 2, //默认通过
        opinion: "",
      },
    };
  },
  computed: {
    columns() {
      return [
        {
          title: "标题",
          key: "productName",
        },
        {
          title: "申请者",
          key: "userName",
        },
        {
          title: "申请理由",
          key: "reason",
        },
        // {
        //   title:'状态',
        //   key: "state",
        //   render: (h, params) => {
        //     return h('span', this.stateArr[params.row.state]);
        //   },
        // },
        {
          title: this.$t("database.action"),
          slot: "action",
          width:  200,
          align: "center",
        },
      ];
    },
  },
  created() {
    this.getTableData();
  },

  methods: {
    handleVerify(row){
      this.applyIsOpen = true
      this.formApplyInfo.id = row.id
      this.formApplyInfo.state = row.state
      this.formApplyInfo.opinion = row.opinion
    },
    async handleComfirm(){
        this.$event.emit("loading", true);
        const res = await permissionForUse(this.formApplyInfo)
        this.$event.emit("loading", false);
        if(res.data.code === 200){
            this.$Message.success({
              content: '审核成功',
              duration: 3
            });
        }else{
          this.$Message.error({
              content: res.data.errorMsg,
              duration: 3
            });
        }
        this.applyIsOpen = false
    },




 
   async getTableData() {
      let data = { page: this.page, limit: this.limit };
      if (this.param) {
        data.keyword = this.param;
      }
      const res = await getByPageForPermission(data)
      this.tableData = res.data.data;
      this.total = res.data.count
      // this.$axios({
      //     method:'POST',
      //     url:'/visual/getDatabaseList',
      //     data
      // }).then(res=>{
      //       if (res.data.code === 200) {
      //         this.total = res.data.totalCount;
      //       } else {
      //         this.$Message.error({
      //           content: this.$t("tip.request_fail_content"),
      //           duration: 3
      //         });
      //       }
      //     }).catch(error => {
      //       console.log(error);
      //       this.$Message.error({
      //         content: this.$t("tip.fault_content"),
      //         duration: 3
      //       });
      //     });
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
@import "./index.scss";
.item {
  display: flex;
  label {
    margin-top: 5px;
  }
}
.upload{
  background: #fff;
  border: 1px dashed #dcdee2;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
  width: 350px;
  padding: 20px  0;
}
.btn button{ 
  margin-right: 3px;
}
</style>

