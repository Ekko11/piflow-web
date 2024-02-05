<template>
  <section>
    <!-- header -->
    <div class="navbar">
      <div class="left">
        <span>{{$t("sidebar.data_source")}}</span>
      </div>
      <div class="right">
        <span class="button-warp" @click="handleModalSwitch">
          <Icon type="md-add" />
        </span>
      </div>
    </div>
    <!-- search -->
    <div class="input">
      <Input
          suffix="ios-search"
          v-model="param"
          :placeholder="$t('modal.placeholder')"
          style="width: 300px"/>
    </div>
    <!-- Table button -->
    <Table border :columns="columns" :data="tableData">
      <template slot-scope="{ row }" slot="action">
        <Tooltip v-for="(item, index) in promptContent" :key="index" :content="item.content" placement="top-start">
            <span class="button-warp" @click="handleButtonSelect(row,index+1)">
              <Icon :type="item.icon" />
            </span>
        </Tooltip>
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
          @on-page-size-change="onPageSizeChange"/>
    </div>

    <!-- add / update -->
    <Modal
        v-model="isOpen"
        :title="formData.id?$t('database.update_title'):$t('database.create_title')"
        :ok-text="$t('modal.ok_text')"
        :cancel-text="$t('modal.cancel_text')"
        @on-ok="handleComfirm">
      <div class="modal-warp">
        <div class="item">
          <label>{{$t('database.name')}}：</label>
          <Input
              v-model="formData.dbName"
              show-word-limit
              maxlength="100"
              :placeholder="$t('modal.placeholder')"
              style="width: 350px" />
        </div>
        <div class="item">
          <label class="self">{{$t('database.description')}}：</label>
          <Input
              v-model="formData.description"
              type="textarea"
              :rows="4"
              :placeholder="$t('modal.placeholder')"
              style="width: 350px"/>
        </div>
        <div class="item">
          <label>{{$t('database.url')}}：</label>
          <Input
              v-model="formData.url"
              show-word-limit
              maxlength="100"
              :placeholder="$t('modal.placeholder')"
              style="width: 350px" />
        </div>
        <div class="item">
          <label>{{$t('database.driver')}}：</label>
          <Input
              v-model="formData.driverClass"
              show-word-limit
              maxlength="100"
              :placeholder="$t('modal.placeholder')"
              style="width: 350px" />
        </div>
        <div class="item">
          <label>{{$t('database.user')}}：</label>
          <Input
              v-model="formData.userName"
              show-word-limit
              maxlength="100"
              :placeholder="$t('modal.placeholder')"
              style="width: 350px" />
        </div>
        <div class="item">
          <label>{{$t('database.password')}}：</label>
          <Input
              v-model="formData.password"
              name="databasePassword"
              password 
              type="password"
              :placeholder="$t('modal.placeholder')"
              style="width: 350px" />
        </div>
      </div>
    </Modal>
  </section>
</template>

