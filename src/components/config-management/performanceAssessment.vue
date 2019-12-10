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
                v-if="!tableVisible"
                class="tools-item"
                type="success"
                size="medium"
                icon="el-icon-download"
                @click="exportEexcelHandel">
                  导出</el-button>
              </div>
            </div>
            <el-table
              :data="tables.data"
              v-loading="tables.loading"
              border
              style="width: 100%"
              header-align="center">
              <el-table-column
                type="index"
                label="序号"
                width="55"
                align="center"
                :index="tablesDefineIndex">
              </el-table-column>
              <el-table-column
                prop="userName"
                label="姓名"
                align="center">
              </el-table-column>
              <el-table-column
                prop="position"
                label="日期"
                align="center">
              </el-table-column>
              <el-table-column
                prop="accountName"
                label="排查率"
                align="center">
              </el-table-column>
              <el-table-column
                prop="role"
                label="次数"
                align="center">
              </el-table-column>
              <el-table-column
                prop="telephone"
                label="每次奖励金额"
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
                    @click="editHandle(scope.row)">编辑
                  </a>
                  <span class="color-primary"> / </span>
                  <a
                    href="javascript:;"
                    class="color-primary"
                    @click="detaileHandle(scope.row)">详情
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
        :rules= "rules"
        size= "mini"
        label-width= "100px"
        label-position= "right"
        @submit.native.prevent= "submitForm"
        v-loading= "submitting"
        width="400"
      >
        <el-form-item
          label="每次奖励金额"
          prop="userName">
          <el-input
            v-model.trim="form.userName"
            placeholder="请输入姓名"
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
      title="详情"
      :visible.sync="dialogDetailVisible"
      >
      <el-card class="box-card">
        <el-row class="item">
          <el-col class="box-item-label" :span="3">检查名称:</el-col>
          <el-col :span="9">1</el-col>
        </el-row>
        <el-row class="item">
          <el-col class="box-item-label" :span="3">上报人员:</el-col>
          <el-col :span="9">1</el-col>
          <el-col class="box-item-label" :span="3">隐患地点:</el-col>
          <el-col :span="9">1</el-col>
        </el-row>
        <el-row class="item">
          <el-col class="box-item-label" :span="3">上报时间:</el-col>
          <el-col :span="9">1</el-col>
        </el-row>
        <el-row class="item">
          <el-col class="box-item-label" :span="24">现场图片:</el-col>
        </el-row>
        <el-row class="item">
          <el-col :span="24">
            <div class="attachment-list">
              <div
                class="attachment-list-item">
                <img
                  class="attachment-img"
                  src=""
                  alt="上传的图片" />
              </div>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </el-dialog>
  </el-container>
</template>
<script>
import BreadCrumb from '../Breadcrumb/Breadcrumb'
import Tables from '@/mixins/Tables'
import axios from '@/api/axios'
import exportExcel from '@/api/exportExcel'

export default {
  name: 'userManagement',
  mixins: [Tables],
  data () {
    return {
      breadcrumb: ['配置维护管理', '绩效考核'],
      tables: {
        api: 'user/getUserList'
      },
      dialogDetailVisible: false, // 详情弹框开关
      dialogAddVisible: false, // 添加用户弹框开关
      form: {
        userName: '' // 每次奖励金额
      },
      submitting: false,
      editData: ''
    }
  },
  methods: {
    // 导出excel
    exportEexcelHandel () {
      exportExcel(`riskLevel/exportRiskCrad`, 'id=' + this.riskId)
    },
    // 详情弹框显示
    detaileHandle (row) {
      this.dialogDetailVisible = true
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
          .get('user/getUser', {
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
          vm.submitting = true
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
        .catch(() => {})
    }
  },
  components: {
    BreadCrumb
  }
}
</script>

<style scoped lang="scss">
@import '@/utils/css/style.scss';
  .box-card {
    margin: 0 30px;
    max-height: 800px;
    overflow-y: scroll;
    .item{
      padding: 8px 0;
    }
  }
  .box-item-label{
    color: #ababab;
  }
  .attachment-list{
    display: flex;
    flex-wrap: wrap;
  }
  .attachment-list-item{
    width: 143px;
    margin-right: 43px;
    // border: 1px solid #dddddd;
    border-radius: 8px;
    video{
      display: inline-block;
      width: 143px;
      height: 113px;
      border-radius: 6px;
    }
  }
  .attachment-img{
    display: inline-block;
    width: 173px;
    height: 102px;
    border-radius: 6px;
    background: pink;
  }
</style>
