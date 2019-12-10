<template>
  <el-container class="inner-page-container" v-loading="pageLoading">
    <el-header class="inner-header">
      <bread-crumb :breadList="breadcrumb">
      </bread-crumb>
    </el-header>
    <el-main class="inner-main-container">
      <el-tabs type="border-card" class="height-100">
        <el-tab-pane>
          <span slot="label">基础管理类</span>
          <el-container class="inner-main-content">
            <el-aside class="inner-aside" width="408px">
              <tree-read-only
                :tree-name="'风险单元'"
                :tree-data="organizationTree"
                @open-loading="openLoading"
                @close-loading="closeLoading" >
              </tree-read-only>
            </el-aside>

            <el-main class="inner-content">
              <div class="container-box">
                <div class="content-tools is-flex-end">
                  <div class="tools-right">
                    <el-button
                      type="primary"
                      size="medium"
                      icon="el-icon-plus"
                      @click="handleAdd">
                      计划发布</el-button>
                      <el-button
                      type="danger"
                      size="medium"
                      icon="el-icon-delete"
                      @click="exportEexcel">
                      计划删除</el-button>
                  </div>
                </div>
                <el-table
                  :data="tableData"
                  border
                  style="width: 100%"
                  align="center">
                  <el-table-column
                    prop=" "
                    label="序号"
                    width="50">
                  </el-table-column>
                  <el-table-column
                    prop=" "
                    label="排查内容"
                    header-align="center">
                  </el-table-column>
                  <el-table-column
                    prop=" "
                    label="自动推送"
                    width="200"
                    align="center">
                    <template slot-scope="scope">
                      <el-radio-group class="raido-group-custom" v-model="isPush">
                        <el-radio-button :label="false">1</el-radio-button>
                        <el-radio-button :label="true">2</el-radio-button>
                      </el-radio-group>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop=" "
                    label="状态"
                    width="200"
                    header-align="center">
                  </el-table-column>
                </el-table>
              </div>
            </el-main>
          </el-container>
        </el-tab-pane>

        <el-tab-pane>
          <span slot="label">生产现场类</span>
          <el-container class="inner-main-content">
            <el-aside class="inner-aside" width="408px">
              <tree-read-only
                :tree-name="'风险单元'"
                :tree-data="organizationTree"
                @open-loading="openLoading"
                @close-loading="closeLoading" >
              </tree-read-only>
            </el-aside>

            <el-main class="inner-content">
              <div class="container-box">
                <div class="content-tools is-flex-end">
                  <div class="tools-right">
                    <el-button
                      type="primary"
                      size="medium"
                      icon="el-icon-download"
                      @click="handleAdd">
                      计划发布</el-button>
                      <el-button
                      type="danger"
                      size="medium"
                      icon="el-icon-download"
                      @click="exportEexcel">
                      计划删除</el-button>
                  </div>
                </div>
                <el-table
                  :data="tableData"
                  border
                  style="width: 100%"
                  align="center">
                  <el-table-column
                    prop=" "
                    label="序号"
                    width="50">
                  </el-table-column>
                  <el-table-column
                    prop=" "
                    label="排查内容"
                    header-align="center">
                  </el-table-column>
                  <el-table-column
                    prop=" "
                    label="自动推送"
                    width="200"
                    align="center">
                    <template slot-scope="scope">
                      <el-radio-group class="raido-group-custom" v-model="isPush">
                        <el-radio-button :label="false">1</el-radio-button>
                        <el-radio-button :label="true">2</el-radio-button>
                      </el-radio-group>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop=" "
                    label="状态"
                    width="200"
                    header-align="center">
                  </el-table-column>
                </el-table>
              </div>
            </el-main>
          </el-container>
        </el-tab-pane>
      </el-tabs>
    </el-main>
    <el-dialog
      title="计划发布"
      :visible.sync="dialogVisible"
      width="30%">
      <el-form
        :model="form"
        ref="form"
        size="mini"
        label-width="100px"
      >
      <el-form-item label="检查分类：" inline-message>
        <el-input
          placeholder="请输入检查分类"></el-input>
      </el-form-item>
      <el-form-item label="检查人：" inline-message>
        <el-input
          placeholder="请输入检查人"></el-input>
      </el-form-item>
      <el-form-item label="检查部门：" inline-message>
        <el-input
          placeholder="请输入检查部门"></el-input>
      </el-form-item>
      <el-form-item label="检查时间：" inline-message>
        <el-input
          placeholder="请输入检查时间"></el-input>
      </el-form-item>
      <el-form-item label="检查地点：" inline-message>
        <el-input
          placeholder="请输入检查地点"></el-input>
      </el-form-item>
      <el-form-item label="检查数量：" inline-message>
        <el-input
          placeholder="请输入检查数量"></el-input>
      </el-form-item>
      <el-form-item label="隐患数量：" inline-message>
        <el-input
          placeholder="请输入隐患数量"></el-input>
      </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          size="small"
          @click="submitForm()">确 定</el-button>
        <el-button
          size="small"
          @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>
<script>
import BreadCrumb from '../Breadcrumb/Breadcrumb'
import TreeReadOnly from '../tree-diagram/treeReadOnly'
import OwnElDialog from '../el-dialog/elDialog'
export default {
  name: 'screeningPlan',
  data () {
    return {
      breadcrumb: ['风险辨识评估', '风险划分'],
      pageLoading: false,
      dialogVisible: false,
      checked: false,
      isPush: true,
      organizationTree: [
        {
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
          ],
          'riskId': '1',
          'riskName': '多多集团',
          'riskLevelCode': null,
          'pId': '0',
          'orderNo': null,
          'level': '0'
        }
      ],
      form: {

      }
    }
  },
  components: {
    TreeReadOnly,
    BreadCrumb,
    OwnElDialog
  },
  methods: {
    openLoading () {
      this.pageLoading = true
    },
    closeLoading () {
      this.pageLoading = false
    },
    handleAdd () {
      this.dialogVisible = true
    },
    // 导出excel
    exportEexcel () {

    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/utils/css/style.scss';
.el-form{
  width: 400px;
  margin: 0 auto;
}
.raido-group-custom{
  background: #ffffff;
   margin: 10px 0;
  >>> .el-radio-button__inner{
    padding: 0px;
    width: 36px;
    height: 19px;
    text-indent: -999px;
  }
  >>> .el-radio-button__orig-radio:checked+.el-radio-button__inner{

  }
  >>> .el-radio-button:first-child {
      .el-radio-button__orig-radio:checked+.el-radio-button__inner{
        background: $colorPrimary;
      }
        .el-radio-button__inner{
          border-radius:  19px 0 0 19px;
        }
      }
  >>> .el-radio-button:last-child {
        .el-radio-button__orig-radio:checked+.el-radio-button__inner{
          background: $colorRed;
          border-color: $colorRed;
        }
        .el-radio-button__inner{
          border-radius:  0px 19px 19px 0px;

        }
      }
}
</style>
