<template>
  <div class="page header-hidden has-footerBar minePage">
    <div class="page-content">
      <section class="profile-number">
        <router-link :to="'/settings'" v-if="loginOutShow && isLogin"  class="profile-link">
          <img :src="infoData.appUserImg" class="privateImage">
          <div class="user-info">
            <p>{{infoData.nickname}}</p>
            <p><span class="icon-mobile-number">{{infoData.phone}}</span></p>
          </div>
          <span class="arrow">
            <i class="icon-arrow-right1"></i>
          </span>
        </router-link>
        <router-link :to="'/login'" v-if="loginOutShow && !isLogin"  class="profile-link">
          <img class="privateImage" :src="'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1511958092300&di=8483c485c5c3c607e254283b4b69ef9b&imgtype=0&src=http%3A%2F%2Fimg.mp.sohu.com%2Fupload%2F20170702%2F6b8e3386eeed4a95901df1731be1c61f_th.png'">
          <div class="user-info">
            <p style="font-size: .35rem;">去登录</p>
          </div>
          <span class="arrow" style="padding-top: .25rem;">
            <i class="icon-arrow-right1"></i>
          </span>
        </router-link>
        <div v-if="!loginOutShow"  class="profile-link">
          <img :src="infoData.appUserImg" class="privateImage" v-if="$store.state.mutations.minePage">
          <span class="privateImage" v-else></span>
          <div class="user-info">
            <p>{{infoData.nickname}}</p>
            <p><span class="icon-mobile-number">{{infoData.phone}}</span></p>
          </div>
        </div>
      </section> 
      <section class="info-data">
        <div class="allOrder">我的订单 <div v-on:click="goto(0, 0)" class="seeAll">查看全部订单</div></div>
        <ul class="clear" v-if="orderBadge">
          <div v-on:click="goto(0, 1)" class="info-data-link">
            <span class="info-data-icon icon1">待付款</span>
            <em class="bagNum" v-if="orderBadge.waitBuyCount > 0">{{orderBadge.waitBuyCount}}</em>
          </div>
          <div v-on:click="goto(0, 3)" class="info-data-link">
            <span class="info-data-icon icon2">待收货</span>
            <em class="bagNum" v-if="orderBadge.waitReceiveCount > 0">{{orderBadge.waitReceiveCount}}</em>
          </div>
          <div v-on:click="goto(0, 4)" class="info-data-link">
            <span class="info-data-icon icon3">待评价</span>
            <em class="bagNum" v-if="orderBadge.waitCommentCount > 0">{{orderBadge.waitCommentCount}}</em>
          </div>
          <div v-on:click="goto(1, 0)" class="info-data-link">
            <span class="info-data-icon icon4">售后服务</span>
            <em class="bagNum" v-if="orderBadge.refundCount > 0">{{orderBadge.refundCount}}</em>
          </div>
        </ul>
      </section>
      <section class="profileInfo">
        <div v-on:click="goto(2)" class="myorder myorder1">
          <div class="myorder-div infoIcon1">站内信
            <em class="bagNum" v-if="bagNum > 0">{{bagNum}}</em>
            <em class="bagNum" v-if="bagNum > 99">99+</em>
          </div>
        </div>
        <div v-on:click="goto(3)" class="myorder">
          <div class="myorder-div infoIcon11">我的评价</div>
        </div>
        <!-- <div class="myorder">
          <div class="myorder-div infoIcon2" @click="showShareModal()">邀请好友</div>
        </div> -->
      </section>
      <section class="profileInfo">
        <div v-on:click="goto(4)" class="myorder">
          <div class="myorder-div infoIcon3">优惠券</div>
        </div>
        <!-- <router-link to='/vip' class="myorder">
          <div class="myorder-div infoIcon4">会员</div>
        </router-link> -->
        <router-link to='/foot' class="myorder">
          <div class="myorder-div infoIcon5">足迹</div>
        </router-link>
        <router-link :to="'/save'" class="myorder">
          <div class="myorder-div infoIcon6">收藏</div>
        </router-link>
        <div v-on:click="goto(5)" class="myorder">
          <div class="myorder-div infoIcon7">地址</div>
        </div>
      </section>
      <section class="profileInfo profileInfoX">
        <div class="myorder">
          <div class="myorder-div infoIcon8" @click="showServiceModal()">客服</div>
        </div>
        <router-link to='/helpList' class="myorder">
          <div class="myorder-div infoIcon9" >帮助</div>
        </router-link>
        <div v-on:click="goto(6)" v-if="loginOutShow" class="myorder">
          <div class="myorder-div infoIcon10">设置</div>
        </div>
      </section>
    </div>
    <mt-popup v-model="shareModalShow" position="bottom" class="mint-popup-4">
      <div class="modalDiv">
        <h1>邀请好友</h1>
        <ul class="shareList">
          <li class="item shareIcon1" v-on:click="gotoShare(3)"></li>
          <li class="item shareIcon2" v-on:click="gotoShare(4)"></li>
          <li class="item shareIcon3" v-on:click="gotoShare(1)"></li>
          <li class="item shareIcon4" v-on:click="gotoShare(2)"></li>
        </ul>
        <div>
          <button class="button button-full-red" v-on:click="hide()">取消</button>
        </div>
      </div>
    </mt-popup>
    <mt-popup v-model="popupVisible" position="top" class="mint-popup-2">
      <service-modal></service-modal>
    </mt-popup>
  </div>
