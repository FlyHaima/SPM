<template>
  <el-dialog
    title="排查种类"
    :visible.sync="show"
    width="60%">
    <div>
      <el-table
        row-key="id"
        border
        stripe
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        v-loading="tables.loading">
        <el-table-column
          width="50px"
          align="center">
          <template slot-scope="scope">
            <i
              v-show="scope.row.addVisible === 'true'"
              class="el-icon-circle-plus-outline"
              @click.prevent="addTableRow(scope.$index, scope.row, tableData)"
            ></i>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="排查种类"
          align="center">
        </el-table-column>
        <el-table-column
          label="组织机构"
          align="center">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.organization"
              multiple
              placeholder="请选择组织机构">
              <el-option
                v-for="item in orgOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          label="周期设置"
          align="center">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.cycle"
              multiple
              placeholder="请设置周期">
              <el-option
                v-for="item in cycleOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center">
          <template slot-scope="scope">
            <a
              v-show="scope.row.addVisible === 'false'"
              href="javascript:;"
              class="color-danger talbe-links-del"
              @click="delTableRow(scope.$index, tableData)"
            >删除</a>
          </template>
        </el-table-column>
      </el-table>
      <div class="el-pagination__wrap text-right">
        <el-pagination
          layout="total, prev, pager, next, jumper"
          :current-page="tables.page.index"
          :page-sizes="tables.page.sizes"
          :page-size="tables.form.pageSize"
          :total="tables.page.total"
          @current-change="tablesHandleCurrentPage"></el-pagination>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        size="small"
        @click="submitForm()">确 定</el-button>
      <el-button
        size="small"
        @click="show = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import qs from 'qs'
import axios from '@/api/axios'
import Tables from '@/mixins/Tables'
export default {
  name: 'dialogSort',
  mixins: [Tables],
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      show: false,
      tableData: [
        {
          index: 0, // 名称的序号
          id: '1',
          name: '日常检查',
          organization: ['1', '2'],
          cycle: ['1', '2'],
          addVisible: 'true'
        },
        {
          index: 0,
          id: '2',
          name: '综合检查',
          organization: ['2'],
          cycle: ['1', '2'],
          addVisible: 'true'
        }
      ],
      tables: {
        api: 'news/getNewsList'
      },
      orgOptions: [
        {
          value: '1',
          label: '公司'
        }, {
          value: '2',
          label: '集团'
        }, {
          value: '3',
          label: '分厂'
        }, {
          value: '4',
          label: '车间'
        }, {
          value: '5',
          label: '部门'
        }, {
          value: '6',
          label: '班组'
        }, {
          value: '7',
          label: '岗位'
        }
      ],
      cycleOptions: [
        {
          value: '1',
          label: '一年'
        }, {
          value: '2',
          label: '半年'
        }, {
          value: '3',
          label: '一季'
        }, {
          value: '4',
          label: '一月'
        }, {
          value: '5',
          label: '一周'
        }, {
          value: '6',
          label: '一天'
        }
      ]
    }
  },
  created () {
  },
  methods: {
    // 添加talbe行
    addTableRow (index, row, rows) {
      console.log(index)
      console.log(row.index)
      let newLineIndex = ++row.index
      let newLineOrg = row.name + `(${newLineIndex})`
      let newLine = {
        index: newLineIndex,
        id: row.id + `${newLineIndex}`,
        name: newLineOrg,
        organization: [],
        cycle: [],
        addVisible: 'false'
      }
      rows.splice(index + 1, 0, newLine)
      console.log(rows)
    },
    // 删除talbe行
    delTableRow (index, rows) {
      rows.splice(index, 1)
    },
    // 删除事件
    delRowHandle (row) {
      let sendData = {
        id: row.id
      }
      axios
        .post('news/delNews', qs.stringify(sendData))
        .then((res) => {
          if (res.data.code === 200) {
            this.$notify.success('删除成功')
            this.tablesFetchList()
          }
        })
        .finally(() => {
        })
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

<style lang="scss" scoped>
@import '@/utils/css/style.scss';
/deep/.el-icon-circle-plus-outline{
  margin-top: 2px;
  font-size: 20px;
  &:hover{
    color: $colorPrimary;
  }
}
/deep/.el-select{
  .el-input__inner{
    border: 0;
    background: transparent;
    height: 30px;
    line-height: 30px;
  }
  .el-input__icon{
    line-height: 30px;
  }
}
</style>
