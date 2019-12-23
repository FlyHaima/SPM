<template>
  <div class="left-menu">
    <div class="aside-header">
      <div class="aside-left">
        <div class="aside-title">
          <i></i>
          <span class="aside-title-text">
            {{menuName}}
          </span>
        </div>
        <div
          v-show="searchVisible"
          class="tree-search">
          <el-input
            size="mini"
            placeholder="输入关键字进行过滤"
            v-model="filterText">
          </el-input>
        </div>
      </div>
      <div class="aside-btns">
        <a
          v-show="editOrgVisible"
          class="aside-btns-item"
          href="javascript:;"
          @click="eiditOrgHandle()">编辑机构</a>
        <a
          v-show="addMenuVisible"
          class="aside-btns-item"
          href="javascript:;"
          @click="addMenuHandle()">创建清单</a>
      </div>
    </div>
    <ul class="tree-list">
      <li class="tree-list-item text-center tree-list-item-nodata" v-if="this.filterData.length === 0">
        暂无数据
      </li>
      <li
        v-else
        v-for="(item, index) in filterData"
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
  </div>

</template>

<script>
export default {
  // name: '计划清单',
  props: {
    searchVisible: {
      type: Boolean,
      default: false
    },
    editOrgVisible: {
      type: Boolean,
      default: false
    },
    addMenuVisible: {
      type: Boolean,
      default: false
    },
    menuName: {
      type: String,
      default: ''
    },
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
      currentTab: '1',
      filterText: '',
      filterData: []
    }
  },
  created () {
    this.filterData = this.listData
  },
  methods: {
    // 创建清单
    addMenuHandle () {
      this.$emit('add-menu-handle')
    },
    // 编辑机构
    eiditOrgHandle () {
      this.$emit('eidit-org-handle')
    },
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
  },
  watch: {
    filterText (val) {
      console.log(val)
      this.filterData = this.listData.filter(
        data => !val || data.name.toLowerCase().includes(val.toLowerCase())
      )
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/utils/css/style.scss';

.left-menu{
  background: #ffffff;
  position: relative;
  width: 400px;
  height: 100%;
}
.aside-header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 22px;
  height: 50px;
  border-bottom: 1px solid #eeeeee;
}
.aside-title{
  display: inline-block;
  line-height: 16px;
  color: #333333;
  font-size: 18px;
  i{
    display: inline-block;
    background: url('../../assets/img/blue-double-line.png');
    width: 3px;
    height: 16px;
    line-height: 16px;
    background-size: cover;
    margin-right: 7px;
    vertical-align: top;
  }
}
.aside-title-text{
  display: inline-block;
  line-height: 16px;
  vertical-align: top;
}
.aside-btns{
  font-size: 0;
}
.aside-btns-item{
  display: inline-block;
  font-size: 16px;
  + .aside-btns-item{
    margin-left: 30px;
  }
}
.tree-search{
  display: inline-block;
  width: 180px;
  margin-left: 20px;
}

.tree-list{
  padding: 0 0 10px;
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
.tree-list-item-nodata{
  padding-top: 30px;
}
.tree-list-name{
  font-size: 16px;
}
.tree-list-operation{

}
</style>
