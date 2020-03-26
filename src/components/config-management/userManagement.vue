<template>
  <el-container class="inner-page-container">
    <el-header class="inner-header">
      <bread-crumb :breadList="breadcrumb">
      </bread-crumb>
    </el-header>
    <el-main class="inner-main-container">
      <el-container class="inner-main-content">
        <el-main class="inner-content">
          <div class="container-box">
            <div class="content-tools is-flex-end">
              <div class="tools-right">
                <el-button
                  type="primary"
                  size="medium"
                  icon="el-icon-plus"
                  @click="addHandle">
                  添加</el-button>
                <el-button
                  type="danger"
                  size="medium"
                  icon="el-icon-delete"
                  @click="batchDeleteHandle"
                  :loading="submitting">
                  批量删除</el-button>
                <el-upload
                  class="tools-item"
                  accept=".xls"
                  :action='uploadUrl()'
                  :headers="uploadHeader"
                  :data="uploadData"
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
              </div>
            </div>
            <el-table
              ref="multipleTable"
              @selection-change="handleSelectionChange"
              :data="tables.data"
              v-loading="tables.loading"
              border
              style="width: 100%"
              header-align="center">
              <el-table-column
                type="selection"
                width="55"
                align="center">
              </el-table-column>
              <el-table-column
                prop="userName"
                label="姓名"
                align="center">
              </el-table-column>
              <el-table-column
                prop="accountName"
                label="账号"
                align="center">
              </el-table-column>
              <el-table-column
                prop="role"
                label="角色"
                align="center">
              </el-table-column>
              <el-table-column
                prop="telephone"
                width="120"
                label="电话"
                header-align="center">
              </el-table-column>
              <el-table-column
                label="账号状态"
                align="center">
                <template slot-scope="scope">
                  {{ scope.row.accountState|account-status-filter}}
                </template>
              </el-table-column>
              <el-table-column
                label="启用/禁用"
                align="center">
                <template slot-scope="scope">
                  {{ scope.row.state === '1' ? '启用' : '禁用' }}
                </template>
              </el-table-column>
              <el-table-column
                label="在职/离职"
                align="center">
                <template slot-scope="scope">
                  {{ scope.row.isWork === '1' ? '在职' : '离职' }}
                </template>
              </el-table-column>
              <el-table-column
                prop="position"
                label="职位"
                align="center">
              </el-table-column>
              <el-table-column
                fixed="right"
                prop=" "
                label="操作"
                width="120"
                align="center">
                <template slot-scope="scope">
                  <a
                    href="javascript:;"
                    class="color-primary"
                    @click="editHandle(scope.row)">编辑
                  </a>
                  <span class="color-primary"> / </span>
                  <!-- <el-popover
                    placement="top">
                    <p>确定【{{ scope.row.state === '1' ? '启用' : '禁用' }}】该用户吗？</p>
                    <div class="popover-btns">
                      <el-button
                        type="primary"
                        size="mini"
                        @click="changeState(scope.row)">确定</el-button>
                      <el-button
                        size="mini"
                        type="text"
                        >取消</el-button>
                    </div>
                    <el-button
                      :type="scope.row.state === '1' ? 'warning' : 'success' "
                      size="mini">启用
                    </el-button>
                  </el-popover> -->
                  <a
                    href="javascript:;"
                    :class="scope.row.state === '1' ? 'color-danger' : 'color-primary'"
                    @click="changeState(scope.row)">
                    {{ scope.row.state === '1' ? '禁用' : '启用' }}
                  </a>
                </template>
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
      @close="closeDialog('form')"
      width="40%"
      :visible.sync="dialogAddVisible"
      :close-on-click-modal="false"
      >
      <div slot="title">
        {{typeof editData !== 'undefined' && editData !== '' ? '编辑用户' : '新增用户' }}
      </div>
      <el-form
        :model= "form"
        ref= "form"
        :rules= "rules"
        size= "mini"
        label-width= "100px"
        label-position= "right"
        @submit.native.prevent= "submitForm"
      >
        <el-form-item label-width="0" class="tips-area">
          <span class="tips">*</span>注意：新增用户默认的初始密码是111111
        </el-form-item>
        <el-form-item
          v-if="typeof editData !== 'undefined' && editData !== ''"
          label="账号:"
          prop="accountName" >
          <el-input
            v-model.trim="form.accountName"
            placeholder="请输入账号"
            maxlength="25"
            autocomplete
            disabled=""></el-input>
        </el-form-item>
        <el-form-item
          v-else
          label="账号:"
          prop="accountName" >
          <el-input
            v-model.trim="form.accountName"
            placeholder="请输入账号"
            maxlength="25"
            autocomplete></el-input>
        </el-form-item>
        <el-form-item label="角色:" prop="roleId" >
          <el-select v-model="form.roleId" placeholder="请选择角色" autocomplete>
            <el-option
              v-for="(item, index) in roleOptions"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="用户名:"
          prop="userName">
          <el-input
            v-model.trim="form.userName"
            placeholder="请输入用户名(不可输入数字)"
            maxlength="15"
            autocomplete></el-input>
        </el-form-item>
        <el-form-item
          label="职位:"
          prop="position">
          <el-input
            v-model.trim="form.position"
            placeholder="请输入职位"
            maxlength="25"
            autocomplete></el-input>
        </el-form-item>
        <!-- <el-radio v-for="(item, index) in RELATION_PRODUCT_STATUS_LIST" :key="index" :label="item.value">{{ item.label }}</el-radio> -->
        <el-form-item label="启用/禁用:" prop="state">
          <el-radio-group v-model="form.state" autocomplete>
            <el-radio label="1">启用</el-radio>
            <el-radio label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="在职/离职:" prop="isWork">
          <el-radio-group v-model="form.isWork" autocomplete>
            <el-radio label="1">在职</el-radio>
            <el-radio label="0">离职</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item
          label="电话:"
          prop="telephone">
          <el-input
            disabled=""
            type="number"
            maxlength="11"
            onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
            v-model.trim="form.telephone"
            placeholder="请输入电话"
            autocomplete></el-input>
        </el-form-item> -->
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
  </el-container>
