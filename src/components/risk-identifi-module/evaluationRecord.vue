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
            ref="tree"
            :tree-name="'风险单元'"
            :org-interface="'/riskia/getRiskTree'"
            :child-interface="'/riskia/getChildRiskTree'"
            :current-id ="currentPlanId"
            @return-id="returnId"
            @open-loading="openLoading"
            @close-loading="closeLoading"
            @tree-click-handle="handleTreeNode">
          </tree-read-only>
        </el-aside>
        <el-main class="inner-content">
          <el-tabs type="border-card" v-model="activeName" @tab-click="changeTab">
            <el-tab-pane label="作业活动类" name="作业活动">
              <p class="btn-p">
                <el-select v-model="methodA" placeholder="请选择方法" @change="getTabelData()" autocomplete>
                  <el-option
                    v-for="(item, index) in methodOptions"
                    :key="index"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
                <a class="export-btn" @click="exportTable()" v-if="fucBtns.includes('export-btn')"><i class></i>导出</a>
              </p>
              <div class="table-box">
                <el-table
                  :data="tableDataA"
                  style="width: 100%">
                  <el-table-column
                    type="index"
                    label="序号" align="center"
                    width="45">
                  </el-table-column>
                  <el-table-column
                    prop="work"
                    label="作业步骤" align="center"
                    width="45">
                  </el-table-column>
                  <el-table-column
                    prop="riskSourceName"
                    label="危险源或潜在事件（人、物、作业环境、管理）" align="center"
                    width="139">
                  </el-table-column>
                  <el-table-column
                    prop="riskSourceType"
                    label="主要后果" align="center">
                  </el-table-column>
                  <el-table-column label="现有控制措施" align="center">
                    <el-table-column
                      prop="technology" align="center"
                      label="工程技术" width="79px">
                    </el-table-column>
                    <el-table-column
                      prop="bmp" align="center"
                      label="管理措施" width="79px">
                    </el-table-column>
                    <el-table-column
                      prop="train" align="center"
                      label="培训教育" width="79px">
                    </el-table-column>
                    <el-table-column
                      prop="individual" align="center"
                      label="个体维护" width="79px">
                    </el-table-column>
                    <el-table-column
                      prop="emergency" align="center"
                      label="应急处理" width="79px">
                    </el-table-column>
                  </el-table-column>
                  <template v-if="methodA == 'LEC'">
                    <el-table-column
                      prop="l"
                      label="L" align="center"
                      width="45">
                    </el-table-column>
                    <el-table-column
                      prop="e"
                      label="E" align="center"
                      width="45">
                    </el-table-column>
                    <el-table-column
                      prop="c"
                      label="C" align="center"
                      width="45">
                    </el-table-column>
                    <el-table-column
                      prop="d"
                      label="D" align="center"
                      width="45">
                    </el-table-column>
                  </template>
                  <template v-else>
                    <el-table-column
                      prop="l"
                      label="L" align="center"
                      width="45">
                    </el-table-column>
                    <el-table-column
                      prop="e"
                      label="S" align="center"
                      width="45">
                    </el-table-column>
                    <el-table-column
                      prop="d"
                      label="R" align="center"
                      width="45">
                    </el-table-column>
                  </template>
                  <el-table-column
                    prop="assessLevel"
                    label="评价级别" align="center"
                    width="45">
                  </el-table-column>
                  <el-table-column
                    prop="controlLevel"
                    label="管控级别" align="center"
                    width="45">
                  </el-table-column>
                  <el-table-column
                    width="500"
                    prop="mustCs"
                    label="建议新增（改进）措施" align="center">
                  </el-table-column>
                  <el-table-column
                    prop="remark"
                    label="备注" align="center"
                    width="75">
                  </el-table-column>
                </el-table>
                <!--分页组件-->
                <div class="el-pagination__wrap text-right">
                  <el-pagination
                    v-if="pageA.pageNo > 0"
                    background
                    layout="prev, pager, next"
                    :current-page="pageA.pageNo"
                    :page-sizes="pageA.sizes"
                    :total="pageA.total"
                    @current-change="handleCurrentChange">
                  </el-pagination>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="设备设施类" name="设备设施">
              <p class="btn-p">
                <el-select v-model="methodB" placeholder="请选择方法" @change="getTabelData()" autocomplete>
                  <el-option
                    v-for="(item, index) in methodOptions"
                    :key="index"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
                <a class="export-btn" @click="exportTable()" v-if="fucBtns.includes('export-btn')"><i class></i>导出</a>
              </p>
              <div class="table-box">
                <el-table
                  :data="tableDataB"
                  style="width: 100%">
                  <el-table-column
                    type="index"
                    label="序号" align="center"
                    width="45">
                  </el-table-column>
                  <el-table-column
                    prop="work"
                    label="作业步骤" align="center"
                    width="45">
                  </el-table-column>
                  <el-table-column
                    prop="riskSourceName"
                    label="危险源或潜在事件（人、物、作业环境、管理）" align="center"
                    width="139">
                  </el-table-column>
                  <el-table-column
                    prop="riskSourceType"
                    label="主要后果" align="center">
                  </el-table-column>
                  <el-table-column label="现有控制措施" align="center">
                    <el-table-column
                      prop="technology" align="center"
                      label="工程技术" width="79px">
                    </el-table-column>
                    <el-table-column
                      prop="bmp" align="center"
                      label="管理措施" width="79px">
                    </el-table-column>
                    <el-table-column
                      prop="train" align="center"
                      label="培训教育" width="79px">
                    </el-table-column>
                    <el-table-column
                      prop="individual" align="center"
                      label="个体维护" width="79px">
                    </el-table-column>
                    <el-table-column
                      prop="emergency" align="center"
                      label="应急处理" width="79px">
                    </el-table-column>
                  </el-table-column>
                  <template v-if="methodB == 'LEC'">
                    <el-table-column
                      prop="l"
                      label="L" align="center"
                      width="45">
                    </el-table-column>
                    <el-table-column
                      prop="e"
                      label="E" align="center"
                      width="45">
                    </el-table-column>
                    <el-table-column
                      prop="c"
                      label="C" align="center"
                      width="45">
                    </el-table-column>
                    <el-table-column
                      prop="d"
                      label="D" align="center"
                      width="45">
                    </el-table-column>
                  </template>
                  <template v-else>
                    <el-table-column
                      prop="l"
                      label="L" align="center"
                      width="45">
                    </el-table-column>
                    <el-table-column
                      prop="e"
                      label="S" align="center"
                      width="45">
                    </el-table-column>
                    <el-table-column
                      prop="d"
                      label="R" align="center"
                      width="45">
                    </el-table-column>
                  </template>

                  <el-table-column
                    prop="assessLevel"
                    label="评价级别" align="center"
                    width="45">
                  </el-table-column>
                  <el-table-column
                    prop="controlLevel"
                    label="管控级别" align="center"
                    width="45">
                  </el-table-column>
                  <el-table-column
                    prop="mustCs"
                    label="新增建议（改进）措施" align="center">
                  </el-table-column>
                  <el-table-column
                    prop="remark"
                    label="备注" align="center"
                    width="75">
                  </el-table-column>
                </el-table>
                <!--分页组件-->
                <div class="el-pagination__wrap text-right">
                  <el-pagination
                    v-if="pageB.pageNo > 0"
                    background
                    layout="prev, pager, next"
                    :current-page="pageB.pageNo"
                    :page-sizes="pageB.sizes"
                    :total="pageB.total"
                    @current-change="handleCurrentChange">
                  </el-pagination>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-main>
      </el-container>
    </el-main>
  </el-container>
