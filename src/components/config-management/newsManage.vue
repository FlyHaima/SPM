<template>
  <el-container class="inner-page-container" v-loading="pageLoading">
    <el-header class="inner-header">
      <bread-crumb :breadList="breadcrumb">
      </bread-crumb>
    </el-header>
    <el-main class="inner-main-container">
      <el-container class="inner-main-content">
        <el-aside class="inner-aside" width="408px">
          <div class="left-menu">
            <div class="aside-title"><i></i>页面管理</div>
            <ul class="aside-list">
              <li
                v-for="(tab, index) in tabs"
                :key="index">
                <a
                  class="type-item"
                  :class="{ active : currentTab === tab.type }"
                  @click="currentTab = tab.type">
                  {{tab.name}}
                </a>
              </li>
            </ul>
          </div>
        </el-aside>
        <el-main class="inner-content">
          <component
            :is="currentTabComponent"></component>
        </el-main>
      </el-container>
    </el-main>
  </el-container>
</template>

<script>
import BreadCrumb from '../Breadcrumb/Breadcrumb'
import SwiperList from '@/components/config-management/newsManage/swiperList'
import NewsList from '@/components/config-management/newsManage/newsList'

export default {
  name: 'newsManage',
  data () {
    return {
      breadcrumb: ['配置维护管理', '新闻维护'],
      pageLoading: false,
      submitting: false,
      tabs: [
        {
          name: '轮播图',
          type: 'swiper'
        },
        {
          name: '新闻列表',
          type: 'news'
        }
      ],
      currentTab: 'swiper'
    }
  },
  methods: {
  },
  computed: {
    currentTabComponent: function () {
      return this.currentTab + '-list'
    }
  },
  components: {
    BreadCrumb,
    SwiperList,
    NewsList
  }
}
</script>

<style scoped lang="scss">
@import '../../utils/css/style.scss';
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
.aside-list{
  padding: 61px 0 10px;
  li{
    width: 100%;
    font-size: 0;
    .type-item{
      display: inline-block;
      font-size: 16px;
      width: 100%;
      line-height: 16px;
      padding: 6px 29px;
      color: #646464;
      margin-bottom: 6px;
      &.active,
      &:hover{
        color: $colorPrimary;
        background: #f1f5f9;
      }
    }
  }
}
// .container-box{
//   background: #fff;
//   height: 100%;
//   overflow-y: auto;
//   padding: 25px;
// }
</style>
