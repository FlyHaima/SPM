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
                <p class="btn-p"> <!-- 权限显示 -->
                  <a class="function-btn copy-btn" @click="copyPlan" v-if="fucBtns.includes('copy-btn')" ><i class="el-icon-document-copy" ></i>计划复制</a>
                  <a class="function-btn delete-btn" @click="showRemoveDialog" v-if="fucBtns.includes('del-btn')"><i class="el-icon-delete" ></i>计划删除</a>
                  <a class="function-btn release-btn" @click="openReleasePlan" v-if="fucBtns.includes('release-btn')"><i class="el-icon-plus" ></i>计划发布</a>
                  <el-upload style="float: right;"
                    class="tools-item function-btn function-btn"
                    v-if="fucBtns.includes('import-btn')"
                    accept=".xls, .xlsx"
                    :multiple="false"
                    :limit="1"
                    :action='uploadUrl()'
                    :headers="uploadHeader"
                    :before-upload="beforeImport"
                    :on-success="importSuccess"
                    :on-error="importError"
                    :file-list="importList"
                    :show-file-list="false"
                    :data="uploadDataTopic">
                    <a style="display: block; background: #79ce64; width: 108px; height: 36px; color: #fff; font-size: 16px; text-align: center; margin-left: 28px;"
                      v-loading="importting"><i class="el-icon-upload2" style="margin-right: 8px;"></i>导入题库
                    </a>
                  </el-upload>
                </p>

                <el-dialog :close-on-click-modal="false" :title="'计划发布'" :visible.sync="showPlanDialog"
                           :width="'1004px'"
                           :show-close="false">
                  <div class="plan-body">
                    <div class="dialog-inner-line">
                      <div class="inner-item">
                        <p class="title"><span style="color: red;">* </span>课程名称</p>
                        <p class="val-p"><el-input size="medium" v-model.trim="addPlanData.className"></el-input></p>
                      </div>
                      <div class="inner-item">
                        <p class="title"><span style="color: red;">* </span>类别</p>
                        <p class="val-p">
                          <el-select size="medium" v-model="addPlanData.planType" style="width: 100%;">
                            <el-option
                              v-for="item in lessonTypes"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                          </el-select>
                        </p>
                      </div>
                    </div>
                    <div class="dialog-inner-line">
                      <div class="inner-item">
                        <p class="title"><span style="color: red;">* </span>开始时间</p>
                        <p class="val-p">
                          <el-date-picker
                            v-model="addPlanData.startTime"
                            type="datetime"
                            placeholder="选择日期时间"
                            :picker-options="pickerDisabled">
                          </el-date-picker>
                        </p>
                      </div>
                      <div class="inner-item">
                        <p class="title"><span style="color: red;">* </span>结束时间</p>
                        <p class="val-p">
                          <el-date-picker
                            v-model="addPlanData.endTime"
                            type="datetime"
                            placeholder="选择日期时间"
                            :picker-options="pickerDisabled">
                          </el-date-picker>
                        </p>
                      </div>
                    </div>
                    <div class="dialog-inner-line">
                      <div class="inner-item">
                        <p class="title"><span style="color: red;">* </span>总课时(小时)</p>
                        <p class="val-p">
                          <el-input size="medium" type="number" v-model.trim="addPlanData.hourRequire"></el-input>
                        </p>
                      </div>
                    </div>
                    <div class="dialog-inner-all">
                      <p class="title">培训需求</p>
                      <div class="val-div">
                        <el-input type="textarea" class="textarea" v-model.trim="addPlanData.need"></el-input>
                      </div>
                    </div>
                    <div class="dialog-inner-all">
                      <p class="title">附件（ <span>仅支持上传</span><span class="red">.pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .AVI, .mov, .rmvb, .rm, .FLV, .mp4, .3GP</span><span>格式的文件</span> ）</p>
                      <div class="val-div">
                        <el-upload class="upload-demo"
                                   :data="uploadData"
                                   :action="uploadingAddress"
                                   accept=".pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .AVI, .mov, .rmvb, .rm, .FLV, .mp4, .3GP"
                                   :limit="3"
                                   :before-upload="handleBeforeUpload"
                                   :on-success="handleSuccess"
                                   :on-remove="handleRemove"
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

                <el-dialog :close-on-click-modal="false" :title="'编辑计划'" :visible.sync="showEditDialog"
                           :width="'1004px'"
                           :show-close="false">
                  <div class="plan-body">
                    <div class="dialog-inner-line">
                      <div class="inner-item">
                        <p class="title">课程名称</p>
                        <p class="val-p"><el-input size="medium" v-model.trim="editData.className"></el-input></p>
                      </div>
                      <div class="inner-item">
                        <p class="title">类别</p>
                        <p class="val-p">
                          <el-select size="medium" v-model="editData.planType" style="width: 100%;">
                            <el-option
                              v-for="item in lessonTypes"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                          </el-select>
                          <!--                          <el-input size="medium" v-model="addPlanData.planType"></el-input>-->
                        </p>
                      </div>
                    </div>
                    <div class="dialog-inner-line">
                      <div class="inner-item">
                        <p class="title">开始时间</p>
                        <p class="val-p">
                          <el-date-picker
                            v-model="editData.startTime"
                            type="datetime"
                            placeholder="选择日期时间"
                            :picker-options="pickerDisabled">
                          </el-date-picker>
                        </p>
                      </div>
                      <div class="inner-item">
                        <p class="title">结束时间</p>
                        <p class="val-p">
                          <el-date-picker
                            v-model="editData.endTime"
                            type="datetime"
                            placeholder="选择日期时间">
                          </el-date-picker>
                        </p>
                      </div>
                    </div>
                    <div class="dialog-inner-line">
                      <div class="inner-item">
                        <p class="title">总课时(小时)</p>
                        <p class="val-p">
                          <el-input size="medium" v-model.trim="editData.hourRequire"></el-input>
                        </p>
                      </div>
                    </div>
                    <div class="dialog-inner-all">
                      <p class="title">培训需求</p>
                      <div class="val-div">
                        <el-input type="textarea" class="textarea" v-model.trim="editData.need"></el-input>
                      </div>
                    </div>
                    <div class="dialog-inner-all">
                      <p class="title">附件（ <span>仅支持上传</span><span class="red">.pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .AVI, .mov, .rmvb, .rm, .FLV, .mp4, .3GP</span><span>格式的文件</span> ）</p>
                      <div class="val-div">
                        <el-upload class="upload-demo"
                                   :data="uploadData"
                                   :action="uploadingAddress"
                                   accept=".pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .AVI, .mov, .rmvb, .rm, .FLV, .mp4, .3GP"
                                   :limit="3"
                                   :before-upload="handleBeforeUpload"
                                   :on-success="handleSuccessA"
                                   :on-remove="handleRemoveA"
                                   :on-exceed="handleExceed"
                                   :file-list="editData.fileList">
                          <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                      </div>
                    </div>
                  </div>
                  <div slot="footer" class="dialog-footer">
                    <el-button size="small" type="primary" @click="confirmEdit()">确认修改</el-button>
                    <el-button size="small" @click="showEditDialog = false">取 消</el-button>
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
                    label="组织名称"
                    width="140"
                    align="center">
                    <template slot-scope="scope">{{ scope.row.deptName }}</template>
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
                    fixed="right"
                    label="操作" width="110"
                    align="center">
                    <template slot-scope="scope">
                      <el-button type="text" @click="checkPlan(scope.row.need)" v-if="fucBtns.includes('check-btn')">查看</el-button>
                      <el-button type="text" @click="openItemEditor(scope.row)" v-if="fucBtns.includes('edit-btn')">编辑</el-button>
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
                  label="人员名称"
                  align="center">
                  <template slot-scope="scope">{{ scope.row.userName }}</template>
                </el-table-column>
                <el-table-column
                  label="组织名称"
                  align="center">
                  <template slot-scope="scope">{{ scope.row.deptName }}</template>
                </el-table-column>
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
                  width="110"
                  align="center">
                  <template slot-scope="scope">{{ formatTime(scope.row.theorysTime) }}</template>
                </el-table-column>
                <el-table-column
                  label="理论结束时间"
                  width="110"
                  align="center">
                  <template slot-scope="scope">{{ formatTime(scope.row.theoryeTime) }}</template>
                </el-table-column>
                <el-table-column
                  label="实际开始时间"
                  width="110"
                  align="center">
                  <template slot-scope="scope">{{ scope.row.actStartTime ? formatTime(scope.row.actStartTime) : '--' }}</template>
                </el-table-column>
                <el-table-column
                  label="实际结束时间"
                  width="110"
                  align="center">
                  <template slot-scope="scope">{{ scope.row.actEndTime ? formatTime(scope.row.actEndTime) : '--' }}</template>
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
                  fixed="right"
                  label="操作"
                  width="180"
                  align="center">
                  <template slot-scope="scope">
