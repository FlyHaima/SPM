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
            @close-loading="closeLoading"
            @tree-click-handle="changeTable">
          </tree-read-only>
        </el-aside>
        <el-main class="inner-content">
          <el-tabs type="border-card" v-model="activeName">
            <el-tab-pane label="作业活动类" name="tab_a">
              <p class="btn-p">
                <a class="export-btn" @click="openExportDialogA"><i class></i>导出</a>
              </p>
              <div class="table-box">
                <el-table
                  :data="tableDataA"
                  style="width: 100%">
                  <el-table-column
                    prop="indexNum"
                    label="序号" align="center"
                    width="45">
                  </el-table-column>
                  <el-table-column
                    prop="stepNum"
                    label="作业步骤" align="center"
                    width="45">
                  </el-table-column>
                  <el-table-column
                    prop="hazard"
                    label="危险源或潜在事件（人、物、作业环境、管理）" align="center"
                    width="139">
                  </el-table-column>
                  <el-table-column
                    prop="consequence"
                    label="主要后果" align="center">
                  </el-table-column>
                  <el-table-column label="现有控制措施" align="center">
                    <el-table-column
                      prop="technical" align="center"
                      label="工程技术" width="79px">
                    </el-table-column>
                    <el-table-column
                      prop="manager" align="center"
                      label="管理措施" width="79px">
                    </el-table-column>
                    <el-table-column
                      prop="education" align="center"
                      label="培训教育" width="79px">
                    </el-table-column>
                    <el-table-column
                      prop="protect" align="center"
                      label="个体维护" width="79px">
                    </el-table-column>
                    <el-table-column
                      prop="emergency" align="center"
                      label="应急处理" width="79px">
                    </el-table-column>
                  </el-table-column>
                  <el-table-column
                    prop="indexNum"
                    label="L" align="center"
                    width="45">
                  </el-table-column>
                  <el-table-column
                    prop="indexNum"
                    label="E" align="center"
                    width="45">
                  </el-table-column>
                  <el-table-column
                    prop="indexNum"
                    label="C" align="center"
                    width="45">
                  </el-table-column>
                  <el-table-column
                    prop="indexNum"
                    label="D" align="center"
                    width="45">
                  </el-table-column>
                  <el-table-column
                    prop="JLevel"
                    label="评价级别" align="center"
                    width="45">
                  </el-table-column>
                  <el-table-column
                    prop="MLevel"
                    label="管控级别" align="center"
                    width="45">
                  </el-table-column>
                  <el-table-column
                    prop="advice"
                    label="建议新增（改进）措施" align="center">
                  </el-table-column>
                  <el-table-column
                    prop="Remarks"
                    label="备注" align="center"
                    width="75">
                  </el-table-column>
                </el-table>
              </div>
            </el-tab-pane>
            <el-tab-pane label="设备设施类" name="tab_b">
              <p class="btn-p">
                <a class="export-btn" @click="openExportDialogB"><i class></i>导出</a>
              </p>
              <div class="table-box">
                <el-table
                  :data="tableDataB"
                  style="width: 100%">
                  <el-table-column
                    prop="indexNum"
                    label="序号" align="center"
                    width="45">
                  </el-table-column>
                  <el-table-column
                    prop="stepNum"
                    label="作业步骤" align="center"
                    width="45">
                  </el-table-column>
                  <el-table-column
                    prop="hazard"
                    label="危险源或潜在事件（人、物、作业环境、管理）" align="center"
                    width="139">
                  </el-table-column>
                  <el-table-column
                    prop="consequence"
                    label="主要后果" align="center">
                  </el-table-column>
                  <el-table-column label="现有控制措施" align="center">
                    <el-table-column
                      prop="technical" align="center"
                      label="工程技术" width="79px">
                    </el-table-column>
                    <el-table-column
                      prop="manager" align="center"
                      label="管理措施" width="79px">
                    </el-table-column>
                    <el-table-column
                      prop="education" align="center"
                      label="培训教育" width="79px">
                    </el-table-column>
                    <el-table-column
                      prop="protect" align="center"
                      label="个体维护" width="79px">
                    </el-table-column>
                    <el-table-column
                      prop="emergency" align="center"
                      label="应急处理" width="79px">
                    </el-table-column>
                  </el-table-column>
                  <el-table-column
                    prop="L"
                    label="L" align="center"
                    width="45">
                  </el-table-column>
                  <el-table-column
                    prop="S"
                    label="S" align="center"
                    width="45">
                  </el-table-column>
                  <el-table-column
                    prop="R"
                    label="R" align="center"
                    width="45">
                  </el-table-column>
                  <el-table-column
                    prop="JLevel"
                    label="评价级别" align="center"
                    width="45">
                  </el-table-column>
                  <el-table-column
                    prop="MLevel"
                    label="管控级别" align="center"
                    width="45">
                  </el-table-column>
                  <el-table-column
                    prop="advice"
                    label="新增建议（改进）措施" align="center">
                  </el-table-column>
                  <el-table-column
                    prop="Remarks"
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
import {getRiskTree} from '@/api/riskia'

export default {
  name: 'evaluationRecord',
  data () {
    return {
      pageLoading: false,
      breadcrumb: ['风险辨识评估', '评价记录'],
      activeName: 'tab_a',
      organizationTree: [],
      tableDataA: [
        {
          indexNum: 111,
          stepNum: 101,
          hazard: '风险点层级A',
          consequence: 'boom',
          technical: '123123',
          manager: 'qweqwe',
          education: '风险点层级B',
          protect: 100198,
          emergency: '风险点层级C',
          L: 12,
          E: 4,
          C: 0.1,
          D: 4.8,
          JLevel: '中等C级',
          MLevel: 'C',
          advice: 'stop bullshit',
          Remarks: 'all bullshit'
        }
      ],
      tableDataB: [
        {
          indexNum: 111,
          stepNum: 101,
          hazard: '风险点层级A',
          consequence: 'boom',
          technical: '123123',
          manager: 'qweqwe',
          education: '风险点层级B',
          protect: 100198,
          emergency: '风险点层级C',
          L: 12,
          S: 4,
          R: 48,
          JLevel: '中等C级',
          MLevel: 'C',
          advice: 'stop bullshit',
          Remarks: 'all bullshit'
        }
      ]
    }
  },
  created () {
    this.getRiskTree()
  },
  methods: {
    openLoading () {
      this.pageLoading = true
    },
    closeLoading () {
      this.pageLoading = false
    },
    openExportDialogA () {},
    openExportDialogB () {},
    getRiskTree () {
      this.pageLoading = true
      getRiskTree().then((res) => {
        if (res.code === 200) {
          this.organizationTree = res.data
        }
        this.pageLoading = false
      })
    },
    changeTable (data) {
      console.log(data)
    },
    getTableA () {},
    getTableB () {}
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
