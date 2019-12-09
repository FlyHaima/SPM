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
            @tree-click-handle="getTableData">
          </tree-read-only>
        </el-aside>
        <el-main class="inner-content">
          <div class="container-box">
            <p class="btn-p">
              <a class="export-btn" @click="openExportDialog"><i class></i>导出</a>
            </p>
            <div class="table-box">
              <el-table
                :data="tableData"
                style="width: 100%">
                <el-table-column
                  type="index"
                  label="风险点序号" align="center"
                  width="45">
                </el-table-column>
                <el-table-column label="风险点位置" align="center">
                  <el-table-column label="一级子单元" align="center">
                    <el-table-column
                      prop="oneNo" align="center"
                      label="序号">
                    </el-table-column>
                    <el-table-column align="center"
                      prop="oneName"
                      label="名称">
                    </el-table-column>
                  </el-table-column>
                  <el-table-column label="二级子单元" align="center">
                    <el-table-column align="center"
                      prop="twoNo"
                      label="序号">
                    </el-table-column>
                    <el-table-column align="center"
                      prop="twoName"
                      label="名称">
                    </el-table-column>
                  </el-table-column>
                  <el-table-column label="三级子单元" align="center">
                    <el-table-column align="center"
                      prop="orderNo"
                      label="序号">
                    </el-table-column>
                    <el-table-column align="center"
                      prop="riskName"
                      label="名称">
                    </el-table-column>
                  </el-table-column>
                </el-table-column>
              </el-table>
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
import {getRiskTree, getRiskUnit} from '@/api/riskia'

export default {
  name: 'riskUnit',
  data () {
    return {
      pageLoading: false,
      breadcrumb: ['风险辨识评估', '风险单元'],
      organizationTree: [],
      tableData: [
      ]
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
    openExportDialog () {},
    getRiskTree (create) {
      this.pageLoading = true
      getRiskTree().then((res) => {
        if (res.code === 200) {
          this.organizationTree = res.data
        }
        if (create) {
          this.getTableData(res.data[0])
        }
        this.pageLoading = false
      })
    },
    getTableData (data) {
      this.pageLoading = true
      getRiskUnit(data.riskId).then((res) => {
        if (res.code === 200) {
          this.tableData = res.data
        }
        this.pageLoading = false
      })
    }
  },
  components: {TreeReadOnly, BreadCrumb}
}
</script>

<style scoped lang="scss">
.inner-page-container {
  .inner-content {
    width: 100%;
    height: 100%;
    padding: 29px 22px;
    background: #fff;

    .container-box {
      .btn-p {
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
}
/deep/.inner-page-container {
  .inner-content {
    .el-table td {
      padding: 18px 4px;
    }
  }
}
</style>
