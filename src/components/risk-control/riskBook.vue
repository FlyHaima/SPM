<template>
  <el-container class="inner-page-container">
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
                  @click="exportHandel">
                   导出</el-button>
              </div>
            </div>
            <el-table
              :data="tables.data"
              v-loading="tables.loading"
              border
              style="width: 100%"
              header-align="center">
              <el-table-column
                type="index"
                :index="tablesDefineIndex"
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
                  prop="deptName"
                  label="单位"
                  width="60"
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="userName"
                  label="责任人"
                  width="140"
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
                prop="rate"
                label="检查频次"
                align="center">
              </el-table-column>
            </el-table>
            <div class="el-pagination__wrap text-right">
              <el-pagination
                layout="total, sizes, prev, pager, next, jumper"
                :current-page="tables.page.index"
                :page-sizes="tables.page.sizes"
                :page-size="tables.form.pageSize"
                :total="tables.page.total"
                @current-change="tablesHandleCurrentPage"></el-pagination>
            </div>
          </div>
        </el-main>
      </el-container>
    </el-main>
  </el-container>
</template>
<script>
import BreadCrumb from '../Breadcrumb/Breadcrumb'
import Tables from '@/mixins/Tables'

export default {
  name: 'riskBook',
  mixins: [Tables],
  data () {
    return {
      breadcrumb: ['风险分级管控', '风险点分级管控台账'],
      tables: {
        api: 'riskLevel/getRiskTz'
      }
    }
  },
  methods: {
    // 导出excel
    exportHandel () {
      this.tablesExportExcel('riskLevel/exportTz')
    },
    // tag的class集合
    classObj (data) {
      if (data.riskLevelCode === '4') {
        return 'tag-low'
      } else if (data.riskLevelCode === '3') {
        return 'tag-normal'
      } else if (data.riskLevelCode === '2') {
        return 'tag-warning'
      } else if (data.riskLevelCode === '1') {
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
