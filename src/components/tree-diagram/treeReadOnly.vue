<!-- 树形结构图（右） -->
<!-- 说明：
  -- 1、level：用于规定最多可添加到第几层级；
  -- 2、addBro：如果在最后一级添加节点，会变成添加兄弟节点；
  -- 3、treeName：树的名称
 -->
<template>
  <div class="tree-diagram" v-loading="treeLoading">
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
          @click="editOrgHandle()">编辑机构</el-button>
      </div>
    </div>
    <div class="tree-box">
      <el-tree
        lazy
        class="filter-tree"
        :props="defaultProps"
        :load="loadNode"
        node-key="riskId"
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
            <!-- 权限显示 -->
            <span class="right-btns" v-if="data.treeLevel == '4' && showBtns">
              <i class="el-icon-plus function-btn add-child-btn"  v-if="showAddChlidBtn" title="添加下级子节点" @click.stop="() =>appendChild(node, data)"></i>
            </span>
            <span class="right-btns" v-if="data.treeLevel == '5' && showBtns">
              <i class="el-icon-plus function-btn add-btn" v-if="showAddBtn" title="添加节点" @click.stop="() =>append(node, data)"></i>
              <i class="el-icon-edit function-btn edit-btn" v-if="showEditBtn" title="修改节点" @click.stop="() =>edit(node, data)"></i>
              <i class="el-icon-delete function-btn del-btn" v-if="showDelBtn" title="删除节点"  @click.stop="() =>remove(node, data)"></i>
            </span>
          </span>
      </el-tree>
    </div>
  </div>
</template>

<script>
import axios from '@/api/axios'
export default {
  name: 'treeDiagram',
  props: {
    currentId: {
      type: String,
      default: ''
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
    }, // 编辑机构按钮显示开关
    showAddChlidBtn: {
      type: Boolean,
      default: false
    },
    showAddBtn: {
      type: Boolean,
      default: false
    },
    showEditBtn: {
      type: Boolean,
      default: false
    },
    showDelBtn: {
      type: Boolean,
      default: false
    },
    orgInterface: {
      type: String,
      default: ''
    },
    childInterface: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      key: '',
      filterText: '',
      defaultProps: {
        children: 'children',
        label: 'riskName',
        isLeaf: true
      },
      openState: false,
      level: 4,
      addBro: false,
      defaultOpenNode: [], // 默认展开节点的集合
      orgData: [],
      treeLoading: false
    }
  },
  created () {
  },
  methods: {
    // 节点刷新数据
    refreshNodeBy (id) {
      let node = this.$refs.tree.getNode(id) // 通过节点id找到对应树节点对象
      node.loaded = false
      node.expand() // 主动调用展开节点方法，重新查询该节点下的所有子节点
    },
    // 异步加载数据
    loadNode (node, resolve) {
      if (node.level === 0) {
        this.treeLoading = true
        axios
          .get(this.orgInterface)
          .then((res) => {
            if (res.data.code === 200) {
              this.orgData = res.data.data
              this.treeLoading = false
              this.returnId(res.data.data[0].riskId)
              return resolve(this.orgData)
            } else {
              this.orgData = []
              this.treeLoading = false
              this.$message.error('获取数据失败，请稍后刷新页面重试')
            }
          })
      } else if (node.level === 1) {
        // 直接取上一个节点获取的children
        return resolve(this.orgData[0].children)
      } else {
        axios
          .get(`${this.childInterface}`, {
            riskId: node.data.riskId,
            level: node.data.level
          })
          .then((res) => {
            if (res.data.code === 200) {
              return resolve(res.data.data)
            } else {
              this.$message.error('获取数据失败，请稍后刷新页面重试')
            }
          })
      }
    },
    // 返回给父组件初始ID，调用父组件方法
    returnId (id) {
      this.$emit('return-id', id)
    },
    // open
    openAll () {
      this.openState = !this.openState
      this.$refs.tree.$children[0].expanded = true
    },
    // close
    closeAll () {
      this.openState = !this.openState
      this.$refs.tree.$children[0].expanded = false
    },
    // 筛选
    filterNode (value, data) {
      if (!value) return true
      return data.riskName.indexOf(value) !== -1
    },
    // 点击节点，切换右侧结构视图
    handleNodeClick (data) {
      this.$emit('tree-click-handle', {
        riskId: data.riskId,
        level: data.level,
        treeLevel: data.treeLevel,
        pId: data.pId
      })
    },
    // 添加icon的class
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
    // 添加
    append (node, data) {
      this.openAppendBox(data)
    },
    // 向子节点添加节点
    appendChild (node, data) {
      this.$emit('tree-add-item', {
        pId: data.riskId
      })
    },
    // 打开添加节点的窗口
    openAppendBox (data) {
      this.$emit('tree-add-item', {
        riskId: data.riskId,
        level: data.level,
        treeLevel: data.treeLevel,
        pId: data.pId
      })
    },
    // 编辑
    edit (node, data) {
      this.$emit('tree-edit-item', {
        riskId: data.riskId,
        level: data.level,
        treeLevel: data.treeLevel,
        pId: data.pId
      })
    },
    // 删除
    remove (node, data) {
      this.$emit('tree-del-item', {
        riskId: data.riskId,
        level: data.level,
        treeLevel: data.treeLevel,
        pId: data.pId
      })
    },
    // 编辑机构
    editOrgHandle () {
      this.$emit('eidit-org')
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
    padding: 56px 10px 60px 10px;
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
