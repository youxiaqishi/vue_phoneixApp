<template>
<div class="page">
  <m-header>
    <span slot="left"></span>
    <span slot="title">订单详情</span>
  </m-header>
  <div class="page-content">
    <div class="orderInfo">
      <div class="Info_top">
        <p class="num">下单时间：{{orderData.confirmOrderTime}}</p>
        <p class="num">订单编号：{{orderData.orderNo}}</p>
        <span v-if="orderData.orderStatus == 'OBLIGATION'" class="red">待付款</span>
        <span v-if="orderData.orderStatus == 'WAITRECEIVE'">待收货</span>
        <span v-if="orderData.orderStatus == 'WAITCOMMENT'">待评价</span>
        <span v-if="orderData.orderStatus == 'WAITSEND'">待发货</span>
        <span v-if="orderData.orderStatus == 'REFUNDMONEY'">退款中</span>
        <span v-if="orderData.orderStatus == 'REFUNDGOODS'">退货中</span>
        <span v-if="orderData.orderStatus == 'CANCEL'">已取消</span>
        <span v-if="orderData.orderStatus == 'REFUNDFINISH'">退款完成</span>
        <span v-if="orderData.orderStatus == 'COMPLETED'">已评价</span>
        <span v-if="orderData.orderStatus == 'ACTIVITYING'">待成团</span>
        <span v-if="orderData.orderStatus == 'PRESELLING'">预售中</span>
      </div>
      <div class="Info_bottom">
        <!-- <div class="wuliuIcon" style="border:0;">您的订单已进入佛山市</div> -->
        <p class="allPrice">实付： <span>￥{{orderData.realPrice | twoDecimal}}</span>  </p>
        <div class="btns">
          
        <button class="button button-small button-gray" v-if="orderData.orderStatus == 'OBLIGATION'" v-on:click="cancelOrder(orderData)">取消订单</button>
        <button class="button button-small button-red" v-if="orderData.orderStatus == 'OBLIGATION' && isPutaway == 'UP'" v-on:click="payNow(orderData)">立即付款</button>

        <button v-if="orderData.orderStatus == 'WAITSEND'" v-on:click="refundSalesApply(orderData,0)" class="button button-small button-red">全部退款</button>
        <button v-if="orderData.orderStatus == 'WAITCOMMENT' || orderData.orderStatus == 'COMPLETED'" v-on:click="refundSalesApply(orderData,1)" class="button button-small button-gray">申请退货</button>

        <button v-if="(orderData.orderStatus == 'WAITRECEIVE' || orderData.orderStatus == 'WAITCOMMENT')&&orderData.logisticType=='DISTRIBUTION'" v-on:click="checkLogistics(orderData)" class="button button-small button-gray">查看物流</button>
        <button v-if="orderData.orderStatus == 'WAITRECEIVE'" v-on:click="receive(orderData)" class="button button-small button-gray">确认收货</button>

        <button v-if="orderData.orderStatus == 'REFUNDGOODS'" v-on:click="refundSalesDetail(orderData,0)" class="button button-small button-gray">退货详情</button>

        <button v-if="orderData.orderStatus == 'COMPLETED' || orderData.orderStatus == 'COMPLETED'" v-on:click="payAgain(orderData)" class="button button-small button-red">再次购买</button>
        <button v-if="orderData.orderStatus == 'WAITCOMMENT'" v-on:click="evaluate(orderData)" class="button button-small button-red">评价晒单</button>
        </div>
      </div>
    </div>

    <!-- 拼团显示 -->
    <div class="ordersGroup" v-if="orderGroupData">
      <div class="orderGroupUp">
        <p class="left icon-wait" v-if="orderGroupData.state == 'WAIT'">拼团中</p>
        <p class="left icon-success" v-if="orderGroupData.state == 'SUCCESS'">拼团成功</p>
        <p class="left icon-fail" v-if="orderGroupData.state == 'FAIL'">拼团失败</p>
      </div>
      <div class="orderGroupDown">
        <ul class="userList">
          <li class="userInfo" v-for="(user, index) in orderGroupData.regimentUrlDTOList" v-if="index < 5">
            <img class="imgUrl" v-lazy="user.url">
            <span class="bg" v-if="user.userGrade == 'COLONEL'">团长</span>
            <span class="bg" v-if="user.userGrade == 'MEMBER'">团员</span>
          </li>
          <li class="frBtn">
            <router-link :to="'/groupStatus/'+activityGroupId" tag="div" class="groupBtn">
              拼团详情
            </router-link>            
          </li>
        </ul>
      </div>
    </div>

    <div class="shopInfo" v-for="shop in orderData.childOrderDetailDTOS">
      <h2>{{shop.shopName}}</h2>
      <div class="commodity">
        <dl class="infoData" v-for="shop1 in shop.commodityConfirmDTOS">
          <router-link :to="'/goodsDetail/' + shop1.commodityId" tag="div">
          <dt>
            <img v-bind:src="shop1.url"/>
            <span class="putDown" v-if="shop1.putaway == 'DOWN'"></span>
          </dt>
          <dd>
            <h3>{{shop1.commodityName | maxLength(25)}}<br /></h3>
            <div class="price">
              <p class="owner" v-if="(shop1.activityInfoDTO.type == 'COMMON' || shop1.activityInfoDTO.type == 'BUY_PRESENT' || shop1.activityInfoDTO.type == 'SPECIAL' || shop1.activityInfoDTO.type == 'GIVE' || shop1.activityInfoDTO.type == 'DISCOUNT') && (appUserType == 'notLogin' || appUserType == 'OWNER' || appUserType == 'STAFF')">业主价：<span>￥{{shop1.privilegePrice | twoDecimal}}</span> </p>
              <p class="owner" v-if="shop1.activityInfoDTO.type == 'SECKILL'">秒杀价：<span>￥{{shop1.activityInfoDTO.activityPrice | twoDecimal}}</span> </p>
              <p class="owner" v-if="shop1.activityInfoDTO.type == 'FLASH_SALE'">限时价：<span>￥{{shop1.activityInfoDTO.activityPrice | twoDecimal}}</span> </p>
              <p class="owner" v-if="shop1.activityInfoDTO.type == 'OPENGROUP' || shop1.activityInfoDTO.type == 'JOINGROUP'">拼团价：<span>￥{{shop1.activityInfoDTO.activityPrice | twoDecimal}}</span> </p>
              <p class="owner" v-if="shop1.activityInfoDTO.type == 'PRESELL'">预售价：<span>￥{{shop1.activityInfoDTO.activityPrice | twoDecimal}}</span> </p>
              <p class="owner" v-if="shop1.activityInfoDTO.type == 'GROUPBUY'">团购价：<span>￥{{shop1.activityInfoDTO.activityPrice | twoDecimal}}</span> </p>
              <p class="owner" v-if="shop1.activityInfoDTO.type == 'SPECIALOFFER'">特价：<span>￥{{shop1.activityInfoDTO.activityPrice | twoDecimal}}</span> </p>
              <p class="selling" v-if="(shop1.activityInfoDTO.type == 'COMMON' || shop1.activityInfoDTO.type == 'BUY_PRESENT' || shop1.activityInfoDTO.type == 'SPECIAL' || shop1.activityInfoDTO.type == 'GIVE' || shop1.activityInfoDTO.type == 'DISCOUNT') && (appUserType == 'notLogin' || appUserType == 'GENERAL')">零售价：<span>￥{{shop1.originPrice | twoDecimal}}</span></p>
            </div>
            <div class="nums" style="margin-right: .2rem">x {{shop1.count}}</div>
          </dd>
          </router-link>
          <button v-if="orderData.orderStatus == 'REFUNDMONEY'" v-on:click="refundSalesDetail(shop1, 1)" class="button button-small button-gray" style="margin-right: .2rem"> 退款详情</button>
          <div v-if="shop1.cartCommodityDiscountMoneyDTO">
            <div class="cartCommodityDis">
              <span class="des">满减专场购满{{shop1.cartCommodityDiscountMoneyDTO.startMoney}}元立减{{shop1.cartCommodityDiscountMoneyDTO.discountMoney}}元</span>
            </div>
          </div>
          <div v-if="shop1.cartCommodityDiscountGoodsDTO">
            <div class="cartCommodityDis">
              <span class="commodity" v-if="shop1.cartCommodityDiscountGoodsDTO.fillGiveType=='ONE'">任选一款赠品:</span>
              <span class="commodity" v-if="shop1.cartCommodityDiscountGoodsDTO.fillGiveType=='ALL'">赠品:</span> 
              <ul class="imagesList" v-on:click="fullGiveClick(shop1.cartCommodityDiscountGoodsDTO)">
                <li v-for="item in shop1.cartCommodityDiscountGoodsDTO.discountGoodsList" v-if="!shop1.cartCommodityDiscountGoodsDTO.isChoosed">
                  <img v-bind:src="item.imgUrl"/> × {{item.giveNumber}}
                </li>
                <li v-for="item in shop1.cartCommodityDiscountGoodsDTO.discountGoodsList" v-if="shop1.cartCommodityDiscountGoodsDTO.isChoosed">
                  <img v-bind:src="item.imgUrl"/> * {{item.giveNumber}}
                </li>
              </ul>
            </div>
          </div>
        </dl>
      </div>
      <div class="address" v-if="shop.acceptAddressDTO">
        <h3>
          {{shop.acceptAddressDTO.name}}<span>{{shop.acceptAddressDTO.phone}}</span>
        </h3>
        <div class="addressInfo">
          <span>收货地址</span>
          <p v-if="shop.logisticType == 'DISTRIBUTION'">{{shop.acceptAddressDTO.province}}{{shop.acceptAddressDTO.city}}{{shop.acceptAddressDTO.county}}{{shop.acceptAddressDTO.address}}</p>
          <p v-if="shop.logisticType == 'TAKE'">{{shop.shopAddress}}</p>
          <p class="gray" v-if="shop.logisticType == 'DISTRIBUTION'">配送</p>
          <p class="gray" v-if="shop.logisticType == 'TAKE'">自提</p>
        </div>
      </div>
    </div>
    <div class="prices">
      <div class="list-ios">
        <div class="list-item">
          商品金额 <span class="item-note">￥{{orderData.commodityPrice | twoDecimal}}</span> 
        </div>
        <div class="list-item">
          优惠金额 <span class="item-note">￥{{orderData.reducedPrice | twoDecimal}}</span> 
        </div>
        <div class="list-item">
          会员折扣 <span class="item-note">￥{{orderData.identityPrice | twoDecimal}}</span>  
        </div>
        <div class="list-item">
          配送费用 <span class="item-note gray">￥{{orderData.freightPrice | twoDecimal}}</span>  
        </div> 
        <div class="list-item">
          总额 <span class="item-note">￥{{orderData.realPrice | twoDecimal}}</span>  
        </div>
      </div>
    </div>
    <button class="button button-full-red" @click="showModal()">联系客服</button>
  </div>
  <mt-popup v-model="popupVisible" position="top" class="mint-popup-2">
    <service-modal></service-modal>
  </mt-popup>
