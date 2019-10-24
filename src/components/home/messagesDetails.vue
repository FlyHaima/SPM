<template>
  <div class="view-box">
    <div class="view-header is-flex-end">
      <div @click="goBack" class="view-header-links">
        <i class="icon-retrun"></i>
        <span class="view-header-links-text">返回消息列表</span>
      </div>
    </div>
    <div class="details-header">
      <div class="details-header-author">
        <span class="author-text-pre">来自</span>
        <el-avatar class="author-avatar" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
        <div class="author-content">
          <div class="author-title">刘一手</div>
          <div class="author-date">
            <span>2019-08-06</span>
            <span>10: 32: 22</span>
          </div>
        </div>
      </div>
    </div>
    <div class="details-container">
      <div class="details-title">
        电压站-电压器新隐患审批报告
      </div>
      <div class="details-content">
        <p class="details-content-item">在日常的生产过程或社会活动中,由于人的因素,物的变化以及环境的影响等会产生各种各样的问题、缺陷、故障、苗头、隐 于人的因素,物的变化以及环境的影响等会产生各种各样的问题、缺陷、故障、苗头、隐患等不安全因素。 在日常的生产过程或社会活动中,由于人的因素,物的变化以及环境的影响等会产生各种各样的问题、缺陷、故障、苗头、隐患等不安全因素。</p>
        <p class="details-content-item">在日常的生产过程或社会活动中,由于人的因素,物的变化以及环境的影响等会产生各种各样的问题、缺陷、故障、苗头、隐 于人的因素,物的变化以及环境的影响等会产生各种各样的问题、缺陷、故障、苗头、隐患等不安全因素。 在日常的生产过程或社会活动中,由于人的因素,物的变化以及环境的影响等会产生各种各样的问题、缺陷、故障、苗头、隐患等不安全因素。</p>
      </div>
    </div>
    <div class="details-attachment ">
      <div class="attachment-title">附件</div>
      <div class="attachment-list">
        <div class="attachment-list-item">
          <img class="attachment-img" src="" alt="">
        </div>
        <div class="attachment-list-item">
          <img class="attachment-img" src="" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'messagesDetails',
  data () {
    return {

    }
  },
  methods: {
    goBack () {
      this.$router.back()
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../utils/css/style.scss';
  .view-box{
    width: 100%;
    min-height: 100%;
    background: #ffffff;
  }
  .view-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 25px 44px;
    line-height: 66px;
    border-bottom: 1px solid $colorBorder;
    &.is-flex-end{
      justify-content: flex-end;
    }
  }
  .view-header-left{
    display: inline-block;
    font-size: 0;
    line-height:  13px;
  }
  .view-header-icon{
    display: inline-block;
    width: 17px;
    height: 13px;
    background-image: url('../../assets/img/home/icon-symbol01.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
  .view-header-txt{
    font-size: 16px;
    line-height: 13px;
    margin-left: 26px;
    color: $colorText;
  }
  .view-header-links{
    font-size: 16px;
    color: $colorPrimary;
    line-height: 16px;
    cursor: pointer;
  }
  .view-header-links-text{
    display: inline-block;
  }
  .icon-retrun{
    display: inline-block;
    color: $colorPrimary;
    position: relative;
    top: -1px;
    margin-right: 10px;
    width: 10px;
    height: 1px;
    background-color: currentColor;
    vertical-align: middle;
    &::after{
      content: '';
      width: 16px;
      height: 16px;
      position: absolute;
      top: -8px;
      left: -4px;
      border: 1px solid $colorPrimary;
      border-radius: 16px;
    }
    &::before{
      content: '';
      position: absolute;
      left: 1px;
      top: -2px;
      width: 4px;
      height: 4px;
      border-top: solid 1px currentColor;
      border-right: solid 1px currentColor;
      -webkit-transform: rotate(-135deg);
              transform: rotate(-135deg);
    }
  }
  .details-header{
    display: flex;
  }
  .details-header-author{
    display: flex;
    align-items: center;
    width: 100%;
    font-size: 16px;
    padding: 12px 36px 12px;
    border-bottom: 1px solid $colorBorder;
  }
  .author-avatar{
    width: 76px;
    height: 76px;
    margin-left: 30px;
  }
  .author-text-pre{
    color: $colorText;
  }
  .author-content{
    margin-left: 20px;
  }
  .author-title{

  }
  .author-date{
    margin-top: 20px;
    color: $colorTextLight;
  }
  .details-container{
    padding: 0 36px;
    border-bottom: 1px solid $colorBorder;
  }
  .details-title{
    font-size: 24px;
    color: $colorText;
    padding: 30px 0;
    border-bottom: 1px dashed $colorBorder;
  }
  .details-content{
    padding: 20px 0;
    color: $colorTextLight;
    font-size: 16px;
    line-height: 36px;
    min-height: 376px;
  }
  .details-attachment{
    padding: 0 36px;
    min-height: 370px;
  }
  .attachment-title{
    color: $colorPrimary;
    font-size: 16px;
    padding: 36px 0;
  }
  .attachment-list{
    display: flex;
    flex-wrap: wrap;
  }
  .attachment-list-item{
    width: 143px;
    height: 113px;
    margin-right: 43px;
  }
  .attachment-img{
    display: inline-block;
    width: 143px;
    height: 113px;
    background: pink;
    border-radius: 6px;
  }
</style>
