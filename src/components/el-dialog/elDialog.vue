<template>
  <div v-if="dialogShow">
    <el-dialog
      title="编辑"
      :visible.sync="dialogVisibleSwitch"
      >
      <span>这是一段信息</span>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          size="small"
          @click="submitForm()">保 存</el-button>
        <el-button
          size="small"
          @click="dialogVisibleSwitch = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'el-dialog',
  props: {
    dialogShow: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dialogVisibleSwitch: false
    }
  },
  watch: {
    dialogShow (val) {
      console.log(val)
      this.dialogVisibleSwitch = val
      console.log(this.dialogVisibleSwitch)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../utils/css/style.scss';
</style>
