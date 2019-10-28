<template>
  <el-container class="inner-page-container" v-loading="pageLoading">
    <el-header class="inner-header">
      <bread-crumb :breadList="breadcrumb">
      </bread-crumb>
    </el-header>
    <el-main class="inner-main-container">
      <el-container class="inner-main-content">
        <el-aside class="inner-aside" width="408px">
          <tree-diagram
            :tree-data="organizationTree"
            :tree-name="'风险单元'"
            @open-loading="openLoading"
            @close-loading="closeLoading" >
          </tree-diagram>
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
                label="车间"
                width="180">
              </el-table-column>
              <el-table-column
                prop="jobs"
                label="岗位"
                width="180">
              </el-table-column>
              <el-table-column
                prop="mianRisk"
                label="主要风险源">
              </el-table-column>
              <el-table-column
                prop="riskFactor"
                label="风险因素">
              </el-table-column>
              <el-table-column
                prop="hazardType"
                label="潜在事故及职业危害类型">
              </el-table-column>
              <el-table-column
                prop="emergency"
                label="异常状况应急处置">
              </el-table-column>
            </el-table>
            <div class="custom-table">
              <div class="custom-table-header">岗位风险告知卡</div>
              <div class="custom-tbody is-flex is-inline">
                <div class="custom-tr">
                  <div class="custom-th-label">车间</div>
                  <div class="custom-td-value">
                    <el-select v-model="value" placeholder="请选择" size="mini">
                      <el-option>车间1</el-option>
                    </el-select>
                  </div>
                </div>
                <div class="custom-tr">
                  <div class="custom-th-label">岗位</div>
                  <div class="custom-td-value">
                    <el-select v-model="value" placeholder="请选择" size="mini">
                      <el-option>车间1</el-option>
                    </el-select>
                  </div>
                </div>
              </div>
              <div class="custom-tbody is-inline">
                <div class="custom-tr">
                  <div class="custom-th-label">主要风险源</div>
                  <div class="custom-td-value">dd</div>
                </div>
                <div class="custom-tr">
                  <div class="custom-th-label">风险因素</div>
                  <div class="custom-td-value">dd</div>
                </div>
                <div class="custom-tr">
                  <div class="custom-th-label">潜在的事故及职业危害类型</div>
                  <div class="custom-td-value">dd</div>
                </div>
                <div class="custom-tr">
                  <div class="custom-th-label">异常状况应急处置</div>
                  <div class="custom-td-value">dd</div>
                </div>
              </div>
              <div class="custom-tbody">
                <div class="custom-tr text-center">
                  <div class="custom-td-value">
                    <div class="custom-td-img-list">
                      <div class="img-list-item">
                        <img class="item-img" src="" alt="">
                      </div>
                      <div class="img-list-item">
                        <img class="item-img" src="" alt="">
                      </div>
                      <div class="img-list-item">
                        <img class="item-img" src="" alt="">
                      </div>
                      <div class="img-list-item">
                        <img class="item-img" src="" alt="">
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
import TreeDiagram from '../tree-diagram/treeDiagram'

export default {
  name: 'riskInfoCard',
  data () {
    return {
      breadcrumb: ['风险辨识评估', '风险划分'],
      pageLoading: false,
      organizationTree: [
        {
          id: 1000131,
          label: '《安全生产管理平台》东三省黑龙江分部总公司',
          data: {
            name: 'AAA',
            duty: 'clean job'
          },
          children: [
            {
              id: 1003422,
              label: '安管部',
              data: {
                name: 'BBB',
                duty: 'clean job'
              },
              children: [
                {
                  id: 1004521,
                  label: '检查组',
                  data: {
                    name: 'CCC',
                    duty: 'clean job'
                  }
                }, {
                  id: 1004522,
                  label: '设备组',
                  data: {
                    name: 'ddd',
                    duty: 'clean job'
                  }
                }
              ]
            }, {
              id: 1000135,
              label: '生产部',
              data: {
                name: 'eeee',
                duty: 'clean job'
              },
              children: [
                {
                  id: 1060121,
                  label: '生产A组',
                  data: {
                    name: 'BBfffB',
                    duty: 'clean job'
                  }
                }, {
                  id: 1060122,
                  label: '生产B组',
                  data: {
                    name: 'fff',
                    duty: 'clean job'
                  }
                }
              ]
            }
          ]
        }
      ],
      tableData: [{
        workshop: '变压站',
        jobs: '配电员',
        mianRisk: '员工吸烟',
        riskFactor: ' ',
        hazardType: ' ',
        emergency: ' '
      }]
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

    }
  },
  components: {
    TreeDiagram,
    BreadCrumb
  }
}
</script>

