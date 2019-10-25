<!--组织结构图-->
<template>
  <div class="organigram-wrap">
    <div id="mountNode"></div>
    <div
      v-show="mouseenterLayerSwitch"
      class="mouseenter-layer"
      ref="mouseenterLayer">
      <div class="list-organization">
        <div class="list-organization-item">
          <div class="list-organization-label">人员：</div>
          <div class="list-organization-value">{{detailValue.name}}</div>
        </div>
        <div class="list-organization-item">
          <div class="list-organization-label">电话：</div>
          <div class="list-organization-value">{{detailValue.name}}</div>
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
          <el-input v-model="form.user"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="主要责任">
          <el-input
            type="textarea"
            maxlength="200"
            show-word-limit
            :rows="4"
            v-model="form.responsibility"></el-input>
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
// import '@antv/g6/build/plugin.tool.tooltip'
import utils from '../../utils/js/common.js'

export default {
  name: 'organigram',
  data() {
    return {
      form: {
        user: '', // 人员
        phone: '', // 电话
        responsibility: '' // 主要职责
      }, // 编辑form
      mouseenterLayerSwitch: false, // 数据预览层显示开关
      dailogVisibelEdit: false, // dailog显示开关
      detailData: [], //组织结构数据
      detailValue: {
        name: '',
        duty: ''
      },
      organigramDataObj: []
    }
  },
  props: {
    organigramData: {
      type: Array,
      default: null
    }
  },
  created () {
  },
  mounted () {
    this.$nextTick(() => {
      let i = 0
      this.organigramDataObj = this.organigramData
      this.G6_init(this.organigramDataObj[0])
      this.initData(this.organigramDataObj[0])
      console.log(this.detailData)

    })
  },
  methods: {
    initData (fData) {
      let vm = this
      vm.detailData.push(fData.data)
      if(fData.children) {
        for (let i = 0; i < fData.children.length; i++) {
          vm.initData(fData.children[i])
        }
      }
    },
    G6_init (val) {
      let COLLAPSE_ICON = function COLLAPSE_ICON(x, y, r) {
        return [['M', x, y], ['a', r, r, 0, 1, 0, r * 2, 0], ['a', r, r, 0, 1, 0, -r * 2, 0], ['M', x + 2, y], ['L', x + 2 * r - 2, y]];
      }
      let EXPAND_ICON = function EXPAND_ICON(x, y, r) {
        return [['M', x, y], ['a', r, r, 0, 1, 0, r * 2, 0], ['a', r, r, 0, 1, 0, -r * 2, 0], ['M', x + 2, y], ['L', x + 2 * r - 2, y], ['M', x + r, y - r + 2], ['L', x + r, y + r - 2]];
      }

      G6.registerNode('tree-node', {
        drawShape: function drawShape(cfg, group) {
          var rect = group.addShape('rect', {
            attrs: {
              fill: '#ffffff',
              stroke: '#666666'
            }
          });
          var content = cfg.label.replace(/(.{19})/g, '$1\n');
          var text = group.addShape('text', {
            attrs: {
              text: content,
              x: 0,
              y: 0,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: '#666666',
              fontSize: '12'
            }
          });
          var bbox = text.getBBox();
          var hasChildren = cfg.children && cfg.children.length > 0;
          if (hasChildren) {
            group.addShape('marker', {
              attrs: {
                x: bbox.maxX + 8,
                y: bbox.minX + bbox.height / 2 - 8,
                r: 6,
                symbol: COLLAPSE_ICON,
                stroke: '#333333',
                lineWidth: 2
              },
              className: 'collapse-icon'
            });
          }
          rect.attr({
            x: bbox.minX - 4,
            y: bbox.minY - 6,
            width: bbox.width + (hasChildren ? 32 : 18),
            height: bbox.height + 16
          });
          return rect;
        }
      }, 'single-shape')

      const graph = new G6.TreeGraph({
        container: 'mountNode',
        width: 800,
        height: 600,
        modes: {
          default: [{
            type: 'collapse-expand',
            onChange: function onChange(item, collapsed) {
              let data = item.get('model');
              let icon = item.get('group').findByClassName('collapse-icon');
              if (collapsed) {
                icon.attr('symbol', EXPAND_ICON);
              } else {
                icon.attr('symbol', COLLAPSE_ICON);
              }
              data.collapsed = collapsed;
              return true;
            }
          }, 'drag-canvas', 'zoom-canvas']
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
            return d.id;
          },
          getHeight: function getHeight() {
            return 16;
          },
          getWidth: function getWidth() {
            return 16;
          },
          getVGap: function getVGap() {
            return 20;
          },
          getHGap: function getHGap() {
            return 80;
          }
        }
      })
      graph.data(val)
      graph.render()
      graph.fitView()
      graph.on('node:mouseenter', ev=>{
        this.mouseenterLayerSwitch = true
      })
      graph.on('node:mouseleave', ev=>{
        this.mouseenterLayerSwitch = false
        this.dailogVisibelEdit = false
        this.detailValue = ev.item.get('model').data
        // console.log(this.detailValue)

      })
      graph.on('node:contextmenu', ev=>{
        this.mouseenterLayerSwitch = false
        this.dailogVisibelEdit = true
      })
    }
  },
  watch: {
    organigramData (val) {
      this.G6_init(val)
      this.initData(val)
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
</style>

