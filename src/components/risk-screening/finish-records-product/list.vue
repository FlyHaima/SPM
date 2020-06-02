<template>
  <el-container class="inner-main-content" v-loading="pageLoading">
    <el-aside class="inner-aside" width="408px">
      <tree-read-only
        :tree-name="'风险单元'"
        :tree-data="riskUnitTree"
        :current-id ="currentPlanId"
        searchVisible
        shrinkVisible
        @tree-click-handle="treeClickHandle">
      </tree-read-only>
    </el-aside>
    <el-main class="inner-content">
      <div class="container-box">
        <div class="content-tools">
          <div class="tools-left">
            <el-form
              size="medium"
              :inline="true"
              :model="form"
              class="demo-form-inline">
              <el-form-item label="检查名称">
                <el-input v-model="form.checkName" placeholder="请输入检查名称"></el-input>
              </el-form-item>
              <el-form-item label="检查时间">
                <el-date-picker
                  v-model="queryDate"
                  @change="checkQueryDate"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd HH:mm:ss">
                </el-date-picker>
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
              @click="exportEexcelHandel">
              导出</el-button>
          </div>
        </div>
        <el-table
          v-loading="tablesLoading"
          :data="tableData"
          border
          style="width: 100%"
          align="center">
          <el-table-column
            prop="checkName"
            label="检查名称"
            width="280"
            align="center">
          </el-table-column>
          <el-table-column
            prop="checkUser"
            label="检查人"
            align="center">
          </el-table-column>
          <el-table-column
            prop="checkTime"
            label="检查时间"
            align="center"
            width="115">
          </el-table-column>
          <el-table-column
            prop="content"
            label="检查内容"
            width="280"
            align="center">
          </el-table-column>
          <el-table-column
            prop="isHidden"
            label="是否符合"
            align="center">
          </el-table-column>
          <el-table-column
            prop="hiddenDesc"
            label="隐患描述"
            align="center">
          </el-table-column>
          <el-table-column
            prop="hiddenType"
            label="隐患类型"
            align="center"
            width="100">
          </el-table-column>
          <el-table-column
            prop="checkByUser"
            label="复核人"
            align="center">
          </el-table-column>
          <el-table-column
            prop="checkByTime"
            label="复核时间"
            align="center"
            width="115">
          </el-table-column>
          <el-table-column
            prop="rectiRemark"
            label="整改意见"
            align="center">
          </el-table-column>
          <el-table-column
            prop="goverUser"
            label="治理人"
            align="center">
          </el-table-column>
          <el-table-column
            prop="goverTime"
            label="治理时间"
            align="center"
            width="115">
          </el-table-column>
          <el-table-column
            prop="goverReviUser"
            label="治理复核人"
            align="center"
            width="100">
          </el-table-column>
          <el-table-column
            prop="goverReviTime"
            label="治理复核时间"
            align="center"
            width="115">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="进度"
            align="center"
            width="200">
            <template slot-scope="scope">
              <span v-if="scope.row.actState === '完成'">{{scope.row.actState}}</span>
              <table-step
                v-else
                :step-data="stepData"
                :active="scope.row.actState * 1"
              >
              </table-step>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="治理完成情况"
            width="120"
            align="center">
            <template slot-scope="scope">
              <span
                v-if="scope.row.isHidden === '合格'"
              >完成</span>
              <a
                v-else-if="fucBtns.includes('detail-btn')"
                href="javascript:;"
                class="color-primary"
                @click="detailsHandle(scope.row)">详情
              </a>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-main>
    <dialog-details
      ref="dialogDetails"
      :dialogVisible = "dialogDetailsVisible"
      :id = "currentDetailsId"
      @on-dialog-change = "changeDetailsDialog"
    ></dialog-details>
  </el-container>
</template>

