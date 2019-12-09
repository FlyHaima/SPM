<template>
  <el-container class="inner-page-container" v-loading="pageLoading">
    <el-header class="inner-header">
      <bread-crumb :breadList="breadcrumb">
      </bread-crumb>
    </el-header>
    <el-main class="inner-main-container">
      <el-tabs type="border-card" class="height-100" v-model="activeName">
        <el-tab-pane name="tab_a">
          <span slot="label">培训计划</span>
          <el-container class="inner-main-content">
            <el-aside class="inner-aside" width="408px">
              <tree-diagram :tree-data="organizationTree" :tree-name="'组织机构'"
                            @open-loading="openLoading"
                            @close-loading="closeLoading"
                            @handleNodeClick="handleNodeClick">
              </tree-diagram>
            </el-aside>

            <el-main class="inner-content">
              <div class="container-box">
                <p class="btn-p">
                  <a class="copy-btn"><i class="el-icon-document-copy"></i>计划复制</a>
                  <a class="delete-btn" @click="showRemoveDialog"><i class="el-icon-delete"></i>计划删除</a>
                  <a class="release-btn" @click="showPlanDialog = true"><i class="el-icon-plus"></i>计划发布</a>
                </p>
                <el-dialog :title="'计划发布'" :visible.sync="showPlanDialog"
                           :width="'1004px'"
                           :show-close="false">
                  <div class="plan-body">
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
                  </div>
                  <div slot="footer" class="dialog-footer">
                    <el-button size="small" type="primary" @click="releasePlan()">保 存</el-button>
                    <el-button size="small" @click="showPlanDialog = false">取 消</el-button>
                  </div>
                </el-dialog>

                <el-table border
                          stripe
                          :data="planList"
                          tooltip-effect="dark"
                          style="width: 100%"
                          @selection-change="handleSelectionChange">
                  <el-table-column
                    type="selection"
                    width="47" align="center">
                  </el-table-column>
                  <el-table-column
                    label="课程名称"
                    width="180"
                    align="center">
                    <template slot-scope="scope">{{ scope.row.courseTitle }}</template>
                  </el-table-column>
                  <el-table-column
                    label="理论开始时间"
                    width="150"
                    align="center">
                    <template slot-scope="scope">{{ formatTime(scope.row.theorysTime) }}</template>
                  </el-table-column>
                  <el-table-column
                    label="理论结束时间"
                    width="150"
                    align="center">
                    <template slot-scope="scope">{{ formatTime(scope.row.theoryeTime) }}</template>
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
                    <template slot-scope="scope">{{ scope.row.downloadNum ? scope.row.downloadNum*1 +'/次' : '0/次' }}</template>
                  </el-table-column>
                  <el-table-column
                    label="类型"
                    width="84"
                    align="center">
                    <template slot-scope="scope">{{ planType[scope.row.category] }}</template>
                  </el-table-column>
                  <el-table-column
                    label="课程创建时间"
                    width="150"
                    align="center">
                    <template slot-scope="scope">{{ formatTime(scope.row.planTime) }}</template>
                  </el-table-column>
                  <el-table-column
                    label="创建人"
                    align="center">
                    <template slot-scope="scope">{{ scope.row.creater }}</template>
                  </el-table-column>
                  <el-table-column
                    label="操作"
                    align="center">
                    <template slot-scope="scope">
                      <el-button type="text" @click="checkPlan(scope.row.need)">查看</el-button>
                      <el-button type="text" @click="checkPlan(scope.row.need)">编辑</el-button>
                    </template>
                  </el-table-column>
                </el-table>

                <div class="pages">
                  <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="pageDataA.total"
                    :page-size="pageDataA.pageSize"
                    :current-page.sync="pageDataA.pageNo"
                    @current-change="getPlanTable">
                  </el-pagination>
                </div>
              </div>
            </el-main>
          </el-container>
        </el-tab-pane>

        <el-tab-pane name="tab_b">
          <span slot="label">培训内容</span>
          <el-container class="inner-main-content bg-fff">
            <div class="container-box">
              <el-table border
                        stripe
                        :data="trainList"
                        tooltip-effect="dark"
                        style="width: 100%"
                        @selection-change="handleSelectionChange">
                <el-table-column
                  label="课程名称"
                  width="322"
                  align="center">
                  <template slot-scope="scope">{{ scope.row.courseTitle }}</template>
                </el-table-column>
                <el-table-column
                  label="类型"
                  width="105"
                  align="center">
                  <template slot-scope="scope">{{ planType[scope.row.category] }}</template>
                </el-table-column>
                <el-table-column
                  label="理论开始时间"
                  align="center">
                  <template slot-scope="scope">{{ formatTime(scope.row.theorysTime) }}</template>
                </el-table-column>
                <el-table-column
                  label="理论结束时间"
                  align="center">
                  <template slot-scope="scope">{{ formatTime(scope.row.theoryeTime) }}</template>
                </el-table-column>
                <el-table-column
                  label="实际开始时间"
                  align="center">
                  <template slot-scope="scope">{{ formatTime(scope.row.actStartTime) }}</template>
                </el-table-column>
                <el-table-column
                  label="实际结束时间"
                  align="center">
                  <template slot-scope="scope">{{ formatTime(scope.row.actEndTime) }}</template>
                </el-table-column>
                <el-table-column
                  label="课时"
                  width="105"
                  align="center">
                  <template slot-scope="scope">{{scope.row.hourRequire ? scope.row.hourRequire+'小时' : '0小时' }}</template>
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

              <div class="pages">
                <el-pagination
                  background
                  layout="prev, pager, next"
                  :total="pageDataB.total"
                  :page-size="pageDataB.pageSize"
                  :current-page.sync="pageDataB.pageNo"
                  @current-change="getContentTable">
                </el-pagination>
              </div>
            </div>
          </el-container>
        </el-tab-pane>

        <el-tab-pane name="tab_c">
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
                    width="135"
                    align="center">
                    <template slot-scope="scope">{{ planType[scope.row.category] }}</template>
                  </el-table-column>
                  <el-table-column
                    label="理论开始时间"
                    width="250"
                    align="center">
                    <template slot-scope="scope">{{ formatTime(scope.row.startTime) }}</template>
                  </el-table-column>
                  <el-table-column
                    label="理论结束时间"
                    width="250"
                    align="center">
                    <template slot-scope="scope">{{ formatTime(scope.row.endTime) }}</template>
                  </el-table-column>
                  <el-table-column
                    label="状态"
                    width="135"
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
                    :total="pageDataC.total"
                    :page-size="pageDataC.pageSize"
                    :current-page.sync="pageDataC.pageNo"
                    @current-change="getRecordTable">
                  </el-pagination>
                </div>
              </div>
            </el-main>
          </el-container>
          <el-dialog :title="'详细'" :visible.sync="showDetailLog"
                     :width="'970px'">
            <div class="detail-log">
              <el-collapse accordion>
                <el-collapse-item>
                  <template slot="title">
                    基本信息
                  </template>
                  <div class="class-out">
                    <div class="col-inner-item">
                      <p class="label">课程：</p>
                      <p>安全生产综合管理</p>
                    </div>
                    <div class="col-inner-item">
                      <p class="label">学习部门：</p>
                      <p>安全管理部</p>
                    </div>
                    <div class="col-inner-item">
                      <p class="label">类别：</p>
                      <p>考试</p>
                    </div>
                    <div class="col-inner-item">
                      <p class="label">开始时间：</p>
                      <p>2019-10-12 12:00</p>
                    </div>
                    <div class="col-inner-item">
                      <p class="label">结束时间：</p>
                      <p>2019-10-12 12:00</p>
                    </div>
                    <div class="col-inner-item">
                      <p class="label">学习方式：</p>
                      <p>线下学习</p>
                    </div>
                    <div class="col-inner-item">
                      <p class="label">课程状态：</p>
                      <p>发布中</p>
                    </div>
                    <div class="col-inner-item">
                      <p class="label">理论学习状态：</p>
                      <p>280 人</p>
                    </div>
                    <div class="col-inner-item">
                      <p class="label">发布人：</p>
                      <p>管理员</p>
                    </div>
                  </div>
                </el-collapse-item>
                <el-collapse-item title="反馈 Feedback">
                  <template slot="title">课程统计</template>
                  <div class="class-out">
                    <div class="col-inner-item">
                      <p class="label">已学习人数：</p>
                      <p>10 人</p>
                    </div>
                    <div class="col-inner-item">
                      <p class="label">未学习人数：</p>
                      <p>20 人</p>
                    </div>
                    <div class="col-inner-item">
                      <p class="label">参与学习率：</p>
                      <p>30 %</p>
                    </div>
                    <div class="col-inner-item">
                      <p class="label">考试人数：</p>
                      <p>22 人</p>
                    </div>
                    <div class="col-inner-item">
                      <p class="label">合格人数：</p>
                      <p>19 人</p>
                    </div>
                    <div class="col-inner-item">
                      <p class="label">合格率：</p>
                      <p>70 %</p>
                    </div>
                    <div class="col-inner-item">
                      <p class="label">理论学习用时：</p>
                      <p>30 天</p>
                    </div>
                    <div class="col-inner-item">
                      <p class="label">实际学习用时：</p>
                      <p>28 天</p>
                    </div>
                    <div class="col-inner-item">
                      <p class="label">总课时：</p>
                      <p>280 小时</p>
                    </div>
                  </div>
                </el-collapse-item>
                <el-collapse-item title="效率 Efficiency">
                  <template slot="title">文档附件</template>
                  <ul class="download-list">
                    <li v-for="(item, index) in detailDownList" :key="index">
                      {{item.name}}
                      <a @click="downloadItem(item.url)">下载</a>
                    </li>
                  </ul>
                </el-collapse-item>
              </el-collapse>
            </div>
          </el-dialog>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script>