</template>
<script>
import BreadCrumb from '../Breadcrumb/Breadcrumb'
import Tables from '@/mixins/Tables'
import axios from '@/api/axios'
import qs from 'qs'
import base from '@/api/baseUrl'
import { AccountStatusFilter } from '@/filters/status'
export default {
  name: 'userManagement',
  mixins: [Tables],
  data () {
    /*
    * 手机号码校验
    * 以1开头，第二位可能是3/4/5/7/8等的任意一个，在加上后面的\d表示数字[0-9]的9位，总共加起来11位结束
    */
    // let regexPhone = new RegExp(/^1[3-9]\d{9}$/)
    /*
    * 登录账号校验
    * 校验 包括英文字母、数字和下划线
    */
    let regexaccountName = new RegExp(/^[A-Za-z0-9_]\w{1,25}$/)
    // 校验手机号码
    // var phoneValidator = (rule, value, callback) => {
    //   if (!regexPhone.test(value || (value.length > 0 && value.length < 11))) {
    //     callback(new Error('手机号码格式不正确，请输入11位数字符号！'))
    //   } else {
    //     callback()
    //   }
    // }
    // 校验登录账号
    var accountNameValidator = (rule, value, callback) => {
      if (value && (!regexaccountName.test(value))) {
        callback(new Error('账号格式不正确，请输入字母、数字、下划线的字符组合'))
      } else {
        callback()
      }
    }
    return {
      breadcrumb: ['配置维护管理', '用户管理'],
      tables: {
        api: 'user/getUserList'
      },
      dialogAddVisible: false, // 添加用户弹框开关
      radio: 1,
      form: {
        userName: '', // 用户名
        position: '', // 职位
        accountName: '', // 账号
        state: '1', // 启用/禁用状态
        telephone: '', // 手机号码
        roleId: '', // 角色
        isWork: '1' // 在职状态
      },
      multipleSelection: [],
      submitting: false,
      editData: '',
      roleOptions: [], // 角色
      rules: {
        accountName: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { validator: accountNameValidator, trigger: 'change' }
        ],
        roleId: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ],
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ]
        // telephone: [
        //   // {
        //   //   validator: phoneValidator
        //   // },
        //   { required: true, message: '请输入手机号码', trigger: 'blur' },
        //   { len: 11, message: '手机号码必须是11位', trigger: 'blur' }
        // ]
      },
      uploading: false, // 导入loading
      uploadData: {
        riskId: ''
      }, // 上传数据
      fileList: [], // 导入列表
      uploadHeader: {
        token: ''
      }
    }
  },
  filters: {
    'account-status-filter': AccountStatusFilter
  },
  created () {
  },
  mounted () {
    // 设置题库上传的header 添加token
    this.uploadHeader.token = sessionStorage.getItem('TOKEN_KEY')
    this.fetchRoleOptions()
  },
  methods: {
    // 关闭添加用户的弹框
    closeDialog (formName) {
      this.dialogAddVisible = false
      this.$refs[formName].resetFields()
    },
    // 导入接口地址
    uploadUrl () {
      return base.baseUrl + '/user/importUsers'
    },
    // 导入
    handleBeforeUpload (file) {
      this.uploading = true
    },
    // 导入成功
    handleSuccess (response, file, fileList) {
      if (response.code === 200) {
        this.uploading = false
        this.tablesFetchList()
        this.$notify.success('导入成功')
      } else {
        this.$notify.warning(response.message)
      }
    },
    // 导入失败
    handleError (file, fileList) {
    },
    // 修改 启用/禁用 状态
    changeState (row) {
      let sendData = {
        userId: row.userId,
        state: row.state === '1' ? '0' : '1'
      }
      let stateLabel = row.state === '1' ? '禁用' : '启用'
      axios
        .post('user/updateState', qs.stringify(sendData), { 'content-type': 'application/x-www-form-urlencoded' })
        .then((res) => {
          if (res.data.code === 200) {
            this.$notify.success(stateLabel + '成功')
            this.tablesFetchList()
          }
        })
        .finally(() => {})
    },
    // 添加事件
    addHandle () {
      this.dialogAddVisible = true
      this.editData = ''
      // 清空表单编辑后的值
      Object.keys(this.form).forEach(key => {
        // this.form[key] = ''
        this.form.userName = '' // 用户名
        this.form.position = '' // 职位
        this.form.accountName = '' // 账号
        this.form.telephone = '' // 手机号码
        this.form.roleId = null // 角色
      })
    },
    // 编辑
    editHandle (row) {
      this.dialogAddVisible = true
      this.editData = row.userId
      this.initForm(this.editData)
    },
    // 获取角色数据
    fetchRoleOptions () {
      axios
        .get('user/getRoleSelect')
        .then((res) => {
          if (res.data.code === 200) {
            this.roleOptions = res.data.roleList
          }
        })
        .finally(() => {
        })
    },
    // 编辑状态，回显数据
    initForm (data) {
      if (data) {
        axios
          .get('user/getUser', {
            userId: data
          })
          .then((res) => {
            if (res.data.code === 200) {
              this.form = res.data.data
            }
          })
          .finally(() => {
          })
      }
    },
    // 批量删除
    batchDeleteHandle () {
      if (!this.multipleSelection.length) {
        this.$message.warning('请选择要删除的行')
      } else {
        let sendDAta = { userId: [] }
        this.multipleSelection.forEach(item => {
          sendDAta.userId.push(item.userId)
        })
        this.$confirm('是否删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios
            .post('user/delUser', sendDAta)
            .then((res) => {
              this.submitting = true
              if (res.data.code === 200) {
                this.$notify.success('删除成功')
                this.tables.form.pageNo--
                this.tablesFetchList()
                this.multipleSelection = []
              }
            })
            .finally(() => {
              this.submitting = false
            })
        }).catch(() => {
          this.submitting = false
        })
      }
    },
    // form表单提交事件
    submitForm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.editData) {
            this.saveForm('update', '编辑')
          } else {
            this.saveForm('add', '添加')
          }
        } else {
          return false
        }
      })
    },
    saveForm (post, tip) {
      let vm = this
      vm
        .$confirm(`确定【${tip}】该用户吗？`, '提示', {
          type: 'warning'
        })
        .then(() => {
          axios
            .post(`user/${post}User`, vm.form)
            .then((res) => {
              vm.submitting = true
              if (res.data.code === 200) {
                vm.$notify.success(tip + '成功')
                vm.dialogAddVisible = false
                vm.tablesFetchList()
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
        .catch(() => {
          this.submitting = false
        })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    }
  },
  components: {
    BreadCrumb
  }
}
</script>

<style scoped lang="scss">
  .tips-area{
    .tips{
      color: #ff0000;
      margin: 8px;
    }
  }
</style>
