<template>
<mr-better-scroll ref="scroll" class="bg"
  :pullDownRefresh="true" @pullingDown="pullingDown"
  :pullUpLoad="true" @pullingUp="pullingUp">
  <div class="pageCont" v-if="orderList.length" v-on:touchmove.capture="ontouchmove">
    <mt-cell-swipe :key="index" class="orderInfo" v-for="(item,index) in orderList" :right="item.rightButton">
      <order-template :infoData="item" @getData="getData"></order-template>
    </mt-cell-swipe>
  </div>
  <div v-if="!orderList.length" class="no-news">还没有订单</div>
</mr-better-scroll>
</template>
<script>
import orderTemplate from './orderTemplate.vue'
export default{
  name: 'orderList',
  components: {
    orderTemplate
  },
  activated () {
    var that = this
    that.type = parseInt(that.$route.params.type)
    setTimeout(function () {
      that.getData(1)
    }, 500)
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
      var params = {
        'status': ''
      }
      if (that.type === 0) {
        params.status = 'ALL'
      } else if (that.type === 1) {
        params.status = 'OBLIGATION'
      } else if (that.type === 2) {
        params.status = 'WAITSEND'
      } else if (that.type === 3) {
        params.status = 'WAITRECEIVE'
      } else if (that.type === 4) {
        params.status = 'WAITCOMMENT'
      }
      that.$loading.open()
      return that.$axios.get(`/order/app/list/${params.status}?p=${pageNum}&c=10`).then((res) => {
        if (res) {
          if (pageNum === 1) that.orderList = []
          res.list.forEach(function (item, index) {
            item.rightButton = [{
              content: '删除',
              style: {background: 'red', color: '#fff'},
              handler: () => that.deleteItem(index, item, res.list)
            }]
          })
          that.orderList = that.orderList.concat(res.list)
          that.pageNum = pageNum
          that.allOrderCount = res.count
        }
        that.scroll && that.scroll.forceUpdate(true)
        that.$loading.close()
      })
    },
    ontouchmove () {
      if (this.scroll) {
        this.scroll.scroll.moved = true
      }
    },
    deleteItem (index, item, data) {
      var that = this
      that.$messageBox.confirm('确认删除?', '提示', {
        closeOnClickModal: true
      }).then(function () {
        that.$axios.get('/order/app/deleteorder/' + item.orderId + '/' + item.orderType).then((res) => {
          if (res) {
            that.getData(1).then()
            that.$toast({message: '删除成功', duration: 2000})
          }
        })
      }, function () {})
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
.mint-cell-swipe{
  margin-top: .2rem;
}
</style>