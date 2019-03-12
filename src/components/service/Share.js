import Vue from 'vue'
import { Toast } from 'mint-ui'
import store from '../../store/index.js'
Vue.prototype.Share = function (index, title, description, imgUrl, pageUrl) {
  return new Promise((resolve, reject) => {
    if (store.state.mutations.isApp === 0) {
      // 浏览器
      Toast({message: '没有插件', duration: 800})
      return false
    } else if (store.state.mutations.isApp === 1 || store.state.mutations.isApp === 3) {
      // APP
      if (index === 1 || index === 2) {
        Wechat.isInstalled(function (installed) {
          // true false
          console.log('Wechat installed: ' + (installed ? 'Yes' : 'No'))
          var sc
          if (index === 1) {
            sc = Wechat.Scene.SESSION // 好友
          } else {
            sc = Wechat.Scene.TIMELINE // 朋友圈
          }
          Wechat.share({
            message: {
              title: title, // 标题
              description: description, // 内容
              thumb: imgUrl, // 图片地址
              media: {
                type: Wechat.Type.LINK, // 分享连接
                webpageUrl: pageUrl // 连接地址
              }
            },
            scene: sc
          }, function (success) {
            resolve(success)
          }, function (error) {
            reject(error)
          })
        }, function (error) {
          reject(error)
        })
      } else if (index === 3 || index === 4) {
        var args = {}
        args.client = QQSDK.ClientType.QQ // QQSDK.ClientType.QQ,QQSDK.ClientType.TIM
        QQSDK.checkClientInstalled(function () {
          var args = {}
          if (index === 3) {
            args.scene = QQSDK.Scene.QQ // QQSDK.Scene.QQZone,QQSDK.Scene.Favorite
          } else {
            args.scene = QQSDK.Scene.QQZone // QQSDK.Scene.QQZone,QQSDK.Scene.Favorite
          }
          args.client = QQSDK.ClientType.QQ // QQSDK.ClientType.QQ,QQSDK.ClientType.TIM
          args.url = pageUrl
          args.title = title
          args.description = description
          args.image = imgUrl
          QQSDK.shareNews(function () {
            resolve()
          }, function (error) {
            reject(error)
          }, args)
        }, function () {
          // if installed QQ Client version is not supported sso,also will get this error
          reject('未安装QQ客户端或不支持此客户端')
        }, args)
      } else if (index === 5) {
        WeiboSDK.checkClientInstalled(function () {
          var args = {}
          args.url = pageUrl
          args.title = title
          args.description = description
          args.image = imgUrl
          WeiboSDK.shareToWeibo(function () {
            successCallback()
          }, function (error) {
            errorCallback(error)
          }, args)
        }, function () {
          errorCallback('未安装微博客户端')
        })
      }
    } else if (store.state.mutations.isApp === 2) {
      // 微信
    }
    // else if (store.state.mutations.isApp == 3) {
    //  // 内嵌
    // }
  })
}
// APP调用 集成分享 index: 1 微信好友 2 微信朋友圈 3 QQ好友 4 QQ空间 5 微博
// that.Share(index,title,description,imgUrl,pageUrl).then(function (success) {
// console.log(success)
// },function(err){
//  console.log(err)
// })
