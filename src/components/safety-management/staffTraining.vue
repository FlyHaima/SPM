<template>
  <el-container class="inner-page-container" v-loading="pageLoading">
    <el-header class="inner-header">
      <bread-crumb :breadList="breadcrumb">
      </bread-crumb>
    </el-header>
    <el-main class="inner-main-container">
      <el-tabs type="border-card" class="height-100">
        <el-tab-pane>
          <span slot="label">培训计划</span>
          <el-container class="inner-main-content">
            <el-aside class="inner-aside" width="408px">
              <tree-diagram :tree-data="organizationTree" :tree-name="'组织机构'"
                            @open-loading="openLoading"
                            @close-loading="closeLoading" >
              </tree-diagram>
            </el-aside>

            <el-main class="inner-content">
              <div class="container-box">
                <p class="btn-p">
                  <a class="export-btn"><i class></i>导出</a>
                  <a class="import-btn"><i></i>导入</a>
                </p>
                <el-table ref="leaderTable"
                          border
                          stripe
                          :data="planList"
                          tooltip-effect="dark"
                          style="width: 100%">
                  <el-table-column
                    label="课程名称"
                    width="180"
                    align="center">
                    <template slot-scope="scope">{{ scope.row.name }}</template>
                  </el-table-column>
                  <el-table-column
                    label="理论开始时间"
                    width="150"
                    align="center">
                    <template slot-scope="scope">{{ formatTime(scope.row.startTime) }}</template>
                  </el-table-column>
                  <el-table-column
                    label="理论结束时间"
                    width="150"
                    align="center">
                    <template slot-scope="scope">{{ formatTime(scope.row.endTime) }}</template>
                  </el-table-column>
                  <el-table-column
                    label="状态"
                    width="84"
                    align="center">
                    <template slot-scope="scope">{{ states[scope.row.state] }}</template>
                  </el-table-column>
                  <el-table-column
                    label="下载次数"
                    width="90"
                    align="center">
                    <template slot-scope="scope">{{ scope.row.downloadTime+'/次' }}</template>
                  </el-table-column>
                  <el-table-column
                    label="类型"
                    width="84"
                    align="center">
                    <template slot-scope="scope">{{ planType[scope.row.type] }}</template>
                  </el-table-column>
                  <el-table-column
                    label="课程创建时间"
                    width="150"
                    align="center">
                    <template slot-scope="scope">{{ formatTime(scope.row.createTime) }}</template>
                  </el-table-column>
                  <el-table-column
                    label="创建人"
                    align="center">
                    <template slot-scope="scope">{{ scope.row.createPerson }}</template>
                  </el-table-column>
                  <el-table-column
                    label="培训需求"
                    align="center">
                    <template slot-scope="scope"><el-button type="text" @click="checkPlan(scope.row.id)">查看</el-button></template>
                  </el-table-column>
                </el-table>
              </div>
            </el-main>
          </el-container>
        </el-tab-pane>

        <el-tab-pane>
          <span slot="label">培训内容</span>
          <el-container class="inner-main-content bg-fff">
          </el-container>
        </el-tab-pane>

        <el-tab-pane>
          <span slot="label">培训记录</span>
          <el-container class="inner-main-content">
            <el-aside class="inner-aside" width="408px">
              <tree-diagram :tree-data="organizationTree" :tree-name="'组织机构'"
                            @open-loading="openLoading"
                            @close-loading="closeLoading" >
              </tree-diagram>
            </el-aside>

            <el-main class="inner-content">
              <div class="container-box">
                <p class="btn-p">
                  <a class="export-btn"><i class></i>导出</a>
                  <a class="import-btn"><i></i>导入</a>
                </p>
<!--                <el-table ref="leaderTable"-->
<!--                          border-->
<!--                          stripe-->
<!--                          :data="workerData"-->
<!--                          tooltip-effect="dark"-->
<!--                          style="width: 100%">-->
<!--                  <el-table-column-->
<!--                    label="姓名"-->
<!--                    width="160"-->
<!--                    align="center">-->
<!--                    <template slot-scope="scope">{{ scope.row.name }}</template>-->
<!--                  </el-table-column>-->
<!--                  <el-table-column-->
<!--                    label="联系方式"-->
<!--                    width="160"-->
<!--                    align="center">-->
<!--                    <template slot-scope="scope">{{ scope.row.concatNum }}</template>-->
<!--                  </el-table-column>-->
<!--                  <el-table-column-->
<!--                    label="主要职责"-->
<!--                    align="center">-->
<!--                    <template slot-scope="scope">{{ scope.row.duty }}</template>-->
<!--                  </el-table-column>-->
<!--                  <el-table-column-->
<!--                    label="操作"-->
<!--                    width="80px"-->
<!--                    align="center">-->
<!--                    <template slot-scope="scope">-->
<!--                      <el-button type="text" @click="editLeaderItem(scope.row.id)">编辑</el-button>-->
<!--                    </template>-->
<!--                  </el-table-column>-->
<!--                </el-table>-->

                <div class="pages">
                  <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="100">
                  </el-pagination>
                </div>
              </div>
            </el-main>
          </el-container>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script>
