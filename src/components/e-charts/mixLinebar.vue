<template>
 <div class="mix-line-bar">
    <div class="info-box">
      <div class="label-box">
        <span class="label">XX企业（按查询条件 {{time[0]}} {{changeOptions[changeDateVal]}}- {{time[time.length-1]}} {{changeOptions[changeDateVal]}}）安全指数分析图</span>
      </div>
      <span class="info-text">参与员工数量: {{testNameDate.userCount}}</span>
      <span class="info-text">隐患发生数量: {{testNameDate.hiddenCount}}</span>
    </div>
    <div :id="echart" :style= "{height: `${chartWidth}`}" ></div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      time: [],
      typeName: {
        userCount: '', // 参与员工
        hiddenCount: '' // 隐患发生
      },
      testNameDate: {
        userCount: '', // 标题  参与员工
        hiddenCount: '' // 标题  隐患发生
      },
      qycyDate: { // 全员参与率
        type: '',
        name: '',
        value: []
      },
      yhfaDate: { // 隐患发生率
        type: '',
        name: '',
        value: []
      },
      yhfhDate: { // 隐患符合
        type: '',
        name: '',
        value: []
      },
      yhzgDate: { // 隐患整改
        type: '',
        name: '',
        value: []
      },
      changeOptions: ['日', '月', '年', '时间区间']

    }
  },
  props: {
    chartWidth: {
      type: String,
      default: ''
    },
    mixLinebarData: {
      type: Object,
      defoult: null
    },
    changeDateVal: {
      type: String,
      default: ''
    }
  },
  components: {

  },
  mounted () {
    this.$nextTick(() => {
      this.defactoringData()
      this.setEchart()
    })
  },
  methods: {
    setEchart (opt) {
      this.defactoringData()
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
          data: this.typeName
        },
        xAxis: [
          {
            type: 'category',
            data: this.time,
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
            name: this.qycyDate.name,
            type: 'bar',
            data: this.qycyDate.value
          },
          {
            name: this.yhfaDate.name,
            type: 'bar',
            data: this.yhfaDate.value
          },
          {
            name: this.yhfhDate.name,
            type: 'line',
            data: this.yhfhDate.value
          },
          {
            name: this.yhzgDate.name,
            type: 'line',
            data: this.yhzgDate.value
          }
        ]
      }
      debugger
      myChart.setOption(option)
    },
    defactoringData () {
      let data = this.mixLinebarData
      this.typeName = []
      this.time = data.time
      console.log(data.data)
      data.data.forEach(item => {
        this.typeName.push(item.name)
      })
      this.qycyDate = data.data[0]
      this.yhfaDate = data.data[1]
      this.yhfhDate = data.data[2]
      this.yhzgDate = data.data[3]
      this.testNameDate.userCount = data.userCount
      this.testNameDate.hiddenCount = data.hiddenCount
      debugger
    }
  },

  watch: {
    mixLinebarData: {
      deep: true,
      handler: function (val) {
        this.defactoringData()
        this.setEchart()
      }

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
.label-box{
  margin: 5px 0;
}

</style>