</template>
<script>
import store from '../../../store/index'
import serviceModal from '../modal/service.vue'
export default {
  data () {
    return {
      shareModalShow: false,
      loginOutShow: true,
      bagNum: 0,
      popupVisible: false,
      infoData: {},
      orderBadge: {},
      isLogin: false
    }
  },
  store,
  mounted () {
  },
  components: {
    serviceModal
  },
  activated () {
    var that = this
    window.eventBus.$on('thisIsIndex', function () {
      that.popupVisible = false
      window.localStorage.removeItem('thisIsIndex')
    })
    if (this.getLocalstorage('userInfo')) this.isLogin = true
    if (this.$store.state.mutations.isApp === 3) this.loginOutShow = false
    this.getData()
  },
  methods: {
    getData () {
      var that = this
      that.bagNum = 0
      if (!that.isLogin) return
      that.$axios.get('/AppUser/get/vip/info').then((res) => {
        if (res) {
          that.$store.state.mutations.minePage = res
          that.infoData = res
        }
      })
      // 获取订单角标
      var bagPar = {
        'shopId': that.getLocalstorage('shopId'),
        'userId': that.getLocalstorage('userInfo').id
      }
      that.$axios.post('/msg/queryWaitCount', bagPar).then((res) => {
        if (res) that.orderBadge = res
      })
      // 获取站内信角标
      var countPar = {
        'shopId': that.getLocalstorage('shopId')
      }
      that.$axios.post('/msg/queryCount', countPar).then((res) => { // 站内信角标
        if (res) that.bagNum = res
      })
    },
    goto (number, info) {
      if (this.isLogin) {
        if (number === 0) {
          this.$router.push({path: '/order/orderList/' + info})
        } else if (number === 1) {
          this.$router.push({path: '/afterSale/saleList/' + info})
        } else if (number === 2) {
          this.$router.push({path: '/message'})
        } else if (number === 3) {
          this.$router.push({path: '/comment/commentList/0'})
        } else if (number === 4) {
          this.$router.push({path: '/coupon/couponList/0'})
        } else if (number === 5) {
          this.$router.push({path: '/addressList'})
        } else if (number === 6) {
          this.$router.push({path: '/settings'})
        }
      } else {
        this.showConfim('您还没有登录,去登录?', 0)
      }
    },
    showShareModal () {
      this.shareModalShow = true
    },
    showServiceModal () {
      this.popupVisible = true
      window.localStorage.setItem('thisIsIndex', 'thisIsIndex')
    },
    hide () {
      this.shareModalShow = false
    },
    gotoShare (index) {
      var that = this
      that.Share(index, '凤凰优选', '快来下载凤凰优选吧~', '', 'https://mall.jd.com/index-729375.html').then(function (success) {
        that.$toast({message: '分享成功', duration: 800})
      })
    },
    showConfim (cont, index) {
      var that = this
      that.$messageBox.confirm(cont, '提示', {closeOnClickModal: false}).then(function () {
        that.$router.push('/login')
      }, function () {
        // window.eventBus.$emit('updateClick')
      })
    }
  }
}
</script>
<style lang="less" scoped>
.none{
  padding-top: 0!important;
}
.page-content{
  background: #fafafa;
  .profile-number{
    background: #89262a;
    .profile-link {
      display: block;
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      box-align: center;
      -webkit-box-align: center;
      -ms-flex-align: center;
      -webkit-align-items: center;
      align-items: center;
      padding: .5rem .24rem;
      .privateImage {
        display: inline-block;
        width: 1.6rem;
        height: 1.6rem;
        border-radius: 50%;
        vertical-align: middle;
        background: #fff;
      }
      .user-info{
        margin-left: .48rem;
        -webkit-box-flex: 1;
        -ms-flex-positive: 1;
        -webkit-flex-grow: 1;
        flex-grow: 1;
        p{
          font-weight: 700;
          font-size: 0.3rem;
          color: #fff;
          margin:0;
        }
        p .icon-mobile-number{
          display: inline-block;
          font-size: 0.26rem;
          color: #fff;
        }
      }
      .arrow{
        width: 0.46667rem;
        height: 0.98rem;
        display: inline-block;
        padding-top: .3rem;
        i{
          height: .5rem;
          width: .5rem;
          float: right;
        }
      }
    }
  }
  .info-data{
    width: 100%;
    background: #fff;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin-top: .32rem;
    margin-bottom:.32rem;
    border-top: 1px solid #eeeeee;
    border-bottom: 1px solid #eeeeee;
    font-size: 0.28rem;
    color: #323333;
    .allOrder{
      height: .6rem;
      line-height: .6rem;
      margin: 0 .24rem;
      border-bottom: 1px solid #eeeeee;
      position: relative;
      .seeAll{
        right: 0;
        height: .6rem;
        line-height: .6rem;
        position: absolute;
        top:0;
        color: #929999;
      }
    }
    .info-data-link{
      display:flex;
      align-items: center; 
      position: relative; 
      .bagNum {
          display: inline-block;
          min-width: 0.35rem;
          height: 0.35rem;
          font-size: .2rem;
          background: white;
          color: #89262a;
          border-radius: .35rem;
          line-height: .35rem;
          border-style: solid;
          border-width: 1px;
          border-color: #89262a;
          text-align: center;
          position: absolute;
          left: 1rem;
          top: .1rem;
      }
    }
    ul{
      padding: 0 .2rem;
      overflow: hidden;
      .info-data-link{
        float: left;
        width: 25%;
        display: inline-block;
        padding: .25rem 0 .14rem 0;
        span{
          display:block;
          width:100%;
          text-align:center;
          line-height: .6rem;
          height: 1rem;
          padding-top: .5rem;
        }
      }
    }
  }
  .profileInfo{
    margin-bottom:.32rem;
    background:#fff;
    border-top: 1px solid #eeeeee;
    border-bottom: 1px solid #eeeeee;
    a{
      color: #333;
      font-size: .28rem;
    }
    .myorder{
      padding-left:.24rem;
      display:flex;
      align-items: center; 
      position: relative; 
      .bagNum {
          display: inline-block;
          min-width: 0.35rem;
          height: 0.35rem;
          font-size: .2rem;
          background: white;
          color: #89262a;
          border-radius: .35rem;
          line-height: .35rem;
          border-style: solid;
          border-width: 1px;
          border-color: #89262a;
          text-align: center;
          position: absolute;
          left: .5rem;
          top: .1rem;
      }
      .myorder-div{
        width:7rem;
        padding-left: .7rem;
        border-bottom:1px solid #f1f1f1;
        color: #333;
        font-size: .28rem;
        display:flex;
        justify-content:space-between;
        height: 1rem;
        line-height: 1rem;
        a{
          width: 100%;
          height: 100%;
        }
        span,a{
          display:block;
        }
      }
    }
    .myorder1{
      display: block;
      position: relative;

    }
    .myorder:last-child{
      .myorder-div{
        border-bottom:none;
      }            
    }
  }
  .profileInfoX{
    margin-bottom: 1rem;
  }
}
.modalDiv{
  h1{
    height: 1.1rem;
    line-height: 1rem;
    text-align: center;
    color: #333;
    font-size: .34rem;
    background: #fff;
    margin-bottom: 0;
  }
  .row {
    margin-top: .3rem;
    padding: 0;
    height: 1rem;
    button{
      margin: 0 5%;
      width: 90%;
      height: 1rem;
      color: #fff;
      background: #89262a;
      opacity: 1!important;
      border-radius: 5px;
      font-size: .4rem;
    }
  }
  .shareList{
    padding:0 5% 1.3rem 5%;
    li{
      width: 25%;
      border: none;
      float: left;
      height: 1rem;
    }
  }
  .text{
    padding-left: .7rem;
    display: inline-block;
    margin-top: .05rem;
  }
  .close{
    width: .43rem;
    height: .43rem;
    /*background: url(../images/close.png) no-repeat;*/
    background-size:80%;
    position: absolute;
    top: .3rem;
    right: .3rem;
  }
}
.mint-popup-4{
  width: 100%;
}
</style>