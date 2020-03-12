<template>
  <el-container class="inner-main-content" v-loading="pageLoading">
    <el-aside class="inner-aside" width="408px">
      <tree-list
        v-if="listMenuData.length > 0"
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
              <el-form-item label="最终治理时间">
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
            align="center">
          </el-table-column>
          <el-table-column
            prop="goverTime"
            label="整改时间"
            align="center">
          </el-table-column>
          <el-table-column
            prop="goverUser"
            label="整改人"
            align="center">
          </el-table-column>
          <el-table-column
            label="整改图片"
            align="center">
            <template slot-scope="scope">
              <img class="table-img" :src="scope.row.rectiPhoto" title="img"/>
            </template>
          </el-table-column>
          <el-table-column
            prop="rectiRecord"
            label="整改记录"
            align="center">
          </el-table-column>
          <el-table-column
            label="治理情况"
            width="120"
            align="center">
            <template slot-scope="scope">
              <a
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
      :dialogVisible = "dialogDetailsVisible"
      :id = "currentDetailsId"
      @on-dialog-change = "changeDetailsDialog"
    ></dialog-details>
  </el-container>
</template>

<script>
import TreeList from '@/components/tree-diagram/treeList'
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
      tableData: [], // 基础类清单列表数据
      queryDate: '',
      currentDetailsId: ''
    }
  },
  components: {
    TreeList, // 计划清单菜单
    DialogDetails
  },
  created () {
    let vm = this
    vm.currentPlanId = vm.$route.query.id
    vm.fetchListMenuData()
    vm.fetchTableData()
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
    /** 左侧清单菜单 **/
    // 获取清单数据
    fetchListMenuData () {
      this.pageLoading = true
      axios
        .get('schedule/getScheduleList')
        .then((res) => {
          if (res.data.code === 200) {
            this.listMenuData = res.data.data
            if (this.$route.query.id) {
              this.currentPlanId = this.$route.query.id
            } else {
              this.currentPlanId = this.listMenuData[0].planId
            }
            this.fetchTableData()
          }
        })
        .finally(() => {
          this.pageLoading = false
        })
    },
    // 触发详情弹框
    detailsHandle (item) {
      this.currentDetailsId = item.procInstId
      this.dialogDetailsVisible = true
    },
    changeDetailsDialog (val) {
      this.dialogDetailsVisible = val
    },
    // 点击菜单项
    menuClickHandle (item) {
      this.currentPlanId = item.planId
      this.fetchTableData()
    },
    /** 右侧列表内容 **/
    // 获取排查隐患清单列表
    fetchTableData () {
      this.tablesLoading = true
      axios
        .get('hiddenAct/cImpleList', {
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
              // 整改时间
              if (item.goverTime) {
                item.goverTime = moment(item.goverTime).format('YYYY-MM-DD  HH: mm: ss')
              } else {
                item.goverTime = ''
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
      exportExcel(`hiddenAct/exportcImpleList`,
        'userId=' + this.userInfo.userId + '&' +
        'leftId=' + this.currentPlanId + '&' +
        'investType=' + this.type + '&' +
        'checkName=' + this.form.checkName + '&' +
        'startTime=' + this.form.startTime + '&' +
        'endTime=' + this.form.endTime)
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
