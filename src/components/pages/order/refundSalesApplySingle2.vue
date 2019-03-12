<template>
  <div class="page refundSalesPage">
    <m-header>
      <span slot="left"></span>
      <span slot="title">申请退款</span>
    </m-header>
    <div class="page-content">
      <div class="orderInfo">
        <p>订单编号：<span class="gray">{{data.orderNo}}</span></p>
        <p>订单总额：<span class="red">￥{{data.realPrice | twoDecimal}}</span></p>
      </div>
      <div class="goodsList">
        <dl class="infoData">
          <dt><img v-bind:src="data.childOrderDetailDTOS[0].commodityConfirmDTOS[$route.params.index].url"/></dt>
          <dd>
            <h3>{{data.childOrderDetailDTOS[0].commodityConfirmDTOS[$route.params.index].commodityName}}<br /></h3>
            <div class="price">
              <p class="owner" v-if="data.childOrderDetailDTOS[0].commodityConfirmDTOS[$route.params.index].activityInfoDTO.type == 'COMMON'">业主价：<span>￥{{data.childOrderDetailDTOS[0].commodityConfirmDTOS[$route.params.index].privilegePrice | twoDecimal}}</span></p>
              <p class="owner" v-if="data.childOrderDetailDTOS[0].commodityConfirmDTOS[$route.params.index].activityInfoDTO.type == 'SECKILL'">秒杀价：<span>￥{{data.childOrderDetailDTOS[0].commodityConfirmDTOS[$route.params.index].activityInfoDTO.activityPrice | twoDecimal}}</span></p>
              <p class="owner" v-if="data.childOrderDetailDTOS[0].commodityConfirmDTOS[$route.params.index].activityInfoDTO.type == 'FLASH_SALE'">限时价：<span>￥{{data.childOrderDetailDTOS[0].commodityConfirmDTOS[$route.params.index].activityInfoDTO.activityPrice | twoDecimal}}</span></p>
              <p class="owner" v-if="data.childOrderDetailDTOS[0].commodityConfirmDTOS[$route.params.index].activityInfoDTO.type == 'GROUP'">拼团价：<span>￥{{data.childOrderDetailDTOS[0].commodityConfirmDTOS[$route.params.index].activityInfoDTO.activityPrice | twoDecimal}}</span></p>
              <p class="selling">零售价：<span>￥{{data.childOrderDetailDTOS[0].commodityConfirmDTOS[$route.params.index].originPrice | twoDecimal}}</span></p>
            </div>
            <div class="nums">x {{data.childOrderDetailDTOS[0].commodityConfirmDTOS[$route.params.index].count}}</div>
          </dd>
        </dl>
      </div>
      <div class="cause" v-on:click="select()">
        退款原因
        <p>
          <span v-if="!cause">请选择</span> 
          <span v-if="cause">{{cause}}</span> 
          <i class="icon-arrow-right"></i>
        </p>
      </div>
      <div class="inputDiv">
        <div class="title">
          退款金额<span>您最多可以退款{{refundMoneyTotal}}元</span>
        </div>
        <input type='text' v-model="money" maxlength="10" class="moneyStyle" placeholder="金额"></input>
        <div class="mt1">
          物流费用：{{data.freightPrice | twoDecimal}}元
        </div>
      </div>
      <div class="inputDiv">
        <div class="title">
          问题说明<span v-if="200 - describeCont.length >= 0">您最多可填写{{200 - describeCont.length}}字</span>
        <span v-else>您最多可填写0字</span>
        </div>
        <textarea class="textStyle" maxlength="200" placeholder="问题说明" v-model="describeCont"></textarea>
      </div>
      <p class="causeStyle">
        非质量原因退款，需支付一定的物流费用。退款完成时间：3个工作日内，按照原支付方式退回，具体到账时间以各银行到账时间为准
      </p>
      <p class="button button-full-red mt1" v-on:click="submit()">提交申请</p>
    </div>
    <div class="selectCause" v-if='showCause'>
      <div class="cont">
        <h4>选择一个退款原因</h4>
        <ul>
          <li v-on:click="selectCause('QUALITY', '质量问题')">质量问题<i :class="{'icon-check':submitCause == 'QUALITY','icon-checked':submitCause != 'QUALITY'}"></i></li>
          <li v-on:click="selectCause('NOBUY', '不买了')">不买了<i :class="{'icon-check':submitCause == 'NOBUY','icon-checked':submitCause != 'NOBUY'}"></i></li>
          <li v-on:click="selectCause('RECEIVEERROR', '收货信息错误')">收货信息错误<i :class="{'icon-check':submitCause == 'RECEIVEERROR','icon-checked':submitCause != 'RECEIVEERROR'}"></i></li>
          <li v-on:click="selectCause('STOCKOUT', '商家缺货')">商家缺货<i :class="{'icon-check':submitCause == 'STOCKOUT','icon-checked':submitCause != 'STOCKOUT'}"></i></li>
          <li v-on:click="selectCause('OTHER', '其他')">其他<i :class="{'icon-check':submitCause == 'OTHER','icon-checked':submitCause != 'OTHER'}"></i></li>
        </ul>
        <div class="btns">
          <span v-on:click="cancel()">取消</span> 
          <span v-on:click="confirm()">确定</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
