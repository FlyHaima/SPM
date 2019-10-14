<template>
  <div class="chart-circle-box">
    <div :id="echarts" ref="echarts" style="height: 200px"></div>
  </div>
</template>

<script>
export default {
  name: 'pieC',
  data () {
    return {
    }
  },
  props: ['chartList', 'allNum'],
  mounted () {
    const vm = this
    vm.$nextTick(() => {
      vm.setEchart()
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
          text: '全员参与率',
          x: 'left',
          textStyle: {
            fontWeight: 400,
            fontSize: 14,
            color: '#222222'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          width: 170,
          bottom: 10,
          data: ['已参与', '未参与', '已上报', '未上报', '符合'],
          itemWidth: 10,
          itemHeight: 10
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
            data: [
              {value: 0.15, name: '已参与', itemStyle: {color: '#57d9bb'}},
              {value: 0.65, name: '未参与', itemStyle: {color: '#4c97d9'}},
              {value: 0.75, name: '已上报', itemStyle: {color: '#ef7ead'}},
              {value: 0.25, name: '未上报', itemStyle: {color: '#f69b27'}},
              {value: 0.15, name: '符合', itemStyle: {color: '#4c97d9'}}
            ]
          }
        ]
      }
      myChart.resize()
      myChart.setOption(option)
    }
  },
  computed: {
    echarts () {
      return 'echarts' + Math.random() * 100000
    }
  },
  watch: {
    chartList () { // 添加数据监听，父组件传值重绘图表
      this.setEchart()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/utils/css/common.scss';
</style>
