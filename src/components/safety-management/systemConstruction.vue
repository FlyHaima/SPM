<template>
  <el-container class="inner-page-container" v-loading="pageLoading">
    <el-header class="inner-header">
      <bread-crumb :breadList="breadcrumb">
      </bread-crumb>
    </el-header>
    <el-main class="inner-main-container">
      <div class="table-container">
        <p class="btn-p">
          <el-button size="medium" type="primary"><i class="el-icon-upload2"></i>上传</el-button>
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
            <template slot-scope="scope">{{ scope.row.name }}</template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="220"
            align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="preview(scope.row.id)">预览</el-button>
              <el-button type="text" @click="edit(scope.row.id)">编辑</el-button>
              <el-button type="text" @click="deleteItem(scope.row.id)">删除</el-button>
              <el-button type="text" @click="resetItem(scope.row.id)">重置</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-main>

    <el-dialog :title="'预览'"
               :visible.sync="showPre"
               :width="'1290px'" :top="'20px'">
      <div class="preview-box">
        <div v-html="previewDom"></div>
      </div>
    </el-dialog>

    <el-dialog :title="'编辑'"
               :visible.sync="showEdit"
               :width="'1290px'" :top="'20px'">
      <div class="edit-box">
        <vue-ueditor-wrap v-model="previewDom" :config="editorConfig"></vue-ueditor-wrap>
        <div slot="footer" class="dialog-footer" style="margin-top: 40px; text-align: right;">
          <el-button size="small" type="primary" @click="submitEdit()">保 存</el-button>
          <el-button size="small" @click="showEdit = false">取 消</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      title="重置"
      :visible.sync="showReset"
      :width="'576px'">
      <div class="reset-div">
        <p class="title"><i class="notice-icon"></i>系统通知：</p>
        <p class="content">一旦选择<span>重置文件</span>，文件将重置为最初始的状态。你确定要进行此项操作吗？</p>
      </div>
      <span slot="footer" class="dialog-footer">
            <el-button @click="cancelReset()">取 消</el-button>
            <el-button type="primary" @click="confirmReset()">确 定</el-button>
          </span>
    </el-dialog>
  </el-container>
</template>

<script>
import BreadCrumb from '../Breadcrumb/Breadcrumb'
import VueUeditorWrap from 'vue-ueditor-wrap'

