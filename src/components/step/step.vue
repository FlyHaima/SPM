<!--
-- 实际状态应该是5个
-- 0：未辨识；
-- 1-3：辨识中；
-- 4：已辨识
-->
<template>
  <div class="step-box" :class="'step-'+active+'-box'">
    <div class="steps" v-for="(item, index) in step" :key="index" :class="['step-'+(index+1)]">
      <div class="line-right" :class="active<item+1 ? '' : 'active'"></div>
      <div class="line-left" :class="active<item ? '' : 'active'"></div>
      <div class="step-icon" :class="active<item ? '' : 'active'">{{item}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'step',
  props: {
    active: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      step: [1, 2, 3, 4] // 设置全过程4步
    }
  }
}
</script>

<style scoped lang="scss">
.step-box {
  /*padding: 0 20px;*/
  width: 100%;
  height: 26px;
  display: flex;
  justify-content: space-between;
  .steps{
    width: 25%;
    position: relative;
    .line-right{
      position: absolute;
      width: 50%;
      right: 0;
      top: 9.5px;
      height: 5px;
      background: #e7e7e7;
      &.active{
        background: #409eff;
      }
    }
    .line-left{
      position: absolute;
      width: 50%;
      left: 0;
      top: 9.5px;
      height: 5px;
      background: #e7e7e7;
      &.active{
        background: #409eff;
      }
    }
    .step-icon{
      position: absolute;
      left: 50%;
      top: 3px;
      margin-left: -9.5px;
      width: 19px;
      height: 19px;
      line-height: 19px;
      background: #e7e7e7;
      border-radius: 50%;
      color: #fff;
      &.active{
        top: 2px;
        margin-left: -11px;
        width: 22px;
        height: 21px;
        background: url("../../assets/img/step-active-icon.png") no-repeat;
        line-height: 21px;
        text-align: center;
      }
    }
    &.step-1{
      .line-left{
        display: none;
      }
    }
    &.step-4{
      .line-right{
        display: none;
      }
    }
  }
}
</style>
