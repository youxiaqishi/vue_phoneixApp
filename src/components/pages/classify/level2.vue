<template>
  <div>
    <mr-better-scroll ref="scroll" class="rightCont"
    :pullDownRefresh="true" @pullingDown="pullingDown"
    :pullUpLoad="true" @pullingUp="pullingUp">
      <router-link :to="'/goodsDetail/' + cont.skuId" tag="dl" class="infoData" v-for="cont in goods" :key="cont.skuId">
        <dt><img v-bind:src="cont.url"/><span class="sellOut" v-show="cont.sellOut"></span></dt>
        <dd>
          <h3>{{cont.name}}<br/>
          </h3>
          <div class="price" :class="{priceAdd: appUserType != 'notLogin'}">
            <p class="owner" :class="{sellingAdd: appUserType != 'notLogin'}" v-if="appUserType == 'notLogin' || appUserType == 'OWNER' || appUserType == 'STAFF'">业主价：<span>￥{{cont.onwerPrice | twoDecimal}}</span> </p>
            <p class="selling" :class="{sellingAdd: appUserType != 'notLogin'}" v-if="appUserType == 'notLogin' || appUserType == 'GENERAL'">优选价：<span>￥{{cont.originalPrice | twoDecimal}}</span></p>
          </div>
        </dd>
      </router-link>
    </mr-better-scroll>
  <div v-show="!goods.length" class="no-news" style="color: gray;margin-left: 3rem;">甄选商品中，敬请期待</div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      goods: [],
      pageNum: 1, // 页码
      appUserType: '', // 用户身份
      goodsAllCount: 100000000 // 初始化时商品数未知，先设置一个较大的值
    }
  },
  computed: {
    scroll () {
      return this.$refs.scroll
    },
    ...mapState('currentShopInfo', ['shopId'])
  },
  activated () {
    window.$getLocalstorage('userInfo') ? this.appUserType = window.$getLocalstorage('userInfo').appUserType : this.appUserType = 'notLogin' // 身份标识
    this.getGoodsData(1)
  },
  methods: {
    getGoodsData (pageNum) {
      var params = {
        'shopId': 11,
        'categoryId': this.$route.params.level2Id
      }
      return this.$axios.post(`/app/shop/get/all/myshop/sku/info?p=${pageNum}&c=10`, params).then((res) => {
        if (res) {
          if (pageNum === 1) this.goods = []
          res.list.forEach((item) => {
            this.goods.push(item)
          })
          this.goodsAllCount = res.count
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
.inputStyle {
  color: #666;
  width: 77%;
  margin-left: 10%;
}
.leftCont{
  width: 1.8rem;
  padding-right:.2rem;
  float: left;
  overflow-y: scroll;
  li{
    width:100%;
    height: 1.2rem;
    line-height: 1.2rem;
    font-size: .28rem;
    color: #929999;
    text-align: center;
  }
  .curClass{
    color: #89262a!important;
  }
}
.scroll1 {
    position: absolute;
    top: 0.9rem;
    right: 0;
    bottom: 0;
    left: 0;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
}
.scroll-inner1 {
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
}
.rightCont{
  position: absolute;
  left: 1.6rem!important;
  width: 5.9rem!important;
  .infoData{
    height: 2.4rem;
    border-bottom: 1px solid #eee; 
    dd{
      width: 3rem;
      padding:.2rem 0;
      height: 2.4rem;
      position: relative;
      .describe{
        font-size: .24rem;
        line-height: .1rem;
      }
      .price{
        position: absolute;
        bottom: .1rem;
      }
      .priceAdd{
        bottom: .4rem;
      }
    }
    dt{
      width: 2.4rem;
      height: 2.4rem;
    }
  }
}
.otherStyle{
  overflow: hidden;
  padding:.24rem .24rem 0 .24rem;
}
.no-news{
  position: absolute;
}
</style>
