<!-- 树形结构图（右） -->
<!-- 说明：
  -- 1、level：用于规定最多可添加到第几层级；
  -- 2、addBro：如果在最后一级添加节点，会变成添加兄弟节点；
  -- 3、treeName：树的名称
 -->
<template>
  <div class="tree-diagram">
    <div class="tree-title">
      <i class="double-line-icon"></i>
      {{treeName}}
      <div v-show="searchVisible" class="tree-search">
        <el-input
          size="mini"
          placeholder="输入关键字进行过滤"
          v-model="filterText">
        </el-input>
      </div>
      <div v-show="shrinkVisible" class="slide-btns">
        <el-button type="text" @click="openAll" v-show="openState" style="margin-left: 0;">展开</el-button>
        <el-button type="text" @click="closeAll" v-show="!openState" style="margin-left: 0;">收起</el-button>
      </div>
      <div v-show="editOrgVisible" class="slide-btns">
        <el-button
          type="text"
          @click="eiditOrgHandle()">编辑机构</el-button>
      </div>
    </div>
    <div class="tree-box">
      <el-tree
        class="filter-tree"
        :data="treeData"
        :props="defaultProps"
        node-key="riskId"
        default-expand-all
        :filter-node-method="filterNode"
        :expand-on-click-node="false"
        @node-click="handleNodeClick"
        highlight-current
        current-node-key
        ref="tree">
          <span
            class="custom-tree-node"
            slot-scope="{ node, data }"
            :title="node.label">
            <span>
              <i :class="classObj(data)"></i>
              {{ node.label }}
            </span>
            <span class="right-btns" v-if="data.treeLevel == '4' && showBtns">
              <i class="el-icon-plus" title="添加下级子节点" @click.stop="() =>appendChild(node, data)"></i>
            </span>
            <span class="right-btns" v-if="data.treeLevel == '5' && showBtns">
              <i class="el-icon-plus" title="添加节点" @click.stop="() =>append(node, data)"></i>
              <i class="el-icon-edit" title="修改节点" @click.stop="() =>edit(node, data)"></i>
              <i class="el-icon-delete" title="删除节点"  @click.stop="() =>remove(node, data)"></i>
            </span>
          </span>
      </el-tree>
    </div>
  </div>
</template>

