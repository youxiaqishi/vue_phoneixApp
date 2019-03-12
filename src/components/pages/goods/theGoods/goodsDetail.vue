<template>
<div class="page header-hidden indexPage goodsPage">
  <m-header class="emptyTitle">
    <span class="goBack" slot="left"></span>
    <span class="share" v-on:click="showShareModal()" slot="right"></span>
  </m-header>
  <div class="page-content has_footer" v-if="data.id">
    <div class="banner goodsBanner">
      <swiper :options="swiperOption1" class="bannerList">
        <swiper-slide v-for="(info,index) in data.url" :key="index">
            <img v-bind:src="info.url"/>
            <span class="bgtest" v-if="data.putaway == 'DOWN'"></span>
            <span class="bgtestOut" v-if="data.stock == 0 && data.putaway == 'UP'"></span>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper> 
    </div>
    <!-- 秒杀信息 -->
    <div class="secKill" v-if="goodType == 'SECKILL'">
      <div class="secKillLogo"></div><div class="secKillTitle">秒杀中</div>
      <div class="secKillTime">
        <timer :current-time="currentTime" class="noneStyle" :start-time="new Date(data.activityInfoDTO.activityInfo.beginTime.replace(/-/g, '/')).getTime()" :end-time="new Date(data.activityInfoDTO.activityInfo.endTime.replace(/-/g, '/')).getTime()" v-on:start_callback="timerStart(1)" v-on:end_callback="timerEnd(3)" :tipText="'距开始还剩'" :tipTextEnd="'距结束还剩'" :endText="'活动已结束'" :dayTxt="'天'" :hourTxt="':'" :minutesTxt="':'" :secondsTxt="''" :secondsFixed="true"></timer>
      </div>
    </div>
    <!-- 拼团信息 -->
    <div class="secKill" v-if="goodType == 'GROUP'">
      <div class="groupShoppingLogo"></div><div class="secKillTitle">拼团中</div>
      <div class="secKillTime">还剩 <i>{{data.activityInfoDTO.activityInfo.inventoryQuantity}}</i> 件 · {{data.activityInfoDTO.activityInfo.people}}人成团</div>
    </div>
    <!-- 限时购信息 -->
    <div class="secKill" v-if="goodType == 'FLASH_SALE'">
      <div class="secKillLogo"></div><div class="secKillTitle">限时抢购中</div>
      <div class="secKillTime flashSaleTime">
        <timer :current-time="currentTime" class="noneStyle" :start-time="new Date(data.activityInfoDTO.activityInfo.startTime.replace(/-/g, '/')).getTime()" :end-time="new Date(data.activityInfoDTO.activityInfo.endTime.replace(/-/g, '/')).getTime()" v-on:start_callback="timerStart(2)" v-on:end_callback="timerEnd(3)" :tipText="'距开始还剩'" :tipTextEnd="'距结束还剩'" :endText="'活动已结束'" :dayTxt="'天'" :hourTxt="':'" :minutesTxt="':'" :secondsTxt="''" :secondsFixed="true"></timer>
      </div>
      <div class="flashSaleLeft">仅剩{{data.activityInfoDTO.activityInfo.limitStock}}件</div>
    </div>
    <!-- 预售信息 -->
    <div class="secKill" v-if="goodType == 'PRESELL'">
      <div class="groupShoppingLogo"></div><div class="secKillTitle">预售中</div>
      <div class="secKillTime flashSaleTime">
        <timer :current-time="currentTime" class="noneStyle" :start-time="new Date(data.activityInfoDTO.activityInfo.startTime.replace(/-/g, '/')).getTime()" :end-time="new Date(data.activityInfoDTO.activityInfo.endTime.replace(/-/g, '/')).getTime()" v-on:start_callback="timerStart(2)" v-on:end_callback="timerEnd(3)" :tipText="'距开始还剩'" :tipTextEnd="'距结束还剩'" :endText="'活动已结束'" :dayTxt="'天'" :hourTxt="':'" :minutesTxt="':'" :secondsTxt="''" :secondsFixed="true"></timer>
      </div>
    </div>
    <!-- 团购信息 -->
    <div class="secKill" v-if="goodType == 'GROUPBUY'">
      <div class="groupShoppingLogo"></div><div class="secKillTitle">团购中</div>
      <div class="secKillTime">仅剩 <i>{{data.activityInfoDTO.activityInfo.groupStock}}</i> 件 · 每人限购{{data.activityInfoDTO.activityInfo.restriction}}件</div>
    </div>
    <!-- 预售信息 -->
    <!-- <div class="timeTop" v-if="goodType == 'PRESELL'">
      <swiper :options="swiperOption" class="tabs" ref="mySwiper">
        <swiper-slide v-for="(presell, index) in data.activityInfoDTO.activityInfo.list" :key="index" :class="{'active':index == tabIndexs}">
          <div v-on:click="onTabClick(index)">
            <div class="tabDiv">{{presell.time.split(' ')[0]}}</div>
            <div class="tabDiv">¥{{presell.price | twoDecimal}}</div>
          </div>
        </swiper-slide>
      </swiper>
    </div> -->
    <div class="goods_des">
      <h4>{{data.name}}</h4>
      <div class="goods_price" v-if="appUserType == 'notLogin' && (goodType == 'COMMON' || goodType == 'BUY_PRESENT' || goodType == 'SPECIAL')">
        <p class="ownerPri" style="font-size: .32rem;">业主价 <span>￥{{data.onwerPrice | twoDecimal}}</span></p>
        <p class="preferPri" style="font-size: .32rem;">优选价 <span>￥{{data.originalPrice | twoDecimal}}</span></p>
        <p class="preferPri" style="font-size: .32rem; float: right;">月销{{data.sales}}笔</p>
      </div>
      <div class="goods_price" v-else>
        <p class="ownerPri" style="font-size: .35rem;">{{goodPriceName}} <span>￥{{goodPrice | twoDecimal}}</span></p>
        <p class="preferPri" style="font-size: .32rem;text-decoration:line-through;" v-if="goodPriceName == '业主价'">优选价 <span>￥{{data.originalPrice | twoDecimal}}</span></p>
        <p class="preferPri" style="font-size: .35rem; float: right;">月销{{data.sales}}笔</p>
      </div>
      <!-- 满赠信息 -->
      <div v-if="data && data.queryActivityStatusResultDTO">
        <div class="goods_coupons" v-if="data.queryActivityStatusResultDTO.discountMoneyDTO">
          <div class="inner"><i class="type">满减</i> <p class="detail">满{{data.queryActivityStatusResultDTO.discountMoneyDTO.money}}元减{{data.queryActivityStatusResultDTO.discountMoneyDTO.discountMoney}}元</p> 
          </div>
        </div>
        <div class="goods_coupons" v-if="data.queryActivityStatusResultDTO.queryGiveGoodsDTO" v-on:click="checkFullGive(data.queryActivityStatusResultDTO.queryGiveGoodsDTO.giveGoodsList)">
          <div class="inner" v-if="data.queryActivityStatusResultDTO.queryGiveGoodsDTO.fillGiveType=='ONE'">
            <i class="type">满赠</i>
          <p class="detail"> 满{{data.queryActivityStatusResultDTO.queryGiveGoodsDTO.money}}元可任选一款赠品</p>
          <i class="icon ion-more"></i>
          </div>
          <div class="inner" v-if="data.queryActivityStatusResultDTO.queryGiveGoodsDTO.fillGiveType=='ALL'">
            <i class="type">满赠</i> <p class="detail">满{{data.queryActivityStatusResultDTO.queryGiveGoodsDTO.money}}元可获赠品</p>
            <i class="icon ion-more"></i>
          </div>
        </div>
      </div>
      <div class="goods_certificate">
        <span>5</span>星级，<span>25</span>道品质管理体系 
      </div>
    </div>
    <!-- 买赠信息 -->
    <div class="goods_selected" v-if="goodType == 'BUY_PRESENT'">
      <ul class="list_selected">
          <li  class="goods_coupon" v-for="presentGood in data.activityInfoDTO.activityInfo.giftList">
            <i class="activity">赠品</i> <p class="list_cont">{{presentGood.getAppSkuInfoDTO.name}} × 1</p>
          </li>
      </ul>
    </div>
    <!-- 拼团信息 -->
    <div class="shoppingChecked" v-if="goodType == 'GROUP'">
      <ul v-on:click="checkMoreGroup()"><li>{{groupShoppingData.count}}人在拼单<i class="icon-arrow-right"></i><p>查看更多</p></li></ul>
      <div v-for="(item, index) in groupShoppingData.list" v-if="(index==0 || index==1) && item.user" class="shopPeople">
        <p class="userImg"><img v-bind:src="item.user[0].url"></p>
        <p class="userName">{{item.user[0].userName}}</p>
        <p class="left">
          还差{{item.people}}人
          <timer :current-time="currentTime" class="goodsDetailGroupStyle" :start-time="new Date(item.groupStartTime.replace(/-/g, '/')).getTime()" :end-time="new Date(item.groupEndTime.replace(/-/g, '/')).getTime()" v-on:start_callback="timerStart(3)" v-on:end_callback="timerEnd(3)" :tipText="'距离开始时间还剩'" :tipTextEnd="'仅剩'" :endText="'此团已结束'" :dayTxt="'天'" :hourTxt="':'" :minutesTxt="':'" :secondsTxt="''" :secondsFixed="true"></timer>
        </p>
        <button class="button button-small button-red" v-on:click="gotoGroupShopping(item)" v-if="item.state == 'FALSE' && currentTime < new Date(item.groupEndTime.replace(/-/g, '/')).getTime()">去参团</button>
        <button class="button button-small button-gray" v-if="item.state == 'TRUE' && currentTime < new Date(item.groupEndTime.replace(/-/g, '/')).getTime()">已参团</button>
        <button class="button button-small button-gray" v-if="currentTime > new Date(item.groupEndTime.replace(/-/g, '/')).getTime()">已结束</button>
      </div>
    </div>
    <div class="goods_selected">
      <ul class="list_selected">
          <li  class="goods_select" v-on:click="showModal()" v-if="data.specification">
            已选  <p class="list_cont">{{data.specification[0].specificationDetailsName}} x {{selectCount}}
            </p><i class="icon-arrow-right"></i>
          </li>
          <li  class="goods_coupon" v-on:click="showCouponModel()" v-if="appUserType != 'notLogin' && haveUse && theGetCouponData.length == 0 && (goodType === 'COMMON' || goodType === 'BUY_PRESENT' || goodType === 'SPECIAL' || goodType === 'GIVE' || goodType === 'DISCOUNT')">
            领券 <p class="list_cont">可领取优惠券</p><i class="icon-arrow-right"></i>
          </li>
          <li v-if="appUserType != 'notLogin' && haveUse && theGetCouponData.length > 0 && (goodType === 'COMMON' || goodType === 'BUY_PRESENT' || goodType === 'SPECIAL' || goodType === 'GIVE' || goodType === 'DISCOUNT')" class="goods_coupon" v-on:click="showCouponModel()">
            领券
            <span class="couponName" v-for="(coupon, index) in theGetCouponData" v-if="index == 0 || index == 1 || index == 2 || index == 3">
              <sup>直降{{coupon.money}}元</sup>
            </span>
            <i class="icon-arrow-right"></i>
            <!-- <p class="list_contAdd" v-for="(coupon, index) in theGetCouponData" v-if="index == 0 || index == 1 || index == 2">直降{{coupon.money}}</p><i class="icon-arrow-right"></i> -->
          </li>
          <!-- <li class="goods_coupon" v-if="appUserType != 'notLogin' && !haveUse">
            领券 <p class="list_cont">暂无可领取优惠券</p><i class="icon-arrow-right"></i>
          </li> -->
      </ul>
      <!-- <ul class="activity">
        <li class="icon icon1">碧桂园直营</li>
        <li class="icon icon2">业主优惠</li>
        <li class="icon icon3">原产地直供</li>
      </ul>  -->
    </div>
    <div class="goods_assess" v-on:click="showEvaluate()">
      <div class="titleBox">
        商品评价<p>{{commentData.count?commentData.count:0}}人评论<i class="icon-arrow-right"></i></p>
      </div>
      <div class="goods_assess_nav">
        <div class="assess_nav">全部({{commentData.count?commentData.count:0}})</div>
        <div class="assess_nav">有图({{commentPicData.count?commentPicData.count:0}})</div>
      </div>
      <div class="goods_assess_cont" v-if="commentData.list&&commentData.list[0]">
        <div class="assess_cont">
          <div class="assess_items">
            <div class="assess_username">
              <span class="userName">{{commentData.list[0].userName}}</span>
              <span class="assessDate">{{commentData.list[0].createTime}}</span>
            </div>
            <div class="assess_text">{{commentData.list[0].picture[0].contentData}}</div>
            <div class="imgList" v-if="commentData.list[0].picture[0].picture[0]">
              <ul>
                <li v-for="img in commentData.list[0].picture[0].picture">
                  <img v-bind:src="img.commentariesImg ? img.commentariesImg : ''">
                </li>
              </ul>
            </div>
          </div>
          <div class="no_assess">查看更多评论</div>
        </div>
      </div>
    </div>
    <div class="goods_imageTextBox" v-if="loadData && loadData.appInfo">
      <ul class="goods_detail_spec">
        <li v-for="item in loadData.commodifyParameterInfo"><span>{{item.name}}</span>{{item.value}}</li>
      </ul>
      <div class="infoTab">
        <div class="detail" :class="{'detailCur': appInfo}" @click="appInfo = true">商品详情</div>
        <div class="detail" v-if="loadData.sourceInfo.info" :class="{'detailCur': !appInfo}" @click="appInfo = false">溯源详情</div>            
      </div>
      <div style="padding:0 .3rem;">
        <div v-if="appInfo" v-html="loadData.appInfo.info"></div>
        <div v-if="!appInfo" v-html="loadData.sourceInfo.info"></div> 
        <div v-if="appInfo && !loadData.appInfo.info" class="sourceInfoRemind">暂无商品详情</div>
      </div>
    </div>
  </div>
  <div class="goods-footer" v-if="data.id">
    <div class="goods-footerL">
      <p class="kefuBtn" @click="showService()"> 
        <span>客服</span>
      </p> 
      <p class="collectBox" :class="{'collectBox1':!isCollect}" v-on:click="toCollect()">
        <span v-if="isCollect">收藏</span>
        <span v-if="!isCollect">取消收藏</span>
      </p> 
      <p class="bagBox" v-on:click="goShopCart();">
        <em class="bagNum" v-if="badge && badge > 0">{{badge}}</em>
        <span>购物袋</span>
      </p>
    </div>
    <div v-if="data.putaway == 'UP' && data.stock != 0">
      <div v-if="goodType == 'COMMON' || goodType == 'FLASH_SALE' || goodType == 'PRESELL' || goodType == 'BUY_PRESENT' || goodType == 'GROUPBUY' || goodType == 'SPECIALOFFER' || goodType == 'SPECIAL' || goodType == 'GIVE' || goodType == 'DISCOUNT'">
        <div class="addBag" v-on:click="showModal(1)">
          <p>加入购物袋</p>
        </div>
        <div class="immediatelyBuy" v-on:click="showModal(0)">
          <p>立即购买</p>
        </div>
      </div>
      <div v-if="goodType == 'SECKILL' && currentTime > new Date(data.activityInfoDTO.activityInfo.beginTime.replace(/-/g, '/')).getTime()">
        <div class="immediatelyBuy" style="float: right;" v-on:click="showModal(0)">
          <p>立即购买</p>
        </div>
      </div>
      <div v-if="goodType == 'SECKILL' && currentTime < new Date(data.activityInfoDTO.activityInfo.beginTime.replace(/-/g, '/')).getTime()">
        <div class="addBag" v-on:click="showModal(1)">
          <p>加入购物袋</p>
        </div>
        <div class="immediatelyBuy" style="float: right;" v-on:click="showModal(0)">
          <p>立即购买</p>
        </div>
      </div>
      <div v-if="goodType == 'GROUP'">
        <div class="immediatelyBuy shoppingBuyButton" v-on:click="showModal(0,1)">
          <p class="top">¥ {{groupOriPrice | twoDecimal}}</p>
          <p class="bottom">单独购买</p>
        </div>
        <div class="addBag shoppingBuyButton" v-on:click="showModal(0)">
          <p class="top">¥ {{data.activityInfoDTO.activityInfo.regimentsPrice | twoDecimal}}</p>
          <p class="bottom">一键开团</p>
        </div>
      </div>
    </div>
    <div v-if="data.putaway == 'DOWN'">
      <div class="immediatelyBuy" style="float: right;">
        <p style="background-color: gray;">已下架</p>
      </div>
    </div>
    <div v-if="data.putaway == 'UP' && data.stock == 0">
      <div class="immediatelyBuy" style="float: right;">
        <p style="background-color: gray;">售罄</p>
      </div>
    </div>
  </div>
  <mt-popup v-model="showSelectModal" position="bottom" v-if="data.id" class="mint-popup-4">
    <div class="selectModal" v-if="data">
      <div class="bgClick" v-on:click="closeModal()"></div>
      <div class="pro-choose">
        <i class="closeModalBtn" style="font-size:.6rem;" v-on:click="closeModal()"></i>
        <div class="chose-prodesc">
          <div class="proPic" v-if="data.url && data.url[0]">
            <img v-bind:src="data.url[0].url"/>
          </div>
          <div class="proPrice" v-if="appUserType == 'notLogin' && (goodType == 'COMMON' || goodType == 'BUY_PRESENT' || goodType == 'SPECIAL')">
            <p class="owner-pri">业主价 <span>￥{{data.onwerPrice | twoDecimal}}</span></p>
            <p class="pre-pri">优选价 <span>￥{{data.originalPrice | twoDecimal}}</span></p>
          </div>
          <div class="proPrice" v-else>
            <p class="owner-pri">{{goodPriceName}} <span>￥{{goodPrice | twoDecimal}}</span></p>
          </div>
        </div>
        <div class="pro-list-item" v-for="item in data.specification">
          <h3 class="list-item-title">{{item.specificationName}}</h3>
          <div class="list-item-specBox">
            <span class="specBox selected">{{item.specificationDetailsName}}</span>
          </div>
        </div>
        <div class="pro-list-item">
          <h3 class="list-item-title">数量</h3>
          <div class="list-item-numBox clearfix">
            <b class="numDown" :class="{'forbid':selectCount == 1}" v-on:click="numMinus()"><i class="icon-minus"></i></b> 
            <input class="goodsNum" type="number" v-on:blur='doneInput()' v-model="selectCount"/>
            <b class="numAdd" v-on:click="numAdd()"><i class="icon-add"></i></b>
          </div>
        </div>
        <div class="btnBox" v-if="data.putaway == 'UP'">
          <div v-if="goodType == 'COMMON' || goodType == 'FLASH_SALE' || goodType == 'PRESELL' || goodType == 'BUY_PRESENT' || goodType == 'GROUPBUY' || goodType == 'SPECIALOFFER' || goodType == 'SPECIAL' || goodType == 'GIVE' || goodType == 'DISCOUNT'">
            <button v-if="showTwoBtn" class="button button-half-red" v-on:click="confirm(1)">添加到购物袋</button>
            <button v-if="showTwoBtn" class="button button-half-red" v-on:click="confirm(0)">立即购买</button>
          </div>
          <div v-if="goodType == 'SECKILL' && currentTime > new Date(data.activityInfoDTO.activityInfo.beginTime.replace(/-/g, '/')).getTime()">
            <button v-if="showTwoBtn" class="button button-half-red" v-on:click="confirm(1)">添加到购物袋</button>
            <button v-if="showTwoBtn" class="button button-half-red" v-on:click="confirm(0)">立即购买</button>
          </div>
          <div v-if="goodType == 'SECKILL' && currentTime < new Date(data.activityInfoDTO.activityInfo.beginTime.replace(/-/g, '/')).getTime()">
            <button v-if="showTwoBtn" class="button button-half-red" style="width: 7.02rem;" v-on:click="confirm(0)">立即购买</button>
          </div>
          <div v-if="goodType == 'GROUP'">
            <button v-if="showTwoBtn" class="button button-half-red" v-on:click="confirm(0,1)">单独购买</button>
            <button v-if="showTwoBtn" class="button button-half-red" v-on:click="confirm(0)">一键开团</button>
          </div>
          <button v-if="!showTwoBtn" class="button button-full-red" v-on:click="confirm()">确 定</button>
        </div>
        <div class="btnBox" v-if="data.putaway == 'DOWN'">
          <div>
            <button class="button button-half-red" style="width: 7.02rem; background-color: gray">已下架</button>
          </div>
        </div>
        <div class="btnBox" v-if="data.putaway == 'UP' && data.stock == 0">
          <div>
            <button class="button button-half-red" style="width: 7.02rem; background-color: gray">售罄</button>
          </div>
        </div>
      </div>
    </div>
  </mt-popup>
  <mt-popup v-model="showGive" position="bottom" class="mint-popup-4">
    <div class="modalDiv">
      <dl class="infoData" v-for="(good,index) in fullGiveList">
        <dt><img v-bind:src="good.imgUrl"/><span class="sellOut" v-if="good.goodsStatus==0||good.goodsStatus==2"></span></dt>
        <dd>
          <h3>{{good.name}}</h3>
          <div class="nums">x {{good.giveNumber}}</div>
        </dd>
     </dl>
    </div>
  </mt-popup>
  <mt-popup v-model="shareModalShow" position="bottom" class="mint-popup-4">
    <div class="modalDiv">
      <h1>邀请好友</h1>
      <ul class="type">
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
  <mt-popup v-model="shosGetCouponModal" position="bottom" class="mint-popup-6">
    <get-coupon-modal :theCouponData="theCouponData" @getCoupon="getCoupon" @closeCouponModel="closeCouponModel"></get-coupon-modal>
  </mt-popup>
  <mt-popup v-model="showGroupShopping" position="bottom" class="mint-popup-5">
    <more-group :groupShoppingData="groupShoppingData" @gotoGroupShopping="gotoGroupShopping" @close="close"></more-group>
  </mt-popup>
  <mt-popup v-model="showOneGroup" position="bottom" class="mint-popup-5">
    <one-group :oneGroupData="oneGroupData" @gotoGroupShopRightNow="gotoGroupShopRightNow" @close="close"></one-group>
  </mt-popup>
