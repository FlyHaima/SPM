<template>
  <el-container class="inner-page-container" v-loading="pageLoading">
    <el-header class="inner-header">
      <bread-crumb :breadList="breadcrumb">
      </bread-crumb>
    </el-header>
    <el-main class="inner-main-container">
      <el-tabs type="border-card" class="height-100">
        <el-tab-pane>
          <span slot="label">组织机构</span>
          <el-container class="inner-main-content">
            <el-aside class="inner-aside" width="408px">
              <tree-diagram :tree-data="organizationTree" :tree-name="'组织机构'" :has-upload="true" :show-btns="true"
                            @open-loading="openLoading"
                            @close-loading="closeLoading"
                            @handleNodeClick="handleNodeClick"
                            @openAppendBox="addTreeData"
                            @editTreeData="editTreeData"
                            @confirmRemove="confirmRemove"
                            @editDeptInfo="editDeptInfo">
              </tree-diagram>
            </el-aside>

            <el-main class="inner-content">
              <div class="container-box">
                <organigram :organigram-data="orgTreeData"></organigram>
              </div>
            </el-main>
          </el-container>
        </el-tab-pane>

        <el-tab-pane>
          <span slot="label">领导小组</span>
          <el-container class="inner-main-content">
            <el-aside class="inner-aside" width="408px">
              <tree-diagram :tree-data="leaderTree" :tree-name="'领导小组'" :has-upload="false"
                            @open-loading="openLoading"
                            @close-loading="closeLoading">
              </tree-diagram>
            </el-aside>

            <el-main class="inner-content">
              <div class="container-box">
                <p class="btn-p">
                  <a class="export-btn"><i class></i>导出</a>
                  <a class="import-btn"><i></i>导入</a>
                </p>
                <el-table ref="leaderTable"
                          border
                          stripe
                          :data="leaderData"
                          tooltip-effect="dark"
                          style="width: 100%">
                  <el-table-column
                    label="姓名"
                    width="160"
                    align="center">
                    <template slot-scope="scope">{{ scope.row.name }}</template>
                  </el-table-column>
                  <el-table-column
                    label="联系方式"
                    width="160"
                    align="center">
                    <template slot-scope="scope">{{ scope.row.concatNum }}</template>
                  </el-table-column>
                  <el-table-column
                    label="主要职责"
                    align="center">
                    <template slot-scope="scope">{{ scope.row.duty }}</template>
                  </el-table-column>
                  <el-table-column
                    label="操作"
                    width="80px"
                    align="center">
                    <template slot-scope="scope">
                      <el-button type="text" @click="editLeaderItem(scope.row.id)">编辑</el-button>
                    </template>
                  </el-table-column>
                </el-table>

                <div class="pages">
                  <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="100">
                  </el-pagination>
                </div>
              </div>
            </el-main>
          </el-container>
        </el-tab-pane>

        <el-tab-pane>
          <span slot="label">工作小组</span>
          <el-container class="inner-main-content">
            <el-aside class="inner-aside" width="408px">
              <tree-diagram :tree-data="workTree" :tree-name="'工作小组'" :has-upload="false"
                            @open-loading="openLoading"
                            @close-loading="closeLoading" >
              </tree-diagram>
            </el-aside>

            <el-main class="inner-content">
              <div class="container-box">
                <p class="btn-p">
                  <a class="export-btn"><i class></i>导出</a>
                  <a class="import-btn"><i></i>导入</a>
                </p>
                <el-table ref="leaderTable"
                          border
                          stripe
                          :data="workerData"
                          tooltip-effect="dark"
                          style="width: 100%">
                  <el-table-column
                    label="姓名"
                    width="160"
                    align="center">
                    <template slot-scope="scope">{{ scope.row.name }}</template>
                  </el-table-column>
                  <el-table-column
                    label="联系方式"
                    width="160"
                    align="center">
                    <template slot-scope="scope">{{ scope.row.concatNum }}</template>
                  </el-table-column>
                  <el-table-column
                    label="主要职责"
                    align="center">
                    <template slot-scope="scope">{{ scope.row.duty }}</template>
                  </el-table-column>
                  <el-table-column
                    label="操作"
                    width="80px"
                    align="center">
                    <template slot-scope="scope">
                      <el-button type="text" @click="editLeaderItem(scope.row.id)">编辑</el-button>
                    </template>
                  </el-table-column>
                </el-table>

                <div class="pages">
                  <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="100">
                  </el-pagination>
                </div>
              </div>
            </el-main>
          </el-container>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script>
import BreadCrumb from '../Breadcrumb/Breadcrumb'
import TreeDiagram from '../tree-diagram/treeDiagram'
import Organigram from '../organigram/organigram'
import {getOrgTree, getTreeDept, addTreeData, editTreeData, delTreeData, editDeptInfo, getLeaderTree} from '@/api/organization'
import {mapState} from 'vuex'

