<!-- 树形结构图（右） -->
<template>
  <div class="tree-diagram">
    <div class="tree-title">
      <i class="double-line-icon"></i>
      排查机构
      <div class="tree-search">
        <el-input
          placeholder="输入关键字进行过滤"
          v-model="filterText">
        </el-input>
      </div>
    </div>
    <div class="tree-box">
      <el-tree
        class="filter-tree"
        :data="treeData"
        :props="defaultProps"
        default-expand-all
        node-key="id"
        :filter-node-method="filterNode"
        :expand-on-click-node="false"
        @node-click="handleNodeClick"
        ref="tree">
        <span class="custom-tree-node" slot-scope="{ node, data }" :title="node.label">
          <span>{{ node.label }}</span>
          <span class="right-btns">
            <i class="el-icon-plus" @click="() => append(data)"></i>
            <i class="el-icon-edit"></i>
            <i class="el-icon-delete"  @click="() => remove(node, data)"></i>
          </span>
        </span>
      </el-tree>
      <!--
      <el-tree
        :data="data"
        show-checkbox
        node-key="id"
        default-expand-all
        :expand-on-click-node="false">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span>
            <el-button
              type="text"
              size="mini"
              @click="() => append(data)">
              Append
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="() => remove(node, data)">
              Delete
            </el-button>
          </span>
        </span>
      </el-tree>
      -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'treeDiagram',
  data () {
    return {
      filterText: '',
      treeData: [{
        id: 1000131,
        label: '《安全生产管理平台》东三省黑龙江分部总公司',
        children: [{
          id: 1003422,
          label: '安管部',
          children: [{
            id: 1004521,
            label: '检查组'
          }, {
            id: 1004522,
            label: '设备组'
          }]
        }, {
          id: 1000135,
          label: '生产部',
          children: [{
            id: 1060121,
            label: '生产A组'
          }, {
            id: 1060122,
            label: '生产B组'
          }]
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods: {
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleNodeClick (data) {
      // 点击切换节点
      // console.log(data)
    },
    remove (node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
    },
    append (data) {
      const newChild = { label: 'testtest', children: [] }
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      console.log(data)
      data.children.push(newChild)
    }
  },
  watch: {
    filterText (val) {
      console.log(this.$refs.tree)
      this.$refs.tree.filter(val)
    }
  }
}
</script>

<style scoped lang="scss">
  /deep/.tree-diagram{
  width: 418px;
  height: 100%;
  background: #fff;
  .tree-title{
    padding-left: 30px;
    position: relative;
    height: 50px;
    line-height: 49px;
    border-bottom: 1px solid #eeeeee;
    color: #333333;
    font-size: 18px;
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
      overflow: hidden;
      vertical-align: top;
      left: 134px;
      top: 12px;
      height: 24px;
      width: 180px;
      border-radius: 6px;
      line-height: 24px;
      border: 1px solid #585858;
      .el-input{
        height: 22px;
        vertical-align: top;
        .el-input__inner{
          border: none;
          height: 22px;
          font-size: 12px;
        }
      }
    }
  }
  .tree-box{
    padding: 6px 4px;
    overflow: auto;
    .custom-tree-node{
      display: inline-block;
      width: 15em;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      .right-btns{
        position: absolute;
        right: 8px;
      }
    }
    .el-tree-node__content{
      margin-top: 10px;
    }
  }
}
</style>
