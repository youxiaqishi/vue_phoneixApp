<template>
  <div class="page has-navbar couponCont">
    <m-header>
      <span slot="left"></span>
      <span slot="title">领取优惠券</span>
    </m-header>
    <div class="page-content">
      <div style="padding: .2rem;">
        <div class="orderInfo" v-for="(item,index) in Coupon">
          <div class="orderPrice">
            <p>{{item.money}}<span class="money">元</span>
              <span v-if="item.platformShopType==0">全平台使用</span>
              <span v-if="item.platformShopType==1">该商铺使用</span>
            </p>
            <button class="button button-small button-red status" v-if="item.ifGetCoupon=='0'" v-on:click="getCoupon(item)">点击领取</button>
            <button class="button button-small button-red status" v-if="item.ifGetCoupon=='1'">已领取</button>
          </div>
          <p class="conditions">使用条件: 
            <span v-if="item.platformShopType==0">不限制</span>
            <span v-if="item.platformShopType==1">该商铺使用</span>
          </br>截止日期: <span>{{item.getEndTime}}</span></p>
        </div>
      </div>
      <div class="no-coupon" v-if="Coupon.length == 0">
          <p>暂无可使用的优惠券<br/>保持关注哦</p>
      </div>
    </div>
  </div>
</template>
<script>
export default{
  props: [
  ],
  data () {
    return {
      Coupon: []
    }
  },
  activated () {
    this.getCouponData()
  },
  methods: {
    getCouponData () {
      var that = this
      that.$loading.open()
      that.$axios.get('/app/coupon/app/user/query/get/coupon/' + this.$route.params.id).then((res) => {
        if (res) {
          that.$loading.close()
          that.Coupon = res
        }
      })
    },
    getCoupon (info) {
      var that = this
      var params = {
        'couponId': info.id,
        'goodsId': this.$route.params.id
      }
      that.$loading.open()
      that.$axios.post('/app/coupon/by/goods/get/coupon', params).then((res) => {
        if (res) {
          that.$loading.close()
          that.$toast('领取成功')
          info.ifGetCoupon = 1
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.orderInfo{
  height: 2.5rem;
  margin-top:.3rem;
  color: white;
  padding: 0 .2rem;
  border-radius: 2px;
  position: relative;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
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
    .cancleStatus{
        position: absolute;
        right: .3rem;
        top: .5rem;
        font-size: .28rem;
        color: white;
        background-color: #89262a;
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
.ctBottomPay1 {
    position: fixed;
    bottom: 0.3rem;
    height: 0.98rem;
    width: 100%;
    min-width: 320px;
    max-width: 750px;
    background-color: #FAFAF9;
    .ctPaySure {
      display: block;
      width: 92%;
      margin: auto;
      height: 1rem;
      line-height: 1rem;
      text-align: center;
      background-color: #89262a;
      color: #fff;
      font-size: 0.32rem;
      border: 1px solid #89262a;
      border-radius: 2px;
  }
}
.noCoupon{
  width: 100%;
    text-align: center;
    margin-top: 1.4rem;
    height: 2.5rem;
    margin: 0 auto 0.3rem;
    background: none; 
    display: block;
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
