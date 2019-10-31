<template>
  <el-container class="inner-page-container" v-loading="pageLoading">
    <el-header class="inner-header">
      <bread-crumb :breadList="breadcrumb">
      </bread-crumb>
    </el-header>
    <el-main class="inner-main-container">
      <el-tabs type="border-card" class="height-100">
        <el-tab-pane>
          <span slot="label">组织机构</span>
          <el-container class="inner-main-content">
            <el-aside class="inner-aside" width="408px">
              <tree-diagram :tree-data="organizationTree" :tree-name="'组织机构'" :has-upload="true" :show-btns="true"
                            @open-loading="openLoading"
                            @close-loading="closeLoading" >
              </tree-diagram>
            </el-aside>

            <el-main class="inner-content">
              <div class="container-box">
                <organigram :organigram-data="organizationTree"></organigram>
              </div>
            </el-main>
          </el-container>
        </el-tab-pane>

        <el-tab-pane>
          <span slot="label">领导小组</span>
          <el-container class="inner-main-content">
            <el-aside class="inner-aside" width="408px">
              <tree-diagram :tree-data="leaderTree" :tree-name="'领导小组'" :has-upload="false"
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
                          :data="leaderData"
                          tooltip-effect="dark"
                          style="width: 100%">
                  <el-table-column
                    label="姓名"
                    width="160"
                    align="center">
                    <template slot-scope="scope">{{ scope.row.name }}</template>
                  </el-table-column>
                  <el-table-column
                    label="联系方式"
                    width="160"
                    align="center">
                    <template slot-scope="scope">{{ scope.row.concatNum }}</template>
                  </el-table-column>
                  <el-table-column
                    label="主要职责"
                    align="center">
                    <template slot-scope="scope">{{ scope.row.duty }}</template>
                  </el-table-column>
                  <el-table-column
                    label="操作"
                    width="80px"
                    align="center">
                    <template slot-scope="scope">
                      <el-button type="text" @click="editLeaderItem(scope.row.id)">编辑</el-button>
                    </template>
                  </el-table-column>
                </el-table>

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

        <el-tab-pane>
          <span slot="label">工作小组</span>
          <el-container class="inner-main-content">
            <el-aside class="inner-aside" width="408px">
              <tree-diagram :tree-data="workTree" :tree-name="'工作小组'" :has-upload="false"
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
                          :data="workerData"
                          tooltip-effect="dark"
                          style="width: 100%">
                  <el-table-column
                    label="姓名"
                    width="160"
                    align="center">
                    <template slot-scope="scope">{{ scope.row.name }}</template>
                  </el-table-column>
                  <el-table-column
                    label="联系方式"
                    width="160"
                    align="center">
                    <template slot-scope="scope">{{ scope.row.concatNum }}</template>
                  </el-table-column>
                  <el-table-column
                    label="主要职责"
                    align="center">
                    <template slot-scope="scope">{{ scope.row.duty }}</template>
                  </el-table-column>
                  <el-table-column
                    label="操作"
                    width="80px"
                    align="center">
                    <template slot-scope="scope">
                      <el-button type="text" @click="editLeaderItem(scope.row.id)">编辑</el-button>
                    </template>
                  </el-table-column>
                </el-table>

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
import Organigram from '../organigram/organigram'

