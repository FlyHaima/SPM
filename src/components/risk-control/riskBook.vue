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
            <div class="content-tools" style="align-items: flex-start">
              <div class="tools-left">
                <el-form
                  size="medium"
                  :inline="true"
                  :model="tables.form"
                  class="demo-form-inline">
                  <el-form-item label="公司名称">
                    <el-input v-model="tables.form.companyName" placeholder="请输入公司名称"></el-input>
                  </el-form-item>
                  <el-form-item label="风险点名称">
                    <el-input v-model="tables.form.riskName
" placeholder="请输入风险点名称"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button
                      type="primary"
                      icon="el-icon-search"
                      @click="tableSearchHandler">查询</el-button>
                  </el-form-item>
                </el-form>
              </div>
              <div class="tools-right">
                <el-button
                  v-if="fucBtns.includes('export-btn')"
                  type="success"
                  size="medium"
                  icon="el-icon-download"
                  @click="exportExcelHandel">
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
                width="80"
                align="center">
              </el-table-column>
              <el-table-column
                prop="companyName"
                label="公司名称"
                align="center">
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
                width="110"
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
                  label="管控人"
                  width="140"
                  align="center">
                </el-table-column>
              </el-table-column>
              <el-table-column
                prop="riskSourceName"
                label="危险源名称"
                align="center"
                width="100">
              </el-table-column>
              <el-table-column
                prop="bmp"
                label="风险管控措施"
                align="center"
                width="200">
              </el-table-column>
              <el-table-column
                prop="rate"
                label="检查频次"
                align="center"
                width="120">
              </el-table-column>
            </el-table>
            <div class="el-pagination__wrap text-right">
              <el-pagination
                background
                layout="total, prev, pager, next, jumper"
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
import exportExcel from '@/api/exportExcel'
import axios from 'axios'
import myaxios from '@/api/axios'
export default {
  name: 'riskBook',
  mixins: [Tables],
  data () {
    return {
      breadcrumb: ['风险分级管控', '风险点分级管控台账'],
      tables: {
        api: 'riskLevel/getRiskTz',
        form: {
          companyName: '', // 公司名称
          riskName: '', // 风险点名称
          pageNo: 1,
          pageSize: 10
        },
        page: {
          total: 0, // 共多少条
          index: 1, // 当前页数
          sizes: [10, 20, 50] // 分页集合
        }
      },
      fucBtns: []
    }
  },
  created () {
    this.tablesFetchList()
    this.getBtnAuthority()
  },
  methods: {
    getBtnAuthority () {
      const authId = {authId: '4-3'}
      myaxios
        .get('user/getBtnArray', authId)
        .then((res) => {
          if (res.data.code === 200) {
            this.fucBtns = res.data.data.functionBtns
          } else {
            this.$message({
              message: res.data.message,
              type: 'warning'
            })
          }
        })
    },
    // 查询table，表单提交响应事件
    tableSearchHandler () {
      this.tables.form.pageNo = 1
      this.tablesFetchList()
    },
    tablesFetchList () {
      this.tables.loading = true
      return axios
        .get(this.tables.api, {
          params: this.tables.form
        })
        .then(res => {
          if (res.data.code === 200) {
            this.tables.page.total = res.data.total
            this.tables.data = res.data.data
            this.tables.data.forEach(item => {
              let newBmp = ''
              if (item.technology) {
                newBmp = item.technology
              }
              if (item.bmp) {
                newBmp += '/' + item.bmp
              }
              if (item.train) {
                newBmp += '/' + item.train
              }
              if (item.individual) {
                newBmp += '/' + item.individual
              }
              if (item.emergency) {
                newBmp += item.emergency
              }
              if (item.newCs) {
                newBmp += '/' + item.newCs
              }
              if (item.mustCs) {
                newBmp += '/' + item.mustCs
              }
              item.bmp = newBmp
            })
          }
        })
        .finally(() => {
          this.tables.loading = false
        })
    },
    // 导出excel
    exportExcelHandel () {
      exportExcel(`riskLevel/exportTz`)
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
    // 获取按钮权限方法
  },
  components: {
    BreadCrumb
  }
}
</script>

<style scoped lang="scss">
@import '@/utils/css/style.scss';

</style>
