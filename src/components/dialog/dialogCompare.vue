<!-- 从机构树中选择人员信息的弹出框 -->
<!-- 说明：
  * 1、属性：dialogVisible：控制弹框显示的开关
  * 2、属性：dialogData：接收父组件传过来的数据
  * 3、事件：on-dialog-change：回传父组件弹框的显示状态
  * 4、事件：select-data：回传父组件需要的数据
 -->
<template>
  <el-dialog
    @close="closeDialog()"
    :close-on-click-modal="false"
    :visible.sync="show"
    width="80%">
    <template slot="title">
      {{dialogData.title || '弹框'}}
    </template>
    <div class="dialog-box">
      <div class="dialog-right-layout">
        <el-form
          :model="form"
          :rules="rules"
          ref="form"
          @submit.native.prevent="searchHandler('form')"
          :inline="true"
          size="small"
          class="table-form">
          <el-form-item label="分析类型">
            <el-select
              v-model="form.type"
              placeholder="请选择分析类型">
              <el-option
                v-for="(item, index) in analysisTypeOpt"
                :key="index"
                :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="层级" prop="deptIds">
            <el-cascader
              v-model="form.deptIds"
              placeholder="请选择层级"
              :options="deptData"
              :props="deptDataProps"
              collapse-tags
              clearable
              @change="cascaderChangeHandle"
              style="width: 460px"></el-cascader>
          </el-form-item>
          <el-form-item label="查询种类">
            <el-select
              v-model="form.kind"
              placeholder="请选择查询种类"
              @change="selectChangeSearchType">
              <el-option
                v-for="(item, index) in searchTypeOpt"
                :key="index"
                :label="item"
                :value="index+1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="时间1" prop="searchTimeOne">
            <span v-show="form.kind === 1">
              <el-date-picker
                v-model="form.searchTimeOne"
                type="date"
                placeholder="选择日"
                :picker-options= "pickerDisabled"
                value-format="yyyy-MM-dd"></el-date-picker>
            </span>
            <span v-show="form.kind === 2">
              <el-date-picker
                v-model="form.searchTimeOne"
                type="monthrange"
                placeholder="选择月"
                :picker-options= "pickerDisabled"
                value-format="yyyy-MM"></el-date-picker>
            </span>
            <span v-show="form.kind === 3">
              <el-date-picker
                v-model="form.searchTimeOne"
                type="year"
                value-format="yyyy"
                placeholder="选择年"
                :picker-options= "pickerOptionsBeginYear1"></el-date-picker>
              -
              <el-date-picker
                v-model="form.searchTimeOne"
                type="year"
                value-format="yyyy"
                placeholder="选择年"
                :picker-options= "pickerOptionsEndYear1"></el-date-picker>
            </span>
            <span v-show="form.kind === 4">
              <el-date-picker
                v-model="form.searchTimeOne"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"></el-date-picker>
            </span>
          </el-form-item>
          <el-form-item label="时间2" prop="searchTimeTwo">
            <span v-show="form.kind === 1">
              <el-date-picker
                v-model="form.searchTimeTwo"
                type="date"
                placeholder="选择日"
                value-format="yyyy-MM-dd"></el-date-picker>
            </span>
            <span v-show="form.kind === 2">
              <el-date-picker
                v-model="form.searchTimeTwo"
                type="monthrange"
                placeholder="选择月"
                value-format="yyyy-MM"></el-date-picker>
            </span>
            <span v-show="form.kind === 3">
              <el-date-picker
                v-model="form.searchTimeTwo"
                type="year"
                value-format="yyyy"
                placeholder="选择年"
                :picker-options= "pickerOptionsBeginYear2"></el-date-picker>
              -
              <el-date-picker
                v-model="form.searchTimeTwo"
                type="year"
                value-format="yyyy"
                placeholder="选择年"
                :picker-options= "pickerOptionsEndYear2"></el-date-picker>
            </span>
            <span v-show="form.kind === 4">
              <el-date-picker
                v-model="form.searchTimeTwo"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"></el-date-picker>
            </span>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              native-type="submit"
            >查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button
              class="export-btn"
              type="success"
              @click="exportHandler">导出</el-button>
          </el-form-item>
        </el-form>
        <div class="table-title">
          {{tableTitle}}
          <!-- <span class="value">xx</span>企业
          <span class="value">xx</span>月与<span class="value">xx</span>月
          <span class="value">xx</span>率 对比分析图表 -->
        </div>
        <el-tabs v-model="activeName" type="border-card">
          <el-tab-pane label="图表分析" name="1">
            <line-chart :chart="chartLineChart"></line-chart>
          </el-tab-pane>
          <el-tab-pane label="表格分析" name="2">
            <el-table
              :data="tableData"
              border
              style="width: 100%">
              <el-table-column
                prop="date"
                v-for="(item, index) in tableHeaderData"
                :key="index"
                align="center">
                <template slot="header">
                  {{tableHeaderData[index]}}
                </template>
                <template slot-scope="scope">
                  {{scope.row[index]}}
                </template>
              </el-table-column>
            </el-table>
            <div class="pagination-box">
              <el-pagination
                background
                hide-on-single-page
                layout="prev, pager, next"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page.index"
                :total="page.total">
              </el-pagination>
              <span class="page-info">每页{{page.pageSize}}条，共{{page.total}}条</span>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import axios from '@/api/axios'
