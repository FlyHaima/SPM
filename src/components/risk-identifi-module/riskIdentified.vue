<template>
  <el-container class="inner-page-container" v-loading="pageLoading">
    <el-header class="inner-header">
      <bread-crumb :breadList="breadcrumb">
      </bread-crumb>
    </el-header>
    <el-main class="inner-main-container">
      <el-container class="inner-main-content">
        <el-aside class="inner-aside" width="408px">
          <tree-read-only
            :tree-name="'风险单元'"
            :tree-data="organizationTree"
            @open-loading="openLoading"
            @close-loading="closeLoading">
          </tree-read-only>
        </el-aside>
        <el-main class="inner-content">
          <div class="container-box">
            <p class="btn-p">
              <a class="export-btn" @click="openExportDialog"><i class></i>导出</a>
              <a class="import-btn" @click="openImportDialog"><i></i>导入</a>
              <a class="delete-btn" @click="openDeleteConfirm"><i class="el-icon-delete"></i>删除</a>
              <a class="add-btn" @click="openAddConfirm"><i class="el-icon-plus"></i>添加</a>
            </p>

            <el-table ref="leaderTable"
                      border
                      stripe
                      :data="riskList"
                      tooltip-effect="dark"
                      style="width: 100%"
                      @selection-change="handleSelectionChange">
              <el-table-column
                type="selection"
                width="40" align="center">
              </el-table-column>
              <el-table-column
                label="危险源名称"
                width="300"
                align="center">
                <template slot-scope="scope">{{ scope.row.name }}</template>
              </el-table-column>
              <el-table-column
                label="进度"
                align="center">
                <template slot-scope="scope">
                  <table-step :active="scope.row.progress">
                  </table-step>
                </template>
              </el-table-column>
              <el-table-column
                label="风险识别状态"
                width="180"
                align="center">
                <template slot-scope="scope">{{riskStates[scope.row.state]}}</template>
              </el-table-column>
              <el-table-column
                v-if="isEndPint"
                label="操作"
                width="80"
                align="center">
                <template slot-scope="scope">
                  <el-button size="mini" type="text" @click="openDialog(scope.row.id)">辨识</el-button>
                </template>
              </el-table-column>
            </el-table>

            <el-dialog :visible.sync="showDialog" :close-on-click-modal="false" :close-on-press-escape="false"
                       :width="'1200px'"
                       :show-close="false">
              <div class="dialog-box" v-loading="dialogLoading">
                <el-tabs v-model="activeStep" @tab-click="handleClick" type="border-card">
                  <el-tab-pane :disabled="doneStep<1 ? true : false" name="step-1">
                    <span slot="label">① 辨识范围</span>
                    <div class="step-box step-1-box">
                      <p class="step-1-p">
                        <span class="label">风险点：</span>
                        <el-input size="medium" disabled="disabled" v-model="stepObjA.pointA"></el-input>
                        <el-input size="medium" disabled="disabled" v-model="stepObjA.pointB"></el-input>
                        <el-input size="medium" disabled="disabled" v-model="stepObjA.pointC"></el-input>
                      </p>
                      <p class="step-1-p">
                        <span class="label">辨识范围：</span>
                        <el-select v-model="stepObjA.identifierRange"  placeholder="请选择" size="medium">
                          <el-option
                            v-for="item in rangeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </p>
                      <p class="step-1-p">
                        <span class="label">作业步骤：</span>
                        <el-input size="medium" v-model="stepObjA.workStep"></el-input>
                      </p>
                      <p class="step-1-p">
                        <span class="label">风险类别/事故后果：</span>
                        <el-select v-model="stepObjA.riskType"  placeholder="请选择" size="medium">
                          <el-option
                            v-for="item in riskTypeOptions"
                            :key="item"
                            :label="item"
                            :value="item">
                          </el-option>
                        </el-select>
                      </p>
                      <p class="step-1-p">
                        <span class="label">风险因素：</span>
                        <el-cascader
                          size="medium"
                          v-model="stepObjA.riskReason"
                          :options="reasonOptions">
                        </el-cascader>
                      </p>
                      <p class="step-1-p">
                        <span class="label">风险点类别：</span>
                        <el-select v-model="stepObjA.riskPointType"  placeholder="请选择" size="medium">
                          <el-option
                            v-for="item in riskPointOptions"
                            :key="item"
                            :label="item"
                            :value="item">
                          </el-option>
                        </el-select>
                      </p>
                      <p class="step-1-p">
                        <span class="label">风险评估法：</span>
                        <el-select v-model="stepObjA.identifierWay"  placeholder="请选择" size="medium">
                          <el-option
                            v-for="item in ideWayOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </p>
                      <div class="btn-box">
                        <el-button size="medium" type="primary" plain @click="closeDialog">关闭</el-button>
                        <el-button size="medium" @click="changeStepOne" v-if="doneStep >= 1">修改</el-button>
                        <el-button size="medium" @click="saveStepOne" v-else>保存</el-button>
                        <el-button size="medium" type="primary" @click="toStepTwo">下一步</el-button>
                      </div>
                    </div>
                  </el-tab-pane>
                  <el-tab-pane :disabled="doneStep<2 ? true : false" name="step-2">
                    <span slot="label">② 划分单元</span>
                    <div class="step-box step-2-box">
                      <div class="units-box">
                        <div class="unit-item">
                          <p class="title">一级单元</p>
                          <p class="input-p">
                            <span class="label">{{stepObjB.levelNameA}}</span>
                            <el-input size="medium" v-model="stepObjB.levelNumA" @input="changeLevelNum" @change="changeLevelNum"></el-input>
                          </p>
                        </div>
                        <div class="unit-item">
                          <p class="title">二级子单元</p>
                          <p class="input-p">
                            <span class="label">{{stepObjB.levelNameB}}</span>
                            <el-input size="medium" v-model="stepObjB.levelNumB" @input="changeLevelNum" @change="changeLevelNum"></el-input>
                          </p>
                        </div>
                        <div class="unit-item">
                          <p class="title">三级子单元</p>
                          <p class="input-p">
                            <span class="label">{{stepObjB.levelNameC}}</span>
                            <el-input size="medium" v-model="stepObjB.levelNumC" @input="changeLevelNum" @change="changeLevelNum"></el-input>
                          </p>
                        </div>
                      </div>
                      <p class="step-2-p">
                        <span class="label">三级风险单元编号</span>
                        <el-input size="medium" disabled="disabled" v-model="stepObjB.unitLevelNum"></el-input>
                      </p>
                      <p class="step-2-p">
                        <span class="label">负责人</span>
                        <el-select v-model="stepObjB.administrator"  placeholder="请选择" size="medium">
                          <el-option
                            v-for="item in adminOptions"
                            :key="item"
                            :label="item"
                            :value="item">
                          </el-option>
                        </el-select>
                      </p>
                      <div class="btn-box">
                        <el-button size="medium" type="primary" plain @click="closeDialog">关闭</el-button>
                        <el-button size="medium" @click="changeStepTwo" v-if="doneStep >= 2">修改</el-button>
                        <el-button size="medium" @click="saveStepTwo" v-else>保存</el-button>
                        <el-button size="medium" type="primary" @click="toStepThree">下一步</el-button>
                      </div>
                    </div>
                  </el-tab-pane>
                  <el-tab-pane :disabled="doneStep<3 ? true : false" name="step-3">
                    <span slot="label">③ 开展评估</span>
                    <div class="step-box step-3-box">
                      <template v-if="evaluationMethod === 'LEC'">
                        <div class="line-p">
                          <div class="line-lf">
                            <div class="label">事故发生的可能性</div>
                            <el-select v-model="stepObjC.LEC.L" @change="changeLEC" placeholder="请选择" size="medium">
                              <el-option
                                v-for="item in lec_l_options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                              </el-option>
                            </el-select>
                          </div>
                          <div class="line-rt">
                            <div class="label">L值</div>
                            <el-input v-model="stepObjC.LEC.L" disabled="disabled" size="medium"></el-input>
                          </div>
                        </div>
                        <div class="line-p">
                          <div class="line-lf">
                            <div class="label">暴露于危险环境的频率</div>
                            <el-select v-model="stepObjC.LEC.E" @change="changeLEC" placeholder="请选择" size="medium">
                              <el-option
                                v-for="item in lec_e_options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                              </el-option>
                            </el-select>
                          </div>
                          <div class="line-rt">
                            <div class="label">E值</div>
                            <el-input v-model="stepObjC.LEC.E" disabled="disabled" size="medium"></el-input>
                          </div>
                        </div>
                        <div class="line-p">
                          <div class="line-lf">
                            <div class="label">事故后果严重程度</div>
                            <el-select v-model="stepObjC.LEC.C" @change="changeLEC" placeholder="请选择" size="medium">
                              <el-option
                                v-for="item in lec_c_options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                              </el-option>
                            </el-select>
                          </div>
                          <div class="line-rt" v-if="evaluationMethod === 'LEC'">
                            <div class="label">C值</div>
                            <el-input v-model="stepObjC.LEC.C" disabled="disabled" size="medium"></el-input>
                          </div>
                        </div>
                        <div class="line-p">
                          <div class="line-lf">
                            <div class="label">风险值</div>
                            <el-input v-model="stepObjC.LEC.D" disabled="disabled" size="medium"></el-input>
                          </div>
                          <div class="line-rt">
                            <div class="label">风险等级</div>
                            <el-input v-model="stepObjC.LEC.riskLevel" disabled="disabled" size="medium"></el-input>
                          </div>
                        </div>
                      </template>
                      <template v-else>
                        <div class="line-p">
                          <div class="line-lf">
                            <div class="label">事故发生的可能性</div>
                            <el-select v-model="stepObjC.LS.L" @change="changeLS" placeholder="请选择" size="medium">
                              <el-option
                                v-for="item in ls_l_options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                              </el-option>
                            </el-select>
                          </div>
                          <div class="line-rt">
                            <div class="label">L值</div>
                            <el-input v-model="stepObjC.LS.L" disabled="disabled" size="medium"></el-input>
                          </div>
                        </div>
                        <div class="line-p">
                          <div class="line-lf">
                            <div class="label">事件后果严重性</div>
                            <el-select v-model="stepObjC.LS.S" @change="changeLS" placeholder="请选择" size="medium">
                              <el-option
                                v-for="item in ls_s_options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                              </el-option>
                            </el-select>
                          </div>
                          <div class="line-rt">
                            <div class="label">S值</div>
                            <el-input v-model="stepObjC.LS.S" disabled="disabled" size="medium"></el-input>
                          </div>
                        </div>
                        <div class="line-p">
                          <div class="line-lf">
                            <div class="label">R值</div>
                            <el-input v-model="stepObjC.LS.R" disabled="disabled" size="medium"></el-input>
                          </div>
                          <div class="line-rt">
                            <div class="label">风险等级</div>
                            <el-input v-model="stepObjC.LS.riskLevel" disabled="disabled" size="medium"></el-input>
                          </div>
                        </div>
                      </template>
                      <div class="line-p">
                        <div class="line-lf">
                          <div class="label">管控层级</div>
                          <el-select v-model="stepObjC.managerLevel"  placeholder="请选择" size="medium">
                            <el-option
                              v-for="item in managerLevel"
                              :key="item"
                              :label="item"
                              :value="item">
                            </el-option>
                          </el-select>
                        </div>
                        <div class="line-rt">
                          <div class="label">管控人</div>
                          <el-input v-model="stepObjC.manager" size="medium"></el-input>
                        </div>
                      </div>
                      <div class="btn-box" :class="evaluationMethod === 'LS' ? 'isLS' : ''">
                        <el-button size="medium" type="primary" plain @click="closeDialog">关闭</el-button>
                        <el-button size="medium" @click="changeStepThree" v-if="doneStep >= 3">修改</el-button>
                        <el-button size="medium" @click="saveStepThree" v-else>保存</el-button>
                        <el-button size="medium" type="primary" @click="toStepFour">下一步</el-button>
                      </div>
                    </div>
                  </el-tab-pane>
                  <el-tab-pane :disabled="doneStep<4 ? true : false" name="step-4">
                    <span slot="label">④ 管控措施</span>
                    <div class="step-box step-4-box">
                      <p class="step-4-p">
                        <span class="label">应采取的管控措施：</span>
                        <el-input size="medium" v-model="stepObjD.controlMeasure" disabled="disabled"></el-input>
                      </p>
                      <p class="step-4-p">
                        <span class="label">管控措施依据的标准和规范：</span>
                        <el-input size="medium" v-model="stepObjD.standard"></el-input>
                      </p>
                      <p class="step-4-p">
                        <span class="label">技术措施：</span>
                        <el-input size="medium" v-model="stepObjD.technicalMeasures"></el-input>
                      </p>
                      <p class="step-4-p">
                        <span class="label">管理措施：</span>
                        <el-input size="medium" v-model="stepObjD.managerMeasures"></el-input>
                      </p>
                      <p class="step-4-p">
                        <span class="label">教育措施：</span>
                        <el-input size="medium" v-model="stepObjD.educationMeasures"></el-input>
                      </p>
                      <p class="step-4-p">
                        <span class="label">防护措施：</span>
                        <el-input size="medium" v-model="stepObjD.protectMeasures"></el-input>
                      </p>
                      <p class="step-4-p">
                        <span class="label">应急措施：</span>
                        <el-input size="medium" v-model="stepObjD.emergencyMeasures"></el-input>
                      </p>
                      <div class="btn-box">
                        <el-button size="medium" type="primary" plain @click="closeDialog">关闭</el-button>
                        <el-button size="medium" @click="changeStepFour" v-if="doneStep >= 4">修改</el-button>
                        <el-button size="medium" @click="saveStepFour" v-else>保存</el-button>
                        <el-button size="medium" type="primary" @click="finish">完成</el-button>
                      </div>
                    </div>
                  </el-tab-pane>
                </el-tabs>
              </div>
            </el-dialog>

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
    </el-main>
  </el-container>
