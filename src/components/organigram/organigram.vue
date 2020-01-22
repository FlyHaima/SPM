<!--组织结构图-->
<template>
  <div class="organigram-wrap">
    <div id="mountNode"></div>

    <el-dialog title="编辑" :visible.sync="dialogVisibleEdit" v-loading="pageLoading">
      <div class="form-modal">
        <el-form
          ref="form"
          size="mini"
          label-width="100px"
          label-position="top"
        >
          <el-form-item label="类型">
            <el-select v-model="type"
                       placeholder="请选择" size="medium">
              <el-option
                v-for="item in types"
                :key="item.data"
                :label="item.label"
                :value="item.data">
              </el-option>
            </el-select>
          </el-form-item>

          <template v-if="type === '1'">
            <el-form-item label="人员">
              <el-select v-model="workUsers"
                         filterable
                         multiple
                         placeholder="请选择" size="medium">
                <el-option
                  v-for="item in selector"
                  :key="item.userId"
                  :label="item.userName"
                  :value="item.userId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-show="workUsers.length > 0">
              <p v-for="(item, index) in workUsers" :key="index">
                {{`${findItem(item).userName}：&nbsp;&nbsp;&nbsp;&nbsp;${findItem(item).telephone}`}}
              </p>
            </el-form-item>
            <el-form-item label="主要责任">
              <el-input
                type="textarea"
                maxlength="200"
                show-word-limit
                :rows="4"
                v-model="workerDuty"></el-input>
            </el-form-item>
          </template>

          <template v-else-if="type === '2'">
            <el-form-item label="正职">
              <el-select v-model="leadUserA"
                         filterable
                         multiple :multiple-limit="limitLeaderA"
                         placeholder="请选择" size="medium">
                <el-option
                  v-for="item in selector"
                  :key="item.userId"
                  :label="item.userName"
                  :value="item.userId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-show="leadUserA.length > 0">
              <p v-for="(item, index) in leadUserA" :key="index">
                {{`${findItem(item).userName}：&nbsp;&nbsp;&nbsp;&nbsp;${findItem(item).telephone}`}}
              </p>
            </el-form-item>
            <el-form-item label="主要责任">
              <el-input
                type="textarea"
                maxlength="200"
                show-word-limit
                :rows="4"
                v-model="leaderDutyA"></el-input>
            </el-form-item>

            <el-form-item label="副职">
              <el-select v-model="leadUserB"
                         filterable
                         multiple :multiple-limit="limitLeaderB"
                         placeholder="请选择" size="medium">
                <el-option
                  v-for="item in selector"
                  :key="item.userId"
                  :label="item.userName"
                  :value="item.userId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-show="leadUserB.length > 0">
              <p v-for="(item, index) in leadUserB" :key="index">
                {{`${findItem(item).userName}：&nbsp;&nbsp;&nbsp;&nbsp;${findItem(item).telephone}`}}
              </p>
            </el-form-item>
            <el-form-item label="主要责任">
              <el-input
                type="textarea"
                maxlength="200"
                show-word-limit
                :rows="4"
                v-model="leaderDutyB"></el-input>
            </el-form-item>
          </template>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="submitForm()">保 存</el-button>
        <el-button size="small" @click="dialogVisibleEdit = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import G6 from '@antv/g6'