import lineChart from '@/components/e-charts/lineChart.vue'
export default {
  name: 'treeDiagram',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    dialogData: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      activeName: '1',
      page: {
        total: 0, // 总条数
        index: 1, // 当前页面
        pageNo: 1,
        pageSize: 10 // limit
      },
      chartLineChart: {
        height: '400px',
        legend: [
          '7月隐患发生率', '7月全员参与率',
          '8月隐患发生率', '8月全员参与率',
          '9月隐患发生率', '9月全员参与率',
          '10月隐患发生率', '10月全员参与率'
        ],
        data: [
          {
            data1: 120,
            data2: 132,
            data3: 101,
            data4: 134,
            data5: 120,
            data6: 132,
            data7: 101,
            data8: 134,
            xAxisdata: '7.1/7.1'
          },
          {
            data1: 8,
            data2: 20,
            data3: 8,
            data4: 18,
            data5: 8,
            data6: 20,
            data7: 8,
            data8: 18,
            xAxisdata: '8.1/8.1'
          },
          {
            data1: 120,
            data2: 132,
            data3: 101,
            data4: 134,
            data5: 120,
            data6: 132,
            data7: 101,
            data8: 134,
            xAxisdata: '9.1/9.1'
          },
          {
            data1: 8,
            data2: 20,
            data3: 8,
            data4: 18,
            data5: 8,
            data6: 20,
            data7: 8,
            data8: 18,
            xAxisdata: '10.1/10.1'
          }
        ]
      },
      submitting: false,
      show: false,
      form: {
        type: '1', // 分析类型
        deptIds: '', // 层级
        deptId: '', // 层级
        kind: 1, // 查询种类
        searchTimeOne: '',
        searchTimeTwo: '',
        beginTimeOne: '',
        endTimeOne: '',
        beginTimeTwo: '',
        endTimeTwo: ''
      },
      rules: {
        deptIds: [
          { required: true, message: '层级不能为空', trigger: 'change' }
        ],
        searchTimeOne: [
          { required: true, message: '时间1不能为空', trigger: 'change' }
        ],
        searchTimeTwo: [
          { required: true, message: '时间2不能为空', trigger: 'change' }
        ]
      }, // form校验规则
      pickerDisabled: {
        // 验证时间范围：不能大于今天
        disabledDate: (time) => {
          return time.getTime() > Date.now() - 8.64e6
        }
      },
      pickerOptionsBeginYear1: {
        disabledDate: time => { // 禁止选择日期大于开始日期
          const endTime = this.form.endYear1
          return time.getTime() > new Date(endTime).getTime() - 8.64e7 ||
                 time.getTime() > Date.now() - 8.64e6
        }
      },
      pickerOptionsEndYear1: {
        disabledDate: time => { // 禁止选择日期小于开始日期
          const startTime = this.form.beginYear1
          return time.getTime() < new Date(startTime).getTime() ||
                 time.getTime() > Date.now() - 8.64e6
        }
      },
      pickerOptionsBeginYear2: {
        disabledDate: time => { // 禁止选择日期大于开始日期
          const endTime = this.form.endYear2
          return time.getTime() > new Date(endTime).getTime() - 8.64e7 ||
                 time.getTime() > Date.now() - 8.64e6
        }
      },
      pickerOptionsEndYear2: {
        disabledDate: time => { // 禁止选择日期小于开始日期
          const startTime = this.form.beginYear2
          return time.getTime() < new Date(startTime).getTime() ||
                 time.getTime() > Date.now() - 8.64e6
        }
      },
      tableTitle: '', // 表的标题
      tableHeaderData: [], // 表头数据
      tableData: [], // 表数据
      searchTypeOpt: [
        '按日查询',
        '按月查询',
        '按年查询',
        '按时间段查询'
      ], // 查询种类的下拉选项
      analysisTypeOpt: [
        {
          label: '全员参与率',
          value: '1'
        },
        {
          label: '隐患发生率',
          value: '2'
        },
        {
          label: '隐患符合率',
          value: '3'
        },
        {
          label: '隐患整改率',
          value: '4'
        }
      ], // 分析类型的下拉选项
      deptDataProps: {
        multiple: true,
        label: 'invDeptName',
        value: 'invDeptId'
      }, // 层级的组件配置项
      selectCascadersData: [], // 层级选中数据集合
      deptData: [] // 层级
    }
  },
  created () {
    this.initData()
  },
  methods: {
    // 初始化数据
    initData () {
      this.getDeptData()
    },
    // 关闭弹框
    closeDialog () {
      this.show = false
    },
    // 切换分页数量
    handleSizeChange (val) {
      this.fetchList()
    },
    // 切换当前页页数
    handleCurrentChange (val) {
      this.page.index = val
      this.page.pageNo = val
      this.fetchList()
    },
    // 级联选择框选中事件处理，格式化选中的数据
    cascaderChangeHandle (data) {
      this.selectCascadersData = []
      data.forEach(item => {
        this.selectCascadersData.push(item.slice(-1).toString())
      })
      this.selectCascadersData = this.selectCascadersData.toString()
      this.form.deptId = this.selectCascadersData
    },
    exportHandler () {
    },
    selectChangeSearchType (value) {
      this.form.kind = value
      this.form.searchTimeOne = null
      this.form.searchTimeTwo = null
    },
    // 获取table列表
    fetchList () {
      const postData = {
        type: this.form.type, // 分析类型
        deptId: this.form.deptId, // 层级
        kind: this.form.kind, // 查询种类
        beginTimeOne: '',
        endTimeOne: '',
        beginTimeTwo: '',
        endTimeTwo: '',
        pageNo: 1,
        pageSize: 10
      }
      if (this.form.searchTimeOne && Array.isArray(this.form.searchTimeOne)) {
        postData.beginTimeOne = this.form.searchTimeOne[0]
        postData.endTimeOne = this.form.searchTimeOne[1]
      } else {
        postData.beginTimeOne = this.form.searchTimeOne
        postData.endTimeOne = this.form.endTimeOne
      }
      if (this.form.searchTimeTwo && Array.isArray(this.form.searchTimeTwo)) {
        postData.beginTimeTwo = this.form.searchTimeOne[0]
        postData.endTimeTwo = this.form.searchTimeTwo[1]
      } else {
        postData.beginTimeTwo = this.form.searchTimeTwo
        postData.endTimeTwo = this.form.endTimeOne
      }
      axios
        .get('safeAnalysis/analyseRate', postData)
        .then((res) => {
          if (res.data.code === 200) {
            this.tableHeaderData = res.data.data.tableHeaderData
            this.tableData = res.data.data.tableData
            this.tableTitle = res.data.data.title
          } else {
            this.$message({
              message: res.data.message,
              type: 'warning'
            })
          }
        })
    },
    // 获取组织机构树
    getDeptData () {
      axios
        .get('basticHidden/getDeptListSize')
        .then((res) => {
          if (res.data.code === 200) {
            this.deptData = res.data.data
          } else {
            this.$message({
              message: res.data.message,
              type: 'warning'
            })
          }
        })
    },
    /**
     * 表单查询事件
     */
    searchHandler (formName) {
      // form.pageNo = 1
      // this.tableSearchForm.pageNo = 1
      const specialKey = ['%', "'", ',', '，', '.', '。']
      // 特殊字符校验
      try {
        Object.keys(this.form).forEach(key => {
          if (specialKey.includes(this.form[key])) {
            this.$message.error(
              '查询条件不能为特殊字符百分号[ % ] 、单引号[ ' + "'" + ' ] 以及中英文标点符号[ ，。. ]'
            )
          }
        })
      } catch (e) {
        return
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.fetchList()
        } else {
          return false
        }
      })
    }
  },
  components: {
    lineChart
  },
  watch: {
    dialogVisible (val) {
      this.show = val
    },
    show (val) {
      this.$emit('on-dialog-change', val)
    }
  }
}
</script>

<style scoped lang="scss">
  .layout-around{
    display: flex;
    padding-top: 20px;
    .item-left{
      flex: 0 0 340px;
    }
    .item-right{
      width: 100%;
      // width: calc(100% - 200px);
      height: 100%;
      // margin-left: 40px;
    }
  }
  .dialog-right-layout{
    width: 100%;
  }
  .form-left{
    .el-form-item{
      margin-bottom: 0;
    }
  }
  .dialog-title{
    font-size: 16px;
    color: #666666;
  }
  .form-group-btn{
    height: 40px;
  }
  .pagination-box{
    display: flex;
    align-items: center;
    justify-content: flex-end;
    text-align: right;
    font-size: 14px;
    margin-top: 10px;
  }
  .table-title{
    padding-bottom: 30px;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
  }
</style>
