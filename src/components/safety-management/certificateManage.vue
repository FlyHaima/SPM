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
            <el-button size="medium" type="primary" @click="openUpload()" v-if="fucBtns.includes('upload-btn')"> <!-- 权限显示 -->
              <i class="el-icon-upload2 upload-btn"></i>上传
            </el-button>
          </p>

          <el-dialog title="上传" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false"
                     :visible.sync="dialogVisible"
                     v-loading="dialogLoading"
                     width="580px" :append-to-body="true">
            <el-form ref="form" label-width="85px">
              <el-form-item label="证件名称：">
                <el-input v-model.trim="addData.documentName"></el-input>
              </el-form-item>
              <el-form-item label="证件种类：">
                <el-select v-model="addData.fileCategory">
                  <el-option v-for="(item, index) in fileCategory"
                             :key="index"
                             :label="item"
                             :value="item"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="上传证件：">
                <el-upload
                  class="upload-demo"
                  :action="baseUrl"
                  :data="uploadData"
                  :limit="1"
                  :before-upload="handleBeforeUpload"
                  :on-success="handleSuccess"
                  :on-remove="handleRemove"
                  :file-list="fileList">
                  <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
              </el-form-item>
            </el-form>
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
              label="证件名称"
              align="center">
              <template slot-scope="scope">{{ scope.row.documentName }}</template>
            </el-table-column>
            <el-table-column
              label="证件种类"
              align="center">
              <template slot-scope="scope">{{ scope.row.documentType }}</template>
            </el-table-column>
<!--            <el-table-column-->
<!--              label="证件有效截止日期"-->
<!--              align="center">-->
<!--              <template slot-scope="scope">{{ formatTime(scope.row.expiryDate) }}</template>-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--              label="登录ID"-->
<!--              align="center">-->
<!--              <template slot-scope="scope">{{ scope.row.id }}</template>-->
<!--            </el-table-column>-->
            <el-table-column
              fixed="right"
              label="操作"
              align="center">
              <template slot-scope="scope"> <!-- 权限显示 -->
                <a target="_blank" :href="`${scope.row.path}?attname=${scope.row.documentName}.${scope.row.category}`" style="margin-right: 8px;" v-if="fucBtns.includes('down-btn')">下载</a>
                <el-button type="text" @click="deleteItem(scope.row)" v-if="fucBtns.includes('del-btn')">删除</el-button>
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
import {getDocumentList, delDocument, addDocument} from '@/api/organization'
import base from '@/api/baseUrl'
import {getQiNiuToken} from '@/api/upload'
import axios from '@/api/axios'

export default {
  name: 'certificateManage',
  data () {
    return {
      pageLoading: false,
      breadcrumb: ['安全基础管理', '证件管理'],
      dataList: [],
      dialogVisible: false,
      dialogLoading: false,
      baseUrl: '',
      fileAddress: '',
      uploadData: {
        token: ''
      },
      addData: {
        documentName: '',
        fileCategory: '',
        url: '',
        fileName: '',
        size: 0
      },
      fileList: [],
      fileCategory: ['通用型', '行业型', '认证型'],
      fucBtns: []
    }
  },
  created () {
    this.baseUrl = base.uploadQiniuAdr
    this.fileAddress = base.fileQiniuAddr
    this.getTableData()
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
    getTableData () {
      this.pageLoading = true
      let userId = sessionStorage.getItem('userId')
      getDocumentList(userId).then(res => {
        if (res.code === 200) {
          this.dataList = res.data
        }
        this.pageLoading = false
      })
    },
    openUpload () {
      this.dialogVisible = true
    },
    closeDialog () {
      this.dialogVisible = false
      this.fileList = []
    },
    confirmAdd () {
      let vm = this
      if (!vm.addData.documentName) {
        vm.$message({
          message: '请填写文件名',
          type: 'warning'
        })
        return
      } else if (!vm.addData.fileCategory) {
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
        documentName: vm.addData.documentName,
        documentType: vm.addData.fileCategory,
        size: vm.addData.size,
        path: vm.addData.url,
        fileName: vm.addData.fileName
      }
      addDocument(postData).then(res => {
        vm.dialogLoading = false
        if (res.code === 200) {
          vm.$message({
            type: 'success',
            message: '添加成功'
          })
          vm.getTableData()
        }
        vm.fileList = []
        vm.addData = {
          documentName: '',
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
      this.addData.url = this.fileAddress + fileList[0].response.key
      this.addData.size = fileList[0].size
      this.addData.fileName = fileList[0].name
    },
    handleRemove (file, fileList) {
      this.addData.url = ''
      this.addData.size = 0
    },
    deleteItem (d) {
      console.log(111)
      this.$confirm('确定移除选中项?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.pageLoading = true
        let data = {id: d.id}
        delDocument(data).then((res) => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getTableData()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 获取按钮权限方法
    getBtnAuthority () {
      const authId = {authId: '2-5'}
      axios
        .get('user/getBtnArray', authId)
        .then((res) => {
          if (res.data.code === 200) {
            this.fucBtns = res.data.data.functionBtns
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
    width: 100%;
    overflow-y: auto;
    padding: 25px;
    .btn-p{
      text-align: right;
      margin: 0 0 20px 0;
    }
  }
</style>
