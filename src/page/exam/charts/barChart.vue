<template>
  <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
const animationDuration = 2000
const animationDurationUpdate = 2000

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    chartData: {
      type: Object
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart()
    if (this.chart) {
      this.chart.resize()
    }
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    },
    setOptions({ xAxisData, data }  = {}) {
      this.chart.setOption({
        title : {
          top: 15,
          text: '学生分布图',
          x:'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        toolbox: {
          show : true,
          right: 20,
          feature : {
              magicType : {show: true, type: ['line', 'bar']},
              saveAsImage : {show: true}
          }
        },
        grid: {
          top: 80,
          left: '4%',
          right: '8%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          name: '分数',
          data: xAxisData,
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value',
          name: '人数',
          axisTick: {
            show: false
          }
        }],
        series: [
        {
          name: '总人数',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: data,
          animationDuration,          //初始化动画时长
          animationDurationUpdate     //数据更新动画时长
        }]
      })
    }
  }
}
</script>
