<template>
  <div>
    <h4 class="content_title">
      <span
        style="cursor: pointer"
        @click="$router.push(`/home/list?type=${publishInfo.productTypeId}`)"
        >{{ publishInfo.productTypeName }}</span
      >
      >>
      <span style="color: rgb(82, 82, 91)">{{ publishInfo.name }}</span>
    </h4>
    <div class="desc" v-if="publishInfo.description">
      {{ publishInfo.description }}
    </div>

    <div v-if="list.length">
      <div class="config">
        <div class="config_r" ref="imgWrap"  :style="{backgroundImage:`url(${coverFileImg})`}"  @click="handleViewShow">
          <Icon type="ios-expand" />
        </div>
        <div class="config_input"  v-for="child in list" :key="child.id">
          <!-- 文件输入 -->
          <div v-if="child.type === 0">
            <div class="label">
              {{ child.name }} <span class="fileDonw"  @click="handleDownload(child)">(样例下载)</span>
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
                      <p>所属组件：<span>{{child.stopName}}</span> </p>
                      <p>推荐值：<span>{{child.customValue1}}</span> </p>
                      <p>描述：<span>{{child.description}}</span> </p>
                  </div>
              </Poptip>
            </div>
            <div>
              <Input
                :disabled="mode !== 'edit'"
                :placeholder="child.description"
                v-model="child.customValue"
              ></Input>
            </div>
  
        </div>  
        </div>
  
      </div>


    </div>


    <div v-if="list1.length">
      <div class="config1">
        <div class="config1_r"  @click="handleViewShow(true)" >
            <Icon type="ios-expand" />
            <img :src="coverFileImg" alt="">
        </div>
        
        <div>
          <div
          v-for="(item, index) in list1"
          :class="`config_l config_l${index}`"
          :key="index"
        >
          <h4>{{ item.name }}</h4>
          <div>
            <div v-for="child in item.list" class="config_input" :key="child.id">
              <!-- 文件输入 -->
              <div v-if="child.showType === 'upload'" class="config_input-upload">
                <div class="label">
                    <span  class="title">{{ child.name }}</span>
                    <span class="fileDonw" @click="handleDownload(child)"
                    >(样例下载)</span
                  >
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
                    <p class="fileName" v-if="fileMap[child.id] || mode !== 'edit'">
                      {{ mode !== "edit" ? child.customValue : fileMap[child.id] }}
                    </p>
                  </div>
                </div>
              </div>
              <!-- 普通输入 -->
              <div v-if="child.showType === 'input'" class="config_input-input">
                <div class="label">
                    <span  class="title">{{ child.name }}</span>
                    <Poptip trigger="hover" placement="top">
                    <Icon type="md-help-circle" style="color: rgba(0, 0, 0, 0.4)" />
                    <div class="toptipContent" slot="content">
                      <p>
                        所属组件：<span>{{ child.stopName }}</span>
                      </p>
                      <p>
                        推荐值：<span>{{ child.customValue1 }}</span>
                      </p>
                      <p>
                        描述：<span>{{ child.description }}</span>
                      </p>
                    </div>
                  </Poptip>
                </div>
                <div>
                  <Input
                    :disabled="mode !== 'edit'"
                    :placeholder="child.customValue1"
                    v-model="child.customValue"
                  ></Input>
                </div>
              </div>  
                <!-- 选择器 -->
                <div v-if="child.showType === 'select'" class="config_input-select">
                  <div class="label">
                    <span class="title">{{ child.name }}</span>
                    <Poptip trigger="hover" placement="top">
                      <Icon type="md-help-circle" style="color: rgba(0, 0, 0, 0.4)" />
                      <div class="toptipContent" slot="content">
                        <p>
                          所属组件：<span>{{ child.stopName }}</span>
                        </p>
                        <p>
                          推荐值：<span>{{ child.customValue1 }}</span>
                        </p>
                        <p>
                          描述：<span>{{ child.description }}</span>
                        </p>
                      </div>
                    </Poptip>
                  </div>
                  <div>
                    <Select
                      :disabled="mode !== 'edit'"
                      :placeholder="child.customValue1"
                      v-model="child.customValue"
                    >
                   <Option v-for="v in child.allowableValues1" :key="v" :value="v">{{ v }}</Option>
                  
                  </Select>
                  </div>
                </div>  
            </div>
          </div>
  
        </div>
        </div>
  
  
      </div>
    </div>
    <div class="preview" v-show="previewShow" @click="handleViewShow(false)">
      <img :src="`${coverFileImg}`" alt="" />
    </div>
  </div>
