const InitState = () => ({
  chartType: "lineChart", //  lineChart  | barChart | PieChart
  xAxisType: "",
  xData: [],
  yAxisType: [],
  yData: [],
  baseOptions: {
    color: [
      "#7cb5ec",
      "#058DC7",
      "#90ed7d",
      "#f7a35c",
      "#8085e9",
      "#f15c80",
      "#e4d354",
      "#2b908f",
      "#f45b5b",
      "#91e8e1",
      "#50B432",
    ],
    backgroundColor:'#fff',
    title: {
      show: true,
      left: "center",
      text: "",
      top: "",
      textStyle: {
        color: "#000",
      },
    },
    dataZoom:[
      {
        type: 'slider',
        id : 'sliderX',
        show: true,
      }
    ],
    legend: {
      show: true,
      orient: "auto",
      left: "40",
      top:'20'
    },
    grid: {
      top: '15%',
      bottom: "10%",
      left: "10%",
      right: "10%",
    },
    tooltip:{
      show:true,
      triggerOn:'mousemove'
    },
    textStyle: {
      color: "#000",
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: 12,
    },
    yAxis: {
      show: true,
      name: "",
      type: "value",
      boundaryGap: false,
      nameLocation: "end",
      axisLine: {
        show: false,
        lineStyle: {
          color: "#999",
        },
      },
      axisTick: {
        show: false,
        lineStyle: {
          color: "#999",
        },
      },
      axisLabel: {
        show: true,
        lineStyle: {
          color: "#999",
        },
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: "dashed",
        },
      },
    },
    xAxis: {
      show: true,
      name: "",
      type: "category",
      boundaryGap: true,
      nameLocation: "end",
      axisLine: {
        show: true,
        lineStyle: {
          color: "#999",
        },
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: "#999",
        },
      },
      axisLabel: {
        show: true,
        lineStyle: {
          color: "#999",
        },
      },
      splitLine: {
        show: false,
        lineStyle: {
          type: "dashed",
        },
      },
    },
  },
  lineChart: {
    type: "line",
    smooth: true,
    label: {
      show: true,
    },
    lineStyle: {
      // color: "#000",
      width: "2",
      type: "solid",
      opacity: "1",
    },

  },
  barChart: {
    type: "bar",
    barMaxWidth: "20",
    label: {
      show: true,
      distance: 10,
      color: "#000",
      position: "top",
    },
  },
  pieChart: {
    type: "pie",
    label: {
      show: true,
    },
    lineStyle: {
      // color: "#000",
      width: "2",
      type: "solid",
      opacity: "1",
    },
  },
  extraOptions: {},
});
const state = {
  ...InitState(),
};

const getters = {
  chartType: (state) => state.chartType,
  xAxisType: (state) => state.xAxisType,
  xData: (state) => state.xData,
  yAxisType: (state) => state.yAxisType,
  yData: (state) => state.yData,
  baseOptions: (state) => state.baseOptions,
  extraOptions: (state) => state.extraOptions,
  lineChart: (state) => state.lineChart,
  barChart: (state) => state.barChart,
  PieChart: (state) => state.PieChart,
};
const mutations = {
  CHANGE_CHARTTYPE: (state, val) => {
    state.chartType = val;
  },
  CHANGE_XAXISTYPE: (state, val) => {
    state.xAxisType = val;
  },
  CHANGE_YAXISTYPE: (state, val) => {
    state.yAxisType = val;
  },
  CHANGE_XDATA: (state, val) => {
    state.xData = val;
  },
  CHANGE_YDATA: (state, val) => {
    state.yData = val;
  },
  CHANGE_BASEOPTIONS: (state, val) => {
    state.baseOptions = val;
  },
  CHANGE_LINEOPTIONS: (state, val) => {
    state.lineChart = val;
  },
  CHANGE_PIEOPTIONS: (state, val) => {
    state.pieChart = val;
  },
  CHANGE_BAROPTIONS: (state, val) => {
    state.barChart = val;
  },
  CHANGE_EXTRAOPTIONS: (state, val) => {
    state.extraOptions = val;
  },
  INITSTATE: (state, val) => {
    const data = InitState();
    for (const key in data) {
      state[key] = data[key];
    }
  },
};

const actions = {
  changeChartType({ commit }, val) {
    commit("CHANGE_CHARTTYPE", val);
  },
  changexAxisType({ commit }, val) {
    commit("CHANGE_XAXISTYPE", val);
  },
  changeyAxisType({ commit }, val) {
    commit("CHANGE_YAXISTYPE", val);
  },
  changexData({ commit }, val) {
    commit("CHANGE_XDATA", val);
  },
  changeyData({ commit }, val) {
    commit("CHANGE_YDATA", val);
  },
  changeBaseOptions({ commit }, val) {
    commit("CHANGE_BASEOPTIONS", val);
  },
  changeExtraOptions({ commit }, val) {
    commit("CHANGE_EXTRAOPTIONS", val);
  },
  changeLineOptions({ commit }, val) {
    commit("CHANGE_LINEOPTIONS", val);
  },
  changeBarOptions({ commit }, val) {
    commit("CHANGE_BAROPTIONS", val);
  },
  changePieOptions({ commit }, val) {
    commit("CHANGE_PIEOPTIONS", val);
  },
  initState({ commit }, val) {
    commit("INITSTATE");
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
