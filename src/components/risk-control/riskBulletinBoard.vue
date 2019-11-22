<template>
  <el-container class="inner-page-container" v-loading="pageLoading">
    <el-header class="inner-header">
      <bread-crumb :breadList="breadcrumb">
      </bread-crumb>
    </el-header>
    <el-main class="inner-main-container">
      <el-container class="inner-main-content">
        <el-aside class="inner-aside" width="408px">
          <tree-read-only
            :tree-name="'风险单元'"
            :tree-data="organizationTree"
            @open-loading="openLoading"
            @close-loading="closeLoading" >
          </tree-read-only>
        </el-aside>

        <el-main class="inner-content">
          <div class="container-box">
            <div class="content-tools is-flex-end">
              <div class="tools-right">
                <el-button
                  type="success"
                  size="medium"
                  icon="el-icon-download"
                  @click="exportEexcel">
                   导出</el-button>
              </div>
            </div>
            <el-table
              :data="tableData"
              border
              style="width: 100%">
              <el-table-column
                prop="workshop"
                label="风险点位置"
                width="180">
              </el-table-column>
              <el-table-column
                prop="jobs"
                label="主要风险因素"
                width="180">
              </el-table-column>
              <el-table-column
                prop="mianRisk"
                label="可能导致事故类型">
              </el-table-column>
              <el-table-column
                prop="riskFactor"
                label="主要管控措施">
              </el-table-column>
              <el-table-column
                prop="hazardType"
                label="主要应急措施">
              </el-table-column>
            </el-table>
            <div class="custom-table">
              <div class="custom-table-header">重大风险点公告栏</div>
              <div class="custom-tbody is-inline">
                <div class="custom-tr">
                  <div class="custom-th-label">风险点位置</div>
                  <div class="custom-td-value">dd</div>
                </div>
                <div class="custom-tr">
                  <div class="custom-th-label">主要风险因素</div>
                  <div class="custom-td-value">dd</div>
                </div>
                <div class="custom-tr">
                  <div class="custom-th-label">可能导致事故类型</div>
                  <div class="custom-td-value">
                    <el-select
                      v-model="value1"
                      multiple
                      placeholder="请选择"
                      @change="selChange">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        >
                      </el-option>
                    </el-select>
                  </div>
                </div>
                <div class="custom-tr">
                  <div class="custom-th-label">主要管控措施</div>
                  <div class="custom-td-value">
                    <el-select
                      v-model="value2"
                      multiple
                      placeholder="请选择"
                      @change="selChange2">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        >
                      </el-option>
                    </el-select>
                  </div>
                </div>
                <div class="custom-tr">
                  <div class="custom-th-label">主要应急措施</div>
                  <div class="custom-td-value">dd</div>
                </div>
              </div>
              <div class="custom-tbody">
                <div class="custom-tr text-center">
                  <div class="custom-td-value">
                    <div class="custom-td-img-list">
                      <div
                        v-for="(item,index) in imgPathSel"
                        class="img-list-item"
                        :key="index">
                        <img class="item-img" :src="item.imgPath" alt="">
                      </div>
                      <div
                        v-for="(item,index) in imgPathSel1"
                        class="img-list-item"
                        :key="index">
                        <img class="item-img" :src="item.imgPath" alt="">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-main>
      </el-container>
    </el-main>
  </el-container>
</template>
<script>
import BreadCrumb from '../Breadcrumb/Breadcrumb'
import TreeReadOnly from '../tree-diagram/treeReadOnly'
// import qs from 'qs'

