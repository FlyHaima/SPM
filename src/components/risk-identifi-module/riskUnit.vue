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
          <div class="container-box">
            <p class="btn-p">
              <a class="export-btn" target="_blank" :href="`${baseUrl}/riskia/exportRiskUnit?id=${curentId}&token=${localToken}&attname=风险单元.xls`" v-if="fucBtns.includes('export-btn')"><i class></i>导出</a>
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
          </div>
        </el-main>
      </el-container>
    </el-main>
  </el-container>
</template>

<script>
import BreadCrumb from '../Breadcrumb/Breadcrumb'
import TreeReadOnly from '../tree-diagram/treeReadOnly'
import {getRiskUnit} from '@/api/riskia'
import base from '@/api/baseUrl'
import axios from '@/api/axios'

export default {
  name: 'riskUnit',
  data () {
    return {
      pageLoading: false,
      breadcrumb: ['风险辨识评估', '风险单元'],
      tableData: [
      ],
      baseUrl: '',
      curentId: '',
      localToken: '',
      currentPlanId: '', // 当前清单项的id
      fucBtns: [],
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  created () {
    this.localToken = sessionStorage.getItem('TOKEN_KEY')
    this.baseUrl = base.baseUrl
    this.getBtnAuthority()
  },
  methods: {
    openLoading () {
      this.pageLoading = true
    },
    closeLoading () {
      this.pageLoading = false
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
    // 切换table
    handleCurrentChange (val) {
      this.page.pageNo = val
      this.getTableData()
    },
    handleTreeNode (data) {
      let vm = this
      vm.page.pageNo = 1 // tree节点点击，分页默认为第一页
      vm.currentTreeData = data
      vm.getTableData()
    },
    getTableData () {
      let vm = this
      vm.pageLoading = true
      getRiskUnit(vm.currentTreeData.riskId, vm.page.pageNo, vm.page.pageSize).then((res) => {
        if (res.code === 200) {
          vm.tableData = res.data
          vm.page.total = res.total
        }
        vm.pageLoading = false
      })
    },
    getBtnAuthority () {
      const authId = {authId: '3-2'}
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

<style scoped lang="scss">
@import '@/utils/css/tools/_variables.scss';
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
