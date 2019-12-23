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
                      @click.prevent="handleSort">
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
                    prop="target"
                    label="排查目标"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop="content"
                    label="排查内容与排查标准"
                    header-align="center">
                  </el-table-column>
                  <el-table-column
                    prop="basis"
                    label="检查依据"
                    header-align="center">
                  </el-table-column>
                  <el-table-column
                    label="排查频率"
                    header-align="center"
                    width="250px">
                    <template slot-scope="scope">
                      <!-- <i v-show="scope.row" class="el-icon-bottom" title="一键填满"></i> -->
                      <el-select
                        @change="selChange($event, scope.row, tableData)"
                        v-model="scope.row.hz"
                        placeholder="请选择排查频率">
                        <el-option
                          v-for="item in hzOptions"
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
                          :disabled="scope.row.isPushDisabled === 'false'"
                          v-model="scope.row.isPush"
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

        <el-tab-pane>
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
                    <el-button
                      type="primary"
                      size="medium"
                      icon="el-icon-plus"
                      @click="handleAddDanger">
                      随机隐患添加</el-button>
                    <el-button
                      type=""
                      size="medium"
                      icon="el-icon-menu"
                      @click.prevent="handleSort">
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
                  :data="tableData"
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
                        @change="selChange($event, scope.row, tableData)"
                        v-model="scope.row.hz"
                        placeholder="请选择排查频率">
                        <el-option
                          v-for="item in hzOptions"
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
                          :disabled="scope.row.isPushDisabled === 'false'"
                          v-model="scope.row.isPush"
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
        <div class="dialog-tips-content">
          <i class="el-icon-circle-check dialog-tips-icon"></i>
          <div class="dialog-tips-text">清单任务计划发布完成</div>
        </div>
        <div class="dialog-tips-content">
          <i class="el-icon-warning dialog-tips-icon"></i>
          <div class="dialog-tips-text">当前检查清单中存在手动推送的任务，请为手动推送的隐患任务设置<span class="color-primary">推送时间</span></div>
        </div>
        <div
          v-for="(item,index) in listDate"
          :key="index"
          ref="dateColumn"
          class="data-colum"
        >
          <span class="">推送时间{{index + 1}}：</span>
          <el-date-picker
            v-model="item.value"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
          <i @click="addDateHandle" class="el-icon-circle-plus-outline button-add-time"></i>
          <i @click="delDateHandle" class="el-icon-remove-outline button-add-time"></i>
        </div>

      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          size="small"
          @click="submitForm()">确 定</el-button>
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
      @on-dialog-change = "changeAddDialog"
    ></dialog-add>
    <dialog-add-danger
      :dialogVisible = "dialogAddDangerVisible"
      @on-dialog-change = "changeAddDangerDialog"
    ></dialog-add-danger>
    <dialog-sort
      :dialogVisible = "dialogSortVisible"
      @on-dialog-change = "changeSortDialog"
    ></dialog-sort>
  </el-container>
