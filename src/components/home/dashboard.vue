
<template>
  <div class="view-box view-box-dashboard">
    <div class="view-box-content">
      <el-card class="box-card-basic" shadow="never">
        <el-row :gutter="20">
          <el-col class="basic-item" :span="4">
            <div class="label">用户数量:</div>
            <div class="value">{{basicData.userCount}}</div>
          </el-col>
          <el-col class="basic-item" :span="4">
            <div class="label">本日隐患发生的数量:</div>
            <div class="value">{{basicData.hiddenCount}}</div>
          </el-col>
          <el-col class="basic-item" :span="4">
            <div class="label">重大风险:</div>
            <div class="value">{{basicData.zdCount}}</div>
          </el-col>
          <el-col class="basic-item" :span="4">
            <div class="label">较大风险:</div>
            <div class="value">{{basicData.jdCount}}</div>
          </el-col>
          <el-col class="basic-item" :span="4">
            <div class="label">一般风险:</div>
            <div class="value">{{basicData.ybCount}}</div>
          </el-col>
          <el-col class="basic-item" :span="4">
            <div class="label">低风险:</div>
            <div class="value">{{basicData.dCount}}</div>
          </el-col>
        </el-row>
      </el-card>
      <div class="home-header">
        <div class="home-header-left">
          <i class="home-header-icon"></i>
          <span class="home-header-txt">我的消息</span>
        </div>
        <el-carousel
          height="16px"
          direction="vertical"
          :autoplay="true"
          class="list-info">
          <el-carousel-item
            v-for="(item, index) in messageData"
            :key="index"
            class="list-info-item">
              <div @click="goDetailsPage(item)" class="list-info-title">
                <span class="list-info-txt">{{item.title}}</span>
              </div>
              <div class="list-info-date">{{item.sendTime | date-filter}}</div>
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="home-showcase">
        <div class="flex-layout">
          <div class="home-entrance">
            <div class="entrance-btn">
              <span class="entrance-btn-txt">快速进入</span>
              <i class="entrance-btn-icon"></i>
            </div>
            <div class="entrance-menu">
              <div
                v-for=" (item, index) in enterData"
                :key = index
                @click="turnToPage(item.url)"
                class="entrance-menu-item">
                <div class="entrance-menu-icon-wrap">
                  <i class="entrance-menu-icon"></i>
                </div>
                <div class="entrance-menu-txt">{{item.name}}</div>
              </div>
            </div>
          </div>
          <div class="info-panel">
            <div class="info-header" style="border: 0;">
              <div class="info-title">
                <span class="info-title-txt">风险动态显示</span>
              </div>
              <!-- <div class="info-link">
                <a
                  href="javascript:;"
                  @click=" goMorePage() "
                  class="info-link-txt">更多</div>
              </div> -->
            </div>
            <div class="info-content">
              <gauge
                class="gauge"
                :chart-data="gaugeData">
                <div class="gauge-tabs-box">
                  <el-tabs class="gauge-tabs" type="border-card">
                    <el-tab-pane class="gauge-tab-pane" label="重大风险">
                      <div class="custom-table gauge-table">
                        <div class="custom-theader">
                          <div class="custom-tr is-flex">
                            <div class="custom-th-label">点：{{tabaleHeaderData1.dot}}%</div>
                            <div class="custom-th-label">线：{{tabaleHeaderData1.line}}%</div>
                            <div class="custom-th-label">面：{{tabaleHeaderData1.surface}}%</div>
                          </div>
                        </div>
                        <div
                          class="custom-tbody">
                          <div class="custom-tr is-flex">
                            <div
                              v-for="(item, index) in tableData1"
                              :key=index
                              class="custom-td-value">
                              <el-tag
                                class="tag-danger"
                                type="danger"
                                effect="dark"
                                size="mini">{{item.value}}个</el-tag>
                            </div>
                            <!-- <div class="custom-td-value">
                              <el-tag
                                class="tag-danger"
                                type="danger"
                                effect="dark"
                                size="mini">标签五</el-tag>
                            </div>
                            <div class="custom-td-value">
                              <el-tag
                                class="tag-danger"
                                type="danger"
                                effect="dark"
                                size="mini">标签五</el-tag>
                            </div> -->
                          </div>
                        </div>

                      </div>
                    </el-tab-pane>
                    <el-tab-pane label="较大风险">
                      <div class="custom-table gauge-table">
                        <div class="custom-theader">
                          <div class="custom-tr is-flex">
                            <div class="custom-th-label">点：{{tabaleHeaderData2.dot}}%</div>
                            <div class="custom-th-label">线：{{tabaleHeaderData2.line}}%</div>
                            <div class="custom-th-label">面：{{tabaleHeaderData2.surface}}%</div>
                          </div>
                        </div>
                        <div
                          class="custom-tbody">
                          <div class="custom-tr is-flex">
                            <div
                              v-for="(item, index) in tableData2"
                              :key=index
                              class="custom-td-value">
                              <el-tag
                                class="tag-danger"
                                type="danger"
                                effect="dark"
                                size="mini">{{item.value}}个</el-tag>
                            </div>
                          </div>
                        </div>
                      </div>
                    </el-tab-pane>
                    <el-tab-pane label="一般风险">
                      <div class="custom-table gauge-table">
                        <div class="custom-theader">
                          <div class="custom-tr is-flex">
                            <div class="custom-th-label">点：{{tabaleHeaderData3.dot}}%</div>
                            <div class="custom-th-label">线：{{tabaleHeaderData3.line}}%</div>
                            <div class="custom-th-label">面：{{tabaleHeaderData3.surface}}%</div>
                          </div>
                        </div>
                        <div
                          class="custom-tbody">
                          <div class="custom-tr is-flex">
                            <div
                              v-for="(item, index) in tableData3"
                              :key=index
                              class="custom-td-value">
                              <el-tag
                                class="tag-danger"
                                type="danger"
                                effect="dark"
                                size="mini">{{item.value}}个</el-tag>
                            </div>
                          </div>
                        </div>
                      </div>
                    </el-tab-pane>
                    <el-tab-pane label="低风险">
                      <div class="custom-table gauge-table">
                        <div class="custom-theader">
                          <div class="custom-tr is-flex">
                            <div class="custom-th-label">点：{{tabaleHeaderData4.dot}}%</div>
                            <div class="custom-th-label">线：{{tabaleHeaderData4.line}}%</div>
                            <div class="custom-th-label">面：{{tabaleHeaderData4.surface}}%</div>
                          </div>
                        </div>
                        <div
                          class="custom-tbody">
                          <div class="custom-tr is-flex">
                            <div
                              v-for="(item, index) in tableData4"
                              :key=index
                              class="custom-td-value">
                              <el-tag
                                class="tag-danger"
                                type="danger"
                                effect="dark"
                                size="mini">{{item.value}}个</el-tag>
                            </div>
                          </div>
                        </div>
                      </div>
                    </el-tab-pane>
                  </el-tabs>
                </div>
              </gauge>
            </div>
          </div>
        </div>
      </div>
      <div class="home-showcase">
        <el-row>
          <el-col :xl="24" :lg="24">
            <div class="info-panel">
              <div class="info-header">
                <div class="info-title">
                  <span class="info-title-txt">安全指数分析</span>
                </div>
                <div class="info-btn">
                  <!-- v-if= "fucBtns.includes('compare-search-btn')" -->
                  <!-- v-if= "fucBtns.includes('compare-analysis-btn')" -->
                  <el-button v-if= "fucBtns.includes('compare-search-btn')" @click="showComparison()" size="small" type="primary">对比查询</el-button>
                  <el-button v-if= "fucBtns.includes('compare-analysis-btn')" @click="compareAnalysisHandle()" size="small" type="primary">对比分析</el-button>
                </div>
              </div>
              <div class="info-content">
                <div class="pie-list-box">
                  <div
                    v-for="item in pieOptions"
                    :key="item.id"
                    class="pie-box">
                    <pie-c
                      :return-data = "item.pieData"
                      :title = "item.title"
                      :color-list = "item.colorList"
                      :pie-height = "pieHeight"
                       >
                       <div class="pie-tips">
                         <p class="pie-tips-item">
                           <i class="pie-tips-sign">*</i>
                           {{item.tipsTextA}}
                         </p>
                         <p class="pie-tips-item">{{item.tipsTextB}}</p>
                         <p class="pie-tipdivs-item">
                           {{item.participationRate}}%
                         </p>
                       </div>
                       </pie-c>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="home-showcase">
        <div class="info-panel">
          <div class="info-header">
            <div class="info-title">
              <span class="info-title-txt">现有风险等级情况</span>
            </div>
          </div>
          <div class="info-content">
            <div class="statistic-box">
              <statistic-e
                :chart-data = "chartData"
                :chart-height = "chartHeight"
              ></statistic-e>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      title="查询"
      :visible.sync="isShowComparison"
      width = "1200px"
      @closed = "destroyOnClose"
      >
      <div class="info-content">
        <div class="content-first">
          <span>查询种类</span>
          <el-select v-model="changeDateValA" placeholder="请选择" @change='emptyValA'>
            <el-option
              v-for="(item, index) in changeDateOptions"
              :key="index"
              :label="item"
              :value="index"
              >
            </el-option>
          </el-select>
            <div class="is-show-data" v-show='changeDateValA == 0'>
              <span class="demonstration">选择时间</span>
            <el-date-picker
              v-model="tipsDateDataA"
              type="date"
              >
            </el-date-picker>
            </div>
            <div class="is-show-data" v-show='changeDateValA == 1'>
              <span class="demonstration">选择时间</span>
            <el-date-picker
              value-format="yyyy-MM"
              v-model="tipsDateDataA"
              type="monthrange"
              >
            </el-date-picker>
            </div>
            <div class="is-show-data" v-show='changeDateValA == 2'>
              <span class="demonstration">选择时间</span>
            <el-date-picker
              v-model="yearsDateDataA.yearsDatestart"
              value-format="timestamp"
              type="year"
              :picker-options= "startDateA"
              >
            </el-date-picker>
            -
            <el-date-picker
              v-model="yearsDateDataA.yearsDateend"
              value-format="timestamp"
              type="year"
              :picker-options= "endDateA"
              >
            </el-date-picker>
            </div>
            <div class="is-show-data" v-show='changeDateValA == 3'>
              <span class="demonstration">选择时间</span>
            <el-date-picker
              v-model="tipsDateDataA"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              >
            </el-date-picker>
            </div>
            <el-button type="primary" @click='getCountUserRisk(changeDateValA, tipsDateDataA,  yearsDateDataA, 0)'>查询</el-button>
          <div class="info-chart-box">
            <mix-linebar
              :chart-width = "chartWidth"
              :mixLinebarData = "mixLinebarDataA"
              :changeDateVal = "changeDateValA"
              v-loading = "echartloading"
            ></mix-linebar>
          </div>
        </div>
        <div class="content-second">
          <span>查询种类</span>
          <el-select v-model="changeDateValB" placeholder="请选择" @change='emptyValB'>
            <el-option
              v-for="(item, index) in changeDateOptions"
              :key="index"
              :label="item"
              :value="index"
              >
            </el-option>
          </el-select>
            <div class="is-show-data" v-show='changeDateValB == 0'>
              <span class="demonstration" required>选择时间</span>
            <el-date-picker
              v-model="tipsDateDataB"
              type="date"
              >
            </el-date-picker>
            </div>
            <div class="is-show-data" v-show='changeDateValB == 1'>
              <span class="demonstration" required>选择时间</span>
            <el-date-picker
              v-model="tipsDateDataB"
              type="monthrange"
              >
            </el-date-picker>
            </div>
            <div class="is-show-data" v-show='changeDateValB == 2'>
              <span class="demonstration" required>选择时间</span>
            <el-date-picker
              v-model="yearsDateDataB.yearsDatestart"
              type="year"
              :picker-options= "endDateB"
              value-format="yyyy"
              >
            </el-date-picker>
            -
            <el-date-picker
              v-model="yearsDateDataB.yearsDateend"
              type="year"
              :picker-options= "endDateB"
              value-format="yyyy"
              >
            </el-date-picker>
            </div>
            <div class="is-show-data" v-show='changeDateValB == 3'>
              <span class="demonstration" required>选择时间</span>
            <el-date-picker
              v-model="tipsDateDataB"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              >
            </el-date-picker>
            </div>
            <el-button type="primary" @click='getCountUserRisk(changeDateValB, tipsDateDataB,  yearsDateDataB, 1)'>查询</el-button>
          <div class="info-chart-box">
            <mix-linebar
              :chart-width = "chartWidth"
              :mixLinebarData = "mixLinebarDataB"
              :changeDateVal = "changeDateValB"
              v-loading = "echartloading"
            ></mix-linebar>
          </div>
        </div>
      </div>
    </el-dialog>
    <dialog-compare
      ref="dialog-compare"
      :dialog-visible="dialogCompareVisible"
      :dialog-data = "dialogCompareData"
      @on-dialog-change="changeDialogCompare"
    ></dialog-compare>
  </div>
