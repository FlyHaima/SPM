<template>
  <div class="chart-wrap">
    <div ref='chart' :style="{ height: `${chart.height}`}"></div>
  </div>
</template>

<script>
export default {
  name: 'linePv',
  data () {
    return {
      myChart: null,
      /*
      '#5793f3' - 蓝, '#4ca148' - 绿, '#ad65b1' - 紫, '#5acfd3' - 青
      '#d3c525' - 黄, '#08279a' - 深蓝, '#126549' - 深绿, '#5a1265' - 深紫
      */
      colors: ['#5793f3', '#4ca148', '#ad65b1', '#5acfd3', '#d3c525', '#08279a', '#126549', '#5a1265'],
      data1: [], // series[0]
      data2: [], // series[1]
      data3: [], // series[2]
      data4: [], // series[3]
      xAxisdata: [] // 横坐标数组
    }
  },
  props: {
    /*
    * 父组件传过来的参数
    * [{
        data1: 8,
        data2: 20,
        data3: 8,
        data4: 18,
        xAxisdata: '7.1/7.1'
      }]
      ** @sub-param {string} xAxisdata 横坐标
    * @param {string} height
    */
    chart: {
      type: Object,
      default: null
    }
  },
  mounted () {
    const vm = this
    vm.$nextTick(() => {
      vm.initEchart(this.chart)
    })
  },
  methods: {
    formatData (data) {
      const vm = this
      vm.data1 = []
      vm.data2 = []
      vm.data3 = []
      vm.data4 = []
      vm.xAxisdata = []
      data.forEach(item => {
        vm.data1.push(item.data1)
        vm.data2.push(item.data2)
        vm.data3.push(item.data3)
        vm.data4.push(item.data4)
        vm.xAxisdata.push(item.xAxisdata)
      })
    },
    initEchart (chart) {
      const vm = this
      vm.formatData(chart.data)
      vm.myChart = this.$echarts.init(this.$refs.chart)
      vm.myChart.setOption({
        color: this.colors,
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: chart.legend
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.xAxisdata
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value} %'
          }
        },
        series: [
          {
            name: chart.legend[0],
            type: 'line',
            stack: '总量',
            data: this.data1
          },
          {
            name: chart.legend[1],
            type: 'line',
            stack: '总量',
            data: this.data2
          },
          {
            name: chart.legend[2],
            type: 'line',
            stack: '总量',
            data: this.data3
          },
          {
            name: chart.legend[3],
            type: 'line',
            stack: '总量',
            data: this.data4
          },
          {
            name: chart.legend[4],
            type: 'line',
            stack: '总量',
            data: this.data4
          },
          {
            name: chart.legend[5],
            type: 'line',
            stack: '总量',
            data: this.data4
          },
          {
            name: chart.legend[6],
            type: 'line',
            stack: '总量',
            data: this.data4
          },
          {
            name: chart.legend[7],
            type: 'line',
            stack: '总量',
            data: this.data4
          }
        ]
      })
      // 图表尺寸自适应处理
      window.addEventListener('resize', function () {
        vm.myChart.resize()
      })
    }
  },
  watch: {
    chart: { // 添加数据监听，父组件传值重绘图表
      deep: true,
      handler: function (newValue, oldValue) {
        const vm = this
        vm.initEchart(newValue)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
