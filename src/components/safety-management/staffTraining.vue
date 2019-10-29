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
                  <a class="copy-btn"><i class="el-icon-document-copy"></i>计划复制</a>
                  <a class="edit-btn"><i class="el-icon-edit"></i>计划编辑</a>
                  <a class="delete-btn" @click="showRemoveDialog"><i class="el-icon-delete"></i>计划删除</a>
                  <a class="release-btn" @click="showPlanDialog = true"><i class="el-icon-plus"></i>计划发布</a>
                </p>
                <el-dialog :title="'计划发布'" :visible.sync="showPlanDialog"
                           :width="'1004px'"
                           :show-close="false">
                  <div class="dialog-inner-line">
                    <div class="inner-item">
                      <p class="title">课程名称</p>
                      <p class="val-p"><el-input size="medium" v-model="addPlanData.className"></el-input></p>
                    </div>
                    <div class="inner-item">
                      <p class="title">类别</p>
                      <p class="val-p"><el-input size="medium" v-model="addPlanData.planType"></el-input></p>
                    </div>
                  </div>
                  <div class="dialog-inner-line">
                    <div class="inner-item">
                      <p class="title">开始时间</p>
                      <p class="val-p">
                        <el-date-picker
                          v-model="addPlanData.startTime"
                          type="datetime"
                          placeholder="选择日期时间">
                        </el-date-picker>
                      </p>
                    </div>
                    <div class="inner-item">
                      <p class="title">结束时间</p>
                      <p class="val-p">
                        <el-date-picker
                          v-model="addPlanData.endTime"
                          type="datetime"
                          placeholder="选择日期时间">
                        </el-date-picker>
                      </p>
                    </div>
                  </div>
                  <div class="dialog-inner-all">
                    <p class="title">培训需求</p>
                    <div class="val-div">
                      <el-input type="textarea" v-model="addPlanData.need"></el-input>
                    </div>
                  </div>
                  <div class="dialog-inner-all">
                    <p class="title">附件<span class="red margin-lf">*</span><span>仅支持上传</span><span class="red">doc、docx、mp4</span><span>格式的文件</span></p>
                    <div class="val-div">
                      <el-upload
                        class="upload-demo"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :before-remove="beforeRemove"
                        multiple
                        :on-exceed="handleExceed"
                        :file-list="fileList">
                        <el-button size="small" type="primary">点击上传</el-button>
                      </el-upload>
                    </div>
                  </div>
                  <div slot="footer" class="dialog-footer">
                    <el-button size="small" type="primary" @click="releasePlan()">保 存</el-button>
                    <el-button size="small" @click="showPlanDialog = false">取 消</el-button>
                  </div>
                </el-dialog>

                <el-table ref="leaderTable"
                          border
                          stripe
                          :data="planList"
                          tooltip-effect="dark"
                          style="width: 100%"
                          @selection-change="handleSelectionChange">
                  <el-table-column
                    type="selection"
                    width="40" align="center">
                  </el-table-column>
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
            <div class="container-box">
              <el-table ref="leaderTable"
                        border
                        stripe
                        :data="trainList"
                        tooltip-effect="dark"
                        style="width: 100%"
                        @selection-change="handleSelectionChange">
                <el-table-column
                  label="课程名称"
                  width="322"
                  align="center">
                  <template slot-scope="scope">{{ scope.row.name }}</template>
                </el-table-column>
                <el-table-column
                  label="类型"
                  width="105"
                  align="center">
                  <template slot-scope="scope">{{ planType[scope.row.type] }}</template>
                </el-table-column>
                <el-table-column
                  label="理论开始时间"
                  align="center">
                  <template slot-scope="scope">{{ formatTime(scope.row.startTime) }}</template>
                </el-table-column>
                <el-table-column
                  label="理论结束时间"
                  align="center">
                  <template slot-scope="scope">{{ formatTime(scope.row.endTime) }}</template>
                </el-table-column>
                <el-table-column
                  label="实际开始时间"
                  align="center">
                  <template slot-scope="scope">{{ formatTime(scope.row.trueStartTime) }}</template>
                </el-table-column>
                <el-table-column
                  label="实际结束时间"
                  align="center">
                  <template slot-scope="scope">{{ formatTime(scope.row.trueEndTime) }}</template>
                </el-table-column>
                <el-table-column
                  label="课时"
                  width="105"
                  align="center">
                  <template slot-scope="scope">{{ scope.row.classHour+'小时' }}</template>
                </el-table-column>
                <el-table-column
                  label="状态"
                  width="105"
                  align="center">
                  <template slot-scope="scope">{{ states[scope.row.state] }}</template>
                </el-table-column>
                <el-table-column
                  label="操作"
                  width="180"
                  align="center">
                  <template slot-scope="scope">
                    <el-button v-if="scope.row.state == 0" type="text" @click="startLearn(scope.row.id)">开始学习</el-button>
                    <el-button v-else-if="scope.row.state == 1" type="text" style="color: #f56c6c;" @click="endLearn(scope.row.id)">结束学习</el-button>
                    <span v-else type="text" style="margin-right: 10px;">开始学习</span>
                    <el-button type="text" @click="downloadFile(scope.row.downloadLink)">附件</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
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
                <el-table ref="leaderTable"
                          border
                          stripe
                          :data="trainList"
                          tooltip-effect="dark"
                          style="width: 100%"
                          @selection-change="handleSelectionChange">
                  <el-table-column
                    label="课程名称"
                    align="center">
                    <template slot-scope="scope">{{ scope.row.name }}</template>
                  </el-table-column>
                  <el-table-column
                    label="类型"
                    width="105"
                    align="center">
                    <template slot-scope="scope">{{ planType[scope.row.type] }}</template>
                  </el-table-column>
                  <el-table-column
                    label="理论开始时间"
                    align="center">
                    <template slot-scope="scope">{{ formatTime(scope.row.startTime) }}</template>
                  </el-table-column>
                  <el-table-column
                    label="理论结束时间"
                    align="center">
                    <template slot-scope="scope">{{ formatTime(scope.row.endTime) }}</template>
                  </el-table-column>
                  <el-table-column
                    label="状态"
                    width="105"
                    align="center">
                    <template slot-scope="scope">{{ states[scope.row.state] }}</template>
                  </el-table-column>
                  <el-table-column
                    label="详细内容"
                    width="105"
                    align="center">
                    <template slot-scope="scope">
                      <el-button type="text" @click="checkDetail(scope.row.id)">详细</el-button>
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
          name: '矿石管理与生产技术浮点数打发士大夫',
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
      ],
      multipleSelection: [],
      showPlanDialog: false,
      addPlanData: {
        className: '',
        planType: '',
        startTime: '',
        endTime: '',
        need: ''
      },
      fileList: [
        {
          name: 'food.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        }, {
          name: 'food2.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        }
      ],
      trainList: [
        {
          name: '矿石管理与生产技术浮点数打发士大夫',
          type: 'train', // train：训练； test：考试
          startTime: '2019-10-20T14:39:38.000+0000',
          endTime: '2019-10-20T14:39:38.000+0000',
          trueStartTime: '2019-10-20T14:39:38.000+0000',
          trueEndTime: '2019-10-20T14:39:38.000+0000',
          classHour: 20,
          state: 0, // 0: 未开始；1：学习中；2：已结束
          downloadLink: [
            {url: '****1.doc'},
            {url: '****2.mp4'}
          ],
          id: 123123
        },
        {
          name: '矿石管理与生产技术浮点数打发士大夫',
          type: 'train', // train：训练； test：考试
          startTime: '2019-10-20T14:39:38.000+0000',
          endTime: '2019-10-20T14:39:38.000+0000',
          trueStartTime: '2019-10-20T14:39:38.000+0000',
          trueEndTime: '2019-10-20T14:39:38.000+0000',
          classHour: 20,
          state: 1, // 0: 未开始；1：学习中；2：已结束
          downloadLink: [
            {url: '****1.doc'},
            {url: '****2.mp4'}
          ],
          id: 123123
        },
        {
          name: '矿石管理与生产技术浮点数打发士大夫',
          type: 'train', // train：训练； test：考试
          startTime: '2019-10-20T14:39:38.000+0000',
          endTime: '2019-10-20T14:39:38.000+0000',
          trueStartTime: '2019-10-20T14:39:38.000+0000',
          trueEndTime: '2019-10-20T14:39:38.000+0000',
          classHour: 20,
          state: 2, // 0: 未开始；1：学习中；2：已结束
          downloadLink: [
            {url: '****1.doc'},
            {url: '****2.mp4'}
          ],
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
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    releasePlan () {
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePreview (file) {
      console.log(file)
    },
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    showRemoveDialog () {
      console.log(this.multipleSelection)
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: 'warning',
          message: `请选中至少一条`
        })
        return
      }
      this.$alert('确定移除选中项?', '计划删除', {
        confirmButtonText: '确定',
        callback: () => {
          this.$message({
            type: 'warning',
            message: `action:`
          })
        }
      })
    },
    startLearn (id) {},
    endLearn (id) {},
    downloadFile (files) {},
    checkDetail (id) {}
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
/* el-dialog */
/deep/.inner-main-container{
  .el-dialog{
    .el-dialog__body{
      padding: 20px 60px;
      .dialog-inner-line{
        padding-top: 18px;
        display: flex;
        justify-content: space-between;
        .inner-item{
          width: 415px;
        }
        .title{
          line-height: 42px;
          color: #7c7c7c;
          font-size: 16px;
          font-family: "Source Han Sans CN", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "\5FAE\8F6F\96C5\9ED1", Arial, sans-serif;
          span{
            font-size: 14px;
            color: #bebebe;
            &.red{
              color: red;
            }
            &.margin-lf{
              margin-left: 20px;
            }
          }
        }
        .val-p{
          height: 36px;
          .el-date-editor.el-input{
            width: 100%;
          }
          .el-input__inner{
            height: 36px;
            line-height: 36px;
            width: 100%;
          }
        }
        .val-div{
          height: 97px;
        }
      }
      .dialog-inner-all{
        padding-top: 18px;
        .inner-item{
          width: 415px;
        }
        .title{
          line-height: 42px;
          color: #7c7c7c;
          font-size: 16px;
          font-family: "Source Han Sans CN", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "\5FAE\8F6F\96C5\9ED1", Arial, sans-serif;
          span{
            font-size: 14px;
            color: #bebebe;
            &.red{
              color: red;
            }
            &.margin-lf{
              margin-left: 20px;
            }
          }
        }
        .val-p{
          height: 36px;
          .el-date-editor.el-input{
            width: 100%;
          }
          .el-input__inner{
            height: 36px;
            line-height: 36px;
            width: 100%;
          }
        }
        .val-div{
          height: 97px;
          .el-textarea{
            height: 100%;
            .el-textarea__inner{
              height: 100%;
            }
          }
        }
      }
    }
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
          padding: 25px;
          background: #fff;
          .container-box{
            width: 100%;
          }
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
      .btn-p{
        height: 36px;
        line-height: 36px;
        margin-bottom: 25px;
        &>a{
          float: right;
          width: 108px;
          height: 36px;
          color: #fff;
          font-size: 16px;
          text-align: center;
          margin-left: 28px;
          i{
            margin-right: 8px;
          }
        }
        .release-btn{
          background: #409eff;
        }
        .delete-btn{
          background: #f56c6c;
        }
        .edit-btn{
          background: #e6a23c;
        }
        .copy-btn{
          background: #fcfcfc;
          border: 1px solid #e1e1e1;
          color: #707070;
        }
      }
      .pages{
        margin-top: 28px;
        text-align: right;
      }
    }
  }
}
</style>
