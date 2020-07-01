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
                  v-if="importVisible && fucBtns.includes('import-btn')"
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
                  v-if="!tableVisible && fucBtns.includes('export-btn')"
                  class="tools-item"
                  type="success"
                  size="medium"
                  icon="el-icon-download"
                  @click="exportEexcelHandel">
                   导出</el-button>
                   <el-button
                  v-if="organizationVisible && fucBtns.includes('export-btn')"
                  class="tools-popup"
                  type="success"
                  size="medium"
                  icon="el-icon-download"
                  @click="dialogOrganizationVisible1">
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
                      {{riskList.riskGkrs}}
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
                  v-for="(item, index) in newRiskTableData"
                  :key="index"
                  class="custom-tbody">
                  <div class="custom-tr is-flex">
                    <div class="custom-td-value">
                      <div class="custom-td-text">
                        {{item.workNo}}
                      </div>
                    </div>
                    <div class="custom-td-value">
                      <div class="custom-td-text">
                        {{item.sourceName}}
                      </div>
                    </div>
                    <div class="custom-td-value">
                      <div class="custom-td-text">
                        {{(item.indexNo)}}
                      </div>
                    </div>
                    <div class="custom-td-value">
                      <div class="custom-td-text">
                        {{item.bmg}}
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
          :searchVisible="false"
          :tree-name="'导出部门机构列表'"
          :tree-data="departmentalTree"
          @handleNodeClick ="departmentalTreeClickHandle"
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
        riskDj: '' // 风险等级
      },
      newRiskTableData: [], // 新数据
      uploading: false, // 导入loading
      uploadData: {
        riskId: '',
        token: ''
      }, // 上传数据
      fileList: [], // 导入列表
      currentPlanId: '', // 当前清单项的id
      departmentalTreeId: '', // 当前选择部门树 部门id
      fucBtns: []
    }
  },
  created () {
    this.fetchTreeData()
    // this.fetchTableData()
    this.fetchPlanOrganizationData()
    this.uploadData.token = sessionStorage.getItem('TOKEN_KEY')
    this.getBtnAuthority()
  },
  methods: {
    // 组织机构弹窗
    dialogOrganizationVisible1 () {
      this.fetchPlanOrganizationData()
      this.dialogOrganizationVisible = true
      console.log(this.departmentalTree)
    },
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
          this.fetchTableData()
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
        .get(`riskLevel/getRiskCrad?&id=${vm.riskId || vm.currentPlanId}`)
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
              this.newRiskTableData = [] // 清空
              this.riskList = res.data.data[0]
              // const riskTableData = this.riskList.describes[0]
              if (this.riskList.describes) {
                this.riskList.describes.forEach(item => {
                  if (this.riskList.riskDj) { // 当有危险等级的时候，需要显示内容
                    const newArr = []
                    if (item.bmp) {
                      newArr.push(item.bmp)
                    }
                    if (item.mustCs) {
                      newArr.push(item.mustCs)
                    }
                    if (item.technology) {
                      newArr.push(item.technology)
                    }
                    if (item.train) {
                      newArr.push(item.train)
                    }
                    if (item.individual) {
                      newArr.push(item.individual)
                    }
                    if (item.emergency) {
                      newArr.push(item.emergency)
                    }
                    if (item.csStand) {
                      newArr.push(item.csStand)
                    }
                    // console.log(newArr)
                    for (let i = 0; i < newArr.length; i++) {
                      let itemA = {
                        workNo: item.no,
                        work: item.work,
                        rate: item.rate,
                        sourceName: item.riskSourceName,
                        bmg: newArr[i],
                        indexNo: 1 + i
                      }
                      this.newRiskTableData.push(itemA)
                    }
                    this.tagVisible = true
                  } else {
                    this.tagVisible = false
                  }
                })
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
      console.log(vm.currentPlanId)
      console.log(vm.riskId)
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
    },
    getBtnAuthority () {
      const authId = {authId: '4-1'}
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
.custom-tr{
  background: #fff;
}
.tree-box{
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    padding: 56px 10px 6px 10px;
    overflow: auto;
    .custom-tree-node{
      font-size: 16px;
      display: inline-block;
      width: 15em;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      .right-btns{
        position: absolute;
        right: 8px;
        color: #5cb6ff;
      }
    }
    .el-tree-node__content{
      margin-top: 10px;
    }
  }
</style>