</template>

<script>
import BreadCrumb from '../Breadcrumb/Breadcrumb'
import TreeReadOnly from '../tree-diagram/treeReadOnly'
import TableStep from '../step/step'

export default {
  name: 'riskIdentified',
  data () {
    return {
      pageLoading: false,
      dialogLoading: false,
      breadcrumb: ['风险辨识评估', '风险辨识'],
      organizationTree: [
        {
          'riskId': '1',
          'riskName': '多多集团',
          'riskLevelCode': null,
          'pId': '0',
          'orderNo': null,
          'level': '0',
          'children': [
            {
              'children': [
                {
                  'children': [
                    {
                      'children': [
                        {
                          'children': null,
                          'riskId': '1ak070000001',
                          'riskName': '前端下的风险点',
                          'riskLevelCode': '2',
                          'pId': '6',
                          'orderNo': 1,
                          'level': '4'
                        },
                        {
                          'children': null,
                          'riskId': '1ak070000002',
                          'riskName': '前端下的风险点',
                          'riskLevelCode': '1',
                          'pId': '6',
                          'orderNo': 2,
                          'level': '4'
                        },
                        {
                          'children': null,
                          'riskId': '1ak070000003',
                          'riskName': '前端下的风险点',
                          'riskLevelCode': '3',
                          'pId': '6',
                          'orderNo': 3,
                          'level': '4'
                        }
                      ],
                      'riskId': '6',
                      'riskName': '前端',
                      'riskLevelCode': null,
                      'pId': '4',
                      'orderNo': null,
                      'level': '3'
                    },
                    {
                      'children': null,
                      'riskId': '1',
                      'riskName': '测试风险点',
                      'riskLevelCode': '3',
                      'pId': '4',
                      'orderNo': 1,
                      'level': '4'
                    },
                    {
                      'children': null,
                      'riskId': '2',
                      'riskName': '风险点2',
                      'riskLevelCode': '3',
                      'pId': '4',
                      'orderNo': 2,
                      'level': '4'
                    }
                  ],
                  'riskId': '4',
                  'riskName': '技术部1',
                  'riskLevelCode': null,
                  'pId': '11',
                  'orderNo': null,
                  'level': '2'
                }
              ],
              'riskId': '11',
              'riskName': '黑龙江多米科技有限公司',
              'riskLevelCode': null,
              'pId': '1',
              'orderNo': null,
              'level': '1'
            },
            {
              'children': [
                {
                  'children': null,
                  'riskId': '1a9020000003',
                  'riskName': '测试组织节点12',
                  'riskLevelCode': '3',
                  'pId': '1a9020000001',
                  'orderNo': null,
                  'level': '2'
                },
                {
                  'children': null,
                  'riskId': '1a9020000006',
                  'riskName': '测试组织节点555',
                  'riskLevelCode': '0',
                  'pId': '1a9020000001',
                  'orderNo': null,
                  'level': '2'
                },
                {
                  'children': null,
                  'riskId': '1aa020000002',
                  'riskName': '测试组织节点5',
                  'riskLevelCode': '1',
                  'pId': '1a9020000001',
                  'orderNo': null,
                  'level': '2'
                },
                {
                  'children': null,
                  'riskId': '2',
                  'riskName': '人力部',
                  'pId': '1a9020000001',
                  'riskLevelCode': '2',
                  'orderNo': null,
                  'level': '2'
                },
                {
                  'children': null,
                  'riskId': '3',
                  'riskName': '设计部',
                  'riskLevelCode': '4',
                  'pId': '1a9020000001',
                  'orderNo': null,
                  'level': '2'
                },
                {
                  'children': null,
                  'riskId': '5',
                  'riskName': '后端',
                  'riskLevelCode': '3',
                  'pId': '1a9020000001',
                  'orderNo': null,
                  'level': '3'
                }
              ],
              'riskId': '1a9020000001',
              'riskName': '黑龙江多米科技有限公司1',
              'riskLevelCode': null,
              'pId': '1',
              'orderNo': null,
              'level': '1'
            }
          ]
        }
      ],
      isEndPint: true, // 只有点击最尾节点，才会显示表格里的操作列
      riskList: [
        {
          name: '道路光线过暗，看不清',
          progress: 0,
          state: 1,
          id: 9732
        },
        {
          name: '道路光线过暗，看不清',
          progress: 1,
          state: 1,
          id: 9732
        },
        {
          name: '道路光线过暗，看不清',
          progress: 2,
          state: 0,
          id: 9732
        },
        {
          name: '道路光线过暗，看不清',
          progress: 3,
          state: 2,
          id: 9732
        },
        {
          name: '道路光线过暗，看不清',
          progress: 4,
          state: 2,
          id: 9732
        }
      ],
      riskStates: {0: '未辨识', 1: '辨识中', 2: '已辨识'},
      multipleSelection: [],
      showDialog: false,
      activeStep: 'step-4', // 1-4; 起始显示tab
      doneStep: 4, // 1-4; 已完成步。 0代表第一步都未开始
      stepObjA: {
        pointA: '电气部',
        pointB: '变压器',
        pointC: '设备操作',
        identifierRange: '',
        workStep: '',
        riskType: '',
        riskReason: '',
        riskPointType: '',
        identifierWay: ''
      },
      rangeOptions: [
        {
          value: '作业活动',
          label: '作业活动'
        }, {
          value: '设备设施',
          label: '设备设施'
        }, {
          value: '人员行为',
          label: '人员行为'
        }, {
          value: '物料材料',
          label: '物料材料'
        }, {
          value: '工艺技术',
          label: '工艺技术'
        }, {
          value: '作业环境',
          label: '作业环境'
        }, {
          value: '安全管理',
          label: '安全管理'
        }
      ],
      riskTypeOptions: ['物体打击', '车辆伤害', '机械伤害', '触电', '淹溺', '灼烫', '火灾',
        '高处坠落', '坍塌', '冒顶片帮', '透水', '放炮', '火药爆炸', '瓦斯爆炸', '锅炉爆炸', '容器爆炸',
        '其它爆炸', '中毒和窒息', '其它伤害'],
      reasonOptions: [
        {
          value: '人的因素',
          label: '人的因素',
          children: [
            {
              value: '人员行为',
              label: '人员行为'
            }, {
              value: '作业活动',
              label: '作业活动'
            }
          ]
        }, {
          value: '物的因素',
          label: '物的因素',
          children: [
            {
              value: '设备设施',
              label: '设备设施'
            }, {
              value: '物料材料',
              label: '物料材料'
            }
          ]
        }, {
          value: '环境因素',
          label: '环境因素',
          children: [
            {
              value: '作业环境',
              label: '作业环境'
            }
          ]
        }, {
          value: '管理因素',
          label: '管理因素',
          children: [
            {
              value: '安全管理',
              label: '安全管理'
            }, {
              value: '工艺技术',
              label: '工艺技术'
            }
          ]
        }
      ],
      riskPointOptions: [ '设备设施', '作业活动' ],
      ideWayOptions: [
        {
          label: '风险矩阵（LS）评价法',
          value: 'LS'
        }, {
          label: '危险性分析（LEC）评价法',
          value: 'LES'
        }
      ],
      stepObjB: {
        levelNameA: '电气部',
        levelNameB: '变压站',
        levelNameC: '设备操作',
        levelNumA: '',
        levelNumB: '',
        levelNumC: '',
        unitLevelNum: '',
        administrator: ''
      },
      adminOptions: [ '张三', '李四', '王二麻子' ],
      stepObjC: {
        LEC: {
          L: '0.1',
          E: '0.5',
          C: '1',
          D: 0.05,
          riskLevel: ''
        },
        LS: {
          L: '1',
          S: '1',
          R: 1,
          riskLevel: ''
        },
        managerLevel: '',
        manager: ''
      },
      evaluationMethod: 'LS', // LEC 或 LS
      lec_l_options: [
        {label: '完全可能预料', value: '10'},
        {label: '相当可能', value: '6'},
        {label: '可能，但不经常', value: '3'},
        {label: '可能性小，完全意外', value: '1'},
        {label: '很不可能，可能设想', value: '0.5'},
        {label: '极不可能', value: '0.2'},
        {label: '实际不可能', value: '0.1'}
      ],
      lec_e_options: [
        {label: '连续暴露', value: '10'},
        {label: '每天工作时间内暴露', value: '6'},
        {label: '每周一次或偶然暴露', value: '3'},
        {label: '每月一次暴露', value: '2'},
        {label: '每年几次暴露', value: '1'},
        {label: '非常罕见地暴露', value: '0.5'}
      ],
      lec_c_options: [
        {label: '严重违反法律法规和标准', value: '100'},
        {label: '违反法律法规和标准', value: '40'},
        {label: '潜在违反法规和标准', value: '15'},
        {label: '不符合上级或行业的安全方针、制度、规定等', value: '7'},
        {label: '不符合公司的安全操作程序、规定', value: '2'},
        {label: '完全符合', value: '1'}
      ],
      ls_l_options: [
        {label: '在现场没有采取防范、监测、保护、控制措施，或危害的发生不能被发现（没有监测系统），或在正常情况下经常发生此类事故或事件', value: '5'},
        {label: '危害的发生不容易被发现，现场没有检测系统，也未发生过任何监测，或在现场有控制措施，但未有效执行或控制措施不当，或危害发生或预期情况下发生', value: '4'},
        {label: '没有保护措施（如没有保护装置、没有个人防护用品等），或未严格按操作程序执行，或危害的发生容易被发现（现场有监测系统），或曾经作过监测，或过去曾经发生类似事故或事件', value: '3'},
        {label: '危害一旦发生能及时发现，并定期进行监测，或现场有防范控制措施，并能有效执行，或过去偶尔发生事故或事件', value: '2'},
        {label: '有充分、有效的防范、控制、监测、保护措施，或员工安全卫生意识相当高，严格执行操作规程。极不可能发生事故或事件', value: '1'}
      ],
      ls_s_options: [
        {label: '违反法律、法规和标准', value: '5'},
        {label: '潜在违反法规和标准', value: '4'},
        {label: '不符合上级公司或行业的安全方针、制度、规定等', value: '3'},
        {label: '不符合企业的安全操作程序、规定', value: '2'},
        {label: '完全符合', value: '1'}
      ],
      managerLevel: ['公司级', '部门级', '车间级', '班组级', '岗位级'],
      stepObjD: {
        controlMeasure: '在采取措施降低危害前，不能继续作业，对改进措施进行评估',
        standard: '',
        technicalMeasures: '',
        managerMeasures: '',
        educationMeasures: '',
        protectMeasures: '',
        emergencyMeasures: ''
      }
    }
  },
  methods: {
    openLoading () {
      this.pageLoading = true
    },
    closeLoading () {
      this.pageLoading = false
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    openDialog (id) {
      this.showDialog = true
    },
    handleClick (tab, event) {
      console.log(tab, event)
    },
    toStepTwo () {
      // 先
      // 前往第二页
      this.activeStep = 'step-2'
    },
    saveStepOne () {
      // this.dialogLoading = true
      // ajax
    },
    changeStepOne () {
      // this.dialogLoading = true
      // ajax
    },
    closeDialog () {
      this.showDialog = false
    },
    changeStepTwo () {},
    saveStepTwo () {},
    toStepThree () {
      this.activeStep = 'step-3'
    },
    changeLevelNum () {
      this.stepObjB.unitLevelNum = `${this.stepObjB.levelNumA}-${this.stepObjB.levelNumB}-${this.stepObjB.levelNumC}`
    },
    changeLEC () {
      // 避免浮点数相乘出现问题
      this.stepObjC.LEC.D = (this.stepObjC.LEC.L * 10) * (this.stepObjC.LEC.E * 10) * this.stepObjC.LEC.C / 100
      this.matchLEC_D()
    },
    matchLEC_D () {
      if (this.stepObjC.LEC.D > 320) {
        this.stepObjC.LEC.riskLevel = `A/1级 重大风险`
      } else if (this.stepObjC.LEC.D > 160 && this.stepObjC.LEC.D <= 320) {
        this.stepObjC.LEC.riskLevel = `B/2级 较大风险`
      } else if (this.stepObjC.LEC.D > 70 && this.stepObjC.LEC.D <= 160) {
        this.stepObjC.LEC.riskLevel = `C/3级 一般风险`
      } else if (this.stepObjC.LEC.D > 20 && this.stepObjC.LEC.D <= 70) {
        this.stepObjC.LEC.riskLevel = `D/4级 低风险`
      } else if (this.stepObjC.LEC.D <= 20) {
        this.stepObjC.LEC.riskLevel = `E/5级 低风险`
      }
    },
    changeLS () {
      this.stepObjC.LS.R = this.stepObjC.LS.L * this.stepObjC.LS.S
      this.matchLS_R()
    },
    matchLS_R () {
      if (this.stepObjC.LS.R >= 20) {
        this.stepObjC.LS.riskLevel = `A/1级 重大风险`
      } else if (this.stepObjC.LS.R >= 15 && this.stepObjC.LS.R < 20) {
        this.stepObjC.LS.riskLevel = `B/2级 较大风险`
      } else if (this.stepObjC.LS.R >= 9 && this.stepObjC.LS.R < 15) {
        this.stepObjC.LS.riskLevel = `C/3级 一般风险`
      } else if (this.stepObjC.LS.R >= 4 && this.stepObjC.LS.R < 9) {
        this.stepObjC.LS.riskLevel = `D/4级 低风险`
      } else if (this.stepObjC.LS.R < 4) {
        this.stepObjC.LS.riskLevel = `E/5级 低风险`
      }
    },
    changeStepThree () {},
    saveStepThree () {},
    toStepFour () {
      this.activeStep = 'step-4'
    },
    changeStepFour () {},
    saveStepFour () {},
    finish () {},
    openAddConfirm () {
      this.$prompt('危险名称', '添加', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        // 添加ajax
        this.$message({
          type: 'success',
          message: '添加成功'
        })
      }).catch(() => {
        // after cancel, do nothing
      })
    },
    openDeleteConfirm () {
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: 'info',
          message: '请至少选中一条'
        })
        return
      }
      this.$confirm('此操作将删除选中项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        // after cancel, do nothing
      })
    },
    openImportDialog () {
      // 不知道要干啥呢
    },
    openExportDialog () {
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: 'info',
          message: '请至少选中一条'
        })
      } else {
        // 执行下载
      }
    }
  },
  components: {TreeReadOnly, BreadCrumb, TableStep}
}
</script>

