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
            :show-btns="true"
            @tree-click-handle="getRiskTable"
            @tree-add-item="addTreeNode"
            @tree-edit-item="editTreeNode"
            @tree-del-item="delTreeNode"
            @open-loading="openLoading"
            @close-loading="closeLoading">
          </tree-read-only>
        </el-aside>
        <el-main class="inner-content">
          <div class="container-box">
            <p class="btn-p">
              <a class="export-btn" target="_blank" :href="`${baseUrl}/riskia/exportRiskBs?riskId=${currentTreeData.riskId}&token=${localToken}&attname=风险辨识表.xls`"><i class></i>导出</a>
              <a class="import-btn" v-show="currentTreeData.treeLevel === '5'" @click="openImportDialog"><i></i>导入</a>
              <a class="delete-btn" v-show="currentTreeData.treeLevel === '5'" @click="openDeleteConfirm"><i class="el-icon-delete"></i>删除</a>
              <a class="add-btn" v-show="currentTreeData.treeLevel === '5'" @click="openAddConfirm"><i class="el-icon-plus"></i>添加</a>
            </p>

            <el-table ref="leaderTable"
                      border
                      stripe
                      :data="riskList"
                      tooltip-effect="dark"
                      style="width: 100%"
                      >
              <!-- <el-table-column
                type="selection"
                width="40" align="center">
              </el-table-column> -->
              <el-table-column
                label="危险源名称"
                width="300"
                align="center">
                <template slot-scope="scope">{{ scope.row.riskSourceName }}</template>
              </el-table-column>
              <el-table-column
                label="进度"
                align="center">
                <template slot-scope="scope">
                  <table-step :active="scope.row.speed * 1">
                  </table-step>
                </template>
              </el-table-column>
              <el-table-column
                label="风险识别状态"
                width="180"
                align="center">
                <template slot-scope="scope">{{riskStates[scope.row.state - 1]}}</template>
              </el-table-column>
              <el-table-column
                v-if="isEndPint"
                label="操作"
                width="80"
                align="center">
                <template slot-scope="scope">
                  <el-button v-if="scope.row.state-1 < 2" size="mini" type="text" @click="openDialog(scope.row)">辨识</el-button>
                  <el-button v-else size="mini" type="text" @click="openDialog(scope.row)">修改</el-button>
                </template>
              </el-table-column>
            </el-table>

            <el-dialog :visible.sync="showDialog" :close-on-click-modal="false" :close-on-press-escape="false"
                       :width="'1200px'"
                       :show-close="false">
              <div class="dialog-box" v-loading="dialogLoading">
                <el-tabs v-model="activeStep" @tab-click="handleClick" type="border-card">
                  <el-tab-pane name="step-1">
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
                        <el-button size="medium" @click="changeStepOne" v-if="doneStep >= 1">修改并关闭</el-button>
                        <el-button size="medium" @click="changeStepOne" v-else>保存并关闭</el-button>
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
                            <el-input size="medium" disabled="disabled" v-model="stepObjB.levelNumA" @input="changeLevelNum" @change="changeLevelNum"></el-input>
                          </p>
                        </div>
                        <div class="unit-item">
                          <p class="title">二级子单元</p>
                          <p class="input-p">
                            <span class="label">{{stepObjB.levelNameB}}</span>
                            <el-input size="medium" disabled="disabled" v-model="stepObjB.levelNumB" @input="changeLevelNum" @change="changeLevelNum"></el-input>
                          </p>
                        </div>
                        <div class="unit-item">
                          <p class="title">三级子单元</p>
                          <p class="input-p">
                            <span class="label">{{stepObjB.levelNameC}}</span>
                            <el-input size="medium" disabled="disabled" v-model="stepObjB.levelNumC" @input="changeLevelNum" @change="changeLevelNum"></el-input>
                          </p>
                        </div>
                      </div>
                      <p class="step-2-p">
                        <span class="label">三级风险单元编号</span>
                        <el-input size="medium" disabled="disabled" v-model="stepObjB.unitLevelNum"></el-input>
                      </p>
                      <p class="step-2-p">
                        <span class="label">负责机构</span>
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
                        <el-button size="medium" @click="changeStepTwo" v-if="doneStep >= 2">修改并关闭</el-button>
                        <el-button size="medium" @click="changeStepTwo" v-else>保存并关闭</el-button>
                        <el-button size="medium" type="primary" @click="toStepThree">下一步</el-button>
                      </div>
                    </div>
                  </el-tab-pane>
                  <el-tab-pane :disabled="doneStep<3 ? true : false" name="step-3">
                    <span slot="label">③ 开展评估</span>
                    <div class="step-box step-3-box">
                      <template v-if="stepObjA.identifierWay === 'LEC'">
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
                          <div class="line-rt" v-if="stepObjA.identifierWay === 'LEC'">
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
                      <div class="btn-box" :class="stepObjA.identifierWay === 'LS' ? 'isLS' : ''">
                        <el-button size="medium" type="primary" plain @click="closeDialog">关闭</el-button>
                        <el-button size="medium" @click="changeStepThree" v-if="doneStep >= 3">修改并关闭</el-button>
                        <el-button size="medium" @click="changeStepThree" v-else>保存并关闭</el-button>
                        <el-button size="medium" type="primary" @click="toStepFour">下一步</el-button>
                      </div>
                    </div>
                  </el-tab-pane>
                  <el-tab-pane :disabled="doneStep<4 ? true : false" name="step-4">
                    <span slot="label">④ 管控措施</span>
                    <div class="step-box step-4-box">
                      <p class="step-4-p">
                        <span class="label">应采取的管控措施：</span>
                        <el-input size="medium" v-model="stepObjD.controlMeasure"></el-input>
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
                        <el-button size="medium" @click="changeStepFour" v-if="doneStep >= 4">修改并关闭</el-button>
                        <el-button size="medium" type="primary" @click="finish" v-else>完成</el-button>
                      </div>
                    </div>
                  </el-tab-pane>
                </el-tabs>
              </div>
            </el-dialog>
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
import {
  getRiskTree,
  getDescribeList,
  addRiskTree,
  updateRiskTree,
  delRiskTree,
  addDescribe,
  delDescribe,
  updateDescribe
} from '@/api/riskia'
import base from '@/api/baseUrl'

