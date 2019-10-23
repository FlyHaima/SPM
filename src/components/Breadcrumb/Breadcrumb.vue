<!-- 面包屑导航 -->
<template>
  <div class="bread-crumb">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>我的位置</el-breadcrumb-item>
      <el-breadcrumb-item  v-for="(item, index) in breadList" :key="index">{{item}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: 'Breadcrumb',
  props: ['breadList'],
  data () {
    return {
    }
  }
}
</script>

<style scoped lang="scss">
.bread-crumb{
  height: 50px;
  line-height: 50px;
  // margin: 15px;
  background: #fff;
  font-size: 16px;
  .el-breadcrumb{
    margin-left: 18px;
    font-size: 16px;
    line-height: 50px;
    .el-breadcrumb__item{
      color: #474747;
      &:first-child{
        color: #777;
      }
    }
  }
}
</style>
