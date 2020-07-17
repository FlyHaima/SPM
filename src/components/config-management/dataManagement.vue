<template>
  <el-container class="inner-page-container" v-loading="pageLoading">
    <el-header class="inner-header">
      <bread-crumb :breadList="breadcrumb">
      </bread-crumb>
    </el-header>
    <el-main class="inner-main-container">
      <el-container class="inner-main-content">
        <el-aside class="inner-aside" width="408px">
          <div class="inner-aside-content">
            <el-form :inline="true" class="demo-form-inline">
              <el-form-item>
                <el-input
                  v-model="groupName"
                  placeholder="请输入搜索内容">
                  <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
              </el-form-item>
              <el-button
              v-if="fucBtns.includes('addcate-btn')"
                type="text"
                icon="el-icon-plus"
                @click="addClassifyHandle"
              >新增分类</el-button>
            </el-form>
            <el-table
              ref="singleTable"
              highlight-current-row
              @current-change="handleCurrentChange"
              :data="seachTableData"
              border
              class="menu-table">
              <el-table-column
                label="序号"
                type="index"
                width="60"
                align="center">
              </el-table-column>
              <el-table-column
                label="数据字典分类列表"
                align="center">
                <template slot-scope="scope">
                  <div @click="groupClickHandle(scope.row)">{{ scope.row.groupName }}</div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-aside>

        <el-main class="inner-content">
          <div class="container-box">
            <div class="content-tools is-flex-end">
              <div class="tools-right">
                <el-button
                v-if="fucBtns.includes('add-btn')"
                  type="primary"
                  size="medium"
                  icon="el-icon-plus"
                  @click="addHandle()">
                   添加</el-button>
              </div>
            </div>
            <el-table
              :data="tables.data"
              border
              style="width: 100%"
              v-loading="tables.loading">
              <el-table-column
                type="index"
                label="序号"
                width="55"
                align="center"
                :index="tablesDefineIndex">
              </el-table-column>
              <el-table-column
                prop="code"
                label="代码"
                align="center">
              </el-table-column>
              <el-table-column
                prop="content"
                label="名称"
                align="center">
              </el-table-column>
              <el-table-column
                prop="remark"
                label="备注"
                align="center">
              </el-table-column>
            </el-table>
            <div class="el-pagination__wrap text-right">
              <el-pagination
                background
                layout="total, prev, pager, next, jumper"
                :current-page="tables.page.index"
                :page-sizes="tables.page.sizes"
                :page-size="tables.form.pageSize"
                :total="tables.page.total"
                @current-change="tablesHandleCurrentPage"></el-pagination>
            </div>
          </div>
        </el-main>
      </el-container>
    </el-main>
    <el-dialog
      :close-on-click-modal="false"
      width="40%"
      :visible.sync="dialogAddVisible"
      title="添加"
      @close="closeDialog('form')"
      >
      <el-form
        :model= "tables.form"
        ref= "form"
        :rules= "rules"
        size= "mini"
        label-width= "100px"
        label-position= "right"
        @submit.native.prevent= "submitForm"
      >
        <el-form-item
          label="注意：">
          <p>关于建立排查周期的"月度"，"日"，"小时"周期的提示：
如每隔一个月发送一次，请填写"月度-1";
如每天发送三次，请填写"日-3";
如每隔5小时发送一次，请填写"小时-5";</p>
        </el-form-item>
        <el-form-item
          label="名称"
          prop="content">
          <el-input
            v-model.trim="tables.form.content"
            placeholder="请输入名称"
            maxlength="25"
            autocomplete></el-input>
        </el-form-item>
        <el-form-item
          label="代码"
          prop="code">
          <el-input
            v-model.trim="tables.form.code"
            placeholder="请输入代码"
            maxlength="25"
            autocomplete></el-input>
        </el-form-item>
         <el-form-item
          label="备注">
          <el-input
            type="textarea"
            v-model.trim="tables.form.remark"
            placeholder="请输入备注"
            autocomplete
            maxlength="200"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          size="small"
          @click="submitForm()"
          v-loading= "submitting"
          >保 存</el-button>
        <el-button
          size="small"
          @click="closeDialog('form')">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      width="40%"
      :visible.sync="dialogAddGroupVisible"
      title="添加分类"
      @close="closeDialogGroup('formGroup')"
      >
      <el-form
        :model= "formGroup"
        ref= "formGroup"
        :rules= "rulesGroup"
        size= "mini"
        label-width= "100px"
        label-position= "right"
        @submit.native.prevent= "submitFormGroup"
      >
        <el-form-item
          label="分类名称"
          prop="groupName">
          <el-input
            v-model.trim="formGroup.groupName"
            placeholder="请输入分类名称"
            maxlength="25"
            autocomplete></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          size="small"
          @click="submitFormGroup()"
          v-loading= "submitting"
          >保 存</el-button>
        <el-button
          size="small"
          @click="closeDialogGroup('formGroup')"
          >取 消</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>
<script>
import BreadCrumb from '../Breadcrumb/Breadcrumb'
import axios from '@/api/axios'
import Tables from '@/mixins/Tables'

