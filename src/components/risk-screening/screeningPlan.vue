<template>
  <el-container class="inner-page-container" v-loading="pageLoading">
    <el-header class="inner-header">
      <bread-crumb :breadList="breadcrumb">
      </bread-crumb>
    </el-header>
    <el-main class="inner-main-container">
      <el-tabs
        v-model="type"
        @tab-click="tabClickHandle"
        type="border-card"
        class="height-100">
        <el-tab-pane
          label="基础管理类隐患排查清单"
          name="基础类排查清单"
          :key="'基础类排查清单'">
          <span slot="label">基础管理类隐患排查清单</span>
          <basic-list v-if="isChildUpdate1" :type="type"></basic-list>
        </el-tab-pane>

        <el-tab-pane
          label="生产现场类隐患排查清单"
          name="现场类排查清单"
          :key="'现场类排查清单'">
          <span slot="label">生产现场类隐患排查清单</span>
          <product-list v-if="isChildUpdate2" :type="type"></product-list>
        </el-tab-pane>
      </el-tabs>
    </el-main>
    <!-- <dialog-add-danger
      :dialogVisible = "dialogAddDangerVisible"
      @on-dialog-change = "changeAddDangerDialog"
    ></dialog-add-danger> -->

  </el-container>
</template>
<script>
import BreadCrumb from '@/components/Breadcrumb/Breadcrumb'
import basicList from '@/components/risk-screening/screening-plan-basic/list'
import productList from '@/components/risk-screening/screening-plan-product/list'
// import DialogAddDanger from '@/components/risk-screening/screening-plan/addDangerDialog'
export default {
  name: 'screeningPlan',
  data () {
    return {
      breadcrumb: ['风险辨识评估', '风险划分'],
      pageLoading: false,
      currentMenuTab: '', // 计划清单默认选中项
      checkList: [], // 筛选复选框的值
      currentPlanId: '', // 当前清单项的id
      type: '基础类排查清单', // tab切换类型
      isChildUpdate1: true, // tab1切换开关，刷新
      isChildUpdate2: false // tab2切换开关，刷新
    }
  },
  components: {
    BreadCrumb, // 面包屑
    basicList,
    productList
    // DialogAddDanger // 添加随机隐患弹框
  },
  created () {
  },
  methods: {
    // tab切换处理
    tabClickHandle (tab, event) {
      this.type = tab.name
      if (tab.name === '基础类排查清单') {
        this.isChildUpdate1 = true
        this.isChildUpdate2 = false
      } else if (tab.name === '现场类排查清单') {
        this.isChildUpdate1 = false
        this.isChildUpdate2 = true
      }
    }
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

.left-menu{
  background: #ffffff;
  position: relative;
  width: 400px;
  height: 100%;
}
.el-form{
  width: 400px;
  margin: 0 auto;
}
// /deep/.el-select{
//   .el-input__inner{
//     border: 0;
//     background: transparent;
//     height: 30px;
//     line-height: 30px;
//   }
//   .el-input__icon{
//     line-height: 30px;
//   }
// }
// /deep/.el-icon-bottom{
//   display: inline-block;
//   border: 1px solid #333333;
//   padding: 2px;
//   border-radius: 50%;
//   &:hover{
//     color: $colorPrimary;
//     border-color: $colorPrimary;
//   }
// }
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
    width: 290px;
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
</style>
