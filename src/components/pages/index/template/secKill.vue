<template>
<div>  
<swiper-scroller 
  ref="scroll"
  :pullDownRefresh="true"
  @pullingDown="pullingDown" 
  :pullUpLoad="true" 
  @pullingUp="pullingUp">
  <div v-if="secKillData.id">
    <div class="banner">
      <img v-lazy="secKillData.banner" class="services"/>
    </div>
    <div v-if="secKillData.secKillTimeInfoEntityList.length == 0 || !secKillData.secKillTimeInfoEntityList">
      <div class="killing">
        <div class="killingTitle"><i></i>所有活动已结束<i></i></div>
      </div>
    </div>
    <div v-for="(seckill, index) in secKillData.secKillTimeInfoEntityList" class="secKillCont">
      <div class="timeLeft">
        <countdown :currentTime="currentTime" :startTime="seckill.beginTime" :endTime="seckill.endTime"></countdown>
        <!-- <timer class="time killStyle" :current-time="currentTime" :start-time="seckill.beginTime" :end-time="seckill.endTime" v-on:start_callback="timerStart(3)" v-on:end_callback="timerEnd(3)" :tipText="'距离开始时间还剩'" :tipTextEnd="'距离结束时间还剩'" :endText="'活动已结束'" :dayTxt="'天'" :hourTxt="'时'" :minutesTxt="'分'" :secondsTxt="'秒'" :secondsFixed="true"></timer> -->
      </div>
      <div class="killing">
        <div class="killingTitle" v-if="currentTime > seckill.beginTime"><i></i>秒杀中, 先到先得<i></i></div>
        <div class="killingTitle" v-if="currentTime < seckill.beginTime"><i></i>即将开场, 先到先得<i></i></div>
      </div>
      <div class="goods" v-for="secGood in seckill.secKillTimeSkuInfoEntityList">
        <dl>
          <router-link :to="'/goodsDetail/' + secGood.skuId" tag="dl">
          <dt><img v-bind:src="secGood.getAppSkuInfoDTO.defaultUrl"/>
            <span class="killOut" v-if="secGood.stock == 0"></span>
          </dt>
          </router-link>
          <dd>
            <router-link :to="'/goodsDetail/' + secGood.skuId" tag="dl">
            <h4 class="goodsName">{{secGood.getAppSkuInfoDTO.name | maxLength(25)}}</h4>
            </router-link>
            <div class="price">
              <router-link :to="'/goodsDetail/' + secGood.skuId" tag="dl">
              <p class="owner">秒杀价 ￥{{secGood.price | twoDecimal}}</p>
              <!-- <p class="selling">优选价 <span>￥{{secGood.getAppSkuInfoDTO.originalPrice | twoDecimal}}</span></p> -->
              <p class="left">仅剩{{secGood.stock}}件</p>
              </router-link>
              <button class="button button-small button-red" v-if="secGood.stock > 0 && currentTime > seckill.beginTime" v-on:click="secKill(secGood)">立即秒杀</button> 
              <button class="button button-small button-gray" v-if="secGood.stock == 0 && currentTime > seckill.beginTime">立即秒杀</button>
              <button class="button button-small button-red" v-if="(secGood.remind == 'no' || !secGood.remind) && currentTime < seckill.beginTime" v-on:click="gotoRemind(secGood)">提醒我</button>
              <button class="button button-small button-gray" v-if="secGood.remind == 'yes' && currentTime < seckill.beginTime">已设提醒</button>
            </div>
          </dd>
        </dl>
      </div>
    </div>
  </div>
  <div v-if="!secKillData.id" class="no-news" style="color: gray;">甄选商品中，敬请期待</div>
</swiper-scroller>
</div>
</template>
<script>
import _ from 'lodash'
import timer from '../../modal/timer.vue'
import countdown from '../../modal/countdown.vue'
export default {
  data () {
    return {
      currentTime: '', // 当前时间
      secKillData: {}, // 秒杀数据
      testTimeText: '',
      testTime: ''
    }
  },
  components: {
    timer,
    countdown
  },
  mounted () {
  },
  computed: {
    scroll () {
      return this.$refs.scroll
    }
  },
  activated () {
    this.scroll && this.scroll.forceUpdate(true)
  },
  created () {
    this.getSecKillData()
  },
  methods: {
    getSecKillData (callback) { // 获取秒杀数据
      var that = this
      var params = {
        'userId': ''
      }
      that.getLocalstorage('userInfo') ? params.userId = that.getLocalstorage('userInfo').id : params = {}
      that.$loading.open()
      that.$axios.get('/sec/kill/get/now/time').then((res1) => { // 获取当前时间
        if (res1) that.currentTime = new Date(res1.nowTime.replace(/-/g, '/')).getTime()
        that.$axios.post('/sec/kill/get/app/sec/kill/index/info', params).then((res2) => {
          if (res2) {
            res2.secKillTimeInfoEntityList.forEach(function (item) {
              item.beginTime = new Date(item.beginTime.replace(/-/g, '/')).getTime()
              item.endTime = new Date(item.endTime.replace(/-/g, '/')).getTime()
              // 当前时间小于开始时间 活动未开始 计算距开始时间还剩 时间到了触发方法
              // 当前时间介于开始和结束时间 活动进行中 计算距结束时间还剩 时间到了触发方法
              // 当前时间大于结束时间 活动已结束
              // if (that.currentTime < item.beginTime) {
              //   that.testTimeText = '活动未开始'
              //   that.test(that.currentTime, item.beginTime, 0)
              // }
            })
            that.secKillData = res2
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
    test (currentTime, time, num) {
      var leftTime = 0
      if (num === 0) {
        leftTime = time - currentTime
      }
      var days = Math.floor(leftTime / (24 * 3600 * 1000))
    },
    gotoRemind: _.debounce(function (secGood) {
      if (!this.getLocalstorage('userInfo')) {
        this.showConfirm('您没有进行登录,去登录?', 1)
      } else {
        secGood.type = 'seckill'
        window.eventBus.$emit('showRemindMe', secGood)
      }
    }, 500, {
      'leading': true,
      'trailing': false
    }),
    secKill (good) { // 立即秒杀
      this.$router.push({path: '/goodsDetail/' + good.skuId})
    },
    pullingDown () {
      this.getSecKillData(() => {
        this.scroll.pulldownLoadEnd()
      })
    },
    pullingUp () {
      this.scroll.pulldownLoadEnd()
    },
    timerStart: function (x) {
      console.log('开始了')
      this.getSecKillData()
    },
    timerEnd: function (x) {
      console.log('结束了')
      this.getSecKillData()
    },
    showConfirm (cont, index) {
      var that = this
      that.$messageBox.confirm(cont, '提示', {closeOnClickModal: false}).then(function () {
        if (index === 1) {
          that.$router.push('/login')
        }
      }, function () {
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import "../../../../../static/css/index.less";
@import "../../../../../static/css/activity.less";
.mint-popup-5{
  z-index: 999999;
}
.secKillCont{
  margin-top: .3rem;
}
</style>