<!--                    1未学习2学习中3已学习-->
                    <el-button v-if="scope.row.state == 0 && fucBtns.includes('begin-btn')" type="text" @click="startLearn(scope.row.planPerId)">开始学习</el-button>
                    <el-button v-else-if="scope.row.state == 1 && fucBtns.includes('end-btn')" type="text" style="color: #f56c6c;" @click="endLearn(scope.row.planPerId)">结束学习</el-button>
                    <span v-else type="text" style="margin-right: 10px; color: #909399;">结束学习</span>
                    <el-button type="text" @click="getPlanFileList(scope.row.planId)" v-if="fucBtns.includes('file-btn')">附件</el-button>
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
                            @close-loading="closeLoading"
                            @handleNodeClick="handleRecordTree">
              </tree-diagram>
            </el-aside>

            <el-main class="inner-content">
              <div class="container-box">
                <el-table ref="leaderTable"
                          border
                          stripe
                          :data="recordList"
                          tooltip-effect="dark"
                          style="width: 100%"
                          @selection-change="handleSelectionChange">
                  <el-table-column
                    label="人员名称"
                    align="center">
                    <template slot-scope="scope">{{ scope.row.userName }}</template>
                  </el-table-column>
                  <el-table-column
                    label="组织名称"
                    align="center">
                    <template slot-scope="scope">{{ scope.row.deptName }}</template>
                  </el-table-column>
                  <el-table-column
                    label="课程名称"
                    align="center">
                    <template slot-scope="scope">{{ scope.row.courseTitle }}</template>
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
                    <template slot-scope="scope">{{ formatTime(scope.row.theorysTime) }}</template>
                  </el-table-column>
                  <el-table-column
                    label="理论结束时间"
                    width="250"
                    align="center">
                    <template slot-scope="scope">{{ formatTime(scope.row.theoryeTime) }}</template>
                  </el-table-column>
                  <el-table-column
                    label="状态"
                    width="135"
                    align="center">
                    <template slot-scope="scope">{{ states[scope.row.state] }}</template>
                  </el-table-column>
                  <el-table-column
                    fixed="right"
                    label="详细内容"
                    width="105"
                    align="center">
                    <template slot-scope="scope">
                      <el-button type="text" @click="checkDetail(scope.row.planId, scope.row.userId)" v-if="fucBtns.includes('detail-btn')" >详细</el-button>
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

          <el-dialog :close-on-click-modal="false" :title="'详细'" :visible.sync="showDetailLog"
                     :width="'970px'">
            <div class="detail-log">
              <el-collapse accordion v-model="colNames">
                <el-collapse-item name="col_a">
                  <template slot="title">
                    基本信息
                  </template>
                  <div class="class-out">
                    <div class="col-inner-item">
                      <p class="label">课程：</p>
                      <p>{{recordDetail.className}}</p>
                    </div>
                    <div class="col-inner-item">
                      <p class="label">学习部门：</p>
                      <p>{{recordDetail.department}}</p>
                    </div>
                    <div class="col-inner-item">
                      <p class="label">类别：</p>
                      <p>{{recordDetail.type}}</p>
                    </div>
                    <div class="col-inner-item">
                      <p class="label">开始时间：</p>
                      <p>{{formatTime(recordDetail.startTime)}}</p>
                    </div>
                    <div class="col-inner-item">
                      <p class="label">结束时间：</p>
                      <p>{{formatTime(recordDetail.endTime)}}</p>
                    </div>
