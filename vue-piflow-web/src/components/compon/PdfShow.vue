<template>
    <div id="container">
      <!-- 上一页、下一页 -->
      <div class="right-btn">
        <!-- 输入页码 -->
        <div class="pageNum">
          <input
            v-model.number="currentPage"
            type="number"
            class="inputNumber"
            @input="inputEvent()"
          />
          / {{ pageCount }}
        </div>
        <div @click="changePdfPage('first')" class="turn">首页</div>
        <!-- 在按钮不符合条件时禁用 -->
        <div
          @click="changePdfPage('pre')"
          class="turn-btn"
          :style="currentPage === 1 ? 'cursor: not-allowed;' : ''"
        >
          上一页
        </div>
        <div
          @click="changePdfPage('next')"
          class="turn-btn"
          :style="currentPage === pageCount ? 'cursor: not-allowed;' : ''"
        >
          下一页
        </div>
        <div @click="changePdfPage('last')" class="turn">尾页</div>
      </div>
  
      <div class="pdfArea">
        <!-- // 不要改动这里的方法和属性,下次用到复制就直接可以用 -->
        <pdf
          :src="src"
          ref="pdf"
          v-show="loadedRatio === 1"
          :page="currentPage"
          @num-pages="pageCount = $event"
          @progress="loadedRatio = $event"
          @page-loaded="currentPage = $event"
          @loaded="loadPdfHandler"
          @link-clicked="currentPage = $event"
          style="display: inline-block; width: 100%"
          id="pdfID"
        ></pdf>
      </div>
      <!-- 加载未完成时，展示进度条组件并计算进度 -->
      <div class="progress" v-if="loadedRatio != 1">
        <Progress :percent="Math.floor(loadedRatio * 100) ? Math.floor(loadedRatio * 100) : 0" :stroke-width="12" status="active" />
        <br />
        <!-- 加载提示语 -->
        <span>{{ remindShow }}</span>
      </div>
    </div>
  </template>


<script>
import pdf from "vue-pdf";

export default {
  components: {
    pdf,
  },
  data() {
    return {
      // ----- loading -----
      remindText: {
        loading: "加载文件中，文件较大请耐心等待...",
        refresh: "若卡住不动，可刷新页面重新加载...",
      },
      remindShow: "加载文件中，文件较大请耐心等待...",
      intervalID: "",
      // ----- vuepdf -----
      // src静态路径: /static/xxx.pdf
      // src服务器路径: 'http://.../xxx.pdf'
      src: "",
      // 当前页数
      currentPage: 0,
      // 总页数
      pageCount: 0,
      // 加载进度
      loadedRatio: 0,
    };
  },

  created() {
    // 页面加载，拿到路由中的url复制给data中的src
    this.src = this.$route.query.url;
    console.log(this.src);
  },
  mounted() {
    // // 更改 loading 文字
    this.intervalID = setInterval(() => {
      this.remindShow === this.remindText.refresh
        ? (this.remindShow = this.remindText.loading)
        : (this.remindShow = this.remindText.refresh);
    }, 4000);
  },
  methods: {
    // 页面回到顶部
    toTop() {
      document.getElementById("container").scrollTop = 0;
    },
    // 输入页码时校验
    inputEvent() {
      if (this.currentPage > this.pageCount) {
        // 1. 大于max
        this.currentPage = this.pageCount;
      } else if (this.currentPage < 1) {
        // 2. 小于min
        this.currentPage = 1;
      }
    },
    // 切换页数
    changePdfPage(val) {
      if (val === "pre" && this.currentPage > 1) {
        // 切换后页面回到顶部
        this.currentPage--;
        this.toTop();
      } else if (val === "next" && this.currentPage < this.pageCount) {
        this.currentPage++;
        this.toTop();
      } else if (val === "first") {
        this.currentPage = 1;
        this.toTop();
      } else if (val === "last" && this.currentPage < this.pageCount) {
        this.currentPage = this.pageCount;
        this.toTop();
      }
    },

    // pdf加载时
    loadPdfHandler(e) {
      // 加载的时候先加载第一页
      this.currentPage = 1;
    },
  },
  destroyed() {
    // 在页面销毁时记得清空 setInterval
    clearInterval(this.intervalID);
  },
};
</script>

<style scoped>
#container {
  position: absolute !important;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background: #f4f7fd;
  overflow: auto;
  font-family: PingFang SC;
  width: 100%;
  display: flex;
  /* justify-content: center; */
  position: relative;
}

/* 右侧功能按钮区 */
.right-btn {
  position: fixed;
  right: 5%;
  bottom: 15%;
  width: 120px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  z-index: 99;
}

.pdfArea {
  width: 900px;
  margin: 0 auto;
}

/* ------------------- 输入页码 ------------------- */
.pageNum {
  margin: 10px 0;
  font-size: 18px;
}

/*在谷歌下移除input[number]的上下箭头*/
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
  margin: 0;
}

/*在firefox下移除input[number]的上下箭头*/
input[type="number"] {
  -moz-appearance: textfield;
}

.inputNumber {
  border-radius: 8px;
  border: 1px solid #999999;
  height: 35px;
  font-size: 18px;
  width: 60px;
  text-align: center;
}

.inputNumber:focus {
  border: 1px solid #00aeff;
  background-color: rgba(18, 163, 230, 0.096);
  outline: none;
  transition: 0.2s;
}

/* ------------------- 切换页码 ------------------- */
.turn {
  background-color: #164fcc;
  opacity: 0.9;
  color: #ffffff;
  height: 70px;
  width: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 5px 0;
}

.turn-btn {
  background-color: #164fcc;
  opacity: 0.9;
  color: #ffffff;
  height: 70px;
  width: 70px;
  border-radius: 50%;
  margin: 5px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.turn-btn:hover,
.turn:hover {
  transition: 0.3s;
  opacity: 0.5;
  cursor: pointer;
}

/* ------------------- 进度条 ------------------- */
.progress {
  position: absolute;
  right: 50%;
  top: 50%;
  text-align: center;
}

.progress > span {
  color: #199edb;
  font-size: 14px;
}
</style>

