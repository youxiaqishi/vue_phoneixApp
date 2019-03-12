<template>
<div class="page indexPage paymentPage">
  <m-header>
    <span slot="left"></span>
    <span slot="title">订单支付</span>
  </m-header>
  <div class="page-content">
    <div class="banner">
      <ul class="activity">
        <li class="icon icon1">碧桂园直营</li>
        <li class="icon icon2">业主优惠</li>
        <li class="icon icon3">原产地直供</li>
      </ul>         
    </div>
    <div class="orderNum">
      <p>订单号：{{data.orderNum}}</p>
      <p>支付金额：￥{{data.realPrice | twoDecimal}}</p>
    </div>
    <div class="payList">
      <div class="alipay" v-on:click="paymentType(0)">支付宝支付 <i :class="{'icon-check':payType == 0,'icon-checked':payType != 0}"></i></div>
      <div class="weChat" v-on:click="paymentType(1)">微信支付 <i :class="{'icon-check':payType == 1,'icon-checked':payType != 1}"></i></div>
    </div>
    <p class="button button-full-red correct mt1" v-on:click="confirm()" v-if="!h5Pay">确 定</p>
    <p class="button button-full-red correct mt1" v-if="h5Pay" v-on:click="h5PayFn">
    支 付</p>
    <div v-html="payForm"></div>
  </div>
</div>
</template>
<script>
import _ from 'lodash'
import store from '../../../store/index'
import md5 from 'md5'
export default{
  beforeRouteLeave (to, from, next) {
    console.log(to, from, next)
    if (to.name === 'affirmOrder') {
      if (this.test) {
        this.test = false
        this.$messageBox.confirm('确认返回?', '提示', {closeOnClickModal: false}).then(action => {
          if (action) {
            next()
            this.test = true
          }
        })
      }
    } else {
      next()
    }
  },
  store,
  data () {
    return {
      data: {
        realPrice: '',
        orderId: '',
        orderNum: ''
      },
      payType: 0,
      h5Pay: false,
      payForm: '',
      test: true
    }
  },
  activated () {
    var that = this
    that.data.realPrice = that.$route.params.realPrice
    that.data.orderId = that.$route.params.orderId
    that.data.orderNum = that.$route.params.orderNum
    if (that.$store.state.mutations.isApp === 3) that.h5Pay = true // h5支付
  },
  methods: {
    paymentType (type) { // 支付切换
      this.payType = type
    },
    h5PayFn: _.debounce(function () { // H5支付
      var that = this
      var params
      if (that.payType === 0) {
        params = {
          'orderId': that.data.orderId,
          'payType': 'H5'
        }
        that.$loading.open()
        that.$axios.post('/order/app/pay/ali', params).then((res) => {
          if (res) {
            that.$loading.close()
            that.payForm = res
            setTimeout(function () {
              document.forms[0].submit()
            }, 200)
          }
        })
      } else {
        params = {
          'orderId': that.data.orderId,
          'payType': 'H5'
        }
        that.$loading.open()
        that.$axios.post('/order/app/pay/wechat', params).then((res) => {
          if (res) {
            that.$loading.close()
            window.location.href = res.nwebUrl
          }
        })
      };
    }, 1000, {
      'leading': true,
      'trailing': false
    }),
    confirm: _.debounce(function () {
      var that = this
      var params = {
        'orderId': that.data.orderId,
        'payType': 'APP'
      }
      if (that.payType === 0) { // 支付宝支付
        that.$loading.open()
        that.$axios.post('/order/app/pay/ali', params).then((res) => {
          that.$loading.close()
          that.AliPay(res).then(function (success) {
            that.$router.push({path: '/payStatus/1/' + that.data.orderId + '/ali'})
          }, function () {
            that.$router.push({path: '/payStatus/2/' + that.data.orderId + '/ali'})
          })
        })
      } else { // 微信支付
        that.$axios.post('/order/app/pay/wechat', params).then((res) => {
          var timestamp = Math.round(new Date().getTime() / 1000)
          var signString = 'appid=wxbe3f5f81946d078b&noncestr=5K8264ILTKCH16CQ2502SI8ZNMTM67VS&package=Sign=WXPay&partnerid=1483539862&prepayid=' + res.prepayId + '&timestamp=' + timestamp
          var sign = signString + '&key=5yW8wE6d9M6lpqU8DksfHvvlwi2uO4Hj'
          sign = md5(sign).toUpperCase()
          var payInfo = {
            appid: 'wxbe3f5f81946d078b',
            noncestr: '5K8264ILTKCH16CQ2502SI8ZNMTM67VS', // nonce
            package: 'Sign=WXPay',
            partnerid: '1483539862', // merchant id
            prepayid: res.prepayId, // prepay id
            timestamp: timestamp, // timestamp
            sign: sign // signed string
          }
          that.WechatPay(payInfo).then(function (success) {
            that.$router.push({path: '/payStatus/1/' + that.data.orderId + '/wechat'})
          }, function () {
            that.$router.push({path: '/payStatus/2/' + that.data.orderId + '/wechat'})
          })
        })
      }
    }, 1000, {
      'leading': true,
      'trailing': false
    }),
    back () {
      this.showConfim('确认返回?')
    },
    showConfim (cont, title, index) {
      this.$messageBox.confirm(cont, title).then(function () {
        window.history.go(-1)
      }, function () {
      })
    }
  }
}
</script>
<style lang="less" scoped>
.activity{
  overflow: hidden;
  .icon{
    width: 33.33%;
    float: left;
    height: .95rem;
    line-height: .95rem;
    font-size: .24rem;
    color: #8a262a;
    padding-left: .8rem;
  }
  .icon2{
    padding-left: 1rem;
  }
}
.orderNum{
  line-height: .6rem;
  color: #333;
  padding:0 .28rem;
  p{
    font-size: .32rem;
  }
}
.payList{
  margin:.4rem 0;
  border-bottom: 1px solid #eee;
  .alipay,.weChat{
    height: 1.2rem;
    line-height: 1.2rem;
    padding:0 .28rem;
    padding-left: 1.5rem;
    border-top: 1px solid #eee;
    font-size: .32rem;
    i{
      width: 1rem;
      height: 1.2rem;
      float: right;
      font-size: .45rem;
    }
  }
}
.gray{
  color: #ddd;
}
.red{
  color: #89262a;
} 

</style>
