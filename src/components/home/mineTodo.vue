<template>
<div class="message-wrap">
  <el-tabs
    v-model="tabType"
    type="border-card"
    @tab-click='clickTab'>
    <el-tab-pane label="我发布的" name="1">
      <span slot="label"> 待办事项<span v-show="todoNum > 0" class="badge">{{todoNum}}</span></span>
      <div class="info-panel">
        <div class="info-content">
          <div class="tips-nodata" v-if="messageData.length === 0">
            暂无待办事项
          </div>
          <template v-else>
            <ul class="list-info">
              <li
                v-for="(item, index) in messageData"
                :key="index"
                @click="goDetailsPage(item)"
                class="list-info-item list-info-item-light">
                <div class="list-info-title">
                  <span class="list-info-txt">
                    {{item.taskName}}
                  </span>
                </div>
                <div class="list-info-right">
                  <i class="icon-clock"></i>
                  <span class="list-info-date">{{item.checkTime | dateFilter}}</span>
                  <span class="list-info-time">{{item.checkTime | timeFilter}}</span>
                  <span class="list-info-user">发布人：{{item.checkUserId}}</span>
                </div>
              </li>
            </ul>
            <el-pagination
              class="text-right"
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="page.index"
              layout="total, prev, pager, next, jumper"
              :total="page.total">
            </el-pagination>
          </template>
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane label="已办事项" name="2">
      <div class="info-panel">
        <div class="info-content">
          <div class="tips-nodata" v-if="messageData.length === 0">
            暂无已办事项
          </div>
          <template v-else>
            <ul class="list-info">
              <li
                v-for="(item, index) in messageData"
                :key="index"
                class="list-info-item list-info-item-light">
                <div class="list-info-title">
                  <span class="list-info-txt">
                    {{item.taskName}}
                  </span>
                </div>
                <div class="list-info-right">
                  <i class="icon-clock"></i>
                  <span class="list-info-date">{{item.checkTime | dateFilter}}</span>
                  <span class="list-info-time">{{item.checkTime | timeFilter}}</span>
                  <span class="list-info-user">发布人：{{item.checkUserId}}</span>
                </div>
              </li>
            </ul>
            <el-pagination
              class="text-right"
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="page.index"
              layout="total, prev, pager, next, jumper"
              :total="page.total">
            </el-pagination>
          </template>
        </div>
      </div>
    </el-tab-pane>
  </el-tabs>
</div>
</template>

<script>
import axios from '@/api/axios'
import moment from 'moment'

export default {
  name: 'messages',
  data () {
    return {
      messageData: [], // 信息列表数据
      sendTime: '',
      page: {
        total: 0, // 总条数
        index: 1, // 当前页面
        pageNo: 1,
        pageSize: 10 // limit
      },
      tabType: '', // tab切换类型
      todoNum: 0,
      businessKey: '' // 跳转返回值
    }
  },
  filters: {
    // 格式化日期格式
    'dateFilter' (value) {
      if (value) {
        return moment(value).format('YYYY-MM-DD')
      } else {
        return null
      }
    },
    'timeFilter' (value) {
      if (value) {
        return moment(value).format('HH: mm: ss')
      } else {
        return null
      }
    }
  },
  created () {
    let vm = this
    // 从路由上存取当前页面的tabType
    vm.tabType = vm.$route.query.tabType
    vm.fetchList()
  },
  methods: {
    fetchList () {
      let vm = this
      let userId = sessionStorage.getItem('userId')
      if (vm.tabType === '1') {
        axios
          .get('flowAct/todoList', {
            pageNo: this.page.pageNo,
            pageSize: this.page.pageSize,
            userId: userId
          })
          .then((res) => {
            if (res.data.code === 200) {
              this.messageData = res.data.data
              this.page.total = res.data.total
              this.todoNum = res.data.total
              // this.businessKey = res.data.data.businessKey
              // console.log(res.data.data)
            }
          })
      } else {
        axios
          .get('flowAct/doneList', {
            pageNo: this.page.pageNo,
            pageSize: this.page.pageSize,
            userId: userId
          })
          .then((res) => {
            if (res.data.code === 200) {
              this.messageData = res.data.data
              this.page.total = res.data.total
            }
          })
      }
    },
    // 切换分页数量
    handleSizeChange (val) {
      this.fetchList()
    },
    // 切换当前页页数
    handleCurrentChange (val) {
      this.page.index = val
      this.page.pageNo = val
      this.fetchList()
    },
    // tab切换事件
    clickTab (item) {
      let vm = this
      vm.tabType = (Number(item.paneName)) + ''
      // vm.$route.tabType = vm.tabType
      vm.fetchList()
    },
    // 跳转信息详情页面的点击事件
    goDetailsPage (item) {
      if (item.name === '排查实施') {
        this.$router.push({
          name: 'screeningImplementation',
          query: {
            tabType: item.investType,
            id: item.leftId,
            hiddInstanceId: item.businessKey
          }
        })
      } else if (item.name === '排查复核') {
        this.$router.push({
          name: 'screeningReview',
          query: {
            tabType: item.investType,
            id: item.leftId,
            hiddInstanceId: item.businessKey
          }
        })
      } else if (item.name === '隐患治理') {
        this.$router.push({
          name: 'riskManagement',
          query: {
            tabType: item.investType,
            id: item.leftId,
            hiddInstanceId: item.businessKey
          }
        })
      } else if (item.name === '治理复核') {
        this.$router.push({
          name: 'managementReview',
          query: {
            tabType: item.investType,
            id: item.leftId,
            hiddInstanceId: item.businessKey
          }
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  @import '@/utils/css/tools/_variables.scss';
  .message-wrap{
    width: 100%;
    height: 100%;
    background: #ffffff;
  }
  // 可以提出公用的样式
  .badge{
    display: inline-block;
    background: $colorRed;
    border-radius: 10px;
    min-width: 18px;
    min-height: 8px;
    color: #ffffff;
    font-size: 14px;
    line-height: 14px;
    padding: 3px;
    text-align: center;
    &.is-dot{
    }
  }
   // icon
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
  // 页面样式
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
    margin-bottom: 30px;
  }
  .list-info-item{
    display: flex;
    justify-content: space-between;
    position: relative;
    cursor: pointer;
    font-size: 14px;
    padding: 10px 0px 10px 0px;
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
    position: relative;
    .badge{
      position: absolute;
      top: -3px;
      left: -3px;
    }
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

  // 修改组件样式
  .el-icon-delete{
    vertical-align: top;
    margin-top: 2px;
    margin-left: 24px;
    color: $colorText;
  }
  .form-modal >>>{
    .el-form{
      // width: 880px;
      margin: 0 auto;
    }
    .el-input{
      // width: 240px;
    }
  }
</style>
