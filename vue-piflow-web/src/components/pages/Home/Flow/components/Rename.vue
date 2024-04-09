<template>
  <Modal
    v-model="open"
    width="520px"
    title="运行"
    :ok-text="$t('modal.ok_text')"
    :cancel-text="$t('modal.cancel_text')"
    @on-ok="handleComfirm"
    class="custom-modal"
  >
    <div style="width: 100%; height: 100%">
      <Form
        class="formInfo"
        ref="formValidate"
        :rules="ruleValidate"
        :model="formInfo"
        :label-width="100"
      >
        <Form-item label="名称" prop="name">
          <Input v-model="formInfo.name" :placeholder="name"></Input>
        </Form-item>
        <Form-item label="备注">
          <Input
            v-model="formInfo.bak1"
            type="textarea"
            :rows="3"
            placeholder="请输入"
          ></Input>
        </Form-item>
      </Form>
    </div>
  </Modal>
</template>

<script>
export default {
  data() {
    return {
      open: false,
      name:'',
      formInfo: {
        name: "",
        bak1: "",
      },
      ruleValidate: {
        name: [
          {
            required: true,
            message: "名称不能为空",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    handleOpen(name){
        this.open = true
        this.name = name
        window.addEventListener('keydown',this.keyDown);

    },
    handleComfirm() {
      this.$refs.formValidate.validate( (valid) => {
          if(valid){
            this.$emit("submit", this.formInfo);
            this.open = false
            window.removeEventListener('keydown',this.keyDown,false);
          }
      })

    },
    keyDown(e){
      if(e.keyCode === 13 || e.keyCode === 100){
        this.handleComfirm()
      }
    }
  },
  destroyed() {
    window.removeEventListener('keydown',this.keyDown,false);
  }
};
</script>

<style lang="scss" scoped></style>
