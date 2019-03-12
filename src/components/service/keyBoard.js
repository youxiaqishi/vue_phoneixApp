import Vue from 'vue'
// import { Toast } from 'mint-ui'
import store from '../../store/index.js'
Vue.prototype.KeyBoard = function (isScroll) {
  return new Promise((resolve, reject) => {
    if (store.state.mutations.isApp === 1 && window.device && window.device.platform === 'iOS') {
      window.cordova.plugins.Keyboard.disableScroll(isScroll)
    }
  })
}