export default {
  name: 'organization',
  data () {
    return {
      breadcrumb: ['风险辨识评估', '风险划分'],
      pageLoading: false,
      organizationTree: [],
      leaderTree: [],
      workTree: [],
      leaderData: [
        {
          id: 1234123,
          name: '王小虎',
          concatNum: '18899890977',
          duty: '主要职责内容，balabalbalbalbalbablablab'
        },
        {
          id: 1234123,
          name: '王小虎',
          concatNum: '18899890977',
          duty: '主要职责内容，balabalbalbalbalbablablab'
        },
        {
          id: 1234123,
          name: '王小虎',
          concatNum: '18899890977',
          duty: '主要职责内容，balabalbalbalbalbablablab'
        },
        {
          id: 1234123,
          name: '王小虎',
          concatNum: '18899890977',
          duty: '主要职责内容，balabalbalbalbalbablablab'
        },
        {
          id: 1234123,
          name: '王小虎',
          concatNum: '18899890977',
          duty: '主要职责内容，balabalbalbalbalbablablab'
        },
        {
          id: 1234123,
          name: '王小虎',
          concatNum: '18899890977',
          duty: '主要职责内容，balabalbalbalbalbablablab'
        },
        {
          id: 1234123,
          name: '王小虎',
          concatNum: '18899890977',
          duty: '主要职责内容，balabalbalbalbalbablablab'
        },
        {
          id: 1234123,
          name: '王小虎',
          concatNum: '18899890977',
          duty: '主要职责内容，balabalbalbalbalbablablab'
        },
        {
          id: 1234123,
          name: '王小虎',
          concatNum: '18899890977',
          duty: '主要职责内容，balabalbalbalbalbablablab'
        },
        {
          id: 1234123,
          name: '王小虎',
          concatNum: '18899890977',
          duty: '主要职责内容，balabalbalbalbalbablablab'
        }
      ],
      workerData: [
        {
          id: 1234123,
          name: '王小虎',
          concatNum: '18899890977',
          duty: '主要职责内容，balabalbalbalbalbablablab'
        },
        {
          id: 1234123,
          name: '王小虎',
          concatNum: '18899890977',
          duty: '主要职责内容，balabalbalbalbalbablablab'
        },
        {
          id: 1234123,
          name: '王小虎',
          concatNum: '18899890977',
          duty: '主要职责内容，balabalbalbalbalbablablab'
        },
        {
          id: 1234123,
          name: '王小虎',
          concatNum: '18899890977',
          duty: '主要职责内容，balabalbalbalbalbablablab'
        },
        {
          id: 1234123,
          name: '王小虎',
          concatNum: '18899890977',
          duty: '主要职责内容，balabalbalbalbalbablablab'
        },
        {
          id: 1234123,
          name: '王小虎',
          concatNum: '18899890977',
          duty: '主要职责内容，balabalbalbalbalbablablab'
        },
        {
          id: 1234123,
          name: '王小虎',
          concatNum: '18899890977',
          duty: '主要职责内容，balabalbalbalbalbablablab'
        },
        {
          id: 1234123,
          name: '王小虎',
          concatNum: '18899890977',
          duty: '主要职责内容，balabalbalbalbalbablablab'
        },
        {
          id: 1234123,
          name: '王小虎',
          concatNum: '18899890977',
          duty: '主要职责内容，balabalbalbalbalbablablab'
        },
        {
          id: 1234123,
          name: '王小虎',
          concatNum: '18899890977',
          duty: '主要职责内容，balabalbalbalbalbablablab'
        }
      ],
      orgTreeData: {},
      triggerOrgId: '',
      triggerWorkId: '',
      triggerLeaderId: '',
      addOrgData: {
        deptName: '',
        pId: '',
        position: '',
        responsibility: ''
      },
      editOrgData: {
        deptName: '',
        deptId: '',
        position: '',
        responsibility: ''
      }
    }
  },
  created () {
    this.getOrgTree(true)
    this.getWorkTree(true)
    this.getLeaderTree(true)
    this.open()
  },
  mounted () {
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.userInfo
    })
  },
  methods: {
    openLoading () {
      this.pageLoading = true
    },
    closeLoading () {
      this.pageLoading = false
    },
    editLeaderItem (id) {
      console.log(id)
    },
    getOrgTree (created) {
      this.pageLoading = true
      let userId = sessionStorage.getItem('userId')
      getOrgTree(userId).then((res) => {
        if (res.code === 200) {
          this.organizationTree = res.data
          if (created) {
            this.triggerOrgId = res.data[0].deptId
            this.handleNodeClick(this.triggerOrgId)
          }
          this.pageLoading = false
        }
      })
    },
    handleNodeClick (deptId) {
      this.triggerOrgId = deptId
      this.pageLoading = true
      getTreeDept(deptId).then((res) => {
        if (res.code === 200) {
          this.orgTreeData = this.initTreeData(res.data[0])
          this.pageLoading = false
        }
      })
    },
    // 过滤树形结构图数据
    initTreeData (fData) {
      let vm = this
      let newTree = {
        id: fData.deptId,
        name: fData.deptName,
        manager: fData.userName,
        telNum: fData.telephone,
        duty: fData.duty,
        children: []
      }
      if (fData.children) {
        fData.children.forEach((item) => {
          newTree.children.push(vm.initTreeData(item))
        })
      }
      return newTree
    },
    // 添加orgTree的节点
    addTreeData (fid) {
      this.pageLoading = true
      this.addOrgData.pId = fid
      this.$prompt('请输入节点名称', '添加节点', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^.{1,12}$/, // 输入正则
        inputErrorMessage: '节点名称不能为空,且不超过12个字' // 正则验证错误提示
      }).then(({ value }) => {
        this.addOrgData.deptName = value
        addTreeData(this.addOrgData).then((res) => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '节点设置成功'
            })
            this.getOrgTree(true)
          }
        })
      }).catch(() => {
        // after cancel
        this.pageLoading = false
      })
    },
    // 编辑orgTree的节点
    editTreeData (fid) {
      this.pageLoading = true
      this.editOrgData.deptId = fid
      this.$prompt('请修改节点名称', '编辑节点', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^.{1,12}$/, // 输入正则
        inputErrorMessage: '节点名称不能为空,且不超过12个字' // 正则验证错误提示
      }).then(({ value }) => {
        this.editOrgData.deptName = value
        editTreeData(this.editOrgData).then((res) => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '节点设置成功'
            })
            this.getOrgTree(true)
          }
        })
      }).catch(() => {
        // after cancel
        this.pageLoading = false
      })
    },
    // 删除orgTree的节点，包括下属节点
    confirmRemove (id) {
      this.pageLoading = true
      this.$confirm('此操作将永久删除该节点, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = {
          deptId: id
        }
        delTreeData(data).then((res) => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getOrgTree(true)
        })
      }).catch(() => {
        // after cancel
        this.pageLoading = false
      })
    },
    // 获取工作小组的tree
    getWorkTree (created) {
      this.pageLoading = true
      let userId = sessionStorage.getItem('userId')
      getOrgTree(userId).then((res) => {
        if (res.code === 200) {
          this.workTree = res.data
          if (created) {
            this.triggerWorkId = res.data[0].deptId
            // this.handleNodeClick(this.triggerOrgId)
          }
        }
      })
    },
    // 编辑树形结构图中员工的个人信息
    editDeptInfo () {
      editDeptInfo().then((res) => {})
    },
    // 获取领导小组的tree
    getLeaderTree (created) {
      this.pageLoading = true
      let userId = sessionStorage.getItem('userId')
      getLeaderTree(userId).then((res) => {
        if (res.code === 200) {
          this.leaderTree = res.data
          if (created) {
            this.triggerLeaderId = res.data[0].deptId
          }
        }
      })
    }
  },
  components: {
    TreeDiagram,
    BreadCrumb,
    Organigram
  }
}
</script>

