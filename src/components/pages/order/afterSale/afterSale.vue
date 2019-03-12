<template>
<div class="page">
  <m-header>
    <span slot="left"></span>
    <span slot="title">售后服务</span>
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
import saleTemplate from './saleTemplate.vue'
export default{
  name: 'orderList',
  components: {
    saleTemplate
  },
  data () {
    return {
      tabs: ['全部', '退款', '退货'],
      tabIndex: 0,
      swiperOption: {
        slidesPerView: 3,
        paginationClickable: true,
        spaceBetween: 0,
        freeMode: true
      }
    }
  },
  created () {
    var that = this
    that.clearBadge()
    that.tabIndex = parseInt(that.$route.params.type)
  },
  methods: {
    clearBadge () { // 清角标
      var that = this
      var clearPar = {
        'shopId': that.getLocalstorage('shopId'),
        'userId': that.getLocalstorage('userInfo').id
      }
      that.$axios.post('/msg/delete/refund', clearPar).then((res) => {
      })
    },
    onTabClick: function (index) { // 选项卡
      this.tabIndex = index
      this.$router.replace(`/afterSale/saleList/${index}`)
    }
  }
}
</script>
<style lang="less" scoped>
</style>
