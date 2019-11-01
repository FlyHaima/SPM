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
                <el-upload
                  v-if="importVisible"
                  :limit="1"
                  accept=".xlsx"
                  action="http://upload-z1.qiniup.com"
                  >
                  <el-button type="warning" size="medium" icon="el-icon-upload2">
                   导入</el-button>
                </el-upload>

                <el-button
                  type="success"
                  size="medium"
                  icon="el-icon-download"
                  @click="exportEexcel">
                   导出</el-button>
              </div>
            </div>
            <div v-if="tableVisible">
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
            </div>
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
                      {{riskList.threeName}}
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
                      {{riskList.riskDjCode}}
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
                        {{item.workNo}}
                      </div>
                    </div>
                    <div class="custom-td-value">
                      <div class="custom-td-text">
                        {{item.bmp}}
                      </div>
                    </div>
                    <div class="custom-td-value">
                      <div class="custom-td-text">dd</div>
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
import {
  getTreeData,
  getTableData
} from '@/api/riskControl/riskList'

export default {
  name: 'riskList',
  data () {
    return {
      breadcrumb: ['风险辨识评估', '风险划分'],
      pageLoading: false,
      organizationTree: [], // tree data
      riskId: '', // id
      level: '', // 树层级,
      treeLevel: '', // 当前树的层级
      importVisible: true, // 导出按钮显示开关
      tableVisible: false, // table显示切换开关
      tagVisible: false, // tag显示开关
      // tableData1: [
      //   {
      //     'oneNo': null,
      //     'oneName': null,
      //     'oneId': null,
      //     'twoId': null,
      //     'threeId': '1ak070000001',
      //     'onePid': null,
      //     'twoNo': null,
      //     'twoName': null,
      //     'threeNo': null,
      //     'threeName': '前端下的风险点',
      //     'ontPid': null,
      //     'riskBh': '1',
      //     'riskPlace': '前端下的风险点',
      //     'riskYs': '物的因素,人的因素',
      //     'riskGkrs': '222,1',
      //     'riskLevel': '1',
      //     'describes': [
      //       {
      //         'workNo': '1',
      //         'work': '测试数据1',
      //         'bmp': '风险管控措施1'
      //       },
      //       {
      //         'workNo': '2',
      //         'work': '测试数据2',
      //         'bmp': '风险管控措施2'
      //       }
      //     ]
      //   }
      // ],
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
      riskTableData: []
    }
  },
  created () {
    this.getTreeData()
    this.getTableData(this.riskId, this.level)
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
    initTable () {
      if (this.tableData1.length > 1) {
        this.tableVisible = true
        this.tableData1.forEach(item => {
          let tableItem = {
            riskBh: item.riskBh,
            threeName: item.threeName,
            riskPlace: item.riskPlace,
            riskYs: item.riskYs,
            riskGkrs: item.riskGkrs,
            riskLevel: item.riskLevel
          }
          this.tableData.push(tableItem)
        })
      } else {
        this.tableVisible = false
        let fdata = this.tableData1[0]
        fdata.describes.forEach(item => {
          let tableItem = {
            workNo: item.workNo, // 序号
            work: item.work, // 检查事项
            bmp: item.bmp // 风险管控措施
          }
          this.riskTableData.push(tableItem)
        })
        this.riskList.riskBh = fdata.riskBh // 风险点编号
        this.riskList.threeName = fdata.threeName // 风险点名称
        this.riskList.riskPlace = fdata.riskPlace // 风险点位置
        this.riskList.riskYs = fdata.riskYs // 风险因素
        this.riskList.riskGkrs = fdata.riskGkrs // 风险级别
        this.riskList.riskLevel = fdata.riskLevel // 风险等级
        this.riskList.riskLevelCode = fdata.riskLevelCode // 管控单位负责人
      }
    },
    // 获取表格数据
    getTableData (id, level) {
      let token = sessionStorage.getItem('token')
      getTableData(token, id, level).then(res => {
        if (res.code === 200) {
          if (res.data.length > 1 || res.data.length === 0) {
            this.tableVisible = true
            this.tableData = []
            res.data.forEach(item => {
              let tableItem = {
                riskBh: item.riskBh,
                threeName: item.threeName,
                riskPlace: item.riskPlace,
                riskYs: item.riskYs,
                riskGkrs: item.riskGkrs,
                riskDjCode: item.riskDjCode,
                riskDj: item.riskDj
              }
              this.tableData.push(tableItem)
            })
            if (this.tableData.riskDj) {
              this.tagVisible = true
            } else {
              this.tagVisible = false
            }
          } else {
            this.tableVisible = false
            let fdata = res.data[0]
            this.riskList.riskBh = fdata.riskBh
            this.riskList.threeName = fdata.threeName
            this.riskList.riskPlace = fdata.riskPlace
            this.riskList.riskYs = fdata.riskYs
            this.riskList.riskGkrs = fdata.riskGkrs
            this.riskList.riskDj = fdata.riskDj
            this.riskList.riskDjCode = fdata.riskDjCode
            if (this.riskList.riskDj) {
              this.tagVisible = true
            } else {
              this.tagVisible = false
            }
          }
        }
      })
    },
    // 处理树的点击事件
    openLoading (data) {
      // this.pageLoading = true
      let vm = this
      vm.riskId = data.riskId
      vm.level = data.level
      vm.treeLevel = data.treeLevel
      vm.getTableData(vm.riskId, vm.level)
      if (vm.treeLevel === '4') {
        vm.importVisible = false
      } else {
        vm.importVisible = true
      }
    },
    closeLoading () {
      this.pageLoading = false
    },
    // 导出excel
    exportEexcel () {

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
