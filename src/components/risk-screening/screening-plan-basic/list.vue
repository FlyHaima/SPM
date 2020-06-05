<template>
  <el-container class="inner-main-content" v-loading="pageLoading">
    <el-aside class="inner-aside" width="290px">
      <tree-list
        v-if="listMenuDataTag"
        :menu-name="'计划清单'"
        :list-data = "listMenuData"
        :current-id ="currentPlanId"
        :showEditOrgBtn = "fucBtns.includes('edit-dept-btn')"
        :showAddMenuBtn = "fucBtns.includes('create-btn')"
        :showOperation = "true"
        :showEditBtn = "fucBtns.includes('edit-menu-btn')"
        :showDelBtn= "fucBtns.includes('del-menu-btn')"
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
              v-if= "fucBtns.includes('type-btn')"
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
              @click="ExportTemplateVisible">
              导出系统大数据模版</el-button>
            <el-button
              v-if="btnDisabledProductSend && fucBtns.includes('fb-btn')"
              type="primary"
              size="medium"
              icon="el-icon-s-promotion"
              @click="handleSendMsg">
              计划发布</el-button>
            <el-button
              v-if= "fucBtns.includes('add-btn')"
              type="primary"
              size="medium"
              icon="el-icon-plus"
              @click="handleAdd">
              添加</el-button>
            <el-upload
              v-if= "fucBtns.includes('import-btn')"
              class="tools-item"
              accept=".xls"
              :action='uploadUrl()'
              :headers="uploadHeader"
              :before-upload="handleBeforeUpload"
              :on-success="handleSuccess"
              :on-error="handleError"
              :file-list="fileList"
              :show-file-list="false">
              <el-button
                type="warning"
                size="medium"
                icon="el-icon-upload2"
                v-loading="uploading"
                class="button-custom">
                导入</el-button>
            </el-upload>
            <el-button
              v-if= "fucBtns.includes('export-btn')"
              type="success"
              size="medium"
              icon="el-icon-download"
              @click="exportEexcelHandel">
              导出</el-button>
            <el-button
              v-if= "fucBtns.includes('copy-btn')"
              type="primary"
              size="medium"
              icon="el-icon-document-copy"
              @click="copy">
              复制</el-button>
          </div>
        </div>

        <el-table
          :data="tableData"
          border
          style="width: 100%"
          align="center"
          @selection-change="handleSelectionChange"
          v-loading="tablesLoading">
          <el-table-column
            fixed="left"
            type="selection"
            align="center"
            width="50">
          </el-table-column>
          <el-table-column
            prop="investTarget"
            label="排查目标"
            align="center">
          </el-table-column>
          <el-table-column
            label="排查频率"
            header-align="center"
            width="180px">
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
              width="160px">
              <template slot="header">
                <el-checkbox
                    style="margin-right: 0"
                    @change="autoCheckChangeHandle">
                自动推送</el-checkbox>
                <el-checkbox
                @change="manualCheckChangeHandle">
                手动推送</el-checkbox>
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
            fixed="right"
            label="操作"
            align="center"
            width="130px">
            <template slot-scope="scope">
              <a
                v-if= "fucBtns.includes('del-btn')"
                href="javascript:;"
                class="color-danger talbe-links-del"
                @click.prevent="delRowHandle(scope.row)">删除
              </a>
              <a
                v-if= "fucBtns.includes('edit-btn')"
                href="javascript:;"
                class="talbe-links-del" style="margin-left: 5px;"
                @click.prevent="editItem(scope.row)">编辑
              </a>
            </template>
          </el-table-column>
        </el-table>
        <div class="el-pagination__wrap text-right">
          <el-pagination
            class="text-right"
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page.index"
            layout="total, prev, pager, next, jumper"
            :total="page.total">
          </el-pagination>
        </div>
      </div>
    </el-main>
    <el-dialog
      :close-on-click-modal="false"
      title="提示"
      :visible.sync="dialogTipsVisible"
      width="40%">
      <el-dialog
        width="40%"
        title="提示"
        :visible.sync="dialogTipsInnerVisible"
        append-to-body>
        <div class="dialog-content">
          <div class="dialog-tips-content" v-if="isPushed">
            <i class="el-icon-warning dialog-tips-icon"></i>
            <div class="dialog-tips-text">当前检查清单中存在未发布的任务，如果重新发布会影响到已设置过的计划时间</div>
          </div>
          <div class="list-tips-confirm" >
            <div
              class="list-tips-confirm-item"
              v-for="(item, index) in multipleSelectionPushed"
              :key="index">
                排查目标：{{item.investTarget}}<span>，</span>
                {{item.message}}
              </div>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeTipsDialog()">取 消</el-button>
          <el-button
            v-loading="submitting"
            type="primary"
            size="small"
            @click="savePlanHandle()">确 定</el-button>
        </div>
      </el-dialog>
      <div class="dialog-content">
        <div class="dialog-tips-content" v-if="sendPlanSwitch">
          <i class="el-icon-circle-check dialog-tips-icon"></i>
          <div class="dialog-tips-text">确定发布清单任务计划么？</div>
        </div>
        <div v-else>
          <div class="dialog-tips-content" >
            <i class="el-icon-warning dialog-tips-icon"></i>
            <div class="dialog-tips-text">当前检查清单中存在手动推送的任务，请为手动推送的隐患任务设置<span class="color-primary">推送时间</span></div>
          </div>
          <div
            v-for="(item,index) in listDateInit"
            :key="index"
            ref="dateColumn"
            class="data-colum"
          >
            <span class="data-colum-label">推送时间{{index + 1}}：</span>
            <el-date-picker
              class="push-date"
              v-model="item.date"
              type="date"
              placeholder="选择日期"
              :picker-options="pickerDisabled"
              :clearable='false'
              value-format="yyyy-MM-dd">
            </el-date-picker>
            -
            <el-time-select
              class="push-time"
              v-model="item.time"
              :picker-options="{
                start: '00:00',
                step: '01:00',
                end: '23:00'
              }"
              placeholder="选择时间"
              :clearable='false'
              value-format="HH:00">
            </el-time-select>
            <i @click="addDateHandle" class="el-icon-circle-plus-outline button-add-time"></i>
            <i @click="delDateHandle" class="el-icon-remove-outline button-add-time"></i>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          v-loading="submitting"
          type="primary"
          size="small"
          @click="confirmPlanHandle()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      title="编辑机构"
      :visible.sync="dialogOrganizationVisible"
      width="450px">
      <div style="height: 450px" v-loading="treeLoading">
        <template>
          <tree-organization
            :tree-name="'组织机构'"
            :tree-data="organizationTree"
            editVisible
            @editTreeData="editOrgTreeData"
          >
          <el-button
            class="btn-sync"
            type="primary"
            size="small"
            @click="syncOrganizationData">同步数据</el-button>
          </tree-organization>
        </template>
      </div>
    </el-dialog>
    <el-dialog
    title="导出系统大数据模版"
    width="450px"
    :close-on-click-modal="false"
    :visible.sync="dialogExportTemplate"
    >
    <template>
    <el-tree
    :data="companyData"
    :props="defaultPropsCompany"
    node-key="companyId" >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            type="text"
            size="mini"
            @click="ExportTemplate(data)">
            导出
          </el-button>
        </span>
      </span>
    </el-tree>
    </template>
    </el-dialog>
    <dialog-add
      :dialogVisible="dialogAddVisible"
      :planId="currentPlanId"
      @on-dialog-change="changeAddDialog"
      @reload="fetchTableData"
    ></dialog-add>
    <dialog-sort
      ref="dialogSort"
      :dialogVisible="dialogSortVisible"
      :planId="currentPlanId"
      :type="type"
      @on-dialog-change="changeSortDialog"
      @reload="fetchInvestigationOptions"
    ></dialog-sort>
    <el-dialog
      :close-on-click-modal="false"
      title="编辑"
      :visible.sync="dialogEditVisible"
      width="40%">
      <el-form
        :model="editFormVal"
        size="mini"
        label-width="100px"
        label-position="top"
      >
        <el-form-item label="排查目标">
          <el-input v-model="editFormVal.investTarget"></el-input>
        </el-form-item>
        <el-form-item label="排查内容与排查标注">
          <el-input
            type="textarea"
            v-model="editFormVal.investContent"></el-input>
        </el-form-item>
        <el-form-item label="排查依据">
          <el-input
            type="textarea"
            v-model="editFormVal.inspectionBasic"
            maxlength="30"
            show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          v-loading="confirmEditing"
          type="primary"
          size="small"
          @click="confirmEdit()">确 定</el-button>
        <el-button
          size="small"
          @click="closeEditConfirm()">取 消</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import moment from 'moment'