<script>
export default {
  name: 'treeDiagram',
  props: {
    treeData: {
      type: Array,
      default: null
    },
    treeName: {
      type: String,
      default: ''
    },
    hasUpload: {
      type: Boolean,
      default: false
    },
    showBtns: {
      type: Boolean,
      default: false
    },
    searchVisible: {
      type: Boolean,
      default: false
    }, // 搜索工具显示开关
    shrinkVisible: {
      type: Boolean,
      default: false
    }, // 展开收缩显示开关
    editOrgVisible: {
      type: Boolean,
      default: false
    } // 编辑机构按钮显示开关
  },
  data () {
    return {
      filterText: '',
      defaultProps: {
        children: 'children',
        label: 'riskName'
      },
      openState: false,
      level: 4,
      addBro: false,
      defaultOpenNode: [] // 默认展开节点的集合
    }
  },
  created () {
    // this.$nextTick(function () {
    //   this.treeData.forEach(row => {
    //     console.log(row)
    //     this.$refs.tree.setCurrentKey(row.riskId)
    //   })
    // })
  },
  methods: {
    //  默认高亮显示一条数据
    highLightTreeNode () {
      // let id = this.treeData[0].riskId
      // console.log(this.treeData[0].riskId)
      this.treeData.forEach(row => {
        if (row.pId === '0') {
          this.$refs.tree.setCurrentKey(row.riskId)
        }
      })
      // this.$refs.tree.setCurrentKey(id)
    },
    // 获取一节点集合
    fetchTreeNodeId () {
      this.treeData.forEach(item => {
        this.defaultOpenNode.push(item.riskId)
      })
    },
    openUpload () {},
    uploadExcel () {
    },
    openAll () {
      this.openState = !this.openState
      this.$refs.tree.$children[0].expanded = true
    },
    closeAll () {
      this.openState = !this.openState
      this.$refs.tree.$children[0].expanded = false
    },
    filterNode (value, data) {
      if (!value) return true
      return data.riskName.indexOf(value) !== -1
    },
    handleNodeClick (data) { // 点击节点，切换右侧结构视图
      this.$emit('tree-click-handle', {
        riskId: data.riskId,
        level: data.level,
        treeLevel: data.treeLevel,
        pId: data.pId
      })
    },
    classObj (data) {
      if (data.riskLevelCode === '0') {
        return 'icon-disabled'
      } else if (data.riskLevelCode === '4') {
        return 'icon-low'
      } else if (data.riskLevelCode === '3') {
        return 'icon-normal'
      } else if (data.riskLevelCode === '2') {
        return 'icon-warning'
      } else if (data.riskLevelCode === '1') {
        return 'icon-danger'
      }
    },
    append (node, data) {
      this.openAppendBox(data)
    },
    appendChild (node, data) { // 向子节点添加节点
      this.$emit('tree-add-item', {
        pId: data.riskId
      })
    },
    openAppendBox (data) {
      this.$emit('tree-add-item', {
        riskId: data.riskId,
        level: data.level,
        treeLevel: data.treeLevel,
        pId: data.pId
      })
    },
    edit (node, data) {
      this.$emit('tree-edit-item', {
        riskId: data.riskId,
        level: data.level,
        treeLevel: data.treeLevel,
        pId: data.pId
      })
    },
    remove (node, data) {
      this.$emit('tree-del-item', {
        riskId: data.riskId,
        level: data.level,
        treeLevel: data.treeLevel,
        pId: data.pId
      })
    },
    // 编辑机构
    eiditOrgHandle () {
      this.$emit('eidit-org')
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    },
    treeData: {
      deep: true,
      handler (val) {
        this.treeData = val
        this.fetchTreeNodeId()
        this.highLightTreeNode()
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/utils/css/tools/_variables.scss';
  /deep/.tree-diagram{
  width: 100%;
  height: 100%;
  position: relative;
  background: #fff;
  .tree-title{
    position: absolute;
    width: 100%;
    z-index: 2;
    padding-left: 37px;
    height: 50px;
    line-height: 49px;
    border-bottom: 1px solid #eeeeee;
    color: #333333;
    font-size: 18px;
    background: #ffffff;
    .double-line-icon{
      position: absolute;
      top: 17px;
      left: 20px;
      display: block;
      background: url("../../assets/img/blue-double-line.png");
      width: 3px;
      height: 16px;
      background-size: cover;
    }
    .tree-search{
      position: absolute;
      vertical-align: top;
      left: 126px;
      top: 0;
      width: 180px;
      margin-top: -1px;
    }
    .slide-btns{
      position: absolute;
      top: 0;
      right: 12px;
    }
  }
  .tree-box{
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    padding: 56px 10px 6px 10px;
    overflow: auto;
    .custom-tree-node{
      font-size: 16px;
      display: inline-block;
      width: 15em;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      .right-btns{
        position: absolute;
        right: 8px;
        color: #5cb6ff;
      }
    }
    .el-tree-node__content{
      margin-top: 10px;
    }
    .icon-disabled,
    .icon-low,
    .icon-normal,
    .icon-warning,
    .icon-danger{
      display: inline-block;
      position: relative;
      width: 15px;
      height: 15px;
      color: $colorDisabled;
      border: 1px solid $colorDisabled;
      border-radius: 50%;
      &:before {
        content: '';
        position: absolute;
        top: 1px;
        left: 3px;
        width: 0;
        height: 0;
        border-right: solid 4px currentColor;
        border-top: solid 7px transparent;
      }
      &:after {
         content: '';
          position: absolute;
          top: 6px;
          left: 5px;
          width: 0;
          height: 0;
          border-left: solid 4px currentColor;
          border-bottom: solid 7px transparent;
      }
    }
    .icon-low{
      color: $colorLow;
      border: 1px solid $colorLow;
    }
    .icon-normal{
      color: $colorNormal;
      border: 1px solid $colorNormal;
    }
    .icon-warning{
      color: $colorWarning;
      border: 1px solid $colorWarning;
    }
    .icon-danger{
      color: $colorDanger;
      border: 1px solid $colorDanger;
    }
  }
}
</style>
