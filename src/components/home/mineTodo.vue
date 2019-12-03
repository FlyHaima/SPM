<template>
<div class="message-wrap">
  <el-tabs
    type="border-card"
    @tab-click='clickTab'>
    <el-tab-pane label="我发布的">
      <span slot="label"> 我发布的<span class="badge">18</span></span>
      <div class="">
        <div class="info-panel">
          <div class="info-header">
            <!-- <div class="info-title">
              <span class="info-title-txt">所有消息</span>
            </div> -->
            <div class="info-link">
              <el-button @click="handleSendMessage" type="primary" size="mini">发布消息</el-button>
              <el-button @click="batchDeleteHandle" type="danger" size="mini">删除当页消息</el-button>
            </div>
          </div>
          <!-- <div class="info-header">
            <div class="info-title">
              <span class="info-title-txt">待办事项</span>
            </div>
            <div class="info-link">
              <el-button type="danger" size="mini">标记当页已处理</el-button>
            </div>
          </div> -->
          <div class="info-content">
            <ul class="list-info">
              <li
                v-for="(item, index) in messageData"
                :key="index"
                @click="goDetailsPage(item)"
                class="list-info-item list-info-item-light">
                <div class="list-info-title">
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
          </div>
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane label="我收到的">
      <div class="">
        <div class="info-panel">
          <div class="info-header">
            <div class="info-link">
              <el-button @click="signReadHandle" type="success" size="mini">标记当页已读</el-button>
              <el-button @click="batchDeleteHandle" type="danger" size="mini">删除当页消息</el-button>
            </div>
          </div>
          <div class="info-content">
            <ul class="list-info">
              <li
                @click="goDetailsPage"
                v-for="(item, index) in messageData"
                :key="index"
                class="list-info-item list-info-item-light">
                <div class="list-info-title">
                  <span class="list-info-txt">
                    <span class="list-info-type">
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
          </div>
        </div>
      </div>
    </el-tab-pane>
  </el-tabs>
  <el-dialog
    title="发布消息"
    :visible.sync="dialogFormMessageVisible"
    :width="'1000px'"
    :show-close="false">
    <div class="form-modal">
      <el-form
        :model="messageForm"
        ref="messageForm"
        :rules="rulesMessage"
        label-width="100px"
        label-position="right">
        <el-form-item label="标题">
          <el-input v-model="messageForm.title"></el-input>
        </el-form-item>
        <el-form-item label="文本内容">
          <el-input type="textarea" maxlength="200" show-word-limit v-model="messageForm.textContent"></el-input>
        </el-form-item>
        <el-form-item label="附件上传">
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            :limit="3"
            :on-exceed="handleExceed"
            :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-row>
          <!-- <el-col :span="8">
            <el-form-item label="发送时间">
              <el-input v-model="messageForm.time"></el-input>
            </el-form-item>
          </el-col> -->
          <el-col :span="8">
            <el-form-item label="发布人">
              <el-input v-model="messageForm.userName" disabled=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="推送方式">
              <el-select v-model="messageForm.way" placeholder="">
                <el-option label="全员推送" value="全员推送"></el-option>
                <el-option label="选择推送" value="选择推送"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="推送名单" v-show="messageForm.way === '选择推送'">
          <el-row>
            <el-col :span="21">
              <el-input v-model="menuListStr" :disabled="true"></el-input>
            </el-col>
            <el-col :span="3">
              <el-button type="primary" @click="showTreeTransfer = true" class="rt">选择推送</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </div>

    <el-dialog :title="'选择推送目标'" :visible.sync="showTreeTransfer"
               :width="'774px'"
               :show-close="false"
               append-to-body>
      <tree-transfer :tree-data="treeData" :choose-list="chooseList"></tree-transfer>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmChooseList()">确 定</el-button>
        <el-button @click="showTreeTransfer = false">取 消</el-button>
      </div>
    </el-dialog>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitMessageForm()">发布</el-button>
      <el-button @click="dialogFormMessageVisible = false">取 消</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import treeTransfer from '../tree-diagram/treeTransfer'
import axios from '@/api/axios'
import qs from 'qs'
import moment from 'moment'
import { mapState } from 'vuex'

