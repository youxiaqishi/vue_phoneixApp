import Vue from 'vue'
import App from './App'
import axios from 'axios'
import store from './store/'
import router from './router'
import rem from './config/rem.js'
import vueCordova from 'vue-cordova'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import Mplugs from './components/plugs/components.js'
import { Toast, MessageBox, CellSwipe, Lazyload, Popup, Picker, Actionsheet, Indicator } from 'mint-ui'
import 'mint-ui/lib/style.css'
import './components/service/JPush.js' // 极光推送
import './components/service/KeyBoard.js' // 键盘处理
import './components/service/ClipBoard.js' // 剪切板
import './components/service/Network.js' // 网络状态
import './components/service/DeviceInfo.js' // 设备信息
import './components/service/PublicServer.js' // 公共组件导出
import './components/service/Camera.js' // 相机
import './components/service/ImagePicker.js' // 相册
import './components/service/GetCurrentPosition.js' // 位置信息
import './components/service/AliPay.js' // 支付宝支付
import './components/service/WechatPay.js' // 微信支付
import './components/service/Share.js' // 集成分享
import './components/service/QQCustom.js' // QQ客服
import './components/service/ActionSheet.js' // 底部弹出
import _ from 'lodash'
// import fastClick from 'fastclick'
import VueScroller from 'vue-scroller'
import scrollKeeper from './maxrocky/scrollKeeper'
import betterScroll from './maxrocky/betterScroll'
import routeTranslate from './maxrocky/routeTranslate'
import CacheNavigation from './maxrocky/cacheNavigation'
import swiperScroller from './maxrocky/swiperScroller'
Vue.component(Popup.name, Popup)
Vue.component(Picker.name, Picker)
Vue.component(CellSwipe.name, CellSwipe)
Vue.component(Actionsheet.name, Actionsheet)
Vue.use(_)
Vue.use(Lazyload)
Vue.use(vueCordova)
Vue.use(VueScroller)
Vue.use(scrollKeeper)
Vue.use(betterScroll)
Vue.use(VueAwesomeSwiper)
Vue.use(swiperScroller)
Vue.use(CacheNavigation, {router})
Vue.use(routeTranslate, {router, store})

window.eventBus = new Vue()
// fastClick.attach(document.body)
require('swiper/dist/css/swiper.css')

axios.defaults.timeout = 40000
Vue.config.productionTip = false
axios.defaults.withCredentials = true
// axios.defaults.baseURL = 'http://125.94.45.180:9009'// 测试
axios.defaults.baseURL = 'http://h5.fenghuangyouxuan.com/service'// 生产

axios.interceptors.request.use(config => { // 请求拦截
  setTimeout(function () {
    Indicator.close()
    window.$Network().then(function (network) { // 网络监测
      if (network === 'No network connection') router.push({ path: '/noWifi' })
    })
  }, 5000) // loading超过5S关闭
  return getToken().then(function (res) { // 保证请求Token
    if (config.url.indexOf('/AppVisitorRest/CreateVisitor/') < 0) {
      if (res.accessToken) config.headers['ACCESS_TOKEN'] = res.accessToken
      return config
    }
  }, function (err) { console.log(err) })
}, err => {
  return Promise.reject(err)
})

var CreateResponsing = false
axios.interceptors.response.use(function (response) { // 响应拦截
  if (response.data.code === '0') {
    return response.data.data
  } else if (response.data.code === 'APPAOP_10006') {
    console.log('accessToken过期了')
    if (!CreateResponsing) { // 续期
      CreateResponsing = true
      axios.get('/app/userauth/update/accessToken/' + window.$getLocalstorage('Token').refreshToken).then(function (res) {
        if (res) window.localStorage.setItem('Token', JSON.stringify(res))
        CreateResponsing = false
        var event = new window.Event('CreateResponseOver')
        document.body.dispatchEvent(event)
      })
    } else {
      document.body.addEventListener('CreateResponseOver', function () {})
    }
  } else if (response.data.code === 'APPAOP_10003' || response.data.code === 'APPAOP_10004' || response.data.code === 'APPAOP_10005' || response.data.code === 'APPAOP_10007' || response.data.code === 'APPAOP_10008' || response.data.code === 'APPAOP_10009') {
    console.log('Token失效了')
    if (!CreateResponsing) { // 清除缓存
      CreateResponsing = true
      window.localStorage.clear()
      Toast({message: '登录信息已失效', duration: 800})
      CreateResponsing = false
      var event = new window.Event('CreateResponseOver')
      document.body.dispatchEvent(event)
    } else {
      document.body.addEventListener('CreateResponseOver', function () {})
    }
  } else if (response.data.code === 'COMM_0005' || response.data.code === 'SYS_EXCEPTION') {
    // 需要页面单独处理报错
    return Promise.reject(response.data.msg)
  } else { // 报错提示
    Indicator.close()
    Toast({message: response.data.msg, duration: 800})
    return Promise.reject(response.data.msg)
  }
})

