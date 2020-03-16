<template>
  <el-dialog
    :close-on-click-modal="false"
    title="详情"
    :visible.sync="show"
    width="55%"
    append-to-body>
    <div class="details-layer">
      <div class="details-layer-left">
        <div class="progress-bar">
          <div
            v-for="(item, index) in listStepData"
            :key = index
            class="progress-bar-level1">
            <div class="progress-bar-level1-content">
              <div class="level1-title">{{item.flowState}}</div>
            </div>
            <div class="progress-bar-level2">
              <div class="level2-p level2-p-date">{{item.flowTime | date-filter}}</div>
              <el-card
                class="box-card"
                v-if="item.flowState === '排查实施'">
                <el-row class="item">
                  <el-col class="box-item-label" :span="3">检查名称:</el-col>
                  <el-col :span="9">{{item.spmHiddenInstanceHis.checkName}}</el-col>
                </el-row>
                <el-row class="item">
                  <el-col class="box-item-label" :span="3">检查人:</el-col>
                  <el-col :span="9">{{item.spmHiddenInstanceHis.checkUser}}</el-col>
                </el-row>
                <el-row class="item">
                  <el-col class="box-item-label" :span="3">检查时间:</el-col>
                  <el-col :span="9">{{item.spmHiddenInstanceHis.checkTime | date-filter}}</el-col>
                </el-row>
                <el-row class="item">
                  <el-col class="box-item-label" :span="24">隐患图片:</el-col>
                </el-row>
                <el-row class="item">
                  <el-col :span="24">
                    <div class="attachment-list">
                      <div
                        v-for = "(itemImg, index) in item.spmHiddenInstanceHis.hiddenPhotos"
                        :key = index
                        class="attachment-list-item">
                        <img
                          v-show="item.spmHiddenInstanceHis.hiddenPhotos"
                          class="attachment-img"
                          :src="itemImg"
                          alt="上传的图片" />
                      </div>
                    </div>
                  </el-col>
                </el-row>
              </el-card>
              <el-card
                class="box-card"
                v-if="item.flowState === '排查复核'">
                <el-row class="item">
                  <el-col class="box-item-label" :span="3">排查复核人:</el-col>
                  <el-col :span="9">{{item.spmHiddenInstanceHis.checkByUser}}</el-col>
                </el-row>
                <el-row class="item">
                  <el-col class="box-item-label" :span="3">隐患类型:</el-col>
                  <el-col :span="9">{{item.spmHiddenInstanceHis.hiddenType}}</el-col>
                </el-row>
                <el-row class="item">
                  <el-col class="box-item-label" :span="3">整改时间:</el-col>
                  <el-col :span="9">{{item.spmHiddenInstanceHis.rectiTime | date-filter}}</el-col>
                </el-row>
                <el-row class="item">
                  <el-col class="box-item-label" :span="3">整改意见:</el-col>
                  <el-col :span="9">{{item.spmHiddenInstanceHis.rectiRemark}}</el-col>
                </el-row>
                <el-row class="item">
                  <el-col class="box-item-label" :span="3">隐患描述:</el-col>
                  <el-col :span="9">{{item.spmHiddenInstanceHis.hiddenDesc}}</el-col>
                </el-row>
              </el-card>
              <el-card
                class="box-card"
                v-if="item.flowState === '隐患治理'">
                <el-row class="item">
                  <el-col class="box-item-label" :span="3">整改人:</el-col>
                  <el-col :span="9">{{item.spmHiddenInstanceHis.goverUser}}</el-col>
                </el-row>
                <el-row class="item">
                  <el-col class="box-item-label" :span="3">整改时间:</el-col>
                  <el-col :span="9">{{item.spmHiddenInstanceHis.goverTime | date-filter}}</el-col>
                </el-row>
                <el-row class="item">
                  <el-col class="box-item-label" :span="3">整改记录:</el-col>
                  <el-col :span="9">{{item.spmHiddenInstanceHis.rectiRecord}}</el-col>
                </el-row>
                 <el-row class="item">
                  <el-col class="box-item-label" :span="24">整改图片:</el-col>
                </el-row>
                <el-row class="item">
                  <el-col :span="24">
                    <div class="attachment-list">
                      <div
                        v-for = "(itemImg, index) in item.spmHiddenInstanceHis.rectiPhotos"
                        :key = index
                        class="attachment-list-item">
                        <img
                          v-show="item.spmHiddenInstanceHis.rectiPhotos"
                          class="attachment-img"
                          :src="itemImg"
                          alt="上传的图片" />
                      </div>
                    </div>
                  </el-col>
                </el-row>
              </el-card>
              <el-card
                class="box-card"
                v-if="item.flowState === '治理复核'">
                <el-row class="item">
                  <el-col class="box-item-label" :span="3">治理复核人:</el-col>
                  <el-col :span="9">{{item.spmHiddenInstanceHis.goverReviUser}}</el-col>
                </el-row>
                <el-row class="item">
                  <el-col class="box-item-label" :span="3">治理复核时间:</el-col>
                  <el-col :span="9">{{item.spmHiddenInstanceHis.goverReviTime | date-filter}}</el-col>
                </el-row>
                <el-row class="item">
                  <el-col class="box-item-label" :span="3">治理复核记录:</el-col>
                  <el-col :span="9">{{item.spmHiddenInstanceHis.goverReviRecord}}</el-col>
                </el-row>
                 <el-row class="item">
                  <el-col class="box-item-label" :span="24">治理复核图片:</el-col>
                </el-row>
                <el-row class="item">
                  <el-col :span="24">
                    <div class="attachment-list">
                      <div
                        v-for = "(itemImg, index) in item.spmHiddenInstanceHis.goverReviPhotos"
                        :key = index
                        class="attachment-list-item">
                        <img
                          v-show="item.spmHiddenInstanceHis.goverReviPhotos.length > 0"
                          class="attachment-img"
                          :src="itemImg"
                          alt="上传的图片" />
                      </div>
                    </div>
                  </el-col>
                </el-row>
              </el-card>
            </div>

          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import axios from '@/api/axios'
