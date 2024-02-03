<template>
  <div class="wrap">
    <div style="overflow: auto">
      <ChartType @typeChange="handleTypeChange" />
      <div>
        <BaseChartOptions @baseOptionsChange="baseOptionsChange" />
        <ExtraChartOptions
          @extraOptionsChange="extraOptionsChange"
          :type="chartType"
        />
      </div>
    </div>
    <div>
      <AxisSelect
        :tableData="tableData"
        :xAxisType="xAxisType"
        @xAxisTypeChange="xAxisTypeChange"
        @yAxisTypeChange="yAxisTypeChange"
        :yAxisType="yAxisType"
      />
      <Chart :options="options" @saveOptions="handleUpdate" />
    </div>
  </div>
</template>
  
  <script>
import { baseUrl } from "../config/index";
import ChartType from "./components/ChartType";
import BaseChartOptions from "./components/BaseChartOptions";
import ExtraChartOptions from "./components/ExtraChartOptions";
import AxisSelect from "./components/AxisSelect";
import Chart from "./components/Chart";

export default {
  name: "GraphConfig",
  components: {
    ChartType,
    BaseChartOptions,
    ExtraChartOptions,
    Chart,
    AxisSelect,
  },
  data() {
    return {
      chartType: "lineChart",
      baseOptions: null,
      extraOptions: {},
      tableData: [],
      xAxisType: "",
      xData: [],
      yAxisType: [],
      yData: [],
    };
  },

  created() {
    this.handleInit();
  },
  watch: {
    xAxisType(val) {
      if (this.tableData.length) {
        this.xData = this.tableData.find((v) => v.label === val).data;
      }
    },
    yAxisType(arr) {
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
    options: {
      get: function () {
        if (!this.baseOptions) return {};
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
      const list = this.yData.map((item) => ({
        ...this.extraOptions,
        ...item,
      }));
      return list;
    },
  },
  methods: {
    xAxisTypeChange(val) {
      this.xAxisType = val;
      this.xData = this.tableData.find((v) => v.label === val).data;
    },
    yAxisTypeChange(arr) {
      this.yAxisType = arr;
      this.yData = arr.map((item) => {
        return {
          name: item,
          data: this.tableData.find((v) => v.label === item).data,
        };
      });
    },
    baseOptionsChange(baseOptions) {
      this.baseOptions = { ...baseOptions };
    },
    extraOptionsChange(extraOptions) {
      this.extraOptions = extraOptions;
    },

    handleTypeChange(val) {
      this.chartType = val;
    },
    handleInit() {
      if (!this.$route.query.id) return;
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
      })
        .then((res) => {
          this.$event.emit("loading", false);

          if (res.data.code === 200 && res.data.data.length) {

            const list = res.data.data;
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
            if (this.graphConf.configInfo) {
              const configInfo = JSON.parse(this.graphConf.configInfo);
              for (const key in configInfo) {
                this[key] = configInfo[key];
              }
            }
          } else {
            this.$Message.error({
              content: this.$t("tip.request_fail_content"),
              duration: 3,
            });
          }
        })
        .catch((error) => {
          this.$event.emit("loading", false);
          console.log(error);
          this.$Message.error({
            content: this.$t("tip.fault_content"),
            duration: 3,
          });
        });
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
      const configInfo = {
        baseOptions: this.baseOptions,
        extraOptions: this.extraOptions,
        xAxisType: this.xAxisType,
        yAxisType: this.yAxisType,
      };
      console.log(configInfo);
      this.$event.emit("loading", true);
      this.$axios({
        method: "POST",
        baseURL: baseUrl,
        url: "/visual/updateGraphConf",
        data: {
          ...this.graphConf,
          configInfo: JSON.stringify(configInfo),
        },
      })
        .then((res) => {
          this.$event.emit("loading", false);
          if (res.data.code === 200) {
            this.isOpen = false;
            this.$Message.success({
              content: this.$t("tip.update_success_content"),
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
  background: #f2f7ff;
  display: flex;
  > div:first-child {
    width: 400px;
  }
  > div:last-child {
    flex-grow: 1;
  }
}
</style>
  
  