import BreadCrumb from '../Breadcrumb/Breadcrumb'
import TreeDiagram from '../tree-diagram/treeDiagram'

export default {
  name: 'staffTraining',
  data () {
    return {
      pageLoading: false,
      breadcrumb: ['风险辨识评估', '全员培训'],
      organizationTree: [
        {
          id: 1000131,
          label: '《安全生产管理平台》东三省黑龙江分部总公司',
          children: [
            {
              id: 1003422,
              label: '安管部',
              children: [
                {
                  id: 1004521,
                  label: '检查组',
                  data: {
                    name: 'AAA',
                    duty: 'clean job'
                  }
                }, {
                  id: 1004522,
                  label: '设备组'
                }
              ]
            }, {
              id: 1000135,
              label: '生产部',
              children: [
                {
                  id: 1060121,
                  label: '生产A组'
                }, {
                  id: 1060122,
                  label: '生产B组'
                }
              ]
            }
          ]
        }
      ],
      states: {
        '0': '未开始',
        '1': '学习中',
        '2': '已结束'
      },
      planType: {
        'train': '训练',
        'test': '考试'
      },
      planList: [
        {
          name: '矿石管理与生产技术',
          startTime: '2019-10-20T14:39:38.000+0000',
          endTime: '2019-10-20T14:39:38.000+0000',
          state: 0, // 0: 未开始；1：学习中；2：已结束
          downloadTime: 0,
          type: 'train', // train：训练； test：考试
          createTime: '2019-10-20T14:39:38.000+0000',
          createPerson: '隔壁老王',
          id: 123123
        },
        {
          name: '矿石管理与生产技术',
          startTime: '2019-10-20T14:39:38.000+0000',
          endTime: '2019-10-20T14:39:38.000+0000',
          state: 0, // 0: 未开始；1：学习中；2：已结束
          downloadTime: 0,
          type: 'train', // train：训练； test：考试
          createTime: '2019-10-20T14:39:38.000+0000',
          createPerson: '隔壁老王',
          id: 123123
        },
        {
          name: '矿石管理与生产技术',
          startTime: '2019-10-20T14:39:38.000+0000',
          endTime: '2019-10-20T14:39:38.000+0000',
          state: 0, // 0: 未开始；1：学习中；2：已结束
          downloadTime: 0,
          type: 'train', // train：训练； test：考试
          createTime: '2019-10-20T14:39:38.000+0000',
          createPerson: '隔壁老王',
          id: 123123
        }
      ]
    }
  },
  created () {
  },
  methods: {
    openLoading () {
      this.pageLoading = true
    },
    closeLoading () {
      this.pageLoading = false
    },
    // 格式化时间，返回####-##-## ##：##
    formatTime (t) {
      let thisD = new Date(t)
      let tyear = thisD.getFullYear()
      let tmonth = thisD.getMonth() + 1
      let tday = thisD.getDate()
      let thour = thisD.getHours()
      let tmin = thisD.getMinutes()
      if (tday < 10) {
        tday = '0' + tday
      }
      if (tmonth < 10) {
        tmonth = '0' + tmonth
      }
      if (thour < 10) {
        thour = '0' + thour
      }
      if (tmin < 10) {
        tmin = '0' + tmin
      }

      return `${tyear}-${tmonth}-${tday} ${thour}:${tmin}`
    },
    checkPlan (id) {
      console.log(id)
    }
  },
  components: {TreeDiagram, BreadCrumb}
}
</script>

<style scoped lang="scss">
.inner-page-container{
  height: 100%;
  .el-header{
    padding: 0;
  }
  .el-main{
    padding: 0;
  }
}
/*  el-tab */
/deep/.inner-main-container{
  .el-tabs--border-card{
    position: relative;
    border-color: #eeeeee;
  }
  .el-tabs__nav{
    height: 50px;
  }
  .el-tabs__item{
    height: 51px;
    line-height: 50px;
    font-size: 16px;
    color: #777;
    &.is-active{
      color: #409EFF;
      border-top: 2px solid #409EFF;
    }
  }
  .el-tabs__content{
    height: 100%;
    width: 100%;
    padding: 50px 0 0;
    position: absolute;
    top: 0;
    left: 0;
    .el-tab-pane{
      height: 100%;
      .inner-main-content{
        background: #f2f2f2;
        width: 100%;
        height: 100%;
        &.bg-fff{
          background: #fff;
        }
      }
    }
  }
}

.inner-page-container {
  .inner-content {
    width: 100%;
    height: 100%;
    padding: 29px 22px;
    background: #fff;
    .container-box {
    }
  }
}
</style>
