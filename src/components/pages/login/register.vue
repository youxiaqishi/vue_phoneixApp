<template>
<div class="page loginPage">
  <m-header>
    <span slot="left"></span>
    <span slot="title">注册</span>
  </m-header>
  <div class="page-content padding-top">
    <div class="loginDiv">
      <input class="inputStyle1" maxLength="11" type="tel" v-model="username" placeholder="请输入手机号">
      </input>
      <input class="inputStyle1" maxLength="6" type="text" v-model="authCode" placeholder="请输入验证码">
      </input>
      <input class="inputStyle1" maxLength="20" :type=type v-model="password" placeholder="请输入密码">
      </input>
      <p class="button button-red" v-on:click="getCode()" :class="{'disabled': !disabled}">
        {{ time > 0 ? time + 's 后重新获取' : '获取验证码' }}
      </p>
      <span class="see" v-on:click="changeType" :class="{'noSee':canSee}"></span>
    </div>  
    <p class="error" v-if="errorCont">{{errorCont}}</p>
    <div class="lastLine"  v-on:click="agreeCont">
      <i :class="{'icon-check':agree,'icon-checked':!agree}" ></i>已阅读并同意<span v-on:click="popRegist()">用户服务协议</span>
    </div>
    <p class="button button-full-red" v-on:click="register()" v-if="username != '' && authCode != '' && password != '' && agree" >注册</p> 
    <p class="button button-full-red correct" v-if="username == '' || password == '' || !agree">注册</p>
  </div>
</div>
</template>
<script>
import _ from 'lodash'
export default{
  data () {
    return {
      username: '',
      password: '',
      authCode: '',
      canSee: false,
      agree: true,
      type: 'password',
      errorCont: '',
      time: 0,
      disabled: true
    }
  },
  updated () {
  },
  mounted () {
  },
  destroyed () {
  },
  activated () {
    // 键盘处理
    this.KeyBoard(true)
  },
  methods: {
    register: _.debounce(function () { // 注册
      var self = this
      var params = {
        'phone': self.username, // 用户名
        'authCode': self.authCode, // 验证码
        'userPassword': self.password, // 密码
        'appUserSex': 'SECRECY', // 性别
        'appUserImg': 'http://img1.gtimg.com/hn_house/pics/hv1/163/58/189/12304678.jpg', // 头像
        'nickname': '优小选' // 昵称
      }
      if (self.password.length < 6) {
        setTimeout(function () {
          self.$toast({message: '密码长度至少6位', duration: 800})
        }, 600)
        return
      }
      if (self.password.length > 18) {
        setTimeout(function () {
          self.$toast({message: '密码长度最高18位', duration: 800})
        }, 600)
        return
      }
      if (self.testPhoneNum()) {
        self.$axios.post('/AppUser/UserRegister', params).then((res) => {
          self.KeyBoard(false) // 键盘处理
          // self.$router.push('/login')
          self.$toast({message: '注册成功', duration: 800})
          setTimeout(function () {
            self.DeviceInfo().then(function (deviceInfo) { // 获取设备信息
              var sessionParams = {
                'equipmentId': deviceInfo.uuid,
                'ip': '127.0.0.1'
              }
              self.$axios.post('/AppUser/CreateSession', sessionParams).then((res) => {
                var loginParams = {
                  'userName': self.username,
                  'userPassword': self.password,
                  'sessionToken': res,
                  'equipmentId': deviceInfo.uuid,
                  'appVisitorId': self.getLocalstorage('visitorId')
                }
                self.$axios.post('/AppUser/UserLogin', loginParams).then((res) => { // 登录
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
          }, 800)
        })
      }
    }, 1000, {
      'leading': true,
      'trailing': false
    }),
    getCode () {
      var self = this
      if (self.testPhoneNum() && self.disabled) {
        self.time = 60
        self.timer()
        var params = {
          'userPhone': self.username,
          'codeType': 'REGISTER'
        }
        self.$axios.post('/AppUser/SendCode', params).then((res) => {})
      }
    },
    testPhoneNum () {
      var that = this
      var reg = /(^1[3|4|5|6|7|8|9][0-9]{9}$)/
      if (!this.username) {
        // this.errorCont = '请输入手机号~'
        setTimeout(function () {
          that.$toast({message: '请输入手机号', duration: 800})
        }, 600)
        return false
      }
      if (!reg.test(this.username)) {
        // this.errorCont = '手机号码有误~'
        setTimeout(function () {
          that.$toast({message: '手机号码有误', duration: 800})
        }, 600)
        return false
      } else {
        this.errorCont = ''
        return true
      }
    },
    agreeCont () {
      this.agree = !this.agree
    },
    changeType () {
      this.canSee ? this.type = 'password' : this.type = 'text'
      this.canSee = !this.canSee
    },
    popRegist () { // 用户协议
      this.$router.push('/regist')
    },
    timer () {
      if (this.time > 0) {
        this.time--
        this.disabled = false
        setTimeout(this.timer, 1000)
      } else {
        clearTimeout(this.timer)
        this.disabled = true
      }
    }
  }
}
</script>
<style lang="less" scoped>
.page-content{
  background: #fff;
  .button-full-red{
    margin:0.1rem .4rem .3rem .4rem;
    width: 6.7rem;
  }
  .disabled{
    background-color: #666!important;
    color: #eee!important;
  }
  .loginDiv{
    position: relative;
    padding: 0 .4rem 0 0.4rem;
    input{
        color: #323333;
        font-size: 0.28rem;
        padding:.2rem 0;
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
  .button-red{
      width: 2rem;
      padding:0;
      text-align: center;
      background-color: #89262a;
      color: #fff;
      font-size: 0.26rem;
      border-radius: 3px;
      height: .6rem;
      line-height: .65rem;
      min-height: .65rem;
      position: absolute;
      top: 1.15rem;
      z-index: 88;
      right: .4rem;
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
  .lastLine{
    text-align: left;
      line-height: 1rem;
      font-size: .26rem;
      color: #929999;
      padding: 0 .4rem;
      i{
        height: .37rem;
        line-height: .37rem;
        width: .37rem;
        display: inline-block;
        position: relative;
        top:.08rem;
        margin-right: .2rem;
      }
      .red{
        color: #89262a;
      } 
      .gray{
        color: #ddd;
      }
      span{
      color: #89262a;
        margin-left: 0.1rem;
        padding-bottom: 0.01rem;
        border-bottom: 1px solid #89262a;
      }
  }
}
</style>