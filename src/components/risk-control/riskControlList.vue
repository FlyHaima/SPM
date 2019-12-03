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
                 v-for=" item in tableData"
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
      tableData: []
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
          }
        }).finally(() => {
          // this.pageLoading = false
        })
    }
  },
  components: {
    BreadCrumb
  }
}
</script>

<style scoped lang="scss">
@import '../../utils/css/style.scss';
.custom-table{
  width: 100%;
}
</style>
