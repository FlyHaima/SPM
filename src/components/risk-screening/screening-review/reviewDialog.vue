<template>
  <el-dialog
    title="复核"
    :visible.sync="show"
    width="50%">
    <div class="details-layer">
      <div class="details-layer-right">
        <el-card class="box-card">
          <el-row class="item">
            <el-col class="box-item-label" :span="3">检查名称:</el-col>
            <el-col :span="9">1</el-col>
          </el-row>
          <el-row class="item">
            <el-col class="box-item-label" :span="3">检查人员:</el-col>
            <el-col :span="9">1</el-col>
            <el-col class="box-item-label" :span="3">检查地点:</el-col>
            <el-col :span="9">1</el-col>
          </el-row>
          <el-row class="item">
            <el-col class="box-item-label" :span="3">检查时间:</el-col>
            <el-col :span="9">1</el-col>
            <el-col class="box-item-label" :span="3">操作:</el-col>
            <el-col :span="9">
              <el-radio-group v-model="radio">
                <el-radio :label="3">退回</el-radio>
                <el-radio :label="6">隐患治理</el-radio>
                <el-radio :label="9">转复核人</el-radio>
              </el-radio-group>
            </el-col>
          </el-row>
          <el-row class="item">
            <el-col class="box-item-label" :span="3">转发人:</el-col>
            <el-col :span="9">
              <el-select v-model="value" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row class="item">
            <el-col class="box-item-label" :span="24">隐患图片:</el-col>
          </el-row>
          <el-row class="item">
            <el-col :span="24">
              <div class="attachment-list">
                <div
                  class="attachment-list-item">
                  <img
                    class="attachment-img"
                    src=""
                    alt="上传的图片" />
                </div>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </div>
    </div>

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
      },
      radio: 3,
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      value: ''
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
