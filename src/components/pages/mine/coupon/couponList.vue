<template>
<mr-better-scroll ref="scroll"
  :pullDownRefresh="true" @pullingDown="pullingDown"
  :pullUpLoad="true" @pullingUp="pullingUp">
  <div v-if="couponList.length">
    <div class="orderInfo" :class="{'lapse':item.type == 'no'}" v-for="(item,index) in couponList">
      <div class="orderPrice">
        <p>{{item.money}}<span class="money">元</span>
          <span v-if="item.usableRange=='SHOP'">商铺使用</span>
          <span v-if="item.usableRange=='PLATFORM'">全平台使用</span>
        </p>
        <div class="status" v-if="item.type != 'no'">
          <span v-if="item.status == 1">已领取</span>
          <span v-if="item.status == 2">已使用</span>
        </div>
        <div class="status" v-if="item.type == 'no'">已失效</div>
      </div>
      <p class="conditions">使用条件: 
        <span v-if="item.usableRange=='SHOP'">仅限商铺使用</span>
        <span v-if="item.usableRange=='PLATFORM'">无限制</span>
        </br>截止日期: <span>{{item.validEndTime}}</span>
      </p>
    </div>
  </div>    
  <div class="no-coupon" v-if="!couponList.length"><p>暂无优惠券 <br/>保持关注哦</p></div>
</mr-better-scroll>
</template>
<script>
export default{
  data () {
    return {
      couponList: [],
      allCouponCount: 10000, // 数据总数
      pageNum: 1 // 页码
    }
  },
  activated () {
    this.type = parseInt(this.$route.params.type)
    this.getData(1)
  },
  computed: {
    couponCount () {
      return this.couponList.length
    },
    hasData () {
      return this.couponCount < this.allCouponCount
    },
    scroll () {
      return this.$refs.scroll
    }
  },
  methods: {
    getData (pageNum) {
      var that = this
      var params = {
        'status': that.type + 1
      }
      that.$loading.open()
      return that.$axios.post('/app/coupon/query/user/coupon?p=' + pageNum + '&c=10', params).then((res) => {
        if (res) {
          that.$loading.close()
          if (pageNum === 1) that.couponList = []
          that.couponList = that.couponList.concat(res.list)
          that.pageNum = pageNum
          that.allCouponCount = res.count
        }
        that.scroll && that.scroll.forceUpdate(true)
      })
    },
    pullingDown () {
      this.getData(1).then()
    },
    pullingUp () {
      if (this.hasData) this.getData(this.pageNum + 1).then()
      if (!this.hasData) this.scroll.forceUpdate(false)
    }
  }
}
</script>
<style lang="less" scoped>
.page-content{
  margin-bottom: 1rem;
}
.orderInfo{
  height: 2.5rem;
  margin: .3rem .2rem .3rem .2rem;
  color: white;
  padding: 0 .2rem;
  border-radius: 2px;
  position: relative;
  .orderPrice{
    height: 1.5rem;
    p{
      font-size: .8rem;
      color: #89262a;
      span{
        font-size: .36rem;
        color: #1a191e;
      }
      span.money{
        font-size: .28rem;
        margin-right: .4rem;
        color: #89262a;
      }
    }
    .status{
        position: absolute;
        right: .3rem;
        top: .5rem;
        font-size: .28rem;
        color: #89262a;
    }
  }
  .conditions{
    color: #929999;
    font-size: .28rem;
  }
}
.lapse{
  .orderPrice{
    p{
      color: #626666;
      span{
        color: #929999;
      }
      span.money{
        color: #626666;
      }
    }
    .status{
        color: #626666;
    }
  }
}
.ctBottom {
    position: fixed;
    bottom: 0.3rem;
    height: 0.98rem;
    width: 100%;
}
.noCoupon{
  width: 100%;
    text-align: center;
    margin-top: 1.4rem;
    height: 2.5rem;
    margin: 0 auto 0.3rem;
    background: none; 
    display: block;
    img{
      width: 3.1rem;
      height: 3.52rem;
      margin-top: 2rem;
      background-color: gray;
    }
    p{
      margin-top: 25px;
      font-size: 0.3rem;
      color: #323333 !important;
      line-height: normal;
      padding: 0;
    }
    span{
      font-size: 0.24rem;
      color: #929999;
      margin-top: 0.28rem;
      display: block;
    }
}
</style>
