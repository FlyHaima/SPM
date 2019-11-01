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
                <a class="type-item" :class="item.active ? 'active' : ''" @click="clickMenuItem(item.typeStr, index)">{{item.name}}</a>
              </li>
            </ul>
          </div>
        </el-aside>
        <el-main class="inner-content">
          <div class="container-box">
            <p class="btn-p">
              <el-button size="medium" type="primary"><i class="el-icon-upload2"></i>上传</el-button>
            </p>
            <el-table v-show="showTableA"
                      border
                      stripe
                      :data="dataListA"
                      tooltip-effect="dark"
                      style="width: 100%">
              <el-table-column
                label="文件名"
                align="center">
                <template slot-scope="scope">{{ scope.row.name }}</template>
              </el-table-column>
              <el-table-column
                label="文档类型"
                align="center">
                <template slot-scope="scope">{{ fileTypesA[scope.row.fileType] }}</template>
              </el-table-column>
              <el-table-column
                label="类型"
                align="center">
                <template slot-scope="scope">{{ typesA[scope.row.type] }}</template>
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
                  <el-button type="text">下载</el-button>
                  <el-button type="text" style="color: #f56c6c;">删除</el-button>
                </template>
              </el-table-column>
            </el-table>

            <el-table v-show="!showTableA"
                      border
                      stripe
                      :data="dataListB"
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
        </el-main>
      </el-container>
    </el-main>
  </el-container>
</template>

<script>
import BreadCrumb from '../Breadcrumb/Breadcrumb'
import TreeDiagram from '../tree-diagram/treeDiagram'

export default {
  name: 'basicData',
  data () {
    return {
      pageLoading: false,
      breadcrumb: ['风险辨识评估', '制度建设'],
      showTableA: true,
      fileTypes: [
        {
          name: '全部文件',
          typeStr: 'all',
          active: true
        }, {
          name: '公司内相关制度',
          typeStr: 'A-1',
          active: false
        }, {
          name: '说明书，流程图',
          typeStr: 'B-1',
          active: false
        }, {
          name: '规程方案',
          typeStr: 'C-1',
          active: false
        }, {
          name: '理化性质说明书',
          typeStr: 'D-1',
          active: false
        }, {
          name: '相关事故管理',
          typeStr: 'E-2',
          active: false
        }, {
          name: '平面图',
          typeStr: 'F-2',
          active: false
        }, {
          name: '证件管理',
          typeStr: 'F-4',
          active: false
        }
      ],
      dataListA: [
        {
          name: '风险辨识清单--评估报告A23-01',
          fileType: 'doc',
          type: 'A',
          time: '2019-10-20T14:39:38.000+0000',
          url: '****.doc',
          id: 31231
        }, {
          name: '风险辨识清单--评估报告A23-01',
          fileType: 'doc',
          type: 'A',
          time: '2019-10-20T14:39:38.000+0000',
          url: '****.doc',
          id: 31231
        }
      ],
      dataListB: [
        {
          name: '企业卫生许可证',
          type: 'A',
          time: '2019-10-20T14:39:38.000+0000',
          url: '****.doc',
          id: 31231
        }
      ],
      fileTypesA: {doc: '文本', img: '图片', video: '视频'},
      typesA: {A: '国家安全规范', B: '行业安全规范', C: '公司内部安全规范'},
      typesB: {A: '卫生', B: '消防'}
    }
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
    clickMenuItem (type, index) {
      if (this.fileTypes[index].active) {
        return
      }
      this.fileTypes.forEach((item) => { item.active = false })
      this.fileTypes[index].active = true
      // change table data
      if (type === 'F-4') {
        this.showTableA = false
      } else {
        this.showTableA = true
      }
    }
  },
  components: {TreeDiagram, BreadCrumb}
}
</script>

<style scoped lang="scss">
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
</style>
