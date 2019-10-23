<template>
  <el-container class="inner-page-container" v-loading="pageLoading">
    <el-header class="inner-header">
      <bread-crumb :breadList="breadcrumb">
      </bread-crumb>
    </el-header>
    <el-main class="inner-main-container">
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

<style scoped>
.container-box{
  height: 800px;
  width: 100%;
  background: #fff;
}
.inner-page-container{
  width: 100%;
  height: 100%;
}
.inner-header{
  padding: 0;
  height: auto !important;
}
.inner-main-container{
  margin-top: 15px;
  padding: 0;
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
