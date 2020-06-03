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
                v-if="fucBtns.includes('add-btn')"
                  type="primary"
                  size="medium"
                  icon="el-icon-plus"
                  @click="addHandle">
                  添加</el-button>
                <el-button
                v-if="fucBtns.includes('dels-btn')"
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
                prop="menus"
                label="菜单功能"
                align="center">
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="140"
                align="center">
                <template slot-scope="scope">
                  <a
                v-if="fucBtns.includes('dist-btn')"
                    href="javascript:;"
                    class="color-primary"
                    @click="editRole(scope.row)">分配
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
      :close-on-click-modal="false"
      :visible.sync="dialogAddVisible"
      width="35%"
      @close="closeDialog('form')"
      >
      <div slot="title">
        {{typeof editData !== 'undefined' && editData !== '' ? '编辑' : '新增' }}
      </div>
      <el-form
        :model= "form"
        ref= "form"
        :rules="rules"
        size= "mini"
        label-width= "100px"
        label-position= "right"
        @submit.native.prevent= "submitForm"
        v-loading= "submitting"
      >
        <el-form-item
          label="角色名称"
          prop="roleName">
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
          @click="closeDialog('form')">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      title="分配"
      :visible.sync="dialogRoleVisible"
      width="70%"
      >
    <el-tree
      :data="roleOptions.menus"
      ref="tree"
      show-checkbox
      node-key="menuId"
      default-expand-all
      :props='treeLabel'
      @check-change="nodeCheckHandle"
      :check-strictly= 'false'
      :default-checked-keys="roleOptions.menuCheckList"
      >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <!-- <span>{{ data }}</span> -->
        <span class="custom-tree-btn">
          <el-checkbox-group v-model="data.checkedRoles">
            <el-checkbox
            @change="handleCheckedCitiesChange(data)"
            v-for="(item, index) in data.btnControl"
            :label="item.name"
            :disabled='item.active'
            :key="index">{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </span>
      </span>
    </el-tree>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogRoleVisible = false">取 消</el-button>
      <el-button type="primary" @click="saveCheckData">确 定</el-button>
    </span>
    </el-dialog>
    <!-- 旧版分配弹窗 -->
    <!-- <el-dialog
      :close-on-click-modal="false"
      title="分配"
      :visible.sync=false
      >
      <el-collapse v-loading="pageLoading" v-model="activeNames" >
        <el-collapse-item
          v-for="(item, index) in roleOptions"
          :key = index
          name="1">
          <template slot="title">
            <el-checkbox
              :indeterminate="isIndeterminate"
              v-model="item.checkAll"
              @change="handleCheckAllChange(item)">{{item.name}}</el-checkbox>
          </template>
          <el-checkbox-group
            v-model="item.checkedRoles"
            @change="handleCheckedChildrensChange(item)">
            <el-checkbox
              v-for="(itemList) in item.list"
              :label="itemList.name"
              :key="itemList.pid">{{itemList.name}}</el-checkbox>
          </el-checkbox-group>
        </el-collapse-item>
      </el-collapse>

      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          size="small"
          @click="submitFormRole()">确 定</el-button>
        <el-button
          size="small"
          @click="dialogRoleVisible = false">取 消</el-button>
      </div>
    </el-dialog> -->
  </el-container>
</template>
<script>
import BreadCrumb from '../Breadcrumb/Breadcrumb'
import Tables from '@/mixins/Tables'
import axios from '@/api/axios'
// import qs from 'qs'
// const cityOptions = ['上海风险分级管控表', '风险分级管控表', '风险分级管控表', '风险分级管控表', '上海1', '北京1', '广州1', '深圳1', '上海', '北京', '广州', '深圳']
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
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      },
      treeLabel: { // 属性结构名
        label: 'name',
        children: 'list'
      },
      checkedCities: '',
      multipleSelection: [],
      pageLoading: false,
      submitting: false,
      editData: '',
      roleOptions: [], // 角色tree的data
      postDataChecked: [],
      activeNames: ['1'],
      isIndeterminate: true,
      roleId: '',
      menuList: [],
      newMenuList: [],
      menuCheckList: [], // 选中的菜单项集合
      postMenuCheckList: '', // 传给后台的选中的菜单项
      menuCheckListCurrent: [], // 回显选中的菜单项集合
      filterBtnCheckedList: [], // 筛选选中的btn元素的id的集合
      postBtnCheckedList: [], // 传给后台的选中的btn元素的集合
      data: [], // tree的data
      dialogVisible: false,
      // checkedbtns: [] // 按钮值
      fucBtns: []
    }
  },
  mounted () {
    this.initPage()
    this.getBtnAuthority()
  },
  methods: {
    // 关闭弹框
    closeDialog (formName) {
      this.dialogAddVisible = false
      this.$refs[formName].resetFields()
    },
    // 页面初始化数据
    initPage () {
      this.initMenuList()
      // console.log('itemListBtnControl', this.newMenuList)
    },
    // 初始化菜单
    initMenuList () {
      axios
        .get('ontroller/getMenuLists')
        .then((res) => {
          if (res.data.code === 200) {
            this.menuList = res.data.menuList
            this.newMenuList = []
            this.menuList.forEach(item => {
              if (!item.list) {
                this.newMenuList.push(item.menuId)
              } else {
                return ''
              }
            })
          }
        })
    },
    // 获取角色数据
    fetchRoleOptions (row) {
      this.roleId = row.roleId
      this.pageLoading = true
      axios
        .get('role/getRoleMenus', {
          roleId: this.roleId
        })
        .then((res) => {
          if (res.data.code === 200) {
            this.pageLoading = false
            this.roleOptions = res.data.data
            console.log(this.roleOptions)
            console.log(this.newMenuList)
            console.log('itemListBtnControl', this.newMenuList)
            for (let i = 0; i < this.roleOptions.length; i++) {
              for (let j = 0; j < this.newMenuList.length; j++) {
                if (this.roleOptions[i].menuId === this.newMenuList[j]) {
                  this.roleOptions[i].checkAll = true
                }
              }
            }
          }
        })
        .finally(() => {
          this.pageLoading = false
        })
    },
    filterRoleOptions (fData) {
      if (!Array.isArray(this.postDataChecked)) {
        this.postDataChecked = this.postDataChecked.split(',')
      }
      let newRoleOptions = this.postDataChecked
      fData.forEach(item => {
        if (item.checkAll === true || item.checkedRoles.length > 0) {
          newRoleOptions.push(item.menuId)
        }
        if (item.list) {
          item.list.forEach(itemList => {
            item.checkedRoles.forEach(itemChecked => {
              if (itemList.name === itemChecked) {
                newRoleOptions.push(itemList.menuId)
              }
            })
          })
        }
      })
      return newRoleOptions
    },
    // 提交保存
    submitFormRole () {
      this.postDataChecked = this.filterRoleOptions(this.roleOptions)
      this.postDataChecked = this.postDataChecked.join(',')
      let vm = this
      let sendData = {
        roleId: vm.roleId,
        menuId: this.postDataChecked
      }
      axios
        .post('role/updateMenu', sendData)
        .then((res) => {
          if (res.data.code === 200) {
            vm.$notify.success('分配成功')
            vm.dialogRoleVisible = false
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
          this.postDataChecked = []
        })
    },
    handleCheckAllChange (item) {
      if (item.checkAll) {
        item.checkAll = true
      } else {
        item.checkAll = false
      }
      item.checkedRoles = []
      if (item.checkAll === true && item.list) {
        item.list.forEach(itemChecked => {
          item.checkedRoles.push(itemChecked.name)
        })
      } else {
        item.checkedRoles = []
      }
      this.isIndeterminate = false
    },
    handleCheckedChildrensChange (item) {
      let checkedCount = item.checkedRoles.length
      item.checkAll = checkedCount === item.list.length
      this.isIndeterminate = checkedCount >= 0 && checkedCount < item.list.length
    },
    // 分配角色
    editRole (row) {
      this.dialogRoleVisible = true
      this.fetchRoleOptions(row)
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
        let sendDAta = { roleId: [] }
        this.multipleSelection.forEach(item => {
          sendDAta.roleId.push(item.roleId)
        })
        this.$confirm('是否删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios
            .post('role/delRole', sendDAta)
            .then((res) => {
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
    },
    // 分配权限选择
    nodeCheckHandle (data, currentChecked) {
      // console.log('1111list', data)
      if (currentChecked && data.btnControl) {
        // console.log('33', currentChecked, data.btnControl)
        data.btnControl.forEach(item => {
          item.active = false
          // console.log('33', item, item.disabled)
        })
      } else if (data.btnControl) {
        data.btnControl.forEach(item => {
          item.active = true
          // console.log('44', currentChecked, data.btnControl)
        })
      }
      // console.log('111', data, currentChecked)
    },
    // data值改变
    handleCheckedCitiesChange (data) {
      // console.log('111', data)
    },
    // 保存
    saveCheckData () {
      const vm = this
      vm.postMenuCheckList = vm.filterMenuCheckedNodes()
      vm.postBtnCheckedList = vm.filterBtnChecked(vm.roleOptions.menus).join(',')
      const sendData = {
        roleId: this.roleId,
        menuId: vm.postMenuCheckList + ',' + vm.postBtnCheckedList
      }
      vm
        .$confirm('确定修改该菜单吗？', '提示', {
          type: 'warning'
        })
        .then(() => {
          const vm = this
          vm.submitting = true
          axios
            .post('role/updateMenu', sendData)
            .then((res) => {
              if (res.data.code === 200) {
                vm.$notify.success('提交成功')
                vm.dialogRoleVisible = false
                vm.tablesFetchList()
              } else {
                vm.$message({
                  message: res.data.message,
                  type: 'warning'
                })
              }
            })
        })
        .catch(() => {
          this.submitting = false
        })
    },
    // 筛选选中的btn元素
    filterBtnChecked (fData) {
      this.filterBtnCheckedList = []
      fData.forEach(item => {
        if (item.list !== null) {
          item.list.forEach(itemChildren => {
            itemChildren.btnControl.forEach(itemList => {
              itemChildren.checkedRoles.forEach(itemChecked => {
                if (itemList.name === itemChecked && itemList.active === false) {
                  this.filterBtnCheckedList.push(itemList.menuId)
                }
              })
            })
          })
        }
      })
      return this.filterBtnCheckedList
    },
    // 筛选选中的菜单项
    filterMenuCheckedNodes () {
      const vm = this
      vm.menuCheckListCurrent = this.$refs.tree.getCheckedNodes()
      vm.menuCheckList = []
      vm.menuCheckListCurrent.forEach(item => {
        vm.menuCheckList.push(item.menuId)
      })
      vm.postMenuCheckList = vm.menuCheckList.join(',')
      return vm.postMenuCheckList
    },
    getBtnAuthority () {
      const authId = {authId: '7-2'}
      axios
        .get('user/getBtnArray', authId)
        .then((res) => {
          if (res.data.code === 200) {
            console.log(res.data)
            this.fucBtns = res.data.data.functionBtns
            // console.log(this.fucBtns)
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
  }
}
</script>

<style scoped lang="scss">
@import '@/utils/css/tools/_variables.scss';
.el-tree{
  font-weight: 500;
}
.custom-tree-btn{
  position: absolute;
  right: 50px;
}
</style>
