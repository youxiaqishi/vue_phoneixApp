<template>
  <div class="orderInfo">
    <div class="info_top">
      订单号：{{infoData.orderNo}} 
      <span v-if="infoData.orderStatusForApp == 'REFUNDMONEY'&&(infoData.refundOrderStatus == 'PLATFORMAUDIT'||infoData.refundOrderStatus == 'MALLAUDIT'||infoData.refundOrderStatus == 'FINANCIALAUDIT')">退款审核中</span>
      <span v-if="infoData.orderStatusForApp == 'REFUNDGOODS'&&(infoData.refundOrderStatus == 'PLATFORMAUDIT'||infoData.refundOrderStatus == 'MALLAUDIT'||infoData.refundOrderStatus == 'FINANCIALAUDIT')">退货审核中</span>
      <span v-if="infoData.orderStatusForApp == 'REFUNDMONEY'&&(infoData.refundOrderStatus == 'PLATFORMREFUSE'||infoData.refundOrderStatus == 'MALLREFUSE'||infoData.refundOrderStatus == 'FINANCIALREFUSE')">退款驳回</span>
      <span v-if="infoData.orderStatusForApp == 'REFUNDGOODS'&&(infoData.refundOrderStatus == 'PLATFORMREFUSE'||infoData.refundOrderStatus == 'MALLREFUSE'||infoData.refundOrderStatus == 'FINANCIALREFUSE')">退货驳回</span>
      <span v-if="infoData.orderStatusForApp == 'REFUNDGOODS'&&infoData.refundOrderStatus == 'REFUNDFINISH'">退货完成</span>
      <span v-if="infoData.orderStatusForApp == 'REFUNDMONEY'&&infoData.refundOrderStatus == 'REFUNDFINISH'">退款完成</span>
    </div>
    <div class="Info_center" >
      <dl class="infoData" v-for="(item1,index) in infoData.orderCommodityInfoDTOS" :key="index">
        <dt v-on:click="onItemClick(infoData)"><img v-bind:src="item1.url"/></dt>
        <dd v-on:click="onItemClick(infoData)">
          <h3>{{item1.commodityName | maxLength}}<br/></h3>
          <div class="price">
            <p class="owner">业主价：<span>￥{{item1.originPrice | twoDecimal}}</span> </p>
            <p class="selling">零售价：<span>￥{{item1.privilegePrice | twoDecimal}}</span></p>
          </div>
          <div class="nums">x {{item1.count}}</div>
        </dd>
        <button v-if="infoData.orderStatusForApp == 'REFUNDMONEY'" v-on:click="refundSalesDetail(item1, 0)" class="button button-small button-gray">退款详情</button>
      </dl>
    </div>
    <div class="Info_bottom">
      <p class="allPrice">实付: <span>￥{{infoData.realPrice | twoDecimal}}</span>  </p>
      <div class="btns">
        <button v-if="infoData.orderStatusForApp == 'REFUNDGOODS'" v-on:click="refundSalesDetail(infoData, 1)" class="button button-small button-gray">退货详情</button>
      </div>          
    </div>
  </div>
</template>
<script>
const orderStatusDict = {
  OBLIGATION: '待付款',
  WAITRECEIVE: '待收货',
  WAITCOMMENT: '待评价',
  WAITSEND: '待发货',
  REFUNDMONEY: '退款中',
  REFUNDGOODS: '退货中',
  CANCEL: '已取消',
  REFUNDFINISH: '退款完成',
  COMPLETED: '已完成',
  REFUNDREJECT: '驳回',
  ACTIVITYING: '活动进行中'
}
export default {
  props: [
    'infoData',
    'tabIndex'
  ],
  data () {
    return {
    }
  },
  computed: {
    orderStatus () {
      return orderStatusDict[this.infoData.orderStatusForApp]
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    onItemClick: function (info) { // 订单详情
      this.$router.push({path: '/orderDetails/' + this.tabIndex + '/' + info.orderId + '/' + info.orderType})
    },
    refundSalesDetail: function (info, type) { // 退货退款详情
      if (type === 1) { // 退货
        this.$router.push({name: 'refundSalesDetail', params: {refundOrderId: info.refundOrderId, type: 1}})
      } else { // 退款
        this.$router.push({name: 'refundSalesDetail', params: {refundOrderId: info.refundOrderId, type: 0}})
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .orderInfo{
    background: #fff;
    margin:.2rem 0;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
    background: #fff;
    color: #323333;
    padding: 0 .3rem .1rem .3rem;
    overflow: hidden;
    p{
      margin:0;
      padding:0;
    }
    .info_top{
      height: .6rem;
      line-height: .6rem;
      font-size: .28rem;
      clear: both;
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
      padding:.2rem 0;
    }

    .Info_bottom{
      border-top:1px solid #eee;
      padding-top: .1rem;
      clear: both;
      .allPrice{
        float: left;
        span{
          font-size: .28rem;
          font-weight: bold;
        }
      }
      .btns{
        float: right;
      }
    }
  }
</style>
