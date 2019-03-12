<template>
<div class="page loginPage">
  <m-header>
    <span slot="left"></span>
    <span slot="title">修改密码</span>
  </m-header>
  <div class="page-content">
    <form>
      <div class="list-ios">
        <div class="list-item">
          <span class="textName">当前账号</span>
          <span class="item-note">{{userInfo.phone}}</span>
        </div>
        <div class="list-item">
          <span class="textName">当前密码</span>
          <span class="item-note">
            <input type="password" placeholder="请输入当前密码" v-model="password">
          </span>
        </div>
        <div class="list-item">
          <span class="textName">新密码</span>
          <span class="item-note">
            <input type="password" placeholder="请输入新密码" v-model="newPassword">
          </span>
        </div>
      </div>  
      <p class="error" v-if="errorCont">{{errorCont}}</p> 
    </form>
    <p class="button button-full-red" v-click-one="{click:submitBtn}">提交</p> 
  </div>
</div>
</template>
<script>
import _ from 'lodash'
export default{
  data () {
    return {
      password: '',
      newPassword: '',
      userInfo: {},
      errorCont: ''
    }
  },
  activated () {
    var that = this
    if (window.localStorage.getItem('userInfo')) {
      that.userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
    }
  },
  updated () {
  },
  mounted () {
  },
  destroyed () {
  },
  methods: {
    submitBtn: _.debounce(function () {
      var self = this
      if (self.password === '') {
        // self.errorCont = '请输入当前密码!'
        self.$toast({message: '请输入当前密码!', duration: 800})
        return false
      }
      if (self.newPassword === '') {
        // self.errorCont = '请输入新密码!'
        self.$toast({message: '请输入新密码!', duration: 800})
        return false
      }
      self.errorCont = ''
      if (self.newPassword.length < 6) {
        setTimeout(function () {
          self.$toast({message: '密码长度至少6位', duration: 800})
        }, 600)
        return
      }
      if (self.newPassword.length > 18) {
        setTimeout(function () {
          self.$toast({message: '密码长度最高18位', duration: 800})
        }, 600)
        return
      }
      self.DeviceInfo().then(function (deviceInfo) {
        var params = {
          'equipmentId': deviceInfo.uuid,
          'userPassword': self.newPassword,
          'originalPassword': self.password
        }
        self.$axios.post('/AppUser/EditPassword', params).then((res) => {
          var equimentId = self.getLocalstorage('equipmentId')
          // self.$toast({message: '密码修改成功，即将重新登录', duration: 1000})
          // setTimeout(function () {
          self.$axios.get('/AppUser/PullOut/' + equimentId).then((res) => {
            window.localStorage.removeItem('Token')
            window.localStorage.removeItem('userInfo')
            // self.$router.push('/login')
            // 直接登录
            self.DeviceInfo().then(function (deviceInfo) { // 获取设备信息
              var sessionParams = {
                'equipmentId': deviceInfo.uuid,
                'ip': '127.0.0.1'
              }
              self.$axios.post('/AppUser/CreateSession', sessionParams).then((res) => {
                var loginParams = {
                  'userName': self.userInfo.phone,
                  'userPassword': self.newPassword,
                  'sessionToken': res,
                  'equipmentId': deviceInfo.uuid,
                  'appVisitorId': self.getLocalstorage('visitorId')
                }
                self.$axios.post('/AppUser/UserLogin', loginParams).then((res) => {   // 登录
                  window.localStorage.setItem('Token', JSON.stringify(res))
                  self.$axios.get('/AppUser/GetById').then((res) => { // 获取用户信息
                    window.localStorage.setItem('userInfo', JSON.stringify(res))
                    var shopParams = {
                      'shopId': self.getLocalstorage('shopId'),
                      'accessToken': JSON.parse(window.localStorage.getItem('Token')).accessToken
                    }
                    self.$axios.post('/app/userauth/addshopid', shopParams).then((res) => { // 存储店铺
                      window.eventBus.$emit('jpushAlias') // 极光打别名
                      if (self.getLocalstorage('shopData').admin === 'yes') {
                        self.$router.push({path: '/home/index/shopTemplate/default'})
                      } else {
                        self.$router.push({path: '/home/index/shopTemplate/general'})
                      }
                    })
                  })
                })
              })
            })
          })
          // }, 1500)
        })
      })
    }, 500, {
      'leading': true,
      'trailing': false
    })
  }
}
</script>
<style lang="less" scoped>
@import "../../../../static/css/mine.less";
</style>