export default {
  name: 'systemConstruction',
  data () {
    return {
      pageLoading: false,
      breadcrumb: ['风险辨识评估', '制度建设'],
      systemList: [
        {
          name: 'systemListA--条例A-20',
          id: '312312412'
        },
        {
          name: 'systemListA--条例A-20',
          id: '312312412'
        },
        {
          name: 'systemListA--条例A-20',
          id: '312312412'
        }
      ],
      showPre: false,
      previewDom: '<div style="width:595.0pt;margin-bottom:72.0pt;margin-top:72.0pt;margin-left:90.0pt;margin-right:90.0pt;"><p>&#24005;&#23792;&#23545;&#20915;&#24343;&#20848;&#20811;</p><p>&#20998;&#20026;&#21152;&#20998;&#21908;</p><p><br/></p><p>&#21435;&#27745;&#31881;wew</p><table class="a1 a3" style="border-collapse:collapse;"><tr class="a1 a3"><td class="a1 a3" style="width:60.85pt;border-top:0.5px solid #000000;border-bottom:0.5px solid #000000;border-left:0.5px solid #000000;border-right:0.5px solid #000000;"><p>1</p></td><td class="a1 a3" style="width:60.85pt;border-top:0.5px solid #000000;border-bottom:0.5px solid #000000;border-left:0.5px solid #000000;border-right:0.5px solid #000000;"><p>2</p></td><td class="a1 a3" style="width:60.85pt;border-top:0.5px solid #000000;border-bottom:0.5px solid #000000;border-left:0.5px solid #000000;border-right:0.5px solid #000000;"><p/></td><td class="a1 a3" style="width:60.85pt;border-top:0.5px solid #000000;border-bottom:0.5px solid #000000;border-left:0.5px solid #000000;border-right:0.5px solid #000000;"><p/></td><td class="a1 a3" style="width:60.9pt;border-top:0.5px solid #000000;border-bottom:0.5px solid #000000;border-left:0.5px solid #000000;border-right:0.5px solid #000000;"><p/></td><td class="a1 a3" style="width:60.9pt;border-top:0.5px solid #000000;border-bottom:0.5px solid #000000;border-left:0.5px solid #000000;border-right:0.5px solid #000000;"><p/></td><td class="a1 a3" style="width:60.9pt;border-top:0.5px solid #000000;border-bottom:0.5px solid #000000;border-left:0.5px solid #000000;border-right:0.5px solid #000000;"><p/></td></tr><tr class="a1 a3"><td class="a1 a3" style="width:60.85pt;border-top:0.5px solid #000000;border-bottom:0.5px solid #000000;border-left:0.5px solid #000000;border-right:0.5px solid #000000;"><p><br/></p></td><td class="a1 a3" style="width:60.85pt;border-top:0.5px solid #000000;border-bottom:0.5px solid #000000;border-left:0.5px solid #000000;border-right:0.5px solid #000000;"><p><br/></p></td><td class="a1 a3" style="width:60.85pt;border-top:0.5px solid #000000;border-bottom:0.5px solid #000000;border-left:0.5px solid #000000;border-right:0.5px solid #000000;"><p>3</p></td><td class="a1 a3" style="width:60.85pt;border-top:0.5px solid #000000;border-bottom:0.5px solid #000000;border-left:0.5px solid #000000;border-right:0.5px solid #000000;"><p><br/></p></td><td class="a1 a3" style="width:60.9pt;border-top:0.5px solid #000000;border-bottom:0.5px solid #000000;border-left:0.5px solid #000000;border-right:0.5px solid #000000;"><p><br/></p></td><td class="a1 a3" style="width:60.9pt;border-top:0.5px solid #000000;border-bottom:0.5px solid #000000;border-left:0.5px solid #000000;border-right:0.5px solid #000000;"><p><br/></p></td><td class="a1 a3" style="width:60.9pt;border-top:0.5px solid #000000;border-bottom:0.5px solid #000000;border-left:0.5px solid #000000;border-right:0.5px solid #000000;"><p><br/></p></td></tr><tr class="a1 a3"><td class="a1 a3" style="width:60.85pt;border-top:0.5px solid #000000;border-bottom:0.5px solid #000000;border-left:0.5px solid #000000;border-right:0.5px solid #000000;"><p><br/></p></td><td class="a1 a3" style="width:60.85pt;border-top:0.5px solid #000000;border-bottom:0.5px solid #000000;border-left:0.5px solid #000000;border-right:0.5px solid #000000;"><p><br/></p></td><td class="a1 a3" style="width:60.85pt;border-top:0.5px solid #000000;border-bottom:0.5px solid #000000;border-left:0.5px solid #000000;border-right:0.5px solid #000000;"><p><br/></p></td><td class="a1 a3" style="width:60.85pt;border-top:0.5px solid #000000;border-bottom:0.5px solid #000000;border-left:0.5px solid #000000;border-right:0.5px solid #000000;"><p>3</p></td><td class="a1 a3" style="width:60.9pt;border-top:0.5px solid #000000;border-bottom:0.5px solid #000000;border-left:0.5px solid #000000;border-right:0.5px solid #000000;"><p>4</p></td><td class="a1 a3" style="width:60.9pt;border-top:0.5px solid #000000;border-bottom:0.5px solid #000000;border-left:0.5px solid #000000;border-right:0.5px solid #000000;"><p><br/></p></td><td class="a1 a3" style="width:60.9pt;border-top:0.5px solid #000000;border-bottom:0.5px solid #000000;border-left:0.5px solid #000000;border-right:0.5px solid #000000;"><p><br/></p></td></tr><tr class="a1 a3"><td class="a1 a3" style="width:60.85pt;border-top:0.5px solid #000000;border-bottom:0.5px solid #000000;border-left:0.5px solid #000000;border-right:0.5px solid #000000;"><p><br/></p></td><td class="a1 a3" style="width:60.85pt;border-top:0.5px solid #000000;border-bottom:0.5px solid #000000;border-left:0.5px solid #000000;border-right:0.5px solid #000000;"><p><br/></p></td><td class="a1 a3" style="width:60.85pt;border-top:0.5px solid #000000;border-bottom:0.5px solid #000000;border-left:0.5px solid #000000;border-right:0.5px solid #000000;"><p><br/></p></td><td class="a1 a3" style="width:60.85pt;border-top:0.5px solid #000000;border-bottom:0.5px solid #000000;border-left:0.5px solid #000000;border-right:0.5px solid #000000;"><p><br/></p></td><td class="a1 a3" style="width:60.9pt;border-top:0.5px solid #000000;border-bottom:0.5px solid #000000;border-left:0.5px solid #000000;border-right:0.5px solid #000000;"><p>4</p></td><td class="a1 a3" style="width:60.9pt;border-top:0.5px solid #000000;border-bottom:0.5px solid #000000;border-left:0.5px solid #000000;border-right:0.5px solid #000000;"><p>56</p></td><td class="a1 a3" style="width:60.9pt;border-top:0.5px solid #000000;border-bottom:0.5px solid #000000;border-left:0.5px solid #000000;border-right:0.5px solid #000000;"><p>6</p></td></tr><tr class="a1 a3"><td class="a1 a3" style="width:60.85pt;border-top:0.5px solid #000000;border-bottom:0.5px solid #000000;border-left:0.5px solid #000000;border-right:0.5px solid #000000;"><p><br/></p></td><td class="a1 a3" style="width:60.85pt;border-top:0.5px solid #000000;border-bottom:0.5px solid #000000;border-left:0.5px solid #000000;border-right:0.5px solid #000000;"><p><br/></p></td><td class="a1 a3" style="width:60.85pt;border-top:0.5px solid #000000;border-bottom:0.5px solid #000000;border-left:0.5px solid #000000;border-right:0.5px solid #000000;"><p><br/></p></td><td class="a1 a3" style="width:60.85pt;border-top:0.5px solid #000000;border-bottom:0.5px solid #000000;border-left:0.5px solid #000000;border-right:0.5px solid #000000;"><p><br/></p></td><td class="a1 a3" style="width:60.9pt;border-top:0.5px solid #000000;border-bottom:0.5px solid #000000;border-left:0.5px solid #000000;border-right:0.5px solid #000000;"><p>43</p></td><td class="a1 a3" style="width:60.9pt;border-top:0.5px solid #000000;border-bottom:0.5px solid #000000;border-left:0.5px solid #000000;border-right:0.5px solid #000000;"><p>4</p></td><td class="a1 a3" style="width:60.9pt;border-top:0.5px solid #000000;border-bottom:0.5px solid #000000;border-left:0.5px solid #000000;border-right:0.5px solid #000000;"><p>5</p></td></tr></table><p><img src="image/word/media/image1.png" width="117.5pt" height="202.75pt"/></p></div>',
      showEdit: false,
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
        serverUrl: 'http://35.201.165.105:8000/controller.php',
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
          'simpleupload', 'insertimage', 'emotion', 'scrawl', '|',
          'horizontal', 'date', 'time', 'spechars', '|',
          'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', 'charts', '|',
          'help'
        ]]
      },
      editId: '',
      showReset: false
    }
  },
  methods: {
    preview (id) {
      // previewDom
      this.showPre = true
    },
    edit (id) {
      this.showEdit = true
      this.editId = id
    },
    submitEdit () {
      // this.editId
    },
    deleteItem (id) {},
    resetItem (id) {
      this.showReset = true
    },
    cancelReset () {
      this.showReset = false
    },
    confirmReset () {

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
      .btn-p{
        text-align: right;
        padding-bottom: 25px;
        .el-icon-upload2{
          margin-right: 4px;
        }
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
