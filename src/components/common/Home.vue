<template>
  <div class="wrapper">
    <keep-alive>
    <!-- <mr-navigation> -->
      <router-view></router-view>
    <!-- </mr-navigation> -->
    </keep-alive>
    <m-tabbar @tabChanged="tabChanged"></m-tabbar>
  </div>
</template>
<script>
import mTabbar from './tabbar.vue'
export default {
  components: {
    mTabbar
  },
  data () {
    return {
      routerViewIndex: '首页'
    }
  },
  methods: {
    tabChanged (tabName) {
      console.log(tabName)
      // this.routerViewIndex = tabName
    }
  }
}
</script>
