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
                <a class="type-item" :class="item.active ? 'active' : ''" @click="clickMenuItem(item.name, index)">{{item.name}}</a>
              </li>
            </ul>
          </div>
        </el-aside>
        <el-main class="inner-content">
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
                label="文件名"
                align="center">
                <template slot-scope="scope">{{ scope.row.fileName }}</template>
              </el-table-column>
              <el-table-column
                label="文档类型"
                align="center">
                <template slot-scope="scope">{{ allTypes[scope.row.fileType] }}</template>
              </el-table-column>
              <el-table-column
                label="类型"
                align="center">
                <template slot-scope="scope">{{ documentType[currentTypeId][scope.row.category] }}</template>
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
                  <el-button type="text" @click="download(scope.row.path)">下载</el-button>
                  <el-button type="text" @click="deleteItem(scope.row.id)" style="color: #f56c6c;">删除</el-button>
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
// import {getBasicCategory, getBasicList, delBasicFile} from '@/api/organization'

export default {
  name: 'hardDisk',
  data () {
    return {
      pageLoading: false,
      breadcrumb: ['安全基础管理', '本机硬盘'],
      showTableA: true,
      fileTypes: [],
      currentTypeId: '1',
      dataList: [],
      allTypes: {doc: '文本', img: '图片', video: '视频'},
      typesA: {A: '国家安全规范', B: '行业安全规范', C: '公司内部安全规范'},
      documentType: {
        '1': { // 相关制度
          '1': '规章制度',
          '2': '责任制度'
        },
        '2': { // 说明书、流程图
          '1': '产品说明书',
          '2': '操作说明书',
          '3': '工艺流程图',
          '4': '业务流程图',
          '5': '施工流程图',
          '6': '化工流程图'
        },
        '3': { // 规程方案
          '1': '商业规程方案',
          '2': '项目规程方案',
          '3': '总体规程方案',
          '4': '设计规程方案'
        },
        '4': { // 理化性质说明书
          '1': '原料理化性质说明书',
          '2': '产品理化性质说明书'
        },
        '5': { // 相关事故案例
          '1': '特别重大事故',
          '2': '重大事故',
          '3': '较大事故',
          '4': '一般事故'
        },
        '6': { // 平面图
          '1': '企业平面图',
          '2': '生产车间平面图',
          '3': '办公区域平面图',
          '4': '生活区域平面图'
        }
      },
      pageData: {
        pageSize: 10,
        pageNo: 1,
        total: 0
      }
    }
  },
  created () {
    // this.getBasicCategory(true)
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
      // console.log(this.fileTypes[index].typeStr)
      let vm = this
      if (vm.currentTypeId !== vm.fileTypes[index].typeStr) {
        // 当不同type，分页信息归零
        vm.pageData = {
          pageSize: 10,
          pageNo: 1,
          total: 0
        }
      }
      vm.currentTypeId = vm.fileTypes[index].typeStr

      vm.getTable()
      if (vm.fileTypes[index].active) {
        return
      }
      vm.fileTypes.forEach((item) => { item.active = false })
      vm.fileTypes[index].active = true
    },
    // getBasicCategory (create) {
    //   this.pageLoading = true
    //   getBasicCategory().then((res) => {
    //     if (res.code === 200) {
    //       let fileTypes = []
    //       res.data.forEach((item) => {
    //         let typeItem = {
    //           name: item.name,
    //           typeStr: item.id,
    //           active: false
    //         }
    //         fileTypes.push(typeItem)
    //       })
    //       this.fileTypes = fileTypes
    //       if (create) {
    //         this.fileTypes[0].active = true
    //         this.getTable()
    //       }
    //     }
    //     this.pageLoading = false
    //   })
    // },
    getTable () {
    //   let vm = this
    //   vm.pageLoading = true
    //   getBasicList(vm.currentTypeId, vm.pageData.pageNo, vm.pageData.pageSize).then((res) => {
    //     if (res.code === 200) {
    //       vm.dataList = res.data
    //       vm.pageData.total = res.total
    //     }
    //     vm.pageLoading = false
    //   })
    },
    download (path) {},
    deleteItem (id) {
      // this.$confirm('确定移除选中项?', '删除', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   this.pageLoading = true
      //   let data = {id: id}
      //   delBasicFile(data).then((res) => {
      //     if (res.code === 200) {
      //       this.$message({
      //         type: 'success',
      //         message: '删除成功!'
      //       })
      //       this.pageData.pageNo = 1
      //       this.getConstructionList()
      //     }
      //   })
      // }).catch(() => {
      //   this.$message({
      //     type: 'info',
      //     message: '已取消删除'
      //   })
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