import store from '../../../store/index'
export default{
  data () {
    return {
      data: {},
      money: '', // 退款金额
      cause: '',
      submitCause: '', // 原因格式化
      describeCont: '', // 描述
      showCause: false, // 原因显隐
      refundMoneyTotal: 0
    }
  },
  store,
  activated () {
    this.getData()
  },
  methods: {
    getData () {
      var that = this
      that.data = that.getLocalstorage('orderData')
      that.money = parseFloat(that.data.childOrderDetailDTOS[0].commodityConfirmDTOS[that.$route.params.index].totalPrice)
      that.refundMoneyTotal = parseFloat(that.data.childOrderDetailDTOS[0].commodityConfirmDTOS[that.$route.params.index].totalPrice)
      // 更新: 如果是最后一个商品的退款 退款最大金额加上运费
      var test = true
      that.data.childOrderDetailDTOS[0].commodityConfirmDTOS.forEach(function (item, index) {
        if (index != that.$route.params.index) {
          if (item.commodityRefundStatus === 'NONE') test = false
        }
      })
      if (test) {
        that.money += parseFloat(that.data.freightPrice)
        that.refundMoneyTotal += parseFloat(that.data.freightPrice)
      }
    },
    select () { // 弹出选择原因
      this.showCause = true
    },
    cancel () {  // 取消选择原因
      this.showCause = false
      this.cause = ''
      this.submitCause = ''
    },
    confirm () { // 确定原因
      this.showCause = false
    },
    selectCause (cont, cause) { // 原因选择
      this.cause = cause
      this.submitCause = cont
    },
    submit: _.debounce(function () {
      var that = this
      var params = {
        'orderId': that.data.id,
        'refundReason': that.submitCause, // 原因
        'refundPrice': that.money, // 退款金额
        'message': that.describeCont, // 信息
        'goodsId': [that.data.childOrderDetailDTOS[0].commodityConfirmDTOS[that.$route.params.index].orderCommodityId]
      }
      if (!that.submitCause) {
        that.$toast({message: '请选择退款原因', duration: 1000})
        return
      }
      if (!that.money) {
        that.$toast({message: '请输入退款金额', duration: 1000})
        return false
      }
      var reg = /^\d+(\.{0,1}\d+){0,1}$/
      if (!reg.test(that.money)) {
        that.$toast({message: '请输入正确金额', duration: 1000})
        return false
      }
      if (that.money > that.refundMoneyTotal) {
        that.$toast({message: '您最多退款' + that.refundMoneyTotal + '元', duration: 1000})
        return false
      }
      that.$loading.open()
      that.$axios.post('/order/app/refundMoney', params).then((res) => {
        if (res) { // 更改商品审核状态
          that.data.childOrderDetailDTOS[0].commodityConfirmDTOS[that.$route.params.index].commodityRefundStatus = 'AUDIT'
          window.localStorage.setItem('orderData', JSON.stringify(that.data))
          that.$loading.close()
          // 检测是否所有商品都已经退款 如果是 回到订单列表
          var test = true
          that.data.childOrderDetailDTOS[0].commodityConfirmDTOS.forEach(function (item) {
            if (item.commodityRefundStatus === 'NONE') {
              test = false
            }
          })
          test ? window.history.go(-3) : window.history.go(-1)
        }
      })
    }, 1000, {
      'leading': true,
      'trailing': false
    })
  }
}
</script>
<style lang="less" scoped>
@import "../../../../static/css/mine.less";
.infoData{
  .button{
    margin-right: .3rem;
  }
}
</style>