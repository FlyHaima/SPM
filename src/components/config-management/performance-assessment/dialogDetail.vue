<template>
  <el-dialog
    title="详情"
    :visible.sync="show"
    width="60%">
    <div>
      <el-table
        border
        stripe
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        v-loading="tablesLoading">
        <el-table-column
          prop="checkUser"
          label="姓名"
          align="center">
        </el-table-column>
         <el-table-column
          prop="checkTime"
          label="日期"
          align="center">
        </el-table-column>
        <el-table-column
          label="操作"
          align="center">
          <template slot-scope="scope">
            <a
              href="javascript:;"
              class="color-primary"
              @click="detailsHandle(scope.row)">详情
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
    <div slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        size="small"
        @click="show = false">确 定</el-button>
    </div>
    <dialog-details
      :dialogVisible = "dialogDetailsVisible"
      :id = "currentDetailsId"
      @on-dialog-change = "changeDetailsDialog"
    ></dialog-details>
  </el-dialog>
</template>

<script>
import axios from '@/api/axios'
import moment from 'moment'
import DialogDetails from '@/components/risk-screening/screening-review/detailsDialog'

export default {
  name: 'dialogSort',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      dialogDetailsVisible: false,
      currentDetailsId: '',
      tablesLoading: false,
      show: false,
      page: {
        total: 0, // 总条数
        index: 1, // 当前页面
        pageNo: 1,
        pageSize: 10 // limit
      },
      tableData: [],
      checkUser: '',
      checkTime: ''
    }
  },
  components: {
    DialogDetails
  },
  methods: {
    // 触发详情弹框
    detailsHandle (item) {
      this.currentDetailsId = item.procInstId
      this.dialogDetailsVisible = true
    },
    changeDetailsDialog (val) {
      this.dialogDetailsVisible = val
    },
    // 获取table数据
    fetchTableData () {
      this.tablesLoading = true
      console.log(this.data)
      axios
        .get('performance/seePerformance', {
          checkUser: this.checkUser,
          checkTime: this.checkTime,
          pageSize: this.page.pageSize
        })
        .then((res) => {
          if (res.data.code === 200) {
            let formatTableData = res.data.data
            formatTableData.forEach(item => {
              if (item.checkTime) {
                item.checkTime = moment(item.checkTime).format('YYYY-MM-DD  HH: mm: ss')
              } else {
                item.checkTime = ''
              }
            })
            this.tableData = formatTableData
          }
        })
        .finally(() => {
          this.tablesLoading = false
        })
    },
    // 切换分页数量
    handleSizeChange (val) {
      this.fetchTableData()
    },
    // 切换当前页页数
    handleCurrentChange (val) {
      this.page.index = val
      this.page.pageNo = val
      this.fetchTableData()
    }
  },
  watch: {
    data: {
      handler (val, oldVal) {
        this.checkUser = val.checkUser
        this.checkTime = val.checkTime
        if (this.data) {
          this.fetchTableData()
        }
      }
    },
    dialogVisible (val) {
      this.show = val
    },
    show (val) {
      this.$emit('on-dialog-change', val)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/utils/css/style.scss';
</style>
