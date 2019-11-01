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
            <el-table
              border
              style="width: 100%"
              header-align="center">
              <el-table-column
                prop=" "
                label="项目"
                width="180"
                header-align="center">
              </el-table-column>
              <el-table-column
                label="风险级别"
                header-align="center">
                <el-table-column
                  prop=" "
                  header-align="center">
                  <template slot="header" slot-scope="scope">
                    <el-tag
                      size="mini"
                      effect="dark">
                      重大风险
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=" "
                  header-align="center">
                  <template slot="header" slot-scope="scope">
                    <el-tag
                      size="mini"
                      effect="dark">
                      较大风险
                      <!-- {{ scope.row.name }} -->
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=" "
                  header-align="center">
                  <template slot="header" slot-scope="scope">
                    <el-tag
                      size="mini"
                      effect="dark">
                      一般风险
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=" "
                  header-align="center">
                  <template slot="header" slot-scope="scope">
                    <el-tag
                      size="mini"
                      effect="dark">
                      低风险
                    </el-tag>
                  </template>
                </el-table-column>
              </el-table-column>
            </el-table>
          </div>
        </el-main>
      </el-container>
    </el-main>
  </el-container>
</template>
<script>
import BreadCrumb from '../Breadcrumb/Breadcrumb'

export default {
  name: 'riskControlList',
  data () {
    return {
      breadcrumb: ['风险辨识评估', '风险划分']
    }
  },
  methods: {
  },
  components: {
    BreadCrumb
  }
}
</script>

<style scoped lang="scss">
@import '../../utils/css/style.scss';
</style>