export default {
  name: 'messages',
  data () {
    return {
      fileList: [
        {
          name: 'food.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        },
        {
          name: 'food2.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        }
      ],
      dialogFormMessageVisible: false,
      showTreeTransfer: false,
      messageData: [], // 信息列表数据
      messageForm: {
        title: '', // 标题
        textContent: '', // 文本内容
        // attachment: '', // 附件上传
        userName: '', // 发送人
        sendTime: '' // 发送时间
        // way: '' // 推送方式
      },
      sendDate: '',
      sendTime: '',
      rulesMessage: {},
      page: {
        total: 0, // 总条数
        index: 1, // 当前页面
        pageNo: 1,
        pageSize: 10 // limit
      },
      tabType: '1', // tab切换类型
      treeData: [
        {
          id: 1000131,
          label: '东三省黑龙江集团',
          children: [
            {
              id: 1003422,
              label: '有限公司A',
              children: [
                {
                  id: 1004521,
                  label: '质检厂',
                  data: {
                    name: 'AAA',
                    duty: 'clean job'
                  }
                }, {
                  id: 1004522,
                  label: '设备厂'
                }
              ]
            }, {
              id: 1000135,
              label: '有限公司B',
              children: [
                {
                  id: 1060121,
                  label: '炼制厂'
                }, {
                  id: 1060122,
                  label: '电器厂',
                  children: [
                    {
                      id: 1060123,
                      label: '生产部',
                      children: [
                        {
                          id: 1060125,
                          label: '电气车间',
                          children: [
                            {
                              id: 1060126,
                              label: '班组A'
                            }
                          ]
                        }
                      ]
                    }, {
                      id: 1060124,
                      label: '安监部'
                    }
                  ]
                }, {
                  id: 1060129,
                  label: '污水处理厂'
                }, {
                  id: 1060130,
                  label: '炼焦厂'
                }
              ]
            }
          ]
        }
      ],
      chooseList: [],
      menuListStr: ''
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
    'date-filter' (value) {
      if (value) {
        return moment(value).format('YYYY-MM-DD')
      } else {
        return null
      }
    },
    'time-filter' (value) {
      if (value) {
        return moment(value).format('HH: mm: ss')
      } else {
        return null
      }
    }
  },
  created () {
    this.fetchList()
  },
  methods: {
    fetchList () {
      axios
        .get('flowAct/todoList', {
          // pageNo: this.page.pageNo,
          // pageSize: this.page.pageSize,
          userId: this.userInfo.userId
        })
        .then((res) => {
          if (res.data.code === 200) {
            this.messageData = res.data.data
            this.page.total = res.data.total
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
        pageSize: this.page.pageSize
      }
      this.$confirm('是否删除当页消息？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios
          .post('msg/delBatch', qs.stringify(sendData))
          .then((res) => {
            console.log(res.data.code)
            if (res.data.code === 200) {
              this.$notify.success('删除成功')
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
        id: row.id
      }
      axios
        .post('msg/del', qs.stringify(sendData))
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
      this.tabType = (Number(item.paneName) + 1) + ''
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
          .post('msg/signRead', qs.stringify(sendData))
          .then((res) => {
            if (res.data.code === 200) {
              this.$notify.success('标记成功')
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
      console.log(item)
      this.$router.push({
        name: 'messagesDetails',
        params: {
          id: item.id
        }
      })
    },
    // 发布消息
    handleSendMessage () {
      this.dialogFormMessageVisible = true
    },
    // 提交发布消息事件
    submitMessageForm () {
      let vm = this
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
                vm.fetchListData()
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
          console.log('error submit!!')
          return false
        }
      })
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePreview (file) {
      console.log(file)
    },
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 $ { file.name }？`)
    },
    confirmChooseList () {
      this.menuListStr = ''
      this.chooseList.forEach(item => {
        this.menuListStr += `${item.nameStr}; `
      })
      console.log(this.treeData) // 上传该数据
      this.showTreeTransfer = false
    }
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.userInfo
    })
  },
  watch: {
  },
  components: {
    treeTransfer
  }
}
</script>
<style lang="scss" scoped>
@import '../../utils/css/style.scss';
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
    &.is-dot{
    }
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
    .el-input{
      // width: 240px;
    }
  }
</style>
