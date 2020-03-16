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
            class="attachment-list-item">
            <img
              class="attachment-img"
              :src="itemImg"
              alt="上传的图片" />
          </div>
        </div>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import moment from 'moment'
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
      photos: null
    }
  },
  methods: {
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