export default {
  name: 'dataManagement',
  mixins: [Tables],
  data () {
    return {
      breadcrumb: ['配置维护管理', '数据字典'],
      pageLoading: false, // 页面loading开关
      submitting: false, // 提交数据loading开关
      dialogAddVisible: false, // 添加弹框显示开关
      dialogAddGroupVisible: false, // 添加分类弹框显示开关
      groupName: '',
      formGroup: {
        groupName: ''
      },
      tableData: [], // table列表数据
      seachTableData: [],
      tables: {
        api: 'dic/getList',
        form: {
          groupId: '',
          content: '', // 名称
          code: '', // 代码
          remark: '', // 备注
          pageNo: 1,
          pageSize: 10
        },
        fucBtns: []
      },
      groupId: '',
      rules: {
        content: [
          {required: true, message: '请输入名称', trigger: 'blur'}
        ],
        code: [
          {required: true, message: '请输入代码', trigger: 'blur'}
        ]
      },
      rulesGroup: {
        groupName: [
          {required: true, message: '请输入分类名称', trigger: 'blur'}
        ]
      },
      currentRow: null
    }
  },
  created () {
    this.fetchTableData()
    this.getBtnAuthority()
  },
  methods: {
    // 关闭添加弹框
    closeDialog (formName) {
      this.dialogAddVisible = false
      this.$refs[formName].resetFields()
    },
    // 关闭添加分类弹框
    closeDialogGroup (formName) {
      this.dialogAddGroupVisible = false
      this.$refs[formName].resetFields()
    },
    setCurrent (row) {
      this.$refs.singleTable.setCurrentRow(row)
    },
    handleCurrentChange (val) {
      this.currentRow = val
    },
    // 添加事件处理
    addHandle () {
      this.dialogAddVisible = true
      Object.keys(this.tables.form).forEach(key => {
        // this.tables.form[key] = ''
        this.tables.form.content = '' // 名称
        this.tables.form.code = '' // 代码
        this.tables.form.remark = '' // 备注
      })
    },
    // 添加分类事件处理
    addClassifyHandle () {
      this.dialogAddGroupVisible = true
    },
    // 获取table数据
    fetchTableData () {
      this.pageLoading = true
      let vm = this
      axios
        .get('dic/getGroupList', this.form)
        .then((res) => {
          if (res.data.code === 200) {
            vm.tableData = res.data.groupList
            vm.seachTableData = vm.tableData
            this.setCurrent(vm.seachTableData[0])
            this.groupClickHandle(vm.seachTableData[0])
          }
        }).finally(() => {
          this.pageLoading = false
        })
    },
    // 分类列表点击事件处理
    groupClickHandle (item) {
      this.groupId = item.groupId
      this.tables.form.groupId = this.groupId
      this.tables.form.pageNo = 1
      this.tablesFetchList()
    },
    // form表单提交事件
    submitFormGroup () {
      let vm = this
      this.$refs.formGroup.validate((valid) => {
        if (valid) {
          vm.$confirm('确定新增分类?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            vm.submitting = true
            axios
              .post('dic/addGroup', this.formGroup)
              .then((res) => {
                if (res.data.code === 200) {
                  vm.$notify.success('提交成功')
                  vm.dialogAddGroupVisible = false
                  vm.submitting = false
                  vm.fetchTableData()
                } else {
                  vm.$message({
                    message: res.data.message,
                    type: 'warning'
                  })
                }
              })
              .finally(() => {
                vm.submitting = false
              })
          })
        } else {
          return false
        }
      })
    },
    // form表单提交事件
    submitForm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$confirm('确定添加数据?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.submitting = true
              this.tables.form.groupId = this.groupId
              axios
                .post('dic/add', this.tables.form)
                .then((res) => {
                  if (res.data.code === 200) {
                    this.dialogAddVisible = false
                    this.submitting = false
                    this.$notify.success('提交成功')
                    this.tablesFetchList()
                  } else {
                    this.$message({
                      message: res.data.message,
                      type: 'warning'
                    })
                  }
                })
                .finally(() => {
                  this.tablesFetchList()
                  this.dialogAddVisible = false
                  this.submitting = false
                })
            })
        } else {
          return false
        }
      })
    },
    closeLoading () {
      this.pageLoading = false
    },
    getBtnAuthority () {
      const authId = {authId: '7-3'}
      axios
        .get('user/getBtnArray', authId)
        .then((res) => {
          if (res.data.code === 200) {
            console.log(res.data)
            this.fucBtns = res.data.data.functionBtns
            console.log(this.fucBtns)
          } else {
            this.$message({
              message: res.data.message,
              type: 'warning'
            })
          }
        })
    }
  },
  components: {
    BreadCrumb
  },
  watch: {
    groupName (val) {
      this.seachTableData = this.tableData.filter(
        data => !val || data.groupName.toLowerCase().includes(val.toLowerCase())
      )
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/utils/css/tools/_variables.scss';
.inner-aside{
  margin-right: 8px;
  background: #ffffff;
  .el-form-item{
    margin-bottom: 14px;
  }
  >>>.el-form-item__content{
    width: 262px;
    line-height: 33px;
    .el-input__inner{
      height: 33px;
      line-height: 33px;
      background: #f6f8fa;
    }
    .el-input__icon{
      line-height: 33px;
    }
    .el-icon-search{
      color: #777777;
    }

  }
  .el-button{
    padding-top: 8px;
    padding-bottom: 8px;
  }
}
.inner-aside-content{
  width: 360px;
  margin: 40px auto;
}
.menu-table{
  >>> .el-table__body tr.current-row>td{
    background: $colorPrimary;
    color: #ffffff;
  }
}
</style>
