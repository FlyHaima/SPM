<template>
  <div class="chart-wrap">
    <div id="columnA" :style="{ height: '200px'}"></div>
   <!-- legend-list-vertical 水平方向 -->
   <div class="legend-list">
      <div class="legend-item">
        <i class="legend-color-lump"></i>
        <span class="legend-text">重大风险</span>
      </div>
      <div class="legend-item">
        <i class="legend-color-lump"></i>
        <span class="legend-text">较大风险</span>
      </div>
      <div class="legend-item">
        <i class="legend-color-lump"></i>
        <span class="legend-text">一般风险</span>
      </div>
      <div class="legend-item">
        <i class="legend-color-lump"></i>
        <span class="legend-text">低风险</span>
      </div>
    </div>
  </div>

</template>

<script>
// 引入基本模板
let echarts = require('echarts/lib/echarts')

export default {
  name: 'columnChart',
  data () {
    return {
      chartValue: [10, 20, 50, 80],
      chartxAxis: ['煤气', '炉前', '炉前', '冷却']
    }
  },
  props: [
    'returnData'
  ],
  mounted () {
    // this.reduceData()
    this.setEchart()
  },
  created () {

  },
  methods: {
    // reduceData () {
    //   this.chartValue = []
    //   this.chartxAxis = []
    //   this.returnData.forEach(item => {
    //     this.chartValue.push(JSON.parse(item).value * 1)
    //     this.chartxAxis.push(JSON.parse(item).date)
    //   })
    // },
    setEchart (opt) {
      // 基于准备好的dom，初始化echarts实例
      let chartDom = document.getElementById('columnA')
      let myChart = this.$echarts.init(chartDom)

      // 绘制图表
      let option = {
        color: ['#0568eb'],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'line' // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function (params) {
            return params[0].axisValue + '<br>' + params[0].data
          }
        },
        grid: {
          left: '10%',
          // right: '4%',
          bottom: '1%',
          top: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: this.chartxAxis,
            axisTick: {
              alignWithLabel: true
            },
            axisLine: {
              lineStyle: {
                color: ['#1f668e']
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            // y轴颜色
            axisLine: {
              lineStyle: {
                color: '#1f668e'
              }
            },
            // 坐标轴内线的样式
            splitLine: {
              lineStyle: {
                color: '#0b2c4e',
                type: 'line'
              }
            }
          }
        ],
        series: [
          {
            type: 'bar',
            data: this.chartValue,
            itemStyle: {
              color: function (params) {
                // d13a38 红 / f4a028 橙 / fff223 黄 / 0568eb 蓝
                let colorList = [
                  ['#fff223', '#0568eb', '#0568eb'],
                  ['#f4a028', '#fff223', '#fff223'],
                  ['#d13a38', '#f4a028', '#f4a028'],
                  ['#f4a028', '#d13a38', '#d13a38']
                ]
                let index = params.dataIndex
                if (params.dataIndex >= colorList.length) {
                  index = params.dataIndex = colorList.length
                }
                return new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    {offset: 0, color: colorList[index][0]},
                    {offset: 0.5, color: colorList[index][1]},
                    {offset: 1, color: colorList[index][2]}
                  ]
                )
              }
            }
          }
        ]
      }

      myChart.setOption(option)
    }
  },
  watch: {
    returnData () { // 添加数据监听，父组件传值重绘图表
      // this.reduceData()
      this.setEchart()
    }
  }
}
</script>

<style lang="scss" scoped>
.chart-wrap{
  position: relative;
}
.legend-list{
  position: absolute;
  top: 0;
  left: 0;
  &.legend-list-vertical{
    left: auto;
    right: 0;
    .legend-item{
      display: inline-block;
      margin-right: 60px;
    }
  }
}

.legend-color-lump{
  display: inline-block;
  width: 14px;
  height: 14px;
  background: #0568eb;
}
.legend-item{
  font-size: 0;
  &:nth-child(1){
    .legend-color-lump{
      background: #d13a38;
    }
  }
  &:nth-child(2){
    .legend-color-lump{
      background: #f4a028;
    }
  }
  &:nth-child(3){
    .legend-color-lump{
      background: #fff223;
    }
  }
  &:nth-child(4){
    .legend-color-lump{
      background: #0568eb;
    }
  }
}

.legend-text{
  display: inline-block;
  font-size: 12px;
  line-height: 14px;
  color: #666666;
  vertical-align: top;
  margin-left: 12px;
  margin-bottom: 22px;
}
</style>
