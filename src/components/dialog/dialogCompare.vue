<!-- 从机构树中选择人员信息的弹出框 -->
<!-- 说明：
  * 1、属性：dialogVisible：控制弹框显示的开关
  * 2、属性：dialogData：接收父组件传过来的数据
  * 3、事件：on-dialog-change：回传父组件弹框的显示状态
  * 4、事件：select-data：回传父组件需要的数据
 -->
<template>
  <el-dialog
    @close="closeDialog()"
    :close-on-click-modal="false"
    :visible.sync="show"
    width="80%">
    <template slot="title">
      {{dialogData.title || '弹框'}}
    </template>
    <div class="dialog-box">
      <div class="dialog-right-layout">
        <el-form
          @submit.native.prevent="searchHandler"
          :inline="true"
          size="small"
          class="table-form">
          <el-form-item label="分析类型">
            <el-select
              v-model="form.state"
              placeholder="请选择分析类型">
              <el-option
                v-for="(item, index) in searchTypeOpt"
                :key="index"
                :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="层级">
            <el-select
              v-model="form.state"
              placeholder="请选择层级">
              <el-option
                v-for="(item, index) in searchTypeOpt"
                :key="index"
                :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="查询种类">
            <el-select
              v-model="form.searchType"
              placeholder="请选择查询种类"
              @change="selectChangeSearchType">
              <el-option
                v-for="(item, index) in searchTypeOpt"
                :key="index"
                :label="item"
                :value="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="查询时间">
            <span v-show="form.searchType === 0">
              <el-date-picker
                v-model="form.searchTime1"
                value-format="yyyy-mm-dd"
                type="date"></el-date-picker>
              -
              <el-date-picker
                v-model="form.searchTime2"
                value-format="yyyy-mm-dd"
                type="date"></el-date-picker>
            </span>
            <span v-show="form.searchType === 1">
              <el-date-picker
                v-model="form.searchTime1"
                type="month"
                value-format="mm"></el-date-picker>
              -
              <el-date-picker
                v-model="form.searchTime2"
                type="month"
                value-format="mm"></el-date-picker>
            </span>
            <span v-show="form.searchType === 2">
              <el-date-picker
                v-model="form.searchTime1"
                type="year"
                value-format="yyyy"></el-date-picker>
              -
              <el-date-picker
                v-model="form.searchTime2"
                type="year"
                value-format="yyyy"></el-date-picker>
            </span>
            <span v-show="form.searchType === 3">
              <el-date-picker
                v-model="searchTime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"></el-date-picker>
            </span>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              native-type="submit"
            >查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button
              class="export-btn"
              type="success"
              @click="exportHandler">导出</el-button>
          </el-form-item>
        </el-form>
        <!-- <el-row class="form-group-btn">
          <el-col>
            <el-form-item>
              <el-button
                type="primary"
                native-type="submit"
              >查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button
                class="export-btn"
                type="success"
                @click="exportHandler">导出</el-button>
            </el-form-item>
          </el-col>
        </el-row> -->
        <el-table
          :data="tableData"
          border
          style="width: 100%">
          <el-table-column
            prop="date"
            v-for="(item, index) in tableData"
            :key="index"
            align="center">
            <template slot="header" slot-scope="scope">
               {{tableHeaderData[scope.$index]}}
            </template>
            <template slot-scope="scope">
              {{scope.row[scope.$index]}}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'treeDiagram',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    dialogData: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      submitting: false,
      show: false,
      searchTime: '',
      form: {
        state: '',
        searchType: 0, // 查询种类
        searchTime1: '',
        searchTime2: '',
        beginTime: '',
        endTime: ''
      },
      tableHeaderData: ['列1', '列2', '列3'],
      tableData: [
        ['2016-05-02', '王小虎', 'abc'],
        ['2016-05-03', '王小虎1', 'bcd'],
        ['2016-05-04', '王小虎2', 'efg']
      ],
      searchTypeOpt: [
        '按日查询',
        '按月查询',
        '按年查询',
        '按时间段查询'
      ],
      searchTypeOpt1: [
        {
          label: '按日期查询',
          value: 0
        },
        {
          label: '按月份查询',
          value: 1
        },
        {
          label: '按年度查询',
          value: 2
        },
        {
          label: '按时间区间查询',
          value: 3
        }
      ]
    }
  },
  created () {
    this.initData()
  },
  methods: {
    // 初始化数据
    initData () {
    },
    // 关闭弹框
    closeDialog () {
      this.show = false
    },
    exportHandler () {
    },
    selectChangeSearchType (value) {
      this.form.searchType = value
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

<style scoped lang="scss">
  .layout-around{
    display: flex;
    padding-top: 20px;
    .item-left{
      flex: 0 0 340px;
    }
    .item-right{
      width: 100%;
      // width: calc(100% - 200px);
      height: 100%;
      // margin-left: 40px;
    }
  }
  .dialog-right-layout{
    width: 100%;
  }
  .form-left{
    .el-form-item{
      margin-bottom: 0;
    }
  }
  .dialog-title{
    font-size: 16px;
    color: #666666;
  }
  .form-group-btn{
    height: 40px;
  }
</style>