export default {
  name: 'organization',
  data () {
    return {
      breadcrumb: ['风险辨识评估', '风险划分'],
      pageLoading: false,
      organizationTree: [
        {
          id: 1000131,
          label: '《安全生产管理平台》东三省黑龙江分部总公司',
          data: {
            name: 'AAA',
            duty: 'clean job'
          },
          children: [
            {
              id: 1003422,
              label: '安管部',
              data: {
                name: 'BBB',
                duty: 'clean job'
              },
              children: [
                {
                  id: 1004521,
                  label: '检查组',
                  data: {
                    name: 'CCC',
                    duty: 'clean job'
                  }
                }, {
                  id: 1004522,
                  label: '设备组',
                  data: {
                    name: 'ddd',
                    duty: 'clean job'
                  }
                }
              ]
            }, {
              id: 1000135,
              label: '生产部',
              data: {
                name: 'eeee',
                duty: 'clean job'
              },
              children: [
                {
                  id: 1060121,
                  label: '生产A组',
                  data: {
                    name: 'BBfffB',
                    duty: 'clean job'
                  }
                }, {
                  id: 1060122,
                  label: '生产B组',
                  data: {
                    name: 'fff',
                    duty: 'clean job'
                  }
                }
              ]
            }
          ]
        }
      ],
      leaderTree: [
        {
          id: 1000131,
          label: '黑龙江分部总公司',
          children: [
            {
              id: 1003422,
              label: '组长'
            }, {
              id: 1000135,
              label: '副组长'
            }
          ]
        }
      ],
      workTree: [
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
      leaderData: [
        {
          id: 1234123,
          name: '王小虎',
          concatNum: '18899890977',
          duty: '主要职责内容，balabalbalbalbalbablablab'
        },
        {
          id: 1234123,
          name: '王小虎',
          concatNum: '18899890977',
          duty: '主要职责内容，balabalbalbalbalbablablab'
        },
        {
          id: 1234123,
          name: '王小虎',
          concatNum: '18899890977',
          duty: '主要职责内容，balabalbalbalbalbablablab'
        },
        {
          id: 1234123,
          name: '王小虎',
          concatNum: '18899890977',
          duty: '主要职责内容，balabalbalbalbalbablablab'
        },
        {
          id: 1234123,
          name: '王小虎',
          concatNum: '18899890977',
          duty: '主要职责内容，balabalbalbalbalbablablab'
        },
        {
          id: 1234123,
          name: '王小虎',
          concatNum: '18899890977',
          duty: '主要职责内容，balabalbalbalbalbablablab'
        },
        {
          id: 1234123,
          name: '王小虎',
          concatNum: '18899890977',
          duty: '主要职责内容，balabalbalbalbalbablablab'
        },
        {
          id: 1234123,
          name: '王小虎',
          concatNum: '18899890977',
          duty: '主要职责内容，balabalbalbalbalbablablab'
        },
        {
          id: 1234123,
          name: '王小虎',
          concatNum: '18899890977',
          duty: '主要职责内容，balabalbalbalbalbablablab'
        },
        {
          id: 1234123,
          name: '王小虎',
          concatNum: '18899890977',
          duty: '主要职责内容，balabalbalbalbalbablablab'
        }
      ],
      workerData: [
        {
          id: 1234123,
          name: '王小虎',
          concatNum: '18899890977',
          duty: '主要职责内容，balabalbalbalbalbablablab'
        },
        {
          id: 1234123,
          name: '王小虎',
          concatNum: '18899890977',
          duty: '主要职责内容，balabalbalbalbalbablablab'
        },
        {
          id: 1234123,
          name: '王小虎',
          concatNum: '18899890977',
          duty: '主要职责内容，balabalbalbalbalbablablab'
        },
        {
          id: 1234123,
          name: '王小虎',
          concatNum: '18899890977',
          duty: '主要职责内容，balabalbalbalbalbablablab'
        },
        {
          id: 1234123,
          name: '王小虎',
          concatNum: '18899890977',
          duty: '主要职责内容，balabalbalbalbalbablablab'
        },
        {
          id: 1234123,
          name: '王小虎',
          concatNum: '18899890977',
          duty: '主要职责内容，balabalbalbalbalbablablab'
        },
        {
          id: 1234123,
          name: '王小虎',
          concatNum: '18899890977',
          duty: '主要职责内容，balabalbalbalbalbablablab'
        },
        {
          id: 1234123,
          name: '王小虎',
          concatNum: '18899890977',
          duty: '主要职责内容，balabalbalbalbalbablablab'
        },
        {
          id: 1234123,
          name: '王小虎',
          concatNum: '18899890977',
          duty: '主要职责内容，balabalbalbalbalbablablab'
        },
        {
          id: 1234123,
          name: '王小虎',
          concatNum: '18899890977',
          duty: '主要职责内容，balabalbalbalbalbablablab'
        }
      ]
    }
  },
  methods: {
    openLoading () {
      this.pageLoading = true
    },
    closeLoading () {
      this.pageLoading = false
    },
    editLeaderItem (id) {
      console.log(id)
    }
  },
  components: {
    TreeDiagram,
    BreadCrumb,
    Organigram
  }
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
      }
    }
  }
}

.inner-page-container{
  .inner-content{
    width: 100%;
    height: 100%;
    padding: 29px 22px;
    background: #fff;
    .container-box{
      .btn-p{
        height: 36px;
        line-height: 36px;
        &>a{
          float: right;
          width: 83px;
          height: 36px;
          color: #fff;
          font-size: 16px;
          text-align: center;
          margin-left: 28px;
          i{
            margin-right: 8px;
            display: inline-block;
            width: 15px;
            height: 36px;
            vertical-align: top;
          }
        }
        .import-btn{
          background: #e6a23c;
          i{
            background-size: 15px 13px;
            background: url("../../assets/img/import-icon.png") no-repeat center;
          }
        }
        .export-btn{
          background: #67c23a;
          i{
            background-size: 14px 14px;
            background: url("../../assets/img/export-icon.png") no-repeat center;
          }
        }
      }
      .el-table{
        margin-top: 25px;
      }
      .pages{
        margin-top: 28px;
        text-align: right;
      }
    }
  }
}
.inner-main-content{
  width: 100%;
  height: 100%;
}

</style>
