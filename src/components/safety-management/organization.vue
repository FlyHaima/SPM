<template>
  <el-container class="inner-page-container" v-loading="pageLoading">
    <el-header class="inner-header">
      <bread-crumb :breadList="breadcrumb">
      </bread-crumb>
    </el-header>
    <el-main class="inner-main-container">
      <el-tabs type="border-card" class="height-100">
        <el-tab-pane>
          <span slot="label">组织机构</span>
          <el-container class="inner-main-content">
            <el-aside class="inner-aside" width="408px">
              <tree-diagram @open-loading="openLoading"
                            @close-loading="closeLoading" >
              </tree-diagram>
            </el-aside>

            <el-main class="inner-content">
              <div class="container-box"></div>
            </el-main>
          </el-container>
        </el-tab-pane>

        <el-tab-pane label="领导小组">配置管理
          <span slot="label">组织机构</span>
          <el-container class="inner-main-content">
          </el-container>
        </el-tab-pane>

        <el-tab-pane label="工作小组">角色管理</el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script>
import BreadCrumb from '../Breadcrumb/Breadcrumb'
import TreeDiagram from '../tree-diagram/treeDiagram'

export default {
  name: 'organization',
  data () {
    return {
      breadcrumb: ['风险辨识评估', '风险划分'],
      pageLoading: false
    }
  },
  methods: {
    openLoading () {
      this.pageLoading = true
    },
    closeLoading () {
      this.pageLoading = false
    }
  },
  components: {TreeDiagram, BreadCrumb}
}
</script>

<style scoped lang="scss">
.inner-page-container{
  height: 100%;
  .el-header{
    padding: 0;
  }
  .el-main{
    padding: 0;
  }
}
/*  el-tab */
/deep/.inner-main-container{
  .el-tabs--border-card{
    position: relative;
    border-color: #eeeeee;
  }
  .el-tabs__nav{
    height: 50px;
  }
  .el-tabs__item{
    height: 51px;
    line-height: 50px;
    font-size: 16px;
    color: #777;
    &.is-active{
      color: #409EFF;
      border-top: 2px solid #409EFF;
    }
  }
  .el-tabs__content{
    height: 100%;
    padding: 50px 0 0;
    position: absolute;
    top: 0;
    left: 0;
    .el-tab-pane{
      height: 100%;
      .inner-main-content{
        background: #f2f2f2;
        width: 100%;
        height: 100%;
      }
    }
  }
}

.container-box{
  height: 100%;
  width: 100%;
  background: #fff;
}
.inner-main-content{
  width: 100%;
  height: 100%;
}
.inner-content{
  width: 100%;
  height: 100%;
  padding: 0;
}

</style>
