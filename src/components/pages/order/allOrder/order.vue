<template>
<div class="page">
  <m-header>
    <span slot="left1" v-if="$route.params.type == 0.1"></span>
    <span slot="left" v-if="$route.params.type != 0.1"></span>
    <span slot="title">我的订单</span>
  </m-header>
  <div class="topTabs" v-if="tabs">
    <swiper :options="swiperOption">
      <swiper-slide v-for="(tab,index) in tabs"  :class="{'active':index == tabIndex}" :key="tab.index">
        <div @click="onTabClick(index)">{{tab}}</div>
      </swiper-slide>
    </swiper>
  </div>
  <div class="page-content hasTopTabs">
    <keep-alive>
      <router-view :key="tabIndex"></router-view>
    </keep-alive>
  </div>
</div>
</template>
<script>
export default{
  data () {
    return {
      tabs: ['全部', '待付款', '待发货', '待收货', '待评价'],
      tabIndex: 0,
      swiperOption: {
        slidesPerView: 5,
        paginationClickable: true,
        spaceBetween: 0,
        freeMode: true
      }
    }
  },
  created () {
    var that = this
    that.tabIndex = parseInt(that.$route.params.type)
  },
  methods: {
    onTabClick (index) {
      this.tabIndex = index
      this.$router.replace(`/order/orderList/${index}`)
    }
  }
}
</script>
<style lang="less" scoped>
.pageCont{
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
