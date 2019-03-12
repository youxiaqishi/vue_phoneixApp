<template>
  <div class="page loginPage">
    <m-header>
      <span slot="left"></span>
      <span slot="title">忘记密码</span>
    </m-header>
    <div class="page-content padding-top">
      <form>
        <div class="loginDiv">
          <input :maxLength="11" class="inputStyle1" type="tel" v-model="username" placeholder="请输入手机号">
          </input>
          <input :maxLength="6" class="inputStyle1" type=text v-model="authCode" placeholder="请输入验证码">
          </input>
          <input :maxLength="20" class="inputStyle1" :type=type v-model="password" placeholder="请输入新密码">
          </input>
          <span class="see" v-on:click="changeType" :class="{'noSee':canSee}"></span>
          <p class="button button-red" v-on:click="getCode()" :class="{'disabled':!disabled}">
            {{ time > 0 ? time + 's 后重新获取' : '获取验证码' }}
          </p>
        </div>  
        <p class="error" v-if="errorCont">{{errorCont}}</p>
      </form>
      <p class="button button-full-red" v-click-one="{click:getNewPwd}" v-if="username != '' && password != '' && authCode != ''" >确定</p>  
      <p class="button button-full-red correct" v-if="authCode == '' || username == '' || password == ''">确定</p> 
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
      type: 'password',
      errorCont: '',
      time: 0,
      disabled: true
    }
  },
  activated () {
    this.KeyBoard(true) // 键盘处理
  },
  updated () {
  },
  mounted () {
  },
  destroyed () {
  },
  methods: {
    changeType () { // 显隐
      this.canSee ? this.type = 'password' : this.type = 'text'
      this.canSee = !this.canSee
    },
    getNewPwd: _.debounce(function () { // 重置密码
      var that = this
      if (that.testPhoneNum()) {
        var params = {
          'userId': '',
          'userPhone': that.username,
          'authCode': that.authCode,
          'userPassword': that.password
        }
        if (that.password.length < 6) {
          setTimeout(function () {
            that.$toast({message: '密码长度至少6位', duration: 800})
          }, 600)
          return
        }
        if (that.password.length > 18) {
          setTimeout(function () {
            that.$toast({message: '密码长度最高18位', duration: 800})
          }, 600)
          return
        }
        that.$axios.post('/AppUser/RestPassword', params).then((res) => {
          that.KeyBoard(false) // 键盘处理
          // that.$router.replace('/login')
          // that.$toast({message: '修改密码成功', duration: 800})
          // setTimeout(function () {
            // window.history.go(-1)
            // 直接登录
          that.DeviceInfo().then(function (deviceInfo) { // 获取设备信息
            var sessionParams = {
              'equipmentId': deviceInfo.uuid,
              'ip': '127.0.0.1'
            }
            that.$axios.post('/AppUser/CreateSession', sessionParams).then((res) => {
              var loginParams = {
                'userName': that.username,
                'userPassword': that.password,
                'sessionToken': res,
                'equipmentId': deviceInfo.uuid,
                'appVisitorId': that.getLocalstorage('visitorId')
              }
              that.$axios.post('/AppUser/UserLogin', loginParams).then((res) => {   // 登录
                window.localStorage.setItem('Token', JSON.stringify(res))
                that.$axios.get('/AppUser/GetById').then((res) => { // 获取用户信息
                  window.localStorage.setItem('userInfo', JSON.stringify(res))
                  var shopParams = {
                    'shopId': that.getLocalstorage('shopId'),
                    'accessToken': JSON.parse(window.localStorage.getItem('Token')).accessToken
                  }
                  that.$axios.post('/app/userauth/addshopid', shopParams).then((res) => { // 存储店铺
                    window.eventBus.$emit('jpushAlias') // 极光打别名
                    if (that.getLocalstorage('shopData').admin === 'yes') {
                      that.$router.push({path: '/home/index/shopTemplate/default'})
                    } else {
                      that.$router.push({path: '/home/index/shopTemplate/general'})
                    }
                  })
                })
              })
            })
          })
          // }, 800)
        })
      }
    }, 500, {
      'leading': true,
      'trailing': false
    }),
    getCode: function () { // 验证码
      var self = this
      if (self.testPhoneNum() && self.disabled) {
        self.time = 60
        self.timer()
        var params = {
          'userPhone': self.username,
          'codeType': 'RESET_PASSWORD'
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
    timer: function () {
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
  .loginDiv{
    position: relative;
    padding:0 .4rem 0 0.4rem;
    .disabled{
      background-color: #666!important;
      color: #eee!important;
    }
    input{
        color: #323333;
        font-size: 0.28rem;
        padding:0;
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
  .correct{
    background: #D38D8A;
  }
  .button-full-red{
    margin:.1rem .4rem .3rem .4rem;
    width: 6.7rem;
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