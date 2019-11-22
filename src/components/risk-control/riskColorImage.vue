<template>
  <el-container class="inner-page-container" v-loading="pageLoading">
    <el-header class="inner-header">
      <bread-crumb :breadList="breadcrumb">
      </bread-crumb>
    </el-header>
    <el-main class="inner-main-container">
      <el-select v-model="mapSelection" placeholder="请选择">
        <el-option v-for="(item, index) in listAA" :key="index" label="状态一" value="shanghai"></el-option>
      </el-select>
    </el-main>
  </el-container>
</template>
<script>
import BreadCrumb from '../Breadcrumb/Breadcrumb'
import TreeDiagram from '../tree-diagram/treeDiagram'

export default {
  name: 'riskColorImage',
  data () {
    return {
      breadcrumb: ['风险分级管控', '风险四色图'],
      pageLoading: false,
      listAA: [],
      mapSelection: ''
    }
  },
  components: {
    TreeDiagram,
    BreadCrumb
  }
}
</script>

<style lang="scss" scoped>

</style>
