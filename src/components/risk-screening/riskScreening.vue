<template>
  <el-container class="inner-page-container" v-loading="pageLoading">
    <el-header class="inner-header">
      <bread-crumb :breadList="breadcrumb">
      </bread-crumb>
    </el-header>
    <el-main class="inner-main-container">
      <el-tabs type="border-card" class="height-100">
        <el-tab-pane>
          <span slot="label">基础管理类</span>
          <el-container class="inner-main-content">
            <el-main class="inner-content">
              <div class="container-box">
                <el-form
                  :inline="true"
                  :model="formInline"
                  size="mini"
                  class="demo-form-inline">
                  <el-form-item label="检查人">
                    <el-input v-model="formInline.user" placeholder="检查人"></el-input>
                  </el-form-item>
                  <el-form-item label="整改日期">
                    <el-date-picker
                      v-model="value1"
                      type="daterange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item label="状态">
                    <el-select v-model="formInline.region" placeholder="状态">
                      <el-option label="状态一" value="shanghai"></el-option>
                      <el-option label="状态二" value="beijing"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="onSubmit">查询</el-button>
                    <el-button type="success" @click="onSubmit">导出</el-button>
                  </el-form-item>
                </el-form>
                <el-table
                  :data="tableData"
                  border
                  style="width: 100%"
                  align="center">
                  <el-table-column
                    prop=" "
                    label="被检查点"
                    header-align="center">
                  </el-table-column>
                  <el-table-column
                    prop=" "
                    label="危险源"
                    header-align="center">
                  </el-table-column>
                  <el-table-column
                    prop=" "
                    label="隐患描述"
                    header-align="center">
                  </el-table-column>
                  <el-table-column
                    prop=" "
                    label="检查人部门"
                    header-align="center">
                  </el-table-column>
                  <el-table-column
                    prop=" "
                    label="检查时间"
                    header-align="center">
                  </el-table-column>
                  <el-table-column
                    prop=" "
                    label="整改人"
                    header-align="center">
                  </el-table-column>
                  <el-table-column
                    prop=" "
                    label="整改时间"
                    header-align="center">
                  </el-table-column>
                  <el-table-column
                    prop=" "
                    label="复查人"
                    header-align="center">
                  </el-table-column>
                  <el-table-column
                    prop=" "
                    label="复查时间"
                    header-align="center">
                  </el-table-column>
                  <el-table-column
                    prop=" "
                    label="状态"
                    header-align="center">
                  </el-table-column>
                </el-table>
              </div>
            </el-main>
          </el-container>
        </el-tab-pane>

        <el-tab-pane>
          <span slot="label">生产现场类</span>
          <el-container class="inner-main-content">
            <el-main class="inner-content">
              <div class="container-box">
                <el-form
                  :inline="true"
                  :model="formInline"
                  size="mini"
                  class="demo-form-inline">
                  <el-form-item label="检查人">
                    <el-input v-model="formInline.user" placeholder="检查人"></el-input>
                  </el-form-item>
                  <el-form-item label="整改日期">
                    <el-date-picker
                      v-model="value1"
                      type="daterange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item label="状态">
                    <el-select v-model="formInline.region" placeholder="状态">
                      <el-option label="状态一" value="shanghai"></el-option>
                      <el-option label="状态二" value="beijing"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="onSubmit">查询</el-button>
                    <el-button type="success" @click="onSubmit">导出</el-button>
                  </el-form-item>
                </el-form>
                <el-table
                  :data="tableData"
                  border
                  style="width: 100%"
                  align="center">
                  <el-table-column
                    prop=" "
                    label="被检查点"
                    header-align="center">
                  </el-table-column>
                  <el-table-column
                    prop=" "
                    label="危险源"
                    header-align="center">
                  </el-table-column>
                  <el-table-column
                    prop=" "
                    label="隐患描述"
                    header-align="center">
                  </el-table-column>
                  <el-table-column
                    prop=" "
                    label="检查人部门"
                    header-align="center">
                  </el-table-column>
                  <el-table-column
                    prop=" "
                    label="检查时间"
                    header-align="center">
                  </el-table-column>
                  <el-table-column
                    prop=" "
                    label="整改人"
                    header-align="center">
                  </el-table-column>
                  <el-table-column
                    prop=" "
                    label="整改时间"
                    header-align="center">
                  </el-table-column>
                  <el-table-column
                    prop=" "
                    label="复查人"
                    header-align="center">
                  </el-table-column>
                  <el-table-column
                    prop=" "
                    label="复查时间"
                    header-align="center">
                  </el-table-column>
                  <el-table-column
                    prop=" "
                    label="状态"
                    header-align="center">
                  </el-table-column>
                </el-table>
              </div>
            </el-main>
          </el-container>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>
<script>
import BreadCrumb from '../Breadcrumb/Breadcrumb'
export default {
  name: 'riskScreening',
  data () {
    return {
      breadcrumb: ['风险辨识评估', '风险划分'],
      pageLoading: false,
      dialogVisible: false,
      checked: false,
      formInline: {

      },
      value1: ''
    }
  },
  components: {
    BreadCrumb
  },
  methods: {
    openLoading () {
      this.pageLoading = true
    },
    closeLoading () {
      this.pageLoading = false
    },
    handleAdd () {
      this.dialogVisible = true
    },
    // 导出excel
    exportEexcel () {

    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../utils/css/style.scss';
</style>
