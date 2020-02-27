<template>
  <div class="tree-transfer">
    <div class="left-tree">
      <p class="tree-title">
        <i class="line-icon"></i>
        {{treeName}}
      </p>
      <el-input
        size="mini"
        placeholder="输入关键字进行过滤"
        v-model="filterText">
      </el-input>
      <el-tree
        class="filter-tree"
        :data="treeData"
        :props="defaultProps"
        node-key="deptId"
        :filter-node-method="filterNode"
        :expand-on-click-node="false"
        @node-click="handleNodeClick"
        :default-expanded-keys="defaultOpenNode"
        ref="tree">
          <span class="custom-tree-node" slot-scope="{ node, data }" :title="node.label">
            <span>{{ node.label }}</span>
            <span class="right-btns">
              <i class="el-icon-plus" title="添加" @click="append(node, data)"></i>
            </span>
          </span>
      </el-tree>
    </div>

    <div class="right-list">
      <p class="list-title">已选择：</p>
      <ul>
        <li class="list-item" v-for="(item, index) in chooseList" :key="index">
          {{item.nameStr}}
          <i class="el-icon-delete" title="删除" @click="remove(item.id)"></i>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'treeTransfer',
  props: ['chooseList', 'treeData'],
  data () {
    return {
      treeName: '组织架构',
      filterText: '',
      defaultProps: {
        children: 'children',
        label: 'deptName'
      },
      defaultOpenNode: [] // 默认展开节点的集合
    }
  },
  mounted () {
    this.fetchTreeNodeId(this.treeData)
    this.screenGetData(this.treeData)
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    }
    // treeData: {
    //   immediate: true,
    //   handler (val) {
    //     // console.log(val)
    //     // this.treeData = val
    //     this.fetchTreeNodeId()
    //   }
    // }
  },
  methods: {
    // 获取一节点集合
    fetchTreeNodeId (fData) {
      console.log(fData)
      fData.forEach(item => {
        this.defaultOpenNode.push(item.deptId)
      })
    },
    filterNode (value, data) {
      if (data.selected === false) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      } else {
        return false
      }
    },
    handleNodeClick (data) { // 点击节点，切换右侧结构视图

    },
    // 遍历list 并在selected 为false 时，改变 selected
    screenAppendData (fData) {
      let vm = this
      if (fData.selected === false) {
        if (fData.children) {
          for (let i = 0; i < fData.children.length; i++) {
            vm.screenAppendData(fData.children[i])
          }
        } else {
          vm.$set(fData, 'selected', true)
          fData.selected = true
          let newItem = {nameStr: fData.deptName, id: fData.deptId}
          vm.chooseList.push(newItem)
        }
      }
    },
    // 处理接收的tree数据，向每个节点添加 selected 属性，默认为false
    screenGetData (sData) {
      let vm = this
      for (let i = 0; i < sData.length; i++) {
        sData[i]['selected'] = false
        if (sData[i].children) {
          vm.screenGetData(sData[i].children)
        }
      }
    },
    append (node, data) {
      this.screenAppendData(data)
      this.$refs.tree.filter() // 操作后使用filter方法，筛选所有selected 不是 true 的
    },
    screenDelData (sData, id) {
      let vm = this
      for (let i = 0; i < sData.length; i++) {
        if (sData[i]['deptId'] === id) {
          sData[i]['selected'] = false
          return
        } else if (sData[i].children) {
          vm.screenDelData(sData[i].children, id)
        }
      }
    },
    remove (id) {
      let vm = this
      vm.screenDelData(vm.treeData, id)
      for (let i = 0; i < vm.chooseList.length; i++) {
        if (vm.chooseList[i]['id'] === id) {
          vm.chooseList.splice(i, 1)
        }
      }
      this.$refs.tree.filter()
    }
  }
}
</script>

<style scoped lang="scss">
.tree-transfer{
  width: 100%;
  height: 560px;
  display: flex;
  justify-content: space-between;
  padding: 0 12px;
  .left-tree,
  .right-list{
    height: 100%;
    background: #f7f9fc;
    overflow-y: auto;
    width: 340px;
  }
  .left-tree{
    padding: 0 16px 16px 16px;
    .tree-title{
      position: relative;
      width: 100%;
      padding-left: 9px;
      height: 49px;
      line-height: 49px;
      font-size: 18px;
      color: #646464;
      .line-icon{
        position: absolute;
        top: 17px;
        left: 0;
        display: block;
        width: 2px;
        height: 15px;
        background: #409eff;
      }
    }
  }
  .right-list{
    padding: 0 16px 16px 16px;
    .list-title{
      height: 49px;
      line-height: 49px;
      color: #909090;
    }
    ul{
      max-height: 495px;
      overflow-y: auto;
      .list-item{
        position: relative;
        line-height: 36px;
        color: #333333;
        font-weight: 400;
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        padding-right: 3em;
        .el-icon-delete{
          position: absolute;
          right: 4px;
          top: 11px;
          cursor: pointer;
        }
      }
    }
  }
}
/deep/.left-tree{
  .el-tree{
    background: #f7f9fc;
    height: 450px;
    overflow-y: auto;
  }
  .custom-tree-node{
    font-size: 16px;
    display: inline-block;
    width: 12em;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    .right-btns{
      position: absolute;
      right: 4px;
    }
  }
  .el-tree-node__content{
    margin-top: 10px;
  }
}
</style>
