<template>
<swiper-scroller ref="scroll"
  :pullDownRefresh="true" @pullingDown="pullingDown"
  :pullUpLoad="true" @pullingUp="pullingUp">
  <div class="cont" v-if="otherData.length > 0">
    <div class="youLike otherStyle">
      <div class="goodsList">
        <router-link :to="'/goodsDetail/' + item.skuId" tag="dl" :key="item.skuId" v-for="item in otherData" class="goods">
          <dt><img v-lazy="item.url"/></dt>
          <dd>
            <h3 class="goodsName">{{item.name}}</h3>
            <p class="owner" :class="{sellingAdd: appUserType != 'notLogin'}" v-if="(item.activityInfoDTO.type == 'COMMON' || item.activityInfoDTO.type == 'BUY_PRESENT' || item.activityInfoDTO.type == 'SPECIAL' || item.activityInfoDTO.type == 'GIVE' || item.activityInfoDTO.type == 'DISCOUNT') && (appUserType == 'notLogin' || appUserType == 'OWNER' || appUserType == 'STAFF')">业主价<span>￥{{item.onwerPrice | twoDecimal}}</span></p>
            <p class="selling" :class="{sellingAdd: appUserType != 'notLogin'}" v-if="(item.activityInfoDTO.type == 'COMMON' || item.activityInfoDTO.type == 'BUY_PRESENT' || item.activityInfoDTO.type == 'SPECIAL' || item.activityInfoDTO.type == 'GIVE' || item.activityInfoDTO.type == 'DISCOUNT') && (appUserType == 'notLogin' || appUserType == 'GENERAL')">优选价￥{{item.originalPrice | twoDecimal}}</p>
            <p class="owner sellingAdd" v-if="item.activityInfoDTO.type == 'SECKILL'">秒杀价：<span>￥{{item.activityInfoDTO.activityPrice | twoDecimal}}</span> </p>
            <p class="owner sellingAdd" v-if="item.activityInfoDTO.type == 'FLASH_SALE'">限时价：<span>￥{{item.activityInfoDTO.activityPrice | twoDecimal}}</span> </p>
            <p class="owner sellingAdd" v-if="item.activityInfoDTO.type == 'GROUP'">拼团价：<span>￥{{item.activityInfoDTO.activityPrice | twoDecimal}}</span> </p>
            <p class="owner sellingAdd" v-if="item.activityInfoDTO.type == 'PRESELL'">预售价：<span>￥{{item.activityInfoDTO.activityPrice | twoDecimal}}</span> </p>
            <p class="owner sellingAdd" v-if="item.activityInfoDTO.type == 'GROUPBUY'">团购价：<span>￥{{item.activityInfoDTO.activityPrice | twoDecimal}}</span> </p>
            <p class="owner sellingAdd" v-if="item.activityInfoDTO.type == 'SPECIALOFFER'">特价：<span>￥{{item.activityInfoDTO.activityPrice | twoDecimal}}</span> </p>
          </dd>
        </router-link>
      </div>
    </div>
  </div>
  <div v-if="otherData.length == 0" class="no-news" style="color: gray;">甄选商品中，敬请期待</div>
</swiper-scroller>    
</template>
<script>
export default {
  name: 'typeTemplate',
  props: [
    'id'
  ],
  data () {
    return {
      appUserType: '', // 用户身份
      otherData: [],
      allOrderCount: 10000, // 数据总数
      pageNum: 1 // 页码
    }
  },
  components: {
  },
  computed: {
    orderCount () {
      return this.otherData.length
    },
    hasData () {
      return this.orderCount < this.allOrderCount
    },
    scroll () {
      return this.$refs.scroll
    }
  },
  created () {
    window.$getLocalstorage('userInfo') ? this.appUserType = window.$getLocalstorage('userInfo').appUserType : this.appUserType = 'notLogin' // 身份标识
    this.getList(1)
  },
  methods: {
    pullingDown () { // 下拉刷新
      this.getList(1, () => {
        this.scroll.pulldownLoadEnd()
      })
    },
    pullingUp () { // 下拉加载
      this.getList(this.pageNum + 1, () => {
        if (this.scroll) {
          this.scroll.pullUpLoadEnd()
        }
      })
    },
    getList (pageNum, callback) { // 获取数据
      var params = {
        'shopId': this.getLocalstorage('shopId'),
        'categoryId': this.id
      }
      var that = this
      that.$axios.post(`/app/shop/get/all/myshop/sku/info?p=${pageNum}&c=10`, params).then((res) => {
        if (pageNum === 1) that.otherData = []
        if (res) {
          if (res.list.length > 0) {
            that.pageNum = pageNum
            that.otherData.push(...res.list)
            if (res.count > that.otherData.length) {
              that.scroll.forceUpdate(true) // 有数据（下方出现loading）
            } else {
              that.scroll.forceUpdate(false) // 无数据 （出现 没有更多数据）
            }
          } else {
            that.scroll.forceUpdate(false) // 无数据 （出现 没有更多数据）
          }
          setTimeout(() => {
            if (callback) {
              callback()
            }
          }, 500)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import "../../../../../static/css/index.less";
/*@import "../../../../../static/css/activity.less";*/
</style>