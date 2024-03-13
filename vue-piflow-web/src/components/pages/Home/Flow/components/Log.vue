<template>
  <Modal width="90%" v-model="open" title="日志" footer-hide>
    <Tabs @on-click="handleClick">
      <TabPane label="stdout" icon="ios-barcode">
        <div class="innerLog" v-html="content1"></div>
      </TabPane>
      <TabPane label="stderr" icon="ios-bug">
        <div class="innerLog" v-html="content2"></div>
      </TabPane>
    </Tabs>
  </Modal>
</template>
<script>
import { getLog } from "@/apis/process";
export default {
  data() {
    return {
      open: false,
      content1: "",
      content2: "",
      stderrLog:"",
      stdoutLog:'',
    };
  },
  methods: {
    handleOpen(stdoutLog, stderrLog) {
      this.stdoutLog = stdoutLog;
      this.stderrLog = stderrLog;
      this.content1 = ''
      this.content2 = ''
      this.open = true;
      this.getLog(this.stdoutLog, "content1");
    },
    handleClick(name) {
      if (name === 0) {
        this.getLog(this.stdoutLog, "content1");
      } else {
        this.getLog(this.stderrLog, "content2");
      }
    },
    async getLog(url, content) {
      if (this[content]) return;
      const res = await getLog({ url });
      const parser = new DOMParser();
      const doc = parser.parseFromString(res.data, "text/html");
      const bodyContent = doc.body.querySelectorAll(".content")[0].innerHTML;
      this[content] = bodyContent;
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
.innerLog {
  height: calc(80vh - 136px);
  overflow: auto;
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