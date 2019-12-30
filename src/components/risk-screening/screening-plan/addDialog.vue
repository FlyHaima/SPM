<template>
  <el-dialog
    title="添加"
    :visible.sync="show"
    width="60%">
    <el-form
      :model="form"
      ref="form"
      size="mini"
      label-width="100px"
      label-position="top"
    >
      <el-form-item label="排查目标">
        <el-input v-model="form.target"></el-input>
      </el-form-item>
      <el-form-item label="排查内容与排查标注">
        <el-input
          type="textarea"
          v-model="form.content"></el-input>
      </el-form-item>
      <el-form-item label="排查依据">
        <el-input
          type="textarea"
          v-model="form.basis"
          maxlength="30"
          show-word-limit></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        size="small"
        @click="submitForm()">确 定</el-button>
      <el-button
        size="small"
        @click="show = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: '',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      show: false,
      form: {
        target: '', // 排查目标
        content: '', // 排查内容和标准
        basis: '' // 排查依据
      }
    }
  },
  watch: {
    dialogVisible (val) {
      this.show = val
    },
    show (val) {
      this.$emit('on-dialog-change', val)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
