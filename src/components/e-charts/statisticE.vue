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
      <div v-show="filterDateSwitch" class="select-date">
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
          value: '1',
          label: '近一周'
        }, {
          value: '2',
          label: '近两周'
        }, {
          value: '3',
          label: '近一个月'
        }
      ],
      selValue: '2', // 设定初始值，两周
      chartValue: [], // y轴坐标值
      chartxAxis: [], // x轴坐标值
      colorList: [] // 图表色值 d13a38 红 / f4a028 橙 / fff223 黄 / 0568eb 蓝
    }
  },
  props: {
    chartData: {
      type: Array,
      default: null
    }, // 图表数据
    chartHeight: {
      type: String,
      default: ''
    }, // 图表高度
    legendVerticalSwitch: {
      type: Boolean,
      default: false
    }, // legend水平方向布局开关
    filterDateSwitch: {
      type: Boolean,
      default: false
    } // 日期筛选开关
  },
  mounted () {
    let vm = this
    vm.$nextTick(() => {
      vm.reduceData()
      vm.setEchart()
    })
  },
  methods: {
    reduceData () {
      let vm = this
      vm.chartValue = []
      vm.chartxAxis = []
      vm.chartData.forEach(item => {
        if (item.value <= 25) {
          vm.colorList.push(['#d13a38', '#dd5c33', '#fcb725', '#fdba24', '#ffd723', '#ffec23', '#fff223', '#eeeb30', '#478eb7', '#0568eb'])
        } else if (item.value > 25 && item.value <= 50) {
          vm.colorList.push(['#d13a38', '#dd5c33', '#fcb725', '#fdba24', '#ffd723', '#ffec23', '#fff223', '#eeeb30', '#478eb7', '#0568eb'])
        } else if (item.value > 50 && item.value <= 75) {
          vm.colorList.push(['#d13a38', '#dd5c33', '#fcb725', '#fdba24', '#ffd723', '#ffec23', '#fff223', '#eeeb30', '#478eb7', '#0568eb'])
        } else if (item.value > 75 && item.value <= 100) {
          vm.colorList.push(['#d13a38', '#dd5c33', '#fcb725', '#fdba24', '#ffd723', '#ffec23', '#fff223', '#eeeb30', '#478eb7', '#0568eb'])
        }
        vm.chartValue.push(item.value)
        vm.chartxAxis.push(item.name)
      })
    },
    setEchart (opt) {
      let vm = this
      vm.reduceData()
      // 基于准备好的dom，初始化echarts实例
      let chartDom = document.getElementById('columnA')
      let myChart = this.$echarts.init(chartDom)
      let chartColorList = this.colorList

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
            data: vm.chartxAxis,
            axisTick: {
              alignWithLabel: true
            },
            axisLine: {
              lineStyle: {
                color: ['#1f668e']
              }
            },
            axisLabel: {
              interval: 0,
              // formatter: function (value) {
              //   // debugger
              //   var ret = ''
              //   var maxLength = 2
              //   var valLength = value.length
              //   var rowN = Math.ceil(valLength / maxLength)
              //   if (rowN > 1) {
              //     for (var i = 0; i < rowN; i++) {
              //       var temp = '' // 每次截取的字符串
              //       var start = i * maxLength
              //       var end = start + maxLength
              //       temp = value.substring(start, end) + '\n'
              //       ret += temp
              //     }
              //     return ret
              //   } else {
              //     return value
              //   }
              // }
              rotate: 40
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
            data: vm.chartValue,
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
                    {offset: 0.1, color: chartColorList[index][1]},
                    {offset: 0.2, color: chartColorList[index][2]},
                    {offset: 0.3, color: chartColorList[index][3]},
                    {offset: 0.4, color: chartColorList[index][4]},
                    {offset: 0.5, color: chartColorList[index][5]},
                    {offset: 0.6, color: chartColorList[index][6]},
                    {offset: 0.7, color: chartColorList[index][7]},
                    {offset: 0.8, color: chartColorList[index][8]},
                    {offset: 1, color: chartColorList[index][9]}
                  ]
                )
              }
            }
          }
        ]
      }
      myChart.setOption(option)
    },
    selChange (data) {
      this.$emit('sel-change-handle', {
        selValue: this.selValue
      })
      // this.reduceData()
      // this.setEchart()
    }
  },
  computed: {
    classObj () {
      let vm = this
      if (vm.legendVerticalSwitch) {
        return 'chart-tools-vertical'
      }
    }
  },
  watch: {
    chartData: { // 添加数据监听，父组件传值重绘图表
      deep: true,
      handler: function (val) {
        let vm = this
        vm.chartData = val
        vm.reduceData()
        vm.setEchart(val)
      }
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
  font-size: 6px;
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