if (window.localStorage.getItem('OldToken') && window.localStorage.getItem('Token') && JSON.parse(window.localStorage.getItem('OldToken')).accessToken !== JSON.parse(window.localStorage.getItem('Token')).accessToken) {
  let params = {
    'shopId': window.$getLocalstorage('shopId'),
    'accessToken': window.$getLocalstorage('Token').accessToken
  }
  axios.post('/app/userauth/addshopid', params).then(function () {})
}

let instance = axios.create()
let CreateVisitoring = false
function getToken () { // 保证请求头的Token
  if (window.localStorage.getItem('Token')) {
    return Promise.resolve(window.$getLocalstorage('Token'))
  } else if (!CreateVisitoring) {
    return new Promise((resolve, reject) => {
      CreateVisitoring = true
      window.$DeviceInfo().then(function (equipmentInfo) {
        let platform = ''
        store.state.mutations.isApp === 3 ? platform = 'FHX' : platform = 'APP'
        instance({url: '/AppVisitorRest/CreateVisitor/' + equipmentInfo.uuid + '/' + platform, type: 'get'}).then(function (createRes) {
          if (createRes.data.code === '0') {
            if (createRes.data.data.accessToken) window.localStorage.setItem('Token', JSON.stringify(createRes.data.data))
            if (createRes.data.data.visitorId) window.localStorage.setItem('visitorId', JSON.stringify(createRes.data.data.visitorId))
            CreateVisitoring = false
            var event = new window.Event('CreateVisitorOver')
            document.body.dispatchEvent(event)
            resolve(createRes.data.data)
          }
        }, function () { window.localStorage.clear() })
      })
    })
  } else {
    return new Promise((resolve, reject) => {
      document.body.addEventListener('CreateVisitorOver', function () {
        getToken().then(function (tokenInfo) {
          resolve(tokenInfo)
        }, function (err) { reject(err) })
      })
    })
  }
}

Vue.directive('clickOne', {
  bind: function (el, binding, vnode) {
    var fn = _.debounce(function () { binding.value.click() }, 500, true)
    el.addEventListener('click', function () {
      fn()
    })
  }
})

window.ClipGo = _.debounce(function (text) { // 剪切板监听
  if (!text || text.indexOf('FHYX') < 0) return
  let logo = 'FHYX' + text.split('FHYX')[1]
  logo = logo.split('复制这条信息')[0]
  if (!window.$getLocalstorage('ClipLogo') || logo !== window.$getLocalstorage('ClipLogo')) {
    window.localStorage.setItem('ClipLogo', JSON.stringify(logo))
  } else { return }
  axios.get('/commodity/share/info/' + logo).then(function (res) {
    if (res) {
      MessageBox.confirm(text.split('】')[0].split('【')[1], '凤凰优选', {
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonText: '取消',
        confirmButtonText: '去看看'
      }).then(function () {
        window.$ClipBoard(' ').then(function () { // 清除剪切板信息
          window.localStorage.removeItem('ClipLogo')// 清空标识可重新复制
          router.push({path: '/goodsDetail/' + res.skuId})
        })
      }, function () {
        window.$ClipBoard(' ').then(function () {
          window.localStorage.removeItem('ClipLogo')// 清空标识可重新复制
        }) // 只清除剪切板信息
      })
    }
  })
}, 1300)

