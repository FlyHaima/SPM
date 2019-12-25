<template>
  <el-container class="inner-page-container" v-loading="pageLoading">
    <el-header class="inner-header">
      <bread-crumb :breadList="breadcrumb">
      </bread-crumb>
    </el-header>
    <el-main class="inner-main-container">
      <p class="btn-p">
        <el-button size="medium" type="primary" @click="addDate"><i class="el-icon-plus" style="margin-right: 5px"></i>新增</el-button>
      </p>

      <el-dialog title="新增" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false"
                 :visible.sync="dialogVisible"
                 v-loading="dialogLoading"
                 width="580px" :append-to-body="true">
        <p style="margin-top: 10px; line-height: 22px;">所属行业：<el-input v-model="addData.industry"></el-input></p>
        <p style="margin-top: 10px; line-height: 22px;">通用模板：</p>
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
          <div slot="tip" class="el-upload__tip">只能上传excel文件，.xls格式文件</div>
        </el-upload>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmAdd()">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog title="编辑" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false"
                 :visible.sync="editorVisible"
                 v-loading="editorLoading"
                 width="580px" :append-to-body="true">
        <p style="margin-top: 10px; line-height: 22px;">所属行业：<el-input v-model="editData.industry"></el-input></p>
        <p style="margin-top: 10px; line-height: 22px;">通用模板：</p>
        <el-upload
          class="upload-demo"
          :action="baseUrl"
          :data="uploadData"
          :limit="1"
          accept=".xls"
          :before-upload="handleBeforeUpload"
          :on-success="handleEditSuccess"
          :on-remove="handleEditRemove"
          :file-list="editFileList">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传excel文件，.xls格式文件</div>
        </el-upload>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeEditor()">取 消</el-button>
          <el-button type="primary" @click="confirmEdit()">确 定</el-button>
        </span>
      </el-dialog>

      <el-table ref="downloadTable"
                border
                stripe
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%">
        <el-table-column
          label="序号"
          width="190"
          align="center"
          type="index">
        </el-table-column>
        <el-table-column
          label="所属行业"
          align="center">
          <template slot-scope="scope">{{ scope.row.industry }}</template>
        </el-table-column>
        <el-table-column
          label="模板文件"
          align="center">
          <template slot-scope="scope">{{ scope.row.fileName }}</template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="190"
          align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="editItem(scope.row)">编辑</el-button>
            <el-button type="text" @click="deleteItem(scope.row)">删除</el-button>
            <a :href="scope.row.url + '?attname=' + scope.row.fileName" target="_blank" style="margin-left: 10px;">下载</a>
          </template>
        </el-table-column>
      </el-table>

      <div class="pages" v-if="pageData.total > 10">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="pageData.total"
          :page-size="pageData.pageSize"
          :current-page.sync="pageData.currentPageNo"
          @current-change="handlePage">
        </el-pagination>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import BreadCrumb from '../Breadcrumb/Breadcrumb'
import {getBdataList, addBdata, delBdata, updataBdata} from '@/api/riskia'
import base from '@/api/baseUrl'
import {getQiNiuToken} from '@/api/upload'

export default {
  name: 'systemData',
  data () {
    return {
      pageLoading: false,
      baseUrl: '',
      fileAddress: '',
      uploadData: {
        token: ''
      },
      breadcrumb: ['风险辨识评估', '系统大数据'],
      dialogVisible: false,
      dialogLoading: false,
      addData: {
        industry: '',
        url: '',
        fileName: ''
      },
      fileList: [],
      tableData: [],
      pageData: {
        total: 0,
        pageSize: 10,
        currentPageNo: 1
      },
      editorVisible: false,
      editorLoading: false,
      editFileList: [],
      editData: {
        id: '',
        industry: '',
        url: '',
        fileName: ''
      }
    }
  },
  created () {
    this.baseUrl = base.uploadQiniuAdr
    this.fileAddress = base.fileQiniuAddr
    this.getTable()
  },
  methods: {
    download (id) {},
    getTable () {
      let vm = this
      vm.pageLoading = true
      getBdataList(this.pageData.currentPageNo, 10).then(res => {
        if (res.code === 200) {
          vm.tableData = res.data
          vm.pageData.total = res.total
        }
        vm.pageLoading = false
      })
    },
    handlePage (val) {
      this.pageData.currentPageNo = val
      this.getTable()
    },
    addDate () {
      let vm = this
      vm.dialogVisible = true
    },
    confirmAdd () {
      let vm = this
      if (!vm.addData.industry) {
        vm.$message({
          message: '请填写所属行业名称',
          type: 'warning'
        })
        return
      } else if (!vm.addData.url) {
        vm.$message({
          message: '模板必须上传',
          type: 'warning'
        })
        return
      }
      addBdata(vm.addData).then(res => {
        if (res.code === 200) {
          vm.$message({
            type: 'success',
            message: '添加成功'
          })
          vm.getTable()
        }
        vm.fileList = []
        vm.addData = {
          industry: '',
          url: '',
          fileName: ''
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
      this.addData.fileName = file.name
    },
    handleRemove (file, fileList) {
      this.addData.url = ''
      this.addData.fileName = ''
    },
    handleEditSuccess (response, file, fileList) {
      this.editFileList = fileList
      this.editData.url = this.fileAddress + fileList[0].response.key
      this.editData.fileName = file.name
    },
    handleEditRemove (file, fileList) {
      this.editData.url = ''
    },
    closeEditor () {
      this.editFileList = []
      this.editorVisible = false
    },
    editItem (d) {
      console.log(d)
      let vm = this
      vm.editorVisible = true
      vm.editData = {
        id: d.id,
        industry: d.industry,
        url: d.url,
        fileName: d.fileName
      }
      vm.editFileList = [
        {
          name: d.fileName ? d.fileName : '',
          url: d.url ? d.url : ''
        }
      ]
    },
    confirmEdit () {
      let vm = this
      vm.editorLoading = true
      if (!vm.editData.industry) {
        vm.$message({
          message: '请填写所属行业名称',
          type: 'warning'
        })
        return
      } else if (!vm.editData.url) {
        vm.$message({
          message: '模板必须上传',
          type: 'warning'
        })
        return
      }
      updataBdata(vm.editData).then(res => {
        if (res.code === 200) {
          vm.$message({
            type: 'success',
            message: '添加成功'
          })
          vm.getTable()
        }
        vm.editorLoading = false
        vm.editFileList = []
        vm.editData = {
          id: '',
          industry: '',
          url: '',
          fileName: ''
        }
      })
      vm.editorVisible = false
    },
    deleteItem (d) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let postData = {
          id: d.id
        }
        delBdata(postData).then(res => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          } else {
            this.$message({
              type: 'warning',
              message: '删除失败，请稍后重试'
            })
          }
          this.getTable()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  },
  components: {BreadCrumb}
}
</script>

<style lang="scss" scoped>
@import '@/utils/css/style.scss';
.inner-page-container {
  height: 100%;
  .el-main{
    padding: 0;
    width: 100%;
    height: 100%;
    background: #fff;
    padding: 25px;
    .btn-p{
      text-align: right;padding-bottom: 25px;
      .el-icon-upload2{
        margin-right: 4px;
      }
    }
    .pages{
      margin-top: 20px;
      text-align: right;
    }
  }
}
</style>
