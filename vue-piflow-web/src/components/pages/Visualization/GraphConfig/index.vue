<template>
  <div class="wrap">
    <div style="overflow: auto">
      <ChartType />
      <div>
        <BaseChartOptions />
        <ExtraChartOptions />
      </div>
    </div>
    <div class="wrap_r">
      <AxisSelect :tableData="tableData" />
      <Chart
        :options="options"
        @saveOptions="handleUpdate"
        @autoSave="handleAutoUpdate"
        @showTableData="show = true"
      />
    </div>
    <Modal
      v-model="show"
      title="原始数据预览"
      footer-hide
      width="60vw"
      @on-cancel="show = false"
    >
      <OriginDataTable :originalData="originalData" />
    </Modal>
  </div>
</template>
  
  <script>
import { baseUrl } from "../config/index";
import ChartType from "./components/ChartType";
import BaseChartOptions from "./components/BaseChartOptions";
import ExtraChartOptions from "./components/ExtraChartOptions";
import AxisSelect from "./components/AxisSelect";
import Chart from "./components/Chart";
import OriginDataTable from "./components/OriginDataTable";
import { mapGetters, mapState } from "vuex";
import { handleDeepMerge, handleFormata } from "./utils";
export default {
  name: "GraphConfig",
  components: {
    ChartType,
    BaseChartOptions,
    ExtraChartOptions,
    Chart,
    AxisSelect,
    OriginDataTable,
  },
  data() {
    return {
      show: false,
      // baseOptions: {},
      // extraOptions: {},
      // 格式化的数据
      tableData: [],
      // 原始数据
      originalData: [],
      // xAxisType: "",
      xData: [],
      // yAxisType: [],
      yData: [],
    };
  },

  created() {
    this.handleInit();
  },
  watch: {
    xAxisType(val) {
      if (this.tableData.length && val) {
        this.xData = this.tableData.find((v) => v.label === val).data;
      }else{
        this.xData= []
      }
    },
    yAxisType(arr) {
      console.log(arr)
      if (this.tableData.length) {
        this.yData = arr.map((item) => {
          return {
            name: item,
            data: this.tableData.find((v) => v.label === item).data,
          };
        });
      }
    },
  },
  computed: {
    ...mapGetters("graphConf", [
      "chartType",
      "xAxisType",
      "yAxisType",
      "baseOptions",
      "extraOptions",
      "lineChart",
      "barChart",
      "pieChart",
    ]),
    options: {
      get: function () {
        if (!this.baseOptions?.xAxis) return {};
        const data = JSON.parse(JSON.stringify(this.baseOptions));
        const obj = {
          ...data,
          series: this.series,
        };
        obj.xAxis.data = this.xData;
        return obj;
      },
      set: function (newVal) {
        return newVal;
      },
    },

    series() {
      const obj = JSON.parse(JSON.stringify(this[this.chartType]));
      const list = this.yData.map((item) => ({
        ...obj,
        ...item,
      }));
      return list;
    },
  },
  methods: {
    handleAutoUpdate() {
      if (this.autoSaveTimeout) {
        clearTimeout(this.autoSaveTimeout);
      }
      this.autoSaveTimeout = setTimeout(() => {
        this.handleUpdate("update");
      }, 3000);
    },
    handleInit() {
      if (!this.$route.query.id) return;
      this.$store.dispatch("graphConf/initState", {});
      this.$event.emit("loading", true);
      this.$axios({
        method: "POST",
        baseURL: baseUrl,
        url: "/visual/getGraphConfById",
        data: { id: this.$route.query.id },
      })
        .then((res) => {
          if (res.data.code === 200) {
            delete res.data.data.createTime;
            delete res.data.data.updateTime;
            this.graphConf = res.data.data;
            this.handleGetTableData(this.graphConf.graphTemplateId);
          } else {
            this.$Message.error({
              content: this.$t("tip.request_fail_content"),
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
    handleGetTableData(graphTemplateId) {
      this.$axios({
        method: "POST",
        baseURL: baseUrl,
        url: "/visual/getTableData",
        data: { graphTemplateId },
      }).then((res) => {
        this.$event.emit("loading", false);

        if (res.data.code === 200 && res.data.data.length) {
          const list = res.data.data;
          this.originalData = list;
          this.tableData = Object.keys(list[0]).map((item) => {
            const obj = {
              label: item,
              data: [],
            };
            list.forEach((v) => {
              obj.data.push(v[item]);
            });
            return obj;
          });

          // 赋值
          if (this.graphConf.configInfo) {
            const {
              baseOptions,
              extraOptions,
              xAxisType,
              yAxisType,
              chartType,
            } = JSON.parse(this.graphConf.configInfo);
            this.$store.dispatch("graphConf/changexAxisType", xAxisType);
            this.$store.dispatch("graphConf/changeyAxisType", yAxisType);
            this.$store.dispatch("graphConf/changeChartType", chartType);
            this.$store.dispatch(
              "graphConf/changeBaseOptions",
              handleDeepMerge(this.baseOptions, baseOptions)
            );
            if (chartType === "lineChart") {
              this.$store.dispatch(
                "graphConf/changeLineOptions",
                handleDeepMerge(this.lineChart, extraOptions)
              );
            } else if (chartType === "barChart") {
              this.$store.dispatch(
                "graphConf/changeBarOptions",
                handleDeepMerge(this.barChart, extraOptions)
              );
            } else if (chartType === "pieChart") {
              this.$store.dispatch(
                "graphConf/changePieOptions",
                handleDeepMerge(this.pieChart, extraOptions)
              );
            }
          } else {
            //如果第一次进来没有配置项
            this.baseOptions.title.text = this.graphConf.name;
            this.$store.dispatch(
              "graphConf/changeBaseOptions",
              this.baseOptions
            );
          }
        } else {
          this.$Message.error({
            content: this.$t("tip.request_fail_content"),
            duration: 3,
          });
        }
      });
    },

    handleUpdate(type) {
      const configInfo = {
        chartType: this.chartType,
        baseOptions: handleFormata(this.baseOptions),
        extraOptions: this[this.chartType],
        xAxisType: this.xAxisType,
        yAxisType: this.yAxisType,
      };
      this.$event.emit("loading", true);
      this.$axios({
        method: "POST",
        baseURL: baseUrl,
        url: "/visual/updateGraphConf",
        data: {
          ...this.graphConf,
          configInfo: JSON.stringify(configInfo),
          addFlag: type,
        },
      }).then((res) => {
        this.$event.emit("loading", false);
        if (res.data.code === 200) {
          this.isOpen = false;
          this.$Message.success({
            content: this.$t("tip.update_success_content"),
            duration: 3,
          });
        } else {
          this.$Message.error({
            content: res.data.msg,
            duration: 3,
          });
        }
      });
    },
  },
};
</script>
  <style lang="scss" scoped>
@import "./index.scss";
.wrap {
  height: calc(100% - 89px);
  width: 100%;
  background: rgba(247, 248, 250, 1);
  display: flex;
  > div:first-child {
    width: 400px;
  }
  > div:last-child {
    position: relative;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    > section:last-child {
      flex-grow: 1;
    }
  }
}
</style>
  
  