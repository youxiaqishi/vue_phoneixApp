<template>
  <div class="orderInfo">
    <div class="info_top">
      订单号：{{infoData.orderNo}}
      <span :class="{'red': orderStatus == '待付款'}">{{orderStatus}}</span>
    </div>
    <!-- <div class="wuliuIcon">您的订单已进入佛山市</div> -->
    <div class="Info_center">
      <dl class="infoData" v-for="(item1,index) in infoData.orderCommodityInfoDTOS">
        <dt v-on:click="onItemClick(infoData)" class="infoImg">
          <img v-bind:src="item1.url"/>
          <span class="putDown" v-if="item1.putaway == 'DOWN'"></span>
        </dt>
        <dd v-on:click="onItemClick(infoData)">
          <h3>
            <i class="activity" v-if="item1.activityInfoDTO.type == 'SECKILL'">秒杀</i>
            <i class="activity" v-if="item1.activityInfoDTO.type == 'FLASH_SALE'">限时购</i>
            <i class="activity" v-if="item1.activityInfoDTO.type == 'OPENGROUP' || item1.activityInfoDTO.type == 'JOINGROUP'">拼团</i>
            <i class="activity" v-if="item1.activityInfoDTO.type == 'PRESELL'">预售</i>
            <i class="activity" v-if="item1.activityInfoDTO.type == 'BUY_PRESENT'">买赠</i>
            <i class="activity" v-if="item1.activityInfoDTO.type == 'GROUPBUY'">团购</i>
            <i class="activity" v-if="item1.activityInfoDTO.type == 'SPECIALOFFER'">特价</i>
            {{item1.commodityName | maxLength(25)}}<br /></h3>
            <div class="price">
              <p class="owner" v-if="(item1.activityInfoDTO.type == 'COMMON' || item1.activityInfoDTO.type == 'BUY_PRESENT' || item1.activityInfoDTO.type == 'SPECIAL' || item1.activityInfoDTO.type == 'GIVE' || item1.activityInfoDTO.type == 'DISCOUNT') && (appUserType == 'notLogin' || appUserType == 'OWNER' || appUserType == 'STAFF')">业主价：<span>￥{{item1.privilegePrice | twoDecimal}}</span> </p>
              <p class="owner" v-if="item1.activityInfoDTO.type == 'SECKILL'">秒杀价：<span>￥{{item1.activityInfoDTO.activityPrice | twoDecimal}}</span> </p>
              <p class="owner" v-if="item1.activityInfoDTO.type == 'FLASH_SALE'">限时价：<span>￥{{item1.activityInfoDTO.activityPrice | twoDecimal}}</span> </p>
              <p class="owner" v-if="item1.activityInfoDTO.type == 'OPENGROUP' || item1.activityInfoDTO.type == 'JOINGROUP'">拼团价：<span>￥{{item1.activityInfoDTO.activityPrice | twoDecimal}}</span> </p>
              <p class="owner" v-if="item1.activityInfoDTO.type == 'PRESELL'">预售价：<span>￥{{item1.activityInfoDTO.activityPrice | twoDecimal}}</span> </p>
              <p class="owner" v-if="item1.activityInfoDTO.type == 'GROUPBUY'">团购价：<span>￥{{item1.activityInfoDTO.activityPrice | twoDecimal}}</span> </p>
              <p class="owner" v-if="item1.activityInfoDTO.type == 'SPECIALOFFER'">特价：<span>￥{{item1.activityInfoDTO.activityPrice | twoDecimal}}</span> </p>
              <p class="selling" v-if="(item1.activityInfoDTO.type == 'COMMON' || item1.activityInfoDTO.type == 'BUY_PRESENT' || item1.activityInfoDTO.type == 'SPECIAL' || item1.activityInfoDTO.type == 'GIVE' || item1.activityInfoDTO.type == 'DISCOUNT') && (appUserType == 'notLogin' || appUserType == 'GENERAL')"">优选价：<span>￥{{item1.originPrice | twoDecimal}}</span></p>
            </div>
          <div class="nums">x {{item1.count}}</div>
        </dd>
        <div v-if="item1.activityInfoDTO.type == 'BUY_PRESENT'">
          <div class="buyGifts" v-for="gift in item1.giftDTO.giveGoodsDTOS">
            <router-link :to="'/goodsDetail/' + gift.goodsId" tag="div" class="buyGiftsLink">
            <span class="buyGiftsLeft">赠品: <span> 这是赠品赠品赠品 × 1</span></span>
            <i class="icon-arrow-right"></i>
            </router-link>
          </div>
        </div>
        <!-- <button v-if="infoData.orderStatusForApp == 'REFUNDMONEY'" v-on:click="refundSalesDetail(item1,1)" class="button button-small button-gray">退款详情</button> -->
        <div v-if="item1.cartCommodityDiscountMoneyDTO">
          <div class="cartCommodityDis">
            <span class="des">满减专场购满{{item1.cartCommodityDiscountMoneyDTO.startMoney}}元立减{{item1.cartCommodityDiscountMoneyDTO.discountMoney}}元</span>
          </div>
        </div>
        <div v-if="item1.cartCommodityDiscountGoodsDTO">
          <div class="cartCommodityDis">
            <span class="commodity" v-if="item1.cartCommodityDiscountGoodsDTO.fillGiveType=='ONE'">任选一款赠品:</span>
            <span class="commodity" v-if="item1.cartCommodityDiscountGoodsDTO.fillGiveType=='ALL'">赠品:</span> 
            <ul class="imagesList" v-on:click="fullGiveClick(item1.cartCommodityDiscountGoodsDTO)">
              <li v-for="item in item1.cartCommodityDiscountGoodsDTO.discountGoodsList" v-if="!item1.cartCommodityDiscountGoodsDTO.isChoosed">
                <img v-bind:src="infoData.imgUrl"/> × {{infoData.giveNumber}}
              </li>
              <li v-for="item in item1.cartCommodityDiscountGoodsDTO.discountGoodsList" v-if="item1.cartCommodityDiscountGoodsDTO.isChoosed">
                <img v-bind:src="infoData.imgUrl"/> * {{infoData.giveNumber}}
              </li>
            </ul>
          </div>
        </div>
      </dl>
    </div>
    <div class="Info_bottom">
      <p class="allPrice">实付: <span>￥{{infoData.realPrice | twoDecimal}}</span>  </p>
      <div class="btns">
        <button class="button button-small button-gray" v-if="infoData.orderStatusForApp == 'OBLIGATION'" v-on:click="cancelOrder(infoData)">取消订单</button>
        <button class="button button-small button-red" v-if="infoData.orderStatusForApp == 'OBLIGATION' && isPutaway == 'UP'" v-on:click="payNow(infoData)">立即付款</button>

        <!-- <button v-if="infoData.orderStatusForApp == 'WAITSEND'" v-on:click="refundSalesApply(infoData,0)" class="button button-small button-red">申请退款</button> -->
        <button v-if="infoData.orderStatusForApp == 'WAITCOMMENT' || infoData.orderStatusForApp == 'COMPLETED'" v-on:click="refundSalesApply(infoData,1)" class="button button-small button-gray">申请退货</button>

        <button v-if="(infoData.orderStatusForApp == 'WAITRECEIVE' || infoData.orderStatusForApp == 'WAITCOMMENT')&&infoData.logisticType=='DISTRIBUTION'" v-on:click="checkLogistics(infoData)" class="button button-small button-gray">查看物流</button>
        <button v-if="infoData.orderStatusForApp == 'WAITRECEIVE'" v-on:click="receive(infoData)" class="button button-small button-gray">确认收货</button>

        <button v-if="infoData.orderStatusForApp == 'REFUNDGOODS'" v-on:click="refundSalesDetail(infoData,0)" class="button button-small button-gray">退货详情</button>

        <button v-if="infoData.orderStatusForApp == 'COMPLETED'" v-on:click="payAgain(infoData)" class="button button-small button-red">再次购买</button>
        <button v-if="infoData.orderStatusForApp == 'WAITCOMMENT'" class="button button-small button-red" v-on:click="evaluate(infoData)">评价晒单</button>
      </div>          
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
const orderStatusDict = {
  OBLIGATION: '待付款',
  WAITRECEIVE: '待收货',
  WAITCOMMENT: '待评价',
  WAITSEND: '待发货',
  REFUNDMONEY: '退款中',
  REFUNDGOODS: '退货中',
  CANCEL: '已取消',
  REFUNDFINISH: '退款完成',
  COMPLETED: '已评价',
  REFUNDREJECT: '驳回',
  ACTIVITYING: '待成团',
  PRESELLING: '预售中'
}
export default {
  props: [
    'infoData',
    'tabIndex'
  ],
  data () {
    return {
      appUserType: '', // 用户标识
      isPutaway: 'UP' // 是否下架
    }
  },
  computed: {
    orderStatus () {
      return orderStatusDict[this.infoData.orderStatusForApp]
    }
  },
  created () {
    window.$getLocalstorage('userInfo') ? this.appUserType = window.$getLocalstorage('userInfo').appUserType : this.appUserType = 'notLogin' // 身份标识
    this.isPutaway = 'UP'
    this.infoData.orderCommodityInfoDTOS.forEach((item) => {
      if (item.putaway === 'DOWN') this.isPutaway = 'DOWN'
    })
  },
  mounted () {
  },
  methods: {
    onItemClick: function (info) { // 订单详情
      this.$router.push({path: '/orderDetails/' + this.tabIndex + '/' + info.orderId + '/' + info.orderType})
    },
    payNow: _.debounce(function (info) { // 立即支付
      this.$router.push({path: '/payment/' + info.realPrice + '/' + info.orderId + '/' + info.orderNo})
    }, 500, {
      'leading': true,
      'trailing': false
    }),
    evaluate: _.debounce(function (info) { // 评价
      this.$router.push({path: '/evaluate/' + this.tabIndex + '/' + info.orderId + '/' + info.orderType})
    }, 500, {
      'leading': true,
      'trailing': false
    }),
    checkLogistics: _.debounce(function (info) { // 查看物流
      this.$router.push({ path: '/logistics/' + info.orderId + '/' + info.logisticOwner })
    }, 500, {
      'leading': true,
      'trailing': false
    }),
    payAgain: _.debounce(function (info) { // 再次购买
      var that = this
      var paramsArray = []
      info.orderCommodityInfoDTOS.forEach(function (item) {
        var params = {
          'skuId': item.commodityId, // 商品ID
          'shopId': item.shopId, // 商品对应门店ID
          'offset': 1 // offset
        }
        paramsArray.push(params)
      })
      that.$loading.open()
      that.$axios.post('/cart/commodity/addList', paramsArray).then((res) => {
        if (res) {
          that.$router.push('/home/shopCart/1')
        }
      })
    }, 500, {
      'leading': true,
      'trailing': false
    }),
    refundSalesApply: _.debounce(function (info, type) { // 申请退款退货
      window.localStorage.setItem('orderData', JSON.stringify(info))
      if (type === 0) { // 退款
        this.$router.push({path: '/refundSalesApply/0'})
      } else { // 退货
        this.$router.push({path: '/refundSalesApply/1'})
      }
    }, 500, {
      'leading': true,
      'trailing': false
    }),
    refundSalesDetail: _.debounce(function (info, type) { // 退货退款详情
      if (type === 1) { // 退货
        this.$router.push({name: 'refundSalesDetail',
          params: {
            refundOrderId: info.refundOrderId,
            type: 0
          }
        })
      } else { // 退款
        this.$router.push({name: 'refundSalesDetail',
          params: {
            refundOrderId: info.refundOrderId,
            type: 1
          }
        })
      }
    }, 500, {
      'leading': true,
      'trailing': false
    }),
    cancelOrder: _.debounce(function (info) { // 取消订单
      let that = this
      that.showConfirm('取消订单', '取消此订单？', function () {
        that.$loading.open()
        that.$axios.get('/order/app/cancelOrder/' + info.orderId + '/' + info.orderType).then((res) => {
          if (res) {
            that.$loading.close()
            that.$toast({message: '取消成功', duration: 2000})
            that.$emit('getData', 1) // 刷新
          }
        })
      })
    }, 500, {
      'leading': true,
      'trailing': false
    }),
    receive: _.debounce(function (info) { // 确认收货
      var that = this
      that.showConfirm('收货', '是否确认收货？', function () {
        that.$loading.open()
        that.$axios.get('/order/app/confirmReceive/' + info.orderId).then((res) => {
          if (res) {
            that.$loading.close()
            that.$toast({message: '收货成功', duration: 2000})
            that.$emit('getData', 1) // 刷新
            // that.onTabClick(that.tabIndex)
          }
        })
      })
    }, 500, {
      'leading': true,
      'trailing': false
    }),
    showConfirm (title, cont, callback) {
      this.$messageBox.confirm(cont, title, {closeOnClickModal: false}).then(function () {
        callback()
      }, function () {

      })
    }
  }
}
</script>
<style lang="less" scoped>
.orderInfo{
  /*margin: .2rem 0;*/
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  background: #fff;
  color: #323333;
  /*padding: 0 .3rem .1rem .3rem;*/
  overflow: hidden;
  position: relative;
  width: 100%;
  p{
    margin:0;
    padding:0;
  }
  .info_top{
    height: .6rem;
    line-height: .6rem;
    font-size: .28rem;
    clear: both;
    padding: 0 .3rem .1rem .3rem;
    span{
      float: right;
      color: #929999;
    }
    span.red{
      color: #89262a;
    }
  }
  .Info_center{
    overflow: hidden;
    /*padding:.2rem 0;*/
    .infoData{
      padding: .2rem 0;
      border-top: 1px solid #eee;
    }
    .infoImg{
      margin: 0 .3rem .1rem .3rem;
    }
    h3{
      line-height: .4rem;
      i{
        margin-right: .1rem;
      }
    }
    .buyGifts{
      background-color: #faf4f4;
      float: left;
      display: inline-block;
      height: .8rem;
      width: 100%;
      line-height: .8rem;
      font-size: .24rem;
      color: #666;
      .buyGiftsLink{
        width: 100%;
        height: .8rem;
        .buyGiftsLeft{
          float: left;
          padding-left: .3rem;
        }
        .icon-arrow-right{
          width: .3rem;
          height: .8rem;
          float: right;
          margin-right: .2rem;
        }
      }
    }
  }
  .Info_bottom{
    border-top:1px solid #eee;
    height: .75rem;
    padding: 0.1rem 0.25rem;
    clear: both;
    .allPrice{
      float: left;
      line-height: .55rem;
      span{
        font-size: .28rem;
        font-weight: bold;
      }
    }
    .btns{
      float: right;
      .button.button-small{
        float: right;
        margin-left: .2rem;
      }
    }
  }
}
</style>
