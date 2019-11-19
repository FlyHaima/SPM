<template>
  <el-container class="inner-page-container" v-loading="pageLoading">
    <el-header class="inner-header">
      <bread-crumb :breadList="breadcrumb">
      </bread-crumb>
    </el-header>
    <el-main class="inner-main-container">
      <p class="btn-p">
        <el-button size="medium" type="primary"><i class="el-icon-upload2"></i>上传</el-button>
      </p>

      <el-table ref="downloadTable"
                border
                stripe
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%">
        <el-table-column
          label="序号"
          width="190"
          align="center"
          type="index">
        </el-table-column>
        <el-table-column
          label="文件名"
          align="center">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="190"
          align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="download(scope.row.id)">下载</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pages" v-if="listNum > 10">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="listNum">
        </el-pagination>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import BreadCrumb from '../Breadcrumb/Breadcrumb'

export default {
  name: 'systemData',
  data () {
    return {
      pageLoading: false,
      breadcrumb: ['风险辨识评估', '系统大数据'],
      tableData: [
        {
          id: 200012,
          name: '系统用文件0021'
        },
        {
          id: 200012,
          name: '系统用文件0021'
        }
      ],
      listNum: 11
    }
  },
  methods: {
    openLoading () {
      this.pageLoading = true
    },
    closeLoading () {
      this.pageLoading = false
    },
    download (id) {}
  },
  components: {BreadCrumb}
}
</script>

<style lang="scss" scoped>
.inner-page-container {
  height: 100%;
  .el-main{
    padding: 0;
    width: 100%;
    height: 100%;
    background: #fff;
    padding: 25px;
    .btn-p{
      text-align: right;padding-bottom: 25px;
      .el-icon-upload2{
        margin-right: 4px;
      }
    }
    .pages{
      margin-top: 20px;
      text-align: right;
    }
  }
}
</style>
