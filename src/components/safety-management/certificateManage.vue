<template>
  <el-container class="inner-page-container" v-loading="pageLoading">
    <el-header class="inner-header">
      <bread-crumb :breadList="breadcrumb">
      </bread-crumb>
    </el-header>
    <el-main class="inner-main-container">
      <el-container class="inner-main-content">

        <div class="container-box">
          <p class="btn-p">
            <el-button size="medium" type="primary"><i class="el-icon-upload2"></i>上传</el-button>
          </p>

          <el-table border
                    stripe
                    :data="dataList"
                    tooltip-effect="dark"
                    style="width: 100%">
            <el-table-column
              label="证件名称"
              align="center">
              <template slot-scope="scope">{{ scope.row.name }}</template>
            </el-table-column>
            <el-table-column
              label="证件种类"
              align="center">
              <template slot-scope="scope">{{ typesB[scope.row.type] }}</template>
            </el-table-column>
            <el-table-column
              label="证件有效截止日期"
              align="center">
              <template slot-scope="scope">{{ formatTime(scope.row.time) }}</template>
            </el-table-column>
            <el-table-column
              label="登录ID"
              align="center">
              <template slot-scope="scope">{{ scope.row.id }}</template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center">
              <template slot-scope="scope">
                <el-button type="text">下载</el-button>
                <el-button type="text" style="color: #f56c6c;">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

      </el-container>
    </el-main>
  </el-container>
</template>

<script>
import BreadCrumb from '../Breadcrumb/Breadcrumb'

export default {
  name: 'certificateManage',
  data () {
    return {
      pageLoading: false,
      breadcrumb: ['安全基础管理', '证件管理'],
      dataList: [
        {
          name: '企业卫生许可证',
          type: 'A',
          time: '2019-10-20T14:39:38.000+0000',
          url: '****.doc',
          id: 31231
        }
      ],
      typesB: {A: '卫生', B: '消防'}
    }
  },
  created () {
    // this.getBasicCategory()
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
    clickMenuItem (name, index) {
      if (this.fileTypes[index].active) {
        return
      }
      this.fileTypes.forEach((item) => { item.active = false })
      this.fileTypes[index].active = true
    },
    getBasicCategory () {
      this.pageLoading = true
      // getBasicCategory().then((res) => {
      //   if (res.code === 200) {
      //     console.log(res.data)
      //     let fileTypes = []
      //     res.data.forEach((item) => {
      //       let typeItem = {
      //         name: item.name,
      //         typeStr: item.id,
      //         active: false
      //       }
      //       fileTypes.push(typeItem)
      //     })
      //     this.fileTypes = fileTypes
      //   }
      //   this.pageLoading = false
      // })
    }
  },
  components: {BreadCrumb}
}
</script>

<style scoped lang="scss">
  @import '@/utils/css/style.scss';
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
    width: 100%;
    overflow-y: auto;
    padding: 25px;
    .btn-p{
      text-align: right;
      margin: 0 0 20px 0;
    }
  }
</style>
