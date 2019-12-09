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
                <el-upload
                  class="tools-item"
                  v-if="importVisible"
                  accept=".xls"
                  action="http://58.155.61.34:8033/spm/riskLevel/importRisks"
                  :data="uploadData"
                  :before-upload="handleBeforeUpload"
                  :on-success="handleSuccess"
                  :file-list="fileList"
                  :show-file-list="false">
                  <el-button
                    type="warning"
                    size="medium"
                    icon="el-icon-upload2"
                    v-loading="uploading">
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
                  prop="threeName"
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
                      {{riskList.riskLevel}}
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
                  v-for=" item in riskTableData"
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
                      <div class="custom-td-text">
                        {{item.bmp}}
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
  name: 'riskList',
  data () {
    return {
      breadcrumb: ['风险分级管控', '风险点清单'],
      pageLoading: false,
      organizationTree: [], // tree data
      riskId: '', // id
      level: '1', // 树层级,
      treeLevel: '', // 当前树的层级
      importVisible: false, // 导出按钮显示开关
      tableVisible: false, // table显示切换开关
      tagVisible: false, // tag显示开关
      tableData: [],
      riskList: {
        riskBh: '', // 风险点编号
        threeName: '', // 风险点名称
        riskPlace: '', // 风险点位置
        riskYs: '', // 风险因素
        riskGkrs: '', // 管控人
        riskDjCode: '', // 风险等级code
        riskDj: '' // 风险等级
      },
      riskTableData: [],
      baseUrl: 'http://58.155.61.34:8033/spm/',
      uploading: false, // 导入loading
      uploadData: {
        riskId: ''
      }, // 上传数据
      fileList: [] // 导入列表
    }
  },
  created () {
    this.fetchTreeData()
    this.fetchTableData()
  },
  methods: {
    // 导入
    handleBeforeUpload (file) {
      this.uploading = true
    },
    // 导入成功
    handleSuccess (response, file, fileList) {
      this.$notify.success('导入成功')
      this.uploading = false
      this.fetchTableData()
    },
    // 获取树的数据
    fetchTreeData () {
      axios
        .get('riskia/getRiskTree')
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
      if (vm.treeLevel === '4') {
        vm.importVisible = true
      } else {
        vm.importVisible = false
      }
    },
    closeLoading () {
      this.pageLoading = false
    },
    // 导出excel
    exportEexcelHandel () {
      exportExcel(`riskLevel/exportRiskCrad`, 'id=' + this.riskId)
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
    BreadCrumb
  }
}
</script>

<style scoped lang="scss">
@import '../../utils/css/style.scss';
</style>
