<template>
  <div class="page has-navbar">
    <m-header>
      <span v-if="$route.params.type==1" slot="left"></span>
      <span slot="title">购物袋</span>
      <span v-on:click="doEdit()" v-if="isEdit" slot="right">编辑</span>
      <span v-on:click="finish()" v-if="!isEdit" slot="right">确定</span>
    </m-header>
    <div class="page-content">
      <mr-scroll-keeper>
      <mr-better-scroll ref="scroll" 
        :pullDownRefresh="true" @pullingDown="pullingDown">
      <div v-if="delayShow && data && data.length == 0">
        <div class="no-bags">去添加点什么
          <button v-on:click="gotoIndex()" class="button button-red button-small goIndex">去逛逛
          </button>
        </div>
      </div>
      <div class="shopList" v-if="delayShow && data && data.length >= 1">
        <div v-for="(shop,index) in data" class="shop">
          <h3>
            <i class="selectBtn icon-check" :class="{'icon-checked': !shop.choose}" v-on:click="newChooseOrCancleAll()"></i> 
            {{shop.shopName}}
          </h3>
          <div v-on:touchmove.capture="ontouchmove" class="allCartData">
            <mt-cell-swipe v-for="(goods,index) in shop.cartCommodityDTOS" :key="goods.id" class="savedataBox" :right="goods.rightButton">
              <div class="goods">
                <i class="selectBtn icon-check" :class="{'icon-checked': !goods.choose}" v-on:click="chooseOrCancleGood(goods)"></i> 
                <dl @click="gotoGoodsDetail(goods.commodityId)" class="services">
                  <dt>
                    <mr-img :url="goods.imgUrl"></mr-img>
                    <span class="sellOut" v-if="goods.goodsStatus == 'LOWSTOCKS'"></span>
                    <span class="putDown" v-if="goods.putaway == 'DOWN'"></span>
                  </dt>
                  <dd>
                    <h4 class="goodsName">
                      <i class="activity" v-if="goods.cartCommodityDiscountMoneyDTO">满减</i>
                      <i class="activity" v-if="goods.activityInfoDTO.type == 'GIVE'">满赠</i>
                      <i class="activity" v-if="goods.activityInfoDTO.type == 'FLASH_SALE'">限时购</i>
                      <i class="activity" v-if="goods.activityInfoDTO.type == 'SECKILL'">秒杀</i>
                      <i class="activity" v-if="goods.activityInfoDTO.type == 'BUY_PRESENT'">买赠</i>
                      <i class="activity" v-if="goods.activityInfoDTO.type == 'GROUPBUY'">团购</i>
                      <i class="activity" v-if="goods.activityInfoDTO.type == 'PRESELL'">预售</i>
                      <i class="activity" v-if="goods.activityInfoDTO.type == 'SPECIALOFFER'">特价</i>
                      {{goods.commodityName | maxLength(24)}}
                    </h4>
                    <div class="price">
                      <p class="owner" v-if="(goods.activityInfoDTO.type == 'COMMON' || goods.activityInfoDTO.type == 'GROUP' || goods.activityInfoDTO.type == 'BUY_PRESENT' || goods.activityInfoDTO.type == 'SPECIAL') && ( appUserType == 'notLogin' || appUserType == 'OWNER' || appUserType == 'STAFF')">
                        <span>业主价 </span>￥{{goods.ownerPrice | twoDecimal}}
                      </p>
                      <p class="owner" v-if="goods.activityInfoDTO.type == 'FLASH_SALE'"><span>限时价 </span>￥{{goods.activityInfoDTO.activityInfo.limitPrice | twoDecimal}}</p>
                      <p class="owner" v-if="goods.activityInfoDTO.type == 'SECKILL'"><span>秒杀价 </span>￥{{goods.activityInfoDTO.activityInfo.seckillPrice | twoDecimal}}</p>
                      <p class="owner" v-if="goods.activityInfoDTO.type == 'PRESELL'"><span>预售价 </span>￥{{goods.activityInfoDTO.activityPrice | twoDecimal}}</p>
                      <p class="owner" v-if="goods.activityInfoDTO.type == 'GROUPBUY'"><span>团购价 </span>￥{{goods.activityInfoDTO.activityPrice | twoDecimal}}</p>
                      <p class="owner" v-if="goods.activityInfoDTO.type == 'SPECIALOFFER'"><span>特价 </span>￥{{goods.activityInfoDTO.activityPrice | twoDecimal}}</p>
                      <p class="selling" :class="{sellingAdd: (goods.activityInfoDTO.type == 'COMMON' || goods.activityInfoDTO.type == 'GROUP' || goods.activityInfoDTO.type == 'BUY_PRESENT' || goods.activityInfoDTO.type == 'SPECIAL') && appUserType == 'GENERAL'}" v-if="(goods.activityInfoDTO.type == 'COMMON' || goods.activityInfoDTO.type == 'GROUP' || goods.activityInfoDTO.type == 'BUY_PRESENT' || goods.activityInfoDTO.type == 'SPECIAL') && (appUserType == 'notLogin' || appUserType == 'GENERAL')"><span>优选价 </span>￥{{goods.actualPrice | twoDecimal}}</p>
                    </div>
                  </dd>
                </dl>
                <div class="buy-num" v-if="goods.goodsStatus != 'LOWSTOCKS' && goods.putaway != 'DOWN'" :class="{'buy-num1': goods.cartCommodityDiscountMoneyDTO}">
                  <span class="reduce" v-on:click="minus(goods);"><i class="icon-minus"></i></span>
                  <span>
                    <input type="number" class="goodsNum" v-on:blur='doneInput(goods,shop.shopId)' v-model="goods.commodityCount"/>
                  </span>
                  <span class="add" v-on:click="plus(goods);"><i class="icon-add"></i></span>
                </div>

                <div v-if="goods.activityInfoDTO.type == 'FLASH_SALE'">
                  <timer class="shopCartStyle" :current-time="currentTime" :start-time="new Date(goods.activityInfoDTO.activityInfo.startTime.replace(/-/g, '/')).getTime()" :end-time="new Date(goods.activityInfoDTO.activityInfo.endTime.replace(/-/g, '/')).getTime()" v-on:start_callback="timerStart(3)" v-on:end_callback="timerEnd(3)" :tipText="'距离开始时间还剩'" :tipTextEnd="'距结算仅剩'" :endText="'活动已结束'" :dayTxt="'天'" :hourTxt="':'" :minutesTxt="':'" :secondsTxt="''" :secondsFixed="true"></timer>
                </div>

                <div v-if="goods.activityInfoDTO.type == 'SECKILL'">
                  <timer :current-time="currentTime" class="shopCartStyle" :start-time="new Date(goods.activityInfoDTO.activityInfo.beginTime.replace(/-/g, '/')).getTime()" :end-time="new Date(goods.activityInfoDTO.activityInfo.endTime.replace(/-/g, '/')).getTime()" v-on:start_callback="timerStart(3)" v-on:end_callback="timerEnd(3)" :tipText="'距离开始时间还剩'" :tipTextEnd="'距结算仅剩'" :endText="'活动已结束'" :dayTxt="'天'" :hourTxt="':'" :minutesTxt="':'" :secondsTxt="''" :secondsFixed="true"></timer>
                </div>

                <div v-if="goods.activityInfoDTO.type == 'BUY_PRESENT'">
                  <div class="buyGifts" v-for="gift in goods.activityInfoDTO.activityInfo.giftList">
                    <router-link :to="'/goodsDetail/' + gift.getAppSkuInfoDTO.id" tag="div">
                    <span class="buyGiftsLeft">赠品: <span>{{gift.getAppSkuInfoDTO.name}} × 1</span></span>
                    <i class="icon-arrow-right"></i>
                    </router-link>
                  </div>
                </div>

                <div v-if="goods.cartCommodityDiscountMoneyDTO" >
                  <div class="cartCommodityDis">
                    <span class="des">满减专场购满{{goods.cartCommodityDiscountMoneyDTO.startMoney}}元立减{{goods.cartCommodityDiscountMoneyDTO.discountMoney}}元</span>
                    <span class="goInfo" v-if="goods.gotoFullcut" v-on:click="gotoFullCut(goods.appSkuInfoListDTOList)">去凑单></span>
                  </div>
                </div>
                <div v-if="goods.activityInfoDTO.type == 'GIVE'">
                  <div class="cartCommodityDis" style="padding-left: .2rem;">
                    <span class="commodity" v-if="goods.cartCommodityDiscountGoodsDTO.fillGiveType=='ONE'">满{{goods.cartCommodityDiscountGoodsDTO.money}}元可选赠品:</span> 
                    <span class="commodity" v-if="goods.cartCommodityDiscountGoodsDTO.fillGiveType=='ALL'">满{{goods.cartCommodityDiscountGoodsDTO.money}}元可得赠品:</span> 
                    <ul class="imagesList">
                      <li v-for="item in goods.cartCommodityDiscountGoodsDTO.discountGoodsList">
                        <router-link :to="'/goodsDetail/' + item.goodsId" tag="dl">
                        <mr-img :url="item.imgUrl" style="width: .8rem; height: .8rem;"> </mr-img> × {{item.giveNumber}}
                        </router-link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </mt-cell-swipe>            
          </div>
        </div>
      </div>
      </mr-better-scroll>
      </mr-scroll-keeper>
    </div>
    <div class="pay-box" v-if="delayShow">
        <div class="select-all">
          <i class="selectBtn icon-check" :class="{'icon-checked': !allChoose}" v-on:click="newChooseOrCancleAll()"></i>
          <label>全选</label>
        </div>
        <div class="cart-money">
            <h4 v-if="appUserType=='GENERAL'">总价：¥{{sellingTotalPrices}}</h4>
            <h4 v-if="appUserType=='STAFF' || appUserType=='OWNER' || appUserType=='notLogin'">总价：¥{{ownerTotalPrices}}</h4>
        </div>
        <span class="btn cart-pay" v-on:click="account()" v-if="isEdit">结算({{goodsNum}})</span>
        <span class="btn cart-pay" v-on:click="removeAll()" v-if="!isEdit">删除({{goodsNum}})</span>
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
import mrImg from '../../service/mrImg.vue'
import timer from '../modal/timer.vue'
export default {
  data () {
    return {
      isEdit: true, // 编辑状态
      delayShow: false, // 延迟显示
      allChoose: false, // 全选状态
      goodsNum: 0, // 结算数量
      ownerTotalPrices: 0, // 业主总价
      sellingTotalPrices: 0, // 优选总价
      appUserType: '', // 用户标识
      currentTime: '', // 当前时间
      data: [], // 购物车数据
      newAllGoodsNum: 0 // 购物车总数
    }
  },
  components: {
    timer,
    mrImg
  },
  mounted () {
    setTimeout(() => { this.delayShow = true }, 500) // ***体验优化: 数据加载导致的闪烁***
  },
  computed: {
    scroll () {
      return this.$refs.scroll
    }
  },
  activated () {
    window.$getLocalstorage('userInfo') ? this.appUserType = window.$getLocalstorage('userInfo').appUserType : this.appUserType = 'notLogin' // 身份标识
    this.getData()
  },
  methods: {
    getData () {
      this.goodsNum = 0
      this.ownerTotalPrices = 0
      this.sellingTotalPrices = 0
      this.isEdit = true
      this.allChoose = false
      this.removeChoose = false
      this.data = []
      this.$loading.open()
      var that = this
      this.$axios.get('/sec/kill/get/now/time').then((nowTimeRes) => { // 获取当前时间
        if (nowTimeRes) that.currentTime = new Date(nowTimeRes.nowTime.replace(/-/g, '/')).getTime()
        that.$axios.get('/cart/commodity/list').then((listDataRes) => {
          if (listDataRes) {
            that.collectOrRemoveItemAndCheckFullCut(listDataRes)
            that.data = listDataRes
            that.newCheckAll()
          }
          that.$loading.close()
          that.scroll && that.scroll.forceUpdate(true)
        })
      })
    },
    newEditCancleAll () { // 进入编辑状态
      this.newAllGoodsNum = 0
      _.each(this.data, (dataItem, dataIndex) => {
        dataItem.choose = false
        _.each(dataItem.cartCommodityDTOS, (commodItem, commodIndex) => {
          // UPDATE: 进入编辑状态 下架或者无库存也要算进总数 因为可以选中删除
          commodItem.choose = false // 商品选中状态跟随店铺选中状态
          this.newAllGoodsNum += parseInt(commodItem.commodityCount)
        })
      })
      this.allChoose = false
      this.calculateTotalPrice()
    },
    newChooseOrCancleAll () { // 全选及全国店铺全选或者取消全选
      this.newAllGoodsNum = 0
      _.each(this.data, (dataItem, dataIndex) => {
        dataItem.choose = !dataItem.choose
        _.each(dataItem.cartCommodityDTOS, (commodItem, commodIndex) => {
          if (this.isEdit) { // UPDATE: 编辑完成状态 商品为下架或无库存情况 不能选中 且不加总体数量
            if (commodItem.goodsStatus === 'LOWSTOCKS' || commodItem.putaway === 'DOWN') {
              commodItem.choose = false
            } else {
              commodItem.choose = dataItem.choose // 商品选中状态跟随店铺选中状态
              this.newAllGoodsNum += parseInt(commodItem.commodityCount)
            }
          } else { // UPDATE: 编辑状态状态 商品为下架或无库存情况 可以选中 且加总体数量
            commodItem.choose = dataItem.choose // 商品选中状态跟随店铺选中状态
            this.newAllGoodsNum += parseInt(commodItem.commodityCount)
          }
        })
      })
      this.allChoose = !this.allChoose
      this.calculateTotalPrice()
    },
    newCheckAll () { // 全选所有商品 底部全选 编辑完成状态
      this.newAllGoodsNum = 0 // 所有购物车数量
      _.each(this.data, (dataItem, dataIndex) => {
        dataItem.choose = true
        _.each(dataItem.cartCommodityDTOS, (commodItem, commodIndex) => {
          // UPDATE: 如果商品为下架或无库存情况 不能选中 且不加总体数量
          if (commodItem.goodsStatus === 'LOWSTOCKS' || commodItem.putaway === 'DOWN') {
            commodItem.choose = false
          } else {
            commodItem.choose = true
            this.newAllGoodsNum += parseInt(commodItem.commodityCount)
          }
        })
      })
      this.allChoose = true
      this.calculateTotalPrice()
    },
    calculateTotalPrice () { // 计算所有被选中商品的价格
      this.ownerTotalPrices = 0
      this.sellingTotalPrices = 0
      this.goodsNum = 0
      _.each(this.data, (dataItem, dataIndex) => {
        dataItem.choose = true // 默认商铺选中
        _.each(dataItem.cartCommodityDTOS, (commodItem, commodIndex) => {
          if (commodItem.choose === true) {
            // 秒杀(TODO活动进行中状态), 限时购, 团购, 特价, 预售使用活动价格
            if (commodItem.activityInfoDTO.type === 'SECKILL' || commodItem.activityInfoDTO.type === 'FLASH_SALE' || commodItem.activityInfoDTO.type === 'GROUPBUY' || commodItem.activityInfoDTO.type === 'SPECIALOFFER' || commodItem.activityInfoDTO.type === 'PRESELL') {
              this.calculateSinglePrice(commodItem.activityInfoDTO.activityPrice, commodItem.activityInfoDTO.activityPrice, commodItem.commodityCount)
            } else { // 否则使用正常价格
              this.calculateSinglePrice(commodItem.ownerPrice, commodItem.actualPrice, commodItem.commodityCount)
            }
          } else { // 存在未选中商品 商铺为未选择状态
            dataItem.choose = false
          }
        })
      })
      // 校验选中数量和总数量是否一致
      if (this.newAllGoodsNum === this.goodsNum) {
        this.allChoose = true
      } else {
        this.allChoose = false
      }
      console.log(this.newAllGoodsNum, this.goodsNum, this.ownerTotalPrices, this.sellingTotalPrices)
    },
    calculateSinglePrice (ownerPrice, actualPrice, commodityCount) {
      this.goodsNum = this.goodsNum + parseInt(commodityCount)
      this.ownerTotalPrices = parseFloat(this.ownerTotalPrices) + parseInt(commodityCount) * parseFloat(ownerPrice)
      this.sellingTotalPrices = parseFloat(this.sellingTotalPrices) + parseInt(commodityCount) * parseFloat(actualPrice)
      this.ownerTotalPrices = parseFloat(this.ownerTotalPrices).toFixed(2)
      this.sellingTotalPrices = parseFloat(this.sellingTotalPrices).toFixed(2)
    },
    chooseOrCancleGood (good) { // 取消or选中某一个商品
      // 如果是编辑状态 下架或者库存的商品可以选择进行删除
      if (!this.isEdit) {
        good.choose = !good.choose
        this.calculateTotalPrice()
      } else { // 非编辑状态 不可选择下架或者库存的商品进行删除
        if (good.goodsStatus !== 'LOWSTOCKS' && good.putaway !== 'DOWN') {
          good.choose = !good.choose
          this.calculateTotalPrice()
        }
      }
    },
    plus (info) { // 添加数量
      info.commodityCount++
      if (this.limitCount(info) === 'limit') return // 限制数量
      this.newAllGoodsNum++ // 总数增加
      this.update(info, 1).then(() => { // 接口更新
        window.eventBus.$emit('updateCount') // 角标更新
        this.calculateTotalPrice() // 价格计算
        this.collectOrRemoveItemAndCheckFullCut(this.data)
      })
    },
    minus (info) { // 减少数量
      if (info.commodityCount > 1) {
        info.commodityCount--
        this.newAllGoodsNum-- // 总数减少
        this.update(info, -1).then(() => {
          window.eventBus.$emit('updateCount')
          this.calculateTotalPrice() // 价格计算
          this.collectOrRemoveItemAndCheckFullCut(this.data)
        })
      }
    },
    update (info, num) {
      var params = {
        'skuId': info.commodityId, // 商品ID
        'shopId': this.getLocalstorage('shopId'), // 门店ID
        'offset': num // offset
      }
      return new Promise((resolve, reject) => {
        this.$axios.post('/cart/commodity/add', params).then((res) => {
          resolve()
        })
      })
    },
    finish () { // 完成
      this.isEdit = true
      this.newCheckAll()
    },
    doEdit () { // 编辑
      this.isEdit = false
      this.newEditCancleAll()
    },
    removeAll () {
      var idList = []
      this.data.forEach(function (item) {
        item.cartCommodityDTOS.forEach(function (info) {
          if (info.choose) {
            var params = {
              'commodityId': info.commodityId,
              'shopId': item.shopId
            }
            idList.push(params)
          }
        })
      })
      if (idList.length <= 0) {
        this.$toast({message: '请选择商品！', duration: 800})
        return false
      }
      this.$axios.post('/cart/commodity/remove', idList).then((res) => {
        window.eventBus.$emit('updateCount') // 更新角标
        this.getData()
      })
    },
    collectOrRemoveItemAndCheckFullCut (listDataRes) {
      listDataRes.forEach((listItem, index) => {
        listItem.cartCommodityDTOS.forEach((commodityItem, index) => {
          if (commodityItem.isCollected === 'true') { // 移入or移出收藏
            commodityItem.rightButton = [{
              content: '移入收藏',
              style: {background: '#fd8645', color: '#fff'},
              handler: () => this.collectItem(commodityItem)
            }, {
              content: '删除',
              style: {background: '#fb3439', color: '#fff'},
              handler: () => this.deleteItem(commodityItem)
            }]
          } else {
            commodityItem.rightButton = [{
              content: '移出收藏',
              style: {background: '#fd8645', color: '#fff'},
              handler: () => this.collectItem(commodityItem)
            }, {
              content: '删除',
              style: {background: '#fb3439', color: '#fff'},
              handler: () => this.deleteItem(commodityItem)
            }]
          }
          if (commodityItem.cartCommodityDiscountMoneyDTO) { // 满减计算
            var fullcutTotal = commodityItem.cartCommodityDiscountMoneyDTO.startMoney
            var currentFullcutTotal = 0
            var appSkuInfoListDTOList = []
            commodityItem.cartCommodityDiscountMoneyDTO.giveSkuIds.forEach((skuItem) => {
              var skuParams = {
                'skuId': skuItem,
                'shopId': this.getLocalstorage('shopId') // TODO对应店铺
              }
              appSkuInfoListDTOList.push(skuParams)
            })
            this.data.forEach((dataItemX) => {
              dataItemX.cartCommodityDTOS.forEach((cartItemX) => {
                if (cartItemX.cartCommodityDiscountMoneyDTO) {
                  if (commodityItem.cartCommodityDiscountMoneyDTO.discountId === cartItemX.cartCommodityDiscountMoneyDTO.discountId) {
                    if (this.appUserType === 'GENERAL') {
                      currentFullcutTotal += cartItemX.actualPrice * cartItemX.commodityCount
                    } else {
                      currentFullcutTotal += cartItemX.ownerPrice * cartItemX.commodityCount
                    };
                  };
                };
              })
              if (currentFullcutTotal < fullcutTotal) {
                commodityItem.gotoFullcut = true
              } else {
                commodityItem.gotoFullcut = false
              }
              commodityItem.appSkuInfoListDTOList = appSkuInfoListDTOList
            })
          }
        })
      })
    },
    collectItem (info) { // 收藏货品
      var that = this
      if (info.isCollected === 'true') {
        var params = {
          'userId': that.getLocalstorage('visitorId'),
          'appUserStatus': 'VISITOR',
          'shopId': that.getLocalstorage('shopId'), // 商铺Id
          'goodsId': info.commodityId// 商品Id
        }
        if (that.getLocalstorage('userInfo')) {
          params.appUserStatus = 'USER'
          params.userId = that.getLocalstorage('userInfo').id
        }
        that.$axios.post('/MyCollect/add', params).then((res) => {
          that.$toast({message: '收藏成功', duration: 800})
          setTimeout(function () {
            that.first = true
            that.getData()
          }, 800)
        })
      } else {
        var params1 = {
          'id': that.getLocalstorage('visitorId'),
          'appUserStatus': 'VISITOR',
          'shopId': that.getLocalstorage('shopId'),
          'goodsId': info.commodityId
        }
        if (that.getLocalstorage('userInfo')) {
          params1.appUserStatus = 'USER'
          params1.id = that.getLocalstorage('userInfo').id
        }
        that.$axios.post('/MyCollect/delete', params1).then((res) => {
          that.isCollected = true
          that.$toast({message: '取消收藏', duration: 800})
          setTimeout(function () {
            that.getData()
          }, 800)
        })
      }
    },
    deleteItem (info) { // 删除货品
      var idList = [{'commodityId': info.commodityId, 'shopId': this.getLocalstorage('shopId')}]
      this.$axios.post('/cart/commodity/remove', idList).then((res) => {
        window.eventBus.$emit('updateCount') // 更新角标
        this.getData()
      })
    },
    ontouchmove () {
      if (this.scroll) this.scroll.scroll.moved = true
    },
    pullingDown () {
      this.getData()
    },
    gotoGoodsDetail (commodityId) {
      this.$router.push({path: '/goodsDetail/' + commodityId})
    },
    timerStart: function (x) {
      this.$router.replace('/home/shopCart/0')
    },
    timerEnd: function (x) {
      this.$router.replace('/home/shopCart/0')
    },
    gotoIndex () {
      window.eventBus.$emit('updateClick')
    },
    gotoFullCut (appSkuInfoListDTOList) { // 去凑单
      window.localStorage.setItem('fullCut', JSON.stringify(appSkuInfoListDTOList))
      this.$router.push({path: '/fullCut'})
    },
    doneInput (goods, shopId) {
      if (goods.commodityCount.length === 1) {
        goods.commodityCount = goods.commodityCount.replace(/[^1-9]/g, '')
      } else {
        goods.commodityCount = goods.commodityCount.replace(/\D/g, '')
      }
      if (!goods.commodityCount || goods.commodityCount < 0) {
        this.$toast({message: '请输入购买数量', duration: 800})
        goods.commodityCount = 1
        return
      }
      if (this.limitCount(goods) === 'limit') return
      var params = {
        'skuId': goods.commodityId, // 商品ID
        'shopId': shopId, // 门店ID
        'count': parseInt(goods.commodityCount) // offset
      }
      var that = this
      this.$axios.post('/cart/commodity/add/count', params).then((res) => {
        window.eventBus.$emit('updateCount')
        that.getData()
      }).catch(function () {})
    },
    account: _.debounce(function () { // 结算
      if (!this.getLocalstorage('userInfo')) {
        this.showConfirm('您没有进行登录,去登录?', 1)
        return
      }
      var that = this
      var params = []
      that.data.forEach(function (item, index) {
        var parent = {
          'shopId': item.shopId,
          'orderCommodityDTOS': []
        }
        item.cartCommodityDTOS.forEach(function (info) {
          if (info.choose) {
            var param = {
              'skuId': info.commodityId,
              'count': info.commodityCount,
              'activityType': info.activityInfoDTO.type
            }
            parent.orderCommodityDTOS.push(param)
          }
        })
        if (parent.orderCommodityDTOS.length > 0) params.push(parent)
      })
      if (params.length < 1) {
        that.showConfirm('购物袋没有选中商品，是否跳转到首页', 2)
        return false
      } else {
        that.$axios.post('/order/app/confirm', params).then((res) => {
          if (res) that.getCouponData(res)
        })
      }
    }, 1000, {
      'leading': true,
      'trailing': false
    }),
    getCouponData (resData) { // 获取优惠券信息
      var that = this
      var couponOrders = []
      resData.childOrderConfirmDTOS.forEach(function (resItem) {
        resItem.commodityConfirmDTOS.forEach(function (comItem) {
          var couponOrder = {
            'buyNumber': comItem.count,
            'shopId': resItem.shopId,
            'goodsId': comItem.commodityId
          }
          // 满减 满赠 普通 专场 可查询优惠券其他均不可
          if (comItem.activityInfoDTO.type === 'COMMON' || comItem.activityInfoDTO.type === 'SPECIAL' || comItem.activityInfoDTO.type === 'GIVE' || comItem.activityInfoDTO.type === 'DISCOUNT') {
            couponOrders.push(couponOrder)
          }
          // ***满赠商品且为单一赠品,默认设置商品未选择***
          if (comItem.cartCommodityDiscountGoodsDTO && comItem.cartCommodityDiscountGoodsDTO.fillGiveType === 'ONE') {
            comItem.cartCommodityDiscountGoodsDTO.isChoosed = false
          };
        })
      })
      var params = {
        'couponOrders': couponOrders
      }
      console.log('couponOrders', couponOrders)
      that.$axios.post('/app/coupon/query/platform/usable/list', params).then((platformRes) => {
        var platformCouponData = [] // 筛选后的平台优惠券
        if (platformRes) {
          platformRes.forEach(function (platformItem) {
            platformItem.isChoosed = 0
            // 去除不包含该商品的优惠券
            var isUnable = false
            couponOrders.forEach(function (couponItem) {
              platformItem.shopGoodsDTO.forEach(function (shopItem) {
                if (couponItem.goodsId === shopItem.goodsId) isUnable = true
              })
            })
            if (isUnable) platformCouponData.push(platformItem)
          })
        };
        that.$axios.post('/app/coupon/query/shop/usable/list', params).then((shopRes) => {
          var shopCouponData = [] // 筛选后的商铺优惠券
          if (shopRes) {
            shopRes.forEach(function (shopItem) {
              shopItem.isChoosed = 0
              // 去除不包含该商品的优惠券
              var isUnable = false
              couponOrders.forEach(function (couponItem) {
                shopItem.shopGoodsDTO.forEach(function (goodItem) {
                  if (couponItem.goodsId === goodItem.goodsId) isUnable = true
                })
              })
              if (isUnable) shopCouponData.push(shopItem)
            })
          }
          // ***清除优惠券使用标识***
          if (that.getLocalstorage('removeCoupon')) window.localStorage.removeItem('removeCoupon')
          // ***清空满赠商品标识***
          if (that.getLocalstorage('fullGive')) window.localStorage.removeItem('fullGive')
          // ***清空买赠商品标识***
          if (that.getLocalstorage('buyGifts')) window.localStorage.removeItem('buyGifts')
          // ***清除地址信息***
          window.eventBus.$emit('address', {})
          that.$router.push({name: 'affirmOrder',
            params: {
              'res': resData,
              'platformCouponData': platformCouponData,
              'shopCouponData': shopCouponData
            }})
        })
      })
    },
    limitCount (info) { // 共用商品购买限制
      if (info.activityInfoDTO.type === 'COMMON' || info.activityInfoDTO.type === 'SPECIAL' || info.activityInfoDTO.type === 'SPECIALOFFER' || info.activityInfoDTO.type === 'GIVE' || info.activityInfoDTO.type === 'DISCOUNT') { // 普通or专场or特价or满赠or满减
        if (info.commodityCount > info.stock || info.commodityCount > 99) { // 库存 or 超过99件
          if (info.stock > 99) {
            info.commodityCount = 99
            this.$toast({message: '您最多购买99件商品', duration: 1000})
          } else {
            info.commodityCount = info.stock
            this.$toast({message: '仅剩' + info.stock + '件商品', duration: 1000})
          }
          return 'limit'
        }
      } else if (info.activityInfoDTO.type === 'PRESELL') { // 预售(无库存)购买数量限制
        if (info.commodityCount > 99) {
          info.commodityCount = 99
          this.$toast({message: '您最多购买99件商品', duration: 1000})
          return 'limit'
        }
      } else { // 活动商品购买限制
        if (info.activityInfoDTO.type === 'SECKILL') { // 秒杀
          return this.limitCountToast(info, info.activityInfoDTO.activityInfo.restriction, info.activityInfoDTO.activityInfo.seckillStock)
        } else if (info.activityInfoDTO.type === 'FLASH_SALE') { // 限时购
          return this.limitCountToast(info, info.activityInfoDTO.activityInfo.restriction, info.activityInfoDTO.activityInfo.limitStock)
        } else if (info.activityInfoDTO.type === 'GROUP') { // 拼团
          return this.limitCountToast(info, info.activityInfoDTO.activityInfo.restriction, info.activityInfoDTO.activityInfo.inventoryQuantity)
        } else if (info.activityInfoDTO.type === 'GROUPBUY') { // 团购
          return this.limitCountToast(info, info.activityInfoDTO.activityInfo.restriction, info.activityInfoDTO.activityInfo.groupStock)
        } else if (info.activityInfoDTO.type === 'BUY_PRESENT') { // 买赠
          return this.limitCountToast(info, info.activityInfoDTO.activityInfo.restriction, info.activityInfoDTO.activityInfo.stock)
        }
      }
    },
    limitCountToast (info, restriction, stock) { // 共用限购提示
      restriction = parseInt(restriction)
      stock = parseInt(stock)
      if (info.commodityCount > restriction || info.commodityCount > stock) {
        if (restriction < stock) { // 限购小于活动库存
          info.commodityCount = restriction
          this.$toast({message: '您最多购买' + restriction + '件商品', duration: 1000})
        } else {
          info.commodityCount = stock
          this.$toast({message: '仅剩' + stock + '件商品', duration: 1000})
        }
        return 'limit'
      }
    },
    showConfirm (cont, index) {
      this.$messageBox.confirm(cont, '提示', {closeOnClickModal: false}).then(() => {
        if (index === 1) this.$router.push('/login')
      }, function () {})
    }
  }
}
</script> 
<style lang="less" scoped>
@import "../../../../static/css/shopCart.less";
.allCartData{
  padding-bottom: 1.5rem;
}
.page-content .shopList .goods dl dd .price{
  top: 1.4rem;
}
</style>