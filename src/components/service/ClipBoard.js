import Vue from 'vue'
import { Toast } from 'mint-ui'
import store from '../../store/index.js'
Vue.prototype.ClipBoard = window.$ClipBoard = function (text) {
  return new Promise((resolve, reject) => {
    if (store.state.mutations.isApp === 3) {
      Toast({message: '此版本暂不支持商品分享,请下载客户端', duration: 800})
    } else {
      cordova.plugins.clipboard.copy(text, function () {
        // Toast({message: '复制成功', duration: 1000})
        resolve()
      }, function () {
        // Toast({message: '复制失败', duration: 1000})
        reject()
      })
    }
  })
}
