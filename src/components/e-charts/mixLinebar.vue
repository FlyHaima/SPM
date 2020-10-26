<template>
 <div class="mix-line-bar">
    <div class="info-box">
      <div class="label-box">
        <span class="label">{{companyName}}企业（按查询条件 {{time[0]}} {{changeOptions[changeDateVal]}}- {{time[time.length-1]}} {{changeOptions[changeDateVal]}}）安全指数分析图</span>
      </div>
      <span class="info-text">参与员工数量: <span class="value" @click = 'showStaff'> {{testNameDate.userCount}}</span></span>
      <span class="info-text">隐患发生数量: <span class="value" @click = 'showhidden'>{{testNameDate.hiddenCount}}</span></span>
    </div>
    <div :id="echart" :style= "{height: `${chartWidth}`}" ></div>

    <el-dialog title="参与员工数量" :visible.sync="isShowStaff" append-to-body width = "1300px">
      <div class="search-box">
      <span class="search-info">员工姓名</span><el-input v-model="userSearchform.userName" placeholder="请输入内容" class="search-ipt"></el-input>
      <span class="search-info">部门</span><el-input v-model="userSearchform.deptName" placeholder="请输入内容" class="search-ipt"></el-input>
      <span class="search-info">职位</span><el-input v-model="userSearchform.position" placeholder="请输入内容" class="search-ipt"></el-input>
      <span class="search-info">发送时间</span><el-date-picker
      class="search-time-ipt search-ipt"
      v-model="changeSearchTime"
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期">
    </el-date-picker>
    <el-button type="primary" @click = "fetchUserTableData">查询</el-button>
      </div>
      <el-table
        v-loading="loading"
        :data="tableDataA"
        stripe
        style="width: 100%">
      <el-table-column
        prop="user_name"
        label="员工姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="dept_name"
        label="部门"
        width="180">
      </el-table-column>
      <el-table-column
        prop="position"
        label="职位">
      </el-table-column>
      <el-table-column
        prop="telephone"
        label="联系方式">
      </el-table-column>
      <el-table-column
        prop="setTime"
        label="发送时间">
      </el-table-column>
</el-table>
      <div class="el-pagination__wrap text-right">
        <el-pagination
          background
          layout="prev, pager, next"
          :current-page="paginationpage.pageNo"
          :page-sizes="paginationpage.sizes"
          :total="paginationpage.total"
          @current-change="handleCurrentChangeUser">
        </el-pagination>
      </div>
    </el-dialog>
    <el-dialog title="隐患发生数量" :visible.sync="isShowhidden" append-to-body width = "1300px">
      <div class="search-box">
        <span class="search-info">检查名称</span><el-input v-model="hiddSearchform.userName" placeholder="请输入内容" class="search-ipt"></el-input>
        <span class="search-info">治理人</span><el-input v-model="hiddSearchform.deptName" placeholder="请输入内容" class="search-ipt"></el-input>
        <span class="search-info">隐患类型</span><el-input v-model="hiddSearchform.hiddenType" placeholder="请输入内容" class="search-ipt"></el-input>
      <el-button type="primary" @click = "fetchHiddTableData">查询</el-button>
        </div>
      <el-table
      :data="tableDataB"
      v-loading="loading"
      stripe
      style="width: 100%">
    <el-table-column
      prop="checkName"
      label="检查名称"
      width="180">
    </el-table-column>
    <el-table-column
      prop="checkTime"
      label="检查时间"
      width="180">
    </el-table-column>
    <el-table-column
      prop="hiddenDesc"
      label="隐患描述">
    </el-table-column>
    <el-table-column
      prop="hiddenType"
      label="隐患类型">
    </el-table-column>
    <el-table-column
      prop="user_name"
      label="治理人">
    </el-table-column>
    <el-table-column
      prop="telephone"
      label="联系方式">
    </el-table-column>
    <el-table-column
      prop="actState"
      label="进度">
    </el-table-column>
    <el-table-column
      prop="sendtime"
      label="治理完成情况">
    </el-table-column>
    </el-table>
    <div class="el-pagination__wrap text-right">
      <el-pagination
        background
        layout="prev, pager, next"
        :current-page="paginationpage.pageNo"
        :page-sizes="paginationpage.sizes"
        :total="paginationpage.total"
        @current-change="handleCurrentChangeHidd">
      </el-pagination>
    </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from '@/api/axios'
