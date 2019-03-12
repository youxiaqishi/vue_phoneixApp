import Vue from 'vue'
import { Toast } from 'mint-ui'
import store from '../../store/index.js'
Vue.prototype.GerCurrentPosition = function () {
  return new Promise((resolve, reject) => {
    if (store.state.mutations.isApp === 0) {
      // 浏览器
      Toast({message: '没有插件', duration: 800})
      return false
    } else if (store.state.mutations.isApp === 1 && navigator.geolocation) {
      // APP
      var options = {
        enableHighAccuracy: true,  // 是否使用 GPS
        maximumAge: 30000,         // 缓存时间
        timeout: 27000,            // 超时时间
        coorType: 'bd09ll'         // 默认是 gcj02，可填 bd09ll 以获取百度经纬度用于访问百度 API
      }
      navigator.geolocation.getCurrentPosition(function (position, extra) {
        // 经度: position.coords.longitude 纬度: position.coords.latitude
        resolve(position)
      }, function (error) {
        reject(error)
      }, options)
    } else if (store.state.mutations.isApp === 2) {
      // 微信
    } else if (store.state.mutations.isApp === 3) {
      // 内嵌
      if (window.app) {
        window.getLocationInfoCallback = function (locationInfo) {
          // locationInfo为获取的地理位置json字符串 longitude latitude
          var position = {
            coords: {
              'longitude': locationInfo.longitude,
              'latitude': locationInfo.latitude
            }
          }
          resolve(position)
        }
        window.app.getLocationInfoWithCallBack(window.getLocationInfoCallback, 'getLocationInfoCallback')
      } else {
        reject()
      }
    }
  })
}
// APP调用 返回经纬度
// that.GerCurrentPosition().then(function (currentPosition) {
// console.log(currentPosition)
// },function(err){
//  console.log(err)
// })
