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
          <Button  @click="handleVerify(row)">审核</Button>
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
          ref="formApplyInfo"
          :model="formApplyInfo"
          :label-width="100"
        >
          <Form-item label="审核">
            <Radio-group v-model="formApplyInfo.auditStatus">
              <Radio label="PASS">通过</Radio>
              <Radio label="REJECT">拒绝</Radio>
            </Radio-group>
          </Form-item>
          <Form-item
            label="理由"
            prop="messsage"
          >
            <Input
              type="textarea"
              :rows="3"
              v-model="formApplyInfo.messsage"
              placeholder="请输入"
            ></Input>
          </Form-item>
        </Form>
      </div>
    </Modal>

  </section>
</template>

<script>
import {saveDataProduct} from '@/apis/dataProduct'
export default {
  name: "VisualizationDataBase",
  components: {},
  data() {
    return {
      applyIsOpen: false,
      page: 1,
      limit: 10,
      total: 0,
      tableData: [],
      // 审核
      formApplyInfo: {
        id: "",
        auditStatus: "PASS", //默认通过
        messsage: "",
      },
    };
  },
  computed: {
    columns() {
      return [
        {
          title: "标题",
          key: "name",
          sortable: true,
        },
        {
          title: "描述",
          key: "description",
        },
        {
          title: "封面",
          key: "createTime",
          render: (h, params) => {
            return h("div", [
              h("img", {
                attrs: {
                  src: "https://file.iviewui.com/dist/bf31433c102ed612fbe82afe000dda40.png",
                  with:'40px',
                  height:'40px'
                },
              }),
             ,
            ]);
          },
        },
        {
          title: "申请者",
          key: "description",
        },
        {
          title: "申请理由",
          key: "description",
        },
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
    },
    async handleComfirm(){
        const res = await aaa(this.formApplyInfo)
        this.applyIsOpen = false
    },




 
    getTableData() {
      let data = { pageNum: this.page, pageSize: this.limit };
      if (this.param) {
        data.queryContent = this.param;
      }
      this.tableData = [{ name: 123 }];
      // this.$axios({
      //     method:'POST',
      //     url:'/visual/getDatabaseList',
      //     data
      // }).then(res=>{
      //       if (res.data.code === 200) {
      //         this.tableData = res.data.data;
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

