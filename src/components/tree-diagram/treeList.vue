<template>
  <ul class="tree-list">
    <li
      v-for="(item, index) in listData"
      :key="index"
      :class="{ active : currentTab === item.type }"
      class="tree-list-item">
      <div @click="menuClickHandle(item.id)" class="tree-list-name"> {{item.name}}</div>
      <div v-if="operationSwitch" class="tree-list-operation">
        <i
          class="el-icon-edit"
          title="修改菜单项"
          @click="editMenuHandle(item.id)"></i>
        <i
          class="el-icon-delete"
          title="删除菜单项"
          @click="delMenuHandle(item.id)"></i>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  // name: '计划清单',
  props: {
    listData: {
      type: Array,
      default: null
    }, // 计划清单列表数据
    operationSwitch: {
      type: Boolean,
      default: true
    } // 计划清单菜单操作栏是否显示开关
  },
  data () {
    return {
      currentTab: '1'
    }
  },
  created () {
  },
  methods: {
    // 点击菜单项，切换右侧内容
    menuClickHandle (item) {
      this.$emit('menu-click-handle', {
        menuId: item
      })
    },
    // 编辑清单
    editMenuHandle (item) {
      this.$emit('eidt-menu-handle', {})
    },
    // 删除清单
    delMenuHandle (item) {
      this.$emit('del-menu-handle', {})
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/utils/css/style.scss';
.tree-list{
  padding: 61px 0 10px;
}
.tree-list-item{
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 6px 29px;
  color: #646464;
  margin-bottom: 6px;
  &.active,
  &:hover{
    color: $colorPrimary;
    background: #f1f5f9;
  }
}
.tree-list-name{
  font-size: 16px;
}
.tree-list-operation{

}
</style>
