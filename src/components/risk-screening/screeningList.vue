<template>
  <el-container class="inner-page-container" v-loading="pageLoading">
    <el-header class="inner-header">
      <bread-crumb :breadList="breadcrumb">
      </bread-crumb>
    </el-header>
    <el-main class="inner-main-container">
      <el-tabs type="border-card" class="height-100">
        <el-tab-pane>
          <span slot="label">基础管理类隐患排查清单</span>
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
                      添加</el-button>
                      <el-button
                      type="danger"
                      size="medium"
                      icon="el-icon-download"
                      @click="exportEexcel">
                      删除</el-button>
                      <el-button
                      type="warning"
                      size="medium"
                      icon="el-icon-download"
                      @click="exportEexcel">
                      导入</el-button>
                    <el-button
                      type="success"
                      size="medium"
                      icon="el-icon-download"
                      @click="exportEexcel">
                      导出</el-button>
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
                    label="排查目标"
                    width="80">
                  </el-table-column>
                  <el-table-column
                    prop=" "
                    label="排查内容与排查标准"
                    width="200"
                    header-align="center">
                  </el-table-column>
                  <el-table-column label="专业性检查" header-align="center">
                    <el-table-column
                      prop=" "
                      label="公司专项检查"
                      width="120"
                      header-align="center">
                      <el-table-column
                        prop=" "
                        label="每年度/公司级"
                        width="120"
                        header-align="center"
                        align="center">
                        <template slot-scope="scope">
                          <el-checkbox v-model="checked"> </el-checkbox>
                        </template>
                      </el-table-column>
                    </el-table-column>
                    <el-table-column
                      prop=" "
                      label="部门专项检查"
                      width="120"
                      header-align="center"
                      align="center">
                      <el-table-column
                        prop=" "
                        label="每季度/部门级"
                        width="120"
                        header-align="center">
                      </el-table-column>
                    </el-table-column>
                  </el-table-column>
                  <el-table-column label="综合性检查" header-align="center">
                    <el-table-column
                      prop=" "
                      label="公司联检"
                      width="120"
                      header-align="center">
                      <el-table-column
                        prop=" "
                        label="每季度/部门级"
                        width="120"
                        header-align="center">
                      </el-table-column>
                    </el-table-column>
                    <el-table-column
                      prop=" "
                      label="部门联检"
                      width="120"
                      header-align="center">
                      <el-table-column
                        prop=" "
                        label="每月/部门级"
                        width="120"
                        header-align="center">
                      </el-table-column>
                    </el-table-column>
                  </el-table-column>
                  <el-table-column label="日常性检查" header-align="center">
                    <el-table-column
                      prop=" "
                      label="交接班"
                      width="120"
                      header-align="center">
                      <el-table-column
                        prop=" "
                        label="每班/班组级"
                        width="120"
                        header-align="center">
                      </el-table-column>
                    </el-table-column>
                    <el-table-column
                      prop=" "
                      label="班组巡查"
                      width="120"
                      header-align="center">
                      <el-table-column
                        prop=" "
                        label="每2小时/班组级"
                        width="120"
                        header-align="center">
                      </el-table-column>
                    </el-table-column>
                  </el-table-column>
                  <el-table-column label="节假日检查" header-align="center">
                    <el-table-column
                      prop=" "
                      label=" "
                      width="80"
                      header-align="center">
                      <el-table-column
                        prop=" "
                        label=" "
                        width="80"
                        header-align="center">
                      </el-table-column>
                    </el-table-column>
                    <el-table-column
                      prop=" "
                      label=" "
                      width="80"
                      header-align="center">
                      <el-table-column
                        prop=" "
                        label=" "
                        width="80"
                        header-align="center">
                      </el-table-column>
                    </el-table-column>
                  </el-table-column>
                </el-table>
              </div>
            </el-main>
          </el-container>
        </el-tab-pane>

        <el-tab-pane>
          <span slot="label">生产现场类隐患排查清单</span>
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
                      添加</el-button>
                      <el-button
                      type="danger"
                      size="medium"
                      icon="el-icon-download"
                      @click="exportEexcel">
                      删除</el-button>
                      <el-button
                      type="warning"
                      size="medium"
                      icon="el-icon-download"
                      @click="exportEexcel">
                      导入</el-button>
                    <el-button
                      type="success"
                      size="medium"
                      icon="el-icon-download"
                      @click="exportEexcel">
                      导出</el-button>
                  </div>
                </div>
                <el-table
                  :data="tableData"
                  border
                  style="width: 100%" >
                  <el-table-column
                    prop=" "
                    label="序号"
                    width="50">
                  </el-table-column>
                  <el-table-column
                    prop=" "
                    label="单元"
                    header-align="center">
                    <el-table-column
                      prop=" "
                      label="一级单元"
                      width="100"
                      header-align="center">
                    </el-table-column>
                    <el-table-column
                      prop=" "
                      label="二级单元"
                      width="100"
                      header-align="center">
                    </el-table-column>
                    <el-table-column
                      prop=" "
                      label="三级单元"
                      width="100"
                      header-align="center">
                    </el-table-column>
                  </el-table-column>
                  <el-table-column
                    prop=" "
                    label="检查内容"
                    header-align="center">
                  </el-table-column>
                  <el-table-column
                    prop=" "
                    label="是否符合"
                    header-align="center">
                  </el-table-column>
                  <el-table-column
                    prop=" "
                    label="存在问题"
                    header-align="center">
                  </el-table-column>
                  <el-table-column
                    prop=" "
                    label="整改措施"
                    header-align="center">
                  </el-table-column>
                  <el-table-column
                    prop=" "
                    label="责任方"
                    header-align="center">
                    <el-table-column
                      prop=" "
                      label="岗位"
                      width="50"
                      header-align="center">
                    </el-table-column>
                    <el-table-column
                      prop=" "
                      label="班组"
                      width="50"
                      header-align="center">
                    </el-table-column>
                    <el-table-column
                      prop=" "
                      label="部门"
                      width="50"
                      header-align="center">
                    </el-table-column>
                    <el-table-column
                      prop=" "
                      label="公司"
                      width="50"
                      header-align="center">
                    </el-table-column>
                  </el-table-column>
                </el-table>
              </div>
            </el-main>
          </el-container>
        </el-tab-pane>
      </el-tabs>
    </el-main>
    <el-dialog
      title="编辑"
      :visible.sync="dialogVisible">
      <el-form
        :model="form"
        ref="form"
        size="mini"
        label-width="100px"
        label-position="top"
      >
        <el-form-item label="排查目标" inline-message>
          <el-input
            placeholder="请输入排查目标"></el-input>
        </el-form-item>
        <el-form-item label="排查内容与排查标注" >
          <el-input
            type="textarea"
            show-word-limit
            maxlength="200"></el-input>
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
  name: 'screeningList',
  data () {
    return {
      breadcrumb: ['风险辨识评估', '风险划分'],
      pageLoading: false,
      dialogVisible: false,
      checked: false,
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
      tableData: [{
        workshop: '变压站',
        jobs: '配电员',
        mianRisk: '员工吸烟',
        riskFactor: ' ',
        hazardType: ' ',
        emergency: ' '
      }],
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
      // this.pageLoading = true
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
@import '../../utils/css/style.scss';
</style>
