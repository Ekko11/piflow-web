<template>
  <section>
    <!-- header -->
    <div class="navbar">
      <div class="left">
        <span>数据产品发布管理</span>
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
        <div class="btn">
          <Button @click="handleEdit(row)">编辑</Button>
          <Button @click="handleEdit(row)">下载</Button>
          <Button @click="handleEdit(row)">发布</Button>
          <Button @click="handleEdit(row)">下架</Button>
          <Button @click="handleDelete(row)">删除</Button>
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

    <!-- 编辑 -->
    <Modal
      v-model="isOpen"
      title="编辑"
      :ok-text="$t('modal.ok_text')"
      :cancel-text="$t('modal.cancel_text')"
      @on-ok="handleComfirm"
    >
      <div class="modal-warp">
        <div class="item">
          <label>名称：</label>
          <Input
            v-model="formData.name"
            show-word-limit
            maxlength="100"
            :placeholder="$t('modal.placeholder')"
            style="width: 350px"
          />
        </div>
        <div class="item">
          <label class="self">分类：</label>
          <treeselect
            v-model="formData.parentId"
            :placeholder="$t('modal.placeholder_select')"
            :normalizer="normalizer"
            :options="treeData"
            style="width: 350px"
          />
        </div>
        <div class="item">
          <label>权限：</label>
          <RadioGroup v-model="animal">
            <Radio value="0">公开</Radio>
            <Radio value="1">授权</Radio>
          </RadioGroup>
        </div>
        <div class="item">
          <label>简介：</label>
          <Input
            v-model="formData.description"
            type="textarea"
            :rows="4"
            :placeholder="$t('modal.placeholder')"
            style="width: 350px"
          />
        </div>
        <div class="item">
          <label>关键词：</label>
          <Input
            v-model="formData.name"
            show-word-limit
            maxlength="100"
            :placeholder="$t('modal.placeholder')"
            style="width: 350px"
          />
        </div>

        <div class="item">
          <label>发布者姓名：</label>
          <Input
            v-model="formData.name"
            show-word-limit
            maxlength="100"
            :placeholder="$t('modal.placeholder')"
            style="width: 350px"
          />
        </div>

        <div class="item">
          <label>发布者邮箱：</label>
          <Input
            v-model="formData.name"
            show-word-limit
            maxlength="100"
            :placeholder="$t('modal.placeholder')"
            style="width: 350px"
          />
        </div>

        <div class="item">
          <label class="self">封面：</label>
          <Upload
          :action="url + 'visual/uploadExcel'"
          :on-success="handleFileSuccess"
          :on-error="handleFileError"
          :before-upload="handleFileBefore"
          :show-upload-list="false"
          style="width: 350px"
          class="upload"
          >
            <div>
              <!-- <Icon
                type="ios-cloud-upload"
                size="52"
                style="color: #3399ff"
              ></Icon> -->
              <img style="width:100px;height:40px" src="https://file.iviewui.com/dist/bf31433c102ed612fbe82afe000dda40.png" alt="">
              <p>Click or drag files here to upload</p>
            </div>
          </Upload>
        </div>

      </div>
    </Modal>
  </section>
</template>

<script>
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
      treeData: [],
      param: "",
      formData: {},
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
          title: this.$t("database.action"),
          slot: "action",
          width: 350,
          align: "center",
        },
      ];
    },
  },
  created() {
    this.getTableData();
    this.handleGetTreeData();
  },
  watch: {
    param(val) {
      this.page = 1;
      this.limit = 10;
      this.getTableData();
    },
  },
  methods: {
    handleGetTreeData() {
      const data = [
        {
          name: "生态系统要素数据",
          id: 1,
          children: [
            {
              name: "大气环境要素",
              id: 3,
            },
            {
              name: "生物要素",
              id: 4,
            },
          ],
        },
        {
          name: "生态系统服务功能数据",
          id: 2,
          children: [
            {
              name: "生产力和固碳功能",
              id: 5,
            },
            {
              name: "生物多样性维护功能生物多样性维护功能",
              id: 6,
            },
          ],
        },
      ];
      this.treeData = data;
    },

    handleEdit(row) {
      const { id, dbName, description, driverClass, password, url, userName } =
        row;
      this.formData = {
        id,
        dbName,
        description,
        driverClass,
        password,
        url,
        userName,
      };
      this.isOpen = true;
    },
    handleComfirm() {
      if (this.formData.id) {
        this.handleUpdate();
      } else {
        this.handleAdd();
      }
    },

    handleUpdate() {
      this.$event.emit("loading", true);
      this.$axios({
        method: "POST",
        url: "/visual/updateDatabase",
        data: this.formData,
      })
        .then((res) => {
          this.$event.emit("loading", false);
          if (res.data.code === 200) {
            this.isOpen = false;
            this.$Message.success({
              content:
                `${this.formData.dbName} ` +
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
        content: `${this.$t("modal.delete_content")} ${row.dbName}?`,
        onOk: () => {
          this.$axios({
            method: "POST",
            url: "/visual/delDatabase",
            data: { id: row.id },
          })
            .then((res) => {
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
    normalizer(node) {
      return {
        id: node.id,
        label: node.name,
        children:
          node.children && node.children.length ? node.children : undefined,
      };
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
</style>