import TreeList from '@/components/tree-diagram/treeList'
import TreeOrganization from '@/components/tree-diagram/treeOrganization'
import axios from '@/api/axios'
import DialogSort from '@/components/risk-screening/screening-plan/dialogSort'
import DialogAdd from '@/components/risk-screening/screening-plan/addDialog'
import exportExcel from '@/api/exportExcel'
import {copyBasticHidden, updateBasicHidden} from '@/api/screeningPlan'
import base from '@/api/baseUrl'
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
      treeLoading: false,
      submitting: false,
      isPushed: false, // 是否已经发布过的计划标志
      sendPlanSwitch: true, // 计划发布手动自动区别开关
      isSendPlan: true, // 是否可以发布计划开关
      btnDisabledProductSend: false, // 计划发布可用开关
      dialogTipsVisible: false, // 添加弹框显示开关
      dialogTipsInnerVisible: false, // 计划发布弹框显示开关
      dialogAddVisible: false, // 添加弹框显示开关
      dialogOrganizationVisible: false, // 组织机构弹框显示开关
      dialogSortVisible: false, // 排查种类弹框显示开关
      dialogExportTemplate: false, // 系统大数据模板开关
      organizationTree: [], // 组织机构
      editOrgData: {
        invDeptName: '',
        invDeptId: ''
      }, // 编辑机构数据的表单
      listMenuData: [], // 计划清单列表数据
      listMenuDataTag: false,
      addListMenuForm: {
        planName: '',
        planId: ''
      }, // 添加清单菜单项的表单
      currentPlanId: '', // 当前清单项的id
      tableData: [], // 基础类清单列表数据
      // defaultDate: moment().format('YYYY-MM-DD'),
      // defaultTime: moment().format('HH:00'),
      listDateInit: [
        {
          date: moment().format('YYYY-MM-DD'),
          time: moment().format('HH:00')
        }
      ], // 初始化日期时间格式，只到时间
      listDate: [
        {
          value: ''
        }
      ], // 传值后台的变量
      pickerDisabled: {
        // 验证时间范围
        disabledDate: (time) => {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      defaultPropsCompany: {
        children: 'children',
        label: 'deptName'
      },
      // checkedAuto: false,
      // checkedManual: false,
      investigationOptions: [], // 排查频率选项
      uploading: false, // 导入loading
      // uploadData: {
      //   riskId: ''
      // }, // 上传数据
      fileList: [], // 导入列表
      page: {
        total: 0, // 总条数
        index: 1, // 当前页面
        pageNo: 1,
        pageSize: 10 // limit
      },
      multipleSelection: [], // 选中的列表
      multipleSelectionPushed: [], // 选中的已发布过的列表
      dialogEditVisible: false, // 编辑窗口显示
      editFormVal: {},
      confirmEditing: false,
      uploadHeader: {
        token: ''
      },
      fucBtns: [],
      companyData: [], // 公司数据
      companyId: '' // 公司id
    }
  },
  components: {
    TreeList, // 计划清单菜单
    DialogSort, // 排查种类弹框
    DialogAdd, // 添加计划弹框
    TreeOrganization // 组织机构树菜单
  },
  created () {
    let vm = this
    vm.currentPlanId = vm.$route.query.id
    // 设置上传的header 添加token
    vm.uploadHeader.token = sessionStorage.getItem('TOKEN_KEY')
    vm.companyId = sessionStorage.getItem('companyId')
    vm.fetchListMenuData()
    vm.fetchPlanOrganizationData()
    vm.getBtnAuthority()
    vm.getCompanyData()
  },
  methods: {
    // 切换分页数量
    handleSizeChange (val) {
      this.fetchTableData()
    },
    // 切换当前页页数
    handleCurrentChange (val) {
      this.page.index = val
      this.page.pageNo = val
      this.fetchTableData()
    },
    // 导入接口地址
    uploadUrl () {
      return base.baseUrl + '/basticHidden/importBasticHidden'
    },
    // 导入
    handleBeforeUpload (file) {
      this.uploading = true
    },
    // 导入成功
    handleSuccess (response, file, fileList) {
      this.uploading = false
      if (response.code === 200) {
        this.fetchTableData()
        this.$notify.success('导入成功')
      } else {
        this.$notify.warning(response.message)
      }
    },
    // 导入失败
    handleError (file, fileList) {
    },
    // 导出excel
    exportEexcelHandel () {
      exportExcel(`basticHidden/exportBasticHidden`)
    },
    /** 左侧清单菜单 **/
    // 获取清单数据
    fetchListMenuData () {
      let vm = this
      vm.pageLoading = true
      axios
        .get('schedule/getScheduleList')
        .then((res) => {
          if (res.data.code === 200) {
            vm.listMenuData = res.data.data
            vm.listMenuDataTag = true
            if (this.$route.query.id) {
              this.currentPlanId = this.$route.query.id
            } else {
              this.currentPlanId = this.listMenuData[0].planId
            }
            vm.fetchInvestigationOptions()
            vm.fetchTableData()
          }
        })
        .finally(() => {
          this.pageLoading = false
        })
    },
    // 创建清单
    addMenuHandle () {
      let vm = this
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
            } else {
              vm.$notify.warning(res.data.message)
            }
          })
          .finally(() => {
          })
      }).catch(() => {
      })
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
            } else {
              this.$notify.warning({
                message: res.data.message
              })
            }
          })
          .finally((res) => {
            this.$notify.error({
              message: res.data.message
            })
          })
      }).catch(() => {
      })
    },
    // 点击菜单项
    menuClickHandle (item) {
      this.currentPlanId = item.planId
      this.fetchTableData()
      this.fetchInvestigationOptions()
    },
    // 同步组织机构树数据，是从安全技术管理的组织机构里同步数据
    fetchOrgTreeData () {
      let vm = this
      this.treeLoading = true
      axios
        .get('basticHidden/getDeptList')
        .then((res) => {
          if (res.data.code === 200) {
            this.treeLoading = false
            vm.organizationTree = res.data.data
            this.$notify.success('更新成功')
          } else {
            vm.$message({
              message: res.data.message,
              type: 'warning'
            })
          }
        })
        .finally(() => {
          this.treeLoading = false
        })
    },
    // 获取计划下的组织机构树
    fetchPlanOrganizationData () {
      axios
        .get('basticHidden/getDeptListSize')
        .then((res) => {
          if (res.data.code === 200) {
            this.organizationTree = res.data.data
          } else {
            this.$message({
              message: res.data.message,
              type: 'warning'
            })
          }
        })
    },
    // 判断组织机构树状态，同步组织机构树数据，是从安全技术管理的组织机构里同步数据
    syncOrganizationData () {
      axios
        .get('basticHidden/getDeptListSize')
        .then((res) => {
          // 如果size是0，表示无数据，如果是1，表示有数据
          if (res.data.length === 0) {
            this.$confirm('此机构目前没有数据, 需要从安全技术管理的组织机构里同步数据吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.fetchOrgTreeData()
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消同步'
              })
            })
          } else {
            this.$confirm('确认更新此组织机构吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.fetchOrgTreeData()
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消同步'
              })
            })
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
    },
    // 编辑机构
    eiditOrganizationHandle () {
      this.dialogOrganizationVisible = true
    },
    /** 右侧列表内容 **/
    // 获取排查隐患清单列表
    fetchTableData () {
      this.tablesLoading = true
      axios
        .get('basticHidden/getBasticHiddenList', {
          planId: this.currentPlanId,
          pageSize: this.page.pageSize,
          pageNo: this.page.pageNo
        })
        .then((res) => {
          if (res.data.code === 200) {
            this.initTableData = res.data.data
            this.page.total = res.data.total

            this.initTableData.forEach(item => {
              if (item.autoPush === null) {
                item.isPushDisabled = true
              } else {
                item.isPushDisabled = false
                // this.checkedAuto = true
                // this.checkedManual = true
              }
            })
            this.tableData = this.initTableData

            this.btnDisabledProductSend = this.tableData.length > 0

            this.selChange()
          }
        })
        .finally(() => {
          this.tablesLoading = false
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
    // 删除事件
    delRowHandle (row) {
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
    // 添加计划数据项
    handleAdd () {
      this.dialogAddVisible = true
    },
    // 排查种类
    handleSort () {
      this.dialogSortVisible = true
      // 触发排查种类子组件的获取组织机构和获取周期的事件
      this.$refs.dialogSort.fetchOrgOptions()
      this.$refs.dialogSort.fetchCycleOptions()
    },
    // 弹框取消操作改变现实状态
    changeSortDialog (val) {
      this.dialogSortVisible = val
    },
    changeAddDialog (val) {
      this.dialogAddVisible = val
    },
    // 选择排查频率
    selChange (value, row, rows) {
      let vm = this
      // 启用推送按钮
      row.isPushDisabled = false

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
          if (item.autoPush === null) {
            item.investigation = row.investigation
            item.autoPush = row.autoPush
            item.isPushDisabled = false
          }
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
    // 计划发布
    handleSendMsg () {
      let vm = this
      vm.sendPlanSwitch = true
      vm.listDateInit = [
        {
          date: moment().format('YYYY-MM-DD'),
          time: moment().format('HH:00')
        }
      ]
      if (vm.multipleSelection.length === 0) {
        vm.$message({
          message: '发布选项不能为空，请至少选择一个',
          type: 'warning'
        })
        return
      }
      vm.multipleSelection.forEach(item => {
        if (!item.investigation) {
          vm.isSendPlan = false
        } else {
          vm.isSendPlan = true
        }
      })
      if (!vm.isSendPlan) {
        vm.$message({
          message: '发布选项的排查频率不能为空',
          type: 'warning'
        })
      }
      vm.multipleSelection.forEach(item => {
        if (vm.isSendPlan) {
          vm.dialogTipsVisible = true
          if (item.autoPush === '手动') {
            vm.sendPlanSwitch = false
          }
        }
      })
    },
    filterListDate (data) {
      let newListDate = []
      data.forEach(item => {
        newListDate.push(item.date + ' ' + item.time)
      })
      return newListDate
    },
    closeTipsDialog () {
      this.dialogTipsVisible = false
      this.dialogTipsInnerVisible = false
    },
    confirmPlanHandle () {
      let vm = this
      vm.multipleSelectionPushed = []
      vm.isPushed = false
      vm.multipleSelection.forEach(item => {
        console.log(item.autoFlag)
        if (item.autoFlag === 'false') {
          // vm.dialogTipsInnerVisible = true
          vm.isPushed = true
          vm.multipleSelectionPushed.push(item)
        } else {
          // vm.isPushed = false
        }
      })
      if (vm.isPushed) {
        vm.dialogTipsInnerVisible = true
      } else {
        vm.savePlanHandle()
      }
    },
    savePlanHandle () {
      let vm = this
      let listDate = vm.filterListDate(vm.listDateInit)
      let sendData = {
        list: [{
          spmBasicHiddenList: vm.multipleSelection,
          checkTime: listDate
        }]
      }
      vm.submitting = true
      vm.multipleSelectionPushed = []
      axios
        .post('basticHidden/planRelease', sendData)
        .then((res) => {
          if (res.data.code === 200) {
            vm.$notify.success('清单任务计划发布完成')
            vm.dialogTipsVisible = false
            vm.dialogTipsInnerVisible = false
            vm.fetchTableData()
            vm.listDate = [{value: moment().format('YYYY-MM-DD HH:mm')}]
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
          vm.dialogTipsInnerVisible = false
        })
    },
    // 自定义序号
    indexMethod (index) {
      return index + 1
    },
    // 手动模式添加日期处理
    changeDate (val) {
      this.listDateInit.forEach(item => {

      })
    },
    addDateHandle () {
      this.listDateInit.push({
        date: moment().format('YYYY-MM-DD'),
        time: moment().format('HH:00')
      })
    },
    delDateHandle () {
      if (this.listDateInit.length > 1) {
        this.listDateInit.pop()
      }
    },
    // 复选框的推送可用状态改变
    autoCheckChangeHandle (val) {
      let vm = this
      vm.tableData.forEach(item => {
        if (item.autoPush === '自动') {
          if (val) {
            item.isPushDisabled = false
          } else {
            item.isPushDisabled = true
          }
        }
      })
    },
    manualCheckChangeHandle (val) {
      let vm = this
      vm.tableData.forEach(item => {
        if (item.autoPush === '手动') {
          if (val) {
            item.isPushDisabled = false
          } else {
            item.isPushDisabled = true
          }
        }
      })
    },
    checkPushChangeHandle () {

    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    copy () {
      let vm = this
      if (vm.multipleSelection.length === 0) {
        vm.$message({
          message: '复制选项不能为空，请至少选择一个',
          type: 'warning'
        })
        return
      }
      vm.pageLoading = true
      let ids = []
      vm.multipleSelection.forEach(item => {
        ids.push(item.basicId)
      })
      let postD = {
        planId: vm.currentPlanId,
        basicId: ids.join(',')
      }
      copyBasticHidden(postD).then((res) => {
        if (res.code === 200) {
          this.$notify.success('复制成功')
          vm.fetchTableData()
          vm.pageLoading = false
        } else {
          vm.pageLoading = false
          vm.$message({
            message: res.message,
            type: 'warning'
          })
        }
      })
    },
    editItem (row) {
      let vm = this
      vm.editFormVal = row
      vm.dialogEditVisible = true
    },
    closeEditConfirm () {
      let vm = this
      vm.editFormVal = {}
      vm.dialogEditVisible = false
    },
    confirmEdit () {
      let vm = this
      vm.confirmEditing = true
      let postD = {
        basicId: vm.editFormVal.basicId,
        investTarget: vm.editFormVal.investTarget,
        investContent: vm.editFormVal.investContent,
        planId: vm.editFormVal.planId
      }
      updateBasicHidden(postD).then((res) => {
        if (res.code === 200) {
          vm.fetchListMenuData()
          vm.confirmEditing = false
          vm.dialogEditVisible = false
        } else {
          vm.confirmEditing = false
          vm.$message({
            message: '请求发生错误，请稍后重试',
            type: 'warning'
          })
        }
      })
    },
    getBtnAuthority () {
      const authId = {authId: '5-1'}
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
    },
    // 导出系统大数据模版
    ExportTemplateVisible () {
      this.dialogExportTemplate = true
    },
    ExportTemplate (data) {
      let token = sessionStorage.getItem('TOKEN_KEY')
      let api = 'basticHidden/exportBigData'
      window.location.href = base.baseUrl + '/' + api + '?' + 'token=' + token + '&' + 'companyId=' + data.companyId
    },
    // 获取公司数组树
    getCompanyData () {
      axios
        .get('/basticHidden/selectCompanyList')
        .then((res) => {
          if (res.data.code === 200) {
            this.companyData = res.data.data
          } else {
            this.$message({
              message: res.data.message,
              type: 'warning'
            })
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/utils/css/tools/_variables.scss';
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
  // >>> .el-radio-button__orig-radio:checked+.el-radio-button__inner{

  // }
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
    // width: 280px;
    width: auto;
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
.btn-sync{
  position: absolute;
  right: 0;
}
.push-date{
  display: inline-block;
  width: 150px !important;
}
.push-time{
  display: inline-block;
  width: 110px !important;
}
.list-tips-confirm{
  padding: 0 60px;
  margin-top: 20px;
}
.list-tips-confirm-item{
  line-height: 30px;
}
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
