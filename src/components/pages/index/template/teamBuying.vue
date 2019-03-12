<template>
<swiper-scroller 
  ref="scroll"
  :pullDownRefresh="true"
  @pullingDown="pullingDown" 
  :pullUpLoad="true" 
  @pullingUp="pullingUp">
  <div v-if="teamBuyingData.id">
    <div class="banner">
      <img v-lazy="teamBuyingData.banner" class="services"/>
    </div>
    <div class="goods" v-for="teamGood in teamBuyingData.groupBuySkuDetailEntities">
      <dl>
        <router-link :to="'/goodsDetail/' + teamGood.skuId" tag="dl">
        <dt><img v-bind:src="teamGood.getAppSkuInfoDTO.url[0].url"/>
          <span class="fightingOut" v-if="teamGood.groupStock == 0"></span>
        </dt>
        </router-link>
        <dd>
          <router-link :to="'/goodsDetail/' + teamGood.skuId" tag="dl">
          <h4 class="goodsName">{{teamGood.getAppSkuInfoDTO.name}}</h4>
          </router-link>
          <div class="price">
            <router-link :to="'/goodsDetail/' + teamGood.skuId" tag="dl">
            <p class="owner">团购价 ￥{{teamGood.groupPrice | twoDecimal}}</p>
            <!-- <p class="selling">优选价 <span>￥{{teamGood.getAppSkuInfoDTO.originalPrice | twoDecimal}}</span></p>  -->
            <p class="left">仅剩{{teamGood.groupStock}}件</p>
            </router-link>
            <button class="button button-small button-red" v-if="teamGood.groupStock != 0" v-on:click="gotoTeamBuying(teamGood)">立即购买</button>
            <button class="button button-small button-gray" v-else>立即购买</button>
          </div>
        </dd>
      </dl>
    </div>
  </div>
  <div v-else class="no-news" style="color: gray;">甄选商品中，敬请期待</div>
</swiper-scroller>
</template>
<script>
import _ from 'lodash'
export default {
  data () {
    return {
      teamBuyingData: {} // 团购数据
    }
  },
  computed: {
    scroll () {
      return this.$refs.scroll
    }
  },
  created () {
    this.getTeamBuyingData()
  },
  methods: {
    getTeamBuyingData (callback) { // 获取团购数据
      var that = this
      that.$loading.open()
      that.$axios.get('/group/buy/get/app/groupbuy/index/info').then((res) => {
        if (res) that.teamBuyingData = res
        that.$loading.close()
        that.scroll && that.scroll.forceUpdate(true)
        setTimeout(() => {
          if (callback) {
            callback()
          }
        }, 500)
      })
    },
    gotoTeamBuying: _.debounce(function (good) { // 立即购买
      this.$router.push({path: '/goodsDetail/' + good.skuId})
    }, 500, {
      'leading': true,
      'trailing': false
    }),
    pullingDown () {
      this.getTeamBuyingData(() => {
        this.scroll.pulldownLoadEnd()
      })
    },
    pullingUp () {
      this.scroll.pulldownLoadEnd()
    }
  }
}
</script>
<style lang="less" scoped>
@import "../../../../../static/css/index.less";
@import "../../../../../static/css/activity.less";
</style>