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
                prop="roleName"
                width="155"
                label="角色名称"
                align="center">
              </el-table-column>
              <el-table-column
                prop="position"
                label="菜单功能"
                align="center">
              </el-table-column>
              <el-table-column
                prop=" "
                label="操作"
                width="300"
                align="center">
                <template slot-scope="scope">
                  <a
                    href="javascript:;"
                    class="color-primary"
                    @click="editRole(scope.row)">分配
                  </a>
                </template>
              </el-table-column>
            </el-table>
            <div class="el-pagination__wrap text-right">
              <el-pagination
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
      :visible.sync="dialogAddVisible"
      >
      <div slot="title">
        {{typeof editData !== 'undefined' && editData !== '' ? '编辑' : '新增' }}
      </div>
      <el-form
        :model= "form"
        ref= "form"
        size= "mini"
        label-width= "100px"
        label-position= "right"
        @submit.native.prevent= "submitForm"
        v-loading= "submitting"
      >
        <el-form-item
          label="角色名称"
          prop="userName">
          <el-input
            v-model.trim="form.roleName"
            placeholder="请输入角色名称"
            maxlength="25"
            autocomplete></el-input>
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
      title="分配"
      :visible.sync="dialogRoleVisible"
      >
      <el-collapse v-model="activeNames" >
        <el-collapse-item name="1">
          <template slot="title">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">安全基础管理</el-checkbox>
          </template>
          <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
          </el-checkbox-group>
        </el-collapse-item>
        <el-collapse-item name="2">
          <template slot="title">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">风险辨识评估</el-checkbox>
          </template>
          <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
          </el-checkbox-group>
        </el-collapse-item>
      </el-collapse>

      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          size="small"
          @click="submitForm()">确 定</el-button>
        <el-button
          size="small"
          @click="dialogRoleVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>
<script>
import BreadCrumb from '../Breadcrumb/Breadcrumb'
import Tables from '@/mixins/Tables'
import axios from '@/api/axios'
// import qs from 'qs'
const cityOptions = ['上海风险分级管控表', '风险分级管控表', '风险分级管控表', '风险分级管控表', '上海1', '北京1', '广州1', '深圳1', '上海', '北京', '广州', '深圳']
export default {
  name: 'userManagement',
  mixins: [Tables],
  data () {
    return {
      breadcrumb: ['配置维护管理', '角色管理'],
      tables: {
        api: 'role/getRoleList'
      },
      dialogRoleVisible: false, // 分配角色弹框开关
      dialogAddVisible: false, // 添加用户弹框开关
      radio: 1,
      form: {
        roleName: '' // 角色名称
      },
      multipleSelection: [],
      submitting: false,
      editData: '',
      roleOptions: [], // 角色
      activeNames: ['1'],
      checkAll: false,
      checkedCities: ['上海', '北京'],
      cities: cityOptions,
      isIndeterminate: true
    }
  },
  mounted () {
    this.fetchRoleOptions()
  },
  methods: {
    handleCheckAllChange (val) {
      this.checkedCities = val ? cityOptions : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange (value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.cities.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length
    },
    // 分配角色
    editRole (row) {
      this.dialogRoleVisible = true
    },
    // 添加事件
    addHandle () {
      this.dialogAddVisible = true
      this.editData = ''
      // 清空表单编辑后的值
      Object.keys(this.form).forEach(key => {
        // this.form[key] = ''
        this.form.roleName = '' // 角色名称
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
      this.submitting = true
      axios
        .get('/user/getRoleSelect')
        .then((res) => {
          if (res.data.code === 200) {
            this.roleOptions = res.data.roleList
          }
        })
        .finally(() => {
          this.submitting = false
        })
    },
    // 编辑状态，回显数据
    initForm (data) {
      this.submitting = true
      if (data) {
        axios
          .get('/role/getRoleList', {
            userId: data
          })
          .then((res) => {
            if (res.data.code === 200) {
              this.form = res.data.data
            }
          })
          .finally(() => {
            this.submitting = false
          })
      }
    },
    // 批量删除
    batchDeleteHandle () {
      if (!this.multipleSelection.length) {
        this.$message.warning('请选择要删除的行')
      } else {
        this.submitting = true
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
            .post('/user/delUser', sendDAta)
            .then((res) => {
              console.log(res.data.code)
              if (res.data.code === 200) {
                this.$notify.success('删除成功')
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
        .$confirm(`确定【${tip}】该角色吗？`, '提示', {
          type: 'warning'
        })
        .then(() => {
          vm.submitting = true
          axios
            .post(`role/${post}Role`, vm.form)
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
        .catch(() => {})
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
@import '../../utils/css/style.scss';
/deep/.el-collapse{
  border: 0;
  .el-collapse-item__header{
    background: #f6f9fd;
    border-bottom: 0;
    margin: 0 -18px;
    padding-left: 60px;
    height: 35px;
    line-height: 35px;
    font-size: 16px;
  }
  .el-collapse-item__arrow{
    display: none;
  }
  .el-collapse-item__wrap{
    border-bottom: 0;
    padding-left: 130px;
    margin: 0 -18px;
  }
  .el-collapse-item__content{
    padding-top: 15px;
    padding-bottom: 0px;
  }
  .el-checkbox-group{
    display: flex;
    flex-wrap: wrap;
    .el-checkbox{
      margin-bottom: 15px;
    }
  }
  .el-checkbox{
    flex: 0 0 25%;
    margin-right: 0;
  }
}
</style>
