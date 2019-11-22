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
            </p>
            <div class="table-box">
              <el-table
                :data="tableData"
                style="width: 100%">
                <el-table-column
                  prop="indexNum"
                  label="风险点序号" align="center"
                  width="45">
                </el-table-column>
                <el-table-column label="风险点位置" align="center">
                  <el-table-column label="一级子单元" align="center">
                    <el-table-column
                      prop="levelANum" align="center"
                      label="序号">
                    </el-table-column>
                    <el-table-column align="center"
                      prop="levelAName"
                      label="名称">
                    </el-table-column>
                  </el-table-column>
                  <el-table-column label="二级子单元" align="center">
                    <el-table-column align="center"
                      prop="levelBNum"
                      label="序号">
                    </el-table-column>
                    <el-table-column align="center"
                      prop="levelBName"
                      label="名称">
                    </el-table-column>
                  </el-table-column>
                  <el-table-column label="三级子单元" align="center">
                    <el-table-column align="center"
                      prop="levelCNum"
                      label="序号">
                    </el-table-column>
                    <el-table-column align="center"
                      prop="levelCName"
                      label="名称">
                    </el-table-column>
                  </el-table-column>
                </el-table-column>
              </el-table>
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

export default {
  name: 'riskUnit',
  data () {
    return {
      pageLoading: false,
      breadcrumb: ['风险辨识评估', '风险单元'],
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
      tableData: [
        {
          indexNum: 1,
          levelANum: 1001,
          levelAName: '风险点层级A',
          levelBNum: 100102,
          levelBName: '风险点层级B',
          levelCNum: 100198,
          levelCName: '风险点层级C'
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
    openExportDialog () {}
  },
  components: {TreeReadOnly, BreadCrumb}
}
</script>

<style scoped lang="scss">
.inner-page-container {
  .inner-content {
    width: 100%;
    height: 100%;
    padding: 29px 22px;
    background: #fff;

    .container-box {
      .btn-p {
        height: 36px;
        line-height: 36px;
        & > a {
          float: right;
          width: 83px;
          height: 36px;
          color: #fff;
          font-size: 16px;
          text-align: center;
          margin-left: 28px;
          i {
            margin-right: 8px;
            display: inline-block;
            width: 15px;
            height: 15px;
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
      .table-box{
        margin-top: 30px;
      }
    }
  }
}
/deep/.inner-page-container {
  .inner-content {
    .el-table td {
      padding: 18px 4px;
    }
  }
}
</style>
