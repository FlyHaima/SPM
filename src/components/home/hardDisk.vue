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
            <div class="aside-title"><i></i>文件</div>
            <ul class="aside-list">
              <li v-for="(item, index) in fileTypes" :key="index">
                <a class="type-item" :class="item.active ? 'active' : ''" @click="clickMenuItem(item.id)">{{item.name}}</a>
              </li>
            </ul>
          </div>
        </el-aside>
        <el-main class="inner-content">
          <div class="container-box">
<!--            <p class="btn-p">-->
<!--              <el-button size="medium" type="primary"><i class="el-icon-upload2"></i>上传</el-button>-->
<!--            </p>-->
            <el-table border
                      stripe
                      :data="dataList"
                      tooltip-effect="dark"
                      style="width: 100%">
              <el-table-column
                label="文件名"
                align="center">
                <template slot-scope="scope">{{ scope.row.name }}</template>
              </el-table-column>
              <el-table-column
                label="文件类型"
                align="center">
                <template slot-scope="scope">{{ scope.row.type }}</template>
              </el-table-column>
              <el-table-column
                label="时间"
                align="center">
                <template slot-scope="scope">{{ formatTime(scope.row.time) }}</template>
              </el-table-column>
              <el-table-column
                label="操作"
                align="center">
                <template slot-scope="scope">
                  <a type="text" :href="scope.row.path">下载</a>
                </template>
              </el-table-column>
            </el-table>

            <div class="pages">
              <el-pagination
                background
                layout="prev, pager, next"
                :total="pageData.total"
                :page-size="pageData.pageSize"
                :current-page.sync="pageData.pageNo"
                @current-change="getTable">
              </el-pagination>
            </div>
          </div>
        </el-main>
      </el-container>
    </el-main>
  </el-container>
</template>

<script>
import BreadCrumb from '../Breadcrumb/Breadcrumb'
import {getDiskFileList} from '@/api/organization'

export default {
  name: 'hardDisk',
  data () {
    return {
      pageLoading: false,
      breadcrumb: ['安全基础管理', '本机硬盘'],
      fileTypes: [
        {name: '文档', id: '0', active: true},
        {name: '视频', id: '1', active: false},
        {name: '图片', id: '2', active: false},
        {name: '其他', id: '3', active: false}
      ],
      currentTypeId: '0',
      dataList: [],
      pageData: {
        pageSize: 10,
        pageNo: 1,
        total: 0
      }
    }
  },
  created () {
    this.getTable()
  },
  methods: {
    formatTime (t) {
      let thisD = new Date(t)
      let tyear = thisD.getFullYear()
      let tmonth = thisD.getMonth() + 1
      let tday = thisD.getDate()
      let thour = thisD.getHours()
      let tmin = thisD.getMinutes()
      if (tday < 10) {
        tday = '0' + tday
      }
      if (tmonth < 10) {
        tmonth = '0' + tmonth
      }
      if (thour < 10) {
        thour = '0' + thour
      }
      if (tmin < 10) {
        tmin = '0' + tmin
      }

      return `${tyear}-${tmonth}-${tday} ${thour}:${tmin}`
    },
    clickMenuItem (id) {
      let vm = this
      if (vm.currentTypeId !== id) {
        // 当不同type，分页信息归零
        vm.pageData = {
          pageSize: 10,
          pageNo: 1,
          total: 0
        }
      } else {
        return
      }
      vm.currentTypeId = id

      vm.getTable()

      vm.fileTypes.forEach((item) => { item.active = false })
      vm.fileTypes[id].active = true
    },
    getTable () {
      let vm = this
      vm.pageLoading = true
      getDiskFileList(vm.currentTypeId, vm.pageData.pageNo, vm.pageData.pageSize).then((res) => {
        if (res.code === 200) {
          vm.dataList = res.data
          vm.pageData.total = res.total
        }
        vm.pageLoading = false
      })
    }
  },
  components: {BreadCrumb}
}
</script>

<style scoped lang="scss">
  @import '@/utils/css/tools/_variables.scss';
  .inner-page-container {
    height: 100%;
    .el-header {
      padding: 0;
    }
    .el-main {
      padding: 0;
    }
  }
  .inner-main-content{
    height: 100%;
  }
  .left-menu{
    background: #fff;
    position: relative;
    width: 400px;
    height: 100%;
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
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      padding: 61px 0 10px 0;
      overflow: auto;
      li{
        width: 100%;
        height: 35px;
        padding: 4px 0;
        .type-item{
          display: block;
          height: 27px;
          width: 100%;
          padding: 0 29px;
          line-height: 27px;
          color: #646464;
          &.active{
            color: #409eff;
            background: #f1f5f9;
          }
          &:hover{
            color: #409eff;
            background: #f1f5f9;
          }
        }
      }
    }
  }
  .container-box{
    background: #fff;
    height: 100%;
    overflow-y: auto;
    padding: 25px;
    .btn-p{
      text-align: right;
      margin: 0 0 20px 0;
    }
  }
  .pages{
    margin-top: 28px;
    text-align: right;
  }
</style>
