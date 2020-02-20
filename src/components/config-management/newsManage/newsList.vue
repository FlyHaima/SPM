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
      :data="tables.data"
      tooltip-effect="dark"
      style="width: 100%"
      v-loading="tables.loading">
      <el-table-column
        type="index"
        label="ID"
        align="center"
        :index="indexMethod">
      </el-table-column>
      <el-table-column
        prop="newsName"
        label="文章标题"
        align="center">
      </el-table-column>
      <el-table-column
        label="分类"
        align="center">
        <template slot-scope="scope">
          {{scope.row.typeName | type-filter}}
        </template>
      </el-table-column>
      <el-table-column
        prop="url"
        label="链接地址"
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
    <div class="el-pagination__wrap text-right">
      <el-pagination
        background
        layout="total, prev, pager, next, jumper"
        :current-page="tables.page.index"
        :page-sizes="tables.page.sizes"
        :page-size="tables.form.pageSize"
        :total="tables.page.total"
        @current-change="tablesHandleCurrentPage"></el-pagination>
    </div>
    <el-dialog
      :visible.sync="dialogAddVisible"
      width="50%"
      :show-close="false"
      v-loading="submitting">
      <div slot="title">
        {{typeof editData !== 'undefined' && editData !== '' ? '编辑' : '添加' }}
      </div>
      <div class="form-modal">
        <el-form
          :model="form"
          ref="newsForm"
          :rules="rules"
          label-width="100px"
          label-position="right">
          <el-form-item label="文章标题" prop="newsName">
            <el-input v-model="form.newsName"></el-input>
          </el-form-item>
          <el-form-item label="分类" prop="typeName">
            <el-select v-model="form.typeName" placeholder="请选择">
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="链接地址" prop="url">
            <el-input v-model="form.url"></el-input>
          </el-form-item>
          <!-- <el-form-item>
             <vue-ueditor-wrap v-model="form.content" :config="editorConfig"></vue-ueditor-wrap>
          </el-form-item> -->
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-loading="submitting" @click="submitForm()">确定</el-button>
        <el-button @click="dialogAddVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import qs from 'qs'
import axios from '@/api/axios'
import Tables from '@/mixins/Tables'
import VueUeditorWrap from 'vue-ueditor-wrap'
import { NEWS_TYPE_LIST } from '@/constants/status'
import { NewsTypeFilter } from '@/filters/status'
export default {
  name: 'newsList',
  mixins: [Tables],
  data () {
    return {
      submitting: false,
      typeOptions: NEWS_TYPE_LIST,
      dialogAddVisible: false,
      editData: '',
      tables: {
        api: 'news/getNewsList',
        auto: true
      }, // 新闻列表数据
      form: {
        newsName: '', // 标题
        typeName: '', // 分类
        content: '', // 内容
        url: '' // 链接地址
      },
      rules: {
        newsName: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        typeName: [
          { required: true, message: '请选择分类', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '请输入链接地址', trigger: 'blur' }
        ]
      },
      editorConfig: {
        // 编辑器初始z-index
        zIndex: 3000,
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 200,
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
      }
    }
  },
  filters: {
    'type-filter': NewsTypeFilter
  },
  methods: {
    // 添加新闻事件
    addHandle () {
      this.dialogAddVisible = true
      this.editData = ''
      // 清空表单编辑后的值
      Object.keys(this.form).forEach(key => {
        // this.tables.form[key] = ''
        this.form.newsName = ''
        this.form.typeName = ''
        this.form.content = ''
        this.form.url = ''
      })
    },
    // 添加新闻事件
    saveForm (post, tip) {
      let vm = this
      vm
        .$confirm(`确定【${tip}】新闻吗？`, '提示', {
          type: 'warning'
        })
        .then(() => {
          vm.submitting = true
          vm.$refs.newsForm.validate((valid) => {
            if (valid) {
              axios
                .post(`news/${post}News`, vm.form)
                .then((res) => {
                  vm.submitting = true
                  if (res.data.code === 200) {
                    vm.$notify.success(tip + '成功')
                    vm.dialogAddVisible = false
                    vm.tablesFetchList()
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
        })
        .catch(() => {})
    },
    submitForm () {
      this.$refs.newsForm.validate((valid) => {
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
      this.dialogAddVisible = true
      this.editData = row.id
      this.initForm(this.editData)
    },
    // 编辑状态，回显数据
    initForm (data) {
      this.submitting = true
      if (data) {
        axios
          .get('news/getOneNews', {
            id: data
          })
          .then((res) => {
            if (res.data.code === 200) {
              this.form = res.data.data
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
        .post('news/delNews', qs.stringify(sendData), { 'content-type': 'application/x-www-form-urlencoded' })
        .then((res) => {
          if (res.data.code === 200) {
            this.$notify.success('删除成功')
            this.tablesFetchList()
          }
        })
        .finally(() => {
        })
    },
    // 自定义序号
    indexMethod (index) {
      return index + 1
    }
  },
  components: {
    VueUeditorWrap
  }
}
</script>

<style scoped lang="scss">
.talbe-links-del{
  margin-left: 20px;
}
</style>