</template>

<script>
import pieC from '@/components/e-charts/pieC'
import mixLinebar from '@/components/e-charts/mixLinebar.vue'
import gauge from '@/components/e-charts/gauge'
import statisticE from '@/components/e-charts/statisticE'
import axios from '@/api/axios'
import moment from 'moment'
import dialogCompare from '@/components/dialog/dialogCompare'
export default {
  name: 'home',
  data () {
    return {
      fucBtns: [],
      dialogCompareVisible: false, // 对比分析弹框显示开关
      dialogCompareData: {
        title: '对比分析',
        api: 'system/advert/getUserSelect',
        options: {
        },
        columns: [
          {
            prop: 'userName',
            label: '姓名'
          },
          {
            prop: 'phone',
            label: '联系方式'
          }
        ]
      },
      basicData: {},
      pageLoading: false,
      isShowComparison: false, // 对比图弹窗控制
      changeDateOptions: ['按日期查询', '按月份查询', '按年度查询', '按时间区间查询'],
      gaugeData: [], // 仪表盘数据
      pieOptions: [
        {
          title: '全员参与率',
          tipsTextA: '全员参与率 =',
          tipsTextB: '已参与人数/总人数',
          participationRate: 0,
          pieData: [], // 图形数据
          colorList: [
            '#0d6ce5',
            '#3bebc4'
          ]
        }, // 图形颜色集合
        {
          title: '隐患发生率',
          tipsTextA: '隐患发生率 =',
          tipsTextB: '已排查实施人数/总人数',
          participationRate: 0,
          pieData: [],
          colorList: [
            '#0d6ce5',
            '#3bebc4'
          ]
        },
        {
          title: '隐患符合率',
          tipsTextA: '隐患符合率 =',
          tipsTextB: '已排查复核个数/总排查项',
          participationRate: 0,
          pieData: [],
          colorList: [
            '#0d6ce5',
            '#3bebc4'
          ]
        },
        {
          title: '隐患整改率',
          tipsTextA: '隐患整改率 =',
          tipsTextB: '已隐患治理个数/总排查项',
          participationRate: 0,
          pieData: [],
          colorList: [
            '#0d6ce5',
            '#3bebc4'
          ]
        }
      ], // 图饼设置项
      pieData: [],
      chartData: [], // 图表数据
      chartHeight: '417px', // 图表高度
      pieHeight: '200px', // 饼图高度
      chartWidth: '446px',
      messageData: [], // 信息列表数据
      tabType: '2',
      page: {
        pageNo: 1,
        pageSize: 10 // limit
      },
      enterData: [], // 入口链接数据
      tabaleHeaderData1: {},
      tabaleHeaderData2: {},
      tabaleHeaderData3: {},
      tabaleHeaderData4: {},
      tableData1: [], // 风险动态数据
      tableData2: [],
      tableData3: [],
      tableData4: [],
      echartloading: false, // echart载入
      risktestName: { //
        userCount: '', // 参与员工数量
        hiddenCount: '' // 隐患发生数量
      },
      mixLinebarTimeDate: [], // 对比查询数据
      changeDateValA: 0, // 选择的时间段种类
      changeDateValB: 0, // 选择的时间段种类
      tipsDateDataA: '', // 日期选择查询时间段第一图
      tipsDateDataB: '', // 日期选择查询时间段第二图
      mixLinebarDataA: {}, // 图一 e-chart 数据
      mixLinebarDataB: {}, // 图二 e-chart 数据
      yearsDateDataA: { // 年份日期选择对象A
        yearsDatestart: '', // 开始年限
        yearsDateend: '' // 结束年限
      },
      yearsDateDataB: { // 年份日期选择对象B
        yearsDatestart: '',
        yearsDateend: ''
      },
      changeSearchTimeA: [], // 搜索时间区间条件第一图
      changeSearchTimeB: [], // 搜索时间区间条件第二图
      tableDataA: [], // 员工数量表格数据
      tableDataB: [], // 隐患数量表格数据
      userSearchform: { // 员工搜索条件
        userName: '', // 员工姓名
        deptName: '', // 部门
        position: '', // 职位
        cBeginTime: '', // 开始时间（查询）
        cEndTime: '', // 结束时间（查询）
        beginTime: '',
        endTime: '',
        type: '',
        pageNo: '1',
        pageSize: 10
      },
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
      startDateA: {
        disabledDate: time => { // 禁止选择日期大于开始日期
          if (this.yearsDateDataA.yearsDateend) {
            return time.getTime() > this.yearsDateDataA.yearsDateend
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      endDateA: {
        disabledDate: time => { // 禁止选择日期大于开始日期
          if (this.yearsDateDataA.yearsDateend) {
            return time.getTime() < this.yearsDateDataA.yearsDatestart
          } else if (this.yearsDateDataA.yearsDatestart) {
            return time.getTime() < this.yearsDateDataA.yearsDatestart || time.getTime() > Date.now()
          }
          return time.getTime() > Date.now()
        }
      },
      startDateB: {
        disabledDate: time => { // 禁止选择日期大于开始日期
          if (this.yearsDateDataB.yearsDateend) {
            return time.getTime() > this.yearsDateDataB.yearsDateend
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      endDateB: {
        disabledDate: time => { // 禁止选择日期大于开始日期
          if (this.yearsDateDataB.yearsDateend) {
            return time.getTime() < this.yearsDateDataB.yearsDatestart
          } else if (this.yearsDateDataB.yearsDatestart) {
            return time.getTime() < this.yearsDateDataB.yearsDatestart || time.getTime() > Date.now()
          }
          return time.getTime() > Date.now()
        }
      }
    }
  },
  filters: {
    // 格式化日期格式
    'date-filter' (value) {
      if (value) {
        return moment(value).format('YYYY-MM-DD')
      } else {
        return null
      }
    }
  },
  components: {
    pieC,
    statisticE,
    gauge,
    mixLinebar,
    dialogCompare
  },
  created () {
    this.fetchPieData()
    this.fetchEnterData()
    this.fetchList()
    this.fetchChartData()
    this.fetchGaugeData()
    this.fetchTableData()
    this.getBtnAuthority()
    this.fetchBasicData()
  },
  methods: {
    // 对比分析点击事件处理
    compareAnalysisHandle () {
      this.dialogCompareVisible = true
    },
    // 监听对比分析弹出框的显示
    changeDialogCompare (val) {
      this.dialogCompareVisible = val
    },
    // 获取安全指数分析数据
    fetchTableData () {
      let vm = this
      vm.pageLoading = true
      axios
        .get('safeAnalysis/pointLineSurface')
        .then((res) => {
          if (res.data.code === 200) {
            this.tableData1 = res.data.data1.tableData
            this.tableData2 = res.data.data2.tableData
            this.tableData3 = res.data.data3.tableData
            this.tableData4 = res.data.data4.tableData
            this.tabaleHeaderData1 = res.data.data1.tabaleHeaderData
            this.tabaleHeaderData2 = res.data.data2.tabaleHeaderData
            this.tabaleHeaderData3 = res.data.data3.tabaleHeaderData
            this.tabaleHeaderData4 = res.data.data4.tabaleHeaderData
          }
        }).finally(() => {
          this.pageLoading = false
        })
    },
    // 初始化安全指数分析数据
    initPieOptions () {
      for (let i = 0; i < this.pieOptions.length; i++) {
        for (let j = 0; j < this.pieData.length; j++) {
          if (i === j) {
            this.pieOptions[i].pieData = this.pieData[j]
            if (this.pieData[j][0].value === 0 && this.pieData[j][1].value === 0) {
              this.pieOptions[i].participationRate = 0
            } else {
              this.pieOptions[i].participationRate = Math.round(
                (this.pieData[j][0].value /
                (this.pieData[j][0].value +
                this.pieData[j][1].value)) * 100)
            }
          }
        }
      }
    },
    // 获取安全指数分析数据
    fetchPieData () {
      let vm = this
      vm.pageLoading = true
      axios
        .get('safeAnalysis/safetyAnalysis')
        .then((res) => {
          if (res.data.code === 200) {
            this.pieData = res.data.data
            this.initPieOptions()
          }
        }).finally(() => {
          this.pageLoading = false
        })
    },
    // 获取安全指数分析数据
    fetchGaugeData () {
      let vm = this
      vm.pageLoading = true
      axios
        .get('safeAnalysis/dashboard')
        .then((res) => {
          if (res.data.code === 200) {
            this.gaugeData = res.data.data
          }
        }).finally(() => {
          this.pageLoading = false
        })
    },
    turnToPage (url) {
      this.$router.push(url)
    },
    // 获取入口链接数据
    fetchEnterData () {
      let vm = this
      vm.pageLoading = true
      axios
        .get('index/getTwoMenuLists')
        .then((res) => {
          if (res.data.code === 200) {
            this.enterData = res.data.data
          }
        }).finally(() => {
          this.pageLoading = false
        })
    },
    // 获取基础数据
    fetchBasicData () {
      axios
        .get('safeAnalysis/countUserRisk')
        .then((res) => {
          if (res.data.code === 200) {
            this.basicData = res.data.data
          }
        }).finally(() => {
        })
    },
    // 获取chart的数据
    fetchChartData () {
      let vm = this
      vm.pageLoading = true
      axios
        .get('riskLevel/getWorkRisk', {
          time: 1
        })
        .then((res) => {
          if (res.data.code === 200) {
            this.chartData = res.data.data
          }
        }).finally(() => {
          this.pageLoading = false
        })
    },
    // 跳转所有信息页面的点击事件
    goMorePage () {
      this.$router.push({
        name: 'messages'
      })
    },
    // 跳转信息详情页面的点击事件
    goDetailsPage (item) {
      this.$router.push({
        name: 'messagesDetails',
        params: {
          id: item.id
        },
        query: {
          tabType: this.tabType
        }
      })
    },
    // 获取消息列表数据
    fetchList () {
      axios
        .get('msg/getMsgList', {
          pageNo: this.page.pageNo,
          pageSize: this.page.pageSize,
          tabType: this.tabType
        })
        .then((res) => {
          if (res.data.code === 200) {
            this.messageData = res.data.data
          }
        })
    },
    //  日期种类改变 重置A日期值
    emptyValA () {
      this.tipsDateDataA = ''
    },
    //  日期种类改变 重置A日期值
    emptyValB () {
      this.tipsDateDataB = ''
    },
    // 获取E-chart 数据
    getCountUserRisk (changeDateVal, tipsDateData, yearsDateData, btntype) {
      this.echartloading = true
      if (tipsDateData || yearsDateData.yearsDatestart) {
        let begin = ''
        let end = ''
        console.log(tipsDateData)
        if (changeDateVal === 2) {
          begin = moment(yearsDateData.yearsDatestart).format('YYYY')
          end = moment(yearsDateData.yearsDateend).format('YYYY')
        } else if (changeDateVal === 0) {
          begin = moment(tipsDateData).format('YYYY-MM-DD')
          end = moment(tipsDateData).format('YYYY-MM-DD')
        } else if (changeDateVal === 3) {
          begin = moment(tipsDateData[0]).format('YYYY-MM-DD')
          end = moment(tipsDateData[1]).format('YYYY-MM-DD')
        } else {
          begin = tipsDateData[0]
          end = tipsDateData[1]
        }
        this.beginTime = begin
        this.endTime = end
        debugger
        axios
          .get('safeAnalysis/statisticalRate', {
            type: changeDateVal,
            beginTime: begin,
            endTime: end
          })
          .then((res) => {
            if (res.data.code === 200) {
              const data = res.data.data
              if (btntype === 0) {
                this.mixLinebarDataA = data
              } else {
                this.mixLinebarDataB = data
              }
            }
          })
          .finally(() => {
            this.echartloading = false
          })
      } else {
        this.$message({
          message: '日期不能为空',
          type: 'warning'
        })
        this.echartloading = false
      }
    },
    // 显示对比分析显示框
    showComparison () {
      this.isShowComparison = true
      let now = new Date()
      let begin = moment(now).format('YYYY-MM-DD')
      let end = begin
      this.tipsDateData = ''
      this.getCountUserRisk(0, begin, end, 0)
      this.getCountUserRisk(0, begin, end, 1)
    },
    getBtnAuthority () {
      const authId = {authId: '1'}
      axios
        .get('user/getBtnArray', authId)
        .then((res) => {
          if (res.data.code === 200) {
            this.fucBtns = res.data.data.functionBtns
          } else {
            this.$message({
              message: res.data.message,
              type: 'warning'
            })
          }
        })
    },
    destroyOnClose () {
      this.yearsDateDataA.yearsDatestart = ''
      this.yearsDateDataA.yearsDateend = ''
      this.yearsDateDataB.yearsDatestart = ''
      this.yearsDateDataB.yearsDateend = ''
      this.tipsDateDataA = []
      this.tipsDateDataB = []
      this.changeDateValA = 0
      this.changeDateValB = 0
    }
  },
  computed: {
    // demonstration: function () {
    // let typeval = this.timeType[this.changeDataValA]
    // return typeval
    // }
  }
}
</script>

<style scoped lang="scss">
  @import '@/utils/css/tools/_variables.scss';
  .box-card-basic{
    border-bottom: 4px solid #e9e9e9;
    .basic-item{
    }
    .label{
      display: inline-block;
    }
    .value{
      display: inline-block;
      margin-left: 10px;
      color: #1a6fba;
      font-weight: bold;
    }
  }
  .view-box{
    background: #ffffff;
  }
  .flex-layout{
    display: flex;
    flex-wrap: wrap;
    .home-entrance{
      flex: 1;
    }
    .info-panel{
      flex: 0 0 600px;
    }
  }
  .home-showcase{
    padding: 0 30px;
    border-bottom: 4px solid #e9e9e9;
  }
  .home-entrance{
    display: flex;
    border-right: 4px solid #e9e9e9;
  }
  .entrance-btn{
    width: 40px;
    display: flex;
    align-items: center;
    padding: 0 2px;
    cursor: pointer;
  }
  .entrance-btn-txt{
    font-size: 18px;
    color: #666666;
  }
  .entrance-btn-icon{
    display: inline-block;
    flex: 0 0 9px;
    height: 16px;
    background-image: url('../../assets/img/home/icon-arrow-right.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
  .entrance-menu{
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    margin-top: 44px;
    margin-bottom: 44px;
  }
  .entrance-menu-item{
    flex: 0 0 20%;
    text-align: center;
    margin-bottom: 52px;
    font-size: 0;
    cursor: pointer;
    &:nth-child(1){
      .entrance-menu-icon-wrap{
        background-color: #f69b27;
      }
    }
    &:nth-child(2){
      .entrance-menu-icon-wrap{
        background-color: #ef7ead;
      }
    }
    &:nth-child(3){
      .entrance-menu-icon-wrap{
        background-color: #62b7ed;
      }
    }
    &:nth-child(4){
      .entrance-menu-icon-wrap{
        background-color: #7e8be4;
      }
    }
    &:nth-child(5){
      .entrance-menu-icon-wrap{
        background-color: #2aaa91;
      }
    }
    &:nth-child(6){
      .entrance-menu-icon-wrap{
        background-color: #f69b27;
      }
      margin-bottom: 0;
    }
    &:nth-child(7){
      margin-bottom: 0;
      .entrance-menu-icon-wrap{
        background-color: #ef7ead;
      }
    }
    &:nth-child(8){
      margin-bottom: 0;
      .entrance-menu-icon-wrap{
        background-color: #62b7ed;
      }
    }
    &:nth-child(9){
      margin-bottom: 0;
      .entrance-menu-icon-wrap{
        background-color: #7e8be4;
      }
    }
    &:nth-child(10){
      margin-bottom: 0;
      .entrance-menu-icon-wrap{
        background-color: #2aaa91;
      }
    }
  }
  .entrance-menu-icon{
    display: inline-block;
    width: 28px;
    height: 25px;
    background-image: url('../../assets/img/home/icon-menu.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    margin-bottom: 12px;
  }
  .entrance-menu-icon-wrap{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 57px;
    margin: 0 auto 10px;
    background-color: #f69b27;
    border-radius: 6px;
  }
  .entrance-menu-txt{
    font-size: 15px;
    color: #888888;
  }
  .info-content{
    text-align: center;
  }
  .info-panel{
    margin-top: 10px;
  }
  .info-header{
    display: flex;
    justify-content: space-between;
    color: #333333;
    font-size: 16px;
    padding: 10px 0;
    border-bottom: 1px solid #888888;
  }
  .info-title{
    border-left: 2px solid $colorPrimary;
  }
  .info-title-txt{
    font-size: 16px;
    line-height: 36px;
    margin-left: 15px;
  }
  .info-link-txt{
    line-height: 16px;
    color: #333333;
  }
  .home-header{
    display: flex;
    align-items: center;
    padding: 25px 30px;
    border-bottom: 4px solid #e9e9e9;
  }
  .home-header-left{
    display: inline-block;
    font-size: 0;
    line-height:  16px;
  }
  .home-header-icon{
    display: inline-block;
    width: 2px;
    height: 16px;
    background: #409eff;
    vertical-align: top;
    // background-image: url('../../assets/img/home/icon-symbol01.png');
    // background-repeat: no-repeat;
    // background-size: 100% 100%;

  }
  .home-header-txt{
    display: inline-block;
    font-size: 16px;
    line-height: 16px;
    vertical-align: top;
    margin-left: 15px;
    color: #404040;
  }
  .list-info{
    width: 70%;
    margin-left: 65px;
  }
  .list-info-item{
    font-size: 14px;
    cursor: pointer;
    color: #333333;
  }
  .list-info-title{
    display: inline-block;
    max-width: 500px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: top;
  }
  .list-info-txt{
    color: #333333;
  }
  .list-info-date{
    display: inline-block;
    margin-left: 35px;
    vertical-align: top;
  }
  .list-info-tag{
    position: absolute;
    right: -24px;
    top: -16px;
    background: #ff1616;
    color: #ffffff;
    width: 30px;
    padding: 1px 0;
    font-size: 12px;
    border-radius: 2px;
    text-align: center;
    transform: scale(0.9);
    &::after{
      display: inline-block;
      content: "";
      position: absolute;
      left: 6px;
      bottom: -6px;
      border: 4px solid;
      border-color: #ff1616 transparent transparent #ff1616;
    }
  }
  .pie-list-box{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .pie-box{
      flex: 0 0 340px;
      position: relative;
      margin-top: 40px;
      // display: flex;
      // flex-wrap: wrap;
    }
  }
  .statistic-box{
    position: relative;
    margin-top: 40px;
    overflow-x: scroll;
  }
  .pie-tips{
    position: absolute;
    right: 9px;
    top: 50%;
    text-align: left;
    width: 140px;
  }
  .pie-tips-item{
    font-size: 12px;
    color: #333333;
    line-height: 20px;
  }
  .pie-tips-sign{
    color: #ff1616;
  }
  .gauge-table{
    width: 280px;
    background: #ffffff;
    border-color: transparent;
    .custom-th-label{
      background: #ffffff;
    }
    .custom-td-value+.custom-td-value{
      border-color: #ffffff;
    }
    .custom-tr.is-flex .custom-th-label+.custom-th-label{
      border-color: #ffffff;
    }
  }
  .gauge-tabs {
    position: relative;
    right: -15px;
  }
  .gauge-tabs-box{
    position: absolute;
    bottom: 0px;
    left: 0;
    >>>.el-tabs__content{
      padding: 0 !important;
    }
  }
  .view-box-dashboard{
    >>>.el-tabs--border-card{
      min-height: 131px;
    }
    >>>.el-tabs__nav{
      height: 30px;
      line-height: 26px;
    }
    >>>.el-tabs__item{
      padding: 0 8px;
      height: 30px;
      line-height: 26px;
      border-top: 3px solid transparent;
      font-weight: 400;
      font-size: 14px;
      &.is-active{
        border-top-color: #409eff;
      }
    }
  }
  /deep/.el-carousel{
    // width: 100px;
    .el-carousel__indicators{
      display: none;
    }
  }
  @media only screen and (max-width:1400px) {
    .flex-layout{
      .home-entrance{
        flex: 0 0 100%;
        border-right: 0;
        border-bottom: 4px solid $colorBorder;
      }
      .info-panel{
        flex: 0 0 100%;
      }
    }
    .pie-list-box{
      .pie-box{
        // flex: 0 0 25%;
      }
    }
  }
  .el-dialog{
      height: 100%;
      display: flex;

      .info-header{
        margin-bottom: 20px;

      }
      .search-box{
        margin-bottom: 36px;
        .search-ipt{
          width: 140px;
          margin: 0 20px;
      }
        .search-time-ipt{
          margin: 0 20px;
        }
        .search-info{

      }
      }
      .info-chart-box{
        margin-top: 20px;
      }
      .is-show-data{
        display: inline-block;
      }
      .block{
        margin-bottom: 20px;
      }
    }
  @media only screen and (max-width:1680px) {
    .pie-list-box{
      justify-content: space-around;
      .pie-box{
        flex: 0 0 400px;
      }
    }
  }
</style>
