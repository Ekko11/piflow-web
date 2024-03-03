<template>
  <div>
    <h4 class="content_title"> <Icon type="ios-undo" @click="$router.go(-1)"/>  · {{ publishInfo.name }} ·</h4>
    <div class="desc" v-if="publishInfo.description">
      {{ publishInfo.description }}
    </div>

 
    
    <div class="config">
      <div class="config_r" ref="imgWrap" :style="{backgroundImage:`url(${coverFileImg})`}">
      </div>
      <div class="config_input"  v-for="child in list" :key="child.id">
        <!-- 文件输入 -->
        <div v-if="child.type === 0">
          <div class="label">
            {{ child.name }} <span class="fileDonw"  @click="handleDownload(child.fileId, child.fileName)">(样例下载)</span>
          </div>
          <div>
            <div @click="handleUpload(child)">
              <Upload
                :disabled="mode !== 'edit'"
                action="/null"
                :before-upload="handleBeforeUpload"
              >
                <Button class="uploadBtn" icon="md-cloud-upload"
                  >上传文件</Button
                >
              </Upload>
              <p class="fileName" v-if="fileMap[child.id] || ( mode !== 'edit' )">{{mode !== 'edit' ? child.customValue:fileMap[child.id] }}</p>
            </div>
          </div>
        </div>
        <!-- 普通输入 -->
        <div v-if="child.type === 1">
          <div class="label">
            {{ child.name }}       
            <Poptip trigger="hover" placement="top" >
                <Icon type="md-help-circle" style="color:rgba(0, 0, 0, 0.4)" />
                <div class="toptipContent" slot="content">
                    <p>推荐值：<span>{{child.customValue}}</span> </p>
                    <p>描述：<span>{{child.description}}</span> </p>
                </div>
            </Poptip>
          </div>
          <div>
            <Input
              :disabled="mode !== 'edit'"
              v-model="child.customValue"
            ></Input>
          </div>

      </div>  
      </div>
      <div class="config_input" v-for="child in list" :key="child.id + 1">
        <!-- 文件输入 -->
        <div v-if="child.type === 0">
          <div class="label">
            {{ child.name }} <span class="fileDonw"  @click="handleDownload(child.fileId, child.fileName)">(样例下载)</span>
          </div>
          <div>
            <div @click="handleUpload(child)">
              <Upload
                :disabled="mode !== 'edit'"
                action="/null"
                :before-upload="handleBeforeUpload"
              >
                <Button class="uploadBtn" icon="md-cloud-upload"
                  >上传文件</Button
                >
              </Upload>
              <p class="fileName" v-if="fileMap[child.id] || ( mode !== 'edit' )">{{mode !== 'edit' ? child.customValue:fileMap[child.id] }}</p>
            </div>
          </div>
        </div>
        <!-- 普通输入 -->
        <div v-if="child.type === 1">
          <div class="label">
            {{ child.name }}
          </div>
          <div>
            <Input
              :disabled="mode !== 'edit'"
              v-model="child.customValue"
            ></Input>
          </div>

      </div>  
      </div>

    </div>

 

    <div class="notice" v-if="noticeOpen">
      <div class="close" @click="handleNoticeClose">
        <Icon type="ios-close" />
      </div>
      <div class="logo">
        <Icon type="ios-information-circle-outline" />
      </div>
      <div class="notice_content">
        <div>正在下载中，请稍等</div>
        <div v-if="progress">当前已下载：{{ progress }}% </div>
      </div>

    </div>
  </div>
</template>
    
