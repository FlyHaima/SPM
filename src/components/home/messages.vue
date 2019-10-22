<template>
  <div class="message-wrap">
    <div class="info-panel">
      <div class="info-header">
        <div class="info-title">
          <span class="info-title-txt">所有消息</span>
        </div>
        <div class="info-link">
          <el-button type="primary" size="mini">全部标记为已读</el-button>
        </div>
      </div>
      <div class="info-content">
        <ul class="list-info">
          <li class="list-info-item">
            <div class="list-info-title">
              <span class="list-info-txt"><span class="list-info-type">[下线通知]</span>你的安全清单并未完善，请点击这里</span>
            </div>
            <div class="list-info-right">
              <i class="icon-clock"></i>
              <span class="list-info-date">2019-08-06</span>
              <span class="list-info-time">10：32</span>
              <i class="el-icon-delete"></i>
            </div>
          </li>
          <li class="list-info-item list-info-item-light">
            <div class="list-info-title">
              <span class="list-info-txt"><span class="list-info-type">[下线通知]</span>你的安全清单并未完善，请点击这里</span>
            </div>
            <div class="list-info-right">
              <i class="icon-clock"></i>
              <span class="list-info-date">2019-08-06</span>
              <span class="list-info-time">10：32</span>
              <i class="el-icon-delete"></i>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'messages',
  data () {
    return {

    }
  }
}
</script>
<style lang="scss" scoped>
  $colorPrimary: #409eff;
  .message-wrap{
    padding: 36px;
  }
  .info-panel{
    margin-top: 10px;
  }
  .info-header{
    display: flex;
    justify-content: space-between;
    color: #333333;
    font-size: 16px;
    padding: 10px 0;
    border-bottom: 1px solid #888888;
  }
  .info-title{
    border-left: 2px solid $colorPrimary;
  }
  .info-title-txt{
    font-size: 16px;
    line-height: 16px;
    margin-left: 10px;
  }
  .info-link-txt{
    line-height: 16px;
    color: #333333;
  }
  .list-info{
    padding-top: 20px;
    // max-height: 224px;
    // overflow-y: scroll;
  }
  .list-info-item{
    display: flex;
    justify-content: space-between;
    position: relative;
    font-size: 14px;
    padding: 18px 0px 18px 0px;
    border-bottom: 1px solid #959595;
    &.list-info-item-light{
      font-weight: 500;
    }
  }
  .list-info-title{
    position: relative;
    max-width: 370px;
  }
  .list-info-txt{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #333333;
  }
  .list-info-type{
    margin-right: 4px;
  }
  .list-info-date{
    display: inline-block;
    vertical-align: top;
    margin-left: 10px;
  }
  .list-info-time{
    display: inline-block;
    vertical-align: top;
    margin-left: 20px;
  }
  .icon-clock{
    display: inline-block;
    color: #000;
    position: absolute;
    margin-left: 2px;
    margin-top: 2px;
    width: 15px;
    height: 15px;
    position: relative;
    border: solid 1px currentColor;
    border-radius: 8px;
    &::before{
      content: '';
      position: absolute;
      top: 7px;
      left: 7px;
      width: 5px;
      height: 1px;
      background-color: currentColor;
      -webkit-transform-origin: 0% 0%;
              transform-origin: 0% 0%;
    }
    &::after{
      content: '';
      position: absolute;
      top: 2px;
      left: 7px;
      width: 1px;
      height: 6px;
      background-color: currentColor;
      -webkit-transform-origin: 0% 0%;
              transform-origin: 0% 0%;
    }
  }
  .el-icon-delete{
    vertical-align: top;
    margin-top: 2px;
    margin-left: 10px;
  }
</style>
