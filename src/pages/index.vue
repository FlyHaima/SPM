<!-- index页面 -->
<template>
  <div class="main-page-wrap" ref="indexPage">
    <el-container class="main-page-container">
      <el-header height="72px">
        <index-header :headerMsgNum="messageCount"></index-header>
      </el-header>
      <el-container class="main-container">
        <el-aside width="270px">
          <index-aside
            @changeBreadcrumb='changeBreadcrumb'
          ></index-aside>
        </el-aside>
        <el-main class="main-content">
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
@import '../utils/css/style.scss';

.main-page-wrap{
  width: 100%;
  height: 100%;
  // min-width: 1366px;
  min-width: 1200px;
  .el-header{
    width: 100%;
    padding: 0;
  }
}
.main-page-container{
    width: 100%;
    height: 100%;
  }
.main-container{
  // height: calc(100vh - 110px);
}
.main-content{
  padding: 15px 15px 0;
}
</style>
