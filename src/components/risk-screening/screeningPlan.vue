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
              <div class="left-menu">
                <div class="aside-title">
                  <i></i>计划清单
                  <a
                    href="javascript:;"
                    @click="eiditOrganizationHandle()">编辑机构</a>
                  <a
                    href="javascript:;"
                    @click="addMenuHandle()">创建清单</a>
                  </div>

                <tree-list
                  :list-data = "listMenuData"
                  @menu-click-handle="menuClickHandle"
                  @eidt-menu-handle="eidtMenuHandle"
                  @del-menu-handle="delMenuHandle"
                ></tree-list>
              </div>
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
          <span slot="label">生产现场类隐患排查清单</span>
          <el-container class="inner-main-content">
            <el-aside class="inner-aside" width="408px">
              <tree-read-only
                :tree-name="'风险单元'"
                :tree-data="organizationTree"
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
    <el-dialog
      title="编辑机构"
      :visible.sync="dialogOrganizationVisible"
      width="30%">
      <div style="height: 500px">
        <tree-organization
          :tree-data= "organizationTree"
          editVisible
        ></tree-organization>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          size="small"
          @click="submitForm()">确 定</el-button>
        <el-button
          size="small"
          @click="dialogOrganizationVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>
<script>
import BreadCrumb from '../Breadcrumb/Breadcrumb'
import TreeReadOnly from '../tree-diagram/treeReadOnly'
import OwnElDialog from '../el-dialog/elDialog'
import TreeList from '@/components/tree-diagram/treeList'
import TreeOrganization from '@/components/tree-diagram/treeOrganization'
import axios from '@/api/axios'
export default {
  name: 'screeningPlan',
  data () {
    return {
      breadcrumb: ['风险辨识评估', '风险划分'],
      pageLoading: false,
      dialogVisible: false,
      dialogOrganizationVisible: false,
      checked: false,
      isPush: true,
      organizationTree: [],
      form: {},
      tableData: [],
      listMenuData: [
        {
          id: '1',
          name: '轮播图',
          type: '1'
        },
        {
          id: '2',
          name: '新闻列表',
          type: '2'
        }
      ] // 计划清单列表数据
    }
  },
  components: {
    TreeReadOnly,
    BreadCrumb,
    OwnElDialog,
    TreeList,
    TreeOrganization
  },
  created () {
    this.fetchOrgTreeData()
  },
  methods: {
    // 获取组织机构树数据
    fetchOrgTreeData () {
      let userId = sessionStorage.getItem('userId')
      axios
        .get('dept/getDeptList', {
          userId: userId
        })
        .then((res) => {
          if (res.data.code === 200) {
            this.organizationTree = res.data.data[0]
          }
        })
    },
    // 创建清单
    addMenuHandle () {
      this.openAppendBox()
    },
    openAppendBox () {
      this.$prompt('请输入清单名称', '添加清单', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        // 添加ajax
        this.$message({
          type: 'success',
          message: '清单设置成功'
        })
      }).catch(() => {
        // after cancel, do nothing
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
    // 编辑机构
    eiditOrganizationHandle () {
      this.dialogOrganizationVisible = true
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
.left-menu{
  background: #fff;
  position: relative;
  width: 400px;
  height: 100%;
}
.aside-title{
  position: absolute;
  width: 100%;
  z-index: 2;
  padding-left: 37px;
  height: 50px;
  line-height: 49px;
  border-bottom: 1px solid #eeeeee;
  color: #333333;
  font-size: 18px;
  i{
    position: absolute;
    top: 17px;
    left: 20px;
    display: block;
    background: url('../../assets/img/blue-double-line.png');
    width: 3px;
    height: 16px;
    background-size: cover;
  }
}

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
