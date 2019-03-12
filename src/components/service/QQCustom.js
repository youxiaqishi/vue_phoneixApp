import Vue from 'vue'
import { Toast } from 'mint-ui'
import store from '../../store/index.js'
Vue.prototype.QQCustom = function (QQNum) {
  return new Promise((resolve, reject) => {
    if (store.state.mutations.isApp === 0) {
      // 浏览器
      Toast({message: '没有插件', duration: 800})
      return false
    } else if (store.state.mutations.isApp === 1 || store.state.mutations.isApp === 3) {
      // APP
      window.location.href = 'mqq://im/chat?chat_type=wpa&uin=' + QQNum + '&version=1&src_type=web'
      resolve()
    } else if (store.state.mutations.isApp === 2) {
      // 微信
    }
    // else if (store.state.mutations.isApp == 3) {
    //  // 内嵌
    // }
  })
}
// APP调用 打开QQ聊天
// that.QQCustom(QQNum).then(function () {
// console.log(打开了QQ聊天)
// },function(err){
//  console.log(err)
// })