<style scoped lang="scss">
  .inner-page-container{
    height: 100%;
    .el-header{
      padding: 0;
    }
    .el-main{
      padding: 0;
    }
  }
  /*  el-tab */
  /deep/.inner-main-container{
    .el-tabs--border-card{
      position: relative;
      border-color: #eeeeee;
    }
    .el-tabs__nav{
      height: 50px;
    }
    .el-tabs__item{
      height: 51px;
      line-height: 50px;
      font-size: 16px;
      color: #777;
      &.is-active{
        color: #409EFF;
        border-top: 2px solid #409EFF;
      }
    }
    .el-tabs__content{
      height: 100%;
      width: 100%;
      padding: 50px 0 0;
      position: absolute;
      top: 0;
      left: 0;
      .el-tab-pane{
        height: 100%;
        .inner-main-content{
          background: #f2f2f2;
          width: 100%;
          height: 100%;
        }
      }
    }
  }

  .inner-page-container{
    .inner-content{
      width: 100%;
      height: 100%;
      padding: 29px 22px;
      background: #fff;
      .container-box{
        width: 100%;
        height: 100%;
        .btn-p{
          height: 36px;
          line-height: 36px;
          &>a{
            float: right;
            width: 83px;
            height: 36px;
            color: #fff;
            font-size: 16px;
            text-align: center;
            margin-left: 28px;
            i{
              margin-right: 8px;
              display: inline-block;
              width: 15px;
              height: 36px;
              vertical-align: top;
            }
          }
          .import-btn{
            background: #e6a23c;
            i{
              background-size: 15px 13px;
              background: url("../../assets/img/import-icon.png") no-repeat center;
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
        .el-table{
          margin-top: 25px;
        }
        .pages{
          margin-top: 28px;
          text-align: right;
        }
      }
    }
  }
  .inner-main-content{
    width: 100%;
    height: 100%;
  }

</style>
