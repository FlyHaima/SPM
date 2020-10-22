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
          @submit.native.prevent="searchHandler"
          :inline="true"
          size="small"
          class="table-form">
          <el-form-item label="分析类型">
            <el-select
              v-model="form.state"
              placeholder="请选择分析类型">
              <el-option
                v-for="(item, index) in analysisTypeOpt"
                :key="index"
                :label="item"
                :value="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="层级">
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
              v-model="form.searchType"
              placeholder="请选择查询种类"
              @change="selectChangeSearchType">
              <el-option
                v-for="(item, index) in searchTypeOpt"
                :key="index"
                :label="item"
                :value="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="时间1">
            <span v-show="form.searchType === 0">
              <el-date-picker
                v-model="form.date1"
                type="date"
                placeholder="选择日"
                :picker-options= "pickerDisabled"></el-date-picker>
            </span>
            <span v-show="form.searchType === 1">
              <el-date-picker
                v-model="form.searchMonth1"
                type="monthrange"
                placeholder="选择月"
                :picker-options= "pickerDisabled"></el-date-picker>
            </span>
            <span v-show="form.searchType === 2">
              <el-date-picker
                v-model="form.beginYear1"
                type="year"
                value-format="yyyy"
                placeholder="选择年"
                :picker-options= "pickerOptionsBeginYear1"></el-date-picker>
              -
              <el-date-picker
                v-model="form.endYear1"
                type="year"
                value-format="yyyy"
                placeholder="选择年"
                :picker-options= "pickerOptionsEndYear1"></el-date-picker>
            </span>
            <span v-show="form.searchType === 3">
              <el-date-picker
                v-model="searchTime1"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"></el-date-picker>
            </span>
          </el-form-item>
          <el-form-item label="时间2">
            <span v-show="form.searchType === 0">
              <el-date-picker
                v-model="form.date2"
                type="date"
                placeholder="选择日"></el-date-picker>
            </span>
            <span v-show="form.searchType === 1">
              <el-date-picker
                v-model="form.searchMonth2"
                type="monthrange"
                placeholder="选择月"></el-date-picker>
            </span>
            <span v-show="form.searchType === 2">
              <el-date-picker
                v-model="form.beginYear2"
                type="year"
                value-format="yyyy"
                placeholder="选择年"
                :picker-options= "pickerOptionsBeginYear2"></el-date-picker>
              -
              <el-date-picker
                v-model="form.endYear2"
                type="year"
                value-format="yyyy"
                placeholder="选择年"
                :picker-options= "pickerOptionsEndYear2"></el-date-picker>
            </span>
            <span v-show="form.searchType === 3">
              <el-date-picker
                v-model="searchTime2"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"></el-date-picker>
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
        <el-tabs type="border-card">
          <el-tab-pane label="重大风险">
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
          </el-tab-pane>
          <el-tab-pane label="配置管理" name="2">
            <line-chart :chart="chartLineChart"></line-chart>
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
      searchTime1: '',
      searchTime2: '',
      searchMonth1: '',
      searchMonth2: '',
      form: {
        state: '',
        deptIds: '', // 层级
        deptIdStr: '', // 层级
        searchType: 0, // 查询种类
        date1: '',
        beginMonth1: '',
        endMonth1: '',
        beginYear1: '',
        endYear1: '',
        beginTime1: '',
        endTime1: '',
        date2: '',
        beginMonth2: '',
        endMonth2: '',
        beginYear2: '',
        endYear2: '',
        beginTime2: '',
        endTime2: ''
      },
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
      tableHeaderData: ['时间1', '已参与人数', '总人数', '全员参与率', '时间2', '已参与人数', '总人数', '全员参与率', '同比增减'],
      tableData: [
        ['2016-05-03', '23', '45', '5%', '2016-05-03', '34', '78', '5%', '6%'],
        ['2016-05-04', '25', '40', '5%', '2016-05-03', '34', '78', '5%', '6%'],
        ['2016-05-05', '27', '48', '5%', '2016-05-03', '34', '78', '5%', '6%'],
        ['2016-05-03', '23', '45', '5%', '2016-05-03', '34', '78', '5%', '6%'],
        ['2016-05-04', '25', '40', '5%', '2016-05-03', '34', '78', '5%', '6%'],
        ['2016-05-05', '27', '48', '5%', '2016-05-03', '34', '78', '5%', '6%'],
        ['2016-05-03', '23', '45', '5%', '2016-05-03', '34', '78', '5%', '6%'],
        ['2016-05-04', '25', '40', '5%', '2016-05-03', '34', '78', '5%', '6%'],
        ['2016-05-05', '27', '48', '5%', '2016-05-03', '34', '78', '5%', '6%']
      ],
      searchTypeOpt: [
        '按日查询',
        '按月查询',
        '按年查询',
        '按时间段查询'
      ],
      analysisTypeOpt: [
        '全员参与率',
        '隐患发生率',
        '隐患符合率',
        '隐患整改率'
      ],
      deptDataProps: {
        multiple: true,
        label: 'invDeptName',
        value: 'invDeptId'
      },
      selectCascadersData: [],
      deptData: [{
        value: 1,
        label: '东南',
        children: [{
          value: 2,
          label: '上海',
          children: [
            { value: 3, label: '普陀' },
            { value: 4, label: '黄埔' },
            { value: 5, label: '徐汇' }
          ]
        }, {
          value: 7,
          label: '江苏',
          children: [
            { value: 8, label: '南京' },
            { value: 9, label: '苏州' },
            { value: 10, label: '无锡' }
          ]
        }, {
          value: 12,
          label: '浙江',
          children: [
            { value: 13, label: '杭州' },
            { value: 14, label: '宁波' },
            { value: 15, label: '嘉兴' }
          ]
        }]
      }, {
        value: 17,
        label: '西北',
        children: [{
          value: 18,
          label: '陕西',
          children: [
            { value: 19, label: '西安' },
            { value: 20, label: '延安' }
          ]
        }, {
          value: 21,
          label: '新疆维吾尔族自治区',
          children: [
            { value: 22, label: '乌鲁木齐' },
            { value: 23, label: '克拉玛依' }
          ]
        }]
      }]
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
    // tab切换事件
    clickTab (item) {
      console.log(item)
      // this.tables.form.tabType = (Number(item.paneName) + 1) + ''
    },
    // 级联选择框选中事件处理，格式化选中的数据
    cascaderChangeHandle (data) {
      console.log(data)
      this.selectCascadersData = []
      data.forEach(item => {
        this.selectCascadersData.push(item.slice(-1).toString())
      })
      this.selectCascadersData = this.selectCascadersData.toString()
      this.form.deptIdStr = this.selectCascadersData
    },
    exportHandler () {
    },
    selectChangeSearchType (value) {
      this.form.searchType = value
      this.form.beginDate = ''
      this.form.endDate = ''
      this.form.beginMonth = ''
      this.form.endMonth = ''
      this.form.beginYear = ''
      this.form.endYear = ''
      this.form.beginTime = ''
      this.form.endTime = ''
    },
    // 获取table列表
    fetchList () {
      alert('cc')
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
    searchHandler () {
      console.log(this.form)
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
      this.fetchList()
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
</style>
