import Vue from 'vue'
import { Toast } from 'mint-ui'
import store from '../../store/index.js'
Vue.prototype.AliPay = function (payInfo) {
  return new Promise((resolve, reject) => {
    if (store.state.mutations.isApp === 0) {
      // 浏览器
      Toast({message: '没有插件', duration: 800})
      return false
    } else if (store.state.mutations.isApp === 1) {
      // APP
      cordova.plugins.alipay.payment(payInfo, function success (success) {
        resolve(success)
      }, function error (error) {
        reject(error)
      })
    } else if (store.state.mutations.isApp === 2) {
      // 微信 只有微信支付
    } else if (store.state.mutations.isApp === 3) {
      // 内嵌 走H5支付
    }
  })
}
// APP调用 支付宝支付
// that.AliPay(payInfo).then(function (success) {
// console.log(success)
// },function(err){
//  console.log(err)
// })