<!--                    <div class="col-inner-item">-->
<!--                      <p class="label">学习方式：</p>-->
<!--                      <p>{{recordDetail.learningStyle}}</p>-->
<!--                    </div>-->
                    <div class="col-inner-item">
                      <p class="label">课程状态：</p>
                      <p>{{recordDetail.classState}}</p>
                    </div>
                    <div class="col-inner-item">
                      <p class="label">理论学习人数：</p>
                      <p>{{recordDetail.theoryNum}} 人</p>
                    </div>
                    <div class="col-inner-item">
                      <p class="label">发布人：</p>
                      <p>{{recordDetail.public}}</p>
                    </div>
                  </div>
                </el-collapse-item>
                <el-collapse-item title="反馈 Feedback" name="col_b">
                  <template slot="title">课程统计</template>
                  <div class="class-out">
                    <div class="col-inner-item">
                      <p class="label">已学习人数：</p>
                      <p>{{recordDetail.learned}} 人</p>
                    </div>
                    <div class="col-inner-item">
                      <p class="label">未学习人数：</p>
                      <p>{{recordDetail.unlearned}} 人</p>
                    </div>
                    <div class="col-inner-item">
                      <p class="label">参与学习率：</p>
                      <p>{{recordDetail.learnedRate}} %</p>
                    </div>
                    <div class="col-inner-item">
                      <p class="label">考试人数：</p>
                      <p>{{recordDetail.examination}} 人</p>
                    </div>
                    <div class="col-inner-item">
                      <p class="label">合格人数：</p>
                      <p>{{recordDetail.pass}} 人</p>
                    </div>
                    <div class="col-inner-item">
                      <p class="label">合格率：</p>
                      <p>{{recordDetail.passRate}} %</p>
                    </div>
                    <div class="col-inner-item">
                      <p class="label">理论学习用时：</p>
                      <p>{{recordDetail.theory}} 小时</p>
                    </div>
                    <div class="col-inner-item">
                      <p class="label">实际学习用时：</p>
                      <p>{{recordDetail.act}} 小时</p>
                    </div>
                    <div class="col-inner-item">
                      <p class="label">总课时：</p>
                      <p>{{recordDetail.totalHour}} 小时</p>
                    </div>
                  </div>
                </el-collapse-item>
                <el-collapse-item title="效率 Efficiency" name="col_c">
                  <template slot="title">文档附件</template>
                  <ul class="download-list">
                    <li v-for="(item, index) in recordDetail.downList" :key="index">
                      {{item.name}}
                      <a target="_blank" :href="`${item.path}?attname=${item.name}`">下载</a>
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
import base from '../../api/baseUrl'
import {
  getPlanDeptList,
  getPlanTable,
  getContentTable,
  getRecordTable,
  releasePlan,
  updatePlan,
  deletePlan,
  copyPlan,
  getTrainStatistic,
  startLearn,
  endLearn,
  getPlanFileList
} from '@/api/organization'
import {getQiNiuToken} from '@/api/upload'
import axios from '@/api/axios'

