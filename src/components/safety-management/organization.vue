<template>
  <el-container style="width: 100%; height: 100%;" v-loading="pageLoading">
    <el-header height="80px" style="padding: 0">
      <bread-crumb :breadList="breadcrumb">
      </bread-crumb>
    </el-header>
    <el-main style="padding: 0 15px;">
      <el-container style="width: 100%; height: 100%;">
        <el-aside width="408px">
          <tree-diagram @open-loading="openLoading"
                        @close-loading="closeLoading" >
          </tree-diagram>
        </el-aside>

        <el-container style="width: 100%; height: 100%;">
          <div class="container-box"></div>
        </el-container>
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
  height: 100%;
  width: 100%;
  background: #fff;
}
</style>
