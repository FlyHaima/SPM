<template>
<div class="message-wrap">
  <el-tabs type="border-card">
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
              <el-button type="danger" size="mini">删除当页消息</el-button>
            </div>
          </div>
          <div class="info-header">
            <div class="info-title">
              <span class="info-title-txt">待办事项</span>
            </div>
            <div class="info-link">
              <el-button type="danger" size="mini">标记当页已处理</el-button>
            </div>
          </div>
          <div class="info-content">
            <ul class="list-info">
              <li class="list-info-item">
                <div class="list-info-title">
                  <span class="list-info-txt">
                    <span class="list-info-type">
                      <i class="badge is-dot"></i>
                      [下线通知]</span>你的安全清单并未完善，请点击这里</span>
                </div>
                <div class="list-info-right">
                  <i class="icon-clock"></i>
                  <span class="list-info-date">2019-08-06</span>
                  <span class="list-info-time">10：32</span>
                  <span class="list-info-user">发布人：王雪</span>                  <i class="el-icon-delete"></i>
                </div>
              </li>
              <li class="list-info-item list-info-item-light">
                <div class="list-info-title">
                  <span class="list-info-txt"><span class="list-info-type">[下线通知]</span>你的安全清单并未完善，请点击这里</span>
                </div>
                <div class="list-info-right">
                  <i class="icon-clock"></i>
                  <span class="list-info-date">2019-08-06</span>
                  <span class="list-info-time">10：32</span>
                  <span class="list-info-user">发布人：王雪</span>
                  <i class="el-icon-delete"></i>
                </div>
              </li>
            </ul>
            <el-pagination
              class="text-right"
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage4"
              :page-sizes="[100, 200, 300, 400]"
              :page-size="100"
              layout="total, sizes, prev, pager, next, jumper"
              :total="400">
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
              <el-button type="success" size="mini">标记当页已读</el-button>
              <el-button type="danger" size="mini">删除当页消息</el-button>
            </div>
          </div>
          <div class="info-content">
            <ul class="list-info">
              <li @click="goDetailsPage" class="list-info-item">
                <div class="list-info-title">
                  <span class="list-info-txt"><span class="list-info-type">[下线通知]</span>你的安全清单并未完善，请点击这里</span>
                </div>
                <div class="list-info-right">
                  <i class="icon-clock"></i>
                  <span class="list-info-date">2019-08-06</span>
                  <span class="list-info-time">10：32</span>
                  <span class="list-info-user">发布人：王雪</span>                  <i class="el-icon-delete"></i>
                </div>
              </li>
              <li class="list-info-item list-info-item-light">
                <div class="list-info-title">
                  <span class="list-info-txt">
                    <span class="list-info-type">
                      [下线通知]
                      <i class="badge"></i>
                    </span>你的安全清单并未完善，请点击这里
                  </span>
                </div>
                <div class="list-info-right">
                  <i class="icon-clock"></i>
                  <span class="list-info-date">2019-08-06</span>
                  <span class="list-info-time">10：32</span>
                  <span class="list-info-user">发布人：王雪</span>
                  <i class="el-icon-delete"></i>
                </div>
              </li>
            </ul>
            <el-pagination
              class="text-right"
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage4"
              :page-sizes="[100, 200, 300, 400]"
              :page-size="100"
              layout="total, sizes, prev, pager, next, jumper"
              :total="400">
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
          <el-input type="textarea" maxlength="200" show-word-limit v-model="messageForm.text"></el-input>
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
          <el-col :span="8">
            <el-form-item label="发送时间">
              <el-input v-model="messageForm.time"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发送人">
              <el-input v-model="messageForm.user"></el-input>
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

export default {
  name: 'messages',
  data () {
    return {
      currentPage4: 4,
      fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],
      dialogFormMessageVisible: false,
      showTreeTransfer: false,
      messageForm: {
        title: '', // 标题
        text: '', // 文本内容
        attachment: '', // 附件上传
        user: '', // 发送人
        time: '', // 发送时间
        way: '' // 推送方式
      },
      rulesMessage: {
      },
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
  methods: {
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
    },
    // 跳转信息详情页面的点击事件
    goDetailsPage () {
      this.$router.push({
        name: 'messagesDetails'
      })
    },
    // 发布消息
    handleSendMessage () {
      this.dialogFormMessageVisible = true
    },
    // 提交发布消息事件
    submitMessageForm () {
      this.$refs.messageForm.validate((valid) => {
        if (valid) {
          alert('submit!')
          this.dialogFormMessageVisible = false
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
    padding: 18px 0px 18px 0px;
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
