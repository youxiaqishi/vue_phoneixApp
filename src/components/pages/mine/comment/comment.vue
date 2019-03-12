<template>
<div class="page couponCont">
  <m-header>
    <span slot="left"></span>
    <span slot="title">我的评价</span>
  </m-header>
  <div class="topTabs">
    <swiper :options="swiperOption">
      <swiper-slide v-for="(tab,index) in tabs"  :class="{'active':index == tabIndex}" :key="index">
        <div @click="onTabClick(index)">{{tab.name}}</div>
      </swiper-slide>
    </swiper>    
  </div>
  <keep-alive>
    <router-view :key="tabIndex"></router-view>
  </keep-alive>
</div>
</template>
<script>
export default{
  data () {
    return {
      tabs: [
        {name: '全部', type: 'FALSE'},
        {name: '有图', type: 'TRUE'}
      ],
      tabIndex: 0,
      swiperOption: {
        slidesPerView: 2,
        paginationClickable: true,
        spaceBetween: 0,
        freeMode: true
      }
    }
  },
  activated () {
    this.tabIndex = parseInt(this.$route.params.type)
  },
  mounted () {
  },
  methods: {
    onTabClick (index) {
      this.tabIndex = index
      this.$router.replace(`/comment/commentList/${index}`)
    }
  }
}
</script>
<style lang="less" scoped>
.page-content{
  background: #fff;
}
</style>
