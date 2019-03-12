<template>
  <div class="page payStatusPage">
    <div class="page-content">
      <div class="status" v-if="isFHX">
        <div class="succeed" v-if="data.status == 1 && !checkShow">支付成功</div>
        <div class="failure" v-if="data.status == 2 && !checkShow">支付失败</div>
      </div>
      <div class="btns" v-if="isFHX && !checkShow">
        <p class="button button-full-red" v-on:click="seeOrder()">查看订单</p>
        <p class="button button-full-red" v-if="data.status == 1" v-on:click="goIndex()">继续逛逛</p>     
      </div>
      <div class="btns" v-if="isFHX && checkShow">
        <p class="button button-full-red" v-on:click="checkPayResult()">查看支付结果</p>
      </div>
      <div class="status status2" v-if="!isFHX">
      </div>
      <div class="btns" v-if="!isFHX">
        <div class="word">温馨提示：感谢您对凤凰优选商城的支持，查看订单支付状态请返回“凤凰会”APP</div>
        <p v-on:click="gotoTest()" class="button button-half-red">返回凤凰会</p>
      </div>
    </div>
  </div>
</template>
<script>
import store from '../../../store/index'
export default{
  data () {
    return {
      data: {status: 0, platform: 0, orderId: 0},
      payType: 0,
      isFHX: true,
      checkShow: true
    }
  },
  store,
  activated () {
    var that = this
    that.data.status = that.$route.params.status
    that.data.platform = that.$route.params.platform
    that.data.orderId = that.$route.params.orderId
    that.checkoutIsFHX()
    if (that.data.platform === 'zeroPay') this.checkShow = false
    if (that.$store.state.mutations.isApp === 1) this.checkShow = false
  },
  methods: {
    gotoTest () {
      window.location.href = 'fhh://'
    },
    checkPayResult () {
      this.checkoutData()
    },
    checkoutData () {
      var that = this
      if (that.data.status === 3 || that.data.status === '3') { // H5支付
        that.$axios.get('/order/app/pay/getResult/' + that.data.orderId + '/' + that.data.platform).then((res) => {
          res === 'PAYED' ? that.data.status = 1 : that.data.status = 2
          that.checkShow = false
        })
      }
    },
    checkoutIsFHX () {
      if (!window.localStorage.getItem('isFHX')) this.isFHX = false
    },
    paymentType (type) {
      this.payType = type
    },
    seeOrder () { // 查看订单
      this.$loading.open()
      setTimeout(() => {
        window.localStorage.setItem('orderGotoHome', 'orderGotoHome')
        this.$loading.close()
        this.$router.push({path: '/order/orderList/0.1'})
      }, 2000)
    },
    goIndex () { // 回首页
      window.eventBus.$emit('updateClick')
      // if (this.getLocalstorage('shopData').admin === 'yes') {
      //   this.$router.push({path: '/home/index/shopTemplate/default'})
      // } else {
      //   this.$router.push({path: '/home/index/shopTemplate/general'})
      // }
    }
  }
}
</script>
<style lang="less" scoped>
.navbar{
  display: none!important;
}
.font{
  font-size:.3rem ;
  color: #89262a;
}
.page-content{
  background: #fafafa;
  .status{
    height: 4.5rem;
    padding-top: 1.3rem;
  }
  .address1,.address2{
    padding:.3rem;
    margin:.25rem .3rem;
    box-shadow: 0px 4px 9px 0px #ddd;
    h3{
      font-size: .36rem;
      color: #1a191e;
      line-height:.6rem;
      span{
        margin-left: .4rem;
      }
    }
    .addressInfo{
      font-size: .28rem;
      span{
        display:inline-block;
        width: 1.5rem;
        color: #929999;
      }
      p{
        display: inline-block;
      }
    }
  }
  .succeed,.failure{
    width: 100%;
    text-align: center;
    font-size: .38rem;
    color: #1a191e;
    padding-top: 2.6rem;
  }
  .prices{
    font-size: .28rem;
    padding:0 .24rem;
    span{
      font-size: .36rem;
      color: #89262a;
    }
  }
  .btns{
    height: 1rem;
    padding:0 .25rem;
    margin-top: 1rem;
    text-align: center;
    font-size: .32rem;
    .word{
      margin:0;
      margin:0 auto;
      float: none;
      margin-bottom: .5rem;
      color: #666;
    }
    p{
      margin:0;
      margin:0 auto;
      float: none;
      margin-bottom: .5rem;
    }
    p:last-child{
      color: #fff;
    }
  }
}
</style>
