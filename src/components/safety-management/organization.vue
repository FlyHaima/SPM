<template>
  <el-container class="inner-page-container" v-loading="pageLoading">
    <el-header class="inner-header">
      <bread-crumb :breadList="breadcrumb">
      </bread-crumb>
    </el-header>
    <el-main class="inner-main-container">
      <el-tabs type="border-card" class="height-100" v-model="activeName">
        <el-tab-pane name="tab_a">
          <span slot="label">组织机构</span>
          <el-container class="inner-main-content">
            <el-aside class="inner-aside" width="408px">
              <tree-diagram :tree-data="organizationTree" :tree-name="'组织机构'" :has-upload="true" :show-btns="true"
                            @open-loading="openLoading"
                            @close-loading="closeLoading"
                            @handleNodeClick="handleNodeClick"
                            @openAppendBox="addTreeData"
                            @editTreeData="editTreeData"
                            @confirmRemove="confirmRemove">
              </tree-diagram>
            </el-aside>

            <el-main class="inner-content">
              <div class="container-box">
                <organigram :organigram-data="orgTreeData"
                            :selector="userSelector"
                            :loading="dialogLoading"
                            @submitForm="editDeptInfo">
                </organigram>
              </div>
            </el-main>
          </el-container>
        </el-tab-pane>

        <el-tab-pane name="tab_b">
          <span slot="label">领导小组</span>
          <el-container class="inner-main-content">
            <el-aside class="inner-aside" width="408px">
              <tree-diagram :tree-data="leaderTree" :tree-name="'领导小组'" :has-upload="false"
                            @open-loading="openLoading"
                            @close-loading="closeLoading"
                            @handleNodeClick="handleNodeClick">
              </tree-diagram>
            </el-aside>

            <el-main class="inner-content">
              <div class="container-box">
                <p class="btn-p">
                  <a class="export-btn" target="_blank" :href="`${baseUrl}/leadUser/exportGroup`"><i class></i>导出</a>
                  <el-upload accept=".xls" class="import-btn"
                            :action="`${baseUrl}/leadUser/importGroup`"
                            :data="uploadData"
                            :before-upload="handleBeforeUpload"
                            :on-success="handleSuccess"
                            :on-error="handleError"
                            :file-list="fileList"
                            :show-file-list="false">
                    <a><i></i>导入</a>
                  </el-upload>
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
                    <template slot-scope="scope">{{ scope.row.userName }}</template>
                  </el-table-column>
                  <el-table-column
                    label="联系方式"
                    width="160"
                    align="center">
                    <template slot-scope="scope">{{ scope.row.telephone }}</template>
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
                      <el-button type="text" @click="openUpdateBox(scope.row.id)">编辑</el-button>
                    </template>
                  </el-table-column>
                </el-table>

                <div class="pages">
                  <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="leaderPageData.total"
                    :page-size="leaderPageData.pageSize"
                    :current-page.sync="leaderPageData.currentPageNo"
                    @current-change="handleLeaderPage">
                  </el-pagination>
                </div>
              </div>
            </el-main>
          </el-container>
        </el-tab-pane>

        <el-tab-pane name="tab_c">
          <span slot="label">工作小组</span>
          <el-container class="inner-main-content">
            <el-aside class="inner-aside" width="408px">
              <tree-diagram :tree-data="workTree" :tree-name="'工作小组'" :has-upload="false"
                            @open-loading="openLoading"
                            @close-loading="closeLoading"
                            @handleNodeClick="handleNodeClick">
              </tree-diagram>
            </el-aside>

            <el-main class="inner-content">
              <div class="container-box">
                <p class="btn-p">
                  <a class="export-btn" target="_blank" :href="`${baseUrl}/workUser/exportGroup`"><i class></i>导出</a>
                  <el-upload accept=".xls" class="import-btn"
                            :action="`${baseUrl}/workUser/importGroup`"
                            :data="uploadData"
                            :before-upload="handleBeforeUpload"
                            :on-success="handleSuccess"
                            :on-error="handleError"
                            :file-list="fileList"
                            :show-file-list="false">
                    <a><i></i>导入</a>
                  </el-upload>
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
                    <template slot-scope="scope">{{ scope.row.userName }}</template>
                  </el-table-column>
                  <el-table-column
                    label="联系方式"
                    width="160"
                    align="center">
                    <template slot-scope="scope">{{ scope.row.telephone }}</template>
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
                      <el-button type="text" @click="openUpdateBox(scope.row.id)">编辑</el-button>
                    </template>
                  </el-table-column>
                </el-table>

                <div class="pages">
                  <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="workerPageData.total"
                    :page-size="workerPageData.pageSize"
                    :current-page.sync="workerPageData.currentPageNo"
                    @current-change="handleWorkerPage">
                  </el-pagination>
                </div>
              </div>
            </el-main>
          </el-container>
        </el-tab-pane>
      </el-tabs>
    </el-main>

    <el-dialog title="主要职责" :visible.sync="dutyVisible" width="30%">
      <el-form ref="dutyForm" label-width="80px">
        <el-form-item label="主要职责">
          <el-input v-model="dutyPostData" type="textarea"
                    :rows="3"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dutyVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="updateGroup()" size="small" v-show="!updating">确 定</el-button>
        <el-button type="primary" size="small" disabled v-show="updating"><i class="el-icon-loading"></i>上传中</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import BreadCrumb from '../Breadcrumb/Breadcrumb'