<style scoped lang="scss">
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
            height: 15px;
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
        .delete-btn{
          background: #f56c6c;
        }
        .add-btn{
          background: #409eff;
        }
      }
      .el-table{
        margin-top: 25px;
      }
      .pages{
        margin-top: 28px;
        text-align: right;
      }
      .dialog-box{
        height: 430px;
        .step-box{
          width: 100%;
          height: 100%;
          position: relative;
          &.step-1-box{
            .step-1-p{
              line-height: 36px;
              height: 36px;
              margin-bottom: 16px;
              position: relative;
              padding-left: 400px;
              .label{
                position: absolute;
                left: 0;
                width: 330px;
                line-height: 36px;
                font-size: 16px;
                color: #646464;
                text-align: right;
              }
              .el-select{
                width: 360px;
              }
              .el-input{
                width: 360px;
              }
              &:first-child{
                .el-input{
                  width: 154px;
                  margin-right: 17px;
                }
              }
            }
            .btn-box{
              position: absolute;
              bottom: 0px;
              right: 0px;
            }
          }
          &.step-2-box{
            padding: 0 69px;
            .units-box{
              width: 100%;
              display: flex;
              justify-content: space-between;
              .unit-item{
                width: 314px;
                .title{
                  font-size: 16px;
                  color: #646464;
                  text-align: center;
                  padding-top: 36px;
                  line-height: 36px;
                  font-weight: 600;
                }
                .input-p{
                  margin-top: 18px;
                  display: flex;
                  justify-content: space-between;
                  .label{
                    display: block;
                    width: 154px;
                    line-height: 36px;
                    text-align: right;
                    padding-right: 23px;
                    font-size: 16px;
                  }
                }
                .el-input{
                  width: 154px;
                }
              }
            }
            .step-2-p{
              position: relative;
              margin-top: 40px;
              padding-left: 160px;
              line-height: 36px;
              .label{
                position: absolute;
                text-align: right;
                width: 131px;
                left: 0;
                font-size: 16px;
              }
            }
            .btn-box{
              margin-top: 40px;
              text-align: right;
            }
          }
          &.step-3-box{
            .line-p{
              margin-top: 25px;
              display: flex;
              justify-content: space-between;
              padding-right: 118px;
              .line-rt{
                position: relative;
                width: 410px;
                line-height: 36px;
                padding-left: 150px;
                .label{
                  position: absolute;
                  padding-right: 30px;
                  left: 0;
                  width: 150px;
                  text-align: right;
                }

              }
              .line-lf{
                position: relative;
                width: 640px;
                line-height: 36px;
                padding-left: 280px;
                .label{
                  position: absolute;
                  padding-right: 30px;
                  left: 0;
                  width: 280px;
                  text-align: right;
                }
                .el-select{
                  width: 360px;
                }
                .el-input{
                  width: 360px;
                }
              }
            }
            .btn-box{
              margin-top: 18px;
              text-align: right;
              &.isLS{
                margin-top: 79px;
              }
            }
          }
          &.step-4-box{
            .step-4-p {
              line-height: 36px;
              height: 36px;
              margin-bottom: 16px;
              position: relative;
              padding-left: 400px;
              .label {
                position: absolute;
                left: 0;
                width: 330px;
                line-height: 36px;
                font-size: 16px;
                color: #646464;
                text-align: right;
              }
              .el-select {
                width: 360px;
              }
              .el-input {
                width: 360px;
              }
            }
            .btn-box{
              position: absolute;
              bottom: 0px;
              right: 0px;
            }
          }
        }
      }
    }
  }
}
/deep/.inner-page-container {
  .inner-content {
    .el-table .el-table__body .cell {
      line-height: 26px;
    }
    .el-table td{
      padding: 5px 0;
    }
    .el-dialog{
      border-radius: 0;
    }
    .el-dialog__header{
      display: none;
    }
    .el-dialog__body{
      padding: 0;
    }
  }
}
/*  el-tab */
/deep/.inner-main-container{
  .el-tabs--border-card{
    height: 100%;
  }
  .el-tabs--border-card>.el-tabs__content{
    height: 428px;
  }
}

</style>