export default {
  name: 'riskIdentified',
  data () {
    return {
      baseUrl: '',
      currentTreeData: {riskId: '', level: '1', treeLevel: '1'},
      pageLoading: false,
      dialogLoading: false,
      breadcrumb: ['风险辨识评估', '风险辨识'],
      organizationTree: [],
      isEndPint: true, // 只有点击最尾节点，才会显示表格里的操作列
      riskList: [],
      riskStates: {0: '未辨识', 1: '辨识中', 2: '已辨识'},
      multipleSelection: [],
      showDialog: false,
      activeStep: 'step-4', // 1-4; 起始显示tab
      doneStep: 0, // 1-4; 已完成步。 0代表第一步都未开始
      stepObjA: {
        pointA: '',
        pointB: '',
        pointC: '',
        identifierRange: '',
        workStep: '',
        riskType: '',
        riskReason: '',
        riskPointType: '',
        identifierWay: ''
      },
      // 辨识范围 options
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
      // 风险类别/事故后果
      riskTypeOptions: ['物体打击', '车辆伤害', '机械伤害', '触电', '淹溺', '灼烫', '火灾',
        '高处坠落', '坍塌', '冒顶片帮', '透水', '放炮', '火药爆炸', '瓦斯爆炸', '锅炉爆炸', '容器爆炸',
        '其它爆炸', '中毒和窒息', '其它伤害'],
      // 风险因素
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
      // 风险点类别
      riskPointOptions: [ '设备设施', '作业活动' ],
      // 风险评估法
      ideWayOptions: [
        {
          label: '风险矩阵（LS）评价法',
          value: 'LS'
        }, {
          label: '危险性分析（LEC）评价法',
          value: 'LEC'
        }
      ],
      stepObjB: {
        levelNameA: '',
        levelNameB: '',
        levelNameC: '',
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
        {label: '大灾难', value: '100'},
        {label: '灾难，数人死亡', value: '40'},
        {label: '非常严重，一人死亡', value: '15'},
        {label: '严重，重伤/职业病（多人）', value: '7'},
        {label: '重大，致残/职业病（一人）', value: '3'},
        {label: '轻微，仅需救护/职业性多发病', value: '1'}
      ],
      ls_l_options: [
        {label: 'Ⅰ 极有可能发生', value: '5'},
        {label: 'Ⅱ 很可能发生', value: '4'},
        {label: 'Ⅲ 可能发生', value: '3'},
        {label: 'Ⅳ 较不可能发生', value: '2'},
        {label: 'Ⅴ 基本不可能发生', value: '1'}
      ],
      ls_s_options: [
        {label: '影响特别重大', value: '5'},
        {label: '影响重大', value: '4'},
        {label: '影响较大', value: '3'},
        {label: '影响一般', value: '2'},
        {label: '影响很小', value: '1'}
      ],
      managerLevel: ['公司级', '部门级', '车间级', '班组级', '岗位级'],
      stepObjD: {
        controlMeasure: '',
        standard: '',
        technicalMeasures: '',
        managerMeasures: '',
        educationMeasures: '',
        protectMeasures: '',
        emergencyMeasures: ''
      },
      currentData: {},
      localToken: ''
    }
  },
  created () {
    this.localToken = sessionStorage.getItem('TOKEN_KEY')
    this.baseUrl = base.baseUrl
    this.getRiskTree(true)
  },
  methods: {
    getRiskTree (create) {
      this.pageLoading = true
      getRiskTree().then((res) => {
        if (res.code === 200) {
          this.organizationTree = res.data
        }
        if (create) {
          let data = {
            riskId: res.data[0].riskId,
            level: '1',
            treeLevel: '1'
          }
          this.getRiskTable(data)
        }
        this.pageLoading = false
      })
    },
    getRiskTable (data) {
      let vm = this
      vm.currentTreeData = data
      vm.pageLoading = true
      let riskId = data.riskId
      getDescribeList(riskId).then(res => {
        if (res.code === 200) {
          vm.riskList = res.data
        }
        vm.pageLoading = false
      })
    },
    openLoading () {
      this.pageLoading = true
    },
    closeLoading () {
      this.pageLoading = false
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    openDialog (d) {
      this.currentData = d
      if (d.speed === '4') {
        this.activeStep = 'step-4'
      } else {
        this.activeStep = 'step-' + (d.speed * 1 + 1)
      }
      this.doneStep = d.speed * 1 + 1
      this.evaluationMethod = d.ram ? d.ram : 'LS'
      this.stepObjA = {
        pointA: d.oneName ? d.oneName : '',
        pointB: d.twoName ? d.twoName : '',
        pointC: d.riskName ? d.riskName : '',
        identifierRange: d.project ? d.project : '',
        workStep: d.work ? d.work : '',
        riskType: d.riskSourceType ? d.riskSourceType : '',
        riskReason: d.factor ? d.factor.split('/') : '',
        riskPointType: d.riskType ? d.riskType : '',
        identifierWay: d.ram ? d.ram : ''
      }
      this.stepObjB = {
        levelNameA: d.oneName ? d.oneName : '',
        levelNameB: d.twoName ? d.twoName : '',
        levelNameC: d.riskName ? d.riskName : '',
        levelNumA: d.oneNo ? d.oneNo : '',
        levelNumB: d.twoNo ? d.twoNo : '',
        levelNumC: d.orderNo ? d.orderNo : '',
        unitLevelNum: d.oneNo && d.twoNo && d.orderNo ? d.oneNo + '-' + d.twoNo + '-' + d.orderNo : '',
        administrator: ''
      }
      this.stepObjC = {
        LEC: {
          L: d.l ? d.l : '0.1',
          E: d.e ? d.e : '0.5',
          C: d.c ? d.c : '1',
          D: d.d ? d.d : '0.05',
          riskLevel: d.riskLevel ? d.riskLevel : 'E/5级，低风险'
        },
        LS: {
          L: d.l ? d.l : '1',
          S: d.e ? d.e : '1',
          R: d.d ? d.d : '1',
          riskLevel: d.riskLevel ? d.riskLevel : 'E/5级，低风险'
        },
        managerLevel: d.controlLevel ? d.controlLevel : '',
        manager: d.controlPer ? d.controlPer : ''
      }
      this.stepObjD = {
        controlMeasure: d.mustCs ? d.mustCs : '',
        standard: d.csStand ? d.csStand : '',
        technicalMeasures: d.technology ? d.technology : '',
        managerMeasures: d.bmp ? d.bmp : '',
        educationMeasures: d.train ? d.train : '',
        protectMeasures: d.individual ? d.individual : '',
        emergencyMeasures: d.emergency ? d.emergency : ''
      }
      this.showDialog = true
    },
    // 更新风险辨识步骤
    updateDescribe (data, step) {
      let vm = this
      vm.pageLoading = true
      let stepData = {
        id: vm.currentData.id
      }
      let postData = Object.assign(data, stepData)
      updateDescribe(postData, step).then(res => {
        if (res.code === 200) {
          // 提交后，更新表格
          let data = {
            riskId: vm.currentTreeData.riskId,
            level: vm.currentTreeData.level,
            treeLevel: vm.currentTreeData.treeLevel
          }
          vm.getRiskTable(data)
        }
        vm.pageLoading = false
      })
    },
    handleClick (tab, event) {
      // console.log(tab, event)
    },
    toStepTwo () {
      let vm = this
      if (!vm.saveStepOne()) return
      vm.doneStep = 2
      vm.activeStep = 'step-2'
    },
    saveStepOne () {
      let vm = this
      if (vm.stepObjA.pointA && vm.stepObjA.pointB && vm.stepObjA.pointC && vm.stepObjA.identifierRange && vm.stepObjA.workStep && vm.stepObjA.riskType && vm.stepObjA.riskReason && vm.stepObjA.riskPointType && vm.stepObjA.identifierWay) {
        let saveData = {
          oneName: vm.stepObjA.pointA,
          twoName: vm.stepObjA.pointB,
          riskName: vm.stepObjA.pointC,
          project: vm.stepObjA.identifierRange,
          work: vm.stepObjA.workStep,
          riskSourceType: vm.stepObjA.riskType,
          factor: vm.stepObjA.riskReason ? vm.stepObjA.riskReason.join('/') : '',
          riskType: vm.stepObjA.riskPointType,
          ram: vm.stepObjA.identifierWay
        }
        vm.updateDescribe(saveData, '1')
        return true
      } else {
        vm.$message({
          message: '所有信息均为必填项',
          type: 'warning'
        })
        return false
      }
    },
    changeStepOne () {
      let vm = this
      if (!vm.saveStepOne()) {
        return
      }
      vm.showDialog = false
    },
    closeDialog () {
      this.showDialog = false
    },
    changeStepTwo () {
      let vm = this
      if (!vm.saveStepTwo()) return
      vm.showDialog = false
    },
    saveStepTwo () {
      let vm = this
      let ad = 1
      if (ad > 0) { // 暂无条件，后续补齐参数
        let saveData = {
          deptId: vm.stepObjB.administrator
        }
        vm.updateDescribe(saveData, '2')
        return true
      } else {
        vm.$message({
          message: '所有信息均为必填项',
          type: 'warning'
        })
        return false
      }
    },
    toStepThree () {
      let vm = this
      if (!vm.saveStepTwo()) return
      vm.doneStep = 3
      vm.activeStep = 'step-3'
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
        this.stepObjC.LEC.riskLevel = `A/1级，重大风险`
      } else if (this.stepObjC.LEC.D > 160 && this.stepObjC.LEC.D <= 320) {
        this.stepObjC.LEC.riskLevel = `B/2级，较大风险`
      } else if (this.stepObjC.LEC.D > 70 && this.stepObjC.LEC.D <= 160) {
        this.stepObjC.LEC.riskLevel = `C/3级，一般风险`
      } else if (this.stepObjC.LEC.D > 20 && this.stepObjC.LEC.D <= 70) {
        this.stepObjC.LEC.riskLevel = `D/4级，低风险`
      } else if (this.stepObjC.LEC.D <= 20) {
        this.stepObjC.LEC.riskLevel = `E/5级，低风险`
      }
    },
    changeLS () {
      this.stepObjC.LS.R = this.stepObjC.LS.L * this.stepObjC.LS.S
      this.matchLS_R()
    },
    matchLS_R () {
      if (this.stepObjC.LS.R >= 20) {
        this.stepObjC.LS.riskLevel = `A/1级，重大风险`
      } else if (this.stepObjC.LS.R >= 15 && this.stepObjC.LS.R < 20) {
        this.stepObjC.LS.riskLevel = `B/2级，较大风险`
      } else if (this.stepObjC.LS.R >= 9 && this.stepObjC.LS.R < 15) {
        this.stepObjC.LS.riskLevel = `C/3级，一般风险`
      } else if (this.stepObjC.LS.R >= 4 && this.stepObjC.LS.R < 9) {
        this.stepObjC.LS.riskLevel = `D/4级，低风险`
      } else if (this.stepObjC.LS.R < 4) {
        this.stepObjC.LS.riskLevel = `E/5级，低风险`
      }
    },
    changeStepThree () {
      let vm = this
      if (!vm.saveStepThree()) return
      vm.showDialog = false
    },
    saveStepThree () {
      let vm = this
      if (vm.stepObjC.managerLevel && vm.stepObjC.manager) {
        let saveData = {}
        if (vm.currentData.ram === 'LEC') {
          saveData = {
            l: vm.stepObjC.LEC.L,
            e: vm.stepObjC.LEC.E,
            c: vm.stepObjC.LEC.C,
            d: vm.stepObjC.LEC.D,
            controlLevel: vm.stepObjC.managerLevel,
            controlPer: vm.stepObjC.manager
          }
        } else {
          saveData = {
            l: vm.stepObjC.LS.L,
            e: vm.stepObjC.LS.S,
            d: vm.stepObjC.LS.R,
            controlLevel: vm.stepObjC.managerLevel,
            controlPer: vm.stepObjC.manager
          }
        }
        vm.updateDescribe(saveData, '3')
        return true
      } else {
        vm.$message({
          message: '所有信息均为必填项',
          type: 'warning'
        })
        return false
      }
    },
    toStepFour () {
      let vm = this
      if (!vm.saveStepThree()) return
      vm.doneStep = 4
      vm.activeStep = 'step-4'
    },
    changeStepFour () {
      let vm = this
      if (!vm.saveStepFour()) return
      vm.showDialog = false
    },
    saveStepFour () {
      let vm = this
      let saveData = {
        mustCs: vm.stepObjD.controlMeasure,
        csStand: vm.stepObjD.standard,
        technology: vm.stepObjD.technicalMeasures,
        bmp: vm.stepObjD.managerMeasures,
        train: vm.stepObjD.educationMeasures,
        individual: vm.stepObjD.protectMeasures,
        emergency: vm.stepObjD.emergencyMeasures
      }
      vm.updateDescribe(saveData, '4')
      return true
    },
    finish () {
      let vm = this
      vm.saveStepFour().then((res) => {
        vm.showDialog = false
      })
    },
    addTreeNode (data) {
      let vm = this
      vm.pageLoading = true
      vm.$prompt('请输入节点名称', '添加节点', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({value}) => {
        let postData = {
          riskName: value,
          pId: data.pId
        }
        addRiskTree(postData).then(res => {
          if (res.code === 200) {
            vm.$message({
              type: 'success',
              message: '节点设置成功'
            })
            vm.getRiskTree()
          }
          vm.pageLoading = false
        })
      }).catch(() => {
        // after cancel
        vm.pageLoading = false
      })
    },
    editTreeNode (data) {
      let vm = this
      vm.pageLoading = true
      vm.$prompt('编辑节点名称', '编辑名称', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({value}) => {
        let postData = {
          riskId: data.riskId,
          riskName: value
        }
        updateRiskTree(postData).then(res => {
          if (res.code === 200) {
            vm.$message({
              type: 'success',
              message: '节点设置成功'
            })
            vm.getRiskTree()
          }
        })
        vm.pageLoading = false
      }).catch(() => {
        // after cancel
        vm.pageLoading = false
      })
    },
    delTreeNode (data) {
      this.pageLoading = true
      this.$confirm('此操作将删除选中项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let postData = {riskId: data.riskId}
        delRiskTree(postData).then(res => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getRiskTree()
          }
          this.pageLoading = false
        })
      }).catch(() => {
        // after cancel
        this.pageLoading = false
      })
    },
    openAddConfirm () {
      let vm = this
      vm.pageLoading = true
      this.$prompt('危险名称', '添加', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        // 添加ajax
        let data = {
          riskSourceName: value,
          riskId: vm.currentTreeData.riskId
        }
        addDescribe(data).then(res => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '添加成功'
            })
            let data = {
              riskId: vm.currentTreeData.riskId,
              level: vm.currentTreeData.level,
              treeLevel: vm.currentTreeData.treeLevel
            }
            vm.getRiskTable(data)
          }
          vm.pageLoading = false
        })
      }).catch(() => {
        // after cancel
        vm.pageLoading = false
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
        let postList = []
        this.multipleSelection.forEach(item => {
          postList.push(item.id)
        })
        let postData = {id: postList}
        delDescribe(postData).then(res => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            let data = {
              riskId: this.currentTreeData.riskId,
              level: this.currentTreeData.level,
              treeLevel: this.currentTreeData.treeLevel
            }
            this.getRiskTable(data)
          }
          this.pageLoading = false
        })
      }).catch(() => {
        // after cancel
        this.pageLoading = false
      })
    },
    openImportDialog () {
      // 不知道要干啥呢
    }
  },
  components: {TreeReadOnly, BreadCrumb, TableStep}
}
</script>

<style scoped lang="scss">
@import '@/utils/css/tools/_variables.scss';
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
        height: 490px;
        .step-box{
          width: 100%;
          height: 100%;
          position: relative;
          &.step-1-box{
            padding-top: 8px;
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
              right: 10px;
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
              padding-right: 10px;
              &.isLS{
                margin-top: 79px;
              }
            }
          }
          &.step-4-box{
            padding-top: 8px;
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
              right: 10px;
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
    height: 435px;
  }
}

</style>
