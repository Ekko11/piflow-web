<template>
  <Modal width="90%" v-model="open" title="错误日志" footer-hide>
    <div class="innerLog  loading_wrap" v-if="loading">
      <div>
        <img src="@/assets/img/loading.gif" />
        <p>加载中。。。</p>
      </div>
    </div>
    <div class="innerLog"  v-else v-html="log"></div>
  </Modal>
</template>
<script>
import { getErrorLogInfo } from "@/apis/process";
export default {
  data() {
    return {
      open: false,
      loading: false,
      log:'',
    };
  },
  methods: {
   async handleOpen(appId) {
      this.open = true;
      this.loading = true
      const res = await getErrorLogInfo(appId)
      this.loading = false
      if(res.data.code === 200){
        this.log = res.data.data.errorInfo;

      }else{
        this.$Message.error({
              content: this.$t("tip.stop_fail_content"),
              duration: 3,
        });
      }
    },


  },
};
</script>

<style lang="scss" >
.ivu-modal {
  .ivu-modal-body {
    overflow: auto;
    max-height: calc(80vh - 51px);
  }
}
.loading_wrap{
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.innerLog {
  height: calc(80vh - 136px);
  overflow: auto;
  line-height: 28px;
  pre {
    display: block;
    padding: 10px;
    margin: 0;
    font-size: 13px;
    line-height: 20px;
    word-break: break-all;
    word-wrap: break-word;
    white-space: pre;
    white-space: pre-wrap;
    background-color: #f5f5f5;
    border: 1px solid #ccc;
    border: 1px solid rgba(0, 0, 0, 0.15);
  }
}
</style>