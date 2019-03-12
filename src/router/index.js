import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/common/Home'
import abouts from '../components/pages/About.vue' //
import noWifi from '../components/pages/error/noWifi.vue' // no-Wifi
import error from '../components/pages/error/error.vue' // 页面加载错误
import classify from '../components/pages/classify/classify.vue' // 分类
import toBuyGifts from '../components/pages/classify/toBuyGifts.vue' // 买赠

import goodsDetail from '../components/pages/goods/theGoods/goodsDetail.vue' // 商品详情
import sourceOfGoods from '../components/pages/goods/sourceOfGoods.vue' // 溯源信息
import evaluateDetail from '../components/pages/goods/evaluateDetail.vue' // 评价
import fullCut from '../components/pages/goods/fullCut.vue' // 满减列表
import getCoupon from '../components/pages/goods/getCoupon.vue' // 领取优惠券

import index from '../components/pages/index/index.vue' // 首页
import shopDefault from '../components/pages/index/template/defaultIndex.vue' // 首页默认店铺
import shopGeneral from '../components/pages/index/template/generalIndex.vue' // 首页普通店铺
import secKill from '../components/pages/index/template/secKill.vue' // 秒杀
import timeLimit from '../components/pages/index/template/flashSale.vue' // 限时购
import group from '../components/pages/index/template/groupShopping.vue' // 组团
import teamBuying from '../components/pages/index/template/teamBuying.vue' // 团购
import advanceBooking from '../components/pages/index/template/advanceBooking.vue' // 预售
import typeTemplate from '../components/pages/index/template/typeTemplate.vue' // 商品列表
import specliaInfo from '../components/pages/index/specliaInfo.vue' // 专题
import explodeBack from '../components/pages/index/explodeBack.vue' // 更多爆品返场

import search from '../components/pages/index/search.vue' // 搜索

import login from '../components/pages/login/login.vue' // 登录
import register from '../components/pages/login/register.vue' // 注册
import forgetPwd from '../components/pages/login/forgetPwd.vue' // 忘记密码
import regist from '../components/pages/login/regist.vue' // 忘记密码

import mine from '../components/pages/mine/mine.vue' // 我的
import helpList from '../components/pages/mine/helpList.vue' // 帮助
import helpCont from '../components/pages/mine/helpCont.vue' // 问题列表
import helpDetail from '../components/pages/mine/helpDetails.vue' // 问题详情

import message from '../components/pages/mine/message.vue'  // 通知
import settings from '../components/pages/mine/settings.vue' // 用户设置
import about from '../components/pages/mine/about.vue' // 关于我们
import changePwd from '../components/pages/mine/changePwd.vue' // 账号安全
import save from '../components/pages/mine/save.vue' // 收藏
import vip from '../components/pages/mine/vip.vue' // 会员
import integralDetail from '../components/pages/mine/integralDetail.vue' // 会员_积分明细
import integralRule from '../components/pages/mine/integralRule.vue' // 会员_积分规则
import foot from '../components/pages/mine/foot.vue' // 足迹
import coupon from '../components/pages/mine/coupon/coupon.vue' // 优惠券
import couponList from '../components/pages/mine/coupon/couponList.vue' // 优惠券

import addCoupon from '../components/pages/mine/addCoupon.vue' // 添加优惠券
import addressList from '../components/pages/mine/addressList.vue'  // 地址列表
import addAddress from '../components/pages/mine/addAddress.vue'  // 添加地址
import comment from '../components/pages/mine/comment/comment.vue'// 我的评论
import commentList from '../components/pages/mine/comment/commentList.vue'// 我的评论列表

