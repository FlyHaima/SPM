<template>
  <el-container class="inner-main-content" v-loading="pageLoading">
    <el-aside class="inner-aside" width="290px">
      <tree-list
        v-if="listMenuDataTag"
        :menu-name="'计划清单'"
        :list-data = "listMenuData"
        :current-id ="currentPlanId"
        showSearch
        @menu-click-handle="menuClickHandle"
      ></tree-list>
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
              <el-button
              v-if="fucBtns.includes('export-yh-btn')"
              type="primary"
              size="medium"
              icon="el-icon-download"
              @click="openDialogVisible">
              隐患公示导出</el-button>
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
            width="200"
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
            <template slot-scope="scope">
              {{scope.row.checkTime | timeFilter}}
            </template>
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
            <template slot-scope="scope">
              {{scope.row.checkByTime | timeFilter}}
            </template>
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
            <template slot-scope="scope">
              {{scope.row.goverTime | timeFilter}}
            </template>
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
            <template slot-scope="scope">
              {{scope.row.goverReviTime | timeFilter}}
            </template>
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
              <a
                v-if="fucBtns.includes('detail-btn')"
                href="javascript:;"
                class="color-primary"
                @click="detailsHandle(scope.row)">详情
              </a>
            </template>
          </el-table-column>
        </el-table>
        <!--分页组件-->
        <div class="el-pagination__wrap text-right" v-if="page.pageNo > 1">
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
    <el-dialog
        :close-on-click-modal='false'
         title="隐患公示导出"
        :visible.sync="dialogVisible"
         width="560px">
        <template>
          <div class="block">
          <span class="demonstration">选择时间段</span>
          <el-date-picker
          v-model="datetimeInterval"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="daterange"
          @change="hiddencheckQueryDate"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
          </el-date-picker>
          <el-button
            class="btn-sync"
           type="primary"
          size="small"
         @click="exportHiddenDangerDataTime">确定</el-button>
        </div>
        </template>
      </el-dialog>
    <dialog-details
      ref="dialogDetails"
      :dialogVisible = "dialogDetailsVisible"
      :id = "currentDetailsId"
      @on-dialog-change = "changeDetailsDialog"
    ></dialog-details>
  </el-container>
</template>

<script>
import TreeList from '@/components/tree-diagram/treeList'
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
      dialogVisible: false, // 隐患公式导出显示开关
      datetimeInterval: '', // 隐患公式开始日期，结尾日期 值
      hiddenDangerForm: { // 隐患公式导出时间段
        startTime: '',
        endTime: ''
      },
      form: {
        checkName: '',
        startTime: '',
        endTime: ''
      },
      listMenuData: [], // 计划清单列表数据
      listMenuDataTag: false,
      currentPlanId: '', // 当前清单项的id
      tableData: [], // 基础类清单列表数据
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
      fucBtns: [],
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  components: {
    TreeList, // 计划清单菜单
    DialogDetails,
    TableStep
  },
  created () {
    let vm = this
    vm.currentPlanId = vm.$route.query.id
    vm.fetchListMenuData()
    // vm.fetchTableData()
    vm.getBtnAuthority()
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
    hiddencheckQueryDate (val) {
      if (val) {
        this.hiddenDangerForm.startTime = val[0]
        this.hiddenDangerForm.endTime = val[1]
      } else {
        this.hiddenDangerForm.startTime = this.form.endTime = ''
      }
    },
    // 隐患公示显示弹窗 日期初始化
    openDialogVisible () {
      this.dialogVisible = true
      this.datetimeInterval = ''
    },
    /** 左侧清单菜单 **/
    // 获取清单数据
    fetchListMenuData () {
      this.pageLoading = true
      axios
        .get('schedule/getScheduleList')
        .then((res) => {
          if (res.data.code === 200) {
            this.listMenuData = res.data.data
            this.listMenuDataTag = true
            if (this.$route.query.id) {
              this.currentPlanId = this.$route.query.id
            } else {
              if (this.listMenuData.length > 0) {
                this.currentPlanId = this.listMenuData[0].planId // 该情况，对应左侧菜单无数据
              } else {
                this.currentPlanId = ''
              }
            }
            if (this.currentPlanId) {
              this.fetchTableData()
            }
          }
        })
        .finally(() => {
          this.pageLoading = false
        })
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
    // 点击菜单项
    menuClickHandle (item) {
      this.currentPlanId = item.planId
      this.page.pageNo = 0
      this.fetchTableData()
    },
    /** 右侧列表内容 **/
    // 获取排查隐患清单列表
    // 获取排查隐患清单列表
    fetchTableData () {
      this.tablesLoading = true
      axios
        .get('hiddenAct/manageLedgersList', {
          checkName: this.form.checkName,
          investType: this.type,
          startTime: this.form.startTime,
          endTime: this.form.endTime,
          leftId: this.currentPlanId
        })
        .then((res) => {
          if (res.data.code === 200) {
            this.tableData = res.data.data
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
      exportExcel(`hiddenAct/exportManageLedgers`,
        'userId=' + this.userInfo.userId + '&' +
        'leftId=' + this.currentPlanId + '&' +
        'investType=' + this.type + '&' +
        'checkName=' + this.form.checkName + '&' +
        'startTime=' + this.form.startTime + '&' +
        'endTime=' + this.form.endTime)
    },
    // 根据时间导出 隐患公式列表导出
    exportHiddenDangerDataTime () {
      // console.log(this.hiddenDangerForm.startTime, this.hiddenDangerForm.endTime, this.form.startTime, this.form.endTime)
      exportExcel(`hiddenAct/exportHiddenPublic`,
        'investType=' + this.type + '&' +
        'startTime=' + this.hiddenDangerForm.startTime + '&' +
        'endTime=' + this.hiddenDangerForm.endTime)
    },
    getBtnAuthority () {
      const authId = {authId: '5-6'}
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
