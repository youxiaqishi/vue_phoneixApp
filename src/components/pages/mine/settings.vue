<template>
<div class="page">
  <m-header>
    <span slot="left"></span>
    <span slot="title">用户设置</span>
    <span slot="right" v-on:click="saveInfo">保存</span>
  </m-header>
  <div class="page-content">
    <div class="headCont" v-on:click="newUploadHeadClick()">
      <div class="headDiv">
        <img v-lazy="userInfo.appUserImg"  v-if="userInfo.appUserImg"/>
        <span class="defaultHead"  v-if="!userInfo.appUserImg"></span>
      </div>
      <div class="phone">{{userInfo.phone}}</div>
      <div class="text">
         <!-- <input type="file" accept="image/*" @change="upLoadHead"/> 点击修改头像 -->
        <p>点击修改头像</p>
      </div>
    </div>
    <div class="list-ios">
        <div class="list-item">昵称
          <span class="item-note">
            <input type="text" v-model="userInfo.nickname" placeholder="请输入昵称" />
          </span>
        </div>
        <div class="list-item">性别
            <div class="item-note">
              <p class="gender" v-on:click="genderFn(0)"><i :class="{'icon-checked gray':userInfo.appUserSex == 'WOMAN'||userInfo.appUserSex == 'SECRECY','icon-check red':userInfo.appUserSex == 'MAN'}"></i>男</p>
              <p class="gender" v-on:click="genderFn(1)"><i :class="{'icon-checked gray':userInfo.appUserSex == 'MAN'||userInfo.appUserSex == 'SECRECY','icon-check red':userInfo.appUserSex == 'WOMAN'}"></i>女</p>
              <p class="gender" v-on:click="genderFn(2)"><i :class="{'icon-checked gray':userInfo.appUserSex == 'MAN'||userInfo.appUserSex == 'WOMAN','icon-check red':userInfo.appUserSex == 'SECRECY'}"></i>保密</p>
          </div>
        </div>
        <div class="list-item">手机号码
          <span class="item-note">{{userInfo.phone}}</span>
        </div>
    </div>
    <section class="profileInfo">
      <router-link to='/changePwd' class="myorder" v-if="loginOutShow">
        <div class="myorder-div">账号安全
          <i class="icon-arrow-right"></i>
        </div>
      </router-link>
      <router-link to='/about' class="myorder">
        <div class="myorder-div">关于我们
          <i class="icon-arrow-right"></i>
        </div>
      </router-link>
    </section>
    <p class="button button-full-red" v-click-one="{click:LoginOut}"  v-if="loginOutShow">退出登录</p> 
  </div>
