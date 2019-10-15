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
        :data="data"
        :props="defaultProps"
        default-expand-all
        :filter-node-method="filterNode"
        ref="tree">
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
      data: [{
        id: 1000131,
        label: '黑龙江总公司',
        children: [{
          id: 4,
          label: '安管部',
          children: [{
            id: 9,
            label: '检查组'
          }, {
            id: 10,
            label: '设备组'
          }]
        }, {
          id: 4,
          label: '生产部',
          children: [{
            id: 9,
            label: '生产A组'
          }, {
            id: 10,
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
}
</style>
