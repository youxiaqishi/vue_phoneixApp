<template>
  <div class="newGiftsBagCont">
    <div class="newBg">
      <div class="couponCont" v-if="index==0 || index == 1" v-for="(item, index) in newGiftsBagData">
        <div class="couponPrice">
          <p class="couponPlatform" v-if="item.usableRange=='SHOP'">仅店铺使用</p>
          <p class="couponPlatform" v-else>全平台使用</p>
        </div>
        <div class="couponInfo">
          <span class="money">{{item.money}}</span> 元
          <div class="infoDiv">
            <span class="info" v-if="item.usableRange=='SHOP'">使用条件: 商铺使用</span>
            <span class="info" v-else>使用条件: 平台使用</span>
            <span class="info">截止日期: {{item.expireDate}}</span>
          </div>
        </div>
      </div>
      <div class="footCont">
        <div class="messageDiv">
          <div class="message">欢迎光临~</div>
          <div class="message">大额优惠券已收入囊中</div>
          <button v-on:click="close">去逛逛</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: [
    'newGiftsBagData'
  ],
  data () {
    return {
    }
  },
  created () {
    console.log(this.newGiftsBagData)
  },
  methods: {
    close () {
      this.$emit('close')
    },
    kefu () {
      var that = this
      that.$axios.get('/back/phone/queryAll').then((res) => {
        if (res) {
          that.QQCustom(res[0].serviceQQ).then(function () {
          })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped >
.modal{
  background-color: rgba(0,0,0,0.5);
  .bar-header{
    height: 100%;
    background: none;
    h1{
      display: none;
    }
    .button-icon{
      z-index: 10;
      left: 45%;
      top:80%!important;
        height: .8rem;
        width: .8rem;
        border: 1.5px solid #fff;
        border-radius: 100%;
        padding:0;
    }
    .button-icon:before,.button-icon:after{
      font-size: 1.2rem;
      line-height: .7rem;
      color: #fff;
      left: 0!important;
    }
  }
} 
.newGiftsBagCont{
  background: #fff!important;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  background: none!important;
  width: 6rem;
  margin: 0 auto;
  border-radius: 5px;
  .newBg{
    height: 7rem;
    padding-top: .1rem;
    background-color: white;
    border-radius: 5px;
    .couponCont{
      height: 2.5rem;
      width: 5.5rem;
      margin-top:.2rem;
      margin-left: .25rem;
      padding: 0 .2rem;
      border-radius: 2px;
      .couponPrice{
        height: 1.5rem;
        float: left;
        margin-top: .2rem;
        .couponPlatform{
          font-size: .3rem;
          width: .3rem;
          margin-left: .1rem;
          color: #89262a;
        }
      }
      .couponInfo{
        font-size: .28rem;
        padding-top: .1rem;
        color: #89262a;
        height: 2.5rem;
        .money{
          font-size: .8rem;
          color: #89262a;
          margin-left: 1.5rem;
        }
        .infoDiv{
          margin-top: .25rem;
          .info{
            color: #929999;
            font-size: .28rem;
            margin-left: 1.5rem;
          }
        }
      }
    }
    .footCont{
      width: 6.1rem;
      position: absolute;
      height: 3rem;
      top: 4.5rem;
      left: .69rem;
      border-radius: 5px;
      .messageDiv{
        text-align: center!important;
        margin-top: .7rem!important;
        z-index: 99999!important;
        .message{
          font-size: .3rem;
          color: white;
          font-weight: bold;
          margin-top: .1rem;
        }
        button{
          width: 2rem;
          height: .7rem;
          border-radius: 20px;
          color: #89262a;
          font-size: .3rem;
        }
      }
    }
  }
}
</style>