</template>
    
<script>
import { uploadFile, download, downloadFile } from "@/apis/file";
export default {
  props: {
    mode: String,
    flowInfo: Object,
  },
  watch: {
    flowInfo: {
      handler(val) {
        if (
          val.id &&
          JSON.stringify(val) !== JSON.stringify(this.publishInfo)
        ) {
          if (val.id === "1764900256811581440") {
            this.mock(val);
          } else {
            this.init(val);
          }
        }
      },
      deep: true,
      immediate: true,
    },
  },
  data() {
    return {
      publishInfo: {},
      list: [],
      list1: [],
      fileMap: {}, //已上传文件map
      progress: 0,
      coverFileImg: null,
      ismock: false,
      previewShow: false,
    };
  },

  methods: {
    handleViewShow(flag) {
      console.log(flag);
      this.previewShow = flag;
    },
    mock(val) {
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

      this.getCoverImg(val.coverFileId);
      const list = [];
      let tongliang = [];
      let weizhi = [];
      let yiqi = [];
      let jiangyu = [];
      let yuzhitichu = [];
      let yichangshuju = [];
      let mocafengsu = [];
      let chabiaofa = [];
      this.publishInfo.stops.forEach((item) => {
        item.stopPublishingPropertyVos.forEach((v) => {
          if (v.type === 1) {
            let type = "input";
            try {
              v.allowableValues1 = JSON.parse(v.allowableValues);
              if (v.allowableValues1.length > 1) {
                type = "select";
              }
            } catch (err) {}
            v.showType = type;
          } else if (v.type === 0) {
            v.showType = "upload";
          }

          switch (v.id) {
            case "1764900256811581451":
            case "1764900256811581447":
            case "1764900256815775751":
              tongliang.push(v);
              break;
            case "1764900256811581452":
            case "1764900256811581453":
              weizhi.push(v);
              break;
            case "1764900256811581445":
            case "1764900256811581446":
              yiqi.push(v);
              break;
            case "1764900256815775746":
              jiangyu.push(v);
              break;
            case "1764900256811581454":
            case "1764900256815775744":
            case "1764900256815775745":
              yuzhitichu.push(v);
              break;
            case "1764900256815775748":
            case "1764900256815775749":
            case "1764900256815775750":
              yichangshuju.push(v);
              break;
            case "1764900256815775747":
              mocafengsu.push(v);
              break;
            case "1764900256811581441":
            case "1764900256811581442":
            case "1764900256811581443":
              chabiaofa.push(v);
              break;
          }
        });
      });
      list.push(
        {
          name: "通量、气象输入数据文件",
          list: tongliang,
        },
        {
          name: "通量站位置信息",
          list: weizhi,
        },
        {
          name: "仪器安装高度信息",
          list: yiqi,
        },
        {
          name: "降雨数据剔除",
          list: jiangyu,
        },
        {
          name: "阈值剔除",
          list: yuzhitichu,
        },
        {
          name: "异常数据检测剔除",
          list: yichangshuju,
        },
        {
          name: "摩擦风速校正",
          list: mocafengsu,
        },
        {
          name: "查表法插补",
          list: chabiaofa,
        }
      );
      this.list1 = list;
      this.ismock = true;
    },
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
      this.getCoverImg(val.coverFileId );
      const list = [];
      this.publishInfo.stops.forEach((item) => {
        item.stopPublishingPropertyVos.forEach((v) => {
          if (v.type === 1) {
            let type = "input";
            try {
              v.allowableValues1 = JSON.parse(v.allowableValues);
              if (v.allowableValues1.length > 0) {
                type = "select";
              }
            } catch (err) {}
            v.showType = type;
            list.push(v);
          } else if (v.type === 0) {
            v.showType = "upload";
            list.push(v);
          }
        });
      });
      this.list = list;
    },
    handDataPublish(row) {
      this.$refs.PublishModalRef.handleAdd(row);
    },
    async getCoverImg(id) {
      const res = await downloadFile(id);
      const reader = new FileReader();
      reader.readAsDataURL(res.data);
      reader.onload = () => {
        this.coverFileImg = reader.result;
      };
    },
    handleDownload(row) {
      download(downloadFile, row.fileId, row.fileName, true);
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

      this.$set(this.fileMap, this.currentPropos.id, e.name);
      this.currentPropos.customValue = res.data.data.filePath;
    },
    handleBeforeUpload(e) {
      this.realUpload(e);
      return false;
    },
  },
};
</script>
    
    <style lang="scss" scoped>
