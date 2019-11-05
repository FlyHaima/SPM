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
            @open-loading="openLoading"
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
                  @click="exportEexcel">
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
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="gw"
                  label="岗位"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="centerRisk"
                  label="主要风险源">
                </el-table-column>
                <el-table-column
                  prop="factor"
                  label="风险因素">
                </el-table-column>
                <el-table-column
                  prop="riskResult"
                  label="潜在事故及职业危害类型">
                </el-table-column>
                <el-table-column
                  prop="emergency"
                  label="异常状况应急处置">
                </el-table-column>
              </el-table>
            </template>
            <el-form
              :model = "form"
              ref = "form"
              class="card-form"
              v-else
            >
              <div class="custom-table">
                <div class="custom-table-header">岗位风险告知卡</div>
                <div class="custom-tbody is-flex is-inline">
                  <div class="custom-tr">
                    <div class="custom-th-label">车间</div>
                    <div class="custom-td-value is-ellipsis">
                      <!-- {{riskList.workShop}} -->
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
                @click="submitForm">保存</el-button>
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
import {
  getTreeData
} from '@/api/riskControl/riskList'
import {
  getTableData,
  submitData
} from '@/api/riskControl/riskCard'

export default {
  name: 'riskInfoCard',
  data () {
    return {
      breadcrumb: ['风险辨识评估', '风险划分'],
      pageLoading: false,
      tableVisible: false,
      riskId: '', // id
      form: {
        id: '',
        riskId: '',
        workShop: '',
        gw: '',
        centerRisk: '',
        factor: '',
        riskResult: '',
        emergency: ''
      },
      organizationTree: [],
      tableData1: [
        {
          'pIds': '0,1am020000782,1am020000783,1am020000794,1am020000803,1am020000804,1am020000805,1at070000002',
          'id': '1',
          'riskId': '1at070000002',
          'workShop': '车间1',
          'gw': '岗位1',
          'centerRisk': '风险源1，风险源2',
          'factor': '因素1，因素2',
          'riskResult': '危险1，伤害2',
          'emergency': '措施1，措施2',
          'impTime': '2019-11-01T03:41:43.000+0000',
          'imper': 'admin'
        }
      ],
      gwList: [
      ],
      tableData: []
    }
  },
  created () {
    // this.initTable()
    this.getTreeData()
    this.getTableData(this.riskId)
  },
  methods: {
    // 获取树的数据
    getTreeData () {
      getTreeData().then(res => {
        if (res.code === 200) {
          this.organizationTree = res.data
        }
      })
    },
    // 初始化table数据
    initTable () {
      if (this.tableData1.length > 1) {
        this.tableVisible = true
        this.tableData1.forEach(item => {
          let tableItem = {
            workShop: item.workShop,
            gw: item.gw,
            centerRisk: item.centerRisk,
            factor: item.factor,
            riskResult: item.riskResult,
            emergency: item.emergency
          }
          this.tableData.push(tableItem)
        })
      } else {
        this.tableVisible = false
        let fdata = this.tableData1[0]
        this.form.workShop = fdata.workShop // 车间
        this.form.centerRisk = fdata.centerRisk // 主要风险源
        this.form.factor = fdata.factor // 风险因素
        this.form.riskResult = fdata.riskResult // 潜在事故及危害类型
        this.form.emergency = fdata.emergency // 异常情况应急措施
      }
    },
    // 获取表格数据
    getTableData (id, level) {
      let token = sessionStorage.getItem('token')
      getTableData(token, id).then(res => {
        if (res.code === 200) {
          this.gwList = []
          res.gwList.forEach(item => {
            let listItem = {
              label: item.label,
              value: item.value
            }
            this.gwList.push(listItem)
          })
          if (res.data.length > 1 || res.data.length === 0) {
            this.tableVisible = true
            this.tableData = []
            res.data.forEach(item => {
              let tableItem = {
                workShop: item.workShop,
                gw: item.gw,
                centerRisk: item.centerRisk,
                factor: item.factor,
                riskResult: item.riskResult,
                emergency: item.emergency
              }
              this.tableData.push(tableItem)
            })
          } else {
            this.tableVisible = false
            let fdata = res.data[0]
            this.form.id = fdata.id
            this.form.workShop = fdata.workShop // 车间
            this.form.centerRisk = fdata.centerRisk // 主要风险源
            this.form.factor = fdata.factor // 风险因素
            this.form.riskResult = fdata.riskResult // 潜在事故及危害类型
            this.form.emergency = fdata.emergency // 异常情况应急措施
          }
        }
      })
    },
    openLoading (data) {
      // this.pageLoading = true
      let vm = this
      vm.riskId = data.riskId
      vm.form.riskId = data.riskId
      vm.getTableData(vm.riskId)
      // vm.initTable()
    },
    closeLoading () {
      this.pageLoading = false
    },
    // 导出excel
    exportEexcel () {

    },
    submitForm () {
      // let self = this
      this.$confirm('确定修改风险告知卡?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs.form.validate((valid) => {
          if (valid) {
            submitData(this.form).then((res) => {
              if (res.code === 200) {
                this.$notify.success('提交成功')
              } else {
                this.$message({
                  message: res.message,
                  type: 'warning'
                })
              }
              this.pageLoading = false
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
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
