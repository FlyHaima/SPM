<template>
  <div class="chart-circle-box">
    <div :id="echarts"
      ref="echarts"
      style="height: 200px"></div>
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
          x: 'left',
          textStyle: {
            fontWeight: 400,
            fontSize: 14,
            color: '#222222'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {d}%'
        },
        legend: {
          width: 170,
          bottom: 10,
          itemWidth: 10,
          itemHeight: 10
        },
        dataset: {
          source: this.returnData
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['20%', '50%'],
            center: ['50%', '35%'],
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
              itemName: 'name',
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
    // chartList () { // 添加数据监听，父组件传值重绘图表
    //   this.setEchart()
    // }
  }
}
</script>

<style lang="scss" scoped>
@import '@/utils/css/common.scss';
</style>