export default {
  name: 'staffTraining',
  data () {
    return {
      pageLoading: false,
      breadcrumb: ['安全基础管理', '全员培训'],
      uploadingAddress: '',
      fileAddress: '',
      uploadData: {
        token: ''
      },
      uploadDataTopic: {
        id: []
      },
      activeName: 'tab_a',
      triggerAid: '',
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
      lessonTypes: [
        {
          label: '训练',
          value: '1'
        }, {
          label: '考试',
          value: '2'
        }
      ],
      planList: [],
      multipleSelection: [],
      showPlanDialog: false,
      addPlanData: {
        className: '',
        planType: '',
        startTime: '',
        hourRequire: '',
        endTime: '',
        need: ''
      },
      fileList: [],
      trainList: [],
      recordList: [],
      showDetailLog: false,
      recordDetail: {
        className: '',
        department: '',
        type: '1',
        startTime: '',
        endTime: '',
        // learningStyle: '',
        classState: '',
        theoryNum: 0,
        public: '',
        learned: 0,
        unlearned: 0,
        learnedRate: 0,
        examination: 0,
        pass: 0,
        passRate: 0,
        theory: 0,
        act: 0,
        totalHour: 0,
        downList: []
      },
      colNames: 'col_a',
      editData: {
        id: '',
        className: '',
        planType: '',
        startTime: '',
        hourRequire: 0,
        endTime: '',
        need: '',
        fileList: []
      },
      showEditDialog: false,
      importting: false,
      importList: [],
      uploadHeader: {
        token: ''
      },
      // uploadData: {
      //   id: ''
      // }, // 上传数据
      pickerDisabled: {
        // 验证时间范围
        disabledDate: (time) => {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      fucBtns: [],
      userId: ''
    }
  },
  created () {
    // 设置题库上传的header 添加token
    this.uploadHeader.token = sessionStorage.getItem('TOKEN_KEY')
    // 设置七牛云
    this.uploadingAddress = base.uploadQiniuAdr
    this.fileAddress = base.fileQiniuAddr

    this.getPlanDeptTree(true)
    this.getContentTable()
    this.getBtnAuthority()
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
      this.triggerAid = deptId
      this.pageLoading = true
      this.getPlanTable()
    },
    // 点击记录 tree 节点
    handleRecordTree (deptId) {
      this.triggerCid = deptId
      this.pageLoading = true
      this.getRecordTable()
    },
    // 获取treeData
    getPlanDeptTree (create) {
      getPlanDeptList().then((res) => {
        if (res.code === 200) {
          this.organizationTree = res.data
          if (create) {
            this.triggerAid = this.organizationTree[0].deptId
            this.triggerCid = this.organizationTree[0].deptId
            this.getPlanTable()
            this.getRecordTable()
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
      this.pageLoading = true
      getRecordTable(this.triggerCid, this.pageDataC.pageNo, this.pageDataC.pageSize).then((res) => {
        if (res.code === 200) {
          this.recordList = res.data
          this.pageDataC.total = res.total
          console.log(res.data)
          this.userId = res.data.userId
        }
        this.pageLoading = false
      })
    },
    // 弹窗具体需求
    checkPlan (need) {
      let needStr = ''
      if (need) {
        needStr = need
      } else {
        needStr = '暂无'
      }
      this.$alert(needStr, '培训需求')
    },
    // 打开发布计划窗口
    openReleasePlan () {
      this.addPlanData = {
        className: '',
        planType: '',
        startTime: '',
        hourRequire: '',
        endTime: '',
        need: ''
      }
      this.fileList = []
      this.showPlanDialog = true
    },
    // 发布计划
    releasePlan () {
      if (!this.addPlanData.className || !this.addPlanData.planType || !this.addPlanData.hourRequire || !this.addPlanData.startTime || !this.addPlanData.endTime) {
        this.$message.error('课程名称、类别、课时、理论开始时间、理论结束时间为必填项')
        return
      }
      if ((new Date(this.addPlanData.startTime)).getTime() >= (new Date(this.addPlanData.endTime)).getTime()) {
        this.$message.error('选择预期结束时间需大于开始时间')
        return
      }
      let list = []
      this.fileList.forEach(item => {
        let listItem = {
          'name': item.name,
          'path': item.path,
          'size': item.size.toString()
        }
        list.push(listItem)
      })
      let data = {
        deptId: this.triggerAid, // 当前节点部门ID
        courseTitle: this.addPlanData.className, // 课程名称
        category: this.addPlanData.planType, // 类别
        hourRequire: this.addPlanData.hourRequire, // 总课时
        // creater: '', // 计划发布人id
        // planTime: '', // 计划发布时间 系统自动生成
        theorysTime: this.addPlanData.startTime, // 理论开始时间
        theoryeTime: this.addPlanData.endTime, // 理论结束时间
        need: this.addPlanData.need, // 培训需求
        attachmentList: list
      }
      let vm = this
      releasePlan(data).then((res) => {
        if (res.code === 200) {
          vm.showPlanDialog = false
          vm.pageLoading = true
          vm.getPlanTable()
          vm.getContentTable()
          vm.getRecordTable()
        } else {
          vm.$message.error(res.message || '计划发布失败，请稍后重试')
        }
      })
    },
    // 打开编辑窗口
    openItemEditor (data) {
      this.editData = {
        className: '',
        planType: '',
        startTime: '',
        hourRequire: '',
        endTime: '',
        need: '',
        fileList: [],
        id: ''
      }
      this.showEditDialog = true
      this.editData = {
        className: data.courseTitle,
        planType: data.category,
        startTime: data.theorysTime,
        hourRequire: data.hourRequire,
        endTime: data.theoryeTime,
        need: data.need,
        fileList: data.attachmentList ? data.attachmentList : [],
        id: data.id
      }
    },
    // 确认edit
    confirmEdit () {
      if (!this.editData.className || !this.editData.planType || !this.editData.hourRequire || !this.editData.startTime || !this.editData.endTime) {
        this.$message.error('课程名称、类别、课时、理论开始时间、理论结束时间为必填项')
        return
      }
      if ((new Date(this.editData.startTime)).getTime() >= (new Date(this.editData.endTime)).getTime()) {
        this.$message.error('选择预期结束时间需大于开始时间')
        return
      }
      let list = []
      this.editData.fileList.forEach(item => {
        let listItem = {
          'name': item.name,
          'path': item.path,
          'size': item.size.toString()
        }
        list.push(listItem)
      })
      let data = {
        id: this.editData.id,
        deptId: this.triggerAid, // 当前节点部门ID
        courseTitle: this.editData.className, // 课程名称
        category: this.editData.planType, // 类别
        hourRequire: this.editData.hourRequire, // 总课时
        theorysTime: this.editData.startTime, // 理论开始时间
        theoryeTime: this.editData.endTime, // 理论结束时间
        need: this.editData.need, // 培训需求
        attachmentList: list
      }
      let vm = this
      updatePlan(data).then((res) => {
        if (res.code === 200) {
          vm.showEditDialog = false
          vm.pageLoading = true
          vm.getPlanTable()
          vm.getContentTable()
          vm.getRecordTable()
        } else {
          vm.$message.error(res.message || '计划编辑失败，请稍后重试')
        }
      })
    },
    copyPlan () {
      this.pageLoading = true
      copyPlan().then((res) => {
        if (res.code === 200) {
          this.getPlanTable()
        }
        this.pageLoading = false
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // upload前，获取七牛云的token
    handleBeforeUpload (file) {
      let testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      // .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .AVI, .mov, .rmvb, .rm, .FLV, .mp4, .3GP
      const extens = testmsg === 'xls'
      const extens1 = testmsg === 'xlsx'
      const extens2 = testmsg === 'pdf'
      const extens3 = testmsg === 'doc'
      const extens4 = testmsg === 'docx'
      const extens5 = testmsg === 'ppt'
      const extens6 = testmsg === 'pptx'
      const extens7 = testmsg === 'AVI'
      const extens8 = testmsg === 'mov'
      const extens9 = testmsg === 'rmvb'
      const extens10 = testmsg === 'rm'
      const extens11 = testmsg === 'FLV'
      const extens12 = testmsg === 'mp4'
      const extens13 = testmsg === '3GP'
      // const isLt2M = file.size / 1024 / 1024 < 10
      if (!extens && !extens1 && !extens2 && !extens3 && !extens4 && !extens5 && !extens6 && !extens7 && !extens8 && !extens9 && !extens10 && !extens11 && !extens12 && !extens13) {
        this.$message({
          message: '上传文件只能是 .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .AVI, .mov, .rmvb, .rm, .FLV, .mp4, .3GP格式!',
          type: 'warning'
        })
        return false
      }
      return getQiNiuToken().then((res) => {
        this.uploadData.token = res
      })
      // return extens || extens1 || extens2 || extens3 || extens4 || extens5 || extens6 || extens7 || extens8 || extens9 || extens10 || extens11 || extens12 || extens13
    },
    // 上传结束后，返回上传结果
    handleSuccess (response, file, fileList) {
      this.fileList = []
      fileList.forEach(item => {
        let fItem = {
          name: item.name, // 附件名称
          path: this.fileAddress + item.response.key, // 附件路径
          size: item.size // 附件大小
        }
        this.fileList.push(fItem)
      })
    },
    // 每次删除后再遍历
    handleRemove (file, fileList) {
      this.fileList = []
      fileList.forEach(item => {
        let fItem = {
          name: item.name, // 附件名称
          path: this.fileAddress + item.response.key, // 附件路径
          size: item.size // 附件大小
        }
        this.fileList.push(fItem)
      })
    },
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    handleSuccessA (response, file, fileList) {
      this.editData.fileList = []
      fileList.forEach(item => {
        let fItem = {
          name: item.name, // 附件名称
          path: this.fileAddress + item.response.key, // 附件路径
          size: item.size // 附件大小
        }
        this.editData.fileList.push(fItem)
      })
    },
    handleRemoveA (file, fileList) {
      this.editData.fileList = []
      fileList.forEach(item => {
        let fItem = {
          name: item.name, // 附件名称
          path: this.fileAddress + item.response.key, // 附件路径
          size: item.size // 附件大小
        }
        this.editData.fileList.push(fItem)
      })
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
        this.pageLoading = true
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
            this.getPlanTable()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    startLearn (id) {
      this.pageLoading = true
      let data = {id: id}
      startLearn(data).then((res) => {
        if (res.code && res.code === 200) {
          this.getContentTable()
          this.getRecordTable()
          this.pageLoading = false
        } else {
          this.pageLoading = false
          this.$message.error('提交失败，请稍后重试')
        }
      })
    },
    endLearn (id) {
      this.pageLoading = true
      let data = {id: id}
      endLearn(data).then((res) => {
        if (res.code && res.code === 200) {
          this.getContentTable()
          this.getRecordTable()
          this.pageLoading = false
        } else {
          this.pageLoading = false
          this.$message.error('提交失败，请稍后重试')
        }
      })
    },
    checkDetail (id, userId) {
      this.pageLoading = true
      let token = sessionStorage.getItem('TOKEN_KEY')
      // let userId = this.userId
      console.log(userId)
      // newId = JSON.stringify(newId)
      // get data, then, showDetailLog
      getTrainStatistic(userId, id, token).then((res) => {
        if (res.code && res.code === 200) {
          this.recordDetail.className = res.data.trainPlan.courseTitle
          this.recordDetail.department = res.data.trainPlan.deptName
          this.recordDetail.type = this.planType[res.data.trainPlan.category]
          this.recordDetail.startTime = res.data.trainPlan.theorysTime
          this.recordDetail.endTime = res.data.trainPlan.theoryeTime
          this.recordDetail.classState = this.states[res.data.trainPlan.state]
          this.recordDetail.theoryNum = res.data.theor_learn
          this.recordDetail.public = res.data.trainPlan.creater
          this.recordDetail.learned = res.data.learned
          this.recordDetail.unlearned = res.data.unlearned
          this.recordDetail.learnedRate = (res.data.learnedRate * 100).toFixed(2)
          this.recordDetail.examination = res.data.examination
          this.recordDetail.pass = res.data.pass
          this.recordDetail.passRate = (res.data.passRate * 100).toFixed(2)
          this.recordDetail.theory = res.data.theory
          this.recordDetail.act = res.data.act
          this.recordDetail.totalHour = res.data.hourRequire
          this.recordDetail.downList = res.data.trainPlan.attachmentList

          this.colNames = 'col_a'
          this.showDetailLog = true
        } else {
          this.$message.error('获取数据失败，请稍后刷新页面重试')
        }
      })
      this.pageLoading = false
    },
    getPlanFileList (planId) {
      let vm = this
      getPlanFileList(planId).then(res => {
        vm.pageLoading = true
        if (res.code === 200) {
          res.data.forEach(item => {
            vm.downLoadFile(item)
          })
        } else {
          vm.$message({
            message: '获取下载列表失败，请稍后重试',
            type: 'warning'
          })
        }
        vm.pageLoading = false
      })
    },
    downLoadFile (item) {
      window.location.href = `${item.path}?attname=${item.name}`
    },
    // 导入接口地址
    uploadUrl () {
      const baseUrl = base.baseUrl
      return baseUrl + '/train/importTestInformation'
    },
    // 导入
    beforeImport (file) {
      this.uploading = true
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: 'warning',
          message: `请选中至少一条`
        })
        return false
      }
      this.uploadDataTopic.id = []
      this.multipleSelection.forEach((item) => {
        this.uploadDataTopic.id.push(item.id)
      })
    },
    // 导入成功
    importSuccess (response, file, fileList) {
      this.$notify.success('导入成功')
      this.uploading = false
      this.fetchTableData()
    },
    // 导入失败
    importError (file, fileList) {
      this.$notify.error('导入失败，请稍后重试')
    },
    // 获取按钮权限方法
    getBtnAuthority () {
      const authId = {authId: '2-2'}
      axios
        .get('user/getBtnArray', authId)
        .then((res) => {
          if (res.data.code === 200) {
            console.log(res.data)
            this.fucBtns = res.data.data.functionBtns
            console.log(this.fucBtns)
          } else {
            this.$message({
              message: res.data.message,
              type: 'warning'
            })
          }
        })
    }
  },
  components: {TreeDiagram, BreadCrumb}
}
</script>

<style scoped lang="scss">
// .inner-page-container{
//   height: 100%;
//   .el-header{
//     padding: 0;
//   }
//   .el-main{
//     padding: 0;
//   }
// }
/* el-dialog */
/deep/.inner-main-container{
  // padding: 0;
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
            }
              .el-textarea__inner{
                height: 100%;
                border-color: #d4d4d4 !important
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
// /deep/.inner-main-container{
//   .el-tabs--border-card{
//     position: relative;
//     border-color: #eeeeee;
//   }
//   .el-tabs__nav{
//     height: 50px;
//   }
//   .el-tabs__item{
//     height: 51px;
//     line-height: 50px;
//     font-size: 16px;
//     color: #777;
//     &.is-active{
//       color: #409EFF;
//       border-top: 2px solid #409EFF;
//     }
//   }
//   .el-tabs__content{
//     height: 100%;
//     width: 100%;
//     padding: 50px 0 0;
//     position: absolute;
//     top: 0;
//     left: 0;
//     .el-tab-pane{
//       height: 100%;
//       .inner-main-content{
//         background: #f2f2f2;
//         width: 100%;
//         height: 100%;
//         &.bg-fff{
//           padding: 25px;
//           background: #fff;
//           .container-box{
//             width: 100%;
//             overflow-y: auto;
//           }
//         }
//       }
//     }
//   }
// }
.container-box{
  width: 100%;
}
.inner-content{
  padding: 0;
}
.inner-page-container {
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
</style>
