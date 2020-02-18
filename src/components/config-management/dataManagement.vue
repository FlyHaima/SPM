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
                width="50">
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
      width="40%"
      :visible.sync="dialogAddVisible"
      title="添加"
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
          label="名称"
          prop="content">
          <el-input
            v-model="tables.form.content"
            placeholder="请输入名称"
            maxlength="25"
            autocomplete></el-input>
        </el-form-item>
        <el-form-item
          label="代码"
          prop="code">
          <el-input
            v-model="tables.form.code"
            placeholder="请输入代码"
            maxlength="25"
            autocomplete></el-input>
        </el-form-item>
         <el-form-item
          label="备注">
          <el-input
            type="textarea"
            v-model="tables.form.remark"
            placeholder="请输入备注"
            autocomplete
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
          @click="dialogAddVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      width="40%"
      :visible.sync="dialogAddGroupVisible"
      title="添加分类"
      >
      <el-form
        :model= "formGroup"
        ref= "formGroup"
        size= "mini"
        label-width= "100px"
        label-position= "right"
        @submit.native.prevent= "submitFormGroup"
      >
        <el-form-item
          label="分类名称">
          <el-input
            v-model="formGroup.groupName"
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
          @click="dialogAddGroupVisible = false">取 消</el-button>
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
          remark: '' // 备注
        }
      },
      rules: {
        content: [
          { required: true, message: '请输入名称', trigger: 'blur' },
        ],
        code: [
          { required: true, message: '请输入代码', trigger: 'blur' },
        ]
      },
      currentRow: null
    }
  },
  created () {
    this.fetchTableData()
  },
  methods: {
    setCurrent (row) {
      this.$refs.singleTable.setCurrentRow(row)
    },
    handleCurrentChange (val) {
      this.currentRow = val
    },
    // 添加事件处理
    addHandle () {
      this.dialogAddVisible = true
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
      this.tables.form.groupId = item.groupId
      this.tablesFetchList()
    },
    // form表单提交事件
    submitFormGroup () {
      let vm = this
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
    },
    // form表单提交事件
    submitForm () {
       this.$refs.form.validate((valid) => {
        if (valid) {
           this.$confirm('确定添加数据?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.submitting = true
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