<script>
import TreeReadOnly from '@/components/tree-diagram/treeReadOnly'
import TableStep from '@/components/step/stepCustom'
import axios from '@/api/axios'
import moment from 'moment'
import DialogDetails from '@/components/risk-screening/screening-review/detailsDialog'
import exportExcel from '@/api/exportExcel'
import { mapState } from 'vuex'
export default {
  name: 'list',
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      pageLoading: false,
      tablesLoading: false,
      dialogDetailsVisible: false, // 详情弹框显示开关
      form: {
        checkName: '',
        startTime: '',
        endTime: ''
      },
      listMenuData: [], // 计划清单列表数据
      currentPlanId: '', // 当前清单项的id
      riskUnitTree: [], // 风险单元机构树
      tableData: [], // 生产类清单列表数据
      queryDate: '',
      currentDetailsId: '',
      stepData: [
        {
          label: 'p',
          value: 1
        },
        {
          label: 'd',
          value: 2
        },
        {
          label: 'c',
          value: 3
        },
        {
          label: 'a',
          value: 4
        }
      ],
      fucBtns: []
    }
  },
  components: {
    TreeReadOnly,
    DialogDetails,
    TableStep
  },
  created () {
    this.fetchUnitTreeData()
    this.fetchTableData()
    this.getBtnAuthority()
  },
  methods: {
    checkQueryDate (val) {
      if (val) {
        this.form.startTime = val[0]
        this.form.endTime = val[1]
      } else {
        this.form.startTime = this.form.endTime = ''
      }
    },
    // 触发详情弹框
    detailsHandle (item) {
      this.currentDetailsId = item.procInstId
      // 触发子组件的获取详情的数据接口
      this.$refs.dialogDetails.fetchDetailsData()
      this.dialogDetailsVisible = true
    },
    changeDetailsDialog (val) {
      this.dialogDetailsVisible = val
    },
    // 树节点，点击功能
    treeClickHandle (item) {
      this.currentPlanId = item.riskId
      this.fetchTableData()
    },
    // 获取风险单元树的数据
    fetchUnitTreeData () {
      this.pageLoading = true
      axios
        .get('riskia/getRiskTree')
        .then((res) => {
          if (res.data.code === 200) {
            this.riskUnitTree = res.data.data
            this.currentPlanId = this.riskUnitTree[0].riskId
            this.fetchTableData()
          }
        })
        .finally(() => {
          this.pageLoading = false
        })
    },
    // 获取排查隐患清单列表
    fetchTableData () {
      this.tablesLoading = true
      axios
        .get('hiddenAct/recordCompletionList', {
          checkName: this.form.checkName,
          investType: this.type,
          startTime: this.form.startTime,
          endTime: this.form.endTime,
          leftId: this.currentPlanId
        })
        .then((res) => {
          if (res.data.code === 200) {
            this.formatTableData = res.data.data
            this.formatTableData.forEach(item => {
              // 治理复核时间
              if (item.goverReviTime) {
                item.goverReviTime = moment(item.goverReviTime).format('YYYY-MM-DD  HH: mm: ss')
              } else {
                item.goverReviTime = ''
              }
              // 检查时间
              if (item.checkTime) {
                item.checkTime = moment(item.checkTime).format('YYYY-MM-DD  HH: mm: ss')
              } else {
                item.checkTime = ''
              }
              // 复核时间
              if (item.checkByTime) {
                item.checkByTime = moment(item.checkByTime).format('YYYY-MM-DD  HH: mm: ss')
              } else {
                item.checkByTime = ''
              }
              // 治理时间
              if (item.goverTime) {
                item.goverTime = moment(item.goverTime).format('YYYY-MM-DD  HH: mm: ss')
              } else {
                item.goverTime = ''
              }
              // 治理复核时间
              if (item.goverReviTime) {
                item.goverReviTime = moment(item.goverReviTime).format('YYYY-MM-DD  HH: mm: ss')
              } else {
                item.goverReviTime = ''
              }
            })
            this.tableData = this.formatTableData
          }
        })
        .finally(() => {
          this.tablesLoading = false
        })
    },
    // 查询table，表单提交响应事件
    tableSearchHandler () {
      this.fetchTableData()
    },
    // 导出excel
    exportEexcelHandel () {
      exportExcel(`hiddenAct/exportRecordCompletion`,
        'userId=' + this.userInfo.userId + '&' +
        'leftId=' + this.currentPlanId + '&' +
        'investType=' + this.type + '&' +
        'checkName=' + this.form.checkName + '&' +
        'startTime=' + this.form.startTime + '&' +
        'endTime=' + this.form.endTime)
    },
    getBtnAuthority () {
      const authId = {authId: '5-7'}
      axios
        .get('user/getBtnArray', authId)
        .then((res) => {
          if (res.data.code === 200) {
            console.log(res.data)
            this.fucBtns = res.data.data.functionBtns
            console.log(this.fucBtns)
          } else {
            this.$message({
              message: res.data.message,
              type: 'warning'
            })
          }
        })
    }
  },
  computed: { // vuex 参数引入
    ...mapState({
      // 获取用户信息
      userInfo: (state) => state.userInfo
    })
  }
}
</script>

<style lang="scss" scoped>
.table-img{
  width: 62px;
  height: 53px;
}
</style>
