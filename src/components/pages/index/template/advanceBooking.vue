<template>
<swiper-scroller 
  ref="scroll"
  :pullDownRefresh="true"
  @pullingDown="pullingDown" 
  :pullUpLoad="true" 
  @pullingUp="pullingUp">
  <div v-if="advanceBookingData.id && currentTime">
    <div class="banner">
      <img v-lazy="advanceBookingData.url" class="services"/>
    </div>
    <div class="timeLeft">
      <timer class="time killStyle" :current-time="currentTime" :start-time="advanceBookingData.startTime" :end-time="advanceBookingData.endTime" v-on:start_callback="timerStart(3)" v-on:end_callback="timerEnd(3)" :tipText="'距离开始时间还剩'" :tipTextEnd="'距离结束时间还剩'" :endText="'活动已结束'" :dayTxt="'天'" :hourTxt="'时'" :minutesTxt="'分'" :secondsTxt="'秒'" :secondsFixed="true"></timer>
    </div>
    <div class="goods" v-for="bookingGood in advanceBookingData.goodsEntityList">
      <dl>
        <router-link :to="'/goodsDetail/' + bookingGood.commodifyId" tag="dl">
        <dt><img v-bind:src="bookingGood.getAppSkuInfoDTO.url[0].url"/>
        </dt>
        </router-link>
        <dd>
          <router-link :to="'/goodsDetail/' + bookingGood.commodifyId" tag="dl">
          <h4 class="goodsName">{{bookingGood.getAppSkuInfoDTO.name}}</h4>
          </router-link>
          <div class="price">
            <router-link :to="'/goodsDetail/' + bookingGood.commodifyId" tag="dl">
            <p class="owner">预售价 ￥{{bookingGood.currentPrice | twoDecimal}}</p>
            <!-- <p class="selling">优选价 <span>￥{{bookingGood.getAppSkuInfoDTO.originalPrice | twoDecimal}}</span></p>  -->
            <p class="left">{{bookingGood.number}}人已预定</p>
            </router-link>
            <button class="button button-small button-red" v-if="advanceBookingData.state=='OPEN'" v-on:click="gotoAdvanceBooking(bookingGood)">立即预定</button>
            <button class="button button-small button-gray" v-if="advanceBookingData.state=='WAIT'">即将开始</button>
          </div>
        </dd>
        
      </dl>
    </div>
  </div>
  <div v-else class="no-news" style="color: gray;">甄选商品中，敬请期待</div>
</swiper-scroller>
</template>
<script>
import timer from '../../modal/timer.vue'
import _ from 'lodash'
export default {
  data () {
    return {
      advanceBookingData: {}, // 预售数据
      currentTime: ''
    }
  },
  computed: {
    scroll () {
      return this.$refs.scroll
    }
  },
  components: {
    timer
  },
  created () {
    this.getAdvanceBookingData()
  },
  methods: {
    getAdvanceBookingData (callback) { // 获取预售数据
      var that = this
      that.$loading.open()
      that.$axios.get('/sec/kill/get/now/time').then((res1) => {
        if (res1) that.currentTime = new Date(res1.nowTime.replace(/-/g, '/')).getTime()
        that.$axios.get('/presell/query/app/goods').then((res) => {
          if (res) {
            res.startTime = new Date(res.startTime.replace(/-/g, '/')).getTime()
            res.endTime = new Date(res.endTime.replace(/-/g, '/')).getTime()
            // 预售实时价格计算
            res.goodsEntityList && res.goodsEntityList.forEach(function (goodsEntity) {
              goodsEntity.list.forEach(function (entity) {
                if (res1.nowTime.split(' ')[0] === entity.time.split(' ')[0]) {
                  goodsEntity.currentPrice = entity.price
                }
              })
            })
            that.advanceBookingData = res
          }
          that.$loading.close()
          that.scroll && that.scroll.forceUpdate(true)
          setTimeout(() => {
            if (callback) {
              callback()
            }
          }, 500)
        })
      })
    },
    gotoAdvanceBooking: _.debounce(function (good) { // 立即预定
      this.$router.push({path: '/goodsDetail/' + good.commodifyId})
    }, 500, {
      'leading': true,
      'trailing': false
    }),
    timerStart: function (x) {
      this.getAdvanceBookingData()
    },
    timerEnd: function (x) {
      this.getAdvanceBookingData()
    },
    pullingDown () {
      this.getAdvanceBookingData(() => {
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