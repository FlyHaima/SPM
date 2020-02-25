<template>
  <el-container class="inner-page-container" v-loading="pageLoading">
    <el-header class="inner-header">
      <bread-crumb :breadList="breadcrumb">
      </bread-crumb>
    </el-header>
    <el-main class="inner-main-container">
      <el-tabs type="border-card" @tab-click='clickTab' class="height-100">
        <el-tab-pane>
          <span slot="label">菜单访问日志</span>
          <div class="container-box">
            <div class="content-tools is-flex-end">
              <div class="tools-right">
                <el-button
                  type="danger"
                  size="medium"
                  icon="el-icon-delete"
                  @click.prevent="batchDeleteHandle()">
                  清空当前页</el-button>
              </div>
            </div>
            <el-table
              :data="tables.data"
              v-loading="tables.loading"
              border
              style="width: 100%"
              header-align="center">
              <el-table-column
                label="序号"
                type="index"
                width="65"
                align="center"
                :index="tablesDefineIndex">
              </el-table-column>
              <el-table-column
                prop="logTimeStr"
                label="时间"
                align="center">
              </el-table-column>
              <el-table-column
                prop="menuName"
                label="菜单模块"
                align="center">
              </el-table-column>
              <el-table-column
                prop="ip"
                label="IP地址"
                align="center">
              </el-table-column>
              <el-table-column
                prop="loginType"
                label="登录端"
                align="center">
              </el-table-column>
              <el-table-column
                prop="userName"
                label="用户名称"
                align="center">
              </el-table-column>
              <el-table-column
                prop="methods"
                label="执行方法"
                align="center">
              </el-table-column>
              <el-table-column
                prop="description"
                label="操作"
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
        </el-tab-pane>
        <el-tab-pane>
          <span slot="label">系统操作日志</span>
          <div class="container-box">
            <div class="content-tools is-flex-end">
              <div class="tools-right">
                <el-button
                  type="danger"
                  size="medium"
                  icon="el-icon-delete"
                    @click.prevent="batchDeleteHandle()">
                  清空当前页</el-button>
              </div>
            </div>
            <el-table
              :data="tables.data"
              v-loading="tables.loading"
              border
              style="width: 100%"
              header-align="center">
              <el-table-column
                label="序号"
                type="index"
                width="55"
                align="center"
                :index="tablesDefineIndex">
              </el-table-column>
              <el-table-column
                prop="logTimeStr"
                label="时间"
                align="center">
              </el-table-column>
              <el-table-column
                prop="menuName"
                label="菜单模块"
                align="center">
              </el-table-column>
              <el-table-column
                prop="ip"
                label="IP地址"
                align="center">
              </el-table-column>
              <el-table-column
                prop="loginType"
                label="登录端"
                align="center">
              </el-table-column>
              <el-table-column
                prop="userName"
                label="用户名称"
                align="center">
              </el-table-column>
              <el-table-column
                prop="methods"
                label="执行方法"
                align="center">
              </el-table-column>
              <el-table-column
                prop="description"
                label="操作"
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
        </el-tab-pane>
        <el-tab-pane>
          <span slot="label">系统错误日志</span>
          <div class="container-box">
            <div class="content-tools is-flex-end">
              <div class="tools-right">
                <el-button
                  type="danger"
                  size="medium"
                  icon="el-icon-delete"
                  @click.prevent="batchDeleteHandle()">
                  清空当前页</el-button>
              </div>
            </div>
            <el-table
              :data="tables.data"
              v-loading="tables.loading"
              border
              style="width: 100%"
              header-align="center">
              <el-table-column
                label="序号"
                type="index"
                width="55"
                align="center"
                :index="tablesDefineIndex">
              </el-table-column>
              <el-table-column
                prop="logTimeStr"
                label="时间"
                align="center">
              </el-table-column>
              <el-table-column
                prop="menuName"
                label="菜单模块"
                align="center">
              </el-table-column>
              <el-table-column
                prop="ip"
                label="IP地址"
                align="center">
              </el-table-column>
              <el-table-column
                prop="loginType"
                label="登录端"
                align="center">
              </el-table-column>
              <el-table-column
                prop="userName"
                label="用户名称"
                align="center">
              </el-table-column>
              <el-table-column
                prop="methods"
                label="执行方法"
                align="center">
              </el-table-column>
              <el-table-column
                prop="errorMsg"
                label="错误信息"
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
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>
<script>
import BreadCrumb from '../Breadcrumb/Breadcrumb'
import Tables from '@/mixins/Tables'
import axios from '@/api/axios'
// import qs from 'qs'
export default {
  name: 'log',
  mixins: [Tables],
  data () {
    return {
      breadcrumb: ['配置维护管理', '日志'],
      pageLoading: false,
      tables: {
        api: 'log/getLogList',
        form: {
          tabType: '1'
        }
      }
    }
  },
  components: {
    BreadCrumb
  },
  methods: {
    // 删除当页信息
    batchDeleteHandle () {
      let sendData = {
        pageNo: this.tables.form.pageNo,
        pageSize: this.tables.form.pageSize,
        tabType: this.tables.form.tabType
      }
      this.$confirm('是否删除当页消息？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios
          .post('log/del', sendData)
          .then((res) => {
            if (res.data.code === 200) {
              this.$notify.success('删除成功')
              this.tables.form.pageNo = 1
              this.tables.page.index = 1
              this.tablesFetchList()
            } else {
              this.$notify.warning(res.data.message)
            }
          })
          .finally(() => {
            this.submitting = false
          })
      }).catch(() => {
        this.submitting = false
      })
    },
    // tab切换事件
    clickTab (item) {
      this.tables.form.tabType = (Number(item.paneName) + 1) + ''
      this.tables.form.pageNo = 1
      this.tables.page.index = 1
      this.tablesFetchList()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
