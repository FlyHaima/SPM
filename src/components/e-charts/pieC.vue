<template>
  <div class="chart-circle-box">
    <div :id="echarts"
      ref="echarts"
      :style="{ height: `${pieHeight}`}"></div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'pieC',
  data () {
    return {
      titleText: '' // 图表标题文字
    }
  },
  props: {
    returnData: {
      type: Array,
      default: null
    },
    title: {
      type: String,
      default: ''
    },
    colorList: {
      type: Array,
      default: null
    },
    pieHeight: {
      type: String,
      default: ''
    }
  },
  created () {
    this.titleText = this.title
  },
  mounted () {
    this.$nextTick(() => {
      this.setEchart()
    })
  },
  methods: {
    setEchart (opt) {
      // 基于准备好的dom，初始化echarts实例
      let chartDom = document.getElementById(this.echarts)
      let myChart = this.$echarts.init(chartDom)

      // 绘制图表
      let option = {
        title: {
          text: this.titleText,
          x: 'center',
          textStyle: {
            fontWeight: 400,
            fontSize: 16,
            color: '#646464'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {d}%'
        },
        legend: {
          width: 170,
          right: '8.5%',
          top: '30%',
          itemWidth: 10,
          itemHeight: 10,
          textStyle: {
            fontSize: 12
          }
        },
        dataset: {
          source: this.returnData
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['30%', '60%'],
            center: ['25%', '50%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center',
                formatter: '{d}%'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '12',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            // 重新映射数据
            encode: {
              itemName: 'label',
              value: 'value'
            }
          }
        ],
        color: this.colorList
      }
      myChart.resize()
      myChart.setOption(option)
    }
  },
  computed: {
    // 计算随机数id
    echarts () {
      return 'echarts' + Math.random() * 100000
    }
  },
  watch: {
    returnData () { // 添加数据监听，父组件传值重绘图表
      this.setEchart()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
