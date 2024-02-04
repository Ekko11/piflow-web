
const state = {
    chartType:'',     //  lineChart  | barChart | PieChart
    xAxisType: "",
    xData: [],
    yAxisType: [],
    yData: [],
    baseOptions: {
        title: {
          show:false,
          text: "",
          textAlign: "",
          top: "",
          bottom: "",
          left: "",
          right: "",
        },
        legend: {
          show:false,
          orient: "auto",
          itemGap: 10,
          itemWidth: 25,
          itemHeight: 14,
        },
        grid: {
          top: "10%",
          bottom: "10%",
          left: "10%",
          right: "10%",
        },
        tooltip: {
          show:false,
          trigger: "item",
          triggerOn: "mousemove",
        },
        textStyle: {
          color: "#000",
          fontStyle: "normal",
          fontWeight: "normal",
          fontSize: 12,
        },
        yAxis: {
          show:false,
          name: "",
          type: "value",
          // nameGap: "",
          // min: "",
          // max: "",
        },
        xAxis: {
          show:false,
          name: "",
          type: "category",
          // nameGap: "",
          // min: "",
          // max: "",
        },
    },
    lineChart:{
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
    barChart:{
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
    PieChart:{
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
    extraOptions: {},
}

const getters={
    xAxisType: state =>state.xAxisType,
    xData: state =>state.xData,
    yAxisType: state =>state.yAxisType,
    yData: state =>state.yData,
    baseOptions: state =>state.baseOptions,
    extraOptions: state =>state.extraOptions,
    lineChart: state =>state.lineChart,
    barChart: state =>state.barChart,
    PieChart: state =>state.PieChart,

  };
const mutations = {
    CHANGE_XAXISTYPE:(state,val)=>{
        state.xAxisType = val
    },
    CHANGE_YAXISTYPE:(state,val)=>{
        state.yAxisType = val
    },
    CHANGE_XDATA:(state,val)=>{
        state.xData = val
    },
    CHANGE_YDATA:(state,val)=>{
        state.yData = val
    },
    CHANGE_BASEOPTIONS:(state,val)=>{
        state.baseOptions = val
        console.log(val)
    },
    CHANGE_LINEOPTIONS:(state,val)=>{
        state.extraOptions = val
    },
    CHANGE_PIEOPTIONS:(state,val)=>{
        state.extraOptions = val
    },
    CHANGE_BAROPTIONS:(state,val)=>{
        state.extraOptions = val
    },
    CHANGE_EXTRAOPTIONS:(state,val)=>{
        state.extraOptions = val
    },
    
}



const actions = {
    changexAxisType({commit},val){
        commit('CHANGE_XAXISTYPE', val)
    },
    changeyAxisType({commit},val){
        commit('CHANGE_YAXISTYPE', val)
    },
    changexData({commit},val){
        commit('CHANGE_XDATA', val)
    },
    changeyData({commit},val){
        commit('CHANGE_YDATA', val)
    },
    changeBaseOptions({commit},val){
        commit('CHANGE_BASEOPTIONS', val)
    },
    changeExtraOptions({commit},val){
        commit('CHANGE_EXTRAOPTIONS', val)
    },
    changeLineOptions({commit},val){
        commit('CHANGE_LINEOPTIONS', val)
    },
    changeBarOptions({commit},val){
        commit('CHANGE_BAROPTIONS', val)
    },
    changePieOptions({commit},val){
        commit('CHANGE_PIEOPTIONS', val)
    }
}


export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
  }
  