import moment from 'moment'
export default {
  data () {
    return {
      time: [],
      userSearchform: { // 员工搜索条件
        userName: '', // 员工姓名
        deptName: '', // 部门
        position: '', // 职位
        cBeginTime: '', // 开始时间（查询）
        cEndTime: '', // 结束时间（查询）
        beginTime: '',
        endTime: '',
        type: '',
        pageNo: 1,
        pageSize: 10
      },
      isShowStaff: false,
      isShowhidden: false,
      hiddSearchform: { // 隐患搜索条件
        userName: '',
        checkName: '',
        hiddenType: '',
        beginTime: '',
        endTime: '',
        type: '',
        pageNo: 1,
        pageSize: 2
      },
      paginationpage: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      changeSearchTime: [], // 选择搜索时间
      tableDataA: [], // 员工数量表格数据
      tableDataB: [], // 隐患数量表格数据
      typeName: {
        userCount: '', // 参与员工
        hiddenCount: '' // 隐患发生
      },
      testNameDate: {
        userCount: '', // 标题  参与员工
        hiddenCount: '' // 标题  隐患发生
      },
      qycyDate: { // 全员参与率
        type: '',
        name: '',
        value: []
      },
      yhfaDate: { // 隐患发生率
        type: '',
        name: '',
        value: []
      },
      yhfhDate: { // 隐患符合
        type: '',
        name: '',
        value: []
      },
      yhzgDate: { // 隐患整改
        type: '',
        name: '',
        value: []
      },
      changeOptions: ['日', '月', '年', '时间区间'],
      companyName: '',
      loading: false
    }
  },
  props: {
    chartWidth: {
      type: String,
      default: ''
    },
    mixLinebarData: {
      type: Object,
      defoult: null
    },
    changeDateVal: {
      type: Number,
      default: null
    }
  },
  components: {

  },
  mounted () {
  },
  methods: {
    setEchart (opt) {
      this.defactoringData()
      let chartDom = document.getElementById(this.echart)
      let myChart = this.$echarts.init(chartDom)
      window.onresize = myChart.resize()

      // 绘制图表
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        toolbox: {
          feature: {
            dataView: {show: true, readOnly: false},
            magicType: {show: true, type: ['line', 'bar']},
            restore: {show: true},
            saveAsImage: {show: true}
          }
        },
        legend: {
          data: this.typeName
        },
        xAxis: [
          {
            type: 'category',
            data: this.time,
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            min: 0,
            max: 100,
            interval: 20,
            axisLabel: {
              formatter: '{value} %'
            }
          }
        ],
        color: ['#62d1de', '#54d6b6', '#a6db69', ' #409eff'],
        series: [
          {
            name: this.qycyDate.name,
            type: 'bar',
            data: this.qycyDate.value
          },
          {
            name: this.yhfaDate.name,
            type: 'bar',
            data: this.yhfaDate.value
          },
          {
            name: this.yhfhDate.name,
            type: 'line',
            data: this.yhfhDate.value
          },
          {
            name: this.yhzgDate.name,
            type: 'line',
            data: this.yhzgDate.value
          }
        ]
      }
      myChart.setOption(option)
    },
    defactoringData () {
      let data = this.mixLinebarData
      this.userSearchform.beginTime = data.beginTime
      this.userSearchform.endTime = data.endTime
      this.typeName = []
      this.time = data.time
      data.data.forEach(item => {
        this.typeName.push(item.name)
      })
      this.qycyDate = data.data[0]
      for (let i = 0; i < this.qycyDate.value.length; i++) {
        this.qycyDate.value[i] = Math.round(this.qycyDate.value[i] * 1000) / 100
      }
      this.yhfaDate = data.data[1]
      for (let i = 0; i < this.yhfaDate.value.length; i++) {
        this.yhfaDate.value[i] = Math.round(this.yhfaDate.value[i] * 1000) / 100
      }
      this.yhfhDate = data.data[2]
      for (let i = 0; i < this.yhfaDate.value.length; i++) {
        this.yhfhDate.value[i] = Math.round(this.yhfhDate.value[i] * 1000) / 100
      }
      this.yhzgDate = data.data[3]
      for (let i = 0; i < this.yhzgDate.value.length; i++) {
        this.yhzgDate.value[i] = Math.round(this.yhzgDate.value[i] * 1000) / 100
      }
      this.companyName = data.companyName
      this.testNameDate.userCount = data.userCount
      this.testNameDate.hiddenCount = data.hiddenCount
      this.userSearchform.beginTime = data.beginTime
      this.userSearchform.endTime = data.endTime
      this.userSearchform.type = this.changeDateVal
      this.hiddSearchform.beginTime = data.beginTime
      this.hiddSearchform.endTime = data.endTime
      this.hiddSearchform.type = this.changeDateVal
    },
    showStaff () { // 显示员工参与数量 初始化筛选条件
      this.isShowStaff = true
      this.userSearchform.userName = ''
      this.userSearchform.deptName = ''
      this.userSearchform.position = ''
      this.userSearchform.pageNo = 1
      this.changeSearchTime = []
      this.fetchUserTableData()
    },
    showhidden () { // 显示隐患数量 初始化筛选条件
      this.isShowhidden = true
      this.hiddSearchform.userName = ''
      this.hiddSearchform.checkName = ''
      this.hiddSearchform.hiddenType = ''
      this.hiddSearchform.pageNo = 1
      this.fetchHiddTableData()
    },
    fetchUserTableData () { // 0 代表第一个图的  1 代表第二个图
      this.loading = true
      if (this.changeSearchTime.length !== 0) {
        const time = this.changeSearchTime
        this.userSearchform.cBeginTime = moment(time[0]).format('YYYY-MM-DD')
        this.userSearchform.cEndTime = moment(time[1]).format('YYYY-MM-DD')
      }
      axios
        .get('safeAnalysis/getUserList', this.userSearchform)
        .then((res) => {
          if (res.data.code === 200) {
            let data = res.data.data
            this.paginationpage.total = data.total
            data.list.forEach(item => {
              item.setTime = moment(item.setTime).format('YYYY-MM-DD')
            })
            this.tableDataA = data.list
            this.loading = false
          }
        })
    },
    fetchHiddTableData () {
      this.loading = true
      axios
        .get('safeAnalysis/getHiddenList', this.hiddSearchform)
        .then((res) => {
          if (res.data.code === 200) {
            let data = res.data.data
            this.paginationpage.total = data.total
            data.list.forEach(item => {
              item.checkTime = moment(item.checkTime).format('YYYY-MM-DD')
            })
            this.tableDataB = data.list
            this.loading = false
          }
        })
    },
    handleCurrentChangeUser (val) {
      this.userSearchform.pageNo = val
      this.fetchUserTableData()
    },
    handleCurrentChangeHidd (val) {
      this.hiddSearchform.pageNo = val
      this.fetchHiddTableData()
    }
  },

  watch: {
    mixLinebarData: {
      deep: true,
      handler: function (val) {
        this.defactoringData()
        this.setEchart()
      }

    }
  },
  computed: {
    // 计算随机数id
    echart () {
      return 'echart' + Math.random() * 100000
    }
  }
}
</script>

<style>
.info-text{
    display: inline-block;
    margin-right: 20px;
    margin-bottom: 20px;
}
.label-box{
  margin: 5px 0;
}
.value{
  color: #409eff;
  cursor: pointer;
}
.search-box{
  margin-bottom: 36px;
}
.search-ipt{
  width: 140px;
  margin: 0 20px;
}

</style>
