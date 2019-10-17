<!-- 树形结构图（右） -->
<!-- 说明：
  -- 1、level：用于规定最多可添加到第几层级；
  -- 2、addBro：如果在最后一级添加节点，会变成添加兄弟节点；
  -- 3、showEditor：是否显示层级编辑按钮区域（关联权限）
 -->
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
            <i class="el-icon-plus" title="添加节点" @click="append(node, data)"></i>
            <i class="el-icon-edit" title="修改节点" @click="edit(node)"></i>
            <i class="el-icon-delete" title="删除节点"  @click="remove(node, data)"></i>
          </span>
        </span>
      </el-tree>
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
            label: '检查组',
            data: {
              name: ''
            }
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
      },
      level: 3,
      addBro: false
    }
  },
  methods: {
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleNodeClick (data) { // 点击节点，切换右侧结构视图
      // this.$emit('open-loading')
    },
    append (node, data) {
      this.openAppendBox()
      if (node.level < this.level) {
        const newChild = { label: 'testtest', children: [] }
        if (!data.children) {
          this.$set(data, 'children', [])
        }
        console.log(data)
        data.children.push(newChild)
      } else if (this.addBro && node.level === this.level) {
        const newBro = { label: 'testtest', children: [] }
      } else {
        this.$message({
          message: '最多可添加到第' + this.level + '级',
          type: 'warning'
        })
      }
    },
    openAppendBox () {
      this.$prompt('请输入节点名称', '添加节点', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
        // inputPattern: '', // 输入正则
        // inputErrorMessage: '' // 正则验证错误提示
      }).then(() => {
        // 添加ajax
        this.$message({
          type: 'success',
          message: '节点设置成功'
        })
      }).catch(() => {
        // after cancel, do nothing
      })
    },
    edit (node) {
      this.openEditBox()
      console.log(node)
      node.data.label = 'new'
    },
    openEditBox () {
      this.$prompt('请输入节点名称', '添加节点', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
        // inputPattern: '', // 输入正则
        // inputErrorMessage: '' // 正则验证错误提示
      }).then(() => {
        // 添加ajax
        this.$message({
          type: 'success',
          message: '节点设置成功'
        })
      }).catch(() => {
        // after cancel, do nothing
      })
    },
    remove (node, data) {
      this.confirmRemove()
      // const parent = node.parent
      // const children = parent.data.children || parent.data
      // const index = children.findIndex(d => d.id === data.id)
      // children.splice(index, 1)
    },
    confirmRemove () {
      this.$prompt('请输入节点名称', '添加节点', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
        // inputPattern: '', // 输入正则
        // inputErrorMessage: '' // 正则验证错误提示
      }).then(() => {
        // 添加ajax
        this.$message({
          type: 'success',
          message: '节点设置成功'
        })
      }).catch(() => {
        // after cancel, do nothing
      })
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
