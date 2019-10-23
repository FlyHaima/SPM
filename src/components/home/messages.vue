<template>
<div class="message-wrap">
  <el-tabs type="border-card">
    <el-tab-pane label="我发布的">
      <div class="">
        <div class="info-panel">
          <div class="info-header">
            <!-- <div class="info-title">
              <span class="info-title-txt">所有消息</span>
            </div> -->
            <div class="info-link">
              <el-button type="primary" size="mini">发布消息</el-button>
              <el-button type="danger" size="mini">删除当页消息</el-button>
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
                  <span class="list-info-user">发布人：王雪</span>                  <i class="el-icon-delete"></i>
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
                  <span class="list-info-user">发布人：王雪</span>
                  <i class="el-icon-delete"></i>
                </div>
              </li>
            </ul>
            <el-pagination
              class="text-right"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage4"
              :page-sizes="[100, 200, 300, 400]"
              :page-size="100"
              layout="total, sizes, prev, pager, next, jumper"
              :total="400">
            </el-pagination>
          </div>
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane label="我收到的">配置管理</el-tab-pane>
  </el-tabs>

</div>
</template>

<script>
export default {
  name: 'messages',
  data () {
    return {
      currentPage4: 4
    }
  },
  methods: {
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../utils/css/style.scss';
  .message-wrap{
    width: 100%;
    height: 100%;
    background: #ffffff;
  }
  // 重构tabs样式
  /deep/.el-tabs{
    height: 100%;
    .el-tabs__nav{
      height: 50px;
    }
    .el-tabs__item{
      height: 51px;
      line-height: 50px;
      font-size: 16px;
      color: #777777;
      &.is-active{
        color: $colorPrimary;
        border-top: 2px solid $colorPrimary;
      }
    }
    .el-tabs--border-card > .el-tabs__content{
      padding: 0;
    }
    .el-tabs__content{
      height: 100%;
      .el-tab-pane{
        height: 100%;
      }
    }
  }
  .info-panel{
    margin-top: 10px;
  }
  .info-header{
    display: flex;
    justify-content: space-between;
    color: $colorText;
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
    color: $colorText;
  }
  .list-info{
    // max-height: 224px;
    // overflow-y: scroll;
  }
  .list-info-item{
    display: flex;
    justify-content: space-between;
    position: relative;
    font-size: 14px;
    padding: 18px 0px 18px 0px;
    border-bottom: 1px solid $colorBorder;
    &.list-info-item-light{
      .list-info-type{
        font-weight: 500;
      }
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
    color: $colorText;
  }
  .list-info-type{
    margin-right: 15px;
  }
  .list-info-date{
    display: inline-block;
    vertical-align: top;
    margin-left: 10px;
  }
  .list-info-time{
    display: inline-block;
    vertical-align: top;
    margin-left: 10px;
  }
  .list-info-user{
    display: inline-block;
    vertical-align: top;
    margin-left: 24px;
  }
  .icon-clock{
    display: inline-block;
    color: $colorText;
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
    margin-left: 24px;
    color: $colorText;
  }
</style>
