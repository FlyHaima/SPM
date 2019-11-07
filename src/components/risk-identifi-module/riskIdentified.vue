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
              <a class="export-btn"><i class></i>导出</a>
              <a class="import-btn"><i></i>导入</a>
              <a class="delete-btn"><i class="el-icon-delete"></i>删除</a>
              <a class="add-btn"><i class="el-icon-plus"></i>添加</a>
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

            <el-dialog :visible.sync="showDialog"
                       :width="'1200px'"
                       :show-close="false">
              <div class="dialog-box">
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
                      </p>
                      <p class="step-1-p">
                        <span class="label">风险点类别：</span>
                      </p>
                      <p class="step-1-p">
                        <span class="label">风险评估法：</span>
                      </p>
                    </div>
                  </el-tab-pane>
                  <el-tab-pane :disabled="doneStep<2 ? true : false" name="step-2">
                    <span slot="label">② 划分单元</span>
                    <div class="step-box step-2-box"></div>
                  </el-tab-pane>
                  <el-tab-pane :disabled="doneStep<3 ? true : false" name="step-3">
                    <span slot="label">③ 开展评估</span>
                    <div class="step-box step-3-box"></div>
                  </el-tab-pane>
                  <el-tab-pane :disabled="doneStep<4 ? true : false" name="step-4">
                    <span slot="label">④ 管控措施</span>
                    <div class="step-box step-4-box"></div>
                  </el-tab-pane>
                </el-tabs>
              </div>
              <!--<div slot="footer" class="dialog-footer" style="margin-top: 20px; text-align: right;">-->
                <!--<el-button size="small" type="primary" @click="submitEdit()">保 存</el-button>-->
                <!--<el-button size="small" @click="showEdit = false">取 消</el-button>-->
              <!--</div>-->
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
      activeStep: 'step-1', // 1-4; 起始显示tab
      doneStep: 3, // 1-4; 已完成步
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
        '其它爆炸', '中毒和窒息', '其它伤害']
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
        height: 468px;
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
          }
          &.step-2-box{}
          &.step-3-box{}
          &.step-4-box{}
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
