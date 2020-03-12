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
            @open-loading="openLoading"
            @close-loading="closeLoading"
            @tree-click-handle="getTabelData">
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
                <a class="export-btn" @click="exportTable()"><i class></i>导出</a>
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
                    prop="mustCs"
                    label="建议新增（改进）措施" align="center">
                  </el-table-column>
                  <el-table-column
                    prop="remark"
                    label="备注" align="center"
                    width="75">
                  </el-table-column>
                </el-table>
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
                <a class="export-btn" @click="exportTable()"><i class></i>导出</a>
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
import {getRiskTree, getRiskView} from '@/api/riskia'
import base from '@/api/baseUrl'

export default {
  name: 'evaluationRecord',
  data () {
    return {
      pageLoading: false,
      breadcrumb: ['风险辨识评估', '评价记录'],
      activeName: '作业活动',
      organizationTree: [],
      tableDataA: [],
      tableDataB: [],
      currentNode: {},
      methodA: 'LEC',
      methodB: 'LEC',
      methodOptions: ['LEC', 'LS'],
      currentPlanId: '' // 当前清单项的id
    }
  },
  created () {
    this.getRiskTree(true)
  },
  methods: {
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
    getRiskTree (create) {
      this.pageLoading = true
      getRiskTree().then((res) => {
        if (res.code === 200) {
          this.organizationTree = res.data
          this.currentPlanId = this.organizationTree[0].riskId
        }
        if (create) {
          this.getTabelData(res.data[0])
        }
        this.pageLoading = false
      })
    },
    getTabelData (data) {
      this.pageLoading = true
      if (data != null) {
        this.currentNode = data
      }
      let methodType = ''
      if (this.activeName === '作业活动') {
        methodType = this.methodA
      } else {
        methodType = this.methodB
      }
      getRiskView(this.currentNode.riskId, this.activeName, methodType).then((res) => {
        if (res.code === 200) {
          if (this.activeName === '作业活动') {
            this.tableDataA = res.data
          } else {
            this.tableDataB = res.data
          }
        }
        this.pageLoading = false
      })
    },
    changeTab () {
      this.getTabelData()
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
