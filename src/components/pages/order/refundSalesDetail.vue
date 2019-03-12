<template>
<div class="page">
  <m-header>
    <span slot="left"></span>
    <span slot="title">{{title}}</span>
  </m-header>
  <div class="page-content padding-top">
    <div class="orderInfo">
      <p>订单编号：<span class="gray">{{data.orderNo}}</span></p>
      <p>退单编号：<span class="gray">{{data.refundNo}}</span></p>
    </div>
    <div class="goodsList" >
      <dl class="infoData" v-for="item in data.orderCommodityInfoDTOS">
        <dt><img v-lazy="item.url"/></dt>
        <dd>
          <h3>{{item.commodityName}}  
            <br />
          </h3>
          <div class="price">
            <p class="owner">业主价：<span>￥{{item.privilegePrice | twoDecimal}}</span> </p>
            <p class="selling">优选价：<span>￥{{item.originPrice | twoDecimal}}</span> </p>
          </div>
          <div class="nums">x {{item.count}}</div>
        </dd>
      </dl>
    </div>
    <ul class="log">
      <li v-for="item in data.refundLogDTOS">
        <span><i></i></span>
<!--          <div class="inline" v-if="item.refundOrderStatus=='PLATFORMAUDIT'">平台审核中</div>
        <div class="inline" v-if="item.refundOrderStatus=='PLATFORMREFUSE'">平台拒绝</div>
        <div class="inline" v-if="item.refundOrderStatus=='MALLAUDIT'">商家审核中</div>
        <div class="inline" v-if="item.refundOrderStatus=='MALLREFUSE'">商家拒绝</div>
        <div class="inline" v-if="item.refundOrderStatus=='FINANCIALAUDIT'">财务审核中</div>
        <div class="inline" v-if="item.refundOrderStatus=='FINANCIALREFUSE'">财务拒绝</div>
        <div class="inline" v-if="item.refundOrderStatus=='REFUNDFINISH'">退单完成</div>
         -->
        <div class="inline" v-if="item.refundOrderStatus=='PLATFORMAUDIT'">申请{{refund}}审核</div>
        <div class="inline" v-if="item.refundOrderStatus=='PLATFORMREFUSE'">平台拒绝{{refund}}</div>
        <div class="inline" v-if="item.refundOrderStatus=='MALLAUDIT'">平台同意退货</div>
        <div class="inline" v-if="item.refundOrderStatus=='MALLREFUSE'">商家拒绝退货</div>
        <div class="inline" v-if="item.refundOrderStatus=='FINANCIALAUDIT'">
          <i v-if="refund == '退款'">平台同意退款</i>
          <i v-if="refund == '退货'">商家同意退货</i>
        </div>
        <div class="inline" v-if="item.refundOrderStatus=='FINANCIALREFUSE'">财务拒绝退款</div>
        <div class="inline" v-if="item.refundOrderStatus=='REFUNDFINISH'">退款成功</div>


        <div class="inline" v-if="item.refundOrderStatusLogRole == 'USER'">(操作：顾客)</div>
        <div class="inline" v-if="item.refundOrderStatusLogRole == 'PLATFORM'">(操作：平台)</div>
        <div class="inline" v-if="item.refundOrderStatusLogRole == 'MALL'">(操作：商家)</div>

        <br/>
        {{item.createTime}}
      </li>
    </ul>
    <div class="list">
      <div class="listItem">
        退款金额<span>￥{{data.price | twoDecimal}}</span>
      </div>
      <div class="listItem">
        {{refundReason}}
        <span v-if="data.reason == 'NOBUY'">不买了</span>
        <span v-if="data.reason == 'QUALITY'">质量问题</span>
        <span v-if="data.reason == 'RECEIVEERROR'">收货信息错误</span>
        <span v-if="data.reason == 'STOCKOUT'">商家缺货</span>
        <span v-if="data.reason == 'OTHER'">其他</span>
      </div>
      <div class="listItem">
        问题说明<span>{{data.message}}</span>
      </div>        
    </div>
  </div>
</div>
</template>
<script>
export default{
  data () {
    return {
      data: {},
      title: '', // 标题
      refundReason: '', // 退款/退货原因
      type: '', // 退款/退货
      refundOrderId: '', // 订单Id
      showCause: false // 原因选择
    }
  },
  activated () {
    var that = this
    that.title = that.$route.params.type === 0 ? '退款详情' : '退货详情'
    that.refundReason = that.$route.params.type === 0 ? '退款原因' : '退货原因'

    that.refund = that.$route.params.type === 0 ? '退款' : '退货'

    that.type = that.$route.params.type
    that.refundOrderId = that.$route.params.refundOrderId
    that.getData()
  },
  methods: {
    getData () { // 退款详情
      var that = this
      that.$loading.open()
      that.$axios.get('/order/app/refund/detail/' + that.refundOrderId).then((res) => {
        if (res) {
          that.$loading.close()
          that.data = res
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.gray{
  color: #929999;
}
.red{
  color: #89262a;
}
.page-content{
  background: #fafafa;
  .orderInfo{
    padding:.25rem;
    background: #fff;
    margin:.3rem 0;
    font-size: .28rem;
    line-height: .5rem;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
    span{
      font-size: .28rem;
    }
  } 
  .goodsList{
    background: #fff;
    border-top: 1px solid #eee;
    .infoData{
      border-bottom: 1px solid #eee;
      padding:.2rem 0;
      dd{
        width: 4.6rem;
        .price{
          position: relative;
          top:.2rem;
        }       
      }
    }
  }
  .log{
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
    background: #fff;
    margin:.3rem 0;
    padding-top:.3rem;
    li{
      width: 100%;
      font-size: .26rem;
      color: #666666;
      padding:0 .25rem .25rem .7rem;
      position: relative;
      span{
        position: absolute;
        top:.1rem;
        left: .3rem;
        width: .22rem;
        height: .22rem;
        border-radius: .22rem;
        border:2px solid #89262a;
        display: block;
/*        i{
          height: .14rem;
          width: .14rem;
          background: #89262a;
          display: block;
          margin:0.02rem;
          border-radius: .13rem;
        }*/
      }
      .inline{
        display: inline-block;
      }
    }
  }
  .list{
    margin: .3rem 0;
    border-top: 1px solid #eee;
    background: #fff;
    .listItem{
      border-bottom: 1px solid #eee;
      padding:0 .25rem;
      line-height: .9rem;
      font-size: .28rem;
      overflow: hidden;
      position: relative;
      span{
        width: 5rem;
        /*height: .9rem;*/
        text-align: right;
        line-height: .9rem;
        color: #666666;
        float: right;
        top:0;
      }
    }   
  }

}

</style>
