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
              <!-- 权限显示 -->
              <el-button size="medium" type="primary" @click="addDate" class="function-btn upload-btn" v-if="fucBtns.includes('upload-btn')"><i class="el-icon-upload2"></i>上传</el-button>
            </p>

            <el-dialog title="上传" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false"
                       :visible.sync="dialogVisible"
                       v-loading="dialogLoading"
                       width="580px" :append-to-body="true">
              <p style="margin-top: 10px; line-height: 22px;">
                <span style="margin-right: 12px;">类型：</span>
                <el-select v-model="addData.fileCategory">
                  <el-option v-for="(item, index) in documentType[currentTypeId]"
                             :key="index"
                             :label="item"
                             :value="item"></el-option>
                </el-select>
              </p>
              <p style="margin-top: 10px; line-height: 22px;">
                通用模板：
              </p>
              <el-upload
                class="upload-demo"
                :action="baseUrl"
                :data="uploadData"
                :limit="1"
                accept=".xls"
                :before-upload="handleBeforeUpload"
                :on-success="handleSuccess"
                :on-remove="handleRemove"
                :file-list="fileList">
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
              <span slot="footer" class="dialog-footer">
                <el-button @click="closeDialog()">取 消</el-button>
                <el-button type="primary" @click="confirmAdd()">确 定</el-button>
              </span>
            </el-dialog>

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
                <template slot-scope="scope">{{ scope.row.category }}</template>
              </el-table-column>
              <el-table-column
                label="类型"
                align="center">
                <template slot-scope="scope">{{ scope.row.fileCategory }}</template>
              </el-table-column>
              <el-table-column
                label="时间"
                align="center">
                <template slot-scope="scope">{{ formatTime(scope.row.time) }}</template>
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                align="center">
                <template slot-scope="scope"> <!-- 权限显示 -->
                  <a type="text" :href="`${scope.row.path}?attname=${scope.row.fileName}`" v-if="fucBtns.includes('down-btn')">下载</a>
                  <el-button type="text" @click="deleteItem(scope.row.id)" style="color: #f56c6c; margin-left: 8px;" v-if="fucBtns.includes('del-btn')">删除</el-button>
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
import {getBasicCategory, getBasicList, delBasicFile, addBasicFile} from '@/api/organization'
import base from '@/api/baseUrl'
import {getQiNiuToken} from '@/api/upload'
import axios from '@/api/axios'

export default {
  name: 'basicData',
  data () {
    return {
      pageLoading: false,
      breadcrumb: ['安全基础管理', '基础资料'],
      showTableA: true,
      fileTypes: [],
      currentTypeId: '1',
      dataList: [],
      documentType: {
        '1': ['规章制度', '责任制度'], // 相关制度
        '2': ['产品说明书', '操作说明书', '工艺流程图', '业务流程图', '施工流程图', '化工流程图'], // 说明书、流程图
        '3': ['商业规程方案', '项目规程方案', '总体规程方案', '设计规程方案'], // 规程方案,
        '4': ['原料理化性质说明书', '产品理化性质说明书'], // 理化性质说明书
        '5': ['特别重大事故', '重大事故', '较大事故', '一般事故'], // 相关事故案例
        '6': ['企业平面图', '生产车间平面图', '办公区域平面图', '生活区域平面图'] // 平面图
      },
      pageData: {
        pageSize: 10,
        pageNo: 1,
        total: 0
      },
      dialogVisible: false,
      dialogLoading: false,
      baseUrl: '',
      fileAddress: '',
      uploadData: {
        token: ''
      },
      addData: {
        fileCategory: '',
        url: '',
        fileName: '',
        size: 0
      },
      fileList: [],
      fucBtns: []
    }
  },
  created () {
    this.baseUrl = base.uploadQiniuAdr
    this.fileAddress = base.fileQiniuAddr
    this.getBasicCategory(true)
    this.getBtnAuthority()
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
    getBasicCategory (create) {
      this.pageLoading = true
      getBasicCategory().then((res) => {
        if (res.code === 200) {
          let fileTypes = []
          res.data.forEach((item) => {
            let typeItem = {
              name: item.name,
              typeStr: item.id,
              active: false
            }
            fileTypes.push(typeItem)
          })
          this.fileTypes = fileTypes
          if (create) {
            this.fileTypes[0].active = true
            this.getTable()
          }
        }
        this.pageLoading = false
      })
    },
    getTable () {
      let vm = this
      vm.pageLoading = true
      getBasicList(vm.currentTypeId, vm.pageData.pageNo, vm.pageData.pageSize).then((res) => {
        if (res.code === 200) {
          vm.dataList = res.data
          vm.pageData.total = res.total
        }
        vm.pageLoading = false
      })
    },
    deleteItem (id) {
      this.$confirm('确定移除选中项?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.pageLoading = true
        let data = {id: id}
        delBasicFile(data).then((res) => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.pageData.pageNo = 1
            this.getTable()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    addDate () {
      let vm = this
      vm.dialogVisible = true
    },
    closeDialog () {
      this.dialogVisible = false
      this.fileList = []
    },
    confirmAdd () {
      let vm = this
      if (!vm.addData.fileCategory) {
        vm.$message({
          message: '请选择类型',
          type: 'warning'
        })
        return
      } else if (vm.fileList.length === 0) {
        vm.$message({
          message: '文件不能为空',
          type: 'warning'
        })
        return
      }
      vm.dialogLoading = true
      let postData = {
        basicCategoryId: vm.currentTypeId,
        fileName: vm.addData.fileName,
        fileCategory: vm.addData.fileCategory,
        size: vm.addData.size,
        path: vm.addData.url
      }
      addBasicFile(postData).then(res => {
        vm.dialogLoading = false
        if (res.code === 200) {
          vm.$message({
            type: 'success',
            message: '添加成功'
          })
          vm.getTable()
        }
        vm.fileList = []
        vm.addData = {
          fileCategory: '',
          url: '',
          fileName: '',
          size: 0
        }
      })
      vm.dialogVisible = false
    },
    handleBeforeUpload (file) {
      return getQiNiuToken().then((res) => {
        this.uploadData.token = res
      })
    },
    handleSuccess (response, file, fileList) {
      this.fileList = fileList
      console.log(this.fileList)
      this.addData.url = this.fileAddress + fileList[0].response.key
      this.addData.fileName = file.name
      this.addData.size = fileList[0].size
    },
    handleRemove (file, fileList) {
      this.addData.url = ''
      this.addData.fileName = ''
      this.addData.size = 0
    },
    // 获取按钮权限方法
    getBtnAuthority () {
      const authId = {authId: '2-4'}
      axios
        .get('user/getBtnArray', authId)
        .then((res) => {
          if (res.data.code === 200) {
            console.log(res.data)
            this.fucBtns = res.data.data.functionBtns
            console.log(this.fucBtns)
          } else {
            this.$message({
              message: res.data.message,
              type: 'warning'
            })
          }
        })
    }
  },
  components: {BreadCrumb}
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
  .pages{
    margin-top: 28px;
    text-align: right;
  }
</style>
