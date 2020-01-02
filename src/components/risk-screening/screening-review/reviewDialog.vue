<template>
  <el-dialog
    title="复核"
    :visible.sync="show"
    width="40%">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-form">
      <el-form-item label="处理方式" prop="way" >
        <el-radio-group v-model="form.way" @change="waySelChange">
          <el-radio label="治理"></el-radio>
          <el-radio label="回退"></el-radio>
        </el-radio-group>
      </el-form-item>
      <div v-show="showGovernContent">
        <el-form-item label="隐患类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择隐患类型">
            <el-option label="一般隐患" value="normal"></el-option>
            <el-option label="重大隐患" value="majorHazard"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="整改时间" required>
          <el-col :span="11">
            <el-form-item prop="date">
              <el-date-picker
                v-model="form.date"
                type="datetime"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="整改意见" prop="opinion">
          <el-input
            type="textarea"
            v-model="form.opinion"
            maxlength="200"
            show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="治理人员" prop="user">
          <el-select v-model="form.user" placeholder="请选择治理人员">
            <el-option label="一般隐患" value="normal"></el-option>
            <el-option label="重大隐患" value="majorHazard"></el-option>
          </el-select>
        </el-form-item>
      </div>
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
      showGovernContent: true, // 治理内容填写开关
      form: {
        way: '治理',
        type: '',
        date: '',
        opinion: '',
        user: ''
      },
      rules: {
        way: [
          { required: true, message: '请选择一种处理方式', trigger: 'change' }
        ],
        date: [
          { type: 'date', required: true, message: '请选择整改时间', trigger: 'change' }
        ],
        user: [
          { required: true, message: '请选择治理人员', trigger: 'change' }
        ],
        type: [
          { required: true, message: '请选择隐患类型', trigger: 'change' }
        ],
        opinion: [
          { required: true, message: '请填写整改意见', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    waySelChange (val) {
      if (val === '治理') {
        this.showGovernContent = true
      } else {
        this.showGovernContent = false
      }
    }
  },
  watch: {
    dialogVisible (val) {
      this.show = val
    },
    show (val) {
      this.$emit('on-dialog-change', val)
    },
    submitForm () {

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
</style>
