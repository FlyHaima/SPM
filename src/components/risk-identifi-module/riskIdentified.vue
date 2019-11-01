<template>
  <el-container class="inner-page-container" v-loading="pageLoading">
    <el-header class="inner-header">
      <bread-crumb :breadList="breadcrumb">
      </bread-crumb>
    </el-header>
    <el-main class="inner-main-container">
    </el-main>
  </el-container>
</template>

<script>
import BreadCrumb from '../Breadcrumb/Breadcrumb'
import TreeDiagram from '../tree-diagram/treeDiagram'

export default {
  name: 'riskIdentified',
  data () {
    return {
      pageLoading: false,
      breadcrumb: ['风险辨识评估', '风险辨识']
    }
  },
  components: {TreeDiagram, BreadCrumb}
}
</script>

<style scoped lang="scss">

</style>
