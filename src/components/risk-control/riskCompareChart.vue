<template>
  <div class="view-box">
    <div class="view-box-content">
      <div class="view-chart-title">作业安全风险比较图</div>
      <statistic-e :chart-data="chartData"></statistic-e>
    </div>
  </div>
</template>
<script>
import statisticE from '@/components/e-charts/statisticE'
export default {
  name: 'riskCompareChart',
  data () {
    return {
      chartData: [
        {
          'value': '25',
          'name': '煤气'
        },
        {
          'value': '50',
          'name': '炉前'
        },
        {
          'value': '75',
          'name': '炉前2'
        },
        {
          'value': '60',
          'name': '炉前3'
        },
        {
          'value': '80',
          'name': '炉前4'
        },
        {
          'value': '100',
          'name': '炉前5'
        }
      ]
    }
  },
  components: {
    statisticE
  }
}
</script>

<style lang="scss" scoped>
  @import '../../utils/css/style.scss';
  .view-box-content{
    padding: 30px;
  }
  .view-chart-title{
    font-size: 28px;
    padding: 20px 0 30px;
    text-align: center;
    color: $colorText;
  }
</style>
