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
            :current-id ="currentPlanId"
            @tree-click-handle="treeClickHandle"
            @close-loading="closeLoading" >
          </tree-read-only>
        </el-aside>

        <el-main class="inner-content">
          <div class="container-box">
             <div class="content-tools is-flex-end">
                <div class="tools-right">
                  <el-button
                    v-if="importVisible"
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
                  align="center">
                </el-table-column>
                <!-- <el-table-column
                  prop="riskResult"
                  label="潜在事故及职业危害类型"
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="emergency"
                  label="异常状况应急处置"
                  align="center">
                </el-table-column> -->
              </el-table>
            </template>
            <template v-else>

              <el-form
                :model = "form"
                ref = "form"
                @submit.native.prevent="submitForm"
                class="card-form"
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
                      <div class="custom-th-label">岗位<span style="font-size: 12px">(组织结构中的第7级开始)</span></div>
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
                          v-model.trim="form.hazardType"
                          placeholder=""></el-input>
                      </div>
                    </div>
                    <div class="custom-tr">
                      <div class="custom-th-label">异常状况应急处置</div>
                      <div class="custom-td-value">
                        <el-input
                          maxlength="120"
                          v-model.trim="form.emergencyResponse"
                          placeholder=""></el-input>
                      </div>
                    </div>
                    <div class="custom-tr">
                      <div class="custom-th-label"></div>
                      <div class="custom-td-value">
                        <el-select
                          v-model="form.emergency"
                          multiple
                          placeholder="请选择异常状况应急处置"
                          @change="selChangeEmergency">
                          <el-option
                            v-for="(item,index) in options"
                            :key="'emergency' + index"
                            :label="item.label"
                            :value="item.value"
                            >
                          </el-option>
                        </el-select>
                      </div>
                    </div>
                  </div>
                  <div class="custom-tbody">
                    <div class="custom-tr text-center">
                      <div class="custom-td-value">
                        <div class="custom-td-img-list">
                          <div
                            v-for="(item,index) in imgPathSelRiskResult"
                            class="img-list-item"
                            :key="'imgRiskResult' + index">
                            <img class="item-img" :src="item.path" alt="">
                          </div>
                          <div
                            v-for="(item,index) in imgPathSelEmergency"
                            class="img-list-item"
                            :key="'imgEmergency' + index">
                            <img class="item-img" :src="item.path" alt="">
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
            </template>
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
      pageLoading: false, // 页面loading开关
      tableVisible: false, // table显示开关
      submitting: false, // 提交数据loading开关
      importVisible: false, // 到处按钮显示开关
      riskId: '', // 风险点id
      form: {
        id: '', // 告知卡id
        riskId: '', // 风险点id
        workShop: '', // 车间
        gw: '', // 岗位
        centerRisk: '', // 主要风险源
        factor: '', // 因素
        riskResult: [], // 事故后果
        emergency: [], // 措施
        hazardType: [], // 职业危害类型
        emergencyResponse: [] // 应急处置
      },
      organizationTree: [], // 组织结构树数据
      tableData: [], // table列表数据
      editData: null,
      options: [], // 下拉框选择项数据
      imgPathColletion: [], // 所有图片路径集合
      imgPathSelRiskResult: [], // 已选择的图片路径 - 潜在的事故及职业危害类型
      imgPathSelEmergency: [], // 已选择的图片路径 - 异常状况应急处置
      gwList: [], // 岗位选项列表
      currentPlanId: '' // 当前清单项的id
    }
  },
  created () {
    this.fetchTreeData()
    this.fetchTableData(1)
  },
  methods: {
    // 选择器change事件 - 潜在的事故及职业危害类型
    selChangeRiskResult (data) {
      let vm = this
      vm.imgPathSelRiskResult = []
      vm.imgPathColletion.forEach(item => {
        data.forEach(dataItem => {
          if (item.id === dataItem) {
            vm.imgPathSelRiskResult.push(item)
          }
        })
      })
    },
    // 选择器change事件 - 异常状况应急处置
    selChangeEmergency (data) {
      let vm = this
      vm.imgPathSelEmergency = []
      vm.imgPathColletion.forEach(item => {
        data.forEach(dataItem => {
          if (item.id === dataItem) {
            vm.imgPathSelEmergency.push(item)
          }
        })
      })
    },
    // 获取树的数据
    fetchTreeData () {
      axios
        .get('riskia/getRiskTree')
        .then((res) => {
          if (res.data.code === 200) {
            this.organizationTree = res.data.data
            this.currentPlanId = this.organizationTree[0].riskId
          }
        })
    },
    // 获取table数据
    fetchTableData (treeLevel) {
      this.pageLoading = true
      let vm = this
      axios
        .get(`riskCard/getRiskCrad?&id=${vm.riskId}`)
        .then((res) => {
          if (res.data.code === 200) {
            this.options = res.data.selectList
            this.imgPathColletion = res.data.picList
            if (res.data.gwlist) {
              this.gwList = res.data.gwlist
            }
            if (treeLevel !== '5') {
              this.tableVisible = true
              this.tableData = res.data.data
            } else {
              this.tableVisible = false
              this.form = res.data.data[0]
              this.editData = this.form.id
              this.form.riskResult = JSON.parse(this.form.riskResult)
              this.form.emergency = JSON.parse(this.form.emergency)
              if (vm.form.riskResult) {
                vm.selChangeRiskResult(vm.form.riskResult)
              } else {
                vm.imgPathSelRiskResult = []
              }
              if (vm.form.emergency) {
                vm.selChangeEmergency(vm.form.emergency)
              } else {
                vm.imgPathSelEmergency = []
              }
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
        this.form.riskResult = JSON.stringify(this.form.riskResult)
        this.form.emergency = JSON.stringify(this.form.emergency)
        axios
          .post('riskCard/addCard', this.form)
          .then((res) => {
            if (res.data.code === 200) {
              this.$notify.success('提交成功')
              this.fetchTableData()
              this.importVisible = true
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
    // 树节点点击事件处理
    treeClickHandle (data) {
      let vm = this
      vm.riskId = data.riskId
      vm.form.riskId = data.riskId
      vm.treeLevel = data.treeLevel
      vm.fetchTableData(data.treeLevel)
      if (vm.treeLevel === '5' | vm.treeLevel === '1') {
        vm.importVisible = false
      } else {
        vm.importVisible = true
      }
    },
    closeLoading () {
      this.pageLoading = false
    },
    // 导出excel
    exportExcelHandel () {
      exportExcel(`riskCard/exportCards`, 'id=' + this.riskId)
    }
  },
  components: {
    TreeReadOnly,
    BreadCrumb
  }
}
</script>

<style scoped lang="scss">
@import '@/utils/css/style.scss';

/deep/.el-select {
  width: 100%;

  .el-input__inner,
  .el-select .el-input__inner:focus,
  .el-select .el-input.is-focus .el-input__inner{
    border-color: #ffffff !important;
  }
  .el-input__icon{
    line-height: 28px;
  }
  .el-input--suffix .el-input__inner{
    padding-left: 0;
  }
}
</style>
