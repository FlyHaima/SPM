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
      <slot></slot>
      <div v-show="searchVisible" class="tree-search">
        <el-input
          size="mini"
          placeholder="输入关键字进行过滤"
          v-model="filterText">
        </el-input>
      </div>
      <div class="slide-btns">
        <el-button
          type="text"
          @click="openUpload"
          v-show="hasUpload">上传</el-button>
        <span v-show="shrinkVisible">
          <el-button
            type="text"
            @click="openAll"
            v-show="openState"
            style="margin-left: 0;">展开</el-button>
          <el-button
            type="text"
            @click="closeAll"
            v-show="!openState"
            style="margin-left: 0;">收起</el-button>
        </span>

      </div>
    </div>
    <div class="tree-box">
      <el-tree
        class="filter-tree"
        default-expand-all
        node-key="invDeptId"
        :data="treeData"
        :props="defaultProps"
        :filter-node-method="filterNode"
        :expand-on-click-node="false"
        @node-click="handleNodeClick"
        ref="tree">
          <span class="custom-tree-node" slot-scope="{ node, data }" :title="node.label">
            <span>{{ node.label }}</span>
            <span class="right-btns">
              <i class="el-icon-plus add-btn"
                title="添加节点"
                @click.stop="addNode(node, data)"></i>
              <i class="el-icon-edit edit-btn"
                title="修改节点"
                @click.stop="edit(node, data)"></i>
              <i v-if="false"
                class="el-icon-delete"
                title="删除节点"
                @click.stop="remove(node, data)"></i>
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
    searchVisible: {
      type: Boolean,
      default: false
    },
    addVisible: {
      type: Boolean,
      default: false
    },
    editVisible: {
      type: Boolean,
      default: false
    },
    delVisible: {
      type: Boolean,
      default: false
    },
    shrinkVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      filterText: '',
      defaultProps: {
        children: 'children',
        label: 'invDeptName'
      },
      openState: false,
      level: 7,
      addBro: false
    }
  },
  methods: {
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
      console.log(value)
      return data.deptName.indexOf(value) !== -1
    },
    handleNodeClick (data) { // 点击节点，切换右侧结构视图
      // console.log('节点deptID：' + data.invDeptId)
      // console.log(data)
      this.$emit('handleNodeClick', data.invDeptId)
    },
    addNode (node, data) {
      if (node.level > this.level) {
        this.$message({
          message: '最多可添加到第' + this.level + '级',
          type: 'warning'
        })
      } else {
        this.$emit('openAppendBox', data.invDeptId)
      }
    },
    edit (node, data) {
      this.$emit('editTreeData', data.invDeptId)
    },
    remove (node, data) {
      this.$emit('confirmRemove', data.invDeptId)
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
    background: #fff;
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
  }
}
</style>
