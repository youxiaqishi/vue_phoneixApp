import Vue from 'vue'
Vue.prototype.DeviceInfo = window.$DeviceInfo = function () {
  return new Promise((resolve, reject) => {
    // 浏览器
    var deviceInfo = window.localStorage.getItem('equipmentId')
    if (deviceInfo) {
      resolve({
        uuid: deviceInfo
      })
    } else {
      var equipmentId = new Date().getTime()
      window.localStorage.setItem('equipmentId', JSON.stringify(equipmentId))
      resolve({
        uuid: equipmentId
      })
    }
  })
}
