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
                prop="checkTime"
                label="属期"
                align="center">
              </el-table-column>
              <el-table-column
                prop="done"
                label="排查率"
                align="center">
              </el-table-column>
              <el-table-column
                prop="total"
                label="次数"
                align="center">
              </el-table-column>
              <el-table-column
                prop="money"
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
      width="30%"
      title="编辑"
      >
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
          label="每次奖励金额"
          prop="userName">
          <el-input
            v-model.trim="form.money"
            placeholder="请输入金额"
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
    <dialog-detail
      :dialogVisible = "dialogDetailVisible"
      :data="postDetailData"
      @on-dialog-change = "changeDetialDialog"
    ></dialog-detail>
  </el-container>
</template>
<script>
import BreadCrumb from '../Breadcrumb/Breadcrumb'
import Tables from '@/mixins/Tables'
import axios from '@/api/axios'
import exportExcel from '@/api/exportExcel'
import DialogDetail from '@/components/config-management/performance-assessment/dialogDetail'

export default {
  name: 'userManagement',
  mixins: [Tables],
  data () {
    return {
      breadcrumb: ['配置维护管理', '绩效考核'],
      tables: {
        api: 'performance/performanceList',
        auto: true
      },
      dialogDetailVisible: false, // 详情弹框开关
      dialogAddVisible: false, // 添加用户弹框开关
      form: {
        checkTime: '',
        checkUser: '',
        money: '' // 每次奖励金额
      },
      submitting: false,
      editData: '',
      postDetailData: null
    }
  },
  mounted () {
  },
  methods: {
    // 导出excel
    exportEexcelHandel () {
      exportExcel(`performance/exportPerformance`)
    },
    // 详情弹框显示
    detaileHandle (row) {
      this.dialogDetailVisible = true
      this.postDetailData = row
    },
    changeDetialDialog (val) {
      this.dialogDetailVisible = val
    },
    // 编辑
    editHandle (row) {
      this.dialogAddVisible = true
      this.form.money = row.money
      this.form.checkTime = row.checkTime
      this.form.checkUser = row.checkUser
    },
    // form表单提交事件
    submitForm () {
      let vm = this
      vm
        .$confirm(`确定修改金额吗？`, '提示', {
          type: 'warning'
        })
        .then(() => {
          vm.submitting = true
          axios
            .post(`performance/updatePerformance`, vm.form)
            .then((res) => {
              vm.submitting = true
              if (res.data.code === 200) {
                vm.$notify.success('修改成功')
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
    BreadCrumb,
    DialogDetail
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
