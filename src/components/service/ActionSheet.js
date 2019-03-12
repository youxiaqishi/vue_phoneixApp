import Vue from 'vue'
import { Toast } from 'mint-ui'
import store from '../../store/index.js'
Vue.prototype.ActionSheet = function () {
  return new Promise((resolve, reject) => {
    if (store.state.mutations.isApp === 0) {
      // 浏览器
      Toast({message: '没有插件', duration: 800})
      return false
    } else if (store.state.mutations.isApp === 1) {
      // APP
      var options = {
        androidTheme: window.plugins.actionsheet.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT, // default is THEME_TRADITIONAL
        // title: 'What do you want with this image?',
        // subtitle: 'Choose wisely, my friend', // supported on iOS only
        buttonLabels: ['相册', '相机'],
        androidEnableCancelButton: true, // default false
        winphoneEnableCancelButton: true, // default false
        addCancelButtonWithLabel: '取消',
        // addDestructiveButtonWithLabel : 'Delete it',
        position: [20, 40], // for iPad pass in the [x, y] position of the popover
        destructiveButtonLast: true // you can choose where the destructive button is shown
      }
      window.plugins.actionsheet.show(options, function (buttonIndex) {
        resolve(buttonIndex)
      })
    } else if (store.state.mutations.isApp === 2) {
      // 微信
    } else if (store.state.mutations.isApp === 3) {
      // 内嵌
    }
  })
}
// APP调用 底部弹出框
// that.ActionSheet().then(function (buttonIndex) {
// console.log(buttonIndex)
// },function(err){
//  console.log(err)
// })
