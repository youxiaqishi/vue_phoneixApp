import Vue from 'vue'
import { Toast } from 'mint-ui'
import store from '../../store/index.js'
Vue.prototype.ImagePicker = function (imageCount) {
  return new Promise((resolve, reject) => {
    if (store.state.mutations.isApp === 0) {
      // 浏览器
      Toast({message: '没有插件', duration: 800})
      return false
    } else if (store.state.mutations.isApp === 1) {
      // APP
      var options = {
        maximumImagesCount: imageCount,
        width: 1024,
        height: 1024,
        quality: 100
      }
      window.imagePicker.getPictures(function (results) {
        resolve(results)
      }, function (error) {
        reject(error)
      }, options)
    } else if (store.state.mutations.isApp === 2) {
      // 微信
    } else if (store.state.mutations.isApp === 3) {
      // 内嵌
    }
  })
}
// APP调用 返回文件路径->转换base64
// that.ImagePicker(3).then(function (imageUrlArray) {
// console.log(imageUrlArray)
// // var canvas = document.createElement('CANVAS')
// //          var ctx = canvas.getContext('2d')
// //          var img = new Image
// //          img.crossOrigin = 'Anonymous'
// //          img.onload = function () {
// //           canvas.height = img.height
// //           canvas.width = img.width
// //           img.src = imageUrlArray[0]
// //           ctx.drawImage(img,0,0)
// //           var dataURL = canvas.toDataURL('image/png')
// //           var baseVal = dataURL.replace('data:image/pngbase64,', '')
// //   console.log(baseVal)
// // }
// // for (var i = 0 i < imageUrlArray.length i++) {
// //   // console.log(BASE64.encoder(imageUrlArray[i]))
// // }
// },function(err){
// console.log(err)
// })
