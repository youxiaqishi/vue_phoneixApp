<template>
  <div class="page-content hasTopTabs">
    <div class="cont">
      <mr-better-scroll ref="scroll"
      :pullDownRefresh="true" @pullingDown="pullingDown"
      :pullUpLoad="true" @pullingUp="pullingUp">
        <div class="otherStyle">
          <div class="goodsList">
            <router-link :to="'/goodsDetail/' + item.skuId" tag="dl" :key="item.skuId" v-for="item in goods" class="goods">
              <dt><img v-bind:src="item.url"/></dt>
              <dd>
                <h3 class="goodsName">{{item.name}}</h3>
                <p class="owner" :class="{sellingAdd: appUserType != 'notLogin'}" v-if="appUserType == 'notLogin' || appUserType == 'OWNER' || appUserType == 'STAFF'">业主价<span>￥{{item.onwerPrice | twoDecimal}}</span></p>
                <p class="selling" :class="{sellingAdd: appUserType != 'notLogin'}" v-if="appUserType == 'notLogin' || appUserType == 'GENERAL'">优选价￥{{item.originalPrice | twoDecimal}}</p>
              </dd>
            </router-link>
          </div>
        </div>
      </mr-better-scroll>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      goods: [],
      pageNum: 1,
      appUserType: '', // 用户身份
      goodsAllCount: 100000000 // 初始化时商品数未知，先设置一个较大的值
    }
  },
  computed: {
    scroll () {
      return this.$refs.scroll
    },
    hasOtherGoods () {
      return this.goodsAllCount > this.goods.length
    },
    ...mapState('currentShopInfo', ['shopId'])
  },
  activated () {
    window.$getLocalstorage('userInfo') ? this.appUserType = window.$getLocalstorage('userInfo').appUserType : this.appUserType = 'notLogin' // 身份标识
    this.getGoodsData(1)
  },
  methods: {
    getGoodsData (pageNum) {
      var params1 = {
        'shopId': this.shopId,
        'skuName': '',
        'price': '',
        'sale': ''
      }
      return this.$axios.post(`/app/shop/get/myshop/sku/info/search?p=${pageNum}&c=10`, params1).then((res) => {
        if (res) {
          if (pageNum === 1) this.goods = []
          res.list.forEach((item) => {
            this.goods.push(item)
          })
          this.goodsAllCount = res.count
          this.pageNum = pageNum
        }
      })
    },
    pullingDown () { // 下拉
      this.getGoodsData(1).then(() => { this.scroll.forceUpdate(this.hasOtherGoods) })
    },
    pullingUp () { // 上拉
      if (this.hasOtherGoods) {
        this.getGoodsData(this.pageNum + 1).then(() => { 
          this.scroll.forceUpdate(this.hasOtherGoods)
        })
      } else {
        this.scroll.forceUpdate(false)
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import "../../../../static/css/index.less";
/*.scroll1 {
    position: absolute;
    top: 0.9rem;
    right: 0;
    bottom: 0;
    left: 0;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
}*/
/*.scroll-inner1 {
    position: absolute;
    top: 0;
    right:.15rem;
    width: 100%;
    transition-duration: 300ms;
    margin: 0;
    padding: 0;
    border: 0;
    vertical-align: baseline;
    font: inherit;
    font-size: 100%;
}*/
.otherStyle{
  overflow: hidden;
  padding:.24rem .24rem 0 .24rem;
}
</style>
