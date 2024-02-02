<template>
  <div class="wrap">
    <Split v-model="split1">
      <template #left>
        <div class="wrap_left">
          <Split v-model="split2" mode="vertical">
            <template #top>
              <ChartType @typeChange="handleTypeChange"/>
            </template>
            <template #bottom>
              <BaseChartOptions @baseOptionsChange="baseOptionsChange"/>
              <ExtraChartOptions @extraOptionsChange="extraOptionsChange" :type="chartType"/>
            </template>
          </Split>
        </div>
      </template>
      <template #right>
        <div  class="wrap_right">Right Pane</div>
        <Chart />
      </template>
    </Split>
  </div>
</template>
  
  <script>
import { baseUrl } from "../config/index";
import ChartType from "./components/ChartType";
import BaseChartOptions from "./components/BaseChartOptions";
import ExtraChartOptions from "./components/ExtraChartOptions";
import Chart from "./components/Chart";

export default {
  name: "GraphConfig",
  components: { ChartType,BaseChartOptions,ExtraChartOptions,Chart },
  data() {
    return {
      chartType:'lineChart',
      split1: 0.3,
      split2: 0.2,
    };
  },

  created() {
    this.handleEnter();
  },
  methods: {
    baseOptionsChange(baseOptions){
      console.log(baseOptions)

    },
    extraOptionsChange(extraOptions){
      console.log(extraOptions)
    },

    
    handleTypeChange(val){
      console.log(val)
      this.chartType = val
    },
    handleEnter() {
      console.log(this.$route.query.id);
    },
    handleAdd() {
      this.$event.emit("loading", true);
      this.$axios({
        method: "POST",
        baseURL: baseUrl,
        url: "/visual/addDatabase",
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
              content: res.data.errorMsg,
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
        url: "/visual/updateDatabase",
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
              content: res.data.errorMsg,
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
  },
};
</script>
  <style lang="scss" scoped>
@import "./index.scss";
.wrap {
  height: 100%;
  width: 100%;
  .wrap_left{
    height: 100%;
  }
}
</style>
  
  