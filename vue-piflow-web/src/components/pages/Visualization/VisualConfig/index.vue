<template>
  <section>
    <!-- header -->
    <div class="navbar">
      <div class="left">
        <span>{{ $t("sidebar.data_source") }}</span>
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
        style="width: 300px"
      />
    </div>
    <!-- Table button -->
    <Table border :columns="columns" :data="tableData">
      <template slot-scope="{ row }" slot="action">
        <Tooltip
          v-for="(item, index) in promptContent"
          :key="index"
          :content="item.content"
          placement="top-start"
        >
          <span class="button-warp" @click="handleButtonSelect(row, index + 1)">
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
        @on-page-size-change="onPageSizeChange"
      />
    </div>

    <Modal
    v-model="isOpen"
    :title="$t('visualconfig.create_title')"
    :ok-text="$t('modal.ok_text')"
    :cancel-text="$t('modal.cancel_text')"
    @on-ok="handleAdd">
  <div class="modal-warp">
    <div class="item">
      <label>{{$t('visualconfig.name')}}：</label>
      <Input
          v-model="formData.name"
          show-word-limit
          maxlength="100"
          :placeholder="$t('modal.placeholder')"
          style="width: 350px" />
    </div>
    <div class="item">
      <label class="self">{{$t('visualconfig.description')}}：</label>
      <Input
          v-model="formData.description"
          type="textarea"
          :rows="4"
          :placeholder="$t('modal.placeholder')"
          style="width: 350px"/>
    </div>
    <div class="item">
      <label class="self">{{$t('visualconfig.datasource')}}：</label>
      <Select v-model="formData.graphTemplateId" 
        style="width:350px">
        <Option
            v-for="item in dataSourceList"
            :value="item.id"
            :key="item.id">
          {{ item.name }}</Option>
      </Select>
    </div>
  </div>
</Modal>

  </section>
</template>

<script>
import { baseUrl } from "../config/index";
export default {
  name: "VisualizationVisualConfig",
  components: {},
  data() {
    return {
      isOpen: false,
      page: 1,
      limit: 10,
      total: 0,
      tableData: [],
      dataSourceList: [],
      // 表单
      formData: {},
      InitFormData: {
        name: "",
        description: "",
        graphTemplateId:'',
        configInfo:''
      },
      param: "",
      // 操作
      promptContent: [
        {
          content: "Enter",
          icon: "ios-redo",
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
          title: this.$t("visualconfig.name"),
          key: "name",
          sortable: true,
        },
        {
          title: this.$t("visualconfig.description"),
          key: "description",
        },
        {
          title: this.$t("visualconfig.createTime"),
          key: "createTime",
          sortable: true,
        },
        {
          title: this.$t("visualconfig.action"),
          slot: "action",
          width: 150,
          align: "center",
        },
      ];
    },
  },
  created() {
    this.getTableData();
    this.getDataSourceList()
  },
  methods: {
    handleButtonSelect(row, key) {
      switch (key) {
        case 1:
          this.handleEnter(row);
          break;
        case 2:
          this.handleDelete(row);
          break;
        default:
          break;
      }
    },
    handleAdd(){
      this.$event.emit("loading", true);
      this.$axios({
          method:'POST',
          baseURL:baseUrl,
          url:'/visual/addGraphConf',
          data:this.formData
      }).then((res) => {
          this.$event.emit("loading", false);
          if (res.data.code === 200) {
            this.isOpen = false;
            this.$Message.success({
              content:  `${this.formData.name} ` + this.$t("tip.add_success_content"),
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
    handleEnter(row) {
      this.$router.push({ path: "/graphconfig", query: { id:row.id } });
    },
    handleDelete(row) {
      this.$Modal.confirm({
        title: this.$t("tip.title"),
        okText: this.$t("modal.confirm"),
        cancelText: this.$t("modal.cancel_text"),
        content: `${this.$t("modal.delete_content")} ${row.name}?`,
        onOk: () => {
          this.$axios({
            method: "POST",
            baseURL: baseUrl,
            url: "/visual//delGraphConf",
            data: { id: row.id },
          })
            .then((res) => {
              if (res.data.code === 200) {
                this.$Modal.success({
                  title: this.$t("tip.title"),
                  content:
                    `${row.name} ` + this.$t("tip.delete_success_content"),
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
        data.param = this.param;
      }
      this.$axios({
        method: "POST",
        baseURL: baseUrl,
        url: "/visual/getGraphConfList",
        data,
      })
        .then((res) => {
          if (res.data.code === 200) {
            this.tableData = res.data.data;
            this.total = res.data.count;
          } else {
            this.$Message.error({
              content: this.$t("tip.request_fail_content"),
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
    getDataSourceList() {
      this.$axios({
          method:'POST',
          baseURL:baseUrl,
          url:'/visual/getGraphTemplateList',
          data: { pageNum: 1, pageSize: 999 }
      }).then(res=>{
            if (res.data.code === 200) {
              this.dataSourceList = res.data.data;
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
</style>

