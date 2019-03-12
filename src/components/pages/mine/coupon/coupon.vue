<template>
<div class="page couponCont">
  <m-header>
    <span slot="left"></span>
    <span slot="title">优惠券</span>
  </m-header>
  <div class="topTabs">
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
  <div class="ctBottom">
    <router-link to="/addCoupon" tag="p" class="button button-full-red">
      添加优惠券
    </router-link>
  </div>
</div>
</template>
<script>
export default{
  data () {
    return {
      tabs: [
        '未使用',
        '已使用',
        '已失效'
      ],
      tabIndex: 0,
      swiperOption: {
        slidesPerView: 3,
        paginationClickable: true,
        spaceBetween: 0,
        freeMode: true
      }
    }
  },
  activated () {
    this.tabIndex = parseInt(this.$route.params.type)
  },
  computed: {
  },
  methods: {
    onTabClick (index) {
      this.tabIndex = index
      this.$router.replace(`/coupon/couponList/${index}`)
    }
  }
}
</script>
<style lang="less" scoped>
.page-content{
  margin-bottom: 1rem;
}
.orderInfo{
  height: 2.5rem;
  margin: .3rem .2rem .3rem .2rem;
  color: white;
  padding: 0 .2rem;
  border-radius: 2px;
  position: relative;
  .orderPrice{
    height: 1.5rem;
    p{
      font-size: .8rem;
      color: #89262a;
      span{
        font-size: .36rem;
        color: #1a191e;
      }
      span.money{
        font-size: .28rem;
        margin-right: .4rem;
        color: #89262a;
      }
    }
    .status{
        position: absolute;
        right: .3rem;
        top: .5rem;
        font-size: .28rem;
        color: #89262a;
    }
  }
  .conditions{
    color: #929999;
    font-size: .28rem;
  }
}
.lapse{
  .orderPrice{
    p{
      color: #626666;
      span{
        color: #929999;
      }
      span.money{
        color: #626666;
      }
    }
    .status{
        color: #626666;
    }
  }
}
.ctBottom {
    position: fixed;
    bottom: 0.3rem;
    height: 0.98rem;
    width: 100%;
}
.noCoupon{
  width: 100%;
    text-align: center;
    margin-top: 1.4rem;
    height: 2.5rem;
    margin: 0 auto 0.3rem;
    background: none; 
    display: block;
    img{
      width: 3.1rem;
      height: 3.52rem;
      margin-top: 2rem;
      background-color: gray;
    }
    p{
      margin-top: 25px;
      font-size: 0.3rem;
      color: #323333 !important;
      line-height: normal;
      padding: 0;
    }
    span{
      font-size: 0.24rem;
      color: #929999;
      margin-top: 0.28rem;
      display: block;
    }
}
</style>
