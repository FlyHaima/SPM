
<template>
  <div class="view-box view-box-dashboard">
    <div class="view-box-content">
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
        <el-row :gutter="24">
          <el-col :span="14">
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
          </el-col>
          <el-col :span="10">
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
                              <div class="custom-th-label">点：30%</div>
                              <div class="custom-th-label">线：30%</div>
                              <div class="custom-th-label">面：30%</div>
                            </div>
                          </div>
                          <div
                            class="custom-tbody">
                            <div class="custom-tr is-flex">
                              <div class="custom-td-value">
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
                              </div>
                              <div class="custom-td-value">
                                <el-tag
                                  class="tag-danger"
                                  type="danger"
                                  effect="dark"
                                  size="mini">标签五</el-tag>
                              </div>
                            </div>
                          </div>

                        </div>
                      </el-tab-pane>
                      <el-tab-pane label="较大风险">低风险</el-tab-pane>
                      <el-tab-pane label="一般风险">低风险</el-tab-pane>
                      <el-tab-pane label="低风险">低风险</el-tab-pane>
                    </el-tabs>
                  </div>
                </gauge>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="home-showcase">
        <el-row>
          <el-col :span="24">
            <div class="info-panel">
              <div class="info-header">
                <div class="info-title">
                  <span class="info-title-txt">安全指数分析</span>
                </div>
              </div>
              <div class="info-content">
                <el-row type="flex" justify="space-around">
                  <el-col
                    v-for="item in pieOptions"
                    :key="item.id"
                    :span="6"
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
                           {{item.tipsText}}
                         </p>
                         <p class="pie-tips-item">
                           {{item.participationRate}}%
                         </p>
                       </div>
                       </pie-c>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="home-showcase">
        <el-row :gutter="24">
          <el-col :span="24">
            <div class="info-panel">
              <div class="info-header">
                <div class="info-title">
                  <span class="info-title-txt">现有风险等级情况</span>
                </div>
              </div>
              <div class="info-content">
                <el-row :gutter="24">
                  <el-col :span="24">
                    <div class="pie-box">
                      <statistic-e
                        :chart-data = "chartData"
                        :chart-height = "chartHeight"
                      ></statistic-e>
                    </div>
                  </el-col>
                </el-row>

              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import pieC from '@/components/e-charts/pieC'
import gauge from '@/components/e-charts/gauge'
import statisticE from '@/components/e-charts/statisticE'
import axios from '@/api/axios'
import moment from 'moment'
export default {
  name: 'home',
  data () {
    return {
      pageLoading: false,
      gaugeData: [
        {
          value: 20, // 分值
          value1: 30, // 上报风险发生率
          value2: 40, // 排查风险发生率
          name: '一般' // 风险等级
        }
      ], // 仪表盘数据
      pieOptions: [
        {
          title: '全员参与率',
          tipsText: '全员参与率 = 已参与人数/总人数',
          participationRate: 0,
          pieData: [], // 图形数据
          colorList: [
            '#0d6ce5',
            '#3bebc4'
          ]
        }, // 图形颜色集合
        {
          title: '隐患发生率',
          tipsText: '隐患发生率 = 已参与人数/总人数',
          participationRate: 0,
          pieData: [],
          colorList: [
            '#0d6ce5',
            '#3bebc4'
          ]
        },
        {
          title: '隐患符合率',
          tipsText: '隐患符合率 = 已参与人数/总人数',
          participationRate: 0,
          pieData: [],
          colorList: [
            '#0d6ce5',
            '#3bebc4'
          ]
        },
        {
          title: '隐患整改率',
          tipsText: '隐患整改率 = 已参与人数/总人数',
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
      messageData: [], // 信息列表数据
      tabType: '2',
      page: {
        pageNo: 1,
        pageSize: 10 // limit
      },
      enterData: [] // 入口链接数据
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
    gauge
  },
  created () {
    this.fetchPieData()
    // this.initPieOptions()
    this.fetchEnterData()
    this.fetchList()
    this.fetchChartData()
  },
  methods: {
    // 初始化安全指数分析数据
    initPieOptions () {
      for (let i = 0; i < this.pieOptions.length; i++) {
        for (let j = 0; j < this.pieData.length; j++) {
          if (i === j) {
            this.pieOptions[i].pieData = this.pieData[j]
            this.pieOptions[i].participationRate = Math.round(
              (this.pieData[j][0].value /
              (this.pieData[j][0].value +
              this.pieData[j][1].value)) * 100)
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
    }
  }

}
</script>

<style scoped lang="scss">
  // @import '../../utils/css/style.scss';
  $colorPrimary: #409eff;
  .view-box{
    background: #ffffff;
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
    line-height: 16px;
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
  .pie-box{
    position: relative;
    margin-top: 40px;
  }
  .pie-tips{
    position: absolute;
    right: 0;
    top: 50%;
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
    width: 300px;
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
    right: -20px;
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
    >>>.el-tabs__item{
      padding: 0 8px;
      height: 30px;
      line-height: 26px;
      border-top: 3px solid transparent;
      font-weight: 400;
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
</style>
