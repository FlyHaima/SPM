<template>
  <el-container class="inner-main-content" v-loading="pageLoading">
    <el-aside class="inner-aside" width="408px">
      <tree-read-only
        ref="tree"
        :org-interface="'/riskia/getRiskTree'"
        :child-interface="'/riskia/getChildRiskTree'"
        :tree-name="'风险单元'"
        :tree-data="riskUnitTree"
        :current-id ="currentPlanId"
        @return-id="returnId"
        searchVisible
        shrinkVisible
        @tree-click-handle="handleTreeNode">
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
              <el-form-item label="复核时间">
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
          v-loading = "tablesLoading"
          :data="tableData"
          border
          style="width: 100%"
          align="center">
          <el-table-column
            prop="checkName"
            label="检查名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="hiddenType"
            label="隐患类型"
            align="center">
          </el-table-column>
          <el-table-column
            prop="checkByUser"
            label="复核人"
            align="center">
          </el-table-column>
          <el-table-column
            prop="checkByTime"
            label="复核时间"
            align="center">
            <template slot-scope="scope">
              {{scope.row.checkByTime | timeFilter}}
            </template>
          </el-table-column>
          <el-table-column
            prop="rectiTime"
            label="整改时间"
            align="center">
            <template slot-scope="scope">
              {{scope.row.rectiTime | timeFilter}}
            </template>
          </el-table-column>
          <el-table-column
            prop="rectiRemark"
            label="整改意见"
            align="center">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="复核情况"
            width="120"
            align="center">
            <template slot-scope="scope">
              <a
                v-if="fucBtns.includes('detail-btn')"
                href="javascript:;"
                class="color-primary"
                @click="detailsHandle(scope.row)">详情
              </a>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="100"
            align="center">
            <template slot-scope="scope">
              <a
                v-if="fucBtns.includes('review-btn')"
                href="javascript:;"
                class="color-primary"
                @click="reviewHandle(scope.row)">复核
              </a>
            </template>
          </el-table-column>
        </el-table>
        <!--分页组件-->
        <div class="el-pagination__wrap text-right" v-if="page.total > page.pageSize">
          <el-pagination
            background
            layout="prev, pager, next"
            :current-page="page.pageNo"
            :page-sizes="page.sizes"
            :total="page.total"
            @current-change="handleCurrentChange">
          </el-pagination>
        </div>
      </div>
    </el-main>
    <dialog-details
      ref="dialogDetails"
      :dialogVisible = "dialogDetailsVisible"
      :id = "currentDetailsId"
      @on-dialog-change = "changeDetailsDialog"
    ></dialog-details>
    <dialog-review
      :postData = "postReviewData"
      :dialogVisible = "dialogReviewVisible"
      @on-dialog-change = "changeReviewDialog"
      @reload = "fetchTableData"
    ></dialog-review>
  </el-container>
</template>

<script>
import TreeReadOnly from '@/components/tree-diagram/treeReadOnly'
import axios from '@/api/axios'
import moment from 'moment'
import DialogDetails from '@/components/risk-screening/screening-review/detailsDialog'
import DialogReview from '@/components/risk-screening/screening-review/reviewDialog'
import exportExcel from '@/api/exportExcel'
import { mapState } from 'vuex'
export default {
  name: 'list',
  props: {
    type: {
      type: String,
      default: ''
    },
    hiddInstanceId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      pageLoading: false,
      tablesLoading: false,
      dialogDetailsVisible: false, // 详情弹框显示开关
      dialogReviewVisible: false, // 复核弹框显示开关
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
      postReviewData: null, // 复核时传的对象
      fucBtns: [],
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  components: {
    TreeReadOnly,
    DialogDetails,
    DialogReview
  },
  created () {
    let vm = this
    vm.currentPlanId = vm.$route.query.id
    this.fetchUnitTreeData()
    this.fetchTableData()
    this.getBtnAuthority()
  },
  filters: {
    // 格式化日期格式
    'timeFilter' (value) {
      if (value) {
        return moment(value).format('YYYY-MM-DD HH:mm:ss')
      } else {
        return ''
      }
    }
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
    // 触发复核操作
    reviewHandle (item) {
      this.postReviewData = item
      this.dialogReviewVisible = true
    },
    changeReviewDialog (val) {
      this.dialogReviewVisible = val
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
    returnId (id) {
      this.currentPlanId = id
      let data = {
        riskId: id,
        level: '1',
        treeLevel: '1',
        pageNo: 1,
        pageSize: 10
      }
      this.handleTreeNode(data)
    },
    // 换页
    handleCurrentChange (val) {
      this.page.pageNo = val
      this.fetchTableData()
    },
    // 树节点，点击功能
    // treeClickHandle (item) {
    //   let vm = this
    //   vm.currentPlanId = item.riskId
    //   vm.fetchTableData()
    // },
    handleTreeNode (data) {
      let vm = this
      vm.page.pageNo = 1 // tree节点点击，分页默认为第一页
      vm.currentPlanId = data.riskId
      vm.fetchTableData()
    },
    // 获取风险单元树的数据
    fetchUnitTreeData () {
      let vm = this
      vm.pageLoading = true
      axios
        .get('riskia/getRiskTree')
        .then((res) => {
          if (res.data.code === 200) {
            vm.riskUnitTree = res.data.data
            if (vm.$route.query.id) {
              vm.currentPlanId = vm.$route.query.id
            } else {
              vm.currentPlanId = this.riskUnitTree[0].riskId
            }
            this.fetchTableData()
          }
        })
        .finally(() => {
          this.pageLoading = false
        })
    },
    // 获取排查隐患清单列表
    fetchTableData () {
      let vm = this
      vm.tablesLoading = true
      axios
        .get('hiddenAct/dImpleList', {
          checkName: vm.form.checkName,
          investType: vm.type,
          startTime: vm.form.startTime,
          endTime: vm.form.endTime,
          leftId: vm.currentPlanId,
          hiddInstanceId: this.hiddInstanceId,
          pageNo: vm.page.pageNo,
          pageSize: vm.page.pageSize
        })
        .then((res) => {
          if (res.data.code === 200) {
            vm.tableData = res.data.data
            vm.page.total = res.data.total
          }
        })
        .finally(() => {
          vm.tablesLoading = false
        })
    },
    // 查询table，表单提交响应事件
    tableSearchHandler () {
      this.fetchTableData()
    },

    // 导出excel
    exportEexcelHandel () {
      exportExcel(`hiddenAct/exportdImpleList`,
        'userId=' + this.userInfo.userId + '&' +
        'leftId=' + this.currentPlanId + '&' +
        'investType=' + this.type + '&' +
        'checkName=' + this.form.checkName + '&' +
        'startTime=' + this.form.startTime + '&' +
        'endTime=' + this.form.endTime)
    },
    getBtnAuthority () {
      const authId = {authId: '5-3'}
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
