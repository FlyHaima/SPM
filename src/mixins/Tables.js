// Vue对象数据结构要求

// data  tables 表单对象
// {
//   loading: false,  //loading 状态
//   form: {  //表单对象
//     ...
//     orderBy: '', //查询key
//     sort: '',    //排序方式 ascending descending
//     offset: 0,   //偏移值
//     limit: 10    //每页条数
//   },
//   data: null,    //返回的数组对象
//   page: {        //分页对象
//     index: 1//当前页,
//     total: 1//总页数
//     sizes: [10, 20, 50],  //页数 数组
//   },
//  auto: true //是否自动发送请求
// }

import axios from 'axios'
// import qs from 'qs'
// import CODE_SUCCESS from '@/constants/response-code'
import exportExcel from '@/api/exportExcel'
export default {
  data () {
    return {
      tables: {
        _defaultForm: {},
        form: {
          // keyword: '',
          // offset: 0,
          // limit: 10,
          pageNo: 1,
          pageSize: 10
        },
        data: [],
        sum: [],
        loading: false,
        page: {
          total: 0, // 共多少条
          index: 1, // 当前页数
          sizes: [10, 20, 50] // 分页集合
        },
        auto: true
      }
    }
  },
  created () {
    // 对象创建时复制 form 表单 创建默认表单值
    this.tables._defaultForm = {...this.tables.form}
    // 默认请求数据
    if (this.tables.auto) {
      this.tablesFetchList()
    }
  },
  methods: {
    // tableReset () {
    //   if (this.queryDate) {
    //     this.queryDate = ''
    //   }
    //   if (this.queryDateSecond) {
    //     this.queryDateSecond = ''
    //   }
    //   try {
    //     let defaultForm = this.tables._defaultForm
    //     let form = this.tables.form
    //     let ignores = ['offset', 'limit']
    //     for (let key in form) {
    //       if (form.hasOwnProperty(key) && ignores.indexOf(key) === -1) {
    //         // 将默认表单值复制回表单
    //         form[key] = defaultForm[key]
    //       }
    //     }
    //   } catch (e) {
    //     console.error(this.tables.form)
    //   }
    // },
    // 表单submit 事件响应
    tableSearchHandler () {
      this.tables.form.offset = 0
      this.tables.page.index = 1
      this.tablesFetchList()
    },
    // tablesSortChangeHandler ({
    //   column,
    //   prop,
    //   order
    // }) {
    //   // table 绑定  @sort-change
    //   // column 绑定 sortable="custom"
    //   // 不改变当前页
    //   // this.tables.page.index = 1
    //   // this.tables.form.offset = 0
    //   this.tables.form.orderBy = prop
    //   switch (order) {
    //     case 'ascending':
    //       this.tables.form.sort = 'ASC'
    //       break
    //     case 'descending':
    //       this.tables.form.sort = 'DESC'
    //       break
    //   }
    //   this.tablesFetchList()
    // },
    // 获取列表
    tablesFetchList () {
      this.tables.loading = true
      return axios
        .get(this.tables.api, {
          params: this.tables.form
        })
        .then(res => {
          if (res.data.code === 200) {
            this.tables.page.total = res.data.total
            this.tables.data = res.data.data
          }
        })
        .finally(() => {
          this.tables.loading = false
        })
    },
    // 序号
    tablesDefineIndex (index) {
      return index + 1 + (this.tables.page.index - 1) * this.tables.form.pageSize
    },
    // 切换当前页页数
    tablesHandleCurrentPage (val) {
      this.tables.page.index = val
      // this.tables.form.offset = --val * this.tables.form.limit
      this.tables.form.pageNo = val
      this.tablesFetchList()
    },
    // 切换分页数量
    // tablesHandleSizeChange (val) {
    //   this.tables.form.limit = val
    //   // this.tables.form.offset = 0
    //   this.tables.page.index = 1
    //   // this.tables.form.offset = val * this.tables.page.index
    //   this.tablesFetchList()
    // },
    // 导出
    tablesExportExcel (api, params = this.tables.form) {
      exportExcel(api, params)
    }
  }
}
