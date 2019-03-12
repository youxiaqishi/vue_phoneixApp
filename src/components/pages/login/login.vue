<template>
  <div class="page loginPage">
    <m-header>
      <span slot="left"></span>
      <span slot="title">登录</span>
      <span v-on:click="register()" slot="right">注册</span>
    </m-header>
    <div class="page-content  padding-top">
      <div class="logo"></div>
      <form>
        <div class="loginDiv">
          <input 
            class="inputStyle"
            type="tel" 
            v-model="username" 
            maxLength="11"
            placeholder="请输入手机号">
          </input> 
          <input 
            v-if="!canSee"
            class="inputStyle"
            type='password' 
            v-model="password" 
            maxLength="20"
            placeholder="请输入密码">
          </input>
          <input 
            v-if="canSee"
            class="inputStyle"
            type='text' 
            maxLength="20"
            v-model="password" 
            placeholder="请输入密码">
          </input>
          <span class="see" v-click-one="{click:changeType}" :class="{'noSee':canSee}"></span>
        </div>  
        <p class="error" v-if="errorCont">{{errorCont}}</p>
        <p class="button button-full-red" v-click-one="{click:login}" v-if="username != '' && password != ''" >登录</p>  
        <p class="button button-full-red correct" v-if="username == '' || password == ''">登录</p>  
        <p class="forgetPwd" v-click-one="{click:forgetPwd}">忘记密码</p>      
      </form>
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
import axios from 'axios'
export default{
  data () {
    return {
      username: '',
      password: '',
      canSee: false,
      type: 'password',
      errorCont: '',
      equipmentId: '',
      oldHeight: window.outerHeight,
      top: 0,
      sessionToken: ''
    }
  },
  updated () {
  },
  mounted () {
    console.log(this)
  },
  destroyed () {
  },
  activated () {
    var self = this
    self.KeyBoard(true) // 键盘处理
    self.DeviceInfo().then(function (deviceInfo) { // 获取设备信息
      var sessionParams = {
        'equipmentId': deviceInfo.uuid,
        'ip': '127.0.0.1'
      }
      self.$axios.post('/AppUser/CreateSession', sessionParams).then((res) => {
        self.sessionToken = res
      })
    })
  },
  methods: {
    login: _.debounce(function () { // 登录
      var self = this
      var reg = /(^1[3|4|5|6|7|8|9][0-9]{9}$)/
      if (!self.username || !reg.test(self.username)) {
        // self.errorCont = '手机号码有误~'
        setTimeout(function () {
          self.$toast({message: '手机号码有误', duration: 800})
        }, 600)
        return
      }
      self.errorCont = ''
      if (!self.getLocalstorage('visitorId')) {
        this.showConfirm('未获取到游客信息,请先跳至首页')
        return
      }
      self.DeviceInfo().then(function (deviceInfo) { // 获取设备信息
        var loginParams = {
          'userName': self.username,
          'userPassword': self.password,
          'sessionToken': self.sessionToken,
          'equipmentId': deviceInfo.uuid,
          'appVisitorId': self.getLocalstorage('visitorId')
        }
        self.$loading.open()
        self.$axios.post('/AppUser/UserLogin', loginParams).then((res) => {   // 登录
          window.localStorage.setItem('Token', JSON.stringify(res))
          self.$loading.close()
          self.$axios.get('/AppUser/GetById').then((res) => { // 获取用户信息
            window.localStorage.setItem('userInfo', JSON.stringify(res))
            var shopParams = {
              'shopId': self.getLocalstorage('shopId'),
              'accessToken': JSON.parse(window.localStorage.getItem('Token')).accessToken
            }
            axios.post('/app/userauth/addshopid', shopParams).then((res) => { // 存储店铺
              self.KeyBoard(false) // 键盘处理
              window.eventBus.$emit('jpushAlias') // 极光打别名
              if (self.getLocalstorage('gotoGoods')) {
                window.history.go(-1)
                window.localStorage.removeItem('gotoGoods')
              } else {
                if (self.getLocalstorage('shopData').admin === 'yes') {
                  self.$router.push({path: '/home/index/shopTemplate/default'})
                } else {
                  self.$router.push({path: '/home/index/shopTemplate/general'})
                }
              }
            })
          })
        })
      })
    }, 500, {
      'leading': true,
      'trailing': false
    }),
    register: function () { // 注册
      this.$router.push('/register')
    },
    forgetPwd: function () { // 忘记密码
      this.$router.push('/forgetPwd')
    },
    changeType () { // 密码显隐
      this.canSee ? this.type = 'password' : this.type = 'text'
      this.canSee = !this.canSee
    },
    showAlert (cont) {
      this.$toast({message: cont, duration: 800})
    },
    showConfirm (cont) {
      var res = window.confirm(cont)
      if (res) {
        if (this.getLocalstorage('shopData').admin === 'yes') {
          this.$router.push({path: '/home/index/shopTemplate/default'})
        } else {
          this.$router.push({path: '/home/index/shopTemplate/general'})
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.page-content{
  background: #fff;
  .logo{
      display: block;
      width: 2.1rem;
      height: 2.1rem;
      margin: .4rem auto 0.3rem auto;
  }
  .button-full-red{
    margin:.5rem .4rem .3rem .4rem;
    width: 6.7rem;
  }
  .forgetPwd{
    float: right;
    font-size: 0.26rem;
      color: #909791;
      padding:0 .4rem;
  }
  .loginDiv{
    position: relative;
    padding: 0.2rem .4rem 0 0.4rem;
    input{
      color: #323333;
      font-size: 0.35rem;
      padding:0;
      border-radius: 0;
      display: block;
    }
    .see{
      position: absolute;
        display: block;
        bottom: 0;
        right: .4rem;
        height: .98rem;
        width: .8rem;
        z-index: 9;
    }
  }
  .correct{
    background: #D38D8A;
  }
  .inputStyle{
    height: 1rem;
    border-bottom: 1px solid #ddd;
    width: 100%;
  }
  .error{
    margin:0;
    padding:0 .4rem;
    text-align: left;
    font-size: 0.24rem;
    color: #929999;
    line-height: .68rem;
    margin-left: .4rem;
  }
}
</style>