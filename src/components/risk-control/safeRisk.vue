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
                  @click="exportEexcelHandel">
                   导出</el-button>
              </div>
            </div>
            <el-table
              :data="tableData"
              border
              style="width: 100%"
              header-align="center">
              <el-table-column
                type="index"
                label="风险序号"
                width="40">
              </el-table-column>
              <el-table-column
                label="风险点位置"
                align="center">
                <el-table-column
                  prop="oneName"
                  label="一级单元"
                  width="85"
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="twoName"
                  label="二级单元"
                  width="85"
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="riskName"
                  label="三级单元"
                  width="85"
                  align="center">
                </el-table-column>
              </el-table-column>
              <el-table-column
                prop="riskName"
                label="风险点名称"
                width="100"
                align="center">
              </el-table-column>
              <el-table-column
                prop="riskBh"
                label="风险点编号"
                width="100"
                align="center">
              </el-table-column>
              <el-table-column
                label="风险等级"
                width="100"
                align="center">
                <template slot-scope="scope">
                  <el-tag
                    size="mini"
                    effect="dark"
                    :class="classObj(scope.row)">
                    {{ scope.row.riskLevel}}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column
                prop="factor"
                label="风险因素"
                width="100"
                header-align="center">
              </el-table-column>
              <el-table-column
                prop="riskType"
                label="风险类别"
                width="100"
                align="center">
              </el-table-column>
              <el-table-column label="管控责任" align="center">
                <el-table-column
                  prop=" "
                  label="单位"
                  width="60"
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="controlPer"
                  label="责任人"
                  width="80"
                  align="center">
                </el-table-column>
              </el-table-column>
              <el-table-column
                prop="riskSourceName"
                label="隐患检查事项"
                header-align="center">
              </el-table-column>
              <el-table-column
                prop="bmp"
                label="风险管控措施"
                header-align="center">
              </el-table-column>
              <el-table-column
                prop=" "
                label="检查频次"
                align="center">
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
import axios from '@/api/axios'
import exportExcel from '@/api/exportExcel'

export default {
  name: 'safeRisk',
  data () {
    return {
      breadcrumb: ['风险分级管控', '重大安全风险'],
      tableData: [],
      pageLoading: false
    }
  },
  created () {
    this.fetchTableData()
  },
  methods: {
    // 获取table数据
    fetchTableData () {
      this.pageLoading = true
      axios
        .get('spm/riskLevel/getRiskZd')
        .then((res) => {
          if (res.data.code === 200) {
            this.tableData = res.data.data
          }
        }).finally(() => {
          this.pageLoading = false
        })
    },
    // 导出excel
    exportEexcelHandel () {
      exportExcel('spm/riskLevel/exportZd')
    },
    // tag的class集合
    classObj (data) {
      if (data.riskLevelCode === '000104') {
        return 'tag-low'
      } else if (data.riskLevelCode === '000103') {
        return 'tag-normal'
      } else if (data.riskLevelCode === '000102') {
        return 'tag-warning'
      } else if (data.riskLevelCode === '000101') {
        return 'tag-danger'
      }
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
