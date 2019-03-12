import Vue from 'vue'
// import { Toast } from 'mint-ui'
import store from '../../store/index.js'
Vue.prototype.Network = window.$Network = function () {
  return new Promise((resolve, reject) => {
    if (store.state.mutations.isApp === 1 && navigator.connection.type) {
      // Toast({message: '没有插件', duration: 800})
      var networkState = ''
      networkState = navigator.connection.type
      var states = {}
      states[Connection.UNKNOWN] = 'Unknown connection'
      states[Connection.ETHERNET] = 'Ethernet connection'
      states[Connection.WIFI] = 'WiFi connection'
      states[Connection.CELL_2G] = 'Cell 2G connection'
      states[Connection.CELL_3G] = 'Cell 3G connection'
      states[Connection.CELL_4G] = 'Cell 4G connection'
      states[Connection.CELL] = 'Cell generic connection'
      states[Connection.NONE] = 'No network connection'
      resolve(states[networkState])
    }
  })
}
