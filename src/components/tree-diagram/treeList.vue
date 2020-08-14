<!-- 菜单 - 计划清单（右） -->
<!-- 说明：
  -- 1、 showOperation ：是否显示计划清单菜单操作栏；
  -- 2、 showAddMenuBtn ：是否显示创建清单按钮；
  -- 3、 showEditOrgBtn ：是否显示编辑机构按钮；
  -- 4、 showSearch ：是否显示search input；
  -- 5、 menuName ：菜单的标题名称
 -->
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
          v-show="showSearch"
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
          v-show="showEditOrgBtn"
          class="aside-btns-item"
          href="javascript:;"
          @click="eiditOrgHandle()">编辑机构</a>
        <a
          v-show="showAddMenuBtn"
          class="aside-btns-item"
          href="javascript:;"
          @click="addMenuHandle()">创建清单</a>
      </div>
    </div>
    <ul class="tree-list">
      <li
        class="tree-list-item text-center tree-list-item-nodata"
        v-if="filterData.length === 0">
        暂无数据
      </li>
      <li
        v-else
        v-for="(item, index) in filterData"
        :key="index"
        :class="{ active : currentTab === item.planId }"
        @click="menuClickHandle(item.planId)"
        class="tree-list-item">
        <div
          class="tree-list-name">
          {{item.planName}}</div>
        <div v-if="showOperation" class="tree-list-operation">
          <i
            v-show="showEditBtn"
            class="el-icon-edit"
            title="修改菜单项"
            @click="editMenuHandle(item.planId)"></i>
          <i
            v-show="showDelBtn"
            class="el-icon-delete"
            title="删除菜单项"
            @click="delMenuHandle(item.planId)"></i>
        </div>
      </li>
    </ul>
  </div>

</template>

<script>
export default {
  // name: '计划清单',
  props: {
    currentId: {
      type: String,
      default: ''
    },
    showSearch: {
      type: Boolean,
      default: false
    }, // 搜索显示开关
    showEditOrgBtn: {
      type: Boolean,
      default: false
    }, // 编辑组织机构按钮显示开关
    showAddMenuBtn: {
      type: Boolean,
      default: false
    }, // 创建清单按钮显示开关
    menuName: {
      type: String,
      default: ''
    }, // 菜单标题
    listData: {
      type: Array,
      default: null
    }, // 计划清单列表数据
    showOperation: {
      type: Boolean,
      default: false
    }, // 计划清单菜单操作栏是否显示开关
    showEditBtn: {
      type: Boolean,
      default: false
    },
    showDelBtn: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      currentTab: this.currentId, // 菜单当前项, 默认数据的第一项
      filterText: '', // 搜索关键词
      filterData: [] // 搜索后的数据
    }
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
      this.currentTab = item
      this.$emit('menu-click-handle', {
        planId: item
      })
    },
    // 编辑清单
    editMenuHandle (item) {
      this.$emit('eidt-menu-handle', {
        planId: item
      })
    },
    // 删除清单
    delMenuHandle (item) {
      this.$emit('del-menu-handle', {
        planId: item
      })
    }
  },
  watch: {
    filterText (val) {
      // this.filterData = this.listData.filter(
      //   // data => !val || data.planName.toLowerCase().includes(val.toLowerCase())
      //   return val;
      // )
      this.filterData = this.listData.filter(data => {
        if (data !== null) {
          return data.planName.includes(val)
        }
      })
    },
    listData: {
      immediate: true,
      handler (val) {
        this.filterData = val
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/utils/css/tools/_variables.scss';
.left-menu{
  background: #ffffff;
  position: relative;
  width: 100%;
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
  width: 160px;
  margin-left: 5px;
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
// .tree-list-operation{

// }
</style>
