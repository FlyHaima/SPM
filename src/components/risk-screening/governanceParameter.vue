<template>
  <el-container class="inner-page-container" v-loading="pageLoading">
    <el-header class="inner-header">
      <bread-crumb :breadList="breadcrumb">
      </bread-crumb>
    </el-header>
    <el-main class="inner-main-container">
      <el-tabs @tab-click="tabClickHandle" type="border-card" class="height-100">
        <el-tab-pane>
          <span slot="label">基础管理类隐患排查清单</span>
          <el-container class="inner-main-content">
            <el-aside class="inner-aside" width="408px">
              <tree-list
                :menu-name="'计划清单'"
                :list-data = "listMenuData"
                searchVisible
                @menu-click-handle="menuClickHandle"
                @eidt-menu-handle="eidtMenuHandle"
                @del-menu-handle="delMenuHandle"
              ></tree-list>
            </el-aside>

            <el-main class="inner-content">
              <div class="container-box">
                <div class="content-tools is-flex-end">
                  <div class="tools-right">
                    <el-button
                      type="warning"
                      size="medium"
                      icon="el-icon-upload2">
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
                  style="width: 100%">
                  <el-table-column
                    prop=" "
                    label="风险点序号"
                    width="40">
                  </el-table-column>
                  <el-table-column
                    prop=" "
                    label="风险点位置"
                    header-align="center">
                    <el-table-column
                      prop=" "
                      label="一级子单元"
                      width="40">
                    </el-table-column>
                    <el-table-column
                      prop=" "
                      label="二级子单元"
                      width="40">
                    </el-table-column>
                    <el-table-column
                      prop=" "
                      label="三级子单元"
                      width="40">
                    </el-table-column>
                  </el-table-column>
                  <el-table-column
                    prop=" "
                    label="风险点名称"
                    width="40"
                    header-align="center">
                  </el-table-column>
                  <el-table-column
                    label="风险点编号"
                    header-align="center"
                    width="40">
                  </el-table-column>
                  <el-table-column
                    label="排查发现日期"
                    header-align="center"
                    width="40">
                  </el-table-column>
                  <el-table-column
                    label="重大隐患基本情况"
                    header-align="center">
                  </el-table-column>
                  <el-table-column
                    label="可能导致事故类型"
                    header-align="center"
                    width="40">
                  </el-table-column>
                  <el-table-column
                    label="整改措施"
                    header-align="center">
                  </el-table-column>
                  <el-table-column
                    label="整改情况"
                    header-align="center">
                  </el-table-column>
                  <el-table-column
                    label="整改部门"
                    header-align="center">
                  </el-table-column>
                  <el-table-column
                    label="整改责任人"
                    header-align="center"
                    width="40">
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
                :tree-data="riskUnitTree"
                searchVisible
                shrinkVisible
                @tree-click-handle="treeClickHandle"
                @close-loading="closeLoading">
              </tree-read-only>
            </el-aside>

            <el-main class="inner-content">
              <div class="container-box">
                <div class="content-tools is-flex-end">
                  <div class="tools-right">
                    <el-button
                      type="warning"
                      size="medium"
                      icon="el-icon-upload2">
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
                  style="width: 100%">
                  <el-table-column
                    prop=" "
                    label="风险点序号"
                    width="40">
                  </el-table-column>
                  <el-table-column
                    prop=" "
                    label="风险点位置"
                    header-align="center">
                    <el-table-column
                      prop=" "
                      label="一级子单元"
                      width="40">
                    </el-table-column>
                    <el-table-column
                      prop=" "
                      label="二级子单元"
                      width="40">
                    </el-table-column>
                    <el-table-column
                      prop=" "
                      label="三级子单元"
                      width="40">
                    </el-table-column>
                  </el-table-column>
                  <el-table-column
                    prop=" "
                    label="风险点名称"
                    width="40"
                    header-align="center">
                  </el-table-column>
                  <el-table-column
                    label="风险点编号"
                    header-align="center"
                    width="40">
                  </el-table-column>
                  <el-table-column
                    label="排查发现日期"
                    header-align="center"
                    width="40">
                  </el-table-column>
                  <el-table-column
                    label="重大隐患基本情况"
                    header-align="center">
                  </el-table-column>
                  <el-table-column
                    label="可能导致事故类型"
                    header-align="center"
                    width="40">
                  </el-table-column>
                  <el-table-column
                    label="整改措施"
                    header-align="center">
                  </el-table-column>
                  <el-table-column
                    label="整改情况"
                    header-align="center">
                  </el-table-column>
                  <el-table-column
                    label="整改部门"
                    header-align="center">
                  </el-table-column>
                  <el-table-column
                    label="整改责任人"
                    header-align="center"
                    width="40">
                  </el-table-column>
                </el-table>
              </div>
            </el-main>
          </el-container>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>
<script>
import BreadCrumb from '@/components/Breadcrumb/Breadcrumb'
import TreeReadOnly from '@/components/tree-diagram/treeReadOnly'
import TreeList from '@/components/tree-diagram/treeList'
import axios from '@/api/axios'
export default {
  name: 'screeningPlan',
  data () {
    return {
      breadcrumb: ['风险辨识评估', '风险划分'],
      pageLoading: false,
      riskUnitTree: [], // 风险单元机构树
      tableData: [
      ],
      listMenuData: [
        {
          id: '1',
          name: '黑龙江阿斯顿建材集团配电室',
          type: '1'
        },
        {
          id: '2',
          name: '黑龙江阿斯顿建材集团配电室',
          type: '2'
        }
      ] // 计划清单列表数据
    }
  },
  components: {
    TreeReadOnly,
    BreadCrumb, // 面包屑
    TreeList // 计划清单菜单
  },
  created () {
    this.fetchUnitTreeData()
  },
  methods: {
    // tab切换处理
    tabClickHandle (tab, event) {
      console.log(tab.index)
      if (tab.index === 0) {
        this.isOrgTree = true
      } else {
        this.isOrgTree = false
      }
    },
    // 树节点，点击功能
    treeClickHandle () {

    },
    submitForm () {
      console.log(this.listDate)
    },
    // 获取风险单元树的数据
    fetchUnitTreeData () {
      axios
        .get('riskia/getRiskTree')
        .then((res) => {
          if (res.data.code === 200) {
            this.riskUnitTree = res.data.data
          }
        })
    },
    // 点击菜单项
    menuClickHandle (item) {
      console.log(item)
    },
    // 编辑菜单项
    eidtMenuHandle (item) {
      // console.log('edit')
    },
    // 删除菜单项
    delMenuHandle (item) {
      // console.log('del')
    },
    closeLoading () {
      this.pageLoading = false
    },
    // 导出excel
    exportEexcel () {},
    // 自定义序号
    indexMethod (index) {
      return index + 1
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
    width: 320px;
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
