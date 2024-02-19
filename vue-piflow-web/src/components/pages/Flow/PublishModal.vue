<template>
  <Modal
    v-model="open"
    :title="formData.id ? '编辑' : '发布'"
    :ok-text="$t('modal.ok_text')"
    :cancel-text="$t('modal.cancel_text')"
    @on-ok="handleSaveUpdateData"
  >
    <div class="modal-warp">
      <div class="item">
        <label>分类：</label>
        <treeselect
          v-model="formData.parentId"
          :placeholder="$t('modal.placeholder_select')"
          :normalizer="normalizer"
          :options="treeData"
          style="width: 350px; height: 32px"
        />
      </div>
    </div>
  </Modal>
</template>

<script>
export default {
  data() {
    return {
      formData: {},
      open:false
    };
  },
  created() {
    this.getTreeData();
  },
  methods: {
    getTreeData() {
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
    handleAdd(id){
        console.log(id)
        this.open = true
    },
    handleEdit(){

    },
    handleSaveUpdateData(){

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
.item{
    margin: 12px 0px;
    display: flex;
    align-items: center;
    label{
      display: inline-block;
      width: 132px;
      text-align: right;
    }
  }
</style>

