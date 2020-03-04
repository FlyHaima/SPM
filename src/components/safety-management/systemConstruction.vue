<template>
  <el-container class="inner-page-container" v-loading="pageLoading">
    <el-header class="inner-header">
      <bread-crumb :breadList="breadcrumb">
      </bread-crumb>
    </el-header>
    <el-main class="inner-main-container">
      <div class="table-container">
        <p class="btn-p">
          <el-button size="medium" type="primary" @click="openAdd()"><i class="el-icon-plus" style="margin-right: 6px;"></i>新增</el-button>
        </p>
        <el-table ref="leaderTable"
                 border
                 stripe
                 :data="systemList"
                 tooltip-effect="dark"
                 style="width: 100%">
          <el-table-column
            label="序号"
            width="190"
            align="center"
            type="index">
          </el-table-column>
          <el-table-column
            label="制度名称"
            align="center">
            <template slot-scope="scope">{{ scope.row.fileName }}</template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="220"
            align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="preview(scope.row)">预览</el-button>
              <el-button type="text" @click="edit(scope.row)">编辑</el-button>
              <el-button type="text" @click="deleteItem(scope.row.id)">删除</el-button>
<!--              <el-button type="text" @click="resetItem(scope.row.id)">重置</el-button>-->
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
            @current-change="getConstructionList">
          </el-pagination>
        </div>
      </div>
    </el-main>

    <el-dialog :close-on-click-modal="false" :title="'预览'"
               :visible.sync="showPre"
               :width="'1290px'" :top="'20px'">
      <div class="preview-box">
        <div v-html="previewDom"></div>
      </div>
    </el-dialog>

    <el-dialog :close-on-click-modal="false" :title="'编辑'" v-loading="editorLoading"
               :visible.sync="showEdit"
               :width="'1290px'" :top="'20px'">
      <div class="edit-box">
        <vue-ueditor-wrap v-model="previewDom" :config="editorConfig" @beforeInit="addCustomButtom"></vue-ueditor-wrap>
        <div slot="footer" class="dialog-footer" style="margin-top: 40px; text-align: right;">
          <el-button size="small" type="primary" @click="submitEdit()">保 存</el-button>
          <el-button size="small" @click="showEdit = false">取 消</el-button>
        </div>
      </div>

      <el-dialog
        width="30%"
        title="图片上传"
        :visible.sync="innerVisible"
        append-to-body>
        <el-upload
          class="upload-demo"
          :action="baseUrl"
          :data="uploadData"
          :limit="1"
          accept=".jpg, .png"
          :before-upload="handleBeforeUpload"
          :on-preview="handlePreview"
          :on-success="handleSuccess"
          :on-remove="handleRemove"
          :file-list="imgList">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb，每次只能上传1张图片</div>
        </el-upload>

        <div slot="footer" class="dialog-footer" style="margin-top: 40px; text-align: right;">
          <el-button size="small" type="primary" @click="confirmImg()">确 定</el-button>
        </div>
      </el-dialog>
    </el-dialog>
  </el-container>
</template>

<script>
import BreadCrumb from '../Breadcrumb/Breadcrumb'
import VueUeditorWrap from 'vue-ueditor-wrap'
import base from '@/api/baseUrl'
import {getConstructionList, editSystemFile, deleteSystemFile, resetSystemFile, addConstruction} from '@/api/organization'
import {getQiNiuToken} from '@/api/upload'

