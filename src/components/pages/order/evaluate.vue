<template>
  <div class="page">
    <m-header>
      <span slot="left"></span>
      <span slot="title">填写评价</span>
    </m-header>
    <div class="page-content">
      <div class="Info_center" v-if="orderData.childOrderDetailDTOS[0]">
        <dl class="infoData" v-for="item in orderData.childOrderDetailDTOS[0].commodityConfirmDTOS" :key="item.id">
          <dt><img v-lazy="item.url"/></dt>
          <dd>
            <h3>{{item.commodityName}}<br /></h3>
            <p class="owner"><span>￥{{item.totalPrice | twoDecimal}}</span> </p>
            <button class="button button-small button-red evaluate" v-if="item.childOrderCommodityAppraiseStatus == 'NOT'" v-on:click="evaluate(item)">评价</button>
            <button class="button button-small button-gray evaluate" v-if="item.childOrderCommodityAppraiseStatus == 'ALREADY'">已评价</button>
          </dd>
        </dl>
      </div>
      <div class="grade" :class="{gradeAdd: isSubmit}">
        <h4>订单评价 
          <span v-if="!isSubmit">满意请给五星哦</span>
          <span v-else>已完成</span>
        </h4>
        <div class="gradeItem" v-if="!isSubmit">
          服务态度:   <p> <i v-for="i in [1,2,3,4,5]" class="gradeStar" :key="i" v-on:click="changeStar(i,1)" :class="{'gradeStar1':i <= seller}"></i></p>
        </div>
        <div class="gradeItem" v-if="!isSubmit">
          物流服务:   <p> <i v-for="i in [1,2,3,4,5]" class="gradeStar" :key="i" v-on:click="changeStar(i,2)" :class="{'gradeStar1':i <= logistics}"></i></p>
        </div>
        <button class="button button-small button-red submit" v-if="!isSubmit" v-on:click="submit()">提交</button>
        <!-- <button class="button button-small button-gray submit" v-if="isSubmit">已提交</button> -->
      </div>
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
export default{
  data () {
    return {
      orderData: {childOrderDetailDTOS: []},
      isSubmit: false,
      seller: 0, // 服务分数
      logistics: 0 // 物流分数
    }
  },
  activated () {
    this.getData()
  },
  created () {
  },
  methods: {
    getData () {
      // 在这里调用查询订单详情的接口拿到该订单数据
      var that = this
      window.eventBus.$emit('tabIndex', that.$route.params.index)
      that.$loading.open()
      that.$axios.get('/order/app/orderDetail/' + that.$route.params.orderId + '/' + that.$route.params.orderType).then((res) => {
        if (res) {
          that.$loading.close()
          that.orderData = res
          // 获取订单分数
          var params = {
            'shopId': that.orderData.childOrderDetailDTOS[0].shopId,
            'commentariesOrderId': that.$route.params.orderId
          }
          that.$axios.post('/shop/Appraise/query/order/star', params).then((res) => {
            if (res[0]) {
              that.seller = res[0].serviceScore
              that.logistics = res[0].logisticsScore
              that.isSubmit = true
            }
          })
        }
      })
    },
    evaluate (info) {
      this.$router.push({path: '/evaluateGood/' + this.$route.params.orderId + '/' + info.commodityId + '/' + this.orderData.childOrderDetailDTOS[0].shopId + '/' + info.totalPrice})
    },
    changeStar (i, type) { // 分数
      // UPDATE: 如果已提交不能改星星
      if (this.isSubmit) return
      if (type === 1) {
        this.seller = i
      } else if (type === 2) {
        this.logistics = i
      }
    },
    submit: _.debounce(function (info) { // 提交
      var that = this
      // UPDATE 如果商品没有评价完则不允许评价订单
      // var isDone = true
      // that.orderData.childOrderDetailDTOS[0].commodityConfirmDTOS.forEach(function (item) {
      //   if (item.childOrderCommodityAppraiseStatus === 'NOT') {
      //     isDone = false
      //   }
      // })
      // if (!isDone) {
      //   that.$toast({message: '请先完成商品评价', duration: 800})
      //   return false
      // } else
      if (!that.seller) {
        that.$toast({message: '请先打分', duration: 800})
        return false
      } else if (!that.logistics) {
        that.$toast({message: '请先打分', duration: 800})
        return false
      }
      var params = {
        'shopId': that.orderData.childOrderDetailDTOS[0].shopId,
        'commentariesOrderId': that.$route.params.orderId,
        'logisticsScore': that.logistics,
        'serviceScore': that.seller
      }
      that.$axios.post('/shop/Appraise/query/order/add', params).then((res) => {
        // 不可提交
        that.isSubmit = true
      })
    }, 1000, {
      'leading': true,
      'trailing': false
    })
  }
}
</script>
<style lang="less" scoped>
.page-content{
  background: #fafafa;
  .Info_center{
    overflow: hidden;
    padding:.2rem .2rem;
    .infoData{
      margin-bottom: .2rem;
      h3{
        margin-top: .2rem;
      }
      dd{
        width: 4.8rem;
      }
      .evaluate{
        float: right;
        margin-top: .4rem;
      }
      .owner{
        color: #89262a;
        font-size: .32rem;
        margin-top: .3rem;
        width: 30%;
        float: left;
      }
    }
  }
  .grade{
    height: 3.3rem;
    background: #fff;
    border-bottom: 1px solid #eee;
    margin-bottom: .3rem;
    padding:.3rem .24rem;
    font-size: .3rem;
    color: #333;
    p{
      width: 4rem;
      margin-left: 1.6rem;
    }
    h4{
      height: .9rem;
      line-height: .9rem;
      font-size: .32rem;
      font-weight: 500;
      span{
        float: right;
        color: gray;
      }
    }
    .gradeItem{
      height: .6rem;
      line-height: .6rem;
      p{
        display: inline-block;
        position: absolute;
        margin-left: 0.9rem;
      }
    }
    .submit{
      float: right;
    }
  }
  .gradeAdd{
    height: 1.5rem;
  } 
}
.gray{
  color: #929999;
}
.red{
  color: #89262a;
}
</style>
