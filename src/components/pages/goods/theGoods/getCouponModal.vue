<template>
<div class="couponCont">
  <div class="title">
    <span class="titleName">优惠券</span>
    <span class="closeModalBtn" v-on:click="closeCouponModel()"></span>
  </div>
  <div class="orderScroll">
    <div class="orderInfo" v-for="(item,index) in theCouponData">
      <div class="orderPrice">
        <p>{{item.money}}<span class="money">元</span>
          <span v-if="item.platformShopType == 0">全平台使用</span>
          <span v-if="item.platformShopType == 1">该商铺使用</span>
        </p>
        <button class="button button-small button-red status" v-if="item.ifGetCoupon == 0" v-on:click="getCoupon(item)">点击领取</button>
        <button class="button button-small button-red status" v-if="item.ifGetCoupon == 1">已领取</button>
      </div>
      <p class="conditions">使用条件: 
        <span v-if="item.platformShopType == 0">不限制</span>
        <span v-if="item.platformShopType == 1">该商铺使用</span>
      </br>截止日期: <span>{{item.getEndTime}}</span></p>
    </div>
  </div>
</div>
</template>
<script>
export default {
  props: [
    'theCouponData'
  ],
  data () {
    return {
    }
  },
  activated () {
  },
  methods: {
    getCoupon (info) {
      this.$emit('getCoupon', info)
    },
    closeCouponModel () {
      console.log(111)
      this.$emit('closeCouponModel')
    }
  }
}
</script>
<style lang="less" scoped>
@import "../../../../../static/css/main.less";
.couponCont{
  padding: .2rem;
  .title{
    height: .8rem;
    width: 100%;
    position: relative;
    .titleName{
      font-size: .32rem;
      position: absolute;
      text-align: center;
      margin-left: 45%
    }
    .closeModalBtn{
      width: .5rem;
      height: .5rem;
      float: right;
    }
  }
  .orderScroll{
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    height: 7.5rem;
    .orderInfo{
      height: 2.5rem;
      margin-top:.3rem;
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
}
</style>