</div>
</template>
<script>
import _ from 'lodash'
import axios from 'axios'
import oneGroup from '../oneGroup.vue'
import moreGroup from '../moreGroup.vue'
import timer from '../../modal/timer.vue'
import store from '../../../../store/index'
import serviceModal from '../../modal/service.vue'
import getCouponModal from './getCouponModal.vue'
export default{
  data () {
    return {
      swiperOption: { // banner
        slidesPerView: 5,
        paginationClickable: true,
        spaceBetween: 0,
        freeMode: true
      },
      swiperOption1: { // 预售swiper
        pagination: {
          el: '.swiper-pagination'
        },
        paginationClickable: true,
        slidesPerView: 'auto',
        loopedSlides: 8,
        autoplay: 3000,
        loop: true
      },
      appInfo: true, // 商品详情/溯源详情
      haveUse: false, // 是否有可领取优惠券
      isCollect: true, // 是否收藏
      showGive: false, // 赠品信息显隐
      showTwoBtn: false, // 购买按钮显隐
      popupVisible: false, // 客服显隐
      loadDataShow: false, // 上拉数据弹出
      showOneGroup: false, // 参团显隐
      shareModalShow: false, // 分享弹出
      showSelectModal: false, // 购买弹出
      showGroupShopping: false, // 查看团显隐
      shosGetCouponModal: false, // 领取优惠券
      badge: 0, // 购物车数量
      tabIndexs: 0, // 预售sweiper tabindex
      groupType: 0, // 单独购买标识
      selectCount: 1, // 购买数量
      groupOriPrice: 0, // 拼团单独购买价格
      currentTime: '', // 当前时间
      appUserType: '', // 用户身份
      goodType: '', // 商品活动类型
      goodPrice: '', // 商品显示价格
      goodPriceName: '', // 商品价格名字
      data: {}, // 商品
      loadData: {}, // 上拉数据
      oneGroupData: {}, // 单个团数据
      commentPicData: {}, // 带图片的评论数据
      commentData: [], // 评论数据
      theCouponData: [], // 优惠券数据
      theGetCouponData: [], // 已获取的优惠券数据
      fullGiveList: [], // 满赠数据
      groupShoppingData: [] // 拼团数据
    }
  },
  store,
  components: {
    getCouponModal,
    serviceModal,
    moreGroup,
    oneGroup,
    timer
  },
  computed: {
    scroll () {
      return this.$refs.scroll
    },
    swiper () {
      return this.$refs.mySwiper.swiper
    }
  },
  mounted () {
  },
  destroyed () {
  },
  activated () {
    // 未登录 普通商品显示两个价格 已登录 普通商品显示一个价格 活动商品显示活动价格
    this.getLocalstorage('userInfo') ? this.appUserType = this.getLocalstorage('userInfo').appUserType : this.appUserType = 'notLogin' // 身份标识
    this.getData()
    this.scroll && this.scroll.forceUpdate(true)
  },
  methods: {
    getData () { // 商品详情
      var that = this
      var params = {
        'skuId': that.$route.params.skuId,
        'shopId': that.getLocalstorage('shopId')
      }
      that.$loading.open()
      that.$axios.get('/sec/kill/get/now/time').then((res1) => { // 获取当前时间
        if (res1) that.currentTime = new Date(res1.nowTime.replace(/-/g, '/')).getTime()
        that.$axios.post('/app/shop/get/app/sku/info/id', params).then((res) => {
          if (res) {
            that.goodType = res.activityInfoDTO.type
            if (that.goodType === 'COMMON' || that.goodType === 'BUY_PRESENT' || that.goodType === 'SPECIAL' || that.goodType === 'GIVE' || that.goodType === 'DISCOUNT' || (that.goodType === 'SECKILL' && that.currentTime < new Date(res.activityInfoDTO.activityInfo.beginTime.replace(/-/g, '/')).getTime())) { // 统一价格: 普通 买赠 特价 满赠
              if (that.appUserType === 'GENERAL') {
                that.goodPrice = res.originalPrice
                that.goodPriceName = '优选价'
              } else if (that.appUserType === 'OWNER' || that.appUserType === 'STAFF') {
                that.goodPrice = res.onwerPrice
                that.goodPriceName = '业主价'
              }
            } else { // 统一价格: 活动商品
              that.goodPrice = res.activityInfoDTO.activityPrice
              if (that.goodType === 'SECKILL') that.goodPriceName = '秒杀价'
              if (that.goodType === 'FLASH_SALE') that.goodPriceName = '限时价'
              if (that.goodType === 'GROUP') {
                that.goodPriceName = '拼团价'
                that.getGroupData(res)
              }
              if (that.goodType === 'PRESELL') that.goodPriceName = '预售价'
              if (that.goodType === 'GROUPBUY') that.goodPriceName = '团购价'
              if (that.goodType === 'SPECIALOFFER') that.goodPriceName = '特价'
            }
            that.data = res
            that.getLoadData() // 加载详情
            that.getOthers() // 足迹 收藏 评论
            that.getBadge() // 角标
            that.checkCanUseCoupon() // 查询优惠券信息
          }
          that.$loading.close()
        }).catch(function (msg) {
          that.$loading.close()
          that.showConfim(msg, 3)
        })
      })
    },
    getLoadData () { // 加载详情
      var that = this
      that.$axios.get('/app/shop/get/CommodityInfo/id/' + that.data.commodifyId).then((res) => {
        if (res) {
          res.sourceInfo.info = res.sourceInfo.info.replace(/<iframe /g, '<iframe webkit-playsinline ')
          res.sourceInfo.info = res.sourceInfo.info.replace(/allowfullscreen="true"/g, 'allowfullscreen="false"')
          that.loadData = res
        }
        that.scroll && that.scroll.forceUpdate(true)
      })
    },
    getBadge () { // 购物车角标
      var that = this
      that.$axios.get('/cart/count').then((res) => {
        if (res) that.badge = res
        if (that.badge > 99) that.badge = 99
        that.scroll && that.scroll.forceUpdate(true)
      })
    },
    getOthers () { // 足迹 收藏 评论
      var that = this
      var footParams = {
        'userId': this.getLocalstorage('visitorId'),
        'appUserStatus': 'VISITOR',
        'shopId': this.getLocalstorage('shopId'),
        'goodsId': this.$route.params.skuId
      }
      var collectParams = {
        'userId': this.getLocalstorage('visitorId'),
        'appUserStatus': 'VISITOR',
        'shopId': this.getLocalstorage('shopId'),
        'goodsId': this.$route.params.skuId
      }
      var commentPicParams = { // 有图
        'picture': 'TRUE',
        'merchandiseId': that.data.id,
        'shopId': that.getLocalstorage('shopId')
      }
      var commentAllParams = { // 全部
        'picture': 'FALSE',
        'merchandiseId': that.data.id,
        'shopId': that.getLocalstorage('shopId')
      }
      if (this.getLocalstorage('userInfo')) {
        footParams.appUserStatus = 'USER'
        footParams.userId = this.getLocalstorage('userInfo').id
        collectParams.appUserStatus = 'USER'
        collectParams.userId = this.getLocalstorage('userInfo').id
      }
      this.$axios.post('/footprint/add', footParams).then((res) => { // 添加足迹
        that.scroll && that.scroll.forceUpdate(true)
      })
      this.$axios.post('/MyCollect/check', collectParams).then((res) => { // 查询收藏
        that.isCollect = res
        that.scroll && that.scroll.forceUpdate(true)
      })
      this.$axios.post('/shop/Appraise/productList', commentPicParams).then((res) => { // 有图评论
        if (res) that.commentPicData = res
        that.scroll && that.scroll.forceUpdate(true)
      })
      this.$axios.post('/shop/Appraise/productList', commentAllParams).then((res) => { // 全部评论
        if (res) that.commentData = res
        that.scroll && that.scroll.forceUpdate(true)
      })
    },
    checkCanUseCoupon () { // 是否有可领取的优惠券
      var that = this
      that.haveUse = false
      that.$axios.get('/app/coupon/app/user/query/get/coupon/' + that.$route.params.skuId).then((res) => {
        if (res) {
          that.theCouponData = res
          res.forEach(function (item) {
            if (item.ifGetCoupon === 0) that.haveUse = true
          })
        }
        that.scroll && that.scroll.forceUpdate(true)
      })
    },
    showCouponModel () { // 获取优惠券
      // this.$router.push({path: '/getCoupon/' + this.data.id})
      this.shosGetCouponModal = true
    },
    closeCouponModel () {
      this.shosGetCouponModal = false
    },
    getCoupon (info) {
      var params = {
        'couponId': info.id,
        'goodsId': this.$route.params.skuId
      }
      this.$loading.open()
      var that = this
      that.$axios.post('/app/coupon/by/goods/get/coupon', params).then((res) => {
        if (res) info.ifGetCoupon = 1
        that.theGetCouponData = []
        _.each(that.theCouponData, function (item, index) {
          if (item.ifGetCoupon === 1) that.theGetCouponData.push(item)
        })
        that.$loading.close()
        that.$toast({message: '领取成功', duration: 800})
      })
    },
    showModal (type, type2) { // 购买商品弹出
      if (this.limitCount() === 'limit') return // 限制数量
      var that = this
      that.type = type
      that.groupType = type2
      that.showSelectModal = true
      that.showTwoBtn = false
      if (type !== 0 && type !== 1) that.showTwoBtn = true
    },
    closeModal () { // 购买商品隐藏
      if (this.limitCount() === 'limit') return // 限制数量
      this.showSelectModal = false
    },
    confirm: _.debounce(function (type, type2) { // 购买&添加购物车
      if (this.limitCount() === 'limit') return // 限制数量
      var that = this
      that.showSelectModal = false
      // that.$loading.open()
      // UPDATE:商品下架提示
      if (that.data.putaway === 'DOWN') {
        that.$toast({message: '该商品已下架', duration: 800})
        return
      }
      if (type === 0) that.type = 0
      if (type === 1) that.type = 1
      if (!that.selectCount || that.selectCount <= 0) {
        that.$toast({message: '请输入购买数量', duration: 800})
        return
      }
      if (that.type === 0) { // 立即购买
        if (that.getLocalstorage('userInfo')) {
          var activityType = '' // TODO
          type2 === 1 ? activityType = 'COMMON' : activityType = that.goodType // 单独购买or开团(从已选进入)
          if (that.groupType === 1) activityType = 'COMMON' // 单独购买(直接点击进入)
          var params = [{
            'shopId': that.getLocalstorage('shopId'),
            'orderCommodityDTOS': [
              {
                'skuId': that.data.id,
                'count': that.selectCount,
                'activityType': activityType,
                'groupId': 0
              }
            ]
          }]
          if (that.goodType === 'SECKILL' && that.currentTime < new Date(that.data.activityInfoDTO.activityInfo.beginTime.replace(/-/g, '/')).getTime()) {
            params[0].orderCommodityDTOS[0].activityType = 'COMMON'
          } // 活动未开始使用普通类型
          if (that.groupType === 2) { // 去参团
            params[0].orderCommodityDTOS[0].groupId = that.oneGroupData.id
            // UPDATE:如果是去参团activityType->JOINGROUP
            params[0].orderCommodityDTOS[0].activityType = 'JOINGROUP'
            activityType = 'JOINGROUP'
          }
          // UPDATE:如果是一键开团 团ID从后台取
          if (activityType === 'GROUP') {
            // UPDATE:如果是一件开团activityType->OPENGROUP
            params[0].orderCommodityDTOS[0].activityType = 'OPENGROUP'
            var groupIdParams = {
              'activityId': that.data.activityInfoDTO.activityInfo.id,
              'commodifyId': that.data.id
            }
            axios.post('/spell/group/create/group', groupIdParams).then((res) => {
              if (res) params[0].orderCommodityDTOS[0].groupId = res
              axios.post('/order/app/confirm', params).then((res1) => {
                if (res1) that.getCouponData(res1)
                that.scroll && that.scroll.forceUpdate(true)
              })
            })
          } else {
            axios.post('/order/app/confirm', params).then((res) => {
              if (res) that.getCouponData(res)
              that.scroll && that.scroll.forceUpdate(true)
            })
          }
        } else {
          that.$loading.close()
          that.showConfim('您没有进行登录,去登录?', 1)
        }
      } else { // 添加购物车
        var params2 = {
          'skuId': that.data.id, // 商品ID
          'shopId': that.getLocalstorage('shopId'), // 门店ID
          'offset': that.selectCount // offset
        }
        axios.post('/cart/commodity/add', params2).then((res) => {
          that.getBadge()
          that.scroll && that.scroll.forceUpdate(true)
          that.$toast({message: '添加购物袋成功', duration: 800})
        })
      }
      that.closeModal()
    }, 500, {
      'leading': true,
      'trailing': false
    }),
    getCouponData (resData) { // 商品及优惠券信息筛选
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
          if (that.goodType === 'COMMON' || that.goodType === 'SPECIAL' || that.goodType === 'GIVE' || that.goodType === 'DISCOUNT') {
            couponOrders.push(couponOrder)
          }
          // ***满赠商品且为单一赠品,默认设置商品未选择***
          if (comItem.cartCommodityDiscountGoodsDTO && comItem.cartCommodityDiscountGoodsDTO.fillGiveType === 'ONE') {
            comItem.cartCommodityDiscountGoodsDTO.isChoosed = false
          }
        })
      })
      var params = {
        'couponOrders': couponOrders
      }
      console.log('couponOrders', couponOrders)
      // 查询可用平台优惠券
      axios.post('/app/coupon/query/platform/usable/list', params).then((platformRes) => {
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
        }
        axios.post('/app/coupon/query/shop/usable/list', params).then((shopRes) => {
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
          that.scroll && that.scroll.forceUpdate(true)
          // ***清除优惠券使用标识***
          if (that.getLocalstorage('removeCoupon')) window.localStorage.removeItem('removeCoupon')
          // ***清空满赠商品标识***
          if (that.getLocalstorage('fullGive')) window.localStorage.removeItem('fullGive')
          // ***清空买赠商品标识***
          if (that.getLocalstorage('buyGifts')) window.localStorage.removeItem('buyGifts')
          // ***清除地址信息***
          window.eventBus.$emit('address', {})
          that.$loading.close()
          that.$router.push({name: 'affirmOrder',
            params: {
              'res': resData,
              'platformCouponData': platformCouponData,
              'shopCouponData': shopCouponData
            }
          })
        })
      })
    },
    doneInput () { // 输入数量非数字校验
      if (!this.selectCount || this.selectCount < 0) {
        this.selectCount = 1
      } else if (this.selectCount.length === 1) {
        this.selectCount = this.selectCount.replace(/[^1-9]/g, '')
      } else {
        this.selectCount = this.selectCount.replace(/\D/g, '')
      }
    },
    timerStart: function (index) { // 活动: 开始
      console.log('活动开始')
      this.getData()
    },
    timerEnd: function (index) { // 活动: 结束
      console.log('活动结束')
      this.getData()
    },
    onTabClick: _.debounce(function (index) { // 预售: tab点击
      var that = this
      that.tabIndexs = index
      that.initSwiper(that.tabIndexs)
    }, 500, {
      'leading': true,
      'trailing': false
    }),
    initSwiper (number) { // 预售: swiper初始化
      setTimeout(() => {
        var num = number
        if (num === 1) {
          this.swiper.setWrapperTranslate(0)
          this.swiper.setWrapperTransition(300)
        } else {
          this.swiper.slideTo(num - 2, 500, false)
        }
      })
    },
    getGroupData (res) { // 拼团: 请求数据
      var that = this
      var groupParams = {
        'userId': '',
        'id': res.activityInfoDTO.activityInfo.id,
        'commodifyId': that.$route.params.skuId
      }
      if (that.getLocalstorage('userInfo')) { // 根据用户标识显示单独购买价格
        groupParams.userId = that.getLocalstorage('userInfo').id
        that.appUserType === 'GENERAL' ? that.groupOriPrice = res.originalPrice : that.groupOriPrice = res.onwerPrice
      } else {
        that.groupOriPrice = res.originalPrice
      }
      that.$axios.post('/spell/group/query/group', groupParams).then((result) => {
        if (result) that.groupShoppingData = result
        that.scroll && that.scroll.forceUpdate(true)
      })
    },
    gotoGroupShopping (item) { // 拼团: 去参团
      this.showGroupShopping = false
      this.oneGroupData = item
      setTimeout(() => { this.showOneGroup = true }, 500)
    },
    checkMoreGroup () { // 拼团: 查看更多团
      if (this.groupShoppingData.count === 0) {
        this.$toast({message: '当前暂无可参加的团哦', duration: 800})
      } else {
        setTimeout(() => { this.showGroupShopping = true }, 500)
      }
    },
    gotoGroupShopRightNow (item) { // 拼团: 立即参团
      var that = this
      if (!that.getLocalstorage('userInfo')) {
        that.showConfim('您没有进行登录,去登录?', 1)
      } else {
        that.oneGroupData = item
        that.showModal(0, 2)
      }
    },
    close () { // 拼团: 关闭弹窗
      this.showGroupShopping = false
      this.showOneGroup = false
    },
    checkFullGive (info) { // 满赠: 弹窗
      this.fullGiveList = info
      this.showGive = true
    },
    toCollect: _.debounce(function () { // 收藏/取消收藏
      var that = this
      if (that.data.putaway === 'DOWN') {
        that.$toast({message: '该商品已下架', duration: 800})
        return
      }
      if (that.isCollect) { // 收藏
        var params = {
          'userId': that.getLocalstorage('visitorId'),
          'appUserStatus': 'VISITOR',
          'shopId': that.getLocalstorage('shopId'), // 商铺Id
          'goodsId': that.$route.params.skuId // 商品Id
        }
        if (that.getLocalstorage('userInfo')) {
          params.appUserStatus = 'USER'
          params.userId = that.getLocalstorage('userInfo').id
        }
        axios.post('/MyCollect/add', params).then((res) => {
          that.isCollect = false
          that.scroll && that.scroll.forceUpdate(true)
        })
        setTimeout(function () { that.$toast({message: '收藏成功', duration: 800}) }, 500)
      } else if (!that.isCollect) { // 取消收藏
        var params1 = {
          'id': that.getLocalstorage('visitorId'),
          'appUserStatus': 'VISITOR',
          'shopId': that.getLocalstorage('shopId'),
          'goodsId': that.$route.params.skuId
        }
        if (that.getLocalstorage('userInfo')) {
          params1.appUserStatus = 'USER'
          params1.id = that.getLocalstorage('userInfo').id
        }
        axios.post('/MyCollect/delete', params1).then((res) => {
          that.isCollect = true
          that.scroll && that.scroll.forceUpdate(true)
        })
        setTimeout(function () { that.$toast({message: '取消收藏', duration: 800}) }, 500)
      }
    }, 1000, {
      'leading': true,
      'trailing': false
    }),
    showShareModal: _.debounce(function () { // 剪切板分享
      var that = this
      that.$axios.get('/commodity/share/' + that.$route.params.skuId + '/' + that.getLocalstorage('shopId')).then((res) => { // 查询复制信息
        if (res) {
          that.$messageBox.confirm('凤凰优选邀您来选购品质好货【' + that.data.name + '】' + res + '复制这条信息后打开凤凰优选', '分享信息已生成', {
            showCancelButton: true,
            showConfirmButton: true,
            cancelButtonText: '取消',
            confirmButtonText: '复制一下'
          }).then(function () {
            that.ClipBoard('凤凰优选邀您来选购品质好货【' + that.data.name + '】' + res + '复制这条信息后打开凤凰优选').then(function () {
              that.$toast({message: '复制成功,快去分享给微信或QQ好友吧~', duration: 1500})
            })
          }, function () {
          })
        }
      })
    }, 500),
    hide () { // QQ微信隐藏分享
      this.shareModalShow = false
    },
    gotoShare (index) { // QQ微信分享
      var that = this
      that.Share(index, '凤凰优选', '', that.data.url[0].url, '').then(function (success) {
        that.$toast({message: '分享成功', duration: 800})
      }, function () {
        if (that.$store.state.mutations.isApp === 3) that.$toast({message: '暂不支持分享,敬请期待', duration: 800})
        if (that.$store.state.mutations.isApp === 1) that.$toast({message: '分享已取消', duration: 800})
      })
    },
    numAdd () { // 数量+
      this.selectCount++
      this.limitCount()// 限制数量
    },
    numMinus () { // 数量-
      if (this.selectCount > 1) this.selectCount--
    },
    showService () { // 客服
      this.popupVisible = true
    },
    goShopCart: _.debounce(function () { // 购物袋
      this.$router.push({path: '/home/shopCart/1'})
    }, 500, {
      'leading': true,
      'trailing': false
    }),
    showEvaluate: _.debounce(function () { // 评价
      this.$router.push({path: '/evaluateDetail/' + this.data.id})
    }, 500, {
      'leading': true,
      'trailing': false
    }),
    limitCount () { // 共用商品购买限制
      if (this.data.putaway === 'DOWN') { // 下架提示
        this.$toast({message: '该商品已下架', duration: 800})
        return 'limit'
      }
      if (this.goodType === 'COMMON' || this.goodType === 'SPECIAL' || this.goodType === 'SPECIALOFFER' || this.goodType === 'GIVE' || this.goodType === 'DISCOUNT') { // 普通or专场or特价or满赠or满减
        if (this.selectCount > this.data.stock || this.selectCount > 99) { // 库存 or 超过99件
          if (this.data.stock > 99) {
            this.selectCount = 99
            this.$toast({message: '您最多购买99件商品', duration: 800})
          } else {
            this.selectCount = this.data.stock
            this.$toast({message: '仅剩' + this.data.stock + '件商品', duration: 800})
          }
          return 'limit'
        }
      } else if (this.goodType === 'PRESELL') { // 预售(无库存)购买数量限制
        if (this.selectCount > 99) {
          this.selectCount = 99
          this.$toast({message: '您最多购买99件商品', duration: 800})
          return 'limit'
        }
      } else { // 活动商品购买限制
        if (this.goodType === 'SECKILL') { // 秒杀
          return this.limitCountToast(this.data.activityInfoDTO.activityInfo.restriction, this.data.activityInfoDTO.activityInfo.seckillStock)
        } else if (this.goodType === 'FLASH_SALE') { // 限时购
          return this.limitCountToast(this.data.activityInfoDTO.activityInfo.restriction, this.data.activityInfoDTO.activityInfo.limitStock)
        } else if (this.goodType === 'GROUP') { // 拼团
          return this.limitCountToast(this.data.activityInfoDTO.activityInfo.restriction, this.data.activityInfoDTO.activityInfo.inventoryQuantity)
        } else if (this.goodType === 'GROUPBUY') { // 团购
          return this.limitCountToast(this.data.activityInfoDTO.activityInfo.restriction, this.data.activityInfoDTO.activityInfo.groupStock)
        } else if (this.goodType === 'BUY_PRESENT') { // 买赠
          return this.limitCountToast(this.data.activityInfoDTO.activityInfo.restriction, this.data.activityInfoDTO.activityInfo.stock)
        }
      }
    },
    limitCountToast (restriction, stock) { // 共用限购提示
      restriction = parseInt(restriction)
      stock = parseInt(stock)
      if (this.selectCount > restriction || this.selectCount > stock) {
        if (restriction < stock) { // 限购小于活动库存
          this.selectCount = restriction
          this.$toast({message: '您最多购买' + restriction + '件商品', duration: 800})
        } else {
          this.selectCount = stock
          this.$toast({message: '仅剩' + stock + '件商品', duration: 800})
        }
        return 'limit'
      }
    },
    showConfim (cont, index) {
      var that = this
      that.$messageBox.confirm(cont, '提示', {
        closeOnClickModal: false
      }).then(function () {
        if (index === 1) {
          window.localStorage.setItem('gotoGoods', JSON.stringify('gotoGoods'))
          that.$router.push('/login')
        } else if (index === 2) {
          that.$router.push('/home/shopCart/1')
        } else if (index === 3) {
          window.history.go(-1)
        }
      }, function () {
        if (index === 1) {
          that.showSelectModal = false
        } else if (index === 3) {
          window.history.go(-1)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import "../../../../../static/css/goodsDetail.less";
@import "../../../../../static/css/activity.less";
.couponName{
  display: inline-block;
  margin: 0 .05rem;
  sup{
    background: #ed462f;
    margin: 0 .07rem;
    height: 100%;
    display: block;
    text-align: center;
    font-size: .25rem;
    line-height: .4rem;
    padding: 0 .1rem;
  }
}
</style>