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
                <el-upload
                  class="tools-item"
                  v-if="importVisible"
                  accept=".xls"
                  :action='uploadUrl()'
                  :data="uploadData"
                  :before-upload="handleBeforeUpload"
                  :on-success="handleSuccess"
                  :file-list="fileList"
                  :show-file-list="false">
                  <el-button
                    type="warning"
                    size="medium"
                    icon="el-icon-upload2"
                    v-loading="uploading"
                    class="button-custom">
                   导入</el-button>
                </el-upload>
                <el-button
                  v-if="!tableVisible"
                  class="tools-item"
                  type="success"
                  size="medium"
                  icon="el-icon-download"
                  @click="exportEexcelHandel">
                   导出</el-button>
                   <el-button
                  v-if="organizationVisible"
                  class="tools-popup"
                  type="success"
                  size="medium"
                  icon="el-icon-download"
                  @click="dialogOrganizationVisible= true">
                   导出</el-button>
              </div>
            </div>
            <template v-if="tableVisible">
              <el-table
                :data="tableData"
                border
                style="width: 100%">
                <el-table-column
                  prop="riskBh"
                  label="风险点编号"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="riskName"
                  label="风险点名称"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="riskPlace"
                  label="风险点位置">
                </el-table-column>
                <el-table-column
                  prop="riskYs"
                  label="风险因素">
                </el-table-column>
                <el-table-column
                  prop="riskGkrs"
                  label="管控人">
                </el-table-column>
                <el-table-column
                  prop="riskDj"
                  label="风险等级">
                </el-table-column>
              </el-table>
            </template>
            <div v-else>
              <div class="custom-table">
                <div class="custom-tbody is-inline">
                  <div class="custom-tr">
                    <div class="custom-th-label">风险点编号</div>
                    <div class="custom-td-value">
                      {{riskList.riskBh}}
                    </div>
                  </div>
                  <div class="custom-tr">
                    <div class="custom-th-label">风险点名称</div>
                    <div class="custom-td-value">
                      {{riskList.riskName}}
                    </div>
                  </div>
                  <div class="custom-tr">
                    <div class="custom-th-label">风险点位置</div>
                    <div class="custom-td-value">
                      {{riskList.riskPlace}}
                    </div>
                  </div>
                  <div class="custom-tr">
                    <div class="custom-th-label">风险因素</div>
                    <div class="custom-td-value">
                      {{riskList.riskYs}}
                    </div>
                  </div>
                </div>
                <div class="custom-tbody is-flex is-inline">
                  <div class="custom-tr">
                    <div class="custom-th-label">风险级别</div>
                    <div class="custom-td-value">
                      {{riskList.accessLevel}}
                    </div>
                  </div>
                  <div class="custom-tr">
                    <div class="custom-th-label">风险等级</div>
                    <div class="custom-td-value">
                      <el-tag
                        effect="dark"
                        size="small"
                        v-if="tagVisible"
                        :class="classObj">
                        {{riskList.riskDj}}
                        </el-tag>
                    </div>
                  </div>
                </div>
                <div class="custom-tbody is-inline">
                  <div class="custom-tr">
                    <div class="custom-th-label">管控单位责任人</div>
                    <div class="custom-td-value">
                      {{riskList.deptName}}
                    </div>
                  </div>
                </div>
                <div class="custom-theader">
                  <div class="custom-tr is-flex">
                    <div class="custom-th-label">序号</div>
                    <div class="custom-th-label">检查事项</div>
                    <div class="custom-th-label">序号</div>
                    <div class="custom-th-label">风险管控措施</div>
                    <div class="custom-th-label">检查频次</div>
                  </div>
                </div>
                <div
                  v-for=" item in newRiskTableData"
                  :key="item.workNo"
                  class="custom-tbody">
                  <div class="custom-tr is-flex">
                    <div class="custom-td-value">
                      <div class="custom-td-text">
                        {{item.workNo}}
                      </div>
                    </div>
                    <div class="custom-td-value">
                      <div class="custom-td-text">
                        {{item.work}}
                      </div>
                    </div>
                    <div class="custom-td-value">
                      <div class="custom-td-text">
                        {{item.no}}
                      </div>
                    </div>
                    <div class="custom-td-value">
                      <div class="custom-td-text" v-for="(item,index) in newRiskTableData.bmp" :key="index">
                        {{item}}
                      </div>
                    </div>
                    <div class="custom-td-value">
                      <div class="custom-td-text">
                        {{item.rate}}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </el-main>
        <el-dialog
            :close-on-click-modal="false"
            title="导出部门机构列表"
            :visible.sync="dialogOrganizationVisible"
            width="450px">
      <div style="height: 450px" v-loading="treeLoading">
        <template>
          <tree-organization
              :tree-name="'组织机构'"
              :tree-data="departmentalTree"
              @handleNodeClick="departmentalTreeClickHandle"
          >
          <el-button
            class="btn-sync"
            type="primary"
            size="small"
            @click="exportOrganizationData">导出</el-button>
          </tree-organization>
        </template>
      </div>
    </el-dialog>
      </el-container>
    </el-main>
  </el-container>
</template>
<script>
import BreadCrumb from '../Breadcrumb/Breadcrumb'
import TreeReadOnly from '../tree-diagram/treeReadOnly'
import TreeOrganization from '@/components/tree-diagram/treeOrganization'
import axios from '@/api/axios'
import exportExcel from '@/api/exportExcel'
import base from '@/api/baseUrl'

