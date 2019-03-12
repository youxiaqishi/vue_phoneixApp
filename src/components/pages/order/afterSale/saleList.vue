<template>
<mr-better-scroll ref="scroll" class="bg"
  :pullDownRefresh="true" @pullingDown="pullingDown"
  :pullUpLoad="true" @pullingUp="pullingUp">
  <div class="pageCont" v-if="orderList.length" >
    <div class="orderInfo" v-for="(item,index) in orderList">
      <sale-template :infoData="item"></sale-template>
    </div>
  </div>
  <div v-if="!orderList.length" class="no-news">还没有订单</div>
</mr-better-scroll>
</template>
<script>
import saleTemplate from './saleTemplate.vue'
export default{
  name: 'saleList',
  components: {
    saleTemplate
  },
  created () {
    this.type = parseInt(this.$route.params.type)
    this.getData(1)
  },
  computed: {
    orderCount () {
      return this.orderList.length
    },
    hasData () {
      return this.orderCount < this.allOrderCount
    },
    scroll () {
      return this.$refs.scroll
    }
  },
  data () {
    return {
      type: 0,
      orderList: [],
      allOrderCount: 10000, // 数据总数
      pageNum: 1 // 页码
    }
  },
  methods: {
    getData (pageNum) {
      var that = this
      var params = 'ALL'
      if (that.type === 2) {
        params = 'REFUNDGOODS'
      } else if (that.type === 1) {
        params = 'REFUNDMONEY'
      }
      return that.$axios.get(`/order/app/refund/list/${params}?p=${pageNum}&c=10`).then((res) => {
        if (res) {
          if (pageNum === 1) that.orderList = []
          that.orderList = that.orderList.concat(res.list)
          that.pageNum = pageNum
          that.allOrderCount = res.count
        }
        that.$loading.close()
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
