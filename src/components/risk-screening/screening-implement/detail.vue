<template>
  <el-dialog
    @close="closeDialog('form' )"
    :close-on-click-modal="false"
    title="详情"
    :visible.sync="show"
    width="40%">
    <el-form
      :model="formData"
      ref="form"
      size="mini"
      label-width="100px"
    >
      <el-form-item label="检查名称：">
        {{formData.checkName}}
      </el-form-item>
      <el-form-item label="检查人员：">
        {{formData.checkUser}}
      </el-form-item>
      <el-form-item label="接收人：">
        {{formData.receiverUser}}
      </el-form-item>
      <el-form-item label="检查时间：">
        {{formData.checkTime | time-filter}}
      </el-form-item>
      <el-form-item label="隐患描述：">
        {{formData.hiddenDesc}}
      </el-form-item>
      <el-form-item label="附件：">
        <div class="attachment-list">
          <div
            v-for = "(itemImg, index) in formData.hiddenPhotos"
            :key = index
            class="attachment-list-item"
            @click.prevent= onPreview(index,itemImg)>
            <el-image
              class="attachment-img"
              :src="itemImg"
              alt="上传的图片"
              >
            </el-image>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <el-image-viewer
      v-if="showViewer"
      :on-close="closeViewer"
      :url-list="srcList" />
  </el-dialog>
</template>

<script>
import moment from 'moment'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
export default {
  name: '',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    planId: {
      type: String,
      default: ''
    },
    formData: {
      type: Object,
      default: null
    }
  },
  created () {
  },
  components: {
    ElImageViewer
  },
  filters: {
    // 格式化日期格式
    'time-filter' (value) {
      if (value) {
        return moment(value).format('YYYY-MM-DD HH:mm:ss')
      } else {
        return ''
      }
    }
  },
  data () {
    return {
      show: false,
      photos: null,
      nowIndex: '',
      showViewer: false, // 显示查看器
      srcList: [] // 存放预览图
    }
  },
  methods: {
    onPreview (index, itemImg) {
      let vm = this
      vm.srcList = []
      vm.showViewer = true
      vm.nowIndex = index
      vm.srcList.push(itemImg)
      console.log(vm.showViewer)
    },
    // 关闭查看器
    closeViewer () {
      this.showViewer = false
    },
    // 关闭弹框
    closeDialog (formName) {
      this.show = false
    }
  },
  watch: {
    dialogVisible (val) {
      this.show = val
    },
    show (val) {
      this.$emit('on-dialog-change', val)
    },
    formData: {
      immediate: true,
      handler (val, oldVal) {
        this.formData = val
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.attachment-list{
  display: flex;
  flex-wrap: wrap;
}
.attachment-list-item{
  width: 143px;
  margin-right: 43px;
  // border: 1px solid #dddddd;
  border-radius: 8px;
  video{
    display: inline-block;
    width: 143px;
    height: 113px;
    border-radius: 6px;
  }
}
.attachment-img{
  display: inline-block;
  width: 173px;
  height: 102px;
  border-radius: 6px;
}
</style>
