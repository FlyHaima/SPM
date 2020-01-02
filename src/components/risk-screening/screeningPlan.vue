/* eslint-disable vue/no-dupe-keys */
/* eslint-disable vue/no-dupe-keys */
<template>
  <el-container class="inner-page-container" v-loading="pageLoading">
    <el-header class="inner-header">
      <bread-crumb :breadList="breadcrumb">
      </bread-crumb>
    </el-header>
    <el-main class="inner-main-container">
      <el-tabs
        v-model="type"
        @tab-click="tabClickHandle"
        type="border-card"
        class="height-100">
        <el-tab-pane label="基础管理类隐患排查清单" name="基础类排查清单">
          <span slot="label">基础管理类隐患排查清单</span>
          <el-container class="inner-main-content">
            <el-aside class="inner-aside" width="408px">
              <tree-list
                v-if="listMenuData.length > 0"
                :menu-name="'计划清单'"
                :list-data = "listMenuData"
                showEditOrgBtn
                showAddMenuBtn
                showOperation
                @add-menu-handle="addMenuHandle"
                @eidit-org-handle="eiditOrganizationHandle"
                @menu-click-handle="menuClickHandle"
                @eidt-menu-handle="eidtMenuHandle"
                @del-menu-handle="delMenuHandle"
              ></tree-list>
            </el-aside>

            <el-main class="inner-content">
              <div class="container-box">
                <div class="content-tools">
                  <div class="tools-left">
                    <el-button
                      type=""
                      size="medium"
                      icon="el-icon-menu"
                      @click.prevent="handleSort()">
                      排查种类</el-button>
                  </div>
                  <div class="tools-right">
                    <el-button
                      type="primary"
                      size="medium"
                      icon="el-icon-s-promotion"
                      @click="handleSendMsg">
                      计划发布</el-button>
                    <el-button
                      type="primary"
                      size="medium"
                      icon="el-icon-plus"
                      @click="handleAdd">
                      添加</el-button>
                    <el-button
                      type="warning"
                      size="medium"
                      icon="el-icon-upload2">
                      导入</el-button>
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
                    type="index"
                    label="序号"
                    width="50"
                    :index="indexMethod">
                  </el-table-column>
                  <el-table-column
                    prop="investTarget"
                    label="排查目标"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop="investContent"
                    label="排查内容与排查标准"
                    header-align="center">
                  </el-table-column>
                  <el-table-column
                    prop="inspectionBasic"
                    label="检查依据"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    label="排查频率"
                    header-align="center"
                    width="250px">
                    <template slot-scope="scope">
                      <el-select
                        @change="selChange($event, scope.row, tableData)"
                        v-model="scope.row.investigation"
                        placeholder="请选择排查频率">
                        <el-option
                          v-for="item in investigationOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                          :disabled="item.disabled">
                        </el-option>
                      </el-select>
                    </template>
                  </el-table-column>

                  <el-table-column
                    label="推送方式"
                    align="center">
                    <el-table-column
                      align="center"
                      width="220px">
                      <template slot="header" slot-scope="scope">
                        <el-checkbox v-model="checkedAuto" @change="checkChangeHandle">自动推送</el-checkbox>
                        <!-- <el-checkbox-group
                          v-model="checkList"
                          @change="checkChangeHandle"
                          >
                          <el-checkbox label="自动推送"></el-checkbox>
                          <el-checkbox label="手动推送"></el-checkbox>
                        </el-checkbox-group> -->
                      </template>
                      <template slot-scope="scope">
                        <el-radio-group
                          @change="checkPushChangeHandle"
                          :disabled="scope.row.isPushDisabled"
                          v-model="scope.row.autoPush"
                          class="raido-group-custom" >
                          <el-radio-button label="自动"></el-radio-button>
                          <el-radio-button label="手动"></el-radio-button>
                        </el-radio-group>
                      </template>
                    </el-table-column>
                  </el-table-column>
                  <el-table-column
                    label="操作"
                    align="center"
                    width="100px">
                    <template slot-scope="scope">
                      <a
                        href="javascript:;"
                        class="color-danger talbe-links-del"
                        @click.prevent="delRowHandle(scope.row)">删除
                      </a>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-main>
          </el-container>
        </el-tab-pane>

        <el-tab-pane label="生产现场类隐患排查清单" name="现场类排查清单">
          <span slot="label">生产现场类隐患排查清单</span>
          <el-container class="inner-main-content">
            <el-aside class="inner-aside" width="408px">
              <tree-read-only
                :tree-name="'风险单元'"
                :tree-data="riskUnitTree"
                editOrgVisible
                @eidit-org="eiditOrganizationHandle"
                @tree-click-handle="treeClickHandle"
                @close-loading="closeLoading">
              </tree-read-only>
            </el-aside>

            <el-main class="inner-content">
              <div class="container-box">
                <div class="content-tools">
                  <div class="tools-left">
                    <!-- <el-button
                      type="primary"
                      size="medium"
                      icon="el-icon-plus"
                      @click="handleAddDanger">
                      随机隐患添加</el-button> -->
                    <el-button
                      type=""
                      size="medium"
                      icon="el-icon-menu"
                      @click.prevent="handleSort()">
                      排查种类</el-button>
                  </div>
                  <div class="tools-right">
                    <el-button
                      type="primary"
                      size="medium"
                      icon="el-icon-s-promotion"
                      @click="handleSendMsg">
                      计划发布</el-button>
                      <el-button
                      type="success"
                      size="medium"
                      icon="el-icon-download"
                      @click="exportEexcel">
                      导出</el-button>
                  </div>
                </div>
                <el-table
                  :data="tableDataProduct"
                  border
                  style="width: 100%"
                  align="center">
                  <el-table-column
                    prop=" "
                    label="序号"
                    width="50">
                  </el-table-column>
                  <el-table-column
                    label="单元"
                    header-align="center">
                    <el-table-column
                      label="一级"
                      align="center">
                    </el-table-column>
                    <el-table-column
                      label="二级"
                      align="center">
                    </el-table-column>
                    <el-table-column
                      label="三级"
                      align="center">
                    </el-table-column>
                  </el-table-column>
                  <el-table-column
                    prop=" "
                    label="检查内容"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop=" "
                    label="是否符合"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop=" "
                    label="存在问题"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop=" "
                    label="整改措施"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    label="排查频率"
                    header-align="center"
                    width="250px">
                    <template slot-scope="scope">
                      <!-- <i v-show="scope.row" class="el-icon-bottom" title="一键填满"></i> -->
                      <el-select
                        @change="selChange($event, scope.row, tableDataProduct)"
                        v-model="scope.row.investigation"
                        placeholder="请选择排查频率">
                        <el-option
                          v-for="item in investigationOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                          :disabled="item.disabled">
                        </el-option>
                      </el-select>
                    </template>
                  </el-table-column>

                  <el-table-column
                    label="推送方式"
                    align="center">
                    <el-table-column
                      align="center"
                      width="220px">
                      <template slot="header" slot-scope="scope">
                        <el-checkbox-group
                          v-model="checkList"
                          >
                          <el-checkbox @change="checkAutoChangeHandle" label="自动推送"></el-checkbox>
                          <el-checkbox @change="checkManualChangeHandle" label="手动推送"></el-checkbox>
                        </el-checkbox-group>
                      </template>
                      <template slot-scope="scope">
                        <el-radio-group
                          @change="checkPushChangeHandle"
                          :disabled="scope.row.isPushDisabled"
                          v-model="scope.row.autoPush"
                          class="raido-group-custom" >
                          <el-radio-button label="自动"></el-radio-button>
                          <el-radio-button label="手动"></el-radio-button>
                        </el-radio-group>
                      </template>
                    </el-table-column>
                  </el-table-column>
                  <el-table-column
                    label="操作"
                    align="center"
                    width="100px">
                    <template slot-scope="scope">
                      <a
                        href="javascript:;"
                        class="color-danger talbe-links-del"
                        @click.prevent="delRowHandle(scope.row)">删除
                      </a>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-main>
          </el-container>
        </el-tab-pane>
      </el-tabs>
    </el-main>
    <el-dialog
      title="提示"
      :visible.sync="dialogTipsVisible"
      width="30%">
      <div class="dialog-content">
        <div class="dialog-tips-content" v-if="sendPlanSwitch">
          <i class="el-icon-circle-check dialog-tips-icon"></i>
          <div class="dialog-tips-text">确定发布清单任务计划么？</div>
        </div>
        <template v-else>
          <div class="dialog-tips-content" >
            <i class="el-icon-warning dialog-tips-icon"></i>
            <div class="dialog-tips-text">当前检查清单中存在手动推送的任务，请为手动推送的隐患任务设置<span class="color-primary">推送时间</span></div>
          </div>
          <div
            v-for="(item,index) in listDate"
            :key="index"
            ref="dateColumn"
            class="data-colum"
          >
            <span class="data-colum-label">推送时间{{index + 1}}：</span>
            <el-date-picker
              v-model="item.value"
              type="datetime"
              placeholder="选择日期时间"
              @change="changeDate">
            </el-date-picker>
            <i @click="addDateHandle" class="el-icon-circle-plus-outline button-add-time"></i>
            <i @click="delDateHandle" class="el-icon-remove-outline button-add-time"></i>
          </div>
        </template>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          size="small"
          @click="savePlanHandle()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="编辑机构"
      :visible.sync="dialogOrganizationVisible"
      width="30%">
      <div style="height: 450px">
        <template
          v-if="isOrgTree"
        >
          <tree-organization
            :tree-name="'组织机构'"
            :tree-data= "organizationTree"
            editVisible
            @editTreeData="editOrgTreeData"
          ></tree-organization>
        </template>
        <template v-else>
          <tree-organization
            :tree-name="'组织机构'"
            :tree-data= "riskUnitTree"
            editVisible
            @editTreeData="editOrgTreeData"
          ></tree-organization>
        </template>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          size="small"
          @click="submitForm()">确 定</el-button>
        <el-button
          size="small"
          @click="dialogOrganizationVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <dialog-add
      :dialogVisible = "dialogAddVisible"
      :planId = "currentPlanId"
      @on-dialog-change = "changeAddDialog"
      @reload = "fetchTableData"
    ></dialog-add>
    <dialog-add-danger
      :dialogVisible = "dialogAddDangerVisible"
      @on-dialog-change = "changeAddDangerDialog"
    ></dialog-add-danger>
    <dialog-sort
      :dialogVisible = "dialogSortVisible"
      :planId = "currentPlanId"
      @on-dialog-change = "changeSortDialog"
      @reload = "fetchInvestigationOptions"
    ></dialog-sort>
  </el-container>
