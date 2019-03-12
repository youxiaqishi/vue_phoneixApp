import Vue from 'vue'
import { Toast } from 'mint-ui'
import store from '../../store/index.js'
Vue.prototype.WechatPay = function (payInfo) {
  return new Promise((resolve, reject) => {
    if (store.state.mutations.isApp === 0) {
      // 浏览器
      Toast({message: '没有插件', duration: 800})
      return false
    } else if (store.state.mutations.isApp === 1) {
      // APP
      Wechat.sendPaymentRequest(payInfo, function (success) {
        resolve(success)
      }, function (error) {
        reject(error)
      })
    } else if (store.state.mutations.isApp === 2) {
      // 微信
    } else if (store.state.mutations.isApp === 3) {
      // 内嵌
    }
  })
}
// APP调用 微信支付
// that.WechatPay(payInfo).then(function (success) {
// console.log(success)
// },function(err){
//  console.log(err)
// })
