<template>
<div class="page has-navbar" v-if="cartData.appUserType">
  <m-header>
    <span slot="left"></span>
    <span slot="title">订单确认</span>
  </m-header>
  <div class="page-content" :class="{'bottom':cartData.childOrderConfirmDTOS[0].deliveryType == 1 && !addressDefault.usable}">
    <!-- <mr-scroll-keeper> -->
    <mr-better-scroll @scroll="scrolling" :listenScroll="true">
    <p class="warnTime">请在{{cartData.time}}分钟内完成支付，过时系统会自动取消您的订单</p>
    <div class="shopInfo marginTop0" v-for="shop in cartData.childOrderConfirmDTOS">
      <h2>{{shop.shopName}}</h2>
      <div class="deliveryType" v-if="showDelivery">
        配送方式
        <p>
          <span :class="{'span1':shop.deliveryType == 1}" v-on:click="changeType(shop,1)">配送</span>
          <span :class="{'span1':shop.deliveryType == 2}" v-on:click="changeType(shop,2)">自提</span>
        </p>
      </div>
      <div class="address">
        <div v-if="shop.deliveryType == 1 && addressDefault.id" v-on:click="changeAddress()">
          <h3>
            {{addressDefault.name}}<span>{{addressDefault.phone}}</span>
          </h3>
          <div class="addressInfo">
            <span class="spanType">配送</span>
            <p style="width: 4rem;">{{addressDefault.province}}{{addressDefault.city}}{{addressDefault.county}}{{addressDefault.address}}</p>
            <p class="gray" v-if="addressDefault.isDefault==1" style="width: 1.2rem;float: right;margin-top: 0;">默认地址</p>
          </div>            
        </div>
        <div v-if="shop.deliveryType == 1 && !addressDefault.id" v-on:click="changeAddress()">
          <h2 style="text-align:center;border-bottom: none;" class="icon ion-plus">
            新增收货地址
          </h2>
        </div>
        <div v-if="shop.deliveryType == 2">
          <div class="addressInfo">
            <span class="spanType">自提</span>
            <p>{{shop.address}}</p>
            <p class="gray">运营时间:{{shop.serviceTime}}</p>
          </div>  
        </div>
      </div>
      <p class="warnTime" style="margin-left: .2rem;margin-top: .2rem;" v-if="showDelivery">营业时间: 09:00 - 20:00</p>
      <p class="warnTime" style="margin-left: .2rem;margin-top: .2rem;" v-if="!showDelivery">偏远地区暂不支持配送</p>
      <div class="commodity">
        <dl class="infoData" v-for="shop1 in shop.commodityConfirmDTOS">
          <dt><img v-bind:src="shop1.url"/></dt>
          <dd>
            <h3 style="width:80%;">{{shop1.commodityName}}
              <i class="activity" v-if="shop1.cartCommodityDiscountMoneyDTO">满减</i>
              <i class="activity" v-if="shop1.cartCommodityDiscountGoodsDTO">满赠</i>
              <br />
            </h3>
            <div class="price">
              <p class="owner" v-if="shop1.activityInfoDTO.type == 'SECKILL'">秒杀价：<span>￥{{shop1.activityInfoDTO.activityInfo.seckillPrice | twoDecimal}}</span> </p>
              <p class="owner" v-if="shop1.activityInfoDTO.type == 'FLASH_SALE'">限时价：<span>￥{{shop1.activityInfoDTO.activityInfo.limitPrice | twoDecimal}}</span> </p>
              <p class="owner" v-if="shop1.activityInfoDTO.type == 'GROUP'">拼团价：<span>￥{{shop1.activityInfoDTO.activityInfo.regimentsPrice | twoDecimal}}</span> </p>
              <p class="owner" v-if="shop1.activityInfoDTO.type == 'PRESELL'">预售价：<span>￥{{shop1.activityInfoDTO.activityInfo.list[0].price | twoDecimal}}</span> </p>
              <p class="owner" v-if="shop1.activityInfoDTO.type == 'GROUPBUY'">团购价：<span>￥{{shop1.activityInfoDTO.activityPrice | twoDecimal}}</span> </p>
              <p class="owner" v-if="shop1.activityInfoDTO.type == 'SPECIALOFFER'">特价：<span>￥{{shop1.activityInfoDTO.activityPrice | twoDecimal}}</span> </p>
              <p class="owner" v-if="(shop1.activityInfoDTO.type == 'COMMON' || shop1.activityInfoDTO.type == 'BUY_PRESENT' || shop1.activityInfoDTO.type == 'SPECIAL' || shop1.activityInfoDTO.type == 'GIVE' || shop1.activityInfoDTO.type == 'DISCOUNT') && (appUserType == 'notLogin' || appUserType == 'OWNER' || appUserType == 'STAFF')">业主价：<span>￥{{shop1.privilegePrice | twoDecimal}}</span> </p>
              <p class="selling" :class="{sellingAdd: (shop1.activityInfoDTO.type == 'COMMON' || shop1.activityInfoDTO.type == 'BUY_PRESENT' || shop1.activityInfoDTO.type == 'SPECIAL' || shop1.activityInfoDTO.type == 'GIVE' || shop1.activityInfoDTO.type == 'DISCOUNT') && (appUserType == 'notLogin' || appUserType == 'GENERAL')}" v-if="(shop1.activityInfoDTO.type == 'COMMON' || shop1.activityInfoDTO.type == 'BUY_PRESENT' || shop1.activityInfoDTO.type == 'SPECIAL' || shop1.activityInfoDTO.type == 'GIVE' || shop1.activityInfoDTO.type == 'DISCOUNT') && (appUserType == 'notLogin' || appUserType == 'GENERAL')">优选价：<span>￥{{shop1.originPrice | twoDecimal}}</span></p>
            </div>
            <!-- <div class="nums">x {{shop1.count}}</div> -->
          </dd>
          <div v-if="shop1.activityInfoDTO.type == 'BUY_PRESENT'">
            <div class="cartCommodityDis">
              <span class="commodity" v-if="shop1.activityInfoDTO.activityInfo.giftList[0].type=='ONE'">
                <span v-if="!showBuyGitfsList">任选一款赠品:</span>
                <span v-if="showBuyGitfsList">已选赠品:</span>
              </span>
              <span class="commodity" v-if="shop1.activityInfoDTO.activityInfo.giftList[0].type=='ALL'">赠品:</span> 
              <ul class="imagesList" v-if="!showBuyGitfsList">
                <li v-for="item in shop1.activityInfoDTO.activityInfo.giftList">
                  <img v-bind:src="item.getAppSkuInfoDTO.defaultUrl"/> × 1
                </li>
              </ul>
              <ul class="imagesList" v-if="showBuyGitfsList">
                <li>
                  <img v-bind:src="buyGifts.getAppSkuInfoDTO.defaultUrl"/> × 1
                </li>
              </ul> 
              <button class="button button-small button-red choose" v-if="shop1.activityInfoDTO.activityInfo.giftList[0].type=='ONE'" v-on:click="buyGiftsClick(shop1.activityInfoDTO.activityInfo.giftList)">
                <span v-if="!showBuyGitfsList">选择</span>
                <span v-if="showBuyGitfsList">更改</span>
              </button>
            </div>
          </div>
          <div v-if="shop1.cartCommodityDiscountMoneyDTO">
            <div class="cartCommodityDis">
              <span class="des">满减专场购满{{shop1.cartCommodityDiscountMoneyDTO.startMoney}}元立减{{shop1.cartCommodityDiscountMoneyDTO.discountMoney}}元</span>
            </div>
          </div>
          <div v-if="shop1.cartCommodityDiscountGoodsDTO">
            <div class="cartCommodityDis">
              <span class="commodity" v-if="shop1.cartCommodityDiscountGoodsDTO.fillGiveType=='ONE'">
                <span v-if="!showGiveList">任选一款赠品:</span>
                <span v-if="showGiveList">已选赠品:</span>
              </span>
              <span class="commodity" v-if="shop1.cartCommodityDiscountGoodsDTO.fillGiveType=='ALL'">赠品:</span> 
              <ul class="imagesList" v-if="!showGiveList">
                <li v-for="item in shop1.cartCommodityDiscountGoodsDTO.discountGoodsList">
                  <img v-bind:src="item.imgUrl"/> × {{item.giveNumber}}
                </li>
              </ul>
              <ul class="imagesList" v-if="showGiveList">
                <li>
                  <img v-bind:src="fullGive.imgUrl"/> × {{fullGive.giveNumber}}
                </li>
              </ul> 
              <button class="button button-small button-red choose" v-if="shop1.cartCommodityDiscountGoodsDTO.fillGiveType=='ONE'" v-on:click="fullGiveClick(shop1.cartCommodityDiscountGoodsDTO)">
                <span v-if="!showGiveList">选择</span>
                <span v-if="showGiveList">更改</span>
              </button>
            </div>
          </div>
          <!-- <div class="buy-num">
            <span class="reduce" v-on:click="minus(shop1)"><i class="icon-minus"></i></span>
            <span>
              <input type="number" class="goodsNum" v-model="shop1.count" v-on:blur='doneInput(shop1)'/>
            </span>
            <span class="add" v-on:click="plus(shop1)"><i class="icon-add"></i></span>
          </div> -->
        </dl>
      </div>
      <div class="coupon" v-on:click="gotoUseCoupon(0)">
        <span v-if="choosePlatformCouponData.length==0">选择平台优惠券</span>
        <span v-if="choosePlatformCouponData.length>0">已选{{choosePlatformCouponData.length}}张平台优惠券</span>
        <i class="icon-arrow-right"></i>
      </div>
      <div class="coupon" v-on:click="gotoUseCoupon(1)">
        <span v-if="chooseShopCouponData.length==0">选择商铺优惠券</span>
        <span v-if="chooseShopCouponData.length>0">已选{{chooseShopCouponData.length}}张商铺优惠券</span>
        <i class="icon-arrow-right"></i>
      </div>
      <div class="invoice" v-on:click="changeInvoice">
        发票信息 
        <p>
          <span v-if="invoiceUseData.type=='NULL'">不开发票</span>
          <span v-if="invoiceUseData.type=='MINE'">个人发票</span>
          <span v-if="invoiceUseData.type=='COMPANY'">公司发票</span>
          <i class="icon-arrow-right"></i>
        </p>
      </div>
      <div class="message">
        <span class="lable">买家留言：</span>
        <textarea ref="inputText"
          class="inoutStyle1"
          type="text"
          v-model="shop.message"
          :maxlength="50"
          placeholder="选填，对本次交易的说明"></textarea>
      </div>
    </div>
    <div class="prices">
      <div class="list-ios">
        <div class="list-item">
          商品金额 <span class="item-note">￥{{cartData.commodityPrice | twoDecimal}}</span> 
        </div>
        <div class="list-item">
          优惠金额 <span class="item-note">-￥{{(cartData.discountPrice + showDiscountMoney).toFixed(2)}}</span> 
        </div>
        <div class="list-item">
          会员折扣 <span class="item-note">-￥0.00</span>  
        </div>
        <div class="list-item">
          配送费用 <span class="item-note gray" v-if="showDelivery">￥{{cartData.freightPrice | twoDecimal}}</span>
          <span class="item-note gray" v-if="!showDelivery">￥0.00</span> 
        </div> 
      </div>
    </div>
    </mr-better-scroll>
    <!-- </mr-scroll-keeper> -->
  </div>
  <div class="pay-box" v-if="showDelivery">
    <p class="noSupport" v-if="cartData.childOrderConfirmDTOS[0].deliveryType == 1 &&  addressDefault.id && !addressDefault.usable">所选地址暂不支持配送</p>
    <p class="noSupport" v-if="cartData.childOrderConfirmDTOS[0].deliveryType == 1 && !addressDefault.id">请新增地址</p>
    实付：
    <span class="color1" v-if="(cartData.realPrice-cartData.freightPrice-showDiscountMoney).toFixed(2)>0">￥{{(cartData.realPrice-showDiscountMoney).toFixed(2)}}</span>
    <span class="color1" v-if="(cartData.realPrice-cartData.freightPrice-showDiscountMoney).toFixed(2)<=0">￥{{cartData.freightPrice | twoDecimal}}</span>
    <span class="btn cart-pay" v-if="addressDefault.usable || cartData.childOrderConfirmDTOS[0].deliveryType == 2" v-on:click="payment()">去支付</span>
    <span class="btn cart-pay no-pay" v-if="cartData.childOrderConfirmDTOS[0].deliveryType == 1 && !addressDefault.usable">去支付</span>
  </div>
  <div class="pay-box" v-if="!showDelivery">
    <p class="noSupport" v-if="!addressDefault.usable">所选地址暂不支持配送</p>
    实付：
    <span class="color1" v-if="(cartData.realPrice-cartData.freightPrice-showDiscountMoney).toFixed(2)>0">￥{{(cartData.realPrice-cartData.freightPrice-showDiscountMoney).toFixed(2)}}</span>
    <span class="color1" v-if="(cartData.realPrice-cartData.freightPrice-showDiscountMoney).toFixed(2)<=0">￥0</span>
    <span class="btn cart-pay" v-if="addressDefault.usable" v-on:click="payment()">去支付</span>
    <span class="btn cart-pay no-pay" v-if="!addressDefault.usable">去支付</span>
  </div>
  <div class="modalBG" v-if="showGive" v-on:click="showGive=false">
    <div class="modalDiv">
      <h1>选择赠品</h1>
      <dl class="infoData" v-for="(good,index) in fullGiveList">
        <dt><img v-bind:src="good.imgUrl"/><span class="sellOut" v-if="good.goodsStatus==0||good.goodsStatus==2"></span></dt>
        <dd>
          <h3>{{good.name}}</h3>
          <div class="nums">x {{good.giveNumber}}</div>
        </dd>
        <button class="button button-small button-red choose" v-if="!good.isChoosed&&good.goodsStatus==1" v-on:click="doneFullGive(good,index)">选择</button>
        <button class="button button-small button-red choose" v-if="good.isChoosed&&good.goodsStatus==1" v-on:click="cancleFullGive(good,index)">已选择</button>
      </dl>
    </div>
  </div>
  <div class="modalBG" v-if="showbuyGifts" v-on:click="showbuyGifts=false">
    <div class="modalDiv">
      <h1>选择赠品</h1>
      <dl class="infoData" v-for="(good,index) in buyGiftsList">
        <dt><img v-bind:src="good.getAppSkuInfoDTO.defaultUrl"/>
          <span class="sellOut" v-if="good.stock == 0"></span>
        </dt>
        <dd>
          <h3>{{good.getAppSkuInfoDTO.name}}</h3>
          <div class="nums">x 1</div>
        </dd>
        <button class="button button-small button-red choose" v-if="!good.isChoosed && good.stock > 0" v-on:click="doneBuyGifts(good,index)">选择</button>
        <button class="button button-small button-red choose" v-if="good.isChoosed && good.stock > 0" v-on:click="cancleBuyGifts(good,index)">已选择</button>
      </dl>
    </div>
  </div>
