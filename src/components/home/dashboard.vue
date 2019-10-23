
<template>
  <div class="view-box">
    <div class="view-box-content">
      <div class="home-header">
        <div class="home-header-left">
          <i class="home-header-icon"></i>
          <span class="home-header-txt">亲爱的企业，您好！</span>
        </div>
      </div>
      <div class="home-showcase">
        <el-row :gutter="24">
          <el-col :span="12">
            <div class="home-entrance">
              <div class="entrance-btn">
                <span class="entrance-btn-txt">快速进入</span>
                <i class="entrance-btn-icon"></i>
              </div>
              <div class="entrance-menu">
                <div class="entrance-menu-item">
                  <i class="entrance-menu-icon"></i>
                  <div class="entrance-menu-txt">企业风险清单</div>
                </div>
                <div class="entrance-menu-item">
                  <i class="entrance-menu-icon"></i>
                  <div class="entrance-menu-txt">重大安全风险公告</div>
                </div>
                <div class="entrance-menu-item">
                  <i class="entrance-menu-icon"></i>
                  <div class="entrance-menu-txt">隐患治理</div>
                </div>
                <div class="entrance-menu-item">
                  <i class="entrance-menu-icon"></i>
                  <div class="entrance-menu-txt">风险四色图</div>
                </div>
                <div class="entrance-menu-item">
                  <i class="entrance-menu-icon"></i>
                  <div class="entrance-menu-txt">风险分级管控</div>
                </div>
                <div class="entrance-menu-item">
                  <i class="entrance-menu-icon"></i>
                  <div class="entrance-menu-txt">风险单元划分</div>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="info-panel">
              <div class="info-header">
                <div class="info-title">
                  <span class="info-title-txt">我的消息</span>
                </div>
                <div class="info-link">
                  <a
                    href="javascript:;"
                    @click=" goMorePage() "
                    class="info-link-txt">更多</a>
                </div>
              </div>
              <div class="info-content">
                <ul class="list-info">
                  <li class="list-info-item">
                    <div class="list-info-title">
                      <span class="list-info-txt">你的安全清单并未完善，请点击这里</span>
                      <div class="list-info-tag">NEW</div>
                    </div>
                    <div class="list-info-date">2017-12-20</div>
                  </li>
                  <li class="list-info-item">
                    <div class="list-info-title">
                      <div class="list-info-txt">你的安全清单并未完善，请点击这里你的安全清单并未完善，请点击这里</div>
                      <div class="list-info-tag">NEW</div>
                    </div>
                    <div class="list-info-date">2017-12-20</div>
                  </li>
                  <li class="list-info-item">
                    <div class="list-info-title">
                      <div class="list-info-txt">你的安全清单并未完善，请点击这里你的安全清单并未完善，请点击这里</div>
                      <div class="list-info-tag">NEW</div>
                    </div>
                    <div class="list-info-date">2017-12-20</div>
                  </li>
                  <li class="list-info-item">
                    <div class="list-info-title">
                      <div class="list-info-txt">你的安全清单并未完善，请点击这里你的安全清单并未完善，请点击这里</div>
                      <div class="list-info-tag">NEW</div>
                    </div>
                    <div class="list-info-date">2017-12-20</div>
                  </li>
                  <li class="list-info-item">
                    <div class="list-info-title">
                      <div class="list-info-txt">你的安全清单并未完善，请点击这里你的安全清单并未完善，请点击这里</div>
                      <div class="list-info-tag">NEW</div>
                    </div>
                    <div class="list-info-date">2017-12-20</div>
                  </li>
                  <li class="list-info-item">
                    <div class="list-info-title">
                      <div class="list-info-txt">你的安全清单并未完善，请点击这里你的安全清单并未完善，请点击这里</div>
                      <div class="list-info-tag">NEW</div>
                    </div>
                    <div class="list-info-date">2017-12-20</div>
                  </li>
                  <li class="list-info-item">
                    <div class="list-info-title">
                      <div class="list-info-txt">你的安全清单并未完善，请点击这里你的安全清单并未完善，请点击这里</div>
                      <div class="list-info-tag">NEW</div>
                    </div>
                    <div class="list-info-date">2017-12-20</div>
                  </li>
                </ul>
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
                    v-for = "item in pieOptions"
                    :key = "item.id"
                    :span = "4"
                    class = "pie-box">
                    <pie-c
                      :return-data = "item.pieData"
                      :title = "item.title"
                      :color-list = "item.colorList"
                       ></pie-c>
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
                      <statistic-e :chart-data="chartData"></statistic-e>
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
import statisticE from '@/components/e-charts/statisticE'
export default {
  name: 'home',
  data () {
    return {
      pieOptions: [
        {
          title: '全员参与率',
          pieData: [
            {
              'value': 41.1,
              'name': '已参与'
            },
            {
              'value': 86.5,
              'name': '未参与'
            },
            {
              'value': 24.1,
              'name': '已上报'
            },
            {
              'value': 55.2,
              'name': '未上报'
            },
            {
              'value': 55.2,
              'name': '符合'
            }
          ],
          colorList: [
            '#57d9bb',
            '#4c97d9',
            '#ef7ead',
            '#f69b27',
            '#4c97d9'
          ]
        },
        {
          title: '隐患发生率',
          pieData: [
            {
              'value': 41.1,
              'name': '已参与'
            },
            {
              'value': 86.5,
              'name': '未参与'
            }
          ],
          colorList: [
            '#57d9bb',
            '#4c97d9'
          ]
        },
        {
          title: '隐患符合率',
          pieData: [
            {
              'value': 41.1,
              'name': '已参与'
            },
            {
              'value': 86.5,
              'name': '未参与'
            },
            {
              'value': 24.1,
              'name': '已上报'
            },
            {
              'value': 55.2,
              'name': '未上报'
            }
          ],
          colorList: [
            '#57d9bb',
            '#4c97d9',
            '#ef7ead',
            '#f69b27'
          ]
        },
        {
          title: '隐患符合率',
          pieData: [
            {
              'value': 24.1,
              'name': '已上报'
            },
            {
              'value': 55.2,
              'name': '未上报'
            },
            {
              'value': 55.2,
              'name': '符合'
            }
          ],
          colorList: [
            '#ef7ead',
            '#f69b27',
            '#4c97d9'
          ]
        },
        {
          title: '隐患符合率',
          pieData: [
            {
              'value': 41.1,
              'name': '已参与'
            },
            {
              'value': 86.5,
              'name': '未参与'
            },
            {
              'value': 24.1,
              'name': '已上报'
            },
            {
              'value': 55.2,
              'name': '未上报'
            },
            {
              'value': 55.2,
              'name': '符合'
            }
          ],
          colorList: [
            '#57d9bb',
            '#4c97d9',
            '#ef7ead',
            '#f69b27',
            '#4c97d9'
          ]
        }
      ], // 图饼设置项
      chartData: [
        {
          'value': '25',
          'name': '煤气'
        },
        {
          'value': '50',
          'name': '炉前'
        },
        {
          'value': '75',
          'name': '炉前2'
        },
        {
          'value': '60',
          'name': '炉前3'
        },
        {
          'value': '80',
          'name': '炉前4'
        },
        {
          'value': '100',
          'name': '炉前5'
        }
      ]
    }
  },
  components: {
    pieC,
    statisticE
  },
  methods: {
    // 跳转所有信息页面的点击事件
    goMorePage () {
      this.$router.push({
        name: 'messages'
      })
    }
  }

}
</script>

