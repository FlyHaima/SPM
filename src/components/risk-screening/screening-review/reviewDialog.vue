<template>
  <el-dialog
    :close-on-click-modal="false"
    title="复核"
    :visible.sync="show"
    width="40%"
    @close="closeDialog('form')">
    <el-form :model="formWays" :rules="rules" ref="formWays" label-width="100px">
      <el-form-item label="处理方式:" prop="handleType" >
        <el-radio-group v-model="formWays.handleType" @change="waySelChange">
          <el-radio
            v-for="(item, index) in listWay"
            :key="index"
            :label="item.value">{{item.value}}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <el-form
      v-show="showGovernContent"
      :model="form"
      :rules="rules"
      ref="form"
      label-width="100px">
      <el-form-item label="隐患类型:" prop="hiddenType">
        <el-select size="medium" v-model="form.hiddenType" placeholder="请选择隐患类型">
          <el-option label="一般隐患" value="一般隐患"></el-option>
          <el-option label="重大隐患" value="重大隐患"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="整改时间:" required>
        <el-col :span="11">
          <el-form-item prop="rectiTime">
            <el-date-picker
              size="medium"
              v-model="form.rectiTime"
              type="datetime"
              placeholder="选择日期时间"
              :picker-options="pickerDisabled"
              :clearable='false'>
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="整改意见:" prop="rectiRemark">
        <el-input
          size="medium"
          type="textarea"
          v-model.trim="form.rectiRemark"
          maxlength="200"
          show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="治理人员:" prop="nextUserId">
        <el-button @click="selectUserHandle()" type="primary" size="medium">选择治理人员</el-button>
        <span>{{nextUserName}}</span>
      </el-form-item>
    </el-form>
    <el-dialog
      :close-on-click-modal="false"
      :title="'选择排查复核人'"
      :visible.sync="showTree"
      width="60%"
      append-to-body>
      <div class="select-layer" style="height: 400px">
        <tree-diagram
          :tree-data="workTree"
          :tree-name="'工作小组'"
          :has-upload="false"
          @handleNodeClick="handleNodeClick">
        </tree-diagram>
        <el-table
          ref="singleTable"
          highlight-current-row
          @current-change="handleCurrentChange"
          border
          stripe
          :data="workData"
          tooltip-effect="dark"
          >
          <el-table-column
            label="姓名"
            align="center"
            prop="userName">
          </el-table-column>
          <el-table-column
            label="联系方式"
            align="center"
            prop="telephone">
          </el-table-column>
          <!-- <el-table-column
            label="主要职责"
            align="center"
            prop="duty">
          </el-table-column> -->
        </el-table>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmChooseList()">确 定</el-button>
        <el-button @click="showTree = false">取 消</el-button>
      </div>
    </el-dialog>
    <div slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        size="small"
        @click="submitForm()">确 定</el-button>
      <el-button
        size="small"
        @click="closeDialog('form')">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import axios from '@/api/axios'
