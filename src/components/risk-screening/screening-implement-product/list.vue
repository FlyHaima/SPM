<template>
  <el-container class="inner-main-content" v-loading="pageLoading">
    <el-aside class="inner-aside" width="408px">
      <tree-read-only
        ref="tree"
        :org-interface="'/riskia/getRiskTree'"
        :child-interface="'/riskia/getChildRiskTree'"
        :tree-name="'风险单元'"
        :current-id ="currentPlanId"
        searchVisible
        shrinkVisible
        @return-id="returnId"
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
              <el-form-item label="检查日期">
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
              type="primary"
              size="medium"
              @click="dialogOrganizationVisible= true"
              v-if = "fucBtns.includes('export-btn')"
              >
              隐患排查清单</el-button>
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
            align="center">
          </el-table-column>
          <el-table-column
            prop="receiverUser"
            label="接收人"
            align="center"
            width="120">
          </el-table-column>
          <el-table-column
            label="发送时间"
            align="center"
            width="120">
             <template slot-scope="scope">
              {{scope.row.setTime | timeFilter}}
            </template>
          </el-table-column>
          <el-table-column
            prop="checkUser"
            label="检查人员"
            align="center">
          </el-table-column>
          <el-table-column
            prop="checkTime"
            label="检查时间"
            align="center"
            width="120">
            <template slot-scope="scope">
              {{scope.row.checkTime | timeFilter}}
            </template>
          </el-table-column>
          <el-table-column
            prop="hiddenDesc"
            label="隐患描述"
            align="center">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            align="center"
            width="100px">
            <template slot-scope="scope">
              <a
                v-if="fucBtns.includes('detail-btn')"
                href="javascript:;"
                class="talbe-links-del"
                @click.prevent="editItem(scope.row)">详情
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
    <dialog-detail
      :dialogVisible="dialogDetailVisible"
      :planId="currentPlanId"
      :formData="detailData"
      @on-dialog-change="changeDetailDialog"
    ></dialog-detail>
  </el-container>
</template>

<script>
import moment from 'moment'
import TreeReadOnly from '@/components/tree-diagram/treeReadOnly'
import TreeOrganization from '@/components/tree-diagram/treeOrganization'
import axios from '@/api/axios'
import exportExcel from '@/api/exportExcel'
import { mapState } from 'vuex'
import DialogDetail from '@/components/risk-screening/screening-implement/detail'
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
      submitting: false,
      dialogDetailVisible: false,
      form: {
        checkName: '',
        startTime: '',
        endTime: ''
      },
      listMenuData: [], // 计划清单列表数据
      currentPlanId: '', // 当前清单项的id
      tableData: [], // 生产类清单列表数据
      queryDate: '', // 查询时间段
      detailData: {
        checkName: '', // 检查名称
        checkUser: '', // 检查人员
        checkTime: '', // 检查时间
        hiddenDesc: '', // 隐患描述
        hiddenPhotos: [] // 附件
      },
      dialogOrganizationVisible: false, // 组织结构树开关
      treeLoading: false, // 组织结构树加载
      departmentalTree: [], // 组织结构树数据
      fucBtns: [],
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  components: {
    TreeReadOnly, // 风险单元树
    DialogDetail, // 详情
    TreeOrganization // 部门树
  },
  created () {
    let vm = this
    vm.currentPlanId = vm.$route.query.id
    // this.fetchUnitTreeData()
    // this.fetchTableData()
    this.fetchPlanOrganizationData()
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
    editItem (data) {
      let vm = this
      vm.dialogDetailVisible = true
      vm.detailData = {
        checkName: data.checkName, // 检查名称
        checkUser: data.checkUser, // 检查人员
        checkTime: data.checkTime, // 检查时间
        hiddenDesc: data.hiddenDesc, // 隐患描述
        hiddenPhotos: data.hiddenPhotos // 附件
      }
    },
    changeDetailDialog (val) {
      this.dialogDetailVisible = val
    },
    // 选择时间事件
    checkQueryDate (val) {
      if (val) {
        this.form.startTime = val[0]
        this.form.endTime = val[1]
      } else {
        this.form.startTime = this.form.endTime = ''
      }
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
      this.treeClickHandle(data)
    },
    treeClickHandle (data) {
      let vm = this
      vm.page.pageNo = 1 // tree节点点击，分页默认为第一页
      vm.currentPlanId = data.riskId
      vm.fetchTableData()
    },
    // 切换table页
    handleCurrentChange (val) {
      this.page.pageNo = val
      this.fetchTableData()
    },
    // 获取风险单元树的数据
    // fetchUnitTreeData () {
    //   let vm = this
    //   this.pageLoading = true
    //   axios
    //     .get('riskia/getRiskTree')
    //     .then((res) => {
    //       if (res.data.code === 200) {
    //         this.riskUnitTree = res.data.data
    //         if (vm.$route.query.id) {
    //           vm.currentPlanId = vm.$route.query.id
    //         } else {
    //           vm.currentPlanId = this.riskUnitTree[0].riskId
    //         }
    //         this.fetchTableData()
    //       }
    //     })
    //     .finally(() => {
    //       this.pageLoading = false
    //     })
    // },
    // 获取排查隐患清单列表
    fetchTableData () {
      this.tablesLoading = true
      axios
        .get('hiddenAct/pImpleList', {
          checkName: this.form.checkName,
          investType: this.type,
          startTime: this.form.startTime,
          endTime: this.form.endTime,
          leftId: this.currentPlanId,
          pageNo: this.page.pageNo,
          pageSize: this.page.pageSize
        })
        .then((res) => {
          if (res.data.code === 200) {
            this.tableData = res.data.data
            this.page.total = res.total
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
      exportExcel(`hiddenAct/exportpImpleList`,
        'userId=' + this.userInfo.userId + '&' +
        'leftId=' + this.currentPlanId + '&' +
        'investType=' + this.type + '&' +
        'checkName=' + this.form.checkName + '&' +
        'startTime=' + this.form.startTime + '&' +
        'endTime=' + this.form.endTime)
    },

    // 获取树数据
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
    // 组织结构树点击事件
    departmentalTreeClickHandle (data) {
      // console.log(data)
      let vm = this
      vm.departmentalTreeId = data
    },
    exportOrganizationData () {
      exportExcel(`riskLevel/exportRisksInvest`, 'id=' + this.departmentalTreeId)
      // console.log(this.departmentalTreeId)
    },
    getBtnAuthority () {
      const authId = {authId: '5-2'}
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