</template>
<script>
// import qs from 'qs'
import BreadCrumb from '@/components/Breadcrumb/Breadcrumb'
import TreeReadOnly from '@/components/tree-diagram/treeReadOnly'
import TreeList from '@/components/tree-diagram/treeList'
import TreeOrganization from '@/components/tree-diagram/treeOrganization'
import axios from '@/api/axios'
import DialogSort from '@/components/risk-screening/screening-plan/dialogSort'
import DialogAdd from '@/components/risk-screening/screening-plan/addDialog'
import DialogAddDanger from '@/components/risk-screening/screening-plan/addDangerDialog'
export default {
  name: 'screeningPlan',
  data () {
    return {
      breadcrumb: ['风险辨识评估', '风险划分'],
      pageLoading: false,
      dialogTipsVisible: false, // 添加弹框显示开关
      dialogAddVisible: false, // 添加弹框显示开关
      dialogAddDangerVisible: false, // 添加随机隐患弹框开关
      dialogOrganizationVisible: false, // 组织机构弹框显示开关
      dialogSortVisible: false, // 排查种类弹框显示开关
      isOrgTree: true, // 是否是组织结构树
      organizationTree: [], // 组织机构
      riskUnitTree: [], // 风险单元机构树
      tableData: [], // 基础类清单列表数据
      initTableData: [], // 初始化基础类清单列表数据
      tableDataProduct: [], // 生产类清单列表数据
      listMenuData: [], // 计划清单列表数据
      currentMenuTab: '', // 计划清单默认选中项
      addListMenuForm: {
        planName: '',
        planId: ''
      }, // 添加清单菜单项的表单
      editOrgData: {
        invDeptName: '',
        invDeptId: ''
      }, // 编辑机构数据的表单
      investigationOptions: [], // 排查频率选项
      isFillSwitch: false, // 一键填充功能开关
      checkList: [], // 筛选复选框的值
      listDate: [
        {
          value: ''
        }
      ],
      currentPlanId: '', // 当前清单项的id
      type: '基础类排查清单', // tab切换类型
      sendPlanSwitch: true, // 计划发布开关
      checkedAuto: null
    }
  },
  components: {
    TreeReadOnly,
    BreadCrumb, // 面包屑
    TreeList, // 计划清单菜单
    TreeOrganization, // 组织机构树菜单
    DialogSort, // 排查种类弹框
    DialogAdd, // 添加计划弹框
    DialogAddDanger // 添加随机隐患弹框
  },
  mounted () {
    this.initPage()
  },
  methods: {
    // 初始化页面数据
    initPage () {
      this.fetchTableData()
      this.fetchListMenuData()
      this.fetchOrgTreeData()
      this.fetchUnitTreeData()
      // this.fetchInvestigationOptions()
    },
    // 获取排查隐患清单列表
    fetchTableData () {
      axios
        .get('basticHidden/getBasticHiddenList', {
          planId: this.currentPlanId
        })
        .then((res) => {
          if (res.data.code === 200) {
            this.initTableData = res.data.data
            this.initTableData.forEach(item => {
              if (item.autoPush === null) {
                item.isPushDisabled = true
              } else {
                item.isPushDisabled = false
                this.checkedAuto = true
              }
            })
            console.log(this.initTableData)
            this.tableData = this.initTableData
          }
        })
    },
    // 获取生产现场类隐患排查清单
    fetchTableDataProduct () {
      axios
        .get('productHidden/getProductHiddenList', {
          risk_id: this.currentPlanId
        })
        .then((res) => {
          if (res.data.code === 200) {
            this.tableDataProduct = res.data.data
            // this.initTableData.forEach(item => {
            //   if (item.autoPush === null) {
            //     item.isPushDisabled = true
            //   } else {
            //     item.isPushDisabled = false
            //     this.checkedAuto = true
            //   }
            // })
            // console.log(this.initTableData)
            // this.tableData = this.initTableData
          }
        })
    },
    // 获取排查频率
    fetchInvestigationOptions () {
      axios
        .get('investType/getInvTypeList', {
          planId: this.currentPlanId,
          type: this.type
        })
        .then((res) => {
          if (res.data.code === 200) {
            this.investigationOptions = res.data.data
          }
        })
    },
    // tab切换处理
    tabClickHandle (tab, event) {
      this.fetchListMenuData()
      if (tab.index === 0) {
        this.isOrgTree = true
      } else {
        this.isOrgTree = false
      }
    },
    // 树节点，点击功能
    treeClickHandle (item) {
      this.currentPlanId = item.riskId
      this.fetchTableDataProduct()
    },
    submitForm () {
    },
    // 编辑机构
    eiditOrganizationHandle () {
      this.dialogOrganizationVisible = true
    },
    // 获取组织机构树数据
    fetchOrgTreeData () {
      // let userId = sessionStorage.getItem('userId')
      axios
        .get('basticHidden/getDeptList')
        .then((res) => {
          if (res.data.code === 200) {
            this.organizationTree = res.data.data
          }
        })
    },
    // 获取风险单元树的数据
    fetchUnitTreeData () {
      axios
        .get('riskia/getRiskTree')
        .then((res) => {
          if (res.data.code === 200) {
            this.riskUnitTree = res.data.data
          }
        })
    },
    // 编辑组织机构树
    editOrgTreeData (fid) {
      let vm = this
      vm.editOrgData.invDeptId = fid
      vm.$prompt('请修改节点名称', '编辑节点', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^.{1,12}$/, // 输入正则
        inputErrorMessage: '节点名称不能为空,且不超过12个字' // 正则验证错误提示
      }).then(({ value }) => {
        vm.editOrgData.invDeptName = value
        axios
          .post('basticHidden/updateDept', vm.editOrgData)
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
    // 获取清单数据
    fetchListMenuData () {
      axios
        .get('schedule/getScheduleList')
        .then((res) => {
          if (res.data.code === 200) {
            this.listMenuData = res.data.data
            this.currentPlanId = this.listMenuData[0].planId
            this.fetchInvestigationOptions()
            this.fetchTableData()
          }
        })
    },
    // 创建清单
    addMenuHandle () {
      let vm = this
      // this.openAppendBox()
      vm.$prompt('请输入清单名称', '添加清单', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^.{1,12}$/, // 输入正则
        inputErrorMessage: '清单名称不能为空,且不超过12个字' // 正则验证错误提示
      }).then(({ value }) => {
        vm.addListMenuForm.planName = value
        vm.addListMenuForm.planId = vm.currentPlanId
        axios
          .post('schedule/addSchedule', vm.addListMenuForm)
          .then((res) => {
            if (res.data.code === 200) {
              vm.$notify.success('添加清单成功')
              vm.fetchListMenuData()
            }
          })
          .finally(() => {
          })
      }).catch(() => {
        // after cancel
        vm.pageLoading = false
      })
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
      this.currentPlanId = item.planId
      this.fetchTableData()
    },
    // 编辑菜单项
    eidtMenuHandle (item) {
      let vm = this
      this.addListMenuForm.planId = item.planId
      // this.openAppendBox()
      vm.$prompt('请输入修改的清单名称', '编辑清单', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^.{1,12}$/, // 输入正则
        inputErrorMessage: '清单名称不能为空,且不超过12个字' // 正则验证错误提示
      }).then(({ value }) => {
        vm.addListMenuForm.planName = value
        axios
          .post('schedule/updateSchedule', vm.addListMenuForm)
          .then((res) => {
            if (res.data.code === 200) {
              vm.$notify.success('修改清单成功')
              vm.fetchListMenuData()
            }
          })
          .finally(() => {
          })
      }).catch(() => {
        // after cancel
        vm.pageLoading = false
      })
    },
    // 删除菜单项
    delMenuHandle (item) {
      this.$confirm('是否删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios
          .delete('schedule/delSchedule', {
            planId: item.planId
          })
          .then((res) => {
            if (res.data.code === 200) {
              this.$notify.success('删除成功')
              this.fetchListMenuData()
            }
          })
          .finally(() => {
          })
      }).catch(() => {
      })
    },
    closeLoading () {
      this.pageLoading = false
    },
    // 排查种类
    handleSort () {
      this.dialogSortVisible = true
    },
    // 弹框取消操作改变现实状态
    changeSortDialog (val) {
      this.dialogSortVisible = val
    },
    changeAddDialog (val) {
      this.dialogAddVisible = val
    },
    changeAddDangerDialog (val) {
      this.dialogAddDangerVisible = val
    },
    // 计划发布
    handleSendMsg () {
      let vm = this
      vm.dialogTipsVisible = true
      vm.tableData.forEach(item => {
        if (item.autoPush === '手动') {
          vm.sendPlanSwitch = false
        } else {
          // vm.sendPlanSwitch = false
        }
      })
    },
    filterListDate (data) {
      let newListDate = []
      data.forEach(item => {
        newListDate.push(item.value)
      })
      return newListDate
    },
    savePlanHandle () {
      let vm = this
      vm.listDate = vm.filterListDate(vm.listDate)
      let sendData = {
        // spmBasicHiddenList: vm.tableData,
        // checkTime: vm.listDate
        list: [{
          spmBasicHiddenList: vm.tableData,
          checkTime: vm.listDate
        }]
      }
      vm.submitting = true
      axios
        .post('basticHidden/planRelease', sendData)
        .then((res) => {
          if (res.data.code === 200) {
            vm.$notify.success('清单任务计划发布完成')
            vm.dialogTipsVisible = false
            vm.fetchSortTableData()
          } else {
            vm.$message({
              message: res.data.message,
              type: 'warning'
            })
          }
        })
        .finally(() => {
          vm.submitting = false
          vm.dialogTipsVisible = false
        })
    },
    // 添加计划数据项
    handleAdd () {
      this.dialogAddVisible = true
    },
    // 添加随机隐患
    handleAddDanger () {
      this.dialogAddDangerVisible = true
    },
    // 删除事件
    delRowHandle (row) {
      console.log(row)
      let sendData = {
        id: row.basicId
      }
      axios
        .delete('basticHidden/delBasicHidden', sendData)
        .then((res) => {
          if (res.data.code === 200) {
            this.$notify.success('删除成功')
            this.fetchTableData()
          }
        })
        .finally(() => {
        })
    },
    // 导出excel
    exportEexcel () {},
    // 自定义序号
    indexMethod (index) {
      return index + 1
    },
    // 选择排查频率
    selChange (value, row, rows) {
      let vm = this
      console.log(rows)
      // 启用推送按钮
      // row.isPushDisabled = 'true'

      // 查找当前对象
      let obj = {}
      obj = vm.investigationOptions.find((item) => {
        return item.value === value
      })
      // 修改推送方式，选项中包含 ’日常性检查‘ 字符开关状态是自动，否则是手动
      if (obj.label.indexOf('日常性检查') !== -1) {
        row.autoPush = '自动'
      } else {
        row.autoPush = '手动'
      }
      // 一键填充，如果排查频率是1-1-1格式的数据，就可以一键填满，一键填充功能只能在初始时用一次
      if (obj.fill === true) {
        rows.forEach(item => {
          item.investigation = row.investigation
          item.autoPush = row.autoPush
          // item.isPushDisabled = 'true'
        })
        // 启用一键填充功能
        vm.isFillSwitch = true
      }
      // 如果启用了一键填充功能，排查频率下的fill设置false，关闭一键填充功能
      if (vm.isFillSwitch) {
        vm.investigationOptions.forEach(item => {
          item.fill = false
        })
      }
    },
    // 复选框的推送可用状态改变
    checkChangeHandle (val) {
      let vm = this
      console.log(val)
      vm.tableData.forEach(item => {
        if (item.autoPush === '自动') {
          if (val) {
            item.isPushDisabled = true
          } else {
            item.isPushDisabled = false
          }
        }
      })
      console.log(this.tableData)
    },
    // 复选框的自动推送可用状态改变
    checkAutoChangeHandle (val) {
      console.log(val)
      console.log(this.tableData)
      this.tableData.forEach(item => {
        if (item.autoPush === '自动') {
          if (val === false) {
            // 禁用推送按钮
            item.isPushDisabled = true
          } else {
            // 启用推送按钮
            item.isPushDisabled = false
          }
        }
      })
      console.log(this.tableData)
    },
    // 复选框的手动状态可用改变
    checkManualChangeHandle (val) {
      console.log(val)
      console.log(this.tableData)
      this.tableData.forEach(item => {
        if (item.autoPush === '手动') {
          if (val === false) {
            // 禁用推送按钮
            item.isPushDisabled = false
          } else {
            // 启用推送按钮
            item.isPushDisabled = true
          }
        }
      })
    },
    checkPushChangeHandle () {

    },
    changeDate (val) {
      console.log(val)
      this.listDate.forEach(item => {

      })
    },
    addDateHandle () {
      console.log(this.listDate)
      this.listDate.push({
        value: ''
      })
      // this.num.length++
      // alert('c')
      // console.log(this.$refs)
      // this.$refs.dateColumn.
    },
    delDateHandle () {
      if (this.listDate.length > 1) {
        this.listDate.pop()
      }
      // if (this.num.length > 1) {
      //   this.num.length--
      // }
    }
  },
  computed: {
    // checkedAuto: {
    //   get: function () {
    //     // this.tableData.forEach(item => {
    //     //   if (item.autoPush === '自动' && item.isPushDisabled === true) {
    //     //     return true
    //     //   } else {
    //     //     return false
    //     //   }
    //     // })
    //     return ''
    //   },
    //   set: function (value) {
    //     this.tableData.forEach(item => {
    //       if (item.autoPush === '自动' && value === true) {
    //         item.isPushDisabled = true
    //       } else {
    //         item.isPushDisabled = false
    //       }
    //     })
    //     // return value
    //   }
    // }
  },
  watch: {
    // checkedAuto: function (val) {
    //   this.checkChangeHandle(val)
    // }
    // initTableData: {
    //   immediate: true,
    //   handler (val) {
    //     console.log(val)
    //     this.tableData = val
    //   }
    // }
  }
}
</script>