import TreeDiagram from '@/components/tree-diagram/treeDiagram'
export default {
  name: '',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    postData: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      submitting: false,
      show: false,
      showTree: false,
      showGovernContent: true, // 治理内容填写开关
      form: {
        hiddenType: '', // 隐患类型
        rectiTime: '', // 整改时间
        rectiRemark: '', // 整改意见
        nextUserId: '' // 处理人
      },
      formWays: {
        procInstId: '',
        taskid: '',
        hiddInstanceId: '',
        handleType: '' // 处理方式
      },
      rules: {
        rectiTime: [
          { type: 'date', required: true, message: '请选择整改时间', trigger: 'change' }
        ],
        nextUserId: [
          { required: true, message: '请选择治理人员', trigger: 'change' }
        ],
        hiddenType: [
          { required: true, message: '请选择隐患类型', trigger: 'change' }
        ],
        rectiRemark: [
          { required: true, message: '请填写整改意见', trigger: 'blur' }
        ]
      },
      listWay: null, // 处理方式
      nextUserName: '', // 复核人
      workTree: [], // 工作小组树数据
      workData: [],
      currentRow: null,
      deptId: '',
      pickerDisabled: {
        // 验证时间范围
        disabledDate: (time) => {
          return time.getTime() < Date.now() - 8.64e7
        }
      }
    }
  },
  components: {
    TreeDiagram
  },
  created () {
    // 清空表单编辑后的值
    Object.keys(this.form).forEach(key => {
      this.form[key] = ''
    })
  },
  methods: {
    // 关闭添加弹框
    closeDialog (formName) {
      this.show = false
      this.$refs[formName].resetFields()
    },
    // 初始化处理方式数据
    initFormData () {
      // 清空表单编辑后的值
      Object.keys(this.form).forEach(key => {
        this.form[key] = ''
      })
      this.nextUserName = ''
      axios
        .get('hiddenAct/initAct', {
          taskId: this.formWays.taskid
        })
        .then((res) => {
          if (res.data.code === 200) {
            this.listWay = res.data.data[1]
            this.formWays.handleType = this.listWay[0].value
          }
        })
    },
    // 获取工作小组树数据
    fetchWorkTreeData () {
      axios
        .get('hiddenAct/chooseDeptUser')
        .then((res) => {
          if (res.data.code === 200) {
            this.workTree = res.data.data
          }
        })
    },
    // 获取工作小组table数据
    // fetchWorkTableData () {
    //   axios
    //     .get('workUser/getList', {
    //       deptId: this.deptId,
    //       pageNo: 1,
    //       pageSize: 10
    //     })
    //     .then((res) => {
    //       if (res.data.code === 200) {
    //         this.workData = res.data.data
    //       }
    //     })
    // },
    // 处理方式切换
    waySelChange (label) {
      if (label === '结束') {
        this.showGovernContent = false
      } else {
        this.showGovernContent = true
      }
    },
    // 提交表单操作
    submitForm () {
      if (this.showGovernContent) {
        let sendData = {
          procInstId: this.formWays.procInstId,
          taskid: this.formWays.taskid,
          hiddInstanceId: this.formWays.hiddInstanceId,
          handleType: this.formWays.handleType, // 处理方式
          hiddenType: this.form.hiddenType, // 隐患类型
          rectiTime: this.form.rectiTime, // 整改时间
          rectiRemark: this.form.rectiRemark, // 整改意见
          nextUserId: this.form.nextUserId // 处理人
        }
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.saveForm(sendData)
          } else {
            return false
          }
        })
      } else {
        let sendData = {
          procInstId: this.formWays.procInstId,
          taskid: this.formWays.taskid,
          hiddInstanceId: this.formWays.hiddInstanceId,
          handleType: this.formWays.handleType // 处理方式
        }
        this.saveForm(sendData)
      }
    },
    saveForm (sendData) {
      let vm = this
      vm
        .$confirm(`确定提交排查复核信息吗？`, '提示', {
          type: 'warning'
        })
        .then(() => {
          vm.show = true
          axios
            .post('hiddenAct/auditorAct', sendData)
            .then((res) => {
              vm.submitting = true
              if (res.data.code === 200) {
                vm.$notify.success('排查复核提交成功！')
                // 复核成功后刷新导航我的待办的数量显示
                this.$store.dispatch('BASE_INFO_SET')
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
        })
        .catch(() => {})
    },
    // 选择治理人员
    selectUserHandle () {
      this.showTree = true
      this.fetchWorkTreeData()
    },
    // 选择治理人员弹窗的左侧菜单的点击事件
    handleNodeClick (treeData, deptId) {
      this.deptId = deptId
      this.workData = treeData.userList
      // this.fetchWorkTableData()
    },
    // 选择治理人员弹框的table单选操作
    handleCurrentChange (val) {
      this.currentRow = val
    },
    // 选择治理人员弹框的确定操作
    confirmChooseList () {
      let vm = this
      if (vm.currentRow) {
        console.log(vm.currentRow)
        vm.form.nextUserId = vm.currentRow.userId
        vm.nextUserName = vm.currentRow.userName
        vm.showTree = false
      } else {
        vm.$message({
          message: '请选择排查复核人',
          type: 'warning'
        })
      }
    }
  },
  watch: {
    postData: {
      handler (val, oldVal) {
        this.formWays.taskid = val.taskid
        this.formWays.procInstId = val.procInstId
        this.formWays.hiddInstanceId = val.hiddInstanceId
        if (this.postData) {
          this.initFormData()
        }
      }
    },
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
@import '@/utils/css/style.scss';
  .box-card {
    margin: 0 30px;
    .item{
      padding: 8px 0;
    }
  }
  .box-item-label{
    color: #ababab;
  }
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
    background: pink;
  }
  .details-layer{
    display: flex;
  }
  .details-layer-left{
    flex: 0 0 300px;
    border-right: 1px solid $colorBorder;
    padding-left: 46px;
    max-height: 686px;
    overflow-y: scroll;
  }
  .details-layer-right{
    flex: 1;
  }
  .progress-bar{
    // border-left: 2px solid $colorPrimary;
    // padding-left: 34px;
  }
  .progress-bar-level1{
    + .progress-bar-level1{
      .progress-bar-level1-content{
        padding-top: 75px;
      }
    }
    .progress-bar-level1-content{
      padding-left: 34px;
      border-left: 2px solid $colorPrimary;
    }
    &:last-child{
      // border: 0;
      .progress-bar-level2{
        &:last-child{
          border: 0;
        }
      }
    }
    .level1-title{
      color: $colorPrimary;
      font-size: 20px;
      padding-bottom: 20px;
      position: relative;
      &::before{
        position: absolute;
        top: 0;
        left: -47px;
        content: '';
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 2px solid $colorPrimary;
        background: #ffffff;
        border-radius: 20px;
      }
      &::after{
        position: absolute;
        top: 7px;
        left: -40px;
        content: '';
        display: inline-block;
        width: 10px;
        height: 10px;
        background: $colorPrimary;
        border-radius: 20px;
      }
    }
  }
  .progress-bar-level2{
    position: relative;
    padding-left: 34px;
    border-left: 2px solid $colorPrimary;
    +.progress-bar-level2{
      padding-top: 50px;
    }

    .level2-p{
      font-size: 16px;
      line-height: 16px;
      &:first-child{
        position: relative;
        &::after{
          position: absolute;
          top: 0px;
          left: -40px;
          content: '';
          display: inline-block;
          width: 10px;
          height: 10px;
          background: $colorPrimary;
          border-radius: 20px;
        }
      }
      +.level2-p{
        margin-top: 15px;
      }
    }
    .level2-p-date{
      font-weight: 300;
    }
  }

  .select-layer{
    display: flex;
    justify-content: space-between;
    >>> .el-table{
      margin-left: 30px;
      width: 360px;
    }
  }
</style>
