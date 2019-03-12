<template>
  <div class="page couponCont">
    <m-header>
      <span slot="left"></span>
      <span slot="title">使用优惠券</span>
    </m-header>
    <div class="page-content">
      <div style="padding: .2rem;">
        <div class="orderInfo" :class="{'lapse':item.status == 0 || item.isChoosed==2 || item.shopGoodsDTO.length==0}" v-for="(item,index) in $route.params.couponData">
          <div class="orderPrice">
            <p>{{item.money}}<span class="money">元</span>
              <span v-if="$route.params.type==0">全平台使用</span>
              <span v-if="$route.params.type==1">商铺使用</span>
            </p>
            <button class="button button-small button-red status" v-if="item.status==1 && (item.isChoosed==0 || item.isChoosed==1)&&item.shopGoodsDTO.length>0" v-on:click="useCoupon(item,index)">
              <span v-if="item.isChoosed==0">点击使用</span>
              <span v-if="item.isChoosed==1">取消</span>
            </button>
            <button class="button button-small button-gray status" v-if="item.status==0">已使用</button>
          </div>
          <p class="conditions">使用条件: 
            <span v-if="$route.params.type==0">无限制</span>
            <span v-if="$route.params.type==1">仅限商铺</span>
          </br>截止日期: <span>{{item.validEndTime}}</span></p>
        </div>
      </div>
      <div class="no-coupon" v-if="$route.params.couponData.length == 0">
          <p>暂无可使用的优惠券</p>
          <span>保持关注哦</span>
      </div>
    </div>
  </div>
</template>
<script>
export default{
  data () {
    return {
    }
  },
  activated () {
    console.log(this.$route.params.couponData)
  },
  methods: {
    useCoupon (info, index) {
      var that = this
      info.isChoosed === 0 ? info.isChoosed = 1 : info.isChoosed = 0
      // 遍历本优惠券下所有商品
      // 再遍历其他优惠券下所有商品有匹配的 就把这张优惠券选中状态改为不可选
      info.shopGoodsDTO.forEach(function (infoGood, infoGoodIndex) {
        that.$route.params.couponData.forEach(function (coupon, couponIndex) {
          if (info.id !== coupon.id) {
            coupon.shopGoodsDTO.forEach(function (couponGood, couponGoodIndex) {
              if (infoGood.goodsId === couponGood.goodsId) {
                info.isChoosed === 1 ? coupon.isChoosed = 2 : coupon.isChoosed = 0
              }
            })
          }
        })
      })
      // 清除优惠券使用标识
      if (that.getLocalstorage('removeCoupon')) window.localStorage.removeItem('removeCoupon')
      that.$route.params.type === 0 ? window.localStorage.setItem('platformCouponData', JSON.stringify(that.$route.params.couponData)) : window.localStorage.setItem('shopCouponData', JSON.stringify(that.$route.params.couponData))
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
