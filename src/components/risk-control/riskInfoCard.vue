<template>
  <el-container class="inner-page-container" v-loading="pageLoading">
    <el-header class="inner-header">
      <bread-crumb :breadList="breadcrumb">
      </bread-crumb>
    </el-header>
    <el-main class="inner-main-container">
      <el-container class="inner-main-content">
        <el-aside class="inner-aside" width="408px">
          <tree-read-only
            :tree-name="'风险单元'"
            :tree-data="organizationTree"
            @tree-click-handle="treeClickHandle"
            @close-loading="closeLoading" >
          </tree-read-only>
        </el-aside>

        <el-main class="inner-content">
          <div class="container-box">
            <div class="content-tools is-flex-end">
              <div class="tools-right">
                <el-button
                  type="success"
                  size="medium"
                  icon="el-icon-download"
                  @click="exportExcelHandel">
                   导出</el-button>
              </div>
            </div>
            <template v-if="tableVisible">
              <el-table
                :data="tableData"
                border
                style="width: 100%">
                <el-table-column
                  prop="workShop"
                  label="车间"
                  width="180"
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="gw"
                  label="岗位"
                  width="180"
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="centerRisk"
                  label="主要风险源"
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="factor"
                  label="风险因素"
                  header-align="center">
                </el-table-column>
                <el-table-column
                  prop="riskResult"
                  label="潜在事故及职业危害类型"
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="emergency"
                  label="异常状况应急处置"
                  align="center">
                </el-table-column>
              </el-table>
            </template>
            <el-form
              :model = "form"
              ref = "form"
              @submit.native.prevent="submitForm"
              class="card-form"
              v-else
            >
              <div class="custom-table">
                <div class="custom-table-header">岗位风险告知卡</div>
                <div class="custom-tbody is-flex is-inline">
                  <div class="custom-tr">
                    <div class="custom-th-label">车间</div>
                    <div class="custom-td-value is-ellipsis">
                      <el-input
                        v-model.trim="form.workShop"
                        disabled></el-input>
                    </div>
                  </div>
                  <div class="custom-tr">
                    <div class="custom-th-label">岗位</div>
                    <div class="custom-td-value">
                      <el-select v-model="form.gw"  placeholder="请选择" size="mini">
                        <el-option label="请选择岗位" value=""></el-option>
                        <el-option
                          v-for="option in gwList"
                          :key="option.value"
                          :label="option.label"
                          :value="option.value"
                          ></el-option>
                      </el-select>
                    </div>
                  </div>
                </div>
                <div class="custom-tbody is-inline">
                  <div class="custom-tr">
                    <div class="custom-th-label">主要风险源</div>
                    <div class="custom-td-value">
                      <el-input
                        maxlength="120"
                        v-model.trim="form.centerRisk"
                        placeholder="请输入主要风险源"></el-input>
                    </div>
                  </div>
                  <div class="custom-tr">
                    <div class="custom-th-label">风险因素</div>
                    <div class="custom-td-value">
                      <el-input
                        maxlength="120"
                        v-model.trim="form.factor"
                        placeholder="请输入主要风险源"></el-input>
                    </div>
                  </div>
                  <div class="custom-tr">
                    <div class="custom-th-label">潜在的事故及职业危害类型</div>
                    <div class="custom-td-value">
                      <el-input
                        maxlength="120"
                        v-model.trim="form.riskResult"
                        placeholder="请输入潜在的事故及职业危害类型"></el-input>
                    </div>
                  </div>
                  <div class="custom-tr">
                    <div class="custom-th-label">异常状况应急处置</div>
                    <div class="custom-td-value">
                      <el-input
                        maxlength="120"
                        v-model.trim="form.emergency"
                        placeholder="请输入异常状况应急处置"></el-input>
                    </div>
                  </div>
                </div>
                <div class="custom-tbody">
                  <div class="custom-tr text-center">
                    <div class="custom-td-value">
                      <div class="custom-td-img-list">
                        <div class="img-list-item">
                          <img class="item-img" src="" alt="">
                        </div>
                        <div class="img-list-item">
                          <img class="item-img" src="" alt="">
                        </div>
                        <div class="img-list-item">
                          <img class="item-img" src="" alt="">
                        </div>
                        <div class="img-list-item">
                          <img class="item-img" src="" alt="">
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="card-button">
                <el-button
                type="primary"
                :loading="submitting"
                native-type="submit">保存</el-button>
              </div>
            </el-form>

          </div>
        </el-main>
      </el-container>
    </el-main>
  </el-container>
</template>
<script>
import BreadCrumb from '../Breadcrumb/Breadcrumb'
import TreeReadOnly from '../tree-diagram/treeReadOnly'
import axios from '@/api/axios'
import exportExcel from '@/api/exportExcel'

export default {
  name: 'riskInfoCard',
  data () {
    return {
      breadcrumb: ['风险分级管控', '岗位风险告知卡'],
      pageLoading: false,
      tableVisible: false,
      riskId: '', // id
      form: {
        id: '', // 告知卡id
        riskId: '', // 风险点id
        workShop: '', // 车间
        gw: '', // 岗位
        centerRisk: '', // 主要风险源
        factor: '', // 因素
        riskResult: '', // 事故后果
        emergency: '' // 措施
      },
      organizationTree: [],
      gwList: [], // 岗位选项列表
      tableData: [],
      submitting: false
    }
  },
  created () {
    this.fetchTreeData()
    this.fetchTableData()
  },
  methods: {
    // 获取树的数据
    fetchTreeData () {
      axios
        .get('spm/riskia/getRiskTree')
        .then((res) => {
          if (res.data.code === 200) {
            this.organizationTree = res.data.data
          }
        })
    },
    // 获取table数据
    fetchTableData () {
      this.pageLoading = true
      let vm = this
      axios
        .get(`spm/riskCard/getRiskCrad?&id=${vm.riskId}`)
        .then((res) => {
          if (res.data.code === 200) {
            if (res.data.gwlist) {
              this.gwList = res.data.gwlist
            }
            if (res.data.data.length > 1 || res.data.data.length === 0) {
              this.tableVisible = true
              this.tableData = res.data.data
            } else {
              this.tableVisible = false
              this.form = res.data.data[0]
            }
          }
        }).finally(() => {
          this.pageLoading = false
        })
    },
    // form表单提交事件
    submitForm () {
      this.$confirm('确定修改风险告知卡?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.submitting = true
        axios
          .post('spm/riskCard/addCard', this.form)
          .then((res) => {
            if (res.data.code === 200) {
              this.$notify.success('提交成功')
              this.fetchTableData()
            } else {
              this.$message({
                message: res.data.message,
                type: 'warning'
              })
            }
          })
          .finally(() => {
            this.submitting = false
          })
      })
    },
    treeClickHandle (data) {
      let vm = this
      vm.riskId = data.riskId
      vm.form.riskId = data.riskId
      vm.fetchTableData()
    },
    closeLoading () {
      this.pageLoading = false
    },
    // 导出excel
    exportExcelHandel () {
      exportExcel(`spm/riskCard/exportCards`, {
        id: this.riskId
      })
    }
  },
  components: {
    TreeReadOnly,
    BreadCrumb
  }
}
</script>

<style scoped lang="scss">
@import '../../utils/css/style.scss';

/deep/.el-select .el-input__inner,
.el-select .el-input__inner:focus,
.el-select .el-input.is-focus .el-input__inner{
  border-color: #ffffff !important;
}

</style>
