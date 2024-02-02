<template>
  <section>
    <h1>基础属性</h1>
    <Collapse simple>
      <!-- title 配置 -->
      <Panel name="title">
        主标题(title)
        <template #content>
          <div class="formWrap">
            <div>
              <label>文本：</label>
              <Input v-model="baseOptions.title.text" />
            </div>
            <div>
              <label>对齐方法：</label>
              <Select v-model="baseOptions.title.textAlign">
                <Option :value="'auto'">auto</Option>
                <Option :value="'left'">left</Option>
                <Option :value="'right'">right</Option>
                <Option :value="'center'">center</Option>
              </Select>
            </div>
            <div>
              <label>top：</label>
              <Input v-model="baseOptions.title.top" />
            </div>
            <div>
              <label>bottom：</label>
              <Input v-model="baseOptions.title.bottom" />
            </div>
            <div>
              <label>left：</label>
              <Input v-model="baseOptions.title.left" />
            </div>
            <div>
              <label>right：</label>
              <Input v-model="baseOptions.title.right" />
            </div>
          </div>
        </template>
      </Panel>
      <!-- legend 配置 -->
      <Panel name="legend">
        图例(legend)
        <template #content>
          <div class="formWrap">
            <div>
              <label>布局朝向：</label>
              <Select v-model="baseOptions.legend.orient">
                <Option :value="'auto'">自动</Option>
                <Option :value="'horizontal'">水平</Option>
                <Option :value="'vertical'">垂直</Option>
              </Select>
            </div>
            <div>
              <label>图例间隔：</label>
              <Input v-model="baseOptions.legend.itemGap" type="number" />
            </div>
            <div>
              <label>图例宽度：</label>
              <Input v-model="baseOptions.legend.itemWidth" type="number" />
            </div>

            <div>
              <label>图例高度：</label>
              <Input v-model="baseOptions.legend.itemHeight" type="number" />
            </div>
          </div>
        </template>
      </Panel>
      <!-- grid 配置 -->
      <Panel name="grid">
        网格(grid)
        <template #content>
          <div class="formWrap">
            <div>
              <label>top：</label>
              <Input v-model="baseOptions.grid.top" />
            </div>
            <div>
              <label>bottom：</label>
              <Input v-model="baseOptions.grid.bottom" />
            </div>
            <div>
              <label>left：</label>
              <Input v-model="baseOptions.grid.left" />
            </div>
            <div>
              <label>right：</label>
              <Input v-model="baseOptions.grid.right" />
            </div>
          </div>
        </template>
      </Panel>
      <!-- tooltip 配置 -->
      <Panel name="tooltip">
        提示框(tooltip)
        <template #content>
          <div class="formWrap">
            <div>
              <label>触发类型：</label>
              <Select v-model="baseOptions.tooltip.trigger">
                <Option :value="'item'">数据项图形</Option>
                <Option :value="'axis'">坐标轴</Option>
                <Option :value="'none'">不触发</Option>
              </Select>
            </div>
            <div>
              <label>触发条件：</label>
              <Select v-model="baseOptions.tooltip.triggerOn">
                <Option :value="'mousemove'">鼠标移动</Option>
                <Option :value="'click'">鼠标点击</Option>
                <Option :value="'none'">不触发</Option>
              </Select>
            </div>
          </div>
        </template>
      </Panel>
      <!-- textStyle 配置 -->
      <Panel name="textStyle">
        字体样式(textStyle)
        <template #content>
          <div class="formWrap">
            <div>
              <label>颜色：</label>
              <Input v-model="baseOptions.textStyle.color" />
            </div>
            <div>
              <label>字体风格：</label>
              <Select v-model="baseOptions.textStyle.fontStyle">
                <Option :value="'normal'">正常</Option>
                <Option :value="'italic'">斜体</Option>
              </Select>
            </div>
            <div>
              <label>字体粗细：</label>
              <Select v-model="baseOptions.textStyle.triggerOn">
                <Option :value="'normal'">正常</Option>
                <Option :value="'bold'">加粗</Option>
                <Option :value="'lighter'">细体</Option>
              </Select>
            </div>
          </div>
        </template>
      </Panel>
      <!-- yAxis 配置 -->
      <Panel name="yAxis">
        y 轴(yAxis)
        <template #content>
          <div class="formWrap">
            <div>
              <label>名称：</label>
              <Input v-model="baseOptions.yAxis.name" />
            </div>
            <div>
              <label>名称与轴线间距：</label>
              <Input v-model="baseOptions.yAxis.nameGap" type="number" />
            </div>
            <div>
              <label>刻度最小值：</label>
              <Input v-model="baseOptions.yAxis.min" />
            </div>
            <div>
              <label>刻度最大值：</label>
              <Input v-model="baseOptions.yAxis.max" />
            </div>
            <div>
              <label>类型</label>
              <Select v-model="baseOptions.yAxis.type">
                <Option :value="'value'">数值轴</Option>
                <Option :value="'category'">类目轴</Option>
                <Option :value="'time'">时间轴</Option>
                <Option :value="'log'">对数轴</Option>
              </Select>
            </div>
          </div>
        </template>
      </Panel>
      <!-- yAxis 配置 -->
      <Panel name="xAxis">
        x 轴(xAxis)
        <template #content>
          <div class="formWrap">
            <div>
              <label>名称：</label>
              <Input v-model="baseOptions.xAxis.name" />
            </div>
            <div>
              <label>名称与轴线间距：</label>
              <Input v-model="baseOptions.xAxis.nameGap" type="number" />
            </div>
            <div>
              <label>刻度最小值：</label>
              <Input v-model="baseOptions.xAxis.min" />
            </div>
            <div>
              <label>刻度最大值：</label>
              <Input v-model="baseOptions.xAxis.max" />
            </div>
            <div>
              <label>类型</label>
              <Select v-model="baseOptions.xAxis.type">
                <Option :value="'value'">数值轴</Option>
                <Option :value="'category'">类目轴</Option>
                <Option :value="'time'">时间轴</Option>
                <Option :value="'log'">对数轴</Option>
              </Select>
            </div>
          </div>
        </template>
      </Panel>
    </Collapse>
  </section>
</template>
  
  <script>
export default {
  name: "BaseChartOptions",
  components: {},
  data() {
    return {
      baseOptions: {
        title: {
          text: "",
          textAlign: "",
          top: "",
          bottom: "",
          left: "",
          right: "",
        },
        legend: {
          orient: "auto",
          itemGap: 10,
          itemWidth: 25,
          itemHeight: 14,
        },
        grid: {
          top: "",
          bottom: "",
          left: "",
          right: "",
        },
        tooltip: {
          trigger: "item",
          triggerOn: "mousemove",
        },
        textStyle: {
          color: "#fff",
          fontStyle: "normal",
          fontWeight: "normal",
          fontSize: 12,
        },
        yAxis: {
          name: "",
          type: "value",
          nameGap: "",
          min: "",
          max: "",
        },
        xAxis: {
          name: "",
          type: "value",
          nameGap: "",
          min: "",
          max: "",
        },
      },
    };
  },
  watch: {
    baseOptions:{
      handler(val){
        this.$emit('baseOptionsChange',val)
      },
      deep:true,
      immediate:true
    }
  },
  created() {},
  methods: {},
};
</script>
<style lang="scss" scoped>
.formWrap {
  > div {
    label {
      min-width: 100px;
      text-align: right;
    }
    display: flex;
    align-items: center;
    margin-bottom: 5px;
  }
}
</style>
  
  