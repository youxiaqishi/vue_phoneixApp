import Vue from 'vue'
import { Toast } from 'mint-ui'
import store from '../../store/index.js'
Vue.prototype.Camera = function (i) {
  return new Promise((resolve, reject) => {
    if (store.state.mutations.isApp === 0) {
      // 浏览器
      Toast({message: '没有插件', duration: 800})
      return false
    } else if (store.state.mutations.isApp === 1) {
      // APP
      var type = i
      i === 1 ? type = Camera.PictureSourceType.PHOTOLIBRARY : type = Camera.PictureSourceType.CAMERA
      var options = {
        quality: 100,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: type,
        allowEdit: false,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 1024,
        targetHeight: 1024,
        // CameraPopoverOptions
        popoverOptions: new CameraPopoverOptions(300, 300, 100, 100, Camera.PopoverArrowDirection.ARROW_ANY),
        saveToPhotoAlbum: false,
        correctOrientation: true
      }
      navigator.camera.getPicture(function (imageData) {
        resolve(imageData)
      }, function (error) {
        reject(error)
      }, options)
    } else if (store.state.mutations.isApp === 2) {
      // 微信 使用微信相机API
    } else if (store.state.mutations.isApp === 3) {
      // 内嵌 使用凤凰会API
    }
  })
}
// APP调用 返回base64编码
// that.Camera().then(function (imageData) {
// console.log(imageData)
// },function(err){
//  console.log(err)
// })