</template>

<script>
import BreadCrumb from '../Breadcrumb/Breadcrumb'
import TreeReadOnly from '../tree-diagram/treeReadOnly'
import {getRiskView} from '@/api/riskia'
import base from '@/api/baseUrl'
import axios from '@/api/axios'

export default {
  name: 'evaluationRecord',
  data () {
    return {
      pageLoading: false,
      breadcrumb: ['风险辨识评估', '评价记录'],
      activeName: '作业活动',
      tableDataA: [],
      tableDataB: [],
      currentNode: {},
      methodA: 'LEC',
      methodB: 'LEC',
      methodOptions: ['LEC', 'LS'],
      currentPlanId: '', // 当前清单项的id
      fucBtns: [],
      pageA: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      pageB: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  created () {
    this.getBtnAuthority()
  },
  methods: {
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
    // 切换table翻页
    handleCurrentChange (val) {
      if (this.activeName === '作业活动') {
        this.pageA.pageNo = val
      } else {
        this.pageB.pageNo = val
      }
      this.getTabelData()
    },
    handleTreeNode (data) {
      let vm = this
      vm.pageA.pageNo = 1 // tree节点点击，分页默认为第一页
      vm.pageB.pageNo = 1
      vm.currentNode = data
      vm.getTabelData()
    },
    openLoading () {
      this.pageLoading = true
    },
    closeLoading () {
      this.pageLoading = false
    },
    exportTable () {
      let vm = this
      let baseUrl = base.baseUrl
      let localToken = sessionStorage.getItem('TOKEN_KEY')
      let methodType = ''
      if (this.activeName === '作业活动') {
        methodType = this.methodA
      } else {
        methodType = this.methodB
      }
      let hrefUrl = `${baseUrl}/riskia/exportPjView?riskId=${vm.currentNode.riskId}&type=${vm.activeName}&token=${localToken}&ram=${methodType}`
      location.href = `${hrefUrl}&attname=${vm.activeName}.xls`
    },
    getTabelData () {
      let vm = this
      vm.pageLoading = true
      let methodType = ''
      let page = {}
      if (vm.activeName === '作业活动') {
        methodType = vm.methodA
        page = vm.pageA
      } else {
        methodType = vm.methodB
        page = vm.pageB
      }
      getRiskView(vm.currentNode.riskId, vm.activeName, methodType, page.pageNo, page.pageSize).then((res) => {
        if (res.code === 200) {
          if (vm.activeName === '作业活动') {
            vm.tableDataA = res.data
            vm.pageA.total = res.total
          } else {
            vm.tableDataB = res.data
            vm.pageB.total = res.total
          }
        }
        vm.pageLoading = false
      })
    },
    changeTab () {
      this.getTabelData()
    },
    getBtnAuthority () {
      const authId = {authId: '3-3'}
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
  components: {TreeReadOnly, BreadCrumb}
}
</script>

<style lang="scss" scoped>
.inner-page-container {
  .inner-content {
    width: 100%;
    height: 100%;
    padding: 0;
    background: #fff;
    .btn-p {
      margin-top: 15px;
      height: 36px;
      line-height: 36px;
      & > a {
        float: right;
        width: 83px;
        height: 36px;
        color: #fff;
        font-size: 16px;
        text-align: center;
        margin-left: 28px;
        i {
          margin-right: 8px;
          display: inline-block;
          width: 15px;
          height: 15px;
        }
      }
      .export-btn{
        background: #67c23a;
        i{
          background-size: 14px 14px;
          background: url("../../assets/img/export-icon.png") no-repeat center;
        }
      }
    }
    .table-box{
      margin-top: 30px;
    }
  }
}
/deep/.inner-page-container{
  .el-tabs--border-card{
    border: none;
    box-shadow: none;
  }
  .el-tabs__item{
    border-top: 2px solid #F5F7FA;
  }
  .el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active{
    border-top: 2px solid #409eff;
  }
}
/deep/.inner-page-container {
  .inner-content {
    .el-table td {
      padding: 18px 4px;
    }
    .el-table tbody .cell{
      padding: 0;
    }
  }
}
</style>