<style scoped lang="scss">
  $colorPrimary: #409eff;
  .view-box{
    background: #ffffff;
  }
  .home-header{
    padding: 0 44px;
    line-height: 66px;
    border-bottom: 4px solid #e9e9e9;
  }
  .home-header-left{
    display: inline-block;
    font-size: 0;
    line-height:  13px;
  }
  .home-header-icon{
    display: inline-block;
    width: 17px;
    height: 13px;
    background-image: url('../../assets/img/home/icon-symbol01.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
  .home-header-txt{
    font-size: 16px;
    line-height: 13px;
    margin-left: 26px;
    color: #404040;
  }

  .home-showcase{
    padding: 0 42px;
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
    margin-top: 32px;
    margin-bottom: 27px;
  }
  .entrance-menu-item{
    flex: 0 0 33.333%;
    text-align: center;
    margin-bottom: 62px;
    font-size: 0;
    cursor: pointer;
    &:nth-child(1){
      .entrance-menu-icon{
        background-image: url('../../assets/img/home/icon-menu01.png');
      }
    }
    &:nth-child(2){
      .entrance-menu-icon{
        background-image: url('../../assets/img/home/icon-menu02.png');
      }
    }
    &:nth-child(3){
      .entrance-menu-icon{
        background-image: url('../../assets/img/home/icon-menu03.png');
      }
    }
    &:nth-child(4){
      margin-bottom: 0;
      .entrance-menu-icon{
        background-image: url('../../assets/img/home/icon-menu04.png');
      }
    }
    &:nth-child(5){
      margin-bottom: 0;
      .entrance-menu-icon{
        background-image: url('../../assets/img/home/icon-menu05.png');
      }
    }
    &:nth-child(6){
      margin-bottom: 0;
      .entrance-menu-icon{
        background-image: url('../../assets/img/home/icon-menu06.png');
      }
    }
  }
  .entrance-menu-icon{
    display: inline-block;
    width: 56px;
    height: 57px;
    background-image: url('../../assets/img/home/icon-menu01.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    margin-bottom: 12px;
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
    margin-left: 10px;
  }
  .info-link-txt{
    line-height: 16px;
    color: #333333;
  }

  .list-info{
    padding-top: 20px;
    max-height: 224px;
    // overflow-y: scroll;
  }
  .list-info-item{
    display: flex;
    justify-content: space-between;
    position: relative;
    font-size: 14px;
    padding: 5px 0px 5px 16px;
    cursor: pointer;
    &::after{
      content: "";
      position: absolute;
      left: 4px;
      top: 50%;
      display: inline-block;
      transform: translate(50%, -50%);
      width: 4px;
      height: 4px;
      background: $colorPrimary;
      border-radius: 50%;
    }
  }
  .list-info-title{
    position: relative;
    max-width: 370px;
  }
  .list-info-txt{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #313332;
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
    border-right: 2px solid #e9e9e9;
    margin-top: 56px;
    margin-bottom: 40px;
    &:last-child{
      border-right: 0;
    }
  }
</style>
