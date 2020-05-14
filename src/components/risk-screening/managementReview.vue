<template>
  <el-container class="inner-page-container">
    <el-header class="inner-header">
      <bread-crumb :breadList="breadcrumb">
      </bread-crumb>
    </el-header>
    <el-main class="inner-main-container">
      <el-tabs
        v-model="type"
        @tab-click="tabClickHandle"
        type="border-card"
        class="height-100">
        <el-tab-pane
          label="基础管理类隐患排查清单"
          name="基础类排查清单"
          :key="'基础类排查清单'">
          <span slot="label">基础管理类隐患排查清单</span>
          <basic-list v-if="isChildUpdate1" :type="type" :hiddInstanceId= 'hiddInstanceId'></basic-list>
        </el-tab-pane>

        <el-tab-pane
          label="生产现场类隐患排查清单"
          name="现场类排查清单"
          :key="'现场类排查清单'">
          <span slot="label">生产现场类隐患排查清单</span>
          <product-list v-if="isChildUpdate2" :type="type" :hiddInstanceId= 'hiddInstanceId'></product-list>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>
<script>
import BreadCrumb from '@/components/Breadcrumb/Breadcrumb'
import basicList from '@/components/risk-screening/manage-review-basic/list'
import productList from '@/components/risk-screening/manage-review-product/list'
export default {
  name: 'managementReview',
  data () {
    return {
      breadcrumb: ['隐患排查治理', '治理复核'],
      type: '基础类排查清单', // tab切换类型
      isChildUpdate1: true, // tab1切换开关，刷新
      isChildUpdate2: false, // tab2切换开关，刷新
      hiddInstanceId: '' // businessKey
    }
  },
  components: {
    BreadCrumb, // 面包屑
    basicList,
    productList
  },
  created () {
    this.initData()
    this.extractKey()
  },
  methods: {
    initData () {
      let vm = this
      // 从路由上存取当前页面的tabType
      if (vm.$route.query.tabType) {
        vm.type = vm.$route.query.tabType
      } else {
        vm.type = '基础类排查清单'
      }
      if (vm.type === '基础类排查清单') {
        this.isChildUpdate1 = true
        this.isChildUpdate2 = false
      } else if (vm.type === '现场类排查清单') {
        this.isChildUpdate1 = false
        this.isChildUpdate2 = true
      }
    },
    // tab切换处理
    tabClickHandle (tab, event) {
      this.type = tab.name
      if (tab.name === '基础类排查清单') {
        this.isChildUpdate1 = true
        this.isChildUpdate2 = false
      } else if (tab.name === '现场类排查清单') {
        this.isChildUpdate1 = false
        this.isChildUpdate2 = true
      }
    },
    extractKey () {
      if (this.$route.query.businessKey) {
        this.hiddInstanceId = this.$route.query.businessKey
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
