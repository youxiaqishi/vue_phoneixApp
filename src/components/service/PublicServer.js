import Vue from 'vue'

// 获取localstorage存储信息
Vue.prototype.getLocalstorage = window.$getLocalstorage = function (key) {
  var userCmsData = window.localStorage.getItem(key)
  userCmsData = JSON.parse(userCmsData)
  return userCmsData
}
