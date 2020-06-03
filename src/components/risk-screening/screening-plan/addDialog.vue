<template>
  <el-dialog
    @close="closeDialog('form' )"
    :close-on-click-modal="false"
    title="添加"
    :visible.sync="show"
    width="40%">
    <el-form
      :model="form"
      ref="form"
      :rules="rules"
      size="mini"
      label-width="100px"
      label-position="top"
    >
      <el-form-item label="排查目标" prop="investTarget">
        <el-input v-model.trim="form.investTarget"></el-input>
      </el-form-item>
      <el-form-item label="排查内容与排查标注" prop="investContent">
        <el-input
          type="textarea"
          v-model.trim="form.investContent"></el-input>
      </el-form-item>
      <el-form-item label="排查依据" prop="inspectionBasic">
        <el-input
          type="textarea"
          v-model.trim="form.inspectionBasic"
          maxlength="30"
          show-word-limit></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button
        v-loading="submitting"
        type="primary"
        size="small"
        @click="submitForm()">确 定</el-button>
      <el-button
        size="small"
        @click="closeDialog('form' )"
        >取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import axios from '@/api/axios'
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
    }
  },
  data () {
    return {
      submitting: false,
      show: false,
      form: {
        investTarget: '', // 排查目标
        investContent: '', // 排查内容和标准
        inspectionBasic: '', // 排查依据
        planId: '' // 当前清单Id
      },
      rules: {
        investTarget: [
          {
            required: true,
            message: '请输入排查目标',
            trigger: 'blur'
          }
        ],
        investContent: [
          {
            required: true,
            message: '请输入排查内容与排查标注',
            trigger: 'blur'
          }
        ],
        inspectionBasic: [
          {
            required: true,
            message: '请输入排查依据',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 关闭弹框
    closeDialog (formName) {
      this.show = false
      this.$refs[formName].resetFields()
    },
    submitForm () {
      let vm = this
      this.form.planId = this.planId
      vm.$refs.form.validate((valid) => {
        if (valid) {
          vm.show = true
          axios
            .post('basticHidden/addBasticHidden', vm.form)
            .then((res) => {
              vm.submitting = true
              if (res.data.code === 200) {
                vm.$notify.success('添加计划成功')
                this.$emit('reload')
                vm.show = false
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
.el-textarea{
  border: 1px solid #d4d4d4;
}
</style>
