// import Vue from 'vue';

// // APP版本
// Vue.prototype.GetAppVersion = function(callback) {
//  if (!isApp) {
//    console.log('没有插件');
//    return;
//  };
//  cordova.getAppVersion.getVersionNumber().then(function(version){
//         callback(version);
//     });
// }

// // 应用内打开网址
// Vue.prototype.OpenUrl = function(openUrl) {
//  if (!isApp) {
//    console.log('没有插件');
//    return;
//  };
//  cordova.InAppBrowser.open(openUrl, '_system', 'location=yes');
// }

// // 网络状态
// Vue.prototype.Network = function(callback) {
//  if (!isApp) {
//    console.log('没有插件');
//    return;
//  };
//  var networkState = navigator.connection.type;
//     var states = {};
//     states[Connection.UNKNOWN]  = 'Unknown'; // 未知
//     states[Connection.ETHERNET] = 'Ethernet'; // 以太
//     states[Connection.WIFI]     = 'WiFi';
//     states[Connection.CELL_2G]  = '2G';
//     states[Connection.CELL_3G]  = '3G';
//     states[Connection.CELL_4G]  = '4G';
//     states[Connection.CELL]     = 'generic';
//     states[Connection.NONE]     = 'NoNetwork';
//     callback(states[networkState]);
// }

// // 剪切板
// Vue.prototype.Clipboard = function(clipUrl,successCallback,errorCallback) {
//  if (!isApp) {
//    console.log('没有插件');
//    return;
//  };
//  cordova.plugins.clipboard.copy(clipUrl,function(){
//    successCallback();
//  },function(error){
//    errorCallback(error);
//  });
// }

// // 少量信息提示
// Vue.prototype.Xtoast = function(message) {
//  if (!isApp) {
//    console.log('没有插件');
//    return;
//  };
//  var options = {
//    message: message,
//      duration: "short", // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
//      position: "center", // top center bottom
//      addPixelsY: -40  // added a negative value to move it up a bit (default 0)
//  };
//  window.plugins.toast.showWithOptions(options);
// }

// 插件调用demo:

// 少量信息提示
// this.Xtoast('我是测试信息~~~');

// 剪切板
// this.Clipboard('www.baidu.com',function(){
//  alert('复制链接成功');
// },function(error){
//  console.log(error);
// });

// 获取APP版本
// that.GetAppVersion(function(appVersionInfo){
//  console.log(appVersionInfo);
// });

// 应用内打开
// this.OpenUrl("http://wpa.qq.com/msgrd?v=3&uin=2214879182&site=qq&menu=yes");

// 网络状态
// that.Network(function(networkState){
//  console.log(networkState);
// })