import moment from 'moment'
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
    }
  },
  data () {
    return {
      show: false,
      detailsData: null,
      listStepData: null,
      currentId: ''
    }
  },
  filters: {
    // 格式化日期格式
    'date-filter' (value) {
      if (value) {
        return moment(value).format('YYYY-MM-DD  HH: mm: ss')
      } else {
        return null
      }
    }
  },
  mounted () {
    this.currentId = this.id
    this.fetchDetailsData()
  },
  methods: {
    fetchDetailsData () {
      axios
        .get('hiddenAct/impleDetail', {
          businessKey: this.currentId
        })
        .then((res) => {
          if (res.data.code === 200) {
            this.detailsData = res.data.data.spmHiddenInstanceHis
            this.listStepData = res.data.data
          }
        })
    }
  },
  watch: {
    id: {
      immediate: true,
      handler (val, oldVal) {
        this.currentId = val
        this.fetchDetailsData(val)
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
@import '@/utils/css/tools/_variables.scss';
  .box-card {
    margin-top: 20px;
    +.box-card {
      margin-top: 20px;
    }
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
  }
  .details-layer{
    // display: flex;
  }
  .details-layer-left{
    // flex: 0 0 300px;
    padding-left: 46px;
    // max-height: 686px;
    // overflow-y: scroll;
  }
  .details-layer-right{
    flex: 1;
    max-height: 686px;
    overflow-y: scroll;
  }
  .progress-bar{
    // border-left: 2px solid $colorPrimary;
    // padding-left: 34px;
    // .box-card{
    //   border-left: 2px solid $colorPrimary;
    // }
  }
  .progress-bar-level1{
    + .progress-bar-level1{
      .progress-bar-level1-content{
        padding-top: 45px;
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