import TreeDiagram from '../tree-diagram/treeDiagram'
import Organigram from '../organigram/organigram'
import {getOrgTree,
  getTreeDept,
  addTreeData,
  editTreeData,
  delTreeData,
  editDeptInfo,
  getLeaderTree,
  getLeaderTabel,
  getWorkerTabel,
  updateGroup
} from '@/api/organization'
import {mapState} from 'vuex'
import base from '@/api/baseUrl'

export default {
  name: 'organization',
  data () {
    return {
      breadcrumb: ['安全基础管理', '组织机构'],
      pageLoading: false,
      organizationTree: [],
      leaderTree: [],
      workTree: [],
      leaderData: [],
      workerData: [],
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
      },
      userSelector: null, // 右键人员选项
      leaderPageData: {
        total: 0,
        pageSize: 10,
        currentPageNo: 1
      },
      workerPageData: {
        total: 0,
        pageSize: 10,
        currentPageNo: 1
      },
      activeName: 'tab_a',
      dutyVisible: false,
      dutyPostData: '',
      dutyPostId: '',
      updating: false,
      dialogLoading: false,
      leaderPosition: null,
      baseUrl: '',
      fileList: [],
      uploadData: {
        token: ''
      }
    }
  },
  created () {
    this.uploadData.token = sessionStorage.getItem('TOKEN_KEY')
    this.baseUrl = base.baseUrl
    this.getOrgTree(true)
    this.getLeaderTree(true)
  },
  mounted () {
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.userInfo
    })
  },
  methods: {
    handleBeforeUpload (file) {
      this.uploading = true
      this.openLoading()
    },
    // 导入成功
    handleSuccess (response, file, fileList) {
      this.$notify.success('导入成功')
      this.closeLoading()
    },
    // 导入失败
    handleError (file, fileList) {
    },
    openLoading () {
      this.pageLoading = true
    },
    closeLoading () {
      this.pageLoading = false
    },
    // 获取组织机构 & 工作小组的tree
    getOrgTree (created) {
      this.pageLoading = true
      let userId = sessionStorage.getItem('userId')
      getOrgTree(userId).then((res) => {
        if (res.code === 200) {
          this.organizationTree = res.data[0]
          this.workTree = res.data[0]
          this.userSelector = res.data[1]
          if (created) {
            this.triggerOrgId = this.organizationTree[0].deptId
            this.triggerWorkId = this.workTree[0].deptId
            this.handleNodeClick(this.triggerOrgId)
            this.getWorkerTable()
          }
          this.pageLoading = false
        }
      })
    },
    // 点击orgTree获取右侧树形数据
    handleNodeClick (deptId, position) {
      if (this.activeName === 'tab_a') {
        this.triggerOrgId = deptId
        this.pageLoading = true
        getTreeDept(deptId).then((res) => {
          if (res.code === 200) {
            this.orgTreeData = this.initTreeData(res.data[0])
            this.pageLoading = false
          }
        })
      } else if (this.activeName === 'tab_b') {
        this.leaderPosition = position
        this.triggerLeaderId = deptId
        this.pageLoading = true
        this.getLeaderTable()
      } else if (this.activeName === 'tab_c') {
        this.triggerWorkId = deptId
        this.pageLoading = true
        this.getWorkerTable()
      }
    },
    // 过滤树形结构图数据
    initTreeData (fData) {
      let vm = this
      let newTree = {
        id: fData.deptId,
        name: fData.deptName,
        // manager: fData.userName,
        // telNum: fData.telephone,
        // duty: fData.duty,
        workList: fData.workList,
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
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getOrgTree(true)
          }
        })
      }).catch(() => {
        // after cancel
        this.pageLoading = false
      })
    },
    // 编辑树形结构图中员工的个人信息
    editDeptInfo (data) {
      this.dialogLoading = true
      editDeptInfo(data).then((res) => {
        if (res.code === 200) {
          this.handleNodeClick(this.triggerOrgId)
        }
        this.dialogLoading = false
      })
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
            this.getLeaderTable()
          }
        }
      })
    },
    // 获取领导小组的table
    getLeaderTable () {
      let vm = this
      vm.pageLoading = true
      getLeaderTabel(vm.triggerLeaderId, vm.leaderPosition, vm.leaderPageData.currentPageNo, vm.leaderPageData.pageSize).then((res) => {
        if (res.code === 200) {
          vm.leaderData = res.data
          vm.leaderPageData.total = res.total
        }
        vm.pageLoading = false
      })
    },
    handleLeaderPage (val) {
      this.leaderPageData.currentPageNo = val
      this.getLeaderTable()
    },
    // 获取工作小组的table
    getWorkerTable () {
      let vm = this
      vm.pageLoading = true
      getWorkerTabel(vm.triggerWorkId, vm.workerPageData.currentPageNo, vm.workerPageData.pageSize).then((res) => {
        if (res.code === 200) {
          vm.workerData = res.data
          vm.workerPageData.total = res.total
        }
        vm.pageLoading = false
      })
    },
    handleWorkerPage (val) {
      this.workerPageData.currentPageNo = val
      this.getWorkerTable()
    },
    openUpdateBox (id) {
      this.dutyVisible = true
      this.dutyPostId = id
    },
    updateGroup () {
      this.updating = true
      let data = {
        id: this.dutyPostId,
        duty: this.dutyPostData
      }
      updateGroup(data).then((res) => {
        if (res.code === 200) {
          this.dutyVisible = false
          this.$message({
            type: 'success',
            message: '更新成功'
          })
          if (this.activeName === 'tab_b') {
            this.getLeaderTable()
          } else {
            this.getWorkerTable()
          }
        } else {
          this.$message.error('更新失败')
        }
        this.updating = false
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
          .import-btn,
          .export-btn{
            float: right;
            width: 83px;
            height: 36px;
            color: #fff;
            font-size: 16px;
            text-align: center;
            margin-left: 28px;
            cursor: pointer;
            a{
              color: #fff;
            }
          }
          .import-btn{
            background: #e6a23c;
            i{
              margin-right: 8px;
              display: inline-block;
              width: 15px;
              height: 36px;
              vertical-align: top;
              background-size: 15px 13px;
              background: url("../../assets/img/import-icon.png") no-repeat center;
            }
          }
          .export-btn{
            background: #67c23a;
            i{
              margin-right: 8px;
              display: inline-block;
              width: 15px;
              height: 36px;
              vertical-align: top;
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