<style lang="scss" scoped>
@import '@/utils/css/style.scss';

/deep/.tree-diagram {
  margin: 0 auto;
  .tree-box{
    background: #f7f9fc;
  }
  .el-tree {
    background: #f7f9fc;
  }
}

.left-menu{
  background: #ffffff;
  position: relative;
  width: 400px;
  height: 100%;
}
.el-form{
  width: 400px;
  margin: 0 auto;
}
/deep/.el-select{
  .el-input__inner{
    border: 0;
    background: transparent;
    height: 30px;
    line-height: 30px;
  }
  .el-input__icon{
    line-height: 30px;
  }
}
/deep/.el-icon-bottom{
  display: inline-block;
  border: 1px solid #333333;
  padding: 2px;
  border-radius: 50%;
  &:hover{
    color: $colorPrimary;
    border-color: $colorPrimary;
  }
}
.raido-group-custom{
  background: #ffffff;
   margin: 10px 0;
  >>> .el-radio-button__inner{
    padding: 5px 3px;
    width: 51px;
    height: 26px;
    font-size: 14px;
    color: #9e9e9e;
    font-weight: 400;
    // text-indent: -999px;
  }
  >>> .el-radio-button__orig-radio:checked+.el-radio-button__inner{

  }
  >>> .el-radio-button__orig-radio:disabled:checked+.el-radio-button__inner{
    background: #ababab !important;
    border-color: #ababab !important;
    box-shadow: -1px 0 0 0 #ababab !important;
  }
  >>> .el-radio-button:first-child {
      .el-radio-button__orig-radio:checked+.el-radio-button__inner{
        background: $colorPrimary;
        color: #ffffff;
      }
        .el-radio-button__inner{
          border-radius:  19px 0 0 19px;
        }
      }
  >>> .el-radio-button:last-child {
        .el-radio-button__orig-radio:checked+.el-radio-button__inner{
          background: #f56c6c;
          border-color: #f56c6c;
          color: #ffffff;
          box-shadow: -1px 0 0 0 #f56c6c;
        }
        .el-radio-button__inner{
          border-radius:  0px 19px 19px 0px;

        }
      }
}

.data-colum{
  margin: 40px auto 0;
  +.data-colum{
    margin-top: 15px;
  }
  .data-colum-label{
    display: inline-block;
    width:  85px;
  }
  .button-add-time{
    display: inline-block;
    font-size: 24px;
    vertical-align: top;
    line-height: 32px;
    &:hover{
      color: $colorPrimary;
    }
  }
  >>> .el-date-editor{
    width: 290px;
    .el-input__inner{
      height: 30px;
      line-height: 30px;
    }
    .el-input__icon{
      line-height: 30px;
    }
  }
}
.dialog-content{
  margin: 0 20px;
}
.dialog-tips-content{
  display: flex;
  align-items: center;
  justify-content: center;
}
.dialog-tips-icon{
  width: 46px;
  height: 46px;
  font-size: 46px;
  &.el-icon-warning{
    color: #ff4848;
  }
  &.el-icon-circle-check{
    color: $colorPrimary;
  }
}
.dialog-tips-text{
  max-width: 448px;
  font-size: 16px;
  line-height: 30px;
  color: #ababab;
  margin-left: 20px;
}
</style>