export default {
  name: 'riskBulletinBoard',
  data () {
    return {
      breadcrumb: ['风险辨识评估', '风险划分'],
      pageLoading: false,
      organizationTree: [
        {
          'children': [
            {
              'children': [
                {
                  'children': [
                    {
                      'children': [
                        {
                          'children': null,
                          'riskId': '1ak070000001',
                          'riskName': '前端下的风险点',
                          'riskLevelCode': '2',
                          'pId': '6',
                          'orderNo': 1,
                          'level': '4'
                        },
                        {
                          'children': null,
                          'riskId': '1ak070000002',
                          'riskName': '前端下的风险点',
                          'riskLevelCode': '1',
                          'pId': '6',
                          'orderNo': 2,
                          'level': '4'
                        },
                        {
                          'children': null,
                          'riskId': '1ak070000003',
                          'riskName': '前端下的风险点',
                          'riskLevelCode': '3',
                          'pId': '6',
                          'orderNo': 3,
                          'level': '4'
                        }
                      ],
                      'riskId': '6',
                      'riskName': '前端',
                      'riskLevelCode': null,
                      'pId': '4',
                      'orderNo': null,
                      'level': '3'
                    },
                    {
                      'children': null,
                      'riskId': '1',
                      'riskName': '测试风险点',
                      'riskLevelCode': '3',
                      'pId': '4',
                      'orderNo': 1,
                      'level': '4'
                    },
                    {
                      'children': null,
                      'riskId': '2',
                      'riskName': '风险点2',
                      'riskLevelCode': '3',
                      'pId': '4',
                      'orderNo': 2,
                      'level': '4'
                    }
                  ],
                  'riskId': '4',
                  'riskName': '技术部1',
                  'riskLevelCode': null,
                  'pId': '11',
                  'orderNo': null,
                  'level': '2'
                }
              ],
              'riskId': '11',
              'riskName': '黑龙江多米科技有限公司',
              'riskLevelCode': null,
              'pId': '1',
              'orderNo': null,
              'level': '1'
            },
            {
              'children': [
                {
                  'children': null,
                  'riskId': '1a9020000003',
                  'riskName': '测试组织节点12',
                  'riskLevelCode': '3',
                  'pId': '1a9020000001',
                  'orderNo': null,
                  'level': '2'
                },
                {
                  'children': null,
                  'riskId': '1a9020000006',
                  'riskName': '测试组织节点555',
                  'riskLevelCode': '0',
                  'pId': '1a9020000001',
                  'orderNo': null,
                  'level': '2'
                },
                {
                  'children': null,
                  'riskId': '1aa020000002',
                  'riskName': '测试组织节点5',
                  'riskLevelCode': '1',
                  'pId': '1a9020000001',
                  'orderNo': null,
                  'level': '2'
                },
                {
                  'children': null,
                  'riskId': '2',
                  'riskName': '人力部',
                  'pId': '1a9020000001',
                  'riskLevelCode': '2',
                  'orderNo': null,
                  'level': '2'
                },
                {
                  'children': null,
                  'riskId': '3',
                  'riskName': '设计部',
                  'riskLevelCode': '4',
                  'pId': '1a9020000001',
                  'orderNo': null,
                  'level': '2'
                },
                {
                  'children': null,
                  'riskId': '5',
                  'riskName': '后端',
                  'riskLevelCode': '3',
                  'pId': '1a9020000001',
                  'orderNo': null,
                  'level': '3'
                }
              ],
              'riskId': '1a9020000001',
              'riskName': '黑龙江多米科技有限公司1',
              'riskLevelCode': null,
              'pId': '1',
              'orderNo': null,
              'level': '1'
            }
          ],
          'riskId': '1',
          'riskName': '多多集团',
          'riskLevelCode': null,
          'pId': '0',
          'orderNo': null,
          'level': '0'
        }
      ],
      tableData: [{
        workshop: '变压站',
        jobs: '配电员',
        mianRisk: '员工吸烟',
        riskFactor: ' ',
        hazardType: ' ',
        emergency: ' '
      }],
      riskList: {
      },
      options: [{
        value: '1',
        label: '黄金糕'
      }, {
        value: '2',
        label: '双皮奶',
        imgPath: 't'
      }, {
        value: '3',
        label: '蚵仔煎',
        imgPath: 'g'
      }, {
        value: '4',
        label: '龙须面',
        imgPath: 'j'
      }, {
        value: '5',
        label: '北京烤鸭',
        imgPath: 'v'
      }],
      imgPathColletion: [
        {
          id: '1',
          imgPath: 'https://www.baidu.com/img/baidu_jgylogo3.gif'
        },
        {
          id: '2',
          imgPath: 'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1574232098&di=111634ace2347f247ee317c4332bcc4a&src=http://pic1.win4000.com/wallpaper/9/577cb9d43a51d.jpg'
        },
        {
          id: '3',
          imgPath: 'c'
        },
        {
          id: '4',
          imgPath: 'g'
        }
      ],
      value1: [],
      value2: [],
      imgPathSel: [], // 已选择的图片路径
      imgPathSel1: [] // 已选择的图片路径
    }
  },
  methods: {
    openLoading () {
      this.pageLoading = true
    },
    closeLoading () {
      this.pageLoading = false
    },
    // 导出excel
    exportEexcel () {

    },
    selChange (data) {
      let vm = this
      vm.imgPathSel = []
      vm.imgPathColletion.forEach(item => {
        data.forEach(dataItem => {
          if (item.id === dataItem) {
            vm.imgPathSel.push(item)
          }
        })
      })
    },
    selChange2 (data) {
      let vm = this
      vm.imgPathSel1 = []
      vm.imgPathColletion.forEach(item => {
        data.forEach(dataItem => {
          if (item.id === dataItem) {
            vm.imgPathSel1.push(item)
          }
        })
      })
    }
  },
  components: {
    TreeReadOnly,
    BreadCrumb
  }
}
</script>

<style scoped lang="scss">
@import '../../utils/css/style.scss';

/deep/.el-select {
  width: 100%;

  .el-input__inner,
  .el-select .el-input__inner:focus,
  .el-select .el-input.is-focus .el-input__inner{
    border-color: #ffffff !important;
  }
  .el-input__icon{
    line-height: 28px;
  }
  .el-input--suffix .el-input__inner{
    padding-left: 0;
  }
}
</style>