@import "../../index.scss";
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
    position: relative;
    i{
      position: absolute;
      right: 10px;
      top: 6px;
      font-size: 23px;
      opacity: 0.9;
    }
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

.content_title {
  position: relative;
  i {
    position: absolute;
    left: 0;
    top: 0;
    line-height: 30px;
    cursor: pointer;
  }
}

.preview {
  background: rgba(0, 0, 0, 0.3);
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  img {
    max-width: 90%;
    max-height: 90%;
  }
}

::v-deep .config1 {
  overflow: hidden;
  background: #f7f9fa;
  padding: 48px 40px;
  margin-top: 32px;
  border-radius: 8px 8px 0 0;
  &_r {
    float: right;
    width: 44%;
    background-size: cover;
    background-repeat: no-repeat;
    height: 430px;
    margin-bottom: 20px;
    background-position: center;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    border-radius: 6px;
    position: relative;
    cursor: pointer;
      img{
        max-width: 100%;
        max-height: 100%;
      }
      i{
      position: absolute;
      right: 10px;
      top: 6px;
      font-size: 23px;
      opacity: 0.9;
      }
  }
  .config_l {
    overflow: hidden;
    border-radius: 6px;
    margin-bottom: 20px;
    h4 {
      line-height: 26px;
      background: #3974AA;
      text-indent: 10px;
      color: #fff;
    }
    >div{
      display: flex;
      flex-wrap: wrap;
      border: 1px dashed #3974AA;
      border-radius: 0 0 6px 6px;
      border-top: none;
    }
  }
  .config_l0,
  .config_l1 {
    width: 50%;
    overflow: hidden;
    .config_input {
      width: 50%;
    }
  }

  .config_input {
    width: 25%;
    padding: 10px 10px;
    box-sizing: border-box;

    .ivu-input {
      border-radius: 6px;
      border-color: #3974AA;
      &[disabled]{
        border-color: #dcdee2;
      }
    }
    .label {
      color: #18181b;
      font-size: 14px;
      margin-bottom: 11px;
      display: flex;
      .title{
        max-width: calc(100% - 22px);
        display: inline-block;
        word-break: break-all;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
    }
    .uploadBtn {
      background: #e6f1fe;
      border: none;
      color: #005bc4;
      font-size: 11px;
    }
    .fileName {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      width: 100%;
      color: #9b9393;
      font-size: 12px;
    }
    .fileDonw {
      color: #005bc4;
      font-size: 12px;
      text-decoration-line: underline;
      cursor: pointer;
    }
    .toptipContent {
      word-break: break-all;
      white-space: normal;
      max-width: 400px;
    }
    &-input,&-select{
      padding-bottom: 6px;
    }
  }
}
</style>