<!--组织结构图-->
<template>
  <div class="organigram-wrap">
    <div id="mountNode"></div>

    <div v-show="mouseenterLayerSwitch"
         class="mouseenter-layer"
         ref="mouseenterLayer">
      <div class="list-organization">
        <div class="list-organization-item">
          <div class="list-organization-label">人员：</div>
          <div class="list-organization-value">{{detailValue.manager}}</div>
        </div>
        <div class="list-organization-item">
          <div class="list-organization-label">电话：</div>
          <div class="list-organization-value">{{detailValue.telNum}}</div>
        </div>
        <div class="list-organization-item">
          <div class="list-organization-label">主要职责：</div>
          <div class="list-organization-value">{{detailValue.duty}}</div>
        </div>
      </div>
    </div>

    <el-dialog title="编辑" :visible.sync="dailogVisibelEdit">
      <div class="form-modal">
        <el-form
          :model="form"
          ref="form"
          size="mini"
          label-width="100px"
          label-position="top"
        >
          <el-form-item label="人员">
            <el-select v-model="users"
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
          <el-form-item label="联系方式" v-show="users.length > 0">
            <p v-for="(item, index) in users" :key="index">
              {{`${findItem(item).userName}：&nbsp;&nbsp;&nbsp;&nbsp;${findItem(item).telephone}`}}
            </p>
          </el-form-item>
          <el-form-item label="分组类型">
            <el-select v-model="form.type" placeholder="请选择" size="medium">
              <el-option
                v-for="item in allTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="主要责任">
            <el-input
              type="textarea"
              maxlength="200"
              show-word-limit
              :rows="4"
              v-model="form.duty"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="submitForm()">保 存</el-button>
        <el-button size="small" @click="dailogVisibelEdit = false">取 消</el-button>
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
      users: [],
      form: {
        type: 1, // 1,领导小组; 2,工作小组
        duty: '' // 主要职责
      }, // 编辑form
      allTypes: [
        {label: '领导小组', value: 1},
        {label: '工作小组', value: 2}
      ],
      mouseenterLayerSwitch: false, // 数据预览层显示开关
      dailogVisibelEdit: false, // dailog显示开关
      detailValue: {
        name: '',
        manager: '',
        duty: '',
        telNum: ''
      },
      organigramDataObj: [],
      graph: null
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
                const text = '人员：' + model.manager
                  + '<br/>电话：' + model.telNum
                  + '<br/>主要职责：' + model.duty
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
      this.graph.render()
      this.graph.fitView()

      this.graph.on('node:contextmenu', (e) =>{
        // console.log(e.item._cfg.id)
        this.dailogVisibelEdit = true
      })
    },
    submitForm () {
      if (this.users.length > 0) {
        this.$emit('submitForm', this.users, this.form.type, this.form.duty)
      } else {
        this.$message.error('人员可多选，但不能为空')
      }
    },
    findItem (id) {
      for(let i=0; i<this.selector.length; i++){
        if (this.selector[i].userId == id) {
          return this.selector[i]
        }
      }
    }
  },
  watch: {
    organigramData (val) {
      this.graph.changeData(val)
      this.graph.render()
      this.graph.fitView()
      this.graph.refresh()
      this.graph.on('node:contextmenu', (e) =>{
        // console.log(e.item._cfg.id)
        this.dailogVisibelEdit = true
      })
    }
  }
}
</script>

<style scoped lang="scss">
  @import '../../utils/css/style.scss';
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
  .list-organization{

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
      width: 180px;
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

