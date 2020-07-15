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
            ref="tree"
            :tree-name="'风险单元'"
            :current-id ="currentPlanId"
            :org-interface="'/riskia/getZdRiskTree'"
            :child-interface="'/riskia/getChildRiskTree'"
            @return-id="returnId"
            @tree-click-handle="treeClickHandle"
            @close-loading="closeLoading" >
          </tree-read-only>
        </el-aside>

        <el-main class="inner-content">
          <div class="container-box">
            <div class="content-tools is-flex-end">
                <div class="tools-right">
                  <el-button
                    v-if="form.id && fucBtns.includes('export-btn')"
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
                  prop="riskPlace"
                  label="风险点位置"
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="factor"
                  label="主要风险因素"
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="centerRisk"
                  label="可能导致事故类型"
                  align="center">
                </el-table-column>
                <!-- <el-table-column
                  prop="gkcs"
                  label="主要管控措施"
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="emergency"
                  label="主要应急措施"
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
                  <div class="custom-table-header">重大风险点公告栏</div>
                  <div class="custom-tbody is-inline">
                    <div class="custom-tr">
                      <div class="custom-th-label">风险点位置</div>
                      <div class="custom-td-value">
                        <el-input
                          maxlength="120"
                          v-model.trim="form.riskPlace"
                          placeholder="请输入风险点位置"></el-input>
                      </div>
                    </div>
                    <div class="custom-tr">
                      <div class="custom-th-label">主要风险因素</div>
                      <div class="custom-td-value">
                        <el-input
                          maxlength="120"
                          v-model.trim="form.factor"
                          placeholder="请输入主要风险因素"></el-input>
                      </div>
                    </div>
                    <div class="custom-tr">
                      <div class="custom-th-label">可能导致事故类型</div>
                      <div class="custom-td-value">
                        <el-input
                          maxlength="120"
                          v-model.trim="form.sgType"
                          placeholder="请输入可能导致事故类型"></el-input>
                      </div>
                    </div>
                    <div class="custom-tr">
                      <div class="custom-th-label">主要管控措施</div>
                      <div class="custom-td-value">
                        <el-input
                          class='textarea'
                          type='textarea'
                          autosize
                          maxlength="120"
                          v-model.trim="form.bmp"
                          placeholder=""></el-input>
                      </div>
                    </div>
                    <div class="custom-tr">
                      <div class="custom-th-label">主要应急措施</div>
                      <div class="custom-td-value">
                        <el-input
                          class='textarea'
                          type='textarea'
                          autosize
                          maxlength="120"
                          v-model.trim="form.should"
                          placeholder=""></el-input>
                      </div>
                    </div>
                    <div class="custom-tr">
                      <div class="custom-th-label"></div>
                      <div class="custom-td-value">
                        <el-select
                          v-model="form.emergency"
                          multiple
                          placeholder="请选择"
                          @change="selChangeEmergency">
                          <el-option
                            v-for="(item, index) in options"
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
                            v-for="(item,index) in imgPathSelGkcs"
                            class="img-list-item"
                            :key="'imgGkcs'+ index">
                            <img class="item-img" :src="item.path" alt="">
                          </div>
                          <div
                            v-for="(item,index) in imgPathSelEmergency"
                            class="img-list-item"
                            :key="'imgEmergency'+ index">
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
                  native-type="submit" v-if="fucBtns.includes('save-btn')">保存</el-button>
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
import exportExcel from '@/api/exportExcel'
import axios from '@/api/axios'
export default {
  name: 'riskBulletinBoard',
  data () {
    return {
      breadcrumb: ['风险辨识评估', '重大安全风险点公告栏'],
      pageLoading: false, // 页面loading开关
      tableVisible: false, // table显示开关
      submitting: false, // 提交数据loading开关
      importVisible: false, // 导出按钮显示开关
      riskId: '', // 风险点id
      treeLevel: '', // 树节点等级
      form: {
        id: '',
        riskId: '',
        factor: '',
        riskPlace: '',
        sgType: '',
        gkcs: '', // 主要管控措施
        contingencies: '', // 主要应急措施
        emergency: '',
        control: '', // 主要管控措施
        bmp: '',
        worry: '', // 主要应急措施
        should: ''
      },
      tableData: [], // table列表数据
      editData: null,
      options: [], // 下拉框选择项数据
      imgPathColletion: [], // 所有图片路径集合
      imgPathSelGkcs: [], // 已选择的图片路径 - 主要管控措施
      imgPathSelEmergency: [], // 已选择的图片路径 - 主要应急措施
      currentPlanId: '', // 当前清单项的id
      fucBtns: []
    }
  },
  created () {
    // this.fetchTreeData()
    // this.fetchTableData(1)
    this.getBtnAuthority()
  },
  methods: {
    // 获取树的数据
    // fetchTreeData () {
    //   axios
    //     .get('riskia/getZdRiskTree')
    //     .then((res) => {
    //       if (res.data.code === 200) {
    //         this.organizationTree = res.data.data
    //         this.currentPlanId = this.organizationTree[0].riskId
    //       }
    //     })
    // },
    returnId (id) {
      this.currentPlanId = id
      this.riskId = id
      this.fetchTableData(1)
    },
    // 获取table数据
    fetchTableData (treeLevel) {
      this.pageLoading = true
      let vm = this
      axios
        .get(`riskZdCard/getRiskZdCrad?&id=${vm.riskId}`)
        .then((res) => {
          if (res.data.code === 200) {
            vm.options = res.data.selectList
            vm.imgPathColletion = res.data.picList
            if (treeLevel !== '5') {
              vm.tableVisible = true
              vm.tableData = res.data.data
            } else {
              vm.tableVisible = false
              vm.form = res.data.data[0]
              this.editData = this.form.id
              // vm.form.gkcs = JSON.parse(vm.form.gkcs)
              vm.form.emergency = JSON.parse(vm.form.emergency)

              if (vm.form.gkcs && vm.form.gkcs !== 'null') {
                vm.selChangeGkcs(vm.form.gkcs)
              } else {
                vm.imgPathSelGkcs = []
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
      let vm = this
      vm.$confirm('确定修改重大风险公告栏?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        vm.submitting = true
        vm.form.gkcs = JSON.stringify(vm.form.gkcs)
        vm.form.emergency = JSON.stringify(vm.form.emergency)
        vm.form.riskId = vm.riskId
        axios
          .post('riskZdCard/addCard', vm.form)
          .then((res) => {
            if (res.data.code === 200) {
              vm.$notify.success('提交成功')
              vm.fetchTableData()
              this.importVisible = true
            } else {
              vm.$message({
                message: res.data.message,
                type: 'warning'
              })
            }
          })
          .finally(() => {
            vm.submitting = false
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
      // console.log(vm.form)
      if (vm.treeLevel === '5' || vm.treeLevel === '1') {
        vm.importVisible = false
      } else {
        vm.importVisible = true
      }
      console.log(vm.form)
    },
    closeLoading () {
      this.pageLoading = false
    },
    // 导出excel
    exportExcelHandel () {
      exportExcel(`riskZdCard/exportCards`, 'id=' + this.riskId)
    },
    // 选择器change事件 - 主要管控措施
    selChangeGkcs (data) {
      let vm = this
      vm.imgPathSelGkcs = []
      vm.imgPathColletion.forEach(item => {
        data.forEach(dataItem => {
          if (item.id === dataItem) {
            vm.imgPathSelGkcs.push(item)
          }
        })
      })
    },
    // 选择器change事件 - 主要应急措施
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
    // 获取按钮权限方法
    getBtnAuthority () {
      const authId = {authId: '4-5'}

      axios
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
    }
  },
  components: {
    TreeReadOnly,
    BreadCrumb
  }
}
</script>

<style scoped lang="scss">
@import '@/utils/css/tools/_variables.scss';

/deep/.el-select {
  width: 100%;

  .el-input__inner,
  .el-select .el-input__inner:focus,
  .el-select .el-input.is-focus .el-input__inner {
    border-color: #ffffff !important;
  }
  .el-input__icon{
    line-height: 28px;
  }
  .el-input--suffix .el-input__inner {
    padding-left: 0;
  }
}
/deep/.custom-table  {
    .el-textarea__inner {
    border-color: #ffffff;
}
}
</style>