<script>
import {baseUrl} from '../config/index'
export default {
  name: "VisualizationDataBase",
  components: {},
  data() {
    return {
      isOpen: false,
      page: 1,
      limit: 10,
      total: 0,
      tableData: [],

      param: "",
      //
      // 表单
      InitFormData: {
        dbName: "",
        description: "",
        url: "",
        driverClass: "",
        userName: "",
        password: "",
      },
      formData: {},
      // 操作
      promptContent: [
        {
          content: "Edit",
          icon: "ios-create-outline",
        },
        {
          content: "Delete",
          icon: "ios-trash",
        },
      ],
    };
  },
  computed: {
    columns() {
      return [
        {
          title: this.$t("database.name"),
          key: "dbName",
          sortable: true
        },
        {
          title: this.$t("database.description"),
          key: "description"
        },
        {
          title: this.$t("database.createTime"),
          key: "createTime",
          sortable: true
        },
        {
          title: this.$t("database.action"),
          slot: "action",
          width: 150,
          align: "center"
        }
      ];
    }
  },
  created() {
    this.getTableData();
  },
  watch:{
    param(val){
      this.page = 1 
      this.limit = 10 
      this.getTableData()
    }
  },
  methods: {
    handleButtonSelect(row, key) {
      switch (key) {
        case 1:
          this.handleEdit(row);
          break;
        case 2:
          this.handleDelete(row);
          break;
        default:
          break;
      }
    },
    handleEdit(row){
      const  {id,dbName,description,driverClass,password,url,userName} = row
      this.formData = {id,dbName,description,driverClass,password,url,userName}
      this.isOpen = true
    },
    handleComfirm() {
      if(this.formData.id){
          this.handleUpdate()
      }else{
          this.handleAdd()
      }
    },
    handleAdd(){
      this.$event.emit("loading", true);
      this.$axios({
          method:'POST',
          baseURL:baseUrl,
          url:'/visual/addDatabase',
          data:this.formData
      }).then((res) => {
          this.$event.emit("loading", false);
          if (res.data.code === 200) {
            this.isOpen = false;
            this.$Message.success({
              content:  `${this.formData.dbName} ` + this.$t("tip.add_success_content"),
              duration: 3,
            });
            this.getTableData();
          } else {
            this.$Message.error({
              content: res.data.msg,
              duration: 3,
            });
          }
        })
        .catch((error) => {
          this.$event.emit("loading", false);
          this.$Message.error({
            content: this.$t("tip.fault_content"),
            duration: 3,
          });
        });
    },
    handleUpdate(){
      this.$event.emit("loading", true);
      this.$axios({
          method:'POST',
          baseURL:baseUrl,
          url:'/visual/updateDatabase',
          data:this.formData
      }).then((res) => {
          this.$event.emit("loading", false);
          if (res.data.code === 200) {
            this.isOpen = false;
            this.$Message.success({
              content:  `${this.formData.dbName} ` + this.$t("tip.update_success_content"),
              duration: 3,
            });
            this.getTableData();
          } else {
            this.$Message.error({
              content: res.data.msg,
              duration: 3,
            });
          }
        })
        .catch((error) => {
          this.$event.emit("loading", false);
          this.$Message.error({
            content: this.$t("tip.fault_content"),
            duration: 3,
          });
        });
    },
    handleDelete(row) {
      this.$Modal.confirm({
        title: this.$t("tip.title"),
        okText: this.$t("modal.confirm"),
        cancelText: this.$t("modal.cancel_text"),
        content: `${this.$t("modal.delete_content")} ${row.dbName}?`,
        onOk: () => {
          this.$axios({
          method:'POST',
          baseURL:baseUrl,
          url:'/visual/delDatabase',
          data:{id:row.id}
          }).then((res) => {
              if (res.data.code === 200) {
                this.$Modal.success({
                  title: this.$t("tip.title"),
                  content:
                    `${row.dbName} ` + this.$t("tip.delete_success_content"),
                });
                this.getTableData();
              } else {
                this.$Message.error({
                  content: res.data.msg,
                  duration: 3,
                });
              }
            })
            .catch((error) => {
              console.log(error);
              this.$Message.error({
                content: this.$t("tip.fault_content"),
                duration: 3,
              });
            });
        },
      });
    },
    getTableData() {
      let data = { pageNum: this.page, pageSize: this.limit };
      if (this.param) {
        data.queryContent = this.param;
      }
      this.$axios({
          method:'POST',
          baseURL:baseUrl,
          url:'/visual/getDatabaseList',
          data
      }).then(res=>{
            if (res.data.code === 200) {
              this.tableData = res.data.data;
              this.total = res.data.totalCount;
            } else {
              this.$Message.error({
                content: this.$t("tip.request_fail_content"),
                duration: 3
              });
            }
          }).catch(error => {
            console.log(error);
            this.$Message.error({
              content: this.$t("tip.fault_content"),
              duration: 3
            });
          });
    },

    onPageChange(pageNo) {
      this.page = pageNo;
      this.getTableData();
    },

    onPageSizeChange(pageSize) {
      this.limit = pageSize;
      this.getTableData();
    },
    // 打开或者关闭新增
    handleModalSwitch() {
      this.isOpen = !this.isOpen;
      this.formData = { ...this.InitFormData };
    },
  }
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
</style>

