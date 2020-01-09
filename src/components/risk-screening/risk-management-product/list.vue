<template>
  <el-container class="inner-main-content">
    <el-aside class="inner-aside" width="408px">
      <tree-read-only
        :tree-name="'风险单元'"
        :tree-data="riskUnitTree"
        searchVisible
        shrinkVisible
        @tree-click-handle="treeClickHandle">
      </tree-read-only>
    </el-aside>
    <el-main class="inner-content">
      <div class="container-box">
        <div class="content-tools">
          <div class="tools-left">
            <el-form
              size="medium"
              :inline="true"
              :model="form"
              class="demo-form-inline">
              <el-form-item label="检查名称">
                <el-input v-model="form.checkName" placeholder="请输入检查名称"></el-input>
              </el-form-item>
              <el-form-item label="检查日期">
                <el-date-picker
                  v-model="queryDate"
                  @change="checkQueryDate"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd HH:mm:ss">
                </el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  @click="tableSearchHandler">查询</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="tools-right">
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
            prop="checkName"
            label="检查名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="hiddenType"
            label="隐患类型"
            align="center">
          </el-table-column>
          <el-table-column
            prop="checkByUser"
            label="复核人"
            align="center">
          </el-table-column>
          <el-table-column
            prop="checkByTime"
            label="复核时间"
            align="center">
          </el-table-column>
          <el-table-column
            prop="rectiTime"
            label="整改时间"
            align="center">
          </el-table-column>
          <el-table-column
            prop="rectiRemark"
            label="整改意见"
            align="center">
          </el-table-column>
          <el-table-column
            prop=" "
            label="复核情况"
            width="120"
            align="center">
            <template slot-scope="scope">
              <a
                href="javascript:;"
                class="color-primary"
                @click="detailsHandle(scope.row)">详情
              </a>
            </template>
          </el-table-column>
          <el-table-column
            prop=" "
            label="操作"
            width="100"
            align="center">
            <template slot-scope="scope">
              <a
                href="javascript:;"
                class="color-primary"
                @click="reviewHandle(scope.row)">复核
              </a>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-main>
    <dialog-details
      :dialogVisible = "dialogDetailsVisible"
      @on-dialog-change = "changeDetailsDialog"
    ></dialog-details>
    <dialog-review
      :dialogVisible = "dialogReviewVisible"
      @on-dialog-change = "changeReviewDialog"
    ></dialog-review>
  </el-container>
</template>

<script>
import TreeReadOnly from '@/components/tree-diagram/treeReadOnly'
import axios from '@/api/axios'
import moment from 'moment'
import DialogDetails from '@/components/risk-screening/screening-review/detailsDialog'
import DialogReview from '@/components/risk-screening/screening-review/reviewDialog'
export default {
  name: 'list',
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      dialogDetailsVisible: false, // 详情弹框显示开关
      dialogReviewVisible: false, // 复核弹框显示开关
      form: {
        checkName: '',
        startTime: '',
        endTime: ''
      },
      listMenuData: [], // 计划清单列表数据
      currentPlanId: '', // 当前清单项的id
      riskUnitTree: [], // 风险单元机构树
      tableData: [], // 生产类清单列表数据
      queryDate: ''
    }
  },
  components: {
    TreeReadOnly,
    DialogDetails,
    DialogReview
  },
  created () {
    this.fetchUnitTreeData()
    this.fetchTableData()
  },
  methods: {
    checkQueryDate (val) {
      console.log(val)
      if (val) {
        this.form.startTime = val[0]
        this.form.endTime = val[1]
      } else {
        this.form.startTime = this.form.endTime = ''
      }
    },
    // 触发复核操作
    reviewHandle (item) {
      this.dialogReviewVisible = true
    },
    changeReviewDialog (val) {
      this.dialogReviewVisible = val
    },
    // 触发详情弹框
    detailsHandle (item) {
      this.dialogDetailsVisible = true
    },
    changeDetailsDialog (val) {
      this.dialogDetailsVisible = val
    },
    // 树节点，点击功能
    treeClickHandle (item) {
      this.currentPlanId = item.riskId
      this.fetchTableData()
    },
    // 获取风险单元树的数据
    fetchUnitTreeData () {
      axios
        .get('riskia/getRiskTree')
        .then((res) => {
          if (res.data.code === 200) {
            this.riskUnitTree = res.data.data
            this.currentPlanId = this.riskUnitTree[0].riskId
            this.fetchTableData()
          }
        })
    },
    // 获取排查隐患清单列表
    fetchTableData () {
      axios
        .get('hiddenAct/dImpleList', {
          checkName: this.form.checkName,
          investType: this.type,
          startTime: this.form.startTime,
          endTime: this.form.endTime,
          leftId: this.currentPlanId
        })
        .then((res) => {
          if (res.data.code === 200) {
            this.formatTableData = res.data.data
            this.formatTableData.forEach(item => {
              // 格式化复核时间
              if (item.checkByTime) {
                item.checkByTime = moment(item.checkByTime).format('YYYY-MM-DD  HH: mm: ss')
              } else {
                item.checkByTime = ''
              }
              // 格式化整改时间
              if (item.rectiTime) {
                item.rectiTime = moment(item.rectiTime).format('YYYY-MM-DD  HH: mm: ss')
              } else {
                item.rectiTime = ''
              }
            })
            this.tableData = this.formatTableData
          }
        })
    },
    // 查询table，表单提交响应事件
    tableSearchHandler () {
      this.fetchTableData()
    },
    // 导出excel
    exportEexcel () {}
  }
}
</script>