export default {
  name: 'systemConstruction',
  data () {
    return {
      pageLoading: false,
      breadcrumb: ['安全基础管理', '制度建设'],
      systemList: [],
      showPre: false,
      previewDom: '',
      showEdit: false,
      uploadData: {
        token: ''
      },
      uploadToken: '',
      editorConfig: {
        // 编辑器初始z-index
        zIndex: 3000,
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 600,
        // 初始容器宽度
        initialFrameWidth: '100%',
        // 上传文件接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
        serverUrl: `${base.uploadQiniuAdr}`,
        // serverUrl: 'http://35.201.165.105:8000/controller.php',
        // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
        UEDITOR_HOME_URL: '/static/UEditor/',
        // 工具栏
        toolbars: [[
          'source', '|', 'undo', 'redo', '|',
          'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
          'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
          'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
          'directionalityltr', 'directionalityrtl', 'indent', '|',
          'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|',
          'link', 'unlink', 'anchor', '|', 'imagenone', 'imageleft', 'imageright', 'imagecenter', '|',
          'emotion', '|',
          'horizontal', 'date', 'time', 'spechars', '|',
          'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', 'charts', '|',
          'help'
        ]]
      },
      editId: '',
      pageData: {
        pageSize: 10,
        pageNo: 1,
        total: 0
      },
      imgList: [],
      baseUrl: '',
      fileAddress: '',
      innerVisible: false,
      editor: null,
      editorLoading: false
    }
  },
  created () {
    this.baseUrl = base.uploadQiniuAdr
    this.fileAddress = base.fileQiniuAddr
    this.getConstructionList()
  },
  methods: {
    openAdd () {
      let vm = this
      vm.pageLoading = true
      this.$prompt('制度名称', '新增', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        // 添加ajax
        let data = {
          fileName: value
        }
        addConstruction(data).then(res => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '添加成功'
            })
            vm.getConstructionList(data)
          }
          vm.pageLoading = false
        })
      }).catch(() => {
        vm.pageLoading = false
      })
    },
    getConstructionList () {
      this.pageLoading = true
      getConstructionList(this.pageData.pageNo, this.pageData.pageSize).then((res) => {
        if (res.code === 200) {
          this.systemList = res.data
          this.pageData.total = res.total
        }
        this.pageLoading = false
      })
    },
    preview (data) {
      this.previewDom = data.fileData ? data.fileData : ''
      this.showPre = true
    },
    edit (data) {
      this.showEdit = true
      this.editId = data.id
      this.previewDom = data.fileData ? data.fileData : ''
    },
    submitEdit () {
      this.editorLoading = true

      let data = {
        id: this.editId,
        fileData: this.previewDom
      }
      editSystemFile(data).then((res) => {
        if (res.code === 200) {
          this.editorLoading = false
          this.showEdit = false

          this.getConstructionList()
        }
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
        deleteSystemFile(data).then((res) => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.pageData.pageNo = 1
            this.getConstructionList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    resetItem (id) {
      this.$confirm('确定重置选中项?', '重置', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.pageLoading = true
        let data = {id: id}
        console.log(data)
        resetSystemFile(data).then((res) => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '重置成功!'
            })
            this.pageData.pageNo = 1
            this.getConstructionList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消重置'
        })
      })
    },
    handlePreview () {},
    handleSuccess (response, file, fileList) {
      // console.log(response)
      // console.log(file)
      // console.log(fileList)
      this.imgList = []
      fileList.forEach(item => {
        let fItem = {
          name: item.name, // 附件名称
          path: this.fileAddress + item.response.key, // 附件路径
          size: item.size // 附件大小
        }
        this.imgList.push(fItem)
      })
    },
    handleRemove (file, fileList) {
      this.imgList = []
      fileList.forEach(item => {
        let fItem = {
          name: item.name, // 附件名称
          path: this.fileAddress + item.response.key, // 附件路径
          size: item.size // 附件大小
        }
        this.imgList.push(fItem)
      })
    },
    handleBeforeUpload (file) {
      return getQiNiuToken().then((res) => {
        this.uploadData.token = res
      })
    },
    confirmImg () {
      this.editor.execCommand('add-img-button')
      this.imgList = []
      this.innerVisible = false
    },
    addCustomButtom (editorId) {
      let vm = this
      window.UE.registerUI('add-img-button',
        function (editor, uiName) {
          // 使用全局作用域editor承接，window注册的editor
          vm.editor = editor
          // 注册按钮执行时的 command 命令，使用命令默认就会带有回退操作
          editor.registerCommand(uiName, {
            execCommand: function () {
              console.log('触发editor命令')
              let domHtml = ''
              vm.imgList.forEach(item => {
                domHtml += '<img src="' + item.path + '">'
              })
              editor.execCommand('inserthtml', domHtml)
            }
          })

          // 创建一个 button
          let btn = new window.UE.ui.Button({
            name: uiName, // 按钮的名字
            title: '添加图片', // 提示
            cssRules: 'height: 20px !important; width: 20px !important; background-image: url(../images/icons.png); background-position: -380px 0px;', // 需要添加的额外样式，可指定 icon 图标
            onclick: function () { // 点击时执行的命令, 这里可以不用执行命令，做你自己的操作也可
              vm.imgList = []
              vm.innerVisible = true
              console.log(uiName)
              // editor.execCommand('add-img-button')
            }
          })

          // 当点到编辑内容上时，按钮要做的状态反射
          editor.addListener('selectionchange', function () {
            let state = editor.queryCommandState(uiName)
            if (state === -1) {
              btn.setDisabled(true)
              btn.setChecked(false)
            } else {
              btn.setDisabled(false)
              btn.setChecked(state)
            }
          })

          // 因为你是添加 button，所以需要返回这个 button
          return btn
        },
        null /* 指定添加到工具栏上的哪个位置，默认时追加到最后 */,
        editorId /* 指定这个 UI 是哪个编辑器实例上的，默认是页面上所有的编辑器都会添加这个按钮 */)
    }
  },
  components: {BreadCrumb, VueUeditorWrap}
}
</script>

<style scoped lang="scss">
.inner-page-container{
  height: 100%;
  .el-header{
    padding: 0;
  }
  .el-main{
    padding: 0;
    .table-container{
      width: 100%;
      height: 100%;
      background: #fff;
      padding: 25px;
      overflow-y: auto;
      .btn-p{
        text-align: right;
        padding-bottom: 25px;
        .el-icon-upload2{
          margin-right: 4px;
        }
      }
      .pages{
        margin-top: 28px;
        text-align: right;
      }
    }
  }
  .preview-box{
    height: 770px;
    overflow-y: auto;
  }
  .edit-box{
    height: 770px;
    /*overflow-y: auto;*/
  }
  .reset-div{
    position: relative;
    padding-left: 40px;
    .title{
      font-size: 20px;
      position: relative;
      .notice-icon{
        position: absolute;
        display: block;
        left: -30px;
        top: 2px;
        background: url("../../assets/img/dialog-notice-icon.png") no-repeat;
        width: 20px;
        height: 18px;
      }
    }
    .content{
      font-size: 16px;
      margin-top: 20px;
      span{
        color: #409eff;
      }
    }
  }
}
</style>