window.document.addEventListener('deviceready', function () {
  window.document.addEventListener('backbutton', function () { // 物理返回键
    if (window.localStorage.getItem('thisIsIndex')) {
      window.eventBus.$emit('thisIsIndex')
    } else if (window.localStorage.getItem('orderGotoHome')) {
      window.localStorage.removeItem('orderGotoHome')
      window.eventBus.$emit('updateClick')
    } else {
      router.go(-1)
    }
  })
  document.addEventListener('jpush.openNotification', function (event) { // 点击推送
    // window.alert(event.activityType)
  })
  if (window.device && window.device.model === 'iPhone10,3') {
    window.eventBus.$emit('iPhoneXClass') // 更新样式
  }
  window.$JPushInit().then(function () { // 极光
    window.eventBus.$on('jpushAlias', () => { // 打别名
      if (window.$getLocalstorage('userInfo') && window.JPush) {
        window.plugins.jPushPlugin.setAlias({'alias': window.$getLocalstorage('userInfo').id.toString(), 'sequence': 1}, function () {
          // window.alert('打别名成功')
        })
      }
    })
  })
  window.chcp.fetchUpdate(function (error, data) {
    if (!error) {
      Indicator.open('应用更新中')
    }
  })
  // 下载完成等待安装
  window.document.addEventListener('chcp_updateIsReadyToInstall', function () {
    Indicator.close()
  }, false)
    // 下载失败
  window.document.addEventListener('chcp_updateLoadFailed', function (eventData) {
    Indicator.close()
    nativeUpdate(eventData)
  }, false)
  // 无可用更新
  window.document.addEventListener('chcp_nothingToUpdate', function (eventData) {
    Indicator.close()
  })
  // 安装前
  window.document.addEventListener('chcp_beforeInstall', function () {
    console.log('chcp_beforeInstall')
  })
  // 安装完成
  window.document.addEventListener('chcp_updateInstalled', function () {
    console.log('chcp_updateInstalled')
  })
  // 安装失败
  window.document.addEventListener('chcp_updateInstallFailed', function () {
    console.log('chcp_updateInstallFailed')
  })
  // 无可用安装
  window.document.addEventListener('chcp_nothingToInstall', function () {
    console.log('chcp_nothingToInstall"')
  })
  // 资源复制前
  window.document.addEventListener('chcp_beforeAssetsInstalledOnExternalStorage', function (eventData) {
  })
  // 资源复制完成
  window.document.addEventListener('chcp_assetsInstalledOnExternalStorage', function (eventData) {
  })
  // 资源复制出错
  window.document.addEventListener('chcp_assetsInstallationError', function (eventData) {
  })
})

var nativeUpdate = function (eventData) {
  var error = eventData.detail.error
  if (error && error.code === window.chcp.error.APPLICATION_BUILD_VERSION_TOO_LOW) {
    var dialogMessage = '有新的版本需要更新！'
    let device = window.device.platform
    if (device === 'iOS') {
      window.chcp.requestApplicationUpdate(dialogMessage, function () {
        // window.alert('userWentToStoreCallback')
      }, function () {
        // window.alert('userWentToStoreCallback')
      })
    } else {
      // 外壳更新 alert
      Vue.prototype.$messageBox.confirm(dialogMessage).then(action => {
        window.resolveLocalFileSystemURL(window.cordova.file.externalRootDirectory, function (fileEntry) {
          fileEntry.getDirectory('MicroMedia', { create: true, exclusive: false }, function (fileEntry) {
            // 下载代码
            var fileTransfer = new window.FileTransfer()
            fileTransfer.download('http://h5-statis.fenghuangyouxuan.com/pack/proApk/fhyx.apk', fileEntry.toInternalURL() + 'MicroMedia.apk', function (entry) {
              // 打开下载下来的APP
              window.cordova.plugins.fileOpener2.open(
              entry.toInternalURL(), // 下载文件保存地址
              'application/vnd.android.package-archive', {// 以APK文件方式打开
                error: function () {
                  window.alert('文件打开失败！')
                },
                success: function () {
                  navigator.app.exitApp()
                }
              })
            }, function () {
            }, true)
              // 超时处理
          }, function () {
            window.alert('文件创建失败')
          })
        })
      })
    }
  }
}

// const history = window.sessionStorage
// let historyCount = history.getItem('count') * 1
// router.beforeEach(function (to, from, next) {
//   const toIndex = history.getItem(to.path)
//   const fromIndex = history.getItem(from.path)
//   if (toIndex) {
//     if (!fromIndex || parseInt(toIndex, 10) > parseInt(fromIndex, 10) || (toIndex === '0' && fromIndex === '0')) {
//       store.commit('UPDATE_DIRECTION', {direction: 'forward'})
//     } else {
//       store.commit('UPDATE_DIRECTION', {direction: 'reverse'})
//     }
//   } else {
//     ++historyCount
//     history.setItem('count', historyCount)
//     to.path !== '/' && history.setItem(to.path, historyCount)
//     store.commit('UPDATE_DIRECTION', {direction: 'forward'})
//   }
//   if (/\/http/.test(to.path)) {
//     let url = to.path.split('http')[1]
//     window.location.href = `http${url}`
//   } else {
//     next()
//   }
// })

Vue.prototype.$axios = axios
Vue.prototype.$toast = Toast
Vue.prototype.$loading = Indicator
Vue.prototype.$messageBox = MessageBox
/* eslint-disable no-new */
Vue.filter('twoDecimal', function (value) {
  if (!value) return '0.00'
  return parseFloat(value).toFixed(2)
})
Vue.filter('maxLength', function (value, length) {
  if (!value) return ''
  value = value.toString()
  if (value.length > length) {
    value = value.slice(0, length) + '...'
  }
  return value
})

new Vue({
  el: '#app',
  router,
  rem,
  _,
  Mplugs,
  store,
  template: '<App/>',
  components: { App }
})
