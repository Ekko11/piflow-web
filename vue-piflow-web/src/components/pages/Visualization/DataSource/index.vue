<template>
  <section>
    <!-- header -->
    <div class="navbar">
      <div class="left">
        <span>{{ $t("sidebar.datasource") }}</span>
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

    <!-- add / update -->
    <Modal
      v-model="isOpen"
      :title="
        formData.id
          ? $t('datasource.update_title')
          : $t('datasource.create_title')
      "
      :ok-text="$t('modal.ok_text')"
      :cancel-text="$t('modal.cancel_text')"
      @on-ok="handleComfirm"
    >
      <div class="modal-warp">
        <div class="item" v-if="!formData.id">
          <label>{{ $t("datasource.type") }}：</label>
          <Select v-model="formData.type" style="width: 350px">
            <Option value="mysql">Mysql</Option>
            <Option value="excel">Excel</Option>
          </Select>
        </div>
        <div class="item">
          <label>{{ $t("datasource.name") }}：</label>
          <Input
            v-model="formData.name"
            :placeholder="$t('modal.placeholder')"
            style="width: 350px"
          />
        </div>
        <div class="item">
          <label class="self">{{ $t("datasource.description") }}：</label>
          <Input
            v-model="formData.description"
            type="textarea"
            :rows="4"
            :placeholder="$t('modal.placeholder')"
            style="width: 350px"
          />
        </div>
        <div class="item" v-if="formData.type === 'excel' &&  !formData.id">
          <label class="self">{{ $t("datasource.upload") }}：</label>
          <Upload
          :action="url + 'visual/uploadExcel'"
          :on-success="handleFileSuccess"
          :on-error="handleFileError"
          :before-upload="handleFileBefore"
          :show-upload-list="false"
          style="width: 350px"
          class="upload"
          v-if="!this.file"
          >
            <div>
              <Icon
                type="ios-cloud-upload"
                size="52"
                style="color: #3399ff"
              ></Icon>
              <p>Click or drag files here to upload</p>
            </div>
          </Upload>
          <div  class="fileList" v-else>
            <p><Icon type="ios-paper"/>{{file.name}}</p>
            <Icon type="ios-trash"  @click="handleDelFile"/>
          </div>
        </div>
        <div class="item" v-if="formData.type === 'excel' && formData.id">
          <label>{{ $t("datasource.excelName") }}：</label>
          <Input
            v-model="formData.tableName"
            :disabled="formData.id"
            style="width: 350px"
          />
        </div>
        <div class="item" v-if="formData.type === 'excel'">
          <label>{{ $t("datasource.sheetName") }}：</label>
          <Input
            v-model="formData.sheetName"
            :disabled="formData.id"
            :placeholder="$t('datasource.sheetNamePlaceholder')"
            style="width: 350px"
          />
        </div>
        <div class="item" v-if="formData.type === 'mysql' ||  (formData.id && formData.type === 'mysql' )">
          <label class="self">{{ $t("datasource.database") }}：</label>
          <Select
            v-model="formData.dataBaseId"
            style="width: 350px"
            @on-change="handleDatabaseChange"
          >
            <Option
              v-for="item in dataBaseList"
              :value="item.id"
              :key="item.id"
            >
              {{ item.dbName }}</Option
            >
          </Select>
        </div>
        <div
          class="item"
          v-if="dataSheetList.length && (formData.type === 'mysql' || formData.id)"
        >
          <label class="self">{{ $t("datasource.datasheet") }}：</label>
          <Select v-model="formData.tableName"
          :transfer="true"
           style="width: 350px">
            <Option v-for="item in dataSheetList" :value="item" :key="item">
              {{ item }}</Option
            >
          </Select>
        </div>
      </div>
    </Modal>
  </section>
</template>

