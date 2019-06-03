<template>
  <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme

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
      default: '280px'
    },
    autoResize: {
      type: Boolean,
      default: true
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
    if (this.autoResize) {
      if (this.chart) {
        this.chart.resize()
      }
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
    setOptions({ legend, xAxisData, data }  = {}) {
      this.chart.setOption({
        //直角坐标系 grid 中的 x 轴
        xAxis: {
          data: xAxisData,
          boundaryGap: false, //坐标轴两边留白策略
          axisTick: {
            show: true  //是否显示坐标轴刻度
          }
        },
        //直角坐标系 grid 中的 y 轴，不设置data将从series.data获取
        yAxis: {
          name: '考试次数',
          axisTick: {
            show: true  //是否显示坐标轴刻度
          }
        },
        //直角坐标系内绘图网格
        grid: {
          left: 40,
          right: 40,
          bottom: 20,
          top: 50,
          containLabel: true  //区域是否包含坐标轴的刻度标签
        },
        //提示框组件
        tooltip: {
          trigger: 'axis',   //触发类型:坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中
          axisPointer: {     //坐标轴指示器配置项
            type: 'cross'    //设置为 'cross'则自动显示 axisPointer
          },
          padding: [5, 10]
        },
        //导航
        legend: {
          type: 'scroll',
          top: 10,
          data: legend
        },
        //系列列表。每个系列通过 type 决定自己的图表类型
        series: [{
          name: 'expected',
          smooth: true,      //是否平滑曲线显示
          type: 'line',
          //折线拐点标志的样式
          itemStyle: {
            normal: {
              color: '#FF005A',
              lineStyle: {
                color: '#FF005A',
                width: 2
              }
            }
          },
          data: data,
          animationDuration: 3000,       //初始动画的时长
          animationEasing: 'cubicInOut'  //初始动画的缓动效果
        }]
      })
    }
  }
}
</script>
