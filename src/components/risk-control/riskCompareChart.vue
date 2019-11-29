<template>
  <el-container class="inner-page-container" v-loading="pageLoading">
    <el-header class="inner-header">
      <bread-crumb :breadList="breadcrumb">
      </bread-crumb>
    </el-header>
    <el-main class="inner-main-container">
      <el-container class="inner-main-content">
        <el-main class="inner-content">
          <div class="container-box">
            <div class="view-chart-title">作业安全风险比较图</div>
            <div class="chart-box">
              <div class="chart-box-user">
                <div class="user-box-label">当前身份：</div>
                <div class="user-box-value">管理员</div>
              </div>
              <statistic-e
                :chart-data = "chartData"
                :chart-height = "chartHeight"
                legend-vertical-switch
                filter-date-switch
                @sel-change-handle = "selChangeHandle"
              ></statistic-e>
            </div>
          </div>
        </el-main>
      </el-container>
    </el-main>
  </el-container>
</template>
<script>
import BreadCrumb from '../Breadcrumb/Breadcrumb'
import statisticE from '@/components/e-charts/statisticE'
import axios from '@/api/axios'
export default {
  name: 'riskCompareChart',
  data () {
    return {
      breadcrumb: ['风险辨识评估', '风险划分'],
      pageLoading: false,
      chartData: [], // 图表数据
      chartHeight: '417px', // 图表高度
      time: '' // 筛选日期
    }
  },
  created () {
    this.fetchChartData()
  },
  methods: {
    selChangeHandle (data) {
      let vm = this
      vm.time = data.selValue
      this.fetchChartData()
      // console.log(this.chartData)
    },
    // 获取chart的数据
    fetchChartData () {
      this.pageLoading = true
      let vm = this
      // this.chartData = []
      axios
        .get('riskLevel/getWorkRisk', {
          time: vm.time
        })
        .then((res) => {
          if (res.data.code === 200) {
            this.chartData = res.data.data
          }
        }).finally(() => {
          this.pageLoading = false
        })
    }
  },
  components: {
    BreadCrumb,
    statisticE
  }
}
</script>

<style lang="scss" scoped>
  @import '../../utils/css/style.scss';
.container-box{
  padding: 20px 25px;
}
.view-chart-title{
  font-size: 28px;
  padding: 20px 0 30px;
  text-align: center;
  color: $colorText;
}
.chart-box{
  margin-top: 80px;
  position: relative;
}
.chart-box-user{
  position: absolute;
  top: -60px;
  font-size: 0;
  line-height: 28px;
}
.user-box-label{
  display: inline-block;
  font-size: 16px;
  color: #a5a5a5;
}
.user-box-value{
  display: inline-block;
  font-size: 16px;
  color: $colorPrimary;
  margin-left: 24px;
}
</style>
