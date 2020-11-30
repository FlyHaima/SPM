<template>
  <el-dialog
    :close-on-click-modal="false"
    title="排查种类"
    :visible.sync="show"
    width="60%">
    <div>
      <el-table
        row-key="id"
        border
        stripe
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        v-loading="tablesLoading">
        <el-table-column
          width="50px"
          align="center">
          <template slot-scope="scope">
            <i
              v-show="scope.row.addVisible === 'true'"
              class="el-icon-circle-plus-outline"
              @click.prevent="addTableRow(scope.$index, scope.row, tableData)"
            ></i>
          </template>
        </el-table-column>
        <el-table-column
          prop="investType"
          label="排查种类"
          align="center">
        </el-table-column>
        <el-table-column
          label="组织机构"
          align="center">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.investDept"
              placeholder="请选择组织机构">
              <el-option
                v-for="item in orgOptions"
                :key="item.invDeptId"
                :label="item.invDeptName"
                :value="item.invDeptId">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          label="周期设置"
          align="center">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.investCycle"
              multiple
              placeholder="请设置周期">
              <el-option
                v-for="item in cycleOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center">
          <template slot-scope="scope">
            <a
              v-show="scope.row.addVisible === 'false'"
              href="javascript:;"
              class="color-danger talbe-links-del"
              @click="delTableRow(scope.$index, tableData, scope.row)"
            >删除</a>
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
        v-loading="submitting"
        type="primary"
        size="small"
        @click="submitSortForm()">确 定</el-button>
      <el-button
        size="small"
        @click="show = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
// import qs from 'qs'
import axios from '@/api/axios'
export default {
  name: 'dialogSort',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    planId: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    isProductData: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      submitting: false,
      tablesLoading: false,
      show: false,
      currentPlanId: '',
      page: {
        total: 0, // 总条数
        index: 1, // 当前页面
        pageNo: 1,
        pageSize: 10 // limit
      },
      tableData: [
        // {
        //   index: 0, // 名称的序号
        //   id: '1',
        //   name: '日常检查',
        //   organization: ['1', '2'],
        //   cycle: ['1', '2'],
        //   addVisible: 'true'
        // }
      ],
      orgOptions: [], // 组织机构
      cycleOptions: [] // 周期
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.currentPlanId = this.planId
      // this.fetchOrgOptions()
      this.fetchCycleOptions()
    })
    // this.currentPlanId = this.planId
    // this.fetchOrgOptions()
    // this.fetchCycleOptions()
    // this.fetchSortTableData(this.currentPlanId)
  },
  methods: {
    // 获取排查种类数据
    fetchSortTableData (val) {
      this.tablesLoading = true
      this.currentPlanId = val
      axios
        .get('investType/getInvTypePage', {
          // planId: this.currentPlanId,
          type: this.type
        })
        .then((res) => {
          if (res.data.code === 200) {
            let formatTableData = res.data.data
            console.log(formatTableData)
            formatTableData.forEach(item => {
              // item.addVisible = 'true'
              // if (item.investDept) {
              //   item.investDept = JSON.parse(item.investDept)
              // }
              if (item.investCycle) {
                item.investCycle = JSON.parse(item.investCycle)
              }
            })
            this.tableData = formatTableData
            console.log(this.tableData)
          }
        })
        .finally(() => {
          this.tablesLoading = false
        })
    },
    // 获取组织机构options
    fetchOrgOptions () {
      axios
        .get('investType/getInvDeptList')
        .then((res) => {
          if (res.data.code === 200) {
            this.orgOptions = res.data.data
          }
        })
        .finally(() => {
        })
    },
    // 获取周期设置options
    fetchCycleOptions () {
      axios
        .get('investType/getInvCycleList')
        .then((res) => {
          if (res.data.code === 200) {
            this.cycleOptions = res.data.data
          }
        })
        .finally(() => {
        })
    },
    // 保存排查种类
    submitSortForm () {
      let vm = this
      let sendData = {
        basicId: this.currentPlanId,
        spmInvestType: vm.tableData
      }
      this.submitting = true
      axios
        .post('investType/saveInvTypePage', sendData)
        .then((res) => {
          if (res.data.code === 200) {
            vm.$notify.success('排查种类更新成功')
            // 刷新数据
            this.$emit('reload')
            vm.show = false
          } else {
            vm.$message({
              message: res.data.message,
              type: 'warning'
            })
          }
        })
        .finally(() => {
          vm.submitting = false
          vm.show = false
        })
    },
    // 添加talbe行
    addTableRow (index, row, rows) {
      let newLineIndex = ++row.index
      let newLineOrg = row.investType + `(${newLineIndex})`
      let newLine = {
        index: newLineIndex,
        investTypeid: null,
        // investTypeid: row.investTypeid + `${newLineIndex}`,
        investType: newLineOrg,
        investDept: '',
        investCycle: '',
        addVisible: 'false',
        type: this.type
      }
      rows.splice(index + 1, 0, newLine)
    },
    // 删除talbe行
    delTableRow (index, rows, row) {
      rows.splice(index, 1)
      console.log(index)
      console.log(rows)
      console.log(row)
      // let sendData = {
      //   id: row.investTypeid
      // }
      // axios
      //   .delete('basticHidden/delBasicHidden', sendData)
      //   .then((res) => {
      //     if (res.data.code === 200) {
      //       this.$notify.success('删除成功')
      //       this.fetchTableData()
      //     }
      //   })
      //   .finally(() => {
      //   })
    },
    // 切换分页数量
    handleSizeChange (val) {
      this.fetchSortTableData(this.currentPlanId)
    },
    // 切换当前页页数
    handleCurrentChange (val) {
      this.page.index = val
      this.page.pageNo = val
      this.fetchSortTableData(this.currentPlanId)
    }
  },
  watch: {
    planId (val) {
      this.currentPlanId = val
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
@import '@/utils/css/tools/_variables.scss';
/deep/.el-icon-circle-plus-outline{
  margin-top: 2px;
  font-size: 20px;
  &:hover{
    color: $colorPrimary;
  }
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
</style>
