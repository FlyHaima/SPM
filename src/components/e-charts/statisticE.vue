<template>
  <div class="chart-wrap">
    <div id="columnA" :style="{ height: `${chartHeight}`}"></div>
    <!-- chart-tools-vertical 水平方向 -->
    <div class="chart-tools" :class="classObj">
      <div class="legend-list" >
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
      <div class="select-date">
        <el-select
          v-model="selValue"
          @change="selChange"
          >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
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
      options: [
        {
          value: 1,
          label: '近一周'
        }, {
          value: 2,
          label: '近两周'
        }, {
          value: 3,
          label: '近一个月'
        }
      ],
      selValue: 2, // 设定初始值，两周
      chartValue: [], // y轴坐标值
      chartxAxis: [], // x轴坐标值
      allDate: [],
      allValue: [],
      colorList: [] // 图表色值 d13a38 红 / f4a028 橙 / fff223 黄 / 0568eb 蓝
    }
  },
  props: {
    chartData: {
      type: Array,
      default: null
    },
    chartHeight: {
      type: String,
      default: ''
    },
    legendVertical: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    this.reduceData()
    this.setEchart()
  },
  created () {
  },
  methods: {
    reduceData () {
      this.chartData.forEach(item => {
        if (item.value <= 25) {
          this.colorList.push(['#d13a38', '#0568eb'])
        } else if (item.value > 25 && item.value <= 50) {
          this.colorList.push(['#f4a028', '#fff223', '#fff223', '#0568eb'])
        } else if (item.value > 50 && item.value <= 75) {
          this.colorList.push(['#d13a38', '#f4a028', '#f4a028', '#0568eb'])
        } else if (item.value > 75 && item.value <= 100) {
          this.colorList.push(['#d13a38', '#0568eb'])
        }
        this.allValue.push(item.value)
        this.allDate.push(item.name)
      })
    },
    setEchart (opt) {
      // 基于准备好的dom，初始化echarts实例
      let chartDom = document.getElementById('columnA')
      let myChart = this.$echarts.init(chartDom)
      let chartColorList = this.colorList

      if (!opt) {
        this.chartValue = this.allValue
        this.chartxAxis = this.allDate
      } else if (opt === 1) {
        this.chartValue = this.allValue.slice(0, 7)
        this.chartxAxis = this.allDate.slice(0, 7)
      } else if (opt === 2) {
        this.chartValue = this.allValue.slice(0, 14)
        this.chartxAxis = this.allDate.slice(0, 14)
      } else if (opt === 3) {
        this.chartValue = this.allValue
        this.chartxAxis = this.allDate
      }

      // 绘制图表
      let option = {
        color: ['#0568eb'],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'line' // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function (params) {
            return params[0].axisValue + '<br>' + params[0].data + '%'
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
            axisLabel: {
              formatter: '{value} %'
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
                let index = params.dataIndex
                if (params.dataIndex >= chartColorList.length) {
                  index = params.dataIndex = chartColorList.length
                }
                return new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    {offset: 0, color: chartColorList[index][0]},
                    {offset: 1, color: chartColorList[index][1]}
                    // {offset: 0.6, color: chartColorList[index][2]},
                    // {offset: 1, color: chartColorList[index][3]}
                  ]
                )
              }
            }
          }
        ]
      }
      myChart.setOption(option)
    },
    selChange () {
      // 重新筛选数据，再render表格
      this.setEchart(this.selValue)
    }
  },
  computed: {
    classObj () {
      let vm = this
      if (vm.legendVertical) {
        return 'chart-tools-vertical'
      }
    }
  },
  watch: {
    chartData () { // 添加数据监听，父组件传值重绘图表
      this.reduceData()
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
  text-align: left;
  .legend-item{
    margin-bottom: 22px;
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
  // margin-bottom: 22px;
}
.chart-tools{
  position: absolute;
  top: 0;
  left: 0;
}
.chart-tools-vertical{
  left: auto;
  right: 40px;
  top: -60px;
  display: flex;
  .legend-list{
    display: flex;
    align-items: center;
    .legend-item{
      display: inline-block;
      margin-right: 30px;
      margin-bottom: 0;
    }
  }

}
.select-date{
  display: inline-block;
  width: 100px;
  // height: 30px;
}
/deep/.el-select{
  .el-input__inner{
    height: 26px;
    line-height: 26px;
  }
  .el-input__icon{
    line-height: 26px;
  }
}
</style>
