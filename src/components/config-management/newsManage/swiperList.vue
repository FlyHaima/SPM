<template>
  <div class="container-box">
    <div class="content-tools">
      <div class="tools-right">
        <el-button
          type="primary"
          size="medium"
          icon="el-icon-plus"
          @click="addHandle">
          添加</el-button>
      </div>
    </div>
    <el-table
      row-key="id"
      border
      stripe
      :data="tableDataSwiper"
      tooltip-effect="dark"
      style="width: 100%"
      v-loading="pageLoading">
      <el-table-column
        type="index"
        label="ID"
        align="center">
      </el-table-column>
      <el-table-column
        label="图片"
        align="center">
        <template slot-scope="scope">
          <img class="table-img" :src="scope.row.picUrl" title="img"/>
        </template>
      </el-table-column>
      <el-table-column
        prop="url"
        label="链接地址"
        align="center">
      </el-table-column>
      <el-table-column
        label="显示位置"
        align="center">
        <template slot-scope="scope">
          {{scope.row.type | display-position-filter}}
        </template>
      </el-table-column>
      <el-table-column
        prop="picName"
        label="标题名称"
        align="center">
      </el-table-column>
      <el-table-column
        prop="orderNo"
        label="排序"
        align="center">
      </el-table-column>
      <el-table-column
        label="操作"
        align="center">
        <template slot-scope="scope">
          <a
            href="javascript:;"
            class="color-primary"
            @click="editHandle(scope.row)">编辑
          </a>
          <a
            href="javascript:;"
            class="color-danger talbe-links-del"
            @click="delRowHandle(scope.row)">删除
          </a>
        </template>
      </el-table-column>
    </el-table>
     <el-dialog
      :visible.sync="dialogAddSwiperVisible"
      :width="'600px'"
      :show-close="false"
      v-loading="submitting">
      <div slot="title">
        {{typeof editData !== 'undefined' && editData !== '' ? '编辑' : '添加' }}
      </div>
      <div class="form-modal">
        <el-form
          :model="swiperForm"
          ref="swiperForm"
          label-width="100px"
          label-position="right">
          <el-form-item label="标题名称" prop="picName">
            <el-input v-model="swiperForm.picName"></el-input>
          </el-form-item>
          <el-form-item label="链接地址" prop="url">
            <el-input v-model="swiperForm.url"></el-input>
          </el-form-item>
          <el-form-item
            v-show="this.editData"
            label="排序"
            prop="orderNo">
            <el-input v-model="swiperForm.orderNo"></el-input>
          </el-form-item>
          <el-form-item label="显示位置" prop="type">
            <el-select v-model="swiperForm.type" placeholder="请选择">
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <!--
            an MS Word document : .doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document
            image: image/* [所有图片类型] | image/png, image/jpeg, image/gif
            excel: application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
          -->
          <el-form-item label="附件上传">
            <el-upload
              action="http://upload-z1.qiniu.com"
              list-type="picture-card"
              :before-upload="handleBeforeUpload"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :data="uploadData"
              :limit="1"
              ref="upload"
              :file-list="fileList">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-loading="submitting" @click="submitSwiperForm()">确定</el-button>
        <el-button @click="dialogAddSwiperVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from '@/api/axios'
import qs from 'qs'
import { DISPLAY_POSITION_LIST } from '@/constants/status'
import { DisplayPositionFilter } from '@/filters/status'
export default {
  name: 'swiperList',
  data () {
    return {
      pageLoading: false,
      submitting: false,
      typeOptions: DISPLAY_POSITION_LIST,
      editData: '',
      upload_qiniu_addr: 'http://file.hljdmkj.com/',
      uploading: false, // upload加载
      uploadData: {
        token: ''
      }, // 上传数据
      fileList: [],
      dialogAddSwiperVisible: false,
      dialogImageUrl: '',
      dialogVisible: false,
      swiperForm: {
        picUrl: ''
      },
      tableDataSwiper: [] // 轮播图列表数据
    }
  },
  filters: {
    'display-position-filter': DisplayPositionFilter
  },
  created () {
    this.fetchSwiperListData()
  },
  methods: {
    // 获取轮播图列表数据
    fetchSwiperListData () {
      axios
        .get('news/getNewsPicList')
        .then((res) => {
          this.pageLoading = true
          if (res.data.code === 200) {
            this.tableDataSwiper = res.data.data
          }
        })
        .finally(() => {
          this.pageLoading = false
        })
    },
    // 添加轮播图事件
    addHandle () {
      this.dialogAddSwiperVisible = true
      this.editData = ''
      this.$refs.upload.clearFiles()
      // 清空表单编辑后的值
      Object.keys(this.swiperForm).forEach(key => {
        this.swiperForm[key] = ''
      })
    },
    // 添加轮播图事件
    saveForm (post, tip) {
      let vm = this
      vm
        .$confirm(`确定【${tip}】轮播图吗？`, '提示', {
          type: 'warning'
        })
        .then(() => {
          vm.submitting = true
          axios
            .post(`news/${post}NewsPic`, vm.swiperForm)
            .then((res) => {
              vm.submitting = true
              if (res.data.code === 200) {
                vm.$notify.success(tip + '成功')
                vm.dialogAddSwiperVisible = false
                vm.fetchSwiperListData()
              } else {
                vm.$message({
                  message: res.data.message,
                  type: 'warning'
                })
              }
            })
            .finally(() => {
              vm.submitting = false
            })
        })
        .catch(() => {})
    },
    submitSwiperForm () {
      this.$refs.swiperForm.validate((valid) => {
        if (valid) {
          if (this.editData) {
            this.saveForm('update', '编辑')
          } else {
            this.saveForm('add', '添加')
          }
        } else {
          return false
        }
      })
    },
    // 编辑
    editHandle (row) {
      this.dialogAddSwiperVisible = true
      this.editData = row.id
      this.$refs.upload.clearFiles()
      this.initForm(this.editData)
    },
    // 编辑状态，回显数据
    initForm (data) {
      this.submitting = true
      if (data) {
        axios
          .get('news/getOneNewsPic', {
            id: data
          })
          .then((res) => {
            if (res.data.code === 200) {
              this.swiperForm = res.data.data
            }
          })
          .finally(() => {
            this.submitting = false
          })
      }
    },
    // 删除事件
    delRowHandle (row) {
      let sendData = {
        id: row.id
      }
      axios
        .post('news/delNewsPic', qs.stringify(sendData), { 'content-type': 'application/x-www-form-urlencoded' })
        .then((res) => {
          if (res.data.code === 200) {
            this.$notify.success('删除成功')
            this.fetchSwiperListData()
          }
        })
        .finally(() => {
        })
    },
    // 上传图片前事件
    handleBeforeUpload (file) {
      this.uploading = true
      // let token = sessionStorage.getItem('token')
      return axios
        .get('user/qinToken')
        .then((res) => {
          this.uploadData.token = res.data
        })
    },
    // 删除上传的图片事件
    handleRemove (file, fileList) {
      // this.fileList = fileList
    },
    // 图片上传成功后事件
    handleSuccess (response, file, fileList) {
      this.swiperForm.picUrl = this.upload_qiniu_addr + file.response.key
    },
    // 预览图片功能
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    }
  },
  components: {
  }
}
</script>

<style scoped lang="scss">
.talbe-links-del{
  margin-left: 20px;
}
.table-img{
  width: 62px;
  height: 53px;
}
</style>