<script>
import { getPublishingById } from "@/apis/flowPublish";
import { getFileNameByHeaders,downloadByBlob, uploadFile } from "@/apis/file";
import { downloadFile  } from "@/apis/file";
export default {
  props: {
    mode: String,
    flowInfo: Object,
  },
  watch: {
    flowInfo: {
      handler(val) {
        if (val.id && JSON.stringify(val) !== JSON.stringify(this.publishInfo))
          this.init(val);
      },
      deep: true,
      immediate: true,
    },
  },
  data() {
    return {
      publishInfo: {},
      list:[],
      fileMap:{},  //已上传文件map
      progress:0,
      noticeOpen:false,
      coverFileImg:null,
    };
  },

  methods: {
    init(val) {
      this.fileInput = [];
      this.textInput = [];
      this.output = [];
      delete val.crtDttm;
      delete val.crtDttmString;
      delete val.crtUser;
      delete val.lastUpdateDttm;
      delete val.lastUpdateDttmString;
      delete val.lastUpdateUser;
      delete val.enableFlag;
      this.publishInfo = val;
      this.getCoverImg(val.coverFileId ||'1763853768035663872')
      const list  = []
      this.publishInfo.stops.forEach((item) => {
        item.stopPublishingPropertyVos.forEach((v) => {
          if (v.type === 1 || v.type === 0) {
            list.push(v);
          } 
        });
      });
      this.list = list
    },
    handDataPublish(row) {
      this.$refs.PublishModalRef.handleAdd(row);
    },
    async getCoverImg(id){
      const res = await downloadFile(id)
      const reader = new FileReader();
      reader.readAsDataURL(res.data);
      reader.onload = () => {
        this.coverFileImg = reader.result;
        console.log(this.coverFileImg)
      };
    },

    async handleGetStopsById() {
      const res = await getPublishingById(this.$route.query.id);
    },
     handleDownload(id, fileName) {
      this.noticeOpen = true
      const _this = this
      this.$axios({
        method: "get",
        url: `/file/getFileById?id=${id}`,
        responseType: "blob",
        onDownloadProgress(ProgressEvent) {
          const load = ProgressEvent.loaded;
          const total = 314572800;
          const progress = Math.floor((load / total) * 100);
          _this.progress = progress
          if(progress === 100){
            _this.noticeOpen =false
          }
        },
      })
        .then((res) => {
          if (res.data.code) {
            this.$Message.error({
              content: '下载失败',
              duration: 3,
            });
          } else {
            this.noticeOpen = false
            const file = res.data;
            const blob = new Blob([file]);
            fileName = getFileNameByHeaders(res.headers, fileName);
            downloadByBlob(blob, fileName);
          }
        })
        .catch((error) => {
          this.$Message.error({
            content: this.$t("tip.fault_content"),
            duration: 3,
          });
        });
      // download(downloadFile, id, fileName);
    },
    handleUpload(child) {
      this.currentPropos = child;
    },
    async realUpload(e) {
      const res = await uploadFile({
        file: e,
        associateType: 4,
        associateId: this.currentPropos.id,
      });
      
      this.$set(fileMap,currentPropos.id,e.name)
      this.currentPropos.customValue = res.data.data.filePath;
    },
    handleBeforeUpload(e) {
      this.realUpload(e);
      return false;
      // this.currentProps.fileName = e.name;
      // this.fileList.push({ id: this.currentProps.propertyId, file: e });
    },
    handleNoticeClose(){
      this.noticeOpen = false
    }
  },

};
</script>
    
    <style lang="scss" scoped>
@import "../../index.scss";
::v-deep .contain {



}
::v-deep .config{
  overflow: hidden;
  background: #f7f9fa;
  padding: 48px 40px;
  margin-top: 32px;
  border-radius:  8px 8px 0 0 ;
  &_r{
    float: right;
    width: 44%;
    background-size: contain;
    background-repeat: no-repeat;
    height: 340px;
    margin-bottom: 20px;
  }
  &_input{
    float: left;
    width: 25%;
    padding: 0 20px 20px 0;
    box-sizing: border-box;
    height: 120px;
    
    .ivu-input {
      border-radius: 6px;
    }
    .label{
      color: #18181B;
      font-size: 14px;
      margin-bottom: 16px;
    }
    .uploadBtn {
      background: #E6F1FE;
      border: none;
      color: #005BC4;
      font-size: 11px;
    }
    .fileName{
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      width: 100%;
      color: #9b9393;
    }
    .fileDonw{
        color: #005BC4;
        font-size: 12px;
        text-decoration-line: underline;
        cursor: pointer;
    }
    .toptipContent{
      word-break: break-all;
      white-space: normal;
      max-width: 400px;
    }
  }
}
.btn {
  button {
    line-height: 24px;
    height: 24px;
    font-size: 11px;
    padding: 0 12px;
    margin-right: 8px;
    border-radius: 8px;
    background: #e6f1fe;
    color: #005bc4;
    border: none;
  }
}
.page {
  display: flex;
  justify-content: flex-end;
  margin-top: 32px;
}
.notice{
  position: fixed;
  top: 85px;
  right: 20px;
  width: 335px;
  position: fixed;
  padding: 16px;
  border-radius: 4px;
  box-shadow: 0 1px 6px rgba(0,0,0,.2);
  background: #fff;
  line-height: 1;
  display: flex;
  .close{
    position: absolute;
    right: 4px;
    top: 0;
    cursor: pointer;
    font-size: 30px;
  }
  .logo{
    i{
      font-size: 36px;
      color: #2d8cf0;
      font-size: 36px;
      color: #2d8cf0;
      margin-right: 20px;
    }
  }
  &_content{
    div{
      margin-bottom: 6px;
    }
  }

}

.content_title{
  position: relative;
  i{
    position: absolute;
    left: 0;
    top: 0;
    line-height: 30px;
    cursor: pointer;
  }
}
</style>