export default {
  name: 'organigram',
  data() {
    return {
      limitLeaderA: 1,
      limitLeaderB: 3,
      types: [
        {
          data: '1',
          label: '工作小组'
        }, {
          data: '2',
          label: '领导小组'
        }
      ],
      type: '1',
      workUsers: [],
      leadUserA: [],
      leadUserB: [],
      workerDuty: '',
      leaderDutyA: '',
      leaderDutyB: '',
      dialogVisibleEdit: false, // dialog显示开关
      organigramDataObj: [],
      graph: null,
      subId: '',
      pageLoading: false
    }
  },
  props: {
    organigramData: {
      type: Object,
      default: null
    },
    selector: {
      type: Array,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  created () {
  },
  mounted () {
    this.$nextTick(() => {
      this.G6_init(this.organigramData)
    })
  },
  methods: {
    G6_init (treeData) {
      let vm = this
      let COLLAPSE_ICON = function COLLAPSE_ICON(x, y, r) {
        return [
          ['M', x, y],
          ['a', r, r, 0, 1, 0, r * 2, 0],
          ['a', r, r, 0, 1, 0, -r * 2, 0],
          ['M', x + 2, y],
          ['L', x + 2 * r - 2, y]
        ]
      }
      let EXPAND_ICON = function EXPAND_ICON(x, y, r) {
        return [
          ['M', x, y],
          ['a', r, r, 0, 1, 0, r * 2, 0],
          ['a', r, r, 0, 1, 0, -r * 2, 0],
          ['M', x + 2, y],
          ['L', x + 2 * r - 2, y],
          ['M', x + r, y - r + 2],
          ['L', x + r, y + r - 2]
        ]
      }

      G6.registerNode('tree-node', {
        drawShape: function drawShape (cfg, group) {
          let rect = group.addShape('rect', {
            attrs: {
              fill: '#fff',
              stroke: '#666'
            }
          })
          // 设置渲染节点的文本 label-name， 添加换行
          let content = cfg.name.replace(/(.{19})/g, '$1\n')

          let text = group.addShape('text', {
            attrs: {
              text: content,
              x: 0,
              y: 0,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: '#666'
            }
          })
          let bbox = text.getBBox()

          let hasChildren = cfg.children && cfg.children.length > 0
          if (hasChildren) {
            group.addShape('marker', {
              attrs: {
                x: bbox.maxX + 6,
                y: bbox.minX + bbox.height / 2 - 6,
                r: 6,
                symbol: COLLAPSE_ICON,
                stroke: '#666',
                lineWidth: 2
              },
              className: 'collapse-icon'
            })
          }
          rect.attr({
            x: bbox.minX - 4,
            y: bbox.minY - 6,
            width: bbox.width + (hasChildren ? 26 : 8),
            height: bbox.height + 12
          })
          return rect
        }
      }, 'single-shape')

      let graphW = document.getElementById('mountNode').offsetWidth
      let graphH = document.getElementById('mountNode').offsetHeight

      this.graph = new G6.TreeGraph({
        // renderer: 'svg', // 渲染模式，可选svg，本组件用不上
        container: 'mountNode', // 容器id
        width: graphW,
        height: graphH,
        modes: {
          default: [
            {
              type: 'collapse-expand',
              onChange: function onChange(item, collapsed) {

                let data = item.get('model')
                let icon = item.get('group').findByClassName('collapse-icon')
                if (collapsed) {
                  icon.attr('symbol', EXPAND_ICON)
                } else {
                  icon.attr('symbol', COLLAPSE_ICON)
                }
                data.collapsed = collapsed
                return true
              }
            },
            {
              type: 'tooltip',
              formatText(model) {
                let list = model.workList
                let text = ''
                // debugger
                if (list.length === 0) {
                  text = '<span style="font-weight: 600;">人员：</span>'
                    + '<br/><span style="font-weight: 600;">电话：</'
                    + 'span><br/><span style="font-weight: 600;">主要职责：</span>'
                } else if (list.length === 1) {
                  let worker = []

                  if (list[0].userId) {
                    worker = list[0].userId.split(',')
                    text = '<span style="font-weight: 600;">管理人员：</span>'
                    worker.forEach((item) => {
                      text += '<br/>' + vm.findItem(item).userName + '&nbsp;&nbsp;' + vm.findItem(item).telephone
                    })
                    text += '<br/><span style="font-weight: 600;">主要职责：</span>' + list[0].duty
                  } else {
                    text = '<span style="font-weight: 600;">人员：</'
                      + 'span><br/><span style="font-weight: 600;">电话：</'
                      + 'span><br/><span style="font-weight: 600;">主要职责：</span>' + list[0].duty
                  }
                } else if (list.length === 2) {
                  let managerA = [],
                      managerB = [],
                      dutyA = '',
                      dutyB = ''
                  list.forEach((item) => {
                    if (item.level === '1') {
                      dutyA = item.duty
                      if (item.userId) {
                        let ids = item.userId.split(',')
                        ids.forEach((eachItem) => {
                          console.log(vm.findItem(eachItem))
                          managerA.push(vm.findItem(eachItem))
                        })
                      }
                    } else if (item.level === '2') {
                      dutyB = item.duty
                      if (item.userId) {
                        let ids = item.userId.split(',')
                        ids.forEach((eachItem) => {
                          managerB.push(vm.findItem(eachItem))
                        })
                      }
                    }
                  })

                  text = '<span style="font-weight: 600;">正负责人：</span>'
                  managerA.forEach((item) => {
                    text += '<br/>' + item.userName + '&nbsp;&nbsp;' + item.telephone
                  })
                  text += '<br/><span style="font-weight: 600;">主要职责：</span>' + dutyA
                  text += '<br/>' + '<span style="font-weight: 600;">副负责人：</span>'
                  managerB.forEach((item) => {
                    text += '<br/>' + item.userName + '&nbsp;&nbsp;' + item.telephone
                  })
                  text += '<br/><span style="font-weight: 600;">主要职责：</span>' + dutyB
                }
                return text
              },
              shouldUpdate: e => {
                return true
              }
            },
            'drag-canvas',
            'zoom-canvas'
          ]
        },
        defaultNode: {
          shape: 'tree-node',
          anchorPoints: [[0, 0.5], [1, 0.5]]
        },
        defaultEdge: {
          shape: 'cubic-horizontal'
        },
        edgeStyle: {
          default: {
            stroke: '#A3B1BF'
          }
        },
        layout: {
          type: 'compactBox',
          direction: 'LR',
          getId: function getId(d) {
            return d.id
          },
          getHeight: function getHeight() {
            return 16
          },
          getWidth: function getWidth() {
            return 16
          },
          getVGap: function getVGap() {
            return 20
          },
          getHGap: function getHGap() {
            return 80
          }
        }
      })

      this.graph.data(treeData)
      this.refresh()
    },
    submitForm () {
      let list = []
      if (this.type === '1') {
        let ids = this.workUsers.join(',')
        let item = {
          level: '',
          type: '1',
          userId: ids,
          duty: this.workerDuty
        }
        list.push(item)
      } else {
        let idAs = this.leadUserA.join(',')
        let itemA = {
          level: '1',
          type: '2',
          userId: idAs,
          duty: this.leaderDutyA
        }
        let idBs = this.leadUserB.join(',')
        let itemB = {
          level: '2',
          type: '2',
          userId: idBs,
          duty: this.leaderDutyB
        }
        list = [itemA, itemB]
      }
      let data = {
        deptId: this.subId,
        list: list
      }

      if (this.type === '1' && this.workUsers.length > 0) {
        this.$emit('submitForm', data)
      } else if ((this.type === '2' && this.leadUserA.length > 0) || (this.type === '2' && this.leadUserB.length > 0)) {
        this.$emit('submitForm', data)
      } else {
        this.$message.error('人员不能为空')
      }
    },
    // 根据id 查selector item
    findItem (id) {
      for(let i=0; i<this.selector.length; i++){
        if (this.selector[i].userId == id) {
          return this.selector[i]
        }
      }
    },
    refresh () {
      this.graph.render()
      this.graph.fitView()
      this.graph.refresh()
      this.graph.on('node:contextmenu', (e) =>{
        // console.log(e.item._cfg.model)
        this.filter(e.item._cfg.model.workList)
        this.subId = e.item._cfg.id
        this.dialogVisibleEdit = true
      })
    },
    filter (list) {
      if (list.length == 0 || !list) {
        this.type = '1'
        this.workUsers = []
        this.leadUserA = []
        this.leadUserB = []
        this.workerDuty = ''
        this.leaderDutyA = ''
        this.leaderDutyB = ''
      } else if (list[0].type == '1') {
        this.type = '1'
        this.workUsers = list[0].userId ? list[0].userId.split(',') : []
        this.leadUserA = []
        this.leadUserB = []
        this.workerDuty = list[0].duty
        this.leaderDutyA = ''
        this.leaderDutyB = ''
      } else if (list[0].type == '2') {
        this.type = '2'
        this.workUsers = []
        this.leadUserA = []
        this.leadUserB = []
        this.workerDuty = ''
        this.leaderDutyA = ''
        this.leaderDutyB = ''
        list.forEach((item) => {
          if (item.level == '1') {
            this.leadUserA = item.userId ? item.userId.split(',') : []
            this.leaderDutyA = item.duty
          } else {
            this.leadUserB = item.userId ? item.userId.split(',') : []
            this.leaderDutyB = item.duty
          }
        })
      }
    }
  },
  watch: {
    organigramData (val) {
      this.graph.changeData(val)
      this.refresh()
    },
    loading (val) {
      this.pageLoading = val
      // 当父组件ajax结束后，返回子组件的loading结束，及可默认为弹窗消失
      if (!val) {
        this.dialogVisibleEdit = false
      }
    }
  }
}
</script>

<style scoped lang="scss">
 @import '@/utils/css/tools/_variables.scss';
  .organigram-wrap{
    width: 100%;
    height: 100%;
    position: relative;
    #mountNode{
      width: 100%;
      height: 100%;
    }
  }
  .mouseenter-layer{
    position: absolute;
    top: 240px;
    left: 100px;
    width: 162px;
    min-height: 171px;
    background-color: #fffbc0;
    box-shadow: 0px 3px 8px 0px
    rgba(4, 0, 0, 0.35);
    border-radius: 10px;
    padding: 20px 10px;
  }
  .list-organization-item{
    display: flex;
    flex-wrap: wrap;
    font-size: 14px;
    color: #242424;
    margin-bottom: 10px;
  }
  .list-organization-label{
    white-space: nowrap;
    text-align: left;
  }
  .list-organization-value{
    text-align: left;
  }
  // 修改组件样式
  .form-modal >>>{
    .el-form{
      width: 400px;
      margin: 0 auto;
    }
  }
  /deep/.organigram-wrap{
    .g6-tooltip {
      width: 280px;
      min-height: 120px;
      border: 1px solid #e2e2e2;
      border-radius: 4px;
      font-size: 15px;
      line-height: 24px;
      color: #545454;
      background-color: #fffbc0;
      padding: 10px 8px;
      box-shadow: rgb(174, 174, 174) 0px 0px 10px;
    }
  }

</style>