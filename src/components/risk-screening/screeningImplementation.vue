<template>
  <el-container class="inner-page-container" v-loading="pageLoading">
    <el-header class="inner-header">
      <bread-crumb :breadList="breadcrumb">
      </bread-crumb>
    </el-header>
    <el-main class="inner-main-container">
      <el-tabs @tab-click="tabClickHandle" type="border-card" class="height-100">
        <el-tab-pane>
          <span slot="label">基础管理类隐患排查清单</span>
          <el-container class="inner-main-content">
            <el-aside class="inner-aside" width="408px">
              <tree-list
                :menu-name="'计划清单'"
                :list-data = "listMenuData"
                searchVisible
                @menu-click-handle="menuClickHandle"
                @eidt-menu-handle="eidtMenuHandle"
                @del-menu-handle="delMenuHandle"
              ></tree-list>
            </el-aside>

            <el-main class="inner-content">
              <div class="container-box">
                <div class="content-tools">
                  <div class="tools-left">
                    <el-form
                      size="medium"
                      :inline="true"
                      :model="formInline"
                      class="demo-form-inline">
                      <el-form-item label="检查名称">
                        <el-input v-model="formInline.user" placeholder="请输入检查名称"></el-input>
                      </el-form-item>
                      <el-form-item label="检查日期">
                        <el-date-picker
                          v-model="value1"
                          type="daterange"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期">
                        </el-date-picker>
                      </el-form-item>
                      <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
                      </el-form-item>
                    </el-form>
                  </div>
                  <div class="tools-right">
                    <el-button
                      type="success"
                      size="medium"
                      icon="el-icon-download"
                      @click="exportEexcel">
                      导出</el-button>
                  </div>
                </div>
                <el-table
                  :data="tableData"
                  border
                  style="width: 100%"
                  align="center">
                  <el-table-column
                    prop=" "
                    label="检查名称"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop=" "
                    label="检查人员"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop=" "
                    label="检查时间"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop=" "
                    label="检查结果"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop=" "
                    label="附件"
                    align="center">
                  </el-table-column>
                </el-table>
              </div>
            </el-main>
          </el-container>
        </el-tab-pane>

        <el-tab-pane>
          <span slot="label">生产现场类隐患排查清单</span>
          <el-container class="inner-main-content">
            <el-aside class="inner-aside" width="408px">
              <tree-read-only
                :tree-name="'风险单元'"
                :tree-data="organizationTree"
                searchVisible
                shrinkVisible
                @tree-click-handle="treeClickHandle"
                @close-loading="closeLoading">
              </tree-read-only>
            </el-aside>

            <el-main class="inner-content">
              <div class="container-box">
                <div class="content-tools">
                  <div class="tools-left">
                    <el-form
                      size="medium"
                      :inline="true"
                      :model="formInline"
                      class="demo-form-inline">
                      <el-form-item label="检查名称">
                        <el-input v-model="formInline.user" placeholder="请输入检查名称"></el-input>
                      </el-form-item>
                      <el-form-item label="检查日期">
                        <el-date-picker
                          v-model="value1"
                          type="daterange"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期">
                        </el-date-picker>
                      </el-form-item>
                      <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
                      </el-form-item>
                    </el-form>
                  </div>
                  <div class="tools-right">
                    <el-button
                      type="success"
                      size="medium"
                      icon="el-icon-download"
                      @click="exportEexcel">
                      导出</el-button>
                  </div>
                </div>

                <el-table
                  :data="tableData"
                  border
                  style="width: 100%"
                  align="center">
                  <el-table-column
                    prop=" "
                    label="检查名称"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop=" "
                    label="检查人员"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop=" "
                    label="检查时间"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop=" "
                    label="检查结果"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop=" "
                    label="附件"
                    align="center">
                  </el-table-column>
                </el-table>
              </div>
            </el-main>
          </el-container>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>
<script>
import BreadCrumb from '@/components/Breadcrumb/Breadcrumb'
import TreeReadOnly from '@/components/tree-diagram/treeReadOnly'
import TreeList from '@/components/tree-diagram/treeList'
import axios from '@/api/axios'
export default {
  name: 'screeningImplementation',
  data () {
    return {
      breadcrumb: ['风险辨识评估', '风险划分'],
      pageLoading: false,
      isOrgTree: true, // 是否是组织结构树
      organizationTree: [], // 组织机构
      tableData: [],
      listMenuData: [
        {
          id: '1',
          name: '黑龙江阿斯顿建材集团配电室',
          type: '1'
        },
        {
          id: '2',
          name: '黑龙江阿斯顿建材集团配电室',
          type: '2'
        },
        {
          id: '3',
          name: '计划',
          type: '3'
        }
      ], // 计划清单列表数据
      editOrgData: {
        deptName: '',
        deptId: ''
        // position: '',
        // responsibility: ''
      }, // 编辑机构数据
      formInline: {}
    }
  },
  components: {
    BreadCrumb, // 面包屑
    TreeList, // 计划清单菜单
    TreeReadOnly // 风险单元树菜单
  },
  created () {
    this.fetchOrgTreeData()
  },
  methods: {
    // tab切换处理
    tabClickHandle (tab, event) {
      console.log(tab.index)
      if (tab.index === 0) {
        this.isOrgTree = true
      } else {
        this.isOrgTree = false
      }
    },
    // 树节点，点击功能
    treeClickHandle () {

    },
    submitForm () {
      console.log(this.listDate)
    },
    // 获取组织机构树数据
    fetchOrgTreeData () {
      axios
        .get('riskia/getRiskTree')
        .then((res) => {
          if (res.data.code === 200) {
            this.organizationTree = res.data.data
          }
        })
    },
    // 编辑组织机构树
    editOrgTreeData (fid) {
      let vm = this
      vm.editOrgData.deptId = fid
      vm.$prompt('请修改节点名称', '编辑节点', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^.{1,12}$/, // 输入正则
        inputErrorMessage: '节点名称不能为空,且不超过12个字' // 正则验证错误提示
      }).then(({ value }) => {
        vm.editOrgData.deptName = value
        axios
          .post('dept/updateDept', vm.editOrgData)
          .then((res) => {
            if (res.data.code === 200) {
              vm.$notify.success('编辑成功')
              vm.fetchOrgTreeData()
            } else {
              vm.$message({
                message: res.data.message,
                type: 'warning'
              })
            }
          })
      }).catch(() => {
        // after cancel
        this.pageLoading = false
      })
      // axios
      //   .post('dept/updateDept')
      //   .then((res) => {
      //     if (res.data.code === 200) {
      //       vm.$notify.success('修改成功')
      //       vm.fetchOrgTreeData()
      //     } else {
      //       vm.$message({
      //         message: res.data.message,
      //         type: 'warning'
      //       })
      //     }
      //   })
    },
    // 创建清单
    addMenuHandle () {
      this.openAppendBox()
    },
    openAppendBox () {
      this.$prompt('请输入清单名称', '添加清单', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        // 添加ajax
        this.$message({
          type: 'success',
          message: '清单设置成功'
        })
      }).catch(() => {
        // after cancel, do nothing
      })
    },
    // 点击菜单项
    menuClickHandle (item) {
      console.log(item)
    },
    // 编辑菜单项
    eidtMenuHandle (item) {
      // console.log('edit')
    },
    // 删除菜单项
    delMenuHandle (item) {
      // console.log('del')
    },
    closeLoading () {
      this.pageLoading = false
    },
    // 导出excel
    exportEexcel () {}
  }
}
</script>

<style lang="scss" scoped>
@import '@/utils/css/style.scss';
</style>
