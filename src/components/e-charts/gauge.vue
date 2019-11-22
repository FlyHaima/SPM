<template>
  <div class="chart-wrap">
    <div
      id="chart"
      style="height: 270px;"></div>
    <div @mouseover="dialogShow" @mouseout="dialogHidden" class="chart-dialog-layer" ref="chartDialogLayer">
      <div v-show="chartDialogVisible" id="chartDialog" class="chart-dialog">
        <div
          v-for="(item, index) in chartData"
          :key="index"
          class="dialog-section">
          <div class="dialog-tag">上报风险发生率</div>
          <p class="dialog-p">{{item.value1}}%</p>
          <div class="dialog-tag">排查风险发生率</div>
          <p class="dialog-p">{{item.value2}}%</p>
        </div>
      </div>
    </div>
    <div class="chart-tools chart-tools-vertical">
      <div class="chart-tools-tips"><i>*</i>分值 = 排查风险发生率 x 上线风险发生率</div>
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
      <slot></slot>
    </div>

  </div>
</template>

<script>
export default {
  name: 'gauge',
  data () {
    return {
      chartData: [
        {
          value: 20,
          value1: 30,
          value2: 40,
          name: '一般'
        }
      ],
      chartDialogVisible: false
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.setEchart()
      console.log(this.$echarts)
    })
  },
  methods: {
    dialogShow () {
      this.chartDialogVisible = true
    },
    dialogHidden () {
      this.chartDialogVisible = false
    },
    setEchart (opt) {
      // 基于准备好的dom，初始化echarts实例
      let chartDom = document.getElementById('chart')
      let myChart = this.$echarts.init(chartDom)

      // 绘制图表
      let option = {
        tooltip: {
          formatter: function (params) {
            let res =
            '<p>上报风险发生率：' + params.data.value1 + '%' + '</p>' +
            '<p>排查风险发生率：' + params.data.value2 + '%' + '</p>'
            return res
          }
        },
        series: [
          {
            name: '当前分值',
            type: 'gauge',
            clockwise: true, // 仪表盘刻度顺时针增长
            z: 3,
            splitNumber: 8, // 仪表盘刻度的分割段数
            center: ['160', '150'],
            radius: '105%',
            data: this.chartData,
            title: { // name
              color: '#ffffff',
              backgroundColor: 'auto',
              padding: 4,
              width: 70,
              borderRadius: 5,
              rich: {},
              fontSize: 14,
              offsetCenter: [0, '60%']
            },
            detail: { // value
              formatter: '分值：{value}分',
              borderWidth: 0.5,
              borderColor: '#6aace4',
              fontSize: 12,
              padding: 4,
              width: 70,
              borderRadius: 5,
              color: '#6aace4',
              rich: {}
            },
            axisLine: { // 坐标轴线
              lineStyle: { // 控制线条样式
                width: 15,
                color: [
                  [0.25, '#d71a29'],
                  [0.5, '#e19a2f'],
                  [0.75, '#eef40c'],
                  [1, '#4b9df2']]
              }
            },
            axisTick: { // 刻度线样式
              length: 15 // 控制线长
            },
            splitLine: { // 分隔线
              length: 28, // 控制线长
              lineStyle: { // 控制线条样式
                color: '#6aace4',
                type: 'dotted',
                width: '1'
              }
            },
            axisLabel: {
              color: '#333',
              fontSize: 14,
              distance: 5, // 文字离表盘的距离
              formatter: function (v) {
                switch (v + '') {
                  case '0':
                    return '0'
                  case '25':
                    return '25'
                  case '50':
                    return '50'
                  case '75':
                    return '75'
                  case '100':
                    return '100'
                  default:
                    return ''
                }
              }
            },
            pointer: {
              show: true,
              length: '70%',
              width: 5
            },
            itemStyle: {
              normal: {
                color: '#333333',
                borderWidth: 0
              }
            }
          }
        ]
      }
      // myChart.resize()
      myChart.setOption(option)
      // 窗口缩放后重新调整图标尺寸
      window.onresize = function () {
        myChart.resize()
      }
    }
  }
  // watch: {
  //   // chartList () { // 添加数据监听，父组件传值重绘图表
  //   //   this.setEchart()
  //   // }
  // }
}
</script>

<style lang="scss" scoped>
  .chart-wrap{
    position: relative;
    background: #ffffff;
  }
  .chart-tools{
    position: absolute;
    top: -22px;
    right: 0;
    width: 50%;
    height: 100%;
  }
  .chart-tools-tips{
    margin-bottom: 18px;
    color: #333333;
    font-size: 12px;
    i{
      color: #ff0000;
    }
  }
  .chart-tools-vertical{
    .legend-list{
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      .legend-item{
        flex: 0 0 50%;
        display: inline-block;
        text-align: center;
        // margin-right: 60px;
      }
    }
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
    background: #4b9df2;
    border-radius: 4px;
  }
  .legend-item{
    font-size: 0;
    &:nth-child(1){
      .legend-color-lump{
        background: #d71a29;
      }
    }
    &:nth-child(2){
      .legend-color-lump{
        background: #e19a2f;
      }
    }
    &:nth-child(3){
      .legend-color-lump{
        background: #eef40c;
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
    color: #333333;
    vertical-align: top;
    margin-left: 12px;
    // margin-bottom: 22px;
  }
  .chart-dialog-layer{
    background: transparent;
    border: 2px dashed #6aace4;
    position: absolute;
    left: 45px;
    top: 35px;
    width: 230px;
    height: 230px;
    border-radius: 50%;
    &::after{
      content: '';
      position: absolute;
      left: 50%;
      bottom: -3px;
      z-index: 0;
      transform: translate(-50%, 0);
      width: 72%;
      height: 80px;
      border-bottom: 14px solid #ffffff;
      border-radius: 100%;
    }
  }
  .chart-dialog{
    position: absolute;
    left: 50%;
    bottom: -15px;
    transform: translate(-50%, 0);
    z-index: 1;
    background: #ffffff;
    width: 100px;
    height: 100px;
    border-radius: 0 0 100px 100px;
    padding: 2px;
  }
  .dialog-section{
    text-align: center;
    font-size: 12px;
  }
  .dialog-tag{
    width: 94px;
    background: #6aace4;
    padding: 2px 0;
    color: #ffffff;
    border-radius: 10px;
    font-size: 12px;
    margin: 0 auto;
  }
  .dialog-p{
    padding: 2px;
  }
</style>
