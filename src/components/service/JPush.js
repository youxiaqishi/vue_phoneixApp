import Vue from 'vue'
import { Toast } from 'mint-ui'
import store from '../../store/index.js'
Vue.prototype.JPushInit = window.$JPushInit = function () {
  return new Promise((resolve, reject) => {
    if (store.state.mutations.isApp === 0) {
      // 浏览器
      Toast({message: '没有插件', duration: 800})
      return false
    } else if (store.state.mutations.isApp === 1 && window.JPush) {
      // APP
      window.JPush.init()
      if (window.device.platform === 'iOS') {
        window.JPush.setApplicationIconBadgeNumber(0)
        window.JPush.setBadge(0)
        window.JPush.resetBadge()
      } else if (window.device.platform === 'Android') {
      }
      resolve()
    } else if (store.state.mutations.isApp === 2) {
      // 微信
    } else if (store.state.mutations.isApp === 3) {
      // 内嵌
    }
  })
}

// APP调用 初始化极光
// that.JPushInit().then(function () {
// console.log('极光初始化')
// },function(err){
// console.log(err)
// })
// 点击推送消息监听
// document.addEventListener("jpush.openNotification", function (event) {
//     var content = window.plugins.jPushPlugin.receiveMessage
//     console.log("点击了推送消息")
//     if (device.platform == "Android") {
//         // if(content.extras.stType == '1'){
//         // }
//     } else{
//         window.plugins.jPushPlugin.setApplicationIconBadgeNumber(0)
//         // if (event.stType == '1') {
//         // }
//     }
// }, false)
Vue.prototype.SetTagWithAlias = function () {
  return new Promise((resolve, reject) => {
    if (store.state.mutations.isApp === 0) {
      // 浏览器
      Toast({message: '没有插件', duration: 800})
      return false
    } else if (store.state.mutations.isApp === 1) {
      // APP
      window.plugins.jPushPlugin.getRegistrationID(function (registrationID) {
        var alias = '1'
        var tags = ['admin', 'village1', 'level1', 'shop1']
          // 给到接口
        window.plugins.jPushPlugin.setTagsWithAlias(tags, alias, function () {
          resolve(registrationID)
        }, function (error) {
          reject(error)
        })
      })
    } else if (store.state.mutations.isApp === 2) {
      // 微信
    } else if (store.state.mutations.isApp === 3) {
      // 内嵌
    }
  })
}
// APP调用 打别名标签 // 使用用户id推送
// that.SetTagWithAlias().then(function (registrationID) {
// console.log('打别名标签成功'+registrationID)
// },function(err){
// console.log(err)
// })
