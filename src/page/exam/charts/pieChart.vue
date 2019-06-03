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
    setOptions({ legend, data }  = {}) {
      this.chart.setOption({
        title : {
          top: 15,
          text: '【优、良、差】分布图',
          x:'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          x : 'center',
          y : 'bottom',
          data: legend
        },
        toolbox: {
          show : true,
          right: 20,
          feature : {
              saveAsImage : {show: true}
          }
        },
        calculable: true,
        series: [
          {
            name: '总人数（占比）',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '50%'],
            data: data,
            animationEasing: 'cubicInOut',       //初始化动画缓动效果
            animationDuration: 2000,             //初始化动画时长
            animationEasingUpdate: 'cubicInOut', //数据更新动画缓动效果
            animationDurationUpdate : 2000       //数据更新动画时长
          }
        ]
      })
    }
  }
}
</script>
