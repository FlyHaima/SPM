<template>
 <div class="mix-line-bar">
    <div class="info-box">
      <span class="info-text">参与员工数量: {{testName}}</span>
      <span class="info-text">隐患发生数量: {{testName}}</span>
    </div>
    <div :id="echart" :style= "{height: `${chartWidth}`}" ></div>
    </div>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  props: {
    chartWidth: {
      type: String,
      default: ''
    },
    getData: {
      type: Array,
      default: null
    },
    testName: {
      type: String,
      default: ''
    },
    mixLinebarData: {
      type: Object,
      defoult: ''
    }
  },
  components: {

  },
  mounted () {
    this.$nextTick(() => {
      this.setEchart()
    })
  },
  methods: {
    setEchart (opt) {
      let chartDom = document.getElementById(this.echart)
      let myChart = this.$echarts.init(chartDom)
      window.onresize = myChart.resize()

      // 绘制图表
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        toolbox: {
          feature: {
            dataView: {show: true, readOnly: false},
            magicType: {show: true, type: ['line', 'bar']},
            restore: {show: true},
            saveAsImage: {show: true}
          }
        },
        legend: {
          data: ['蒸发量', '降水量', '平均温度', '数值1']
        },
        xAxis: [
          {
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月', '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            min: 0,
            max: 100,
            interval: 20,
            axisLabel: {
              formatter: '{value} %'
            }
          }
        ],
        series: [
          {
            name: '蒸发量',
            type: 'bar',
            data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 11, 11, 32.6, 20.0, 6.4, 3.3]
          },
          {
            name: '降水量',
            type: 'bar',
            data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 11, 11, 48.7, 18.8, 6.0, 2.3]
          },
          {
            name: '平均温度',
            type: 'line',
            data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
          },
          {
            name: '数值1',
            type: 'line',
            data: [2.0, 2.2, 5.3, 4.5, 6.3, 20.2, 20.3, 63.4, 23.0, 56.5, 12.0, 6.2]
          }
        ]
      }
      myChart.setOption(option)
    }
  },
  watch: {
    chartHeight () {
      this.setEchart()
    }
  },
  computed: {
    // 计算随机数id
    echart () {
      return 'echart' + Math.random() * 100000
    }
  }
}
</script>

<style>
.info-text{
    display: inline-block;
    margin-right: 20px;
    margin-bottom: 20px;
}

</style>
