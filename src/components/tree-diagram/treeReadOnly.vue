<!-- 树形结构图（右） -->
<!-- 说明：
  -- 1、level：用于规定最多可添加到第几层级；
  -- 2、addBro：如果在最后一级添加节点，会变成添加兄弟节点；
  -- 3、showEditor：是否显示层级编辑按钮区域（关联权限）；
  -- 4、showSearch：是否显示search input；
  -- 5、treeName：树的名称
 -->
<template>
  <div class="tree-diagram">
    <div class="tree-title">
      <i class="double-line-icon"></i>
      {{treeName}}
      <div class="tree-search">
        <el-input
          size="mini"
          placeholder="输入关键字进行过滤"
          v-model="filterText">
        </el-input>
      </div>
      <div class="slide-btns">
        <el-button type="text" @click="openAll" v-show="openState" style="margin-left: 0;">展开</el-button>
        <el-button type="text" @click="closeAll" v-show="!openState" style="margin-left: 0;">收起</el-button>
      </div>
    </div>
    <div class="tree-box">
      <el-tree
        class="filter-tree"
        :data="treeData"
        :props="defaultProps"
        default-expand-all
        node-key="riskId"
        :filter-node-method="filterNode"
        :expand-on-click-node="false"
        @node-click="handleNodeClick"
        ref="tree">
          <span
            class="custom-tree-node"
            slot-scope="{ node, data }"
            :title="node.label">
            <span>
              <i :class="classObj(data)"></i>
              {{ node.label }}
            </span>
          </span>
      </el-tree>
    </div>
  </div>
</template>

<script>
export default {
  name: 'treeDiagram',
  props: ['treeData', 'treeName', 'hasUpload'],
  data () {
    return {
      filterText: '',
      defaultProps: {
        children: 'children',
        label: 'riskName'
      },
      openState: false,
      level: 3,
      addBro: false
    }
  },
  methods: {
    openUpload () {},
    uploadExcel () {

    },
    openAll () {
      this.openState = !this.openState
      for (let i = 0; i < this.$refs.tree.store._getAllNodes().length; i++) {
        this.$refs.tree.store._getAllNodes()[i].expanded = true
      }
    },
    closeAll () {
      this.openState = !this.openState
      for (let i = 0; i < this.$refs.tree.store._getAllNodes().length; i++) {
        this.$refs.tree.store._getAllNodes()[i].expanded = false
      }
    },
    filterNode (value, data) {
      if (!value) return true
      return data.riskName.indexOf(value) !== -1
    },
    handleNodeClick (data) { // 点击节点，切换右侧结构视图
      this.$emit('tree-click-handle', {
        riskId: data.riskId,
        level: data.level,
        treeLevel: data.treeLevel
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
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../utils/css/style.scss';
  /deep/.tree-diagram{
  width: 400px;
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