<style scoped lang="scss">
@import '../../utils/css/style.scss';
.inner-page-container{
  height: 100%;
  .el-header{
    padding: 0;
  }
  .el-main{
    padding: 0;
  }
}
/*  el-tab */
/deep/.inner-main-container{
  .el-tabs--border-card{
    position: relative;
    border-color: #eeeeee;
  }
  .el-tabs__nav{
    height: 50px;
  }
  .el-tabs__item{
    height: 51px;
    line-height: 50px;
    font-size: 16px;
    color: #777;
    &.is-active{
      color: #409EFF;
      border-top: 2px solid #409EFF;
    }
  }
  .el-tabs__content{
    height: 100%;
    width: 100%;
    padding: 50px 0 0;
    position: absolute;
    top: 0;
    left: 0;
    .el-tab-pane{
      height: 100%;
      .inner-main-content{
        background: #f2f2f2;
        width: 100%;
        height: 100%;
      }
    }
  }
}
/deep/.el-select .el-input__inner,
.el-select .el-input__inner:focus,
.el-select .el-input.is-focus .el-input__inner{
  border-color: #ffffff !important;
}
.inner-page-container{
  .inner-content{
    width: 100%;
    height: 100%;
    padding: 29px 22px;
    background: #fff;
    .container-box{
      .btn-p{
        height: 36px;
        line-height: 36px;
        &>a{
          float: right;
          width: 83px;
          height: 36px;
          color: #fff;
          font-size: 16px;
          text-align: center;
          margin-left: 28px;
          i{
            margin-right: 8px;
            display: inline-block;
            width: 15px;
            height: 36px;
            vertical-align: top;
          }
        }
        .import-btn{
          background: #e6a23c;
          i{
            background-size: 15px 13px;
            background: url("../../assets/img/import-icon.png") no-repeat center;
          }
        }
        .export-btn{
          background: #67c23a;
          i{
            background-size: 14px 14px;
            background: url("../../assets/img/export-icon.png") no-repeat center;
          }
        }
      }
      .el-table{
        margin-top: 25px;
      }
      .pages{
        margin-top: 28px;
        text-align: right;
      }
    }
  }
}
.inner-main-content{
  width: 100%;
  height: 100%;
}

.content-tools{
  padding: 35px 0;
  display: flex;
  justify-content: space-between;
  &.is-flex-end{
    justify-content: flex-end;
  }
}
.tools-right{
  display: flex;
  .el-button{
    margin-left: 20px;
  }
}
.custom-table-header{
  background: #f5f6fa;
  border-bottom: 1px solid $colorBorder;
  font-size: 20px;
  padding: 20px 10px;
  color: $colorText;
  text-align: center;
}
.custom-table{
  width: 816px;
  margin: 20px auto;
  border: solid $colorBorder;
  border-width: 1px 1px 0 1px;
}
.custom-tbody{
  &.is-flex{
    display: flex;
    width: 100%;
    .custom-tr + .custom-tr{
      border-left: 1px solid $colorBorder;
    }
  }
  &.is-inline{
    .custom-th-label{
      min-width: 220px;
    }
    .custom-td-value{
      padding-left: 30px;
      max-width: 150px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .custom-tr{
      max-height: 40px;
      overflow: hidden;
    }
  }
}
.custom-tr{
  font-size: 0;
  border-bottom: 1px solid $colorBorder;
  flex: 1;
  &.is-flex{
    display: flex;
    .custom-th-label,
    .custom-td-value{
      flex: 1;
    }
    .custom-th-label + .custom-th-label{
      border-left: 1px solid $colorBorder;
    }
  }
}
.custom-th-label{
  display: inline-block;
  font-size: 16px;
  color: $colorText;
  background: $bgTableHeader;
  text-align: center;
  vertical-align: top;
  padding: 10px 5px;
  + .custom-td-value{
    border-left: 1px solid $colorBorder;
  }
}
.custom-td-value{
  display: inline-block;
  font-size: 16px;
  color: $colorText;
  vertical-align: top;
  padding: 10px 5px;
  + .custom-td-value{
    border-left: 1px solid $colorBorder;
  }
}
.custom-td-text{
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.custom-theader{
}
.custom-td-img-list{
  background: #e0e0e0;
  padding: 5px;
  margin: 20px 0 10px;
}
.img-list-item{
  display: inline-block;
  width: 90px;
  height: 90px;
  .item-img{
    display: inline-block;
    width: 90px;
    height: 90px;
    background: pink;
  }
}
</style>