</div>
</template>
<script>
import _ from 'lodash'
var addressDefault = {}
var invoiceUseData = {'id': 'NULL', 'type': 'NULL'}
export default{
  data () {
    return {
      invoiceData: {}, // 发票信息
      cartData: {}, // 订单数据
      oldValue: '',
      appUserType: '', // 用户标识
      addressDefault: {},
      invoiceUseData: {'id': 'NULL', 'type': 'NULL'},
      platformCouponData: [], // 所有平台优惠券
      shopCouponData: [], // 所有商铺优惠券
      choosePlatformCouponData: [], // 选择的平台优惠券
      chooseShopCouponData: [], // 选择的商铺优惠券
      platformCouponIds: [], // 选择的平台优惠券Id
      shopCouponIds: [], // 选择的商铺优惠券Id
      fullGiveList: [], // 可选赠品数据
      fullGive: {}, // 选中赠品数据
      showGive: false, // 选择赠品框显隐
      buyGiftsList: [], // 可选买赠数据
      buyGifts: {}, // 选中买赠数据
      showbuyGifts: false, // 买赠框显隐
      showDelivery: true, // 配送or自提显隐
      showGiveList: false, //
      showBuyGitfsList: false, // 买赠
      showRealMoney: 0, // 实付金额
      showDiscountMoney: 0 // 折扣金额
    }
  },
  activated () {
    this.getData()
  },
  computed: {
    scroll () {
      return this.$refs.scroll
    }
  },
  methods: {
    scrolling () {
      // console.log(this.$refs)
      this.$refs.inputText[0].blur()
    },
    minus (good) {
      if (good.count > 1) {
        good.count--
        // 计算价格
      }
    },
    plus (good) {
      good.count++
      // 数量限制及计算价格
    },
    doneInput (good) {
      if (good.count.length === 1) {
        good.count = good.count.replace(/[^1-9]/g, '')
      } else {
        good.count = good.count.replace(/\D/g, '')
      }
      if (!good.count || good.count < 0) {
        this.$toast({message: '请输入购买数量', duration: 800})
        good.count = 1
      }
      // 数量限制及价格校验
    },
    getData () {
      var that = this
      window.$getLocalstorage('userInfo') ? this.appUserType = window.$getLocalstorage('userInfo').appUserType : this.appUserType = 'notLogin' // 身份标识
      if (that.getLocalstorage('shopData').admin === 'yes') that.showDelivery = false
      window.eventBus.$on('address', function (res) { addressDefault = res }) // 获取选择地址
      that.addressDefault = addressDefault
      window.eventBus.$on('invoice', function (res) { invoiceUseData = res }) // 获取选择发票
      that.invoiceUseData = invoiceUseData
      that.getAddressData() // 获取默认地址

      if (that.$route.params.res) { // 订单数据
        window.localStorage.setItem('cartData', JSON.stringify(that.$route.params.res))
        that.cartData = that.$route.params.res
      } else {
        that.cartData = that.getLocalstorage('cartData')
      };
      that.oldValue = that.cartData.freightPrice // 配送费用

      console.log('platformCouponData', that.$route.params.platformCouponData)
      if (that.$route.params.platformCouponData) window.localStorage.setItem('platformCouponData', JSON.stringify(that.$route.params.platformCouponData))
      that.platformCouponData = that.getLocalstorage('platformCouponData')
      if (that.$route.params.shopCouponData) window.localStorage.setItem('shopCouponData', JSON.stringify(that.$route.params.shopCouponData))
      that.shopCouponData = that.getLocalstorage('shopCouponData') // 优惠券数据

      if (that.getLocalstorage('fullGive')) { // 选择赠品
        that.fullGive = that.getLocalstorage('fullGive')
        that.showGiveList = true
      }
      if (that.getLocalstorage('buyGifts')) { // 选择买赠
        that.buyGifts = that.getLocalstorage('buyGifts')
        that.showBuyGitfsList = true
      }

      that.setType() // 配送类型
      that.getChooseCoupon() // 选中优惠券及优惠金额
    },
    getChooseCoupon () {
      var that = this
      that.choosePlatformCouponData = []
      that.chooseShopCouponData = []
      that.platformCouponIds = []
      that.shopCouponIds = []
      that.showDiscountMoney = 0
      if (!that.getLocalstorage('removeCoupon')) {
        that.platformCouponData.forEach(function (platformItem) {
          if (platformItem.isChoosed === 1) {
            that.choosePlatformCouponData.push(platformItem)
            that.platformCouponIds.push(platformItem.id)

            var goodPrice = 0
            platformItem.shopGoodsDTO.forEach(function (item1) {
              that.cartData.childOrderConfirmDTOS[0].commodityConfirmDTOS.forEach(function (item2) {
                if (item2.commodityId === item1.goodsId) {
                  goodPrice += item2.totalPrice
                }
              })
            })
            if (goodPrice - platformItem.money > 0) {
              that.showDiscountMoney += platformItem.money
            } else {
              that.showDiscountMoney += goodPrice
            }
            // 此时一张优惠券的所有商品优惠金额计算完毕
            // ->计算每个参加优惠券商品的折扣后金额
            platformItem.shopGoodsDTO.forEach(function (item1) {
              that.cartData.childOrderConfirmDTOS[0].commodityConfirmDTOS.forEach(function (item2) {
                if (item2.commodityId === item1.goodsId) {
                  item2.totalPrice = item2.totalPrice / goodPrice * that.showDiscountMoney
                }
              })
            })
          };
        })
        that.shopCouponData.forEach(function (shopItem) {
          if (shopItem.isChoosed === 1) {
            that.chooseShopCouponData.push(shopItem)
            that.shopCouponIds.push(shopItem.id)

            var goodPrice = 0
            shopItem.shopGoodsDTO.forEach(function (item1) {
              that.cartData.childOrderConfirmDTOS[0].commodityConfirmDTOS.forEach(function (item2) {
                if (item2.commodityId === item1.goodsId) {
                  goodPrice += item2.totalPrice
                }
              })
            })
            if (goodPrice - shopItem.money > 0) {
              that.showDiscountMoney += shopItem.money
            } else {
              that.showDiscountMoney += goodPrice
            }
          };
        })
      } else {
        that.platformCouponData.forEach(function (platformItem, index) {
          if (platformItem.isChoosed === 1) {
            platformItem.isChoosed = 3
          } else {
            platformItem.isChoosed = 0
          }
        })
        that.shopCouponData.forEach(function (shopItem, index) {
          if (shopItem.isChoosed === 1) {
            shopItem.isChoosed = 3
          } else {
            shopItem.isChoosed = 0
          }
        })
      }
    },
    setType () { // 默认配送
      var that = this
      that.cartData.childOrderConfirmDTOS.forEach(function (info) {
        that.$set(info, 'deliveryType', 1)
        that.$set(info, 'message', '')
      })
    },
    changeType: _.debounce(function (info, type) { // 更改配送方式
      if (info.deliveryType !== type) {
        info.deliveryType = type
        if (type === 1) {
          this.cartData.freightPrice = this.cartData.freightPrice
          this.cartData.freightPrice = this.oldValue
          this.cartData.realPrice = parseFloat(parseFloat(this.cartData.realPrice) + this.oldValue).toFixed(2)
        } else {
          this.cartData.freightPrice = 0
          this.cartData.realPrice = parseFloat(this.cartData.realPrice - this.oldValue).toFixed(2)
        }
      }
    }, 500, {
      'leading': true,
      'trailing': false
    }),
    changeInvoice () { // 更改发票信息
      this.$router.push({path: '/invoice/' + this.invoiceUseData.type})
    },
    changeAddress: _.debounce(function () { // 更改收货地址
      this.$router.push({path: '/affirmAddress'})
    }, 500, {
      'leading': true,
      'trailing': false
    }),
    getAddressData () { // 获取默认地址
      var that = this
      that.$axios.post('/address/query/address/list/shop', {'p': 1, 'c': 100}).then((res) => {
        if (res) {
          res.list.forEach(function (item) {
            if (item.isDefault === 1 && !that.addressDefault.id) { // UNDATE:如果不存在缓存地址
              that.addressDefault = item
            }
          })
          if (res.list.length === 0) that.addressDefault = {} // UNDATE:没有地址清除缓存
        }
      })
    },
    gotoUseCoupon (num) { // 选择优惠券 0 平台 1 商铺
      var that = this
      var couponData = []
      num === 0 ? couponData = that.platformCouponData : couponData = that.shopCouponData
      that.$router.push({name: 'useCoupon',
        params: {
          'type': num,
          'couponData': couponData
        }})
    },
    buyGiftsClick: _.debounce(function (info) { // 买赠显隐
      var that = this
      if (info[0].type === 'ONE') {
        that.buyGiftsList = info
        that.showbuyGifts = true
      };
    }, 1000, {
      'leading': true,
      'trailing': false
    }),
    doneBuyGifts (good, index) { // 选择买赠商品
      this.buyGifts = good
      this.buyGiftsList.forEach(function (item) {
        item.isChoosed = false
      })
      this.buyGiftsList[index].isChoosed = true
      this.showbuyGifts = false
      this.showBuyGitfsList = true
      window.localStorage.setItem('buyGifts', JSON.stringify(this.buyGiftsList[index]))
    },
    cancleBuyGifts (good, index) { // 取消选择买赠商品
      this.buyGifts = {}
      good.isChoosed = false
      this.showbuyGifts = false
      this.showBuyGitfsList = false
      window.localStorage.removeItem('buyGifts')
    },

    fullGiveClick: _.debounce(function (info) { // 满赠显隐
      var that = this
      if (info.fillGiveType === 'ONE') {
        that.fullGiveList = info.discountGoodsList
        that.showGive = true
      };
    }, 1000, {
      'leading': true,
      'trailing': false
    }),
    doneFullGive (good, index) { // 选择满赠商品
      this.fullGive = good
      this.fullGiveList.forEach(function (item) {
        item.isChoosed = false
      })
      this.fullGiveList[index].isChoosed = true
      this.showGive = false
      this.showGiveList = true
      window.localStorage.setItem('fullGive', JSON.stringify(this.fullGiveList[index]))
    },
    cancleFullGive (good, index) { // 取消选择满赠商品
      this.fullGive = {}
      good.isChoosed = false
      this.showGive = false
      this.showGiveList = false
      window.localStorage.removeItem('fullGive')
    },
    payment: _.debounce(function () { // 去支付
      var that = this
      if (!that.addressDefault.id && that.cartData.childOrderConfirmDTOS[0].deliveryType === 1) {
        that.$toast({message: '请先选择收货地址', duration: 800})
        return
      };
      var childOrderAddDTOS = []
      that.cartData.childOrderConfirmDTOS.forEach(function (cartDataItem) {
        var cartDataParam = {
          'shopId': cartDataItem.shopId, // 商店Id
          'logisticType': '', // 物流配送方式
          'receiverAddressId': that.addressDefault.id, // 收货地址ID TODO
          'message': cartDataItem.message, // 买家留言
          'shopCouponIds': that.shopCouponIds, // 商铺优惠券
          'platformCouponIds': that.platformCouponIds, // 平台优惠券
          'childOrderCommodityDTOS': [] // 子订单
        }
        if (cartDataItem.deliveryType === 1) {
          cartDataParam.logisticType = 'DISTRIBUTION' // 配送
        } else {
          cartDataParam.logisticType = 'TAKE' // 自提
        };
        cartDataItem.commodityConfirmDTOS.forEach(function (commodityItem) {
          var commodityParam = {
            'skuId': commodityItem.commodityId, // 商品ID
            'count': commodityItem.count, // 数量
            'giftAddDTOS': [], // 赠品信息
            'activityId': '', // 活动id
            'activityType': '', // 活动类型
            'groupId': 0 // 场次id/团id
          }
          if (commodityItem.activityInfoDTO.type === 'COMMON') {
            commodityParam.activityType = 'COMMON'
          } else if (commodityItem.activityInfoDTO.type === 'SECKILL') { // 秒杀
            commodityParam.activityId = commodityItem.activityInfoDTO.activityInfo.activityId
            commodityParam.activityType = 'SECKILL'
            commodityParam.groupId = commodityItem.activityInfoDTO.activityInfo.timeId
          } else if (commodityItem.activityInfoDTO.type === 'FLASH_SALE') { // 限时购
            commodityParam.activityId = commodityItem.activityInfoDTO.activityInfo.activityId
            commodityParam.activityType = 'FLASH_SALE'
            commodityParam.groupId = commodityItem.activityInfoDTO.activityInfo.fieldId
          } else if (commodityItem.activityInfoDTO.type === 'GROUP') { // 拼团
            commodityParam.activityId = commodityItem.activityInfoDTO.activityInfo.id
            commodityParam.activityType = commodityItem.activityType
            commodityParam.groupId = commodityItem.groupId
          } else if (commodityItem.activityInfoDTO.type === 'PRESELL') { // 预售
            commodityParam.activityId = commodityItem.activityInfoDTO.activityInfo.activityPresellId
            commodityParam.activityType = commodityItem.activityType
          } else if (commodityItem.activityInfoDTO.type === 'BUY_PRESENT' || commodityItem.activityInfoDTO.type === 'GROUPBUY') { // 买赠 团购
            commodityParam.activityId = commodityItem.activityInfoDTO.activityInfo.activityId
            commodityParam.activityType = commodityItem.activityType
          } else if (commodityItem.activityInfoDTO.type === 'SPECIAL' || commodityItem.activityInfoDTO.type === 'GIVE' || commodityItem.activityInfoDTO.type === 'DISCOUNT' || commodityItem.activityInfoDTO.type === 'SPECIALOFFER') { // 专场
            commodityParam.activityId = 0
            commodityParam.activityType = commodityItem.activityType
          }
          if (commodityItem.activityInfoDTO.type === 'BUY_PRESENT') {
            if (commodityItem.activityInfoDTO.activityInfo.giftList[0].type === 'ALL') { // 全赠
              commodityItem.activityInfoDTO.activityInfo.giftList.forEach(function (goodItem) {
                var goodParam = {
                  'skuId': goodItem.skuId,
                  'count': 1
                }
                if (goodItem.stock > 0) { // 有货才能赠
                  commodityParam.giftAddDTOS.push(goodParam)
                };
              })
            } else { // 选一个
              var goodParam
              if (that.buyGifts.skuId) { // 自己选了赠品
                goodParam = {
                  'skuId': that.buyGifts.skuId,
                  'count': 1
                }
                if (that.buyGifts.stock > 0) { // 有货才能赠
                  commodityParam.giftAddDTOS.push(goodParam)
                };
              } else { // 未选择赠品默认给第一个
                goodParam = {
                  'skuId': commodityItem.activityInfoDTO.activityInfo.giftList[0].skuId,
                  'count': 1
                }
                if (commodityItem.activityInfoDTO.activityInfo.giftList[0].stock > 0) { // 有货才能赠
                  commodityParam.giftAddDTOS.push(goodParam)
                };
              };
            };
          };
          if (commodityItem.cartCommodityDiscountGoodsDTO) {
            if (commodityItem.cartCommodityDiscountGoodsDTO.fillGiveType === 'ALL') { // 全赠
              commodityItem.cartCommodityDiscountGoodsDTO.discountGoodsList.forEach(function (goodItem) {
                var goodParam = {
                  'skuId': goodItem.goodsId,
                  'count': goodItem.giveNumber
                }
                if (goodItem.goodsStatus === 1) { // 有货才能赠
                  commodityParam.giftAddDTOS.push(goodParam)
                };
              })
            } else { // 选一个
              var goodParam
              if (that.fullGive.goodsId) { // 自己选了赠品
                goodParam = {
                  'skuId': that.fullGive.goodsId,
                  'count': that.fullGive.giveNumber
                }
                if (that.fullGive.goodsStatus === 1) { // 有货才能赠
                  commodityParam.giftAddDTOS.push(goodParam)
                };
              } else { // 未选择赠品默认给第一个
                goodParam = {
                  'skuId': commodityItem.cartCommodityDiscountGoodsDTO.discountGoodsList[0].goodsId,
                  'count': commodityItem.cartCommodityDiscountGoodsDTO.discountGoodsList[0].giveNumber
                }
                if (commodityItem.cartCommodityDiscountGoodsDTO.discountGoodsList[0].goodsStatus === 1) { // 有货才能赠
                  commodityParam.giftAddDTOS.push(goodParam)
                };
              };
            };
          };
          cartDataParam.childOrderCommodityDTOS.push(commodityParam)
        })
        childOrderAddDTOS.push(cartDataParam)
      })
      var params = {
        'invoiceId': that.invoiceUseData.id, // 发票
        'childOrderAddDTOS': childOrderAddDTOS // 子单
      }
      if (params.invoiceId === 'NULL') {
        params.invoiceId = 0
      };
      that.$axios.post('/order/app/add', params).then((res) => {
        // 存一个标识
        window.localStorage.setItem('removeCoupon', JSON.stringify('removeCoupon'))
        if (res.realPrice === 0) { // 0元支付
          var zeroPayParams = {
            'orderId': res.id
          }
          that.$axios.post('/order/app/pay/owner', zeroPayParams).then((res) => {
            if (res) that.$router.push({path: '/payStatus/1/' + zeroPayParams.orderId + '/zeroPay'})
          })
        } else {
          that.$router.push({path: '/payment/' + res.realPrice + '/' + res.id + '/' + res.orderNo})
        }
      })
    }, 500, {
      'leading': true,
      'trailing': false
    })
  }
}
</script>
<style lang="less" scoped>
@import "../../../../static/css/affirmOrder.less";
.marginTop0{
  margin-top: 0!important;
}
.page-content.bottom{
  bottom: .6rem;
}
.noSupport{
  position: absolute;
  top: -0.6rem;
  left: 0;
  line-height: .6rem;
  background: #fff;
  width: 100%;
  padding: 0 .2rem;
  text-align: center;
  color: #89262a;
  font-size: .22rem;
  border-bottom: 1px solid #eee;
}
.cart-pay.no-pay{
  background: #999;
}
</style>