export default {
  name: 'riskList',
  data () {
    return {
      breadcrumb: ['风险分级管控', '风险点清单'],
      pageLoading: false,
      organizationTree: [], // tree data
      departmentalTree: [], // 部门树
      treeLoading: false,
      riskId: '', // id
      level: '1', // 树层级,
      treeLevel: '', // 当前树的层级
      importVisible: false, // 导出按钮显示开关
      tableVisible: false, // table显示切换开关
      tagVisible: false, // tag显示开关
      tableData: [],
      dialogOrganizationVisible: false, // 组织机构开关
      organizationVisible: false, // 前三级组织机构导出开关
      riskList: {
        riskBh: '', // 风险点编号
        threeName: '', // 风险点名称
        riskPlace: '', // 风险点位置o
        riskYs: '', // 风险因素
        riskGkrs: '', // 管控人
        riskDjCode: '', // 风险等级code
        riskDj: '', // 风险等级
        deptName: '' // 管控单位责任人
      },
      riskTableData: [], // 原数据
      newRiskTableData: [], // 新数据
      uploading: false, // 导入loading
      uploadData: {
        riskId: ''
      }, // 上传数据
      fileList: [], // 导入列表
      currentPlanId: '', // 当前清单项的id
      departmentalTreeId: '' // 当前选择部门树 部门id
    }
  },
  created () {
    this.fetchTreeData()
    this.fetchTableData()
    this.fetchPlanOrganizationData()
  },
  methods: {
    // 导入接口地址
    uploadUrl () {
      return base.baseUrl + '/riskLevel/importRisks'
    },
    // 导入
    handleBeforeUpload (file) {
      this.uploading = true
    },
    // 导入成功
    handleSuccess (response, file, fileList) {
      if (response.code === 200) {
        this.uploading = false
        this.fetchTableData()
        this.$notify.success('导入成功')
      } else {
        this.$notify.warning(response.message)
      }
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
    // 获取部门树数据
    fetchPlanOrganizationData () {
      axios
        .get('basticHidden/getDeptListSize')
        .then((res) => {
          if (res.data.code === 200) {
            this.departmentalTree = res.data.data
          } else {
            this.$message({
              message: res.data.message,
              type: 'warning'
            })
          }
        })
    },
    // 获取table数据
    fetchTableData () {
      this.pageLoading = true
      let vm = this
      axios
        .get(`riskLevel/getRiskCrad?&id=${vm.riskId}`)
        .then((res) => {
          if (res.data.code === 200) {
            if (res.data.data.length > 1 || res.data.data.length === 0) {
              this.tableVisible = true
              this.tableData = res.data.data
              if (this.tableData.riskDj) {
                this.tagVisible = true
              } else {
                this.tagVisible = false
              }
            } else {
              this.tableVisible = false
              this.riskList = res.data.data[0]
              this.riskTableData = this.riskList.describes
              if (this.riskList.riskDj) {
                this.tagVisible = true
              } else {
                this.tagVisible = false
              }
              const newArr = []
              if (this.riskTableData.bmp) {
                newArr.push(this.riskTableData.bmp)
              }
              if (this.riskTableData.mustCs) {
                newArr.push(this.riskTableData.mustCs)
              }
              if (this.riskTableData.technology) {
                newArr.push(this.riskTableData.technology)
              }
              if (this.riskTableData.train) {
                newArr.push(this.riskTableData.train)
              }
              if (this.riskTableData.individual) {
                newArr.push(this.riskTableData.individual)
              }
              if (this.riskTableData.emergency) {
                newArr.push(this.riskTableData.emergency)
              }
              if (this.riskTableData.cstand) {
                newArr.push(this.riskTableData.cstand)
              }
              let itemO = {
                workNo: this.riskTableData.workNo,
                work: this.riskTableData.work,
                rate: this.riskTableData.rate,
                bmp: ''
              }
              for (let i = 1; i <= newArr.length; i++) {
                let itemA = itemO
                itemA.bmg = newArr[i - 1]
                this.newRiskTableData.push(itemA)
              }
            }
          }
        }).finally(() => {
          this.pageLoading = false
        })
    },
    // 处理树的点击事件
    treeClickHandle (data) {
      let vm = this
      vm.riskId = data.riskId
      vm.uploadData.riskId = data.riskId
      vm.level = data.level
      vm.treeLevel = data.treeLevel
      vm.fetchTableData()
      console.log(vm.riskTableData)
      console.log(vm.newRiskTableData.bmg)
      if (vm.treeLevel === '4') {
        vm.importVisible = true
      } else {
        vm.importVisible = false
      }
      if (vm.treeLevel === '5' || vm.treeLevel === '1') {
        vm.organizationVisible = false
      } else {
        vm.organizationVisible = true
      }
    },
    // 部门树的点击出来事件
    departmentalTreeClickHandle (data) {
      let vm = this
      vm.departmentalTreeId = data
      // console.log(vm.departmentalTreeId)
    },
    closeLoading () {
      this.pageLoading = false
    },
    // 导出部门列表
    exportOrganizationData () {
      exportExcel(`riskLevel/exportRiskCard`, 'id=' + this.departmentalTreeId)
    },
    // 导出excel
    exportEexcelHandel () {
      exportExcel(`riskLevel/exportRiskCard`, 'id=' + this.riskId)
    }
  },
  computed: {
    // tag的class集合计算
    classObj () {
      let vm = this
      if (vm.riskList.riskDjCode === '4') {
        return 'tag-low'
      } else if (vm.riskList.riskDjCode === '3') {
        return 'tag-normal'
      } else if (vm.riskList.riskDjCode === '2') {
        return 'tag-warning'
      } else if (vm.riskList.riskDjCode === '1') {
        return 'tag-danger'
      }
    }

  },
  components: {
    TreeReadOnly,
    BreadCrumb,
    TreeOrganization
  }
}
</script>

<style scoped lang="scss">
</style>
