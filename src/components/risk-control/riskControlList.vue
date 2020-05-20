<template>
  <el-container class="inner-page-container" v-loading="pageLoading">
    <el-header class="inner-header">
      <bread-crumb :breadList="breadcrumb">
      </bread-crumb>
    </el-header>
    <el-main class="inner-main-container">
      <el-container class="inner-main-content">
        <el-main class="inner-content">
          <div class="container-box">
            <div class="content-tools is-flex-end">
              <div class="tools-right">
                <el-button
                  type="primary"
                  size="medium"
                  @click.prevent="saveControlList">
                  保存</el-button>
              </div>
            </div>
            <div class="custom-table">
              <div class="custom-theader">
                <div class="custom-tr is-flex">
                  <div class="custom-th-label is-flex">项目</div>
                  <div class="custom-th-label is-colspan is-col-3">
                    <div class="custom-th-label-block">风险级别</div>
                    <div class="custom-th-label-block">
                      <div class="custom-th-label is-flex">
                        <div class="custom-th-label">
                          <el-tag
                            size="mini"
                            effect="dark"
                            class="tag-danger">
                            重大风险
                          </el-tag>
                        </div>
                        <div class="custom-th-label">
                          <el-tag
                            size="mini"
                            effect="dark"
                            class="tag-warning">
                            较大风险
                          </el-tag>
                        </div>
                        <div class="custom-th-label">
                          <el-tag
                            size="mini"
                            effect="dark"
                            class="tag-normal">
                            一般风险
                          </el-tag>
                        </div>
                        <div class="custom-th-label">
                          <el-tag
                            size="mini"
                            effect="dark"
                            class="tag-low">
                            低风险
                          </el-tag>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                 v-for=" item in newTableData"
                :key="item.xm"
                class="custom-tbody">
                <div class="custom-tr is-flex">
                  <div class="custom-td-value">
                    <div class="custom-td-text">
                      {{item.xm}}
                    </div>
                  </div>
                  <div class="custom-td-value">
                    <div class="custom-td-text">
                      {{item.zd}}
                    </div>
                    <div class="custom-td-text">
                    </div>
                  </div>
                  <div class="custom-td-value">
                    <div class="custom-td-text">
                       {{item.gj}}
                    </div>
                  </div>
                  <div class="custom-td-value">
                    <div class="custom-td-text">
                       {{item.yb}}
                    </div>
                  </div>
                  <div class="custom-td-value">
                    <div class="custom-td-text">
                      {{item.d}}
                   </div>
                  </div>
                </div>
              </div>
              <div class="custom-tr is-flex">
                <div class="custom-td-value">
                  <div class="custom-td-text">频次</div>
                </div>
                <div class="custom-td-value">
                  <el-select v-model="frequencyVal.frequencyVal1" placeholder="请选择">
                    <div class="custom-td-text">频次</div>
                    <el-option
                      v-for="(item, index) in frequency"
                      :key="index"
                      :label="item"
                      :value="item">
                    </el-option>
                  </el-select>
                </div>
                <div class="custom-td-value">
                  <el-select v-model="frequencyVal.frequencyVal2" placeholder="请选择">
                    <el-option
                      v-for="(item, index) in frequency"
                      :key="index"
                      :label="item"
                      :value="item">
                    </el-option>
                  </el-select>
                </div>
                <div class="custom-td-value">
                  <el-select v-model="frequencyVal.frequencyVal3" placeholder="请选择">
                    <el-option
                      v-for="(item, index) in frequency"
                      :key="index"
                      :label="item"
                      :value="item">
                    </el-option>
                  </el-select>
                </div>
                <div class="custom-td-value">
                  <el-select v-model="frequencyVal.frequencyVal4" placeholder="请选择">
                    <el-option
                      v-for="(item, index) in frequency"
                      :key="index"
                      :label="item"
                      :value="item">
                    </el-option>
                  </el-select>
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
import axios from '@/api/axios'

export default {
  name: 'riskControlList',
  data () {
    return {
      breadcrumb: ['风险分级管控', '风险分级管控表'],
      pageLoading: false,
      tableData: [],
      newTableData: [],
      frequencyVal: { // 频次
        frequencyVal1: '',
        frequencyVal2: '',
        frequencyVal3: '',
        frequencyVal4: ''
      },
      frequency: [ // 频次选择
        '每季度一次',
        '每月一次',
        '每周一次',
        '每天一次'
      ],
      riskAversion: '', // 风险色度
      controlLevel: '' // 管控层级
    }
  },
  created () {
    this.fetchTableData()
  },
  methods: {
    // 获取table数据
    fetchTableData () {
      // this.pageLoading = true
      axios
        .get('riskLevel/getRiskLevels')
        .then((res) => {
          if (res.data.code === 200) {
            this.tableData = res.data.data
            this.newTableData = this.tableData.slice(0, 2)
            // console.log(this.tableData)
            this.frequencyVal.frequencyVal1 = res.data.data[2].zd
            this.frequencyVal.frequencyVal2 = res.data.data[2].gj
            this.frequencyVal.frequencyVal3 = res.data.data[2].yb
            this.frequencyVal.frequencyVal4 = res.data.data[2].d
          }
        }).finally(() => {
          // this.pageLoading = false
          // console.log(this.frequencyVal, '1111')
        })
    },
    saveControlList () { // 保存列表
      const list = {
        list: [
          {xm: '重大风险', zd: '000101', gj: '红色', yb: '企业级', d: this.frequencyVal.frequencyVal1, c: '91230500752363859P'},
          {xm: '较大风险', zd: '000102', gj: '橙色', yb: '专业级', d: this.frequencyVal.frequencyVal2, c: '91230500752363859P'},
          {xm: '一般风险', zd: '000103', gj: '黄色', yb: '车间级', d: this.frequencyVal.frequencyVal3, c: '91230500752363859P'},
          {xm: '低风险', zd: '000104', gj: '蓝色', yb: '班组级/岗位级', d: this.frequencyVal.frequencyVal4, c: '91230500752363859P'}
        ]
      }
      if (this.frequencyVal.frequencyVal1 && this.frequencyVal.frequencyVal2 && this.frequencyVal.frequencyVal3 && this.frequencyVal.frequencyVal4) {
        axios
          .post('riskLevel/changeRiskLevels', JSON.stringify(list))
          .then((res) => {
            if (res.data.code === 200) {
              this.$notify.success('保存成功')
            } else {
              this.$message({
                message: res.data.message,
                type: 'warning'
              })
            }
          })
      } else {
        this.$notify.error('频次不能为空')
      }
    }
  },
  components: {
    BreadCrumb
  }
}
</script>

<style scoped lang="scss">
.custom-table{
  width: 100%;
}
</style>
