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
        <el-button type="text" @click="openUpload" v-show="hasUpload">上传</el-button>
        <el-button type="text" @click="openAll" v-show="openState">展开</el-button>
        <el-button type="text" @click="closeAll" v-show="!openState">收起</el-button>
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
      hasUpload: true,
      treeName: '排查机构',
      filterText: '',
      treeData: [
        {
          id: 1000131,
          label: '《安全生产管理平台》东三省黑龙江分部总公司',
          children: [
            {
              id: 1003422,
              label: '安管部',
              children: [
                {
                  id: 1004521,
                  label: '检查组',
                  data: {
                    name: 'AAA',
                    duty: 'clean job'
                  }
                }, {
                  id: 1004522,
                  label: '设备组'
                }
              ]
            }, {
              id: 1000135,
              label: '生产部',
              children: [
                {
                  id: 1060121,
                  label: '生产A组'
                }, {
                  id: 1060122,
                  label: '生产B组'
                }
              ]
            }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
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
        // const newBro = { label: 'testtest', children: [] }
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
