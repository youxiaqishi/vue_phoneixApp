<template>
<swiper-scroller 
  ref="scroll"
  :pullDownRefresh="true"
  @pullingDown="pullingDown" 
  :pullUpLoad="true" 
  @pullingUp="pullingUp">
  <div v-if="groupShoppingData.id">
    <div class="banner">
      <img v-lazy="groupShoppingData.url" class="services"/>
    </div>
    <div class="goods" v-for="groupGood in groupShoppingData.goods">
      <dl>
        <router-link :to="'/goodsDetail/' + groupGood.commodifyId" tag="dl">
        <dt><img v-bind:src="groupGood.url[0].url"/>
          <span class="fightingOut" v-if="groupGood.inventoryQuantity == 0"></span>
        </dt>
        <dd>
          <h4 class="goodsName">{{groupGood.name}}</h4>
          <div class="price">
            <p class="owner">拼团价 ￥{{groupGood.regimentsPrice | twoDecimal}}</p>
            <!-- <p class="selling">优选价 <span>￥{{groupGood.originalPrice | twoDecimal}}</span></p>  -->
            <p class="left">还剩{{groupGood.inventoryQuantity}}件</p>
            <button class="button button-small button-red" v-on:click="gotoGroupShopping(groupGood)">去开团</button>
          </div>
        </dd>
        </router-link>
      </dl>
    </div>
  </div>
  <div v-if="!groupShoppingData.id" class="no-news" style="color: gray;">甄选商品中，敬请期待</div>
</swiper-scroller>
</template>
<script>
export default {
  data () {
    return {
      groupShoppingData: {} // 拼团数据
    }
  },
  computed: {
    scroll () {
      return this.$refs.scroll
    }
  },
  created () {
    this.getGroupShoppingData()
  },
  methods: {
    getGroupShoppingData (callback) { // 获取拼团数据
      var that = this
      that.$loading.open()
      that.$axios.get('/spell/group/query').then((res) => {
        if (res) {
          that.groupShoppingData = res
        }
        that.$loading.close()
        that.scroll && that.scroll.forceUpdate(true)
        setTimeout(() => {
          if (callback) {
            callback()
          }
        }, 500)
      })
    },
    gotoGroupShopping (good) { // 去开团
      this.$router.push({path: '/goodsDetail/' + good.commodifyId})
    },
    pullingDown () {
      this.getGroupShoppingData(() => {
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