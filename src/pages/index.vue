<!-- index页面 -->
<template>
  <div class="index-page" ref="indexPage">
    <el-container class="index-out">
      <el-header height="92px">
        <index-header :headerMsgNum="messageCount"></index-header>
      </el-header>
      <el-container class="main-container">
        <el-aside width="320px">
          <index-aside
            @changeBreadcrumb='changeBreadcrumb'
          ></index-aside>
        </el-aside>
        <el-main>
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
    changeBreadcrumb () {},
    refreshBaseInfo () { // router change, do something
    }
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
.main-container{
  height: calc(100vh - 110px);
}
</style>
