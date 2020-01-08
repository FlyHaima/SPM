<template>
  <el-dialog
    title="复核"
    :visible.sync="show"
    width="40%">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-form">
      <el-form-item label="处理方式" prop="way" >
        <el-radio-group v-model="form.handleType" @change="waySelChange">
          <el-radio
            v-for="(item, index) in listWay"
            :key="index"
            :label="item.value"></el-radio>
          <!-- <el-radio label="回退"></el-radio> -->
        </el-radio-group>
      </el-form-item>
      <div v-show="showGovernContent">
        <el-form-item label="隐患类型" prop="hiddenType">
          <el-select size="medium" v-model="form.hiddenType" placeholder="请选择隐患类型">
            <el-option label="一般隐患" value="一般隐患"></el-option>
            <el-option label="重大隐患" value="重大隐患"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="整改时间" required>
          <el-col :span="11">
            <el-form-item prop="rectiTime">
              <el-date-picker
                size="medium"
                v-model="form.rectiTime"
                type="datetime"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="整改意见" prop="rectiRemark">
          <el-input
            size="medium"
            type="textarea"
            v-model="form.rectiRemark"
            maxlength="200"
            show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="治理人员" prop="nextUserId">
          <el-input
            size="medium"
            v-model="form.nextUserId"
            :disabled="true"
            class="input-with-select">
            <el-button @click="selectUser()" slot="append" type="primary">选择治理人员</el-button>
          </el-input>
          <!-- <el-button
          type="primary"
          size="small"
          @click="selectUser()">选择治理人员</el-button>
          <el-input v-model="form.nextUserId" :disabled="true"></el-input> -->
          <!-- <el-select v-model="form.nextUserId" placeholder="请选择治理人员">
            <el-option
              v-for= "(item, index) in nextUserIdOptions"
              :key = "index"
              label="item.label"
              value="normal"
              ></el-option>
            <el-option label="重大隐患" value="majorHazard"></el-option>
          </el-select> -->
        </el-form-item>
      </div>
    </el-form>
    <el-dialog
      :title="'选择排查复核人'"
      :visible.sync="showTree"
      width="80%"
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
            width="120"
            align="center"
            prop="userName">
          </el-table-column>
          <el-table-column
            label="联系方式"
            width="120"
            align="center"
            prop="telephone">
          </el-table-column>
          <el-table-column
            label="主要职责"
            align="center"
            prop="duty">
          </el-table-column>
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
        @click="show = false">取 消</el-button>
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
    id: {
      type: String,
      default: ''
    },
    procInstId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      submitting: false,
      show: false,
      showTree: false,
      showGovernContent: true, // 治理内容填写开关
      form: {
        procInstId: '',
        taskid: '',
        handleType: '', // 处理方式
        hiddenType: '', // 隐患类型
        rectiTime: '', // 整改时间
        rectiRemark: '', // 整改意见
        nextUserId: '' // 处理人
      },
      rules: {
        handleType: [
          { required: true, message: '请选择一种处理方式', trigger: 'change' }
        ],
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
      currentId: '', // 当前id
      listWay: null, // 处理方式
      nextUserIdOptions: [
        {
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }
      ], // 复核人列表
      workTree: [], // 工作小组树数据
      workData: [],
      currentRow: null,
      deptId: '',
      currentProcInstId: ''
    }
  },
  components: {
    TreeDiagram
  },
  mounted () {
    this.currentId = this.id
    this.currentProcInstId = this.procInstId
  },
  methods: {
    // 初始化处理方式数据
    initFormData () {
      axios
        .get('hiddenAct/initAct', {
          taskId: this.currentId
        })
        .then((res) => {
          if (res.data.code === 200) {
            this.listWay = res.data.data[1]
          }
        })
    },
    // 获取复核人列表
    fetchNextUser () {
      axios
        .get('hiddenAct/chooseDeptUser')
        .then((res) => {
          if (res.data.code === 200) {
            // this.nextUserIdOptions = res.data.data
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
            console.log(this.workTree)
          }
        })
    },
    // 获取工作小组table数据
    fetchWorkTableData () {
      axios
        .get('workUser/getList', {
          deptId: this.deptId,
          pageNo: 1,
          pageSize: 1
        })
        .then((res) => {
          if (res.data.code === 200) {
            this.workData = res.data.data
          }
        })
    },
    // 处理方式切换
    waySelChange (val) {
      if (val === '退回') {
        this.showGovernContent = false
        // 清空表单的值
        Object.keys(this.form).forEach(key => {
          // this.form[key] = ''
          this.form.hiddenType = '' // 隐患类型
          this.form.rectiTime = '' // 整改时间
          this.form.rectiRemark = '' // 整改意见
          this.form.nextUserId = '' // 处理人
        })
      } else {
        this.showGovernContent = true
      }
    },
    // 提交表单操作
    submitForm () {
      let vm = this
      this.form.taskid = this.currentId
      this.form.procInstId = this.currentProcInstId
      vm.$refs.form.validate((valid) => {
        if (valid) {
          vm.show = true
          axios
            .post('hiddenAct/auditorAct', vm.form)
            .then((res) => {
              vm.submitting = true
              if (res.data.code === 200) {
                vm.$notify.success('排查复核提交成功！')
                // this.$emit('reload')
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
    },
    selectUser () {
      this.showTree = true
      this.fetchWorkTreeData()
    },
    handleNodeClick (deptId) {
      this.deptId = deptId
      this.fetchWorkTableData()
    },
    handleCurrentChange (val) {
      this.currentRow = val
      console.log(this.currentRow)
    },
    confirmChooseList () {
      this.form.nextUserId = this.currentRow.userName
      this.showTree = false
    }
  },
  watch: {
    id: {
      immediate: true,
      handler (val, oldVal) {
        this.currentId = val
        if (this.currentId) {
          this.initFormData()
        }
      }
    },
    procInstId: {
      immediate: true,
      handler (val, oldVal) {
        this.currentProcInstId = val
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
  .el-input-group__append button.el-button {
    color: #FFF !important;
    background-color: #409EFF !important;
    border-color: #409EFF !important;
    border-radius: 0 4px 4px 0;
  }
</style>
