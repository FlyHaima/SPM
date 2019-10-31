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
