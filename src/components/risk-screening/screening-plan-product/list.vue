<template>
  <el-container class="inner-main-content" v-loading="pageLoading">
    <el-aside class="inner-aside" width="408px">
      <tree-read-only
        :tree-name="'风险单元'"
        :tree-data="riskUnitTree"
        editOrgVisible
        @eidit-org="eiditOrganizationHandle"
        @tree-click-handle="treeClickHandle">
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
              v-if="btnDisabledProductSend"
              type="primary"
              size="medium"
              icon="el-icon-s-promotion"
              @click="handleSendMsg"
              >计划发布</el-button>
            <el-button
              type="success"
              size="medium"
              icon="el-icon-download"
              @click="exportEexcelHandel"
              >导出</el-button>
            <el-button
              type="primary"
              size="medium"
              icon="el-icon-document-copy"
              @click="copy">
              复制</el-button>
          </div>
        </div>
        <el-table
          v-loading="tablesLoading"
          :data="tableData"
          border
          @selection-change="handleSelectionChange"
          style="width: 100%"
          align="center">
          <el-table-column
            type="selection" align="center"
            width="50">
          </el-table-column>
          <el-table-column
            label="单元"
            header-align="center">
            <el-table-column
              prop="oneName"
              label="一级"
              align="center">
            </el-table-column>
            <el-table-column
              prop="twoName"
              label="二级"
              align="center">
            </el-table-column>
            <el-table-column
              prop="riskName"
              label="三级"
              align="center">
            </el-table-column>
          </el-table-column>
          <el-table-column
            label="风险等级"
            width="100"
            align="center">
            <template slot-scope="scope">
              <el-tag
                size="mini"
                effect="dark"
                :class="classObj(scope.row)">
                {{ scope.row.riskLevel}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="checkContent"
            label="检查内容"
            align="center">
          </el-table-column>
          <el-table-column
            prop="isAccord"
            label="是否符合"
            align="center">
          </el-table-column>
          <el-table-column
            prop="existProblem"
            label="存在问题"
            align="center">
          </el-table-column>
          <el-table-column
            prop="measure"
            label="整改措施"
            align="center"
            width="300">
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
              <template slot="header">
                <el-checkbox
                  v-model="checkedAuto"
                  @change="autoCheckChangeHandle">
                  自动推送</el-checkbox>
                <el-checkbox
                  v-model="checkedManual"
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
            label="操作"
            align="center"
            width="100px">
            <template slot-scope="scope">
              <a
                href="javascript:;"
                class="color-danger talbe-links-del"
                @click.prevent="delRowHandle(scope.row)">删除
              </a>
              <a
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
          v-loading="submitting"
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
        <template>
          <tree-organization
            :tree-name="'组织机构'"
            :tree-data= "organizationTree"
            editVisible
            @editTreeData="editOrgTreeData"
          ></tree-organization>
        </template>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          size="small"
          @click="dialogOrganizationVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <dialog-sort
      :dialogVisible = "dialogSortVisible"
      :planId = "currentPlanId"
      :type = "type"
      @on-dialog-change = "changeSortDialog"
      @reload = "fetchInvestigationOptions"
    ></dialog-sort>
  </el-container>
</template>

<script>
import TreeReadOnly from '@/components/tree-diagram/treeReadOnly'
import TreeOrganization from '@/components/tree-diagram/treeOrganization'
import DialogSort from '@/components/risk-screening/screening-plan/dialogSort'
import axios from '@/api/axios'
import exportExcel from '@/api/exportExcel'
import {copyProductHidden} from '@/api/screeningPlan'
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
      submitting: false,
      tablesLoading: false,
      sendPlanSwitch: true, // 计划发布开关
      btnDisabledProductSend: false, // 计划发布可用开关
      dialogTipsVisible: false, // 添加弹框显示开关
      // dialogAddDangerVisible: false, // 添加随机隐患弹框开关
      dialogOrganizationVisible: false, // 组织机构弹框显示开关
      dialogSortVisible: false, // 排查种类弹框显示开关
      riskUnitTree: [], // 风险单元机构树
      tableData: [], // 生产类清单列表数据
      organizationTree: [], // 组织机构
      editOrgData: {
        invDeptName: '',
        invDeptId: ''
      }, // 编辑机构数据的表单
      currentPlanId: '', // 当前清单项的id
      listDate: [
        {
          value: ''
        }
      ],
      checkedAuto: null,
      checkedManual: null,
      investigationOptions: [], // 排查频率选项
      page: {
        total: 0, // 总条数
        index: 1, // 当前页面
        pageNo: 1,
        pageSize: 10 // limit
      },
      multipleSelection: []
    }
  },
  components: {
    TreeReadOnly,
    DialogSort, // 排查种类弹框
    TreeOrganization // 组织机构树菜单
  },
  created () {
    this.fetchUnitTreeData()
    this.fetchOrgTreeData()
    this.fetchTableData()
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
    // tag的class集合
    classObj (data) {
      if (data.riskLevel === '低风险') {
        return 'tag-low'
      } else if (data.riskLevel === '一般风险') {
        return 'tag-normal'
      } else if (data.riskLevel === '较大风险') {
        return 'tag-warning'
      } else if (data.riskLevel === '重大风险') {
        return 'tag-danger'
      }
    },
    // 导出excel
    exportEexcelHandel () {
      exportExcel(`productHidden/exportProductHidden`)
    },
    // 树节点，点击功能
    treeClickHandle (item) {
      this.currentPlanId = item.riskId
      this.fetchTableData()
      this.fetchInvestigationOptions()
    },
    // 编辑机构
    eiditOrganizationHandle () {
      this.dialogOrganizationVisible = true
    },
    // 获取风险单元树的数据
    fetchUnitTreeData () {
      this.pageLoading = true
      axios
        .get('riskia/getRiskTree')
        .then((res) => {
          if (res.data.code === 200) {
            this.pageLoading = false
            this.riskUnitTree = res.data.data
            this.currentPlanId = this.riskUnitTree[0].riskId
            this.fetchInvestigationOptions()
            this.fetchTableData()
          }
        })
    },
    // 获取生产现场类隐患排查清单
    fetchTableData () {
      axios
        .get('productHidden/getProductHiddenList', {
          risk_id: this.currentPlanId,
          pageSize: this.page.pageSize
        })
        .then((res) => {
          this.tablesLoading = true
          if (res.data.code === 200) {
            // let initTableData = []
            this.initTableData = res.data.data
            this.initTableData.forEach(item => {
              if (item.autoPush === null) {
                item.isPushDisabled = true
              } else {
                item.isPushDisabled = false
                this.checkedAuto = true
                this.checkedManual = true
              }
            })
            this.tableData = this.initTableData
            this.btnDisabledProductSend = this.tableData.length > 0
          }
        })
        .finally(() => {
          this.tablesLoading = false
        })
    },
    // 添加随机隐患
    handleAddDanger () {
      this.dialogAddDangerVisible = true
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
        .delete('productHidden/delProductHidden', sendData)
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
        this.checkedAuto = true
      } else {
        row.autoPush = '手动'
        this.checkedManual = true
      }
      // 一键填充，如果排查频率是1-1-1格式的数据，就可以一键填满，一键填充功能只能在初始时用一次
      if (obj.fill === true) {
        rows.forEach(item => {
          item.investigation = row.investigation
          item.autoPush = row.autoPush
          item.isPushDisabled = false
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
        list: [{
          spmProductHiddenList: vm.tableData,
          checkTime: vm.listDate
        }]
      }
      vm.submitting = true
      axios
        .post('productHidden/planRelease', sendData)
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
    // 自定义序号
    indexMethod (index) {
      return index + 1
    },
    // 手动模式添加日期处理
    changeDate (val) {
      this.listDate.forEach(item => {

      })
    },
    addDateHandle () {
      this.listDate.push({
        value: ''
      })
    },
    delDateHandle () {
      if (this.listDate.length > 1) {
        this.listDate.pop()
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
    editItem (row) {},
    copy () {
      let vm = this
      if (vm.multipleSelection.length === 0) {
        vm.$message({
          message: '复制选项不能为空，请至少选择一个',
          type: 'warning'
        })
        return
      }
      console.log(vm.multipleSelection)
      vm.pageLoading = true
      let ids = []
      vm.multipleSelection.forEach(item => {
        ids.push(item.id)
      })
      let postD = {
        riskId: vm.currentPlanId,
        id: ids.join(',')
      }
      copyProductHidden(postD).then((res) => {
        if (res.code === 200) {
          vm.fetchTableData()
          vm.pageLoading = false
        } else {
          vm.pageLoading = false
          vm.$message({
            message: '请求发生错误，请稍后重试',
            type: 'warning'
          })
        }
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
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
    width: 280px;
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