</div>
</template>
<script>
import axios from 'axios'
import serviceModal from '../modal/service.vue'
export default{
  data () {
    return {
      data: {
        shop: {},
        address: {}
      },
      orderData: {},
      modal: '',
      popupVisible: false,
      appUserType: '', // 用户身份
      orderGroupData: '',
      isPutaway: 'UP'
    }
  },
  components: {
    serviceModal
  },
  mounted () {
  },
  destroyed () {
  },
  activated () {
    var that = this
    window.$getLocalstorage('userInfo') ? this.appUserType = window.$getLocalstorage('userInfo').appUserType : this.appUserType = 'notLogin' // 身份标识
    window.eventBus.$emit('tabIndex', that.$route.params.index)
    that.$loading.open()
    that.$axios.get('/order/app/orderDetail/' + that.$route.params.orderId + '/' + that.$route.params.orderType).then((res) => {
      that.isPutaway = 'UP' // 是否存在下架商品
      res.childOrderDetailDTOS[0].commodityConfirmDTOS.forEach(function (item) {
        if (item.putaway === 'DOWN') that.isPutaway = 'DOWN'
      })
      if (res) that.orderData = res
      var activityType = that.orderData.childOrderDetailDTOS[0].commodityConfirmDTOS[0].activityInfoDTO.type
      this.activityGroupId = that.orderData.childOrderDetailDTOS[0].commodityConfirmDTOS[0].groupId
      if (activityType === 'OPENGROUP' || activityType === 'JOINGROUP') {
        // 如果是拼团查出拼团信息
        that.checkGroupData(that.activityGroupId)
      }
      that.$loading.close()
    })
  },
  methods: {
    checkGroupData (groupId) {
      var that = this
      if (!groupId) return
      that.$axios.get('/spell/group/group/order/' + groupId).then((res) => {
        if (res) {
          that.orderGroupData = res
          console.log(that.orderGroupData)
        }
      })
    },
    cancelOrder (info) { // 取消订单
      let that = this
      that.showConfirm('取消订单', '取消此订单？', function () {
        axios.get('/order/app/cancelOrder/' + info.id + '/' + that.$route.params.orderType).then((res) => {
          if (res) {
            that.$toast({message: '取消成功', duration: 1000})
            window.history.go(-1) // 刷新
          }
        })
      })
    },
    payNow (info) { // 立即支付
      this.$router.push({path: '/payment/' + info.realPrice + '/' + info.id + '/' + info.orderNo})
    },
    evaluate (info) { // 评价
      this.$router.push({path: '/evaluate/' + this.$route.params.index + '/' + info.id + '/' + this.$route.params.orderType})
      // this.$router.push({name:'evaluateGood', params: {
      //  orderId: info.id,
      //  commodityId: info.childOrderDetailDTOS[0].commodityConfirmDTOS[0].commodityId,
      //  shopId: info.childOrderDetailDTOS[0].shopId,
      // }})
    },
    checkLogistics (info) { // 查看物流
      this.$router.push({path: '/logistics/' + info.id + '/' + info.logisticOwner})
    },
    receive (info) { // 确认收货
      var that = this
      that.showConfirm('收货', '是否确认收货？', function () {
        that.$axios.get('/order/app/confirmReceive/' + info.id).then((res) => {
          if (res) {
            that.$toast({message: '收货成功', duration: 1000})
            window.history.go(-1)
          }
        })
      })
    },
    payAgain (info) { // 再次购买
      var that = this
      var paramsArray = []
      info.childOrderDetailDTOS[0].commodityConfirmDTOS.forEach(function (item) {
        var params = {
          'skuId': item.commodityId, // 商品ID
          'shopId': item.shopId, // 商品对应门店ID
          'offset': 1 // offset
        }
        paramsArray.push(params)
      })
      axios.post('/cart/commodity/addList', paramsArray).then((res) => {
        that.$router.push('/home/shopCart/1')
      })
    },
    refundSalesApply (info, type) { // 申请退款退货
      window.localStorage.setItem('orderData', JSON.stringify(info))
      if (type === 0) { // 退款
        this.$router.push({path: '/refundSalesApply2/0'})
      } else { // 退货
        this.$router.push({path: '/refundSalesApply2/1'})
      }
    },
    refundSalesDetail (info, type) { // 退货退款详情
      console.log(info)
      if (type === 0) { // 退款
        this.$router.push({name: 'refundSalesDetail', params: {refundOrderId: info.refundOrderId, type: 0}})
      } else { // 退货
        this.$router.push({name: 'refundSalesDetail', params: {refundOrderId: info.refundOrderId, type: 1}})
      }
    },
    showModal () {
      // this.modal.show()
      this.popupVisible = true
    },
    showConfirm (title, cont, callback) {
      this.$messageBox.confirm(cont, title, {closeOnClickModal: false}).then(action => {
        if (action) {
          callback()
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import "../../../../static/css/mine.less";
@import "../../../../static/css/orderDetail.less";
  p{
    margin:0;
  }
  .warnTime{
    height: .6rem;
    font-size: .24rem;
    color: #929999;
    margin:0;
    
  }
  .prices{
    margin-bottom: .5rem;
    margin-top: .3rem;
    background: #fff;
  }
  .gray{
    color: #929999;
  }
  .orderInfo{
    margin-top: .3rem;
    background: #fff;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
    height: 2.34rem;
    position: relative;
    .Info_top{
      font-size: .28rem;
      color: #1a191e;
      line-height: .6rem;
      margin:.15rem .24rem;
      p{
        width: 80%;
        white-space:nowrap; 
        overflow:hidden; 
        text-overflow:ellipsis; 
        font-size: .28rem;
      }
      span{
          position: absolute;
          right: .2rem;
          top: .15rem;
      }
    }
    .Info_bottom{
      line-height: .8rem;
      margin:0 .24rem;
      border-top: 1px solid #eee;
      .allPrice{
        float: left;
        font-size: .28rem;
      }
      .btns{
        float: right;
        margin-top:.13rem;
      }
    }
  }
  .shopInfo{
    clear: both;
    margin-top:.3rem;
    overflow: hidden;
    background: #fff;
    border-top: 1px solid #eee;
    h2{
      font-size: .3rem;
      color: #333;
      height: 1rem;
      line-height: 1rem;
      padding:0 .24rem;
      border-bottom: 1px solid #eee;
      margin:0;
    }
    .infoData{
      padding: .2rem 0;
      border-bottom: 1px solid #eee;
      position: relative;
      dd{
        width: 4.7rem;
      }
      .appraise{
        position: absolute;
        bottom: .2rem;
        right: .1rem;
      }
    }
/*    .infoData:last-child{
      border-bottom: none;
    }*/
    .address{
      margin:.3rem 0;
      h3{
        background: #fff;
        font-size: .36rem;
        color: #1a191e;
        padding:0 .24rem;
        margin: 0;
        height: .9rem;
        line-height: .9rem;
        span{
          margin-left: .35rem;
          font-size: .3rem;
        }
      }
      .addressInfo{
          padding: .05rem .24rem;
          overflow: hidden;
          background: #fff;
          height: 1.3rem;
          font-size: .3rem;
        span{
          float: left;
          width: 1.42rem;
          height: 1.1rem;
          color: #929999;
        }
        p{
          float: left;
          width: 5.6rem;
          padding:0;
          margin:0;
        }
      }
    }
  }
  .ordersGroup{
    /*min-height: 2rem;*/
    background: #fff;
    margin-top: .2rem;
    border-bottom: 1px solid #eee;
    border-top: 1px solid #eee;
    padding: .1rem .25rem;
    overflow: hidden;
    .orderGroupUp{
      height: .7rem;
      line-height: .75rem;
      margin-bottom: .1rem;
      p{
        padding-left: .5rem;
      }
    }
  }
  .orderGroupDown{
    clear: both;
    .userInfo{
      width: 1rem;
      height: 1rem;
      margin-right: .2rem;
      display: inline-block;
      position: relative;
      .imgUrl{
        border-radius: 1rem;
        height: 1rem;
        width: 1rem;
        overflow: hidden;
      }
      .bg{
        background: #89262a;
        color: #fff;
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        text-align: center;
        border-radius: 4rem;
        font-size: .18rem;
      }
    } 
    .frBtn{
      float: right;
    } 
  }
  .groupBtn{
    height: .5rem;
    line-height: .5rem;
    min-height: .5rem;
    padding: 0 .1rem;
    font-size: .26rem;
    min-width: 1.2rem;
    float: right;
    margin-left: .2rem;
    border-radius: 5px;
    border: 1px solid #89262a;
    color: #89262a;
  }   

</style>