import groupStatus from '../components/pages/order/groupStatus.vue' // 拼团详情
import order from '../components/pages/order/allOrder/order.vue' // 订单列表
import orderList from '../components/pages/order/allOrder/orderList.vue' // 订单列表
import afterSale from '../components/pages/order/afterSale/afterSale.vue' // 售后服务
import saleList from '../components/pages/order/afterSale/saleList.vue' // 售后服务订单列表
import orderDetail from '../components/pages/order/orderDetail.vue' // 订单详情
import affirmOrder from '../components/pages/order/affirmOrder.vue' // 确认订单
import affirmAddress from '../components/pages/order/affirmAddress.vue' // 订单地址
import invoice from '../components/pages/order/invoice.vue' // 发票
import payment from '../components/pages/order/payment.vue' // 订单支付
import payStatus from '../components/pages/order/payStatus.vue' // 支付状态
import refundSalesApply from '../components/pages/order/refundSalesApply.vue' // 申请退货 申请退款
import refundSalesApply2 from '../components/pages/order/refundSalesApply2.vue' // 申请退货 申请退款
import refundSalesApplySingle from '../components/pages/order/refundSalesApplySingle.vue' // 单个商品申请退款
import refundSalesApplySingle2 from '../components/pages/order/refundSalesApplySingle2.vue' // 单个商品申请退款
import refundSalesDetail from '../components/pages/order/refundSalesDetail.vue' // 退货详情 退款详情
import logistics from '../components/pages/order/logistics.vue' // 物流信息
import evaluate from '../components/pages/order/evaluate.vue' // 填写评价
import evaluateGood from '../components/pages/order/evaluateGood.vue' // 商品评价
import useCoupon from '../components/pages/order/useCoupon.vue' // 商品评价

import shopCart from '../components/pages/shopCart/shopCart.vue' // 购物车

import special from '../components/pages/special/special.vue' // 专题
import specialList from '../components/pages/special/specialList.vue' //  专题列表
import specialDetail from '../components/pages/special/specialDetail.vue' //  专题详情

// add by eric
import classifyIndex from '../components/pages/classify/classifyIndex.vue' // 分类主框架
import classifyAll from '../components/pages/classify/classifyAll.vue' // 分类全部页
import classifyLevel1 from '../components/pages/classify/level1.vue' // 一级分类框架
import classifyLevel2 from '../components/pages/classify/level2.vue' // 二级分类列表