<style lang="scss" scoped>
@import '@/utils/css/style.scss';
/deep/.tree-diagram {
  margin: 0 auto;
  .tree-box{
    background: #f7f9fc;
  }
  .el-tree {
    background: #f7f9fc;
  }
}
/deep/.el-select{
  .el-input__inner{
    border: 0;
    background: transparent;
    height: 30px;
    line-height: 30px;
  }
  .el-input__icon{
    line-height: 30px;
  }
}
/deep/.el-icon-bottom{
  display: inline-block;
  border: 1px solid #333333;
  padding: 2px;
  border-radius: 50%;
  &:hover{
    color: $colorPrimary;
    border-color: $colorPrimary;
  }
}

.raido-group-custom{
  background: #ffffff;
   margin: 10px 0;
  >>> .el-radio-button__inner{
    padding: 5px 3px;
    width: 51px;
    height: 26px;
    font-size: 14px;
    color: #9e9e9e;
    font-weight: 400;
    // text-indent: -999px;
  }
  >>> .el-radio-button__orig-radio:checked+.el-radio-button__inner{

  }
  >>> .el-radio-button__orig-radio:disabled:checked+.el-radio-button__inner{
    background: #ababab !important;
    border-color: #ababab !important;
    box-shadow: -1px 0 0 0 #ababab !important;
  }
  >>> .el-radio-button:first-child {
      .el-radio-button__orig-radio:checked+.el-radio-button__inner{
        background: $colorPrimary;
        color: #ffffff;
      }
        .el-radio-button__inner{
          border-radius:  19px 0 0 19px;
        }
      }
  >>> .el-radio-button:last-child {
        .el-radio-button__orig-radio:checked+.el-radio-button__inner{
          background: #f56c6c;
          border-color: #f56c6c;
          color: #ffffff;
          box-shadow: -1px 0 0 0 #f56c6c;
        }
        .el-radio-button__inner{
          border-radius:  0px 19px 19px 0px;

        }
      }
}
.data-colum{
  margin: 40px auto 0;
  +.data-colum{
    margin-top: 15px;
  }
  .data-colum-label{
    display: inline-block;
    width:  85px;
  }
  .button-add-time{
    display: inline-block;
    font-size: 24px;
    vertical-align: top;
    line-height: 32px;
    &:hover{
      color: $colorPrimary;
    }
  }
  >>> .el-date-editor{
    width: 280px;
    .el-input__inner{
      height: 30px;
      line-height: 30px;
    }
    .el-input__icon{
      line-height: 30px;
    }
  }
}
.dialog-content{
  margin: 0 20px;
}
.dialog-tips-content{
  display: flex;
  align-items: center;
  justify-content: center;
}
.dialog-tips-icon{
  width: 46px;
  height: 46px;
  font-size: 46px;
  &.el-icon-warning{
    color: #ff4848;
  }
  &.el-icon-circle-check{
    color: $colorPrimary;
  }
}
.dialog-tips-text{
  max-width: 448px;
  font-size: 16px;
  line-height: 30px;
  color: #ababab;
  margin-left: 20px;
}
.table-img{
  width: 62px;
  height: 53px;
}
</style>
