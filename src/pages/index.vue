<!-- index页面 -->
<template>
  <div class="index-page" ref="indexPage">
    <el-container class="index-out">
      <el-header height="92px">
        <index-header :headerMsgNum="messageCount"></index-header>
      </el-header>
      <el-container>
        <el-aside width="320px">
          <index-aside
            @changeBreadcrumb='changeBreadcrumb'
          ></index-aside>
        </el-aside>
        <el-main>
<!--          <div class="breadcrumb-nav" :class="isMap? 'dark' : ''">-->
<!--            <div class="b-nav-head">当前位置：</div>-->
<!--            <el-breadcrumb separator-class="el-icon-arrow-right">-->
<!--              <el-breadcrumb-item><span style="cursor: pointer;" @click="toIndex">首页</span></el-breadcrumb-item>-->
<!--              <template v-if="breadcrumb.length > 0">-->
<!--                <el-breadcrumb-item v-for="(item, index) in breadcrumb" :key="index">{{item}}</el-breadcrumb-item>-->
<!--              </template>-->
<!--            </el-breadcrumb>-->
<!--          </div>-->
         <router-view @refresh="refreshBaseInfo()"></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import IndexHeader from '@/components/index-page/indexHeader'
import IndexAside from '@/components/index-page/indexAside'
// import {mapState, mapActions, mapGetters} from 'vuex'

export default {
  name: 'IndexPage',
  data () {
    return {
      messageCount: 0
    }
  },
  methods: {
    changeBreadcrumb () {}
  },
  watch: {
    '$route' (to, from) {
    }
  },
  components: {
    'index-header': IndexHeader,
    'index-aside': IndexAside
  }
}
</script>

<style scoped lang="scss">
@import '../utils/css/common.scss';

.index-page{
  width: 100%;
  height: 100%;
  min-width: 1880px;
  .index-out{
    width: 100%;
    height: 100%;
  }
  .el-header{
    width: 100%;
  }
}
</style>