</template>
<script>
import qs from 'qs'
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
      isPushDisabled: 'false',
      pageLoading: false,
      dialogTipsVisible: false, // 添加弹框显示开关
      dialogAddVisible: false, // 添加弹框显示开关
      dialogAddDangerVisible: false, // 添加随机隐患弹框开关
      dialogOrganizationVisible: false, // 组织机构弹框显示开关
      dialogSortVisible: false, // 排查种类弹框显示开关
      isOrgTree: true, // 是否是组织结构树
      checked: false,
      organizationTree: [], // 组织机构
      riskUnitTree: [], // 风险单元机构树
      tableData: [
        {
          target: '安全生产目标',
          content: '对危废品存储区域设立相应的警示标识，危废告知卡、存放标准上墙；',
          basis: '《非煤矿矿山企业安全生产许可证实施办法》第八条（七）',
          hz: null, // hzOptions的value
          isPush: null, // 手动 | 自动
          isPushDisabled: 'false' // 判断是否禁用推送按钮的标志
        },
        {
          target: '安全生产目标',
          content: '对危废品存储区域设立相应的警示标识，危废告知卡、存放标准上墙；',
          basis: '《非煤矿矿山企业安全生产许可证实施办法》第八条（七）',
          hz: null, // hzOptions的value
          isPush: null, // 手动 | 自动
          isPushDisabled: 'false' // 判断是否禁用推送按钮的标志
        },
        {
          target: '安全生产目标',
          content: '对危废品存储区域设立相应的警示标识，危废告知卡、存放标准上墙；',
          basis: '《非煤矿矿山企业安全生产许可证实施办法》第八条（七）',
          hz: null, // hzOptions的value
          isPush: null, // 手动 | 自动
          isPushDisabled: 'false' // 判断是否禁用推送按钮的标志
        }
      ],
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
        }
      ], // 计划清单列表数据
      editOrgData: {
        deptName: '',
        deptId: ''
        // position: '',
        // responsibility: ''
      }, // 编辑机构数据
      hzOptions: [
        {
          value: '1',
          label: '日常性检查，公司，半年',
          isFill: true // 是否一键填充tag
        }, {
          value: '2',
          label: '综合性检查，公司、组织，半年',
          isFill: false
        }, {
          value: '3',
          label: '综合性检查，组织，半年',
          isFill: true
        }
      ],
      isFillSwitch: false,
      checkList: ['自动推送', '手动推送'],
      listDate: [
        {
          value: ''
        }
      ]
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
  created () {
    this.fetchOrgTreeData()
    this.fetchUnitTreeData()
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
    // 编辑机构
    eiditOrganizationHandle () {
      this.dialogOrganizationVisible = true
    },
    // 获取组织机构树数据
    fetchOrgTreeData () {
      let userId = sessionStorage.getItem('userId')
      axios
        .get('dept/getDeptList', {
          userId: userId
        })
        .then((res) => {
          if (res.data.code === 200) {
            this.organizationTree = res.data.data[0]
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
    // 排查种类
    handleSort () {
      this.dialogSortVisible = true
      console.log(this.dialogSortVisible)
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
      this.dialogTipsVisible = true
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
      let sendData = {
        id: row.id
      }
      axios
        .post('news/delNews', qs.stringify(sendData))
        .then((res) => {
          if (res.data.code === 200) {
            this.$notify.success('删除成功')
            this.tablesFetchList()
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
    selChange (value, row, rows) {
      let vm = this
      // 修改推送方式
      row.isPushDisabled = 'true'
      if (value === '1') {
        row.isPush = '自动'
      } else {
        row.isPush = '手动'
      }
      // 查找当前对象
      let obj = {}
      obj = vm.hzOptions.find((item) => {
        return item.value === value
      })
      // 一键填充
      if (obj.isFill === true) {
        rows.forEach(item => {
          item.hz = row.hz
          item.isPush = '自动'
          item.isPushDisabled = 'true'
        })
        vm.isFillSwitch = true
      }
      if (vm.isFillSwitch) {
        vm.hzOptions.forEach(item => {
          item.isFill = false
        })
      }
    },
    // 自动推送可用状态改变
    checkAutoChangeHandle (val) {
      this.tableData.forEach(item => {
        if (item.isPush === '自动') {
          if (val === false) {
            item.isPushDisabled = 'false'
          } else {
            item.isPushDisabled = 'true'
          }
        }
      })
    },
    // 手用状态可用改变
    checkManualChangeHandle (val) {
      this.tableData.forEach(item => {
        if (item.isPush === '手动') {
          if (val === false) {
            item.isPushDisabled = 'false'
          } else {
            item.isPushDisabled = 'true'
          }
        }
      })
    },
    checkPushChangeHandle () {

    },
    addDateHandle () {
      this.listDate.push({})
      // this.num.length++
      // alert('c')
      // console.log(this.$refs)
      // this.$refs.dateColumn.
    },
    delDateHandle () {
      if (this.listDate.length > 1) {
        this.listDate.pop({})
      }
      // if (this.num.length > 1) {
      //   this.num.length--
      // }
    }
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
    width: 320px;
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