</div>
</template>
<script>
import store from '../../../store/index'
export default{
  data () {
    return {
      gender: 0,
      userInfo: {},
      loginOutShow: true
    }
  },
  store,
  mounted () {
  },
  activated () {
    var that = this
    if (!that.getLocalstorage('userInfo')) { // 登录校验
      that.showConfim('您没有进行登录,去登录?')
    } else {
      if (that.$store.state.mutations.isApp === 3) that.loginOutShow = false // 凤凰会隐藏退出登录和账号安全
      if (that.$store.state.mutations.minePage) {
        that.userInfo = {...that.$store.state.mutations.minePage}
      } else {
        that.getData()
      }
    }
  },
  methods: {
    getData () {
      this.$axios.get('/AppUser/get/vip/info').then((res) => {
        if (res) {
          if (res.appUserImg === 'http://img1.gtimg.com/hn_house/pics/hv1/163/58/189/12304678.jpg') {
            res.appUserImg = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1511958092300&di=8483c485c5c3c607e254283b4b69ef9b&imgtype=0&src=http%3A%2F%2Fimg.mp.sohu.com%2Fupload%2F20170702%2F6b8e3386eeed4a95901df1731be1c61f_th.png'
          }
          this.userInfo = res
          this.$store.state.mutations.minePage = res
        }
      })
    },
    showConfim (cont, index) {
      var that = this
      that.$messageBox.confirm(cont, '提示', {closeOnClickModal: false}).then(function () {
        that.$router.replace('/login')
      }, function () {
        window.eventBus.$emit('updateClick')
      })
    },
    newUploadHeadClick () {
      var that = this
      if (that.$store.state.mutations.isApp === 1) {
        that.ActionSheet().then(function (buttonIndex) {
          if (buttonIndex === 2) {
            that.Camera().then(function (imageData) {
              var img = 'data:image/pngbase64,' + imageData
              that.newUploadHead(that.dataURItoBlob(img))
            }, function (err) {
              that.$toast({message: err, duration: 800})
            })
          }
          if (buttonIndex === 1) {
            that.Camera(1).then(function (imageData) {
              var img = 'data:image/pngbase64,' + imageData
              that.newUploadHead(that.dataURItoBlob(img))
            }, function (err) {
              that.$toast({message: err, duration: 800})
            })
            // that.ImagePicker(1).then(function (imageUrlArray) {
            //   var img = new Image()
            //   img.src = imageUrlArray[0]
            //   img.onload = function () {
            //     var w = Math.min(400, img.width)
            //     var h = img.height * (w / img.width)
            //     var canvas = document.createElement('canvas')
            //     var ctx = canvas.getContext('2d')
            //     canvas.width = w
            //     canvas.height = h
            //     ctx.drawImage(img, 0, 0, w, h)
            //     var dataURL = canvas.toDataURL('image/png')
            //     that.newUploadHead(that.dataURItoBlob(dataURL))
            //   }
            // }, function (err) {
            //   that.$toast({message: err, duration: 800})
            // })
          }
        }, function (err) {
          that.$toast({message: err, duration: 800})
        })
      }
    },
    newUploadHead (info) {
      var formData = new FormData()
      formData.append('name', 'file')
      formData.append('file', info)
      var config = {
        headers: {'content-type': 'multipart/form-data'}
      }
      this.$axios.post('http://125.94.39.195:8063/storage/upload', formData, config).then((res) => {
        this.userInfo.appUserImg = res
      }).catch(function (eMsg) {
        this.showAlert(eMsg)
      })
    },
    dataURItoBlob (dataURI) {
      var byteString = atob(dataURI.split(',')[1])
      var mimeString = dataURI.split(',')[0].split(':')[1].split('')[0]
      var ab = new ArrayBuffer(byteString.length)
      var ia = new Uint8Array(ab)
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
      }
      return new Blob([ab], {type: mimeString})
    },
    genderFn (type) {
      if (type === 0) {
        this.userInfo.appUserSex = 'MAN'
      } else if (type === 1) {
        this.userInfo.appUserSex = 'WOMAN'
      } else {
        this.userInfo.appUserSex = 'SECRECY'
      }
    },
    saveInfo () { // 保存
      var that = this
      var params = {
        'nickname': that.userInfo.nickname,
        'appUserSex': that.userInfo.appUserSex,
        'appUserImg': that.userInfo.appUserImg
      }
      that.$axios.post('/AppUser/update/vip/info', params).then((res) => {
        if (res) {
          that.showAlert('保存成功')
          that.getData()
        }
      })
    },
    LoginOut () { // 退出
      var that = this
      var equimentId = that.getLocalstorage('equipmentId')
      that.$axios.get('/AppUser/PullOut/' + equimentId).then((res) => {
        window.localStorage.removeItem('Token')
        window.localStorage.removeItem('userInfo')
        that.$store.state.mutations.minePage = null
        // 重新存储添加shop (拿到Token)
        // window.localStorage.removeItem('shopData')
        // window.localStorage.removeItem('shopId')
        that.$axios.get('/app/shop/get/default/shop/community').then((res) => {
          // window.localStorage.setItem('shopData', JSON.stringify(res[0]))
          // window.localStorage.setItem('shopId', JSON.stringify(res[0].id))
          var params = {
            'shopId': window.$getLocalstorage('shopId'),
            'accessToken': JSON.parse(window.localStorage.getItem('Token')).accessToken
          }
          that.$axios.post('/app/userauth/addshopid', params).then((res) => {
            that.$router.push('/login')
          })
        })
      })
    },
    showAlert (cont) {
      this.$toast({message: cont, duration: 800})
    }
  }
}
</script>
<style lang="less" scoped>
@import "../../../../static/css/mine.less";
</style>