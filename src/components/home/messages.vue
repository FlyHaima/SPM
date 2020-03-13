<template>
<div class="message-wrap">
  <el-tabs
    v-model="tabType"
    type="border-card"
    @tab-click='clickTab'>
    <el-tab-pane label="我发布的" name="1">
      <span slot="label"> 我发布的</span>
      <div class="info-panel">
        <div class="info-header">
          <div class="info-link">
            <el-button @click="handleSendMessage" type="primary" size="mini">发布消息</el-button>
            <el-button v-show="messageData.length > 0" @click="batchDeleteHandle" type="danger" size="mini">删除当页消息</el-button>
          </div>
        </div>
        <div class="info-content">
          <div class="tips-nodata" v-if="messageData.length === 0">
            暂无消息
          </div>
          <template v-else>
            <ul class="list-info">
              <li
                v-for="(item, index) in messageData"
                :key="index"
                class="list-info-item list-info-item-light">
                <div class="list-info-title" @click="goDetailsPage(item)">
                  <span class="list-info-txt">
                    <span v-if="item.type" class="list-info-type">
                      [{{item.type}}]
                      <i v-if="item.isRead === '1'" class="badge"></i>
                    </span>
                    {{item.title}}
                  </span>
                </div>
                <div class="list-info-right">
                  <template v-if="item.sendTime">
                    <i class="icon-clock"></i>
                    <span class="list-info-date">{{item.sendTime | date-filter}}</span>
                    <span class="list-info-time">{{item.sendTime | time-filter}}</span>
                  </template>
                  <span class="list-info-user">发布人：{{item.userName}}</span>
                  <i @click="deleteRow(item)" class="el-icon-delete" ></i>
                </div>
              </li>
            </ul>
            <el-pagination
              class="text-right"
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="page.index"
              layout="total, prev, pager, next, jumper"
              :total="page.total">
            </el-pagination>
          </template>
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane label="我收到的" name="2">
      <div class="">
        <div class="info-panel">
          <div v-show="messageData.length > 0" class="info-header">
            <div class="info-link">
              <el-button @click="signReadHandle" type="success" size="mini">标记当页已读</el-button>
              <el-button @click="batchDeleteHandle" type="danger" size="mini">删除当页消息</el-button>
            </div>
          </div>
          <div class="info-content">
            <div class="tips-nodata" v-if="messageData.length === 0">
              暂无消息
            </div>
            <template v-else>
              <ul class="list-info">
                <li
                  @click="goDetailsPage(item)"
                  v-for="(item, index) in messageData"
                  :key="index"
                  class="list-info-item list-info-item-light">
                  <div class="list-info-title">
                    <span class="list-info-txt">
                      <span v-if="item.type" class="list-info-type">
                        [{{item.type}}]
                        <i v-if="item.isRead === '0'" class="badge"></i>
                      </span>
                      {{item.title}}
                    </span>
                  </div>
                  <div class="list-info-right">
                    <i class="icon-clock"></i>
                    <span class="list-info-date">{{item.sendTime | date-filter}}</span>
                    <span class="list-info-time">{{item.sendTime | time-filter}}</span>
                    <span class="list-info-user">发布人：{{item.userName}}</span>
                    <i @click="deleteRow(item)" class="el-icon-delete" ></i>
                  </div>
                </li>
              </ul>
              <el-pagination
                class="text-right"
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page.index"
                layout="total, prev, pager, next, jumper"
                :total="page.total">
              </el-pagination>
            </template>
          </div>
        </div>
      </div>
    </el-tab-pane>
  </el-tabs>
  <el-dialog
    @close="closeDialog('messageForm')"
    :close-on-click-modal="false"
    title="发布消息"
    :visible.sync="dialogFormMessageVisible"
    :width="'800px'">
    <div class="form-modal">
      <el-form
        :model="messageForm"
        ref="messageForm"
        :rules="rulesMessage"
        label-width="100px"
        label-position="right">
        <el-row>
          <el-col :span="14">
            <el-form-item label="标题" prop="title">
              <el-input v-model="messageForm.title"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="消息类型" prop="type">
              <el-select v-model="messageForm.type" placeholder="请选择">
                <el-option
                  v-for="item in infoTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="文本内容" prop="textContent">
          <el-input
            type="textarea"
            maxlength="200"
            show-word-limit
            v-model="messageForm.textContent"></el-input>
        </el-form-item>
        <!--
          an MS Word document : .doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document
          image: image/* [所有图片类型] | image/png, image/jpeg, image/gif
          excel: application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
        -->
        <el-form-item label="附件上传">
          <el-upload
            class="upload-demo"
            action="http://upload-z1.qiniu.com"
            accept=".jpg, .mp4, .doc"
            :data="uploadData"
            :before-upload="handleBeforeUpload"
            :on-success="handleSuccess"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            :limit="3"
            :on-exceed="handleExceed"
            :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip"><span>*</span>仅支持上传 <span>doc、jpg、mp4</span>格式的文件</div>
          </el-upload>
        </el-form-item>
        <el-row>
          <!-- <el-col :span="8">
            <el-form-item label="发送时间">
              <el-input v-model="messageForm.time"></el-input>
            </el-form-item>
          </el-col> -->
          <el-col :span="8">
            <el-form-item label="发布人" prop="userName">
              <el-input v-model="messageForm.userName" disabled=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="推送方式" prop="sendType">
              <el-select v-model="messageForm.sendType" placeholder="请选择推送方式">
                <el-option label="全员推送" value="1"></el-option>
                <el-option label="选择推送" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="推送名单" prop="sendList" v-show="messageForm.sendType === '2'">
          <el-row>
            <el-col :span="21">
              <el-input v-model="messageForm.sendList" :disabled="true"></el-input>
            </el-col>
            <el-col :span="3">
              <el-button
                type="primary"
                @click="treeTransferHandle()"
                class="rt">选择推送</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </div>

    <el-dialog
      :close-on-click-modal="false"
      :title="'选择推送目标'"
      :visible.sync="showTreeTransfer"
      :width="'774px'"
      :show-close="false"
      append-to-body>
      <tree-transfer
        :tree-data="treeData"
        :choose-list="chooseList"></tree-transfer>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmChooseList()">确 定</el-button>
        <el-button @click="showTreeTransfer = false">取 消</el-button>
      </div>
    </el-dialog>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitMessageForm()">发布</el-button>
      <el-button @click="closeDialog('messageForm')">取 消</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import treeTransfer from '../tree-diagram/treeTransfer'
import axios from '@/api/axios'
import moment from 'moment'

export default {
  name: 'messages',
  data () {
    // 校验修改的绑定手机号码
    var validateSendType = (rule, value, callback) => {
      if (this.messageForm.sendType === '2' && value === '') {
        callback(new Error('请选择推送名单'))
      } else {
        callback()
      }
    }
    return {
      submitting: false,
      pageLoading: false,
      upload_qiniu_addr: 'http://file.hljdmkj.com/',
      uploading: false, // upload加载
      uploadData: {
        token: ''
      }, // 上传数据
      fileList: [], // 上传文件列表
      uploadList: [], // 上传文件列表
      dialogFormMessageVisible: false, // 发布消息弹框显示开关
      showTreeTransfer: false, // 树弹框显示开关
      messageData: [], // 信息列表数据
      messageForm: {
        title: '', // 标题
        textContent: '', // 文本内容
        fileList: '', // 附件上传
        userName: '', // 发送人
        // sendTime: '' // 发送时间
        type: '', // 消息类型
        sendType: '', // 推送方式
        sendList: '' // 推送名单列表
      },
      sendDate: '', // 发送日期
      sendTime: '', // 发送时间
      rulesMessage: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { min: 3, max: 25, message: '长度在 3 到 25 个字符', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择消息类型', trigger: 'change' }
        ],
        textContent: [
          { required: true, message: '请输入文本内容', trigger: 'blur' }
        ],
        sendType: [
          { required: true, message: '请选择推动方式', trigger: 'change' }
        ],
        sendList: [
          { validator: validateSendType, trigger: 'change' }
        ]
      },
      page: {
        total: 0, // 总条数
        index: 1, // 当前页面
        pageNo: 1,
        pageSize: 10 // limit
      },
      tabType: '', // tab切换类型
      treeData: [], // 树数据
      chooseList: [], // 已选择的treeData
      infoTypeOptions: [] // 消息类型
    }
  },
  filters: {
    // 格式化日期格式
    'send-time-filter' (value) {
      if (value) {
        return moment(value).format('YYYY-MM-DD  HH: mm: ss')
      } else {
        return null
      }
    },
    // 格式化日期格式
    'date-filter' (value) {
      if (value) {
        return moment(value).format('YYYY-MM-DD')
      } else {
        return null
      }
    },
    // 格式化时间格式
    'time-filter' (value) {
      if (value) {
        return moment(value).format('HH: mm: ss')
      } else {
        return null
      }
    }
  },
  created () {
    let vm = this
    let userName = sessionStorage.getItem('userName')
    // 从路由上存取当前页面的tabType
    vm.tabType = vm.$route.query.tabType
    vm.messageForm.userName = userName
    vm.fetchList()
    vm.fetchTreeData()
    vm.fetchInfoTypeOptions()
  },
  methods: {
    // 关闭弹框
    closeDialog (formName) {
      this.dialogFormMessageVisible = false
      this.$refs[formName].resetFields()
    },
    // 获取消息列表数据
    fetchList () {
      axios
        .get('msg/getMsgList', {
          pageNo: this.page.pageNo,
          pageSize: this.page.pageSize,
          tabType: this.tabType
        })
        .then((res) => {
          if (res.data.code === 200) {
            this.messageData = res.data.data
            this.page.total = res.data.total
          }
        })
    },
    // 获取消息列表数据
    fetchInfoTypeOptions () {
      axios
        .get('msg/getMsgTypeList')
        .then((res) => {
          if (res.data.code === 200) {
            this.infoTypeOptions = res.data.data
          }
        })
    },
    // 切换分页数量
    handleSizeChange (val) {
      this.fetchList()
    },
    // 切换当前页页数
    handleCurrentChange (val) {
      this.page.index = val
      this.page.pageNo = val
      this.fetchList()
    },
    // 删除当页信息
    batchDeleteHandle () {
      let sendData = {
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
        tabType: this.tabType
      }
      this.$confirm('是否删除当页消息？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios
          .post('msg/delBatch', sendData)
          .then((res) => {
            if (res.data.code === 200) {
              this.$notify.success('删除成功')
              this.page.pageNo--
              this.fetchList()
            }
          })
          .finally(() => {
            this.submitting = false
          })
      }).catch(() => {
        this.submitting = false
      })
    },
    // 删除单条数据
    deleteRow (row) {
      let sendData = {
        id: row.id,
        tabType: this.tabType
      }
      axios
        .delete('msg/del', sendData)
        .then((res) => {
          if (res.data.code === 200) {
            this.$notify.success('删除成功')
            this.fetchList()
          }
        })
        .finally(() => {
        })
    },
    // tab切换事件
    clickTab (item) {
      this.tabType = (Number(item.paneName)) + ''
      this.fetchList()
    },
    // 标记当前页已读事件处理
    signReadHandle () {
      let sendData = {
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize
      }
      this.$confirm('是否标记当前页消息为已读？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios
          .post('/msg/signRead', sendData)
          .then((res) => {
            if (res.data.code === 200) {
              this.$notify.success('标记成功')
              this.$store.dispatch('BASE_INFO_SET')
              this.fetchList()
            }
          })
          .finally(() => {
            this.submitting = false
          })
      }).catch(() => {
        this.submitting = false
      })
    },
    // 跳转信息详情页面的点击事件
    goDetailsPage (item) {
      // 跳转页面刷新导航消息的数量显示
      this.$store.dispatch('BASE_INFO_SET')
      // 路由跳转详情页面
      this.$router.push({
        name: 'messagesDetails',
        params: {
          id: item.id
        },
        query: {
          tabType: this.tabType
        }
      })
    },
    // 发布消息
    handleSendMessage () {
      this.dialogFormMessageVisible = true
      Object.keys(this.messageForm).forEach(key => {
        // this.form[key] = ''
        this.messageForm.title = '' // 标题
        this.messageForm.textContent = '' // 文本内容
        this.messageForm.fileList = '' // 附件上传
        this.messageForm.type = '' // 消息类型
        this.messageForm.sendType = '' // 推送方式
        this.messageForm.sendList = '' // 推送名单列表
      })
    },
    // 提交发布消息事件
    submitMessageForm () {
      let vm = this
      this.messageForm.fileList = JSON.stringify(this.uploadList)
      vm.$refs.messageForm.validate((valid) => {
        if (valid) {
          vm.dialogFormMessageVisible = false
          axios
            .post('msg/sendMsg', vm.messageForm)
            .then((res) => {
              vm.submitting = true
              if (res.data.code === 200) {
                vm.$notify.success('发布成功')
                vm.dialogFormMessageVisible = false
                this.$store.dispatch('BASE_INFO_SET')
                vm.fetchList()
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
        } else {
          return false
        }
      })
    },
    handleBeforeUpload (file) {
      this.uploading = true
      const isLt1M = file.size / 1024 / 1024 < 1
      if (!isLt1M) {
        this.$message.error('上传头像图片大小不能超过 1MB!')
        this.uploading = false
      }
      return axios
        .get('user/qinToken')
        .then((res) => {
          this.uploadData.token = res.data
        })
    },
    handleSuccess (response, file, fileList) {
      this.uploadList = []
      fileList.forEach(item => {
        let fItem = {
          name: item.name,
          url: this.upload_qiniu_addr + item.response.key
        }
        this.uploadList.push(fItem)
      })
    },
    handleRemove (file, fileList) {
      this.uploadList = fileList
    },
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    treeTransferHandle () {
      this.showTreeTransfer = true
    },
    // 获取tree数据
    fetchTreeData () {
      axios
        .get('msg/getDeptList')
        .then((res) => {
          if (res.data.code === 200) {
            this.treeData = res.data.data
          }
        })
    },
    confirmChooseList () {
      this.messageForm.sendList = ''
      this.chooseList.forEach(item => {
        this.messageForm.sendList += `${item.nameStr}; `
      })
      this.showTreeTransfer = false
    }
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': 'fetchList'
  },
  components: {
    treeTransfer
  }
}
</script>
<style lang="scss" scoped>
  @import '@/utils/css/tools/_variables.scss';
  .message-wrap{
    width: 100%;
    height: 100%;
    background: #ffffff;
  }
  // 可以提出公用的样式
  .badge{
    display: inline-block;
    background: $colorRed;
    border-radius: 10px;
    min-width: 8px;
    min-height: 8px;
    color: #ffffff;
    font-size: 14px;
    line-height: 14px;
    padding: 3px;
    // &.is-dot{
    // }
  }
   // icon
  .icon-clock{
    display: inline-block;
    color: $colorText;
    position: absolute;
    margin-left: 2px;
    margin-top: 2px;
    width: 15px;
    height: 15px;
    position: relative;
    border: solid 1px currentColor;
    border-radius: 8px;
    &::before{
      content: '';
      position: absolute;
      top: 7px;
      left: 7px;
      width: 5px;
      height: 1px;
      background-color: currentColor;
      -webkit-transform-origin: 0% 0%;
              transform-origin: 0% 0%;
    }
    &::after{
      content: '';
      position: absolute;
      top: 2px;
      left: 7px;
      width: 1px;
      height: 6px;
      background-color: currentColor;
      -webkit-transform-origin: 0% 0%;
              transform-origin: 0% 0%;
    }
  }
  // 页面样式
  .info-panel{
    margin-top: 10px;
  }
  .info-header{
    display: flex;
    justify-content: space-between;
    color: $colorText;
    font-size: 16px;
    padding: 10px 0;
    border-bottom: 1px solid #888888;
  }
  .info-title{
    border-left: 2px solid $colorPrimary;
  }
  .info-title-txt{
    font-size: 16px;
    line-height: 16px;
    margin-left: 10px;
  }
  .info-link-txt{
    line-height: 16px;
    color: $colorText;
  }
  .list-info{
    margin-bottom: 30px;
  }
  .list-info-item{
    display: flex;
    justify-content: space-between;
    position: relative;
    cursor: pointer;
    font-size: 14px;
    padding: 10px 0px 10px 0px;
    border-bottom: 1px solid $colorBorder;
    &.list-info-item-light{
      .list-info-type{
        font-weight: 500;
      }
    }
  }
  .list-info-title{
    position: relative;
    max-width: 370px;
  }
  .list-info-txt{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: $colorText;
  }
  .list-info-type{
    margin-right: 15px;
    position: relative;
    .badge{
      position: absolute;
      top: -3px;
      left: -3px;
    }
  }
  .list-info-date{
    display: inline-block;
    vertical-align: top;
    margin-left: 10px;
  }
  .list-info-time{
    display: inline-block;
    vertical-align: top;
    margin-left: 10px;
  }
  .list-info-user{
    display: inline-block;
    vertical-align: top;
    margin-left: 24px;
  }

  // 修改组件样式
  .el-icon-delete{
    vertical-align: top;
    margin-top: 2px;
    margin-left: 24px;
    color: $colorText;
  }
  .form-modal >>>{
    .el-form{
      // width: 880px;
      margin: 0 auto;
    }
    // .el-input{
    //   // width: 240px;
    // }
  }
</style>
