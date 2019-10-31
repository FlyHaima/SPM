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
                :legend-vertical = "legendVertical"
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
export default {
  name: 'riskCompareChart',
  data () {
    return {
      breadcrumb: ['风险辨识评估', '风险划分'],
      pageLoading: false,
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
      ],
      chartHeight: '417px',
      legendVertical: true
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
.inner-page-container{
  height: 100%;
  .el-header{
    padding: 0;
  }
  .el-main{
    padding: 0;
  }
}
.inner-content{
    width: 100%;
    height: 100%;
    padding: 30px 22px;
    background: #fff;
  }
.inner-main-content{
  width: 100%;
  height: 100%;
}
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
  color: #409eff;
  margin-left: 24px;
}
</style>
