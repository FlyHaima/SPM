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
            <div class="content-tools is-flex-end">
              <div class="tools-right">
                <el-button
                  type="success"
                  size="medium"
                  icon="el-icon-download"
                  @click="exportEexcel">
                   导出</el-button>
              </div>
            </div>
            <el-table
              :data="tableData"
              border
              style="width: 100%"
              header-align="center">
              <el-table-column
                prop=" "
                label="风险序号"
                width="40">
              </el-table-column>
              <el-table-column label="风险点位置" header-align="center">
                <el-table-column
                  prop=" "
                  label="一级单元"
                  width="80"
                  header-align="center">
                </el-table-column>
                <el-table-column
                  prop=" "
                  label="二级单元"
                  width="80"
                  header-align="center">
                </el-table-column>
                <el-table-column
                  prop=" "
                  label="三级单元"
                  width="80"
                  header-align="center">
                </el-table-column>
              </el-table-column>
              <el-table-column
                prop=" "
                label="风险点名称"
                width="100"
                header-align="center">
              </el-table-column>
              <el-table-column
                prop=" "
                label="风险点编号"
                width="100"
                header-align="center">
              </el-table-column>
              <el-table-column
                label="风险等级"
                width="100"
                header-align="center">
                <template slot-scope="scope">
                  <el-tag
                    size="mini"
                    effect="dark">
                    低风险
                    <!-- {{ scope.row.name }} -->
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column
                prop=" "
                label="风险因素"
                width="100"
                header-align="center">
              </el-table-column>
              <el-table-column
                prop=" "
                label="风险类别"
                width="100"
                header-align="center">
              </el-table-column>
              <el-table-column label="管控责任" header-align="center">
                <el-table-column
                  prop=" "
                  label="单位"
                  width="60"
                  header-align="center">
                </el-table-column>
                <el-table-column
                  prop=" "
                  label="责任人"
                  width="80"
                  header-align="center">
                </el-table-column>
              </el-table-column>
              <el-table-column
                prop=" "
                label="隐患检查事项"
                header-align="center">
              </el-table-column>
              <el-table-column
                prop=" "
                label="风险管控措施"
                header-align="center">
              </el-table-column>
              <el-table-column
                prop="hazardType"
                label="检查频次"
                header-align="center">
                <el-table-column
                  prop=" "
                  label="月"
                  width="40"
                  header-align="center">
                </el-table-column>
                <el-table-column
                  prop=" "
                  label="周"
                  width="40"
                  header-align="center">
                </el-table-column>
                <el-table-column
                  prop=" "
                  label="天"
                  width="40"
                  header-align="center">
                </el-table-column>
                <el-table-column
                  prop=" "
                  label="时"
                  width="40"
                  header-align="center">
                </el-table-column>
              </el-table-column>
            </el-table>
          </div>
        </el-main>
      </el-container>
    </el-main>
  </el-container>
</template>
<script>
import BreadCrumb from '../Breadcrumb/Breadcrumb'

export default {
  name: 'riskBook',
  data () {
    return {
      breadcrumb: ['风险辨识评估', '风险划分'],
      pageLoading: false,
      tableData: [{
        workshop: '变压站',
        jobs: '配电员',
        mianRisk: '员工吸烟',
        riskFactor: ' ',
        hazardType: ' ',
        emergency: ' '
      }]
    }
  },
  methods: {
    openLoading () {
      this.pageLoading = true
    },
    closeLoading () {
      this.pageLoading = false
    },
    // 导出excel
    exportEexcel () {

    }
  },
  components: {
    BreadCrumb
  }
}
</script>

<style scoped lang="scss">
@import '../../utils/css/style.scss';
</style>