<script>
import { baseUrl } from "../config/index";
export default {
  name: "VisualizationDataSource",
  components: {},
  data() {
    return {
      isOpen: false,
      page: 1,
      limit: 10,
      total: 0,
      url: baseUrl,
      tableData: [],
      // 数据库列表
      dataBaseList: [],
      // 数据库中表列表
      dataSheetList: [],
      param: "",
      // 表单
      InitFormData: {
        name: "",
        type: "mysql",
        description: "",
        dataBaseId: "",
        tableName: "",
      },
      file:null,
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
          title: this.$t("datasource.name"),
          key: "name",
        },
        {
          title: this.$t("datasource.type"),
          key: "type",
        },
        {
          title: this.$t("datasource.description"),
          key: "description",
        },
        {
          title: this.$t("datasource.createTime"),
          key: "createTime",
          sortable: true,
        },
        {
          title: this.$t("datasource.action"),
          slot: "action",
          width: 150,
          align: "center",
        },
      ];
    },
  },
  created() {
    this.getTableData();
    this.getDataBaseList();
  },
  watch: {
    param(val) {
      this.page = 1;
      this.limit = 10;
      this.getTableData();
    },
  },
  methods: {
    // 获取数据库表列表
    async handleGetDBtables(data) {
      this.$event.emit("loading", true);
      try {
        const res = await this.$axios({
          method: "POST",
          baseURL: baseUrl,
          url: "/visual/getDBTables",
          data,
        });
        this.$event.emit("loading", false);
        console.log(res);
        if (res.data.code === 200) {
          this.dataSheetList = res.data.data;
        }
      } catch (err) {
        this.$event.emit("loading", false);
        this.$Message.error({
          content: this.$t("tip.fault_content"),
          duration: 3,
        });
      }
    },
    handleDatabaseChange(val) {
      this.dataSheetList = [];
      if (!val) return;
      const { driverClass, password, userName, url } = this.dataBaseList.find(
        (v) => v.id === val
      );
      this.handleGetDBtables({ driverClass, password, userName, url });
    },
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
    handleEdit(row) {
      const { id, name, description, dataBaseId, tableName,sheetName,type } = row;
      this.formData = { id, name, description, dataBaseId, tableName,sheetName ,type};
      this.handleDatabaseChange(dataBaseId);
      this.isOpen = true;
    },
    handleComfirm() {
      if (this.formData.id) {
        this.handleUpdate();
      } else {
        if(this.formData.type === 'mysql'){
          this.handleAdd();
        }else{
          this.handleUploadExcel()
        }
      }
    },
    handleUploadExcel(){
      if(!this.file){
          this.$Message.error({
            content: '文件不能为空',
            duration: 3,
          });
        return 
      }
      const  formData = new FormData()
      for (const key in this.formData) {
        if(key !== 'dataBaseId' &&  key !== 'tableName'){
          formData.append(key,this.formData[key])
        }
      }
      formData.append('file',this.file)
      this.$axios({
        method: "POST",
        baseURL: baseUrl,
        url: "/visual/uploadExcel",
        data: formData,
        headers:{
          'Content-Type':'multipart/form-data'
        },
      })
        .then((res) => {
          this.$event.emit("loading", false);
          if (res.data.code === 200) {
            this.isOpen = false;
            this.$Message.success({
              content:
                `${this.formData.name} ` + this.$t("tip.add_success_content"),
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
    handleAdd() {
      this.$event.emit("loading", true);
      this.$axios({
        method: "POST",
        baseURL: baseUrl,
        url: "/visual/addGraphTemplate",
        data: this.formData,
      })
        .then((res) => {
          this.$event.emit("loading", false);
          if (res.data.code === 200) {
            this.isOpen = false;
            this.$Message.success({
              content:
                `${this.formData.name} ` + this.$t("tip.add_success_content"),
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
    handleUpdate() {
      this.$event.emit("loading", true);
      this.$axios({
        method: "POST",
        baseURL: baseUrl,
        url: "/visual/updateGraphTemplate",
        data: this.formData,
      })
        .then((res) => {
          this.$event.emit("loading", false);
          if (res.data.code === 200) {
            this.isOpen = false;
            this.$Message.success({
              content:
                `${this.formData.name} ` +
                this.$t("tip.update_success_content"),
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
        content: `${this.$t("modal.delete_content")} ${row.name}?`,
        onOk: () => {
          this.$axios({
            method: "POST",
            baseURL: baseUrl,
            url: "/visual/delGraphTemplate",
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
        data.queryContent = this.param;
      }
      this.$axios({
        method: "POST",
        baseURL: baseUrl,
        url: "/visual/getGraphTemplateList",
        data,
      })
        .then((res) => {
          if (res.data.code === 200) {
            this.tableData = res.data.data;
            this.total = res.data.totalCount;
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
    getDataBaseList() {
      this.$axios({
        method: "POST",
        baseURL: baseUrl,
        url: "/visual/getDatabaseList",
        data: { pageNum: 1, pageSize: 999 },
      })
        .then((res) => {
          if (res.data.code === 200) {
            this.dataBaseList = res.data.data;
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
    onPageChange(pageNo) {
      this.page = pageNo;
      this.getTableData();
    },

    onPageSizeChange(pageSize) {
      this.limit = pageSize;
      this.getTableData();
    },
    handleModalSwitch() {
      this.isOpen = !this.isOpen;
      this.file = null
      this.formData = { ...this.InitFormData };
    },
    // 上传
    handleFileSuccess(response, file, fileList) {
      this.$event.emit("loading", false);
      if (response.code === 200) {
        this.$Modal.success({
          title: this.$t("tip.title"),
          content: this.$t("tip.upload_success_content"),
        });
        this.getTableData();
      } else {
        this.$Message.error({
          content: this.$t("tip.upload_fail_content"),
          duration: 3,
        });
      }
    },
    handleFileError(error, file, fileList) {
      console.log(error);
      this.$event.emit("loading", false);
      this.$Message.error({
        content: this.$t("tip.upload_fail_content"),
        duration: 3,
      });
    },

    handleFileBefore(file) {
      this.file = file
      return false
    },
    handleDelFile(){
      this.file = null
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
.fileList{
  display: flex;
  justify-content: space-between;
  width: 345px;
  font-size: 18px;
  align-items: center;
}
</style>