Vue.use(Router)
export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/home/index/shopTemplate/default'
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      children: [
        {
          path: 'index',
          component: index,
          name: 'index',
          meta: {pageName: 'index'},
          children: [
            {path: 'shopTemplate/default', component: shopDefault},
            {path: 'shopTemplate/general', component: shopGeneral},
            {path: 'activityTemplate/secKill', component: secKill},
            {path: 'activityTemplate/timeLimit', component: timeLimit},
            {path: 'activityTemplate/group', component: group},
            {path: 'activityTemplate/teamBuying', component: teamBuying},
            {path: 'activityTemplate/advanceBooking', component: advanceBooking},
            {path: 'typeTemplate/:categoryId', component: typeTemplate}
          ]
        },
        { path: 'special', component: special, meta: {pageName: 'special'} },
        { path: 'shopCart/:type', component: shopCart, meta: {pageName: 'shopCart'} },
        { path: 'mine', component: mine, meta: {pageName: 'mine'} }
      ]
    },
    {path: '/specliaInfo/:id', component: specliaInfo},
    {path: '/classifyOld', component: classify},
    {path: '/explodeBack', component: explodeBack},
    // add by eric
    {
      path: '/classify',
      component: classifyIndex,
      name: 'classifyIndex',
      children: [
        { path: '', component: classifyAll },
        {
          path: 'level1/:level1Id',
          component: classifyLevel1,
          children: [
            { path: 'level2/:level2Id', component: classifyLevel2 }
          ]
        }
      ]
    },
    {path: '/abouts', component: abouts},
    {path: '/error', component: error},
    {path: '/noWifi', component: noWifi},
    {path: '/sourceOfGoods', component: sourceOfGoods},
    {path: '/goodsDetail/:skuId', component: goodsDetail, meta: {storeName: 'goodsDetailPage'}},
    {path: '/evaluateDetail/:id', name: 'evaluateDetail', component: evaluateDetail, meta: {storeName: 'evaluateDetailPage'}},
    { path: '/fullCut', name: 'fullCut', component: fullCut },
    { path: '/getCoupon/:id', name: 'getCoupon', component: getCoupon },
    { path: '/toBuyGifts', name: 'toBuyGifts', component: toBuyGifts },

    { path: '/search', component: search },
    { path: '/login', component: login },
    { path: '/register', component: register },
    { path: '/forgetPwd', component: forgetPwd },
    { path: '/regist', component: regist },
    { path: '/helpList', component: helpList },
    { path: '/helpCont/:id/:name', name: 'helpCont', component: helpCont },
    { path: '/helpDetail/:id/:name', component: helpDetail },

    { path: '/message', component: message },
    { path: '/settings', component: settings },
    { path: '/about', component: about },
    { path: '/changePwd', component: changePwd },
    { path: '/addressList', component: addressList },
    { path: '/addAddress/:id', component: addAddress },
    { path: '/save', component: save },
    { path: '/vip', component: vip },
    { path: '/integralDetail', component: integralDetail },
    { path: '/integralRule', component: integralRule },
    { path: '/foot', component: foot },
    { path: '/addCoupon', component: addCoupon },
    {
      path: '/comment',
      component: comment,
      children: [
        {path: 'commentList/:type', component: commentList, meta: {pageName: 'commentList'}}
      ]
    },

    {
      path: '/coupon',
      name: 'name',
      component: coupon,
      children: [
        {path: 'couponList/:type', component: couponList, meta: {pageName: 'couponList'}}
      ]
    },
    {
      path: '/order',
      name: 'order',
      component: order,
      children: [
        {path: 'orderList/:type', component: orderList, meta: {pageName: 'orderList'}}
      ]
    },
    {
      path: '/afterSale',
      name: 'afterSale',
      component: afterSale,
      children: [
        {path: 'saleList/:type', component: saleList, meta: {pageName: 'saleList'}}
      ]
    }, // groupStatus
    {path: '/groupStatus/:id', component: groupStatus},
    { path: '/orderDetails/:index/:orderId/:orderType', name: 'orderDetails', component: orderDetail },
    {path: '/affirmOrder', name: 'affirmOrder', component: affirmOrder, meta: {storeName: 'affirmOrderPage'}},
    {path: '/affirmAddress', name: 'affirmAddress', component: affirmAddress},
    { path: '/invoice/:type', name: 'invoice', component: invoice },
    { path: '/payment/:realPrice/:orderId/:orderNum', name: 'payment', component: payment },
    { path: '/payStatus/:status/:orderId/:platform', name: 'payStatus', component: payStatus },
    { path: '/refundSalesApply/:type', name: 'refundSalesApply', component: refundSalesApply },
    { path: '/refundSalesApply2/:type', name: 'refundSalesApply2', component: refundSalesApply2 },
    { path: '/refundSalesApplySingle/:index', name: 'refundSalesApplySingle', component: refundSalesApplySingle },
    { path: '/refundSalesApplySingle2/:index', name: 'refundSalesApplySingle2', component: refundSalesApplySingle2 },
    { path: '/refundSalesDetail', name: 'refundSalesDetail', component: refundSalesDetail },
    { path: '/evaluate/:index/:orderId/:orderType', name: 'evaluate', component: evaluate },
    { path: '/evaluateGood/:orderId/:commodityId/:shopId/:price', name: 'evaluateGood', component: evaluateGood },
    { path: '/logistics/:orderId/:type', name: 'logistics', component: logistics },
    { path: '/useCoupon', name: 'useCoupon', component: useCoupon },

    { path: '/specialList/:title/:id', name: 'specialList', component: specialList },
    { path: '/specialDetail/:id', component: specialDetail }
  ]
})