import BreadCrumb from '../Breadcrumb/Breadcrumb'
import TreeDiagram from '../tree-diagram/treeDiagram'
import {getPlanDeptList, getPlanTable, getContentTable, releasePlan, deletePlan} from '@/api/organization'

export default {
  name: 'staffTraining',
  data () {
    return {
      pageLoading: false,
      breadcrumb: ['风险辨识评估', '全员培训'],
      activeName: 'tab_a',
      triggerAid: '',
      triggerBid: '',
      triggerCid: '',
      pageDataA: {
        pageSize: 10,
        pageNo: 1,
        total: 0
      },
      pageDataB: {
        pageSize: 10,
        pageNo: 1,
        total: 0
      },
      pageDataC: {
        pageSize: 10,
        pageNo: 1,
        total: 0
      },
      organizationTree: [],
      states: {
        '0': '未开始',
        '1': '学习中',
        '2': '已学习',
        '3': '已结束'
      },
      planType: {
        '1': '训练',
        '2': '考试'
      },
      planList: [],
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
        }
      ],
      trainList: [],
      showDetailLog: false,
      detailDownList: [
        {
          name: 'downloadFileName',
          url: '******'
        },
        {
          name: 'downloadFileName',
          url: '******'
        },
        {
          name: 'downloadFileName',
          url: '******'
        }
      ]
    }
  },
  created () {
    this.getPlanDeptTree(true)
    this.getContentTable()
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
    // 点击tree节点
    handleNodeClick (deptId) {
      if (this.activeName === 'tab_a') {
        this.triggerAid = deptId
        this.pageLoading = true
        this.getPlanTable()
      } else if (this.activeName === 'tab_c') {
        this.triggerCid = deptId
        this.pageLoading = true
        // this.getWorkerTable()
      }
    },
    // 获取treeData
    getPlanDeptTree (create) {
      getPlanDeptList().then((res) => {
        if (res.code === 200) {
          this.organizationTree = res.data
          if (create) {
            this.triggerAid = this.organizationTree[0].deptId
            this.getPlanTable()
          }
        } else {
          this.organizationTree = []
          this.$message.error('获取数据失败，请稍后刷新页面重试')
        }
        this.pageLoading = false
      })
    },
    // 获取培训计划的table
    getPlanTable () {
      this.pageLoading = true
      getPlanTable(this.triggerAid, this.pageDataA.pageNo, this.pageDataA.pageSize).then((res) => {
        if (res.code === 200) {
          this.planList = res.data
          this.pageDataA.total = res.total
        }
        this.pageLoading = false
      })
    },
    // 获取培训内容的table
    getContentTable () {
      this.pageLoading = true
      getContentTable(this.pageDataB.pageNo, this.pageDataB.pageSize).then((res) => {
        if (res.code === 200) {
          this.trainList = res.data
          this.pageDataB.total = res.total
        }
        this.pageLoading = false
      })
    },
    // 获取培训记录的table
    getRecordTable () {
    },
    checkPlan (need) {
      let needStr = ''
      if (need) {
        needStr = need
      } else {
        needStr = '暂无'
      }
      this.$alert(needStr, '培训需求')
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    releasePlan () {
      let data = {
        // userId: '',
        deptId: '',
        courseTitle: this.addPlanData.className, // 课程名称
        category: this.addPlanData.planType, // 类别
        hourRequire: 0, // 总课时
        // creater: '', // 计划发布人id
        planTime: '', // 计划发布时间
        theorysTime: this.addPlanData.startTime, // 理论开始时间
        theoryeTime: this.addPlanData.endTime, // 理论结束时间
        need: this.addPlanData.need, // 培训需求
        attachmentList: [
          {
            name: '', // 附件名称
            path: '', // 附件路径
            size: '', // 附件大小
            type: ''
          }
        ]
      }
      releasePlan(data).then((res) => {
        if (res.code === 200) {
        }
      })
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
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: 'warning',
          message: `请选中至少一条`
        })
        return
      }
      this.$confirm('确定移除选中项?', '计划删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // let data = {id: '1,2,3' }
        let ids = []
        this.multipleSelection.forEach((item) => {
          ids.push(item.id)
        })
        let data = {id: ids.join(',')}
        deletePlan(data).then((res) => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    startLearn (id) {},
    endLearn (id) {},
    downloadFile (files) {},
    checkDetail (id) {
      // get data, then, showDetailLog
      this.showDetailLog = true
    },
    downloadItem (url) {}
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
      padding: 0;
      .plan-body{
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
      .detail-log{
        height: 700px;
      }
      .el-collapse-item__header{
        background: #f8f8f8;
        height: 30px;
        line-height: 30px;
        padding: 0 15px;
      }
      .el-collapse-item__content{
        padding-bottom: 0;
      }
      .class-out{
        padding: 40px;
        .col-inner-item{
          display: inline-block;
          width: 286px;
          height: 66px;
          padding-left: 130px;
          position: relative;
          line-height: 33px;
          color: #646464;
          font-size: 16px;
          font-weight: 300;
          .label{
            position: absolute;
            width: 124px;
            top: 0;
            left: 0;
            text-align: right;
            font-weight: 500;
          }
        }
      }
      .download-list{
        li{
          border-top: 1px solid #EBEEF5;
          line-height: 50px;
          padding: 0 30px;
          a{
            float: right;
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
            overflow-y: auto;
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
    }
  }
  .pages{
    margin-top: 28px;
    text-align: right;
  }
}
</style>
