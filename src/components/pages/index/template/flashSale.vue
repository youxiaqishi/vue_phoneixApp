<template>
<div>
  <swiper-scroller 
  ref="scroll"
  :pullDownRefresh="true"
  @pullingDown="pullingDown" 
  :pullUpLoad="true" 
  @pullingUp="pullingUp">
    <div v-if="flashSaleData.id && flashSaleData.fieldList.length > 0">
      <div class="banner">
        <img v-lazy="flashSaleData.banner" class="services"/>
        <div class="topTabs timeTop" v-if="flashSaleData.fieldList.length != 0">
          <ul class="tabs flexUl">
            <li v-for="(flashSale, index) in flashSaleData.fieldList" :key="index" :class="{'active':index == tabIndexs}" v-on:click="onTabClick(index)">
              <div class="tabDiv">{{flashSale.test}}</div>
              <div class="tabDiv" v-if="flashSale.status == 'ALREADY_OPEN'">已经开抢</div>
              <div class="tabDiv" v-if="flashSale.status == 'ALREADY_SHOPPING'">正在抢购</div>
              <div class="tabDiv" v-if="flashSale.status == 'WILL_OPEN'">即将开抢</div>
            </li>
          </ul>
          <swiper  v-if="flashSaleData.fieldList.length > 5" :options="swiperOption" class="tabs" ref="mySwiper">
            <swiper-slide v-for="(flashSale, index) in flashSaleData.fieldList" :key="index" :class="{'active':index == tabIndexs}">
              <div v-on:click="onTabClick(index)">
                <div class="tabDiv">{{flashSale.test}}</div>
                <div class="tabDiv" v-if="flashSale.status == 'ALREADY_OPEN'">已经开抢</div>
                <div class="tabDiv" v-if="flashSale.status == 'ALREADY_SHOPPING'">正在抢购</div>
                <div class="tabDiv" v-if="flashSale.status == 'WILL_OPEN'">即将开抢</div>
              </div>
            </swiper-slide>
          </swiper>
        </div>      
      </div>
      <div class="timeLeft">
        <countdown :currentTime="currentTime" :startTime="flashSaleData.fieldList[tabIndexs].startTime" :endTime="flashSaleData.fieldList[tabIndexs].endTime" v-on:start_callback="timerStart()" v-on:end_callback="timerEnd()"></countdown>
        <!-- <timer class="time killStyle" :current-time="currentTime" :start-time="flashSaleData.fieldList[tabIndexs].startTime" :end-time="flashSaleData.fieldList[tabIndexs].endTime" v-on:start_callback="timerStart(3)" v-on:end_callback="timerEnd(3)" :tipText="'距离开始时间还剩'" :tipTextEnd="'距离结束时间还剩'" :endText="'活动已结束'" :dayTxt="'天'" :hourTxt="'时'" :minutesTxt="'分'" :secondsTxt="'秒'" :secondsFixed="true"></timer> -->
      </div>
      <div class="goods" v-for="flashGood in flashSaleData.fieldList[tabIndexs].skuList">
        <dl>
          <router-link :to="'/goodsDetail/' + flashGood.skuId" tag="div">
            <dt>
              <img v-lazy="flashGood.getAppSkuInfoDTO.defaultUrl"/>
              <span class="fightingOut" v-if="flashGood.limitStock == 0"></span>
            </dt>
          </router-link>
          <dd>
            <router-link :to="'/goodsDetail/' + flashGood.skuId" tag="div">
              <h4 class="goodsName">{{flashGood.getAppSkuInfoDTO.name | maxLength(25)}}</h4>
            </router-link>
            <div class="price">
              <router-link :to="'/goodsDetail/' + flashGood.skuId" tag="div">
              <p class="owner">限时价 ￥{{flashGood.limitPrice | twoDecimal}}</p>
              <!-- <p class="selling">优选价 <span>￥{{flashGood.getAppSkuInfoDTO.originalPrice | twoDecimal}}</span></p>  -->
              <p class="left">仅剩{{flashGood.limitStock}}件</p>
              </router-link>
              <button class="button button-small button-red" v-if="flashGood.limitStock > 0 &&  flashSaleData.fieldList[tabIndexs].startTime < currentTime" v-on:click="gotoFlashSale(flashGood)">去抢购</button>
              <button class="button button-small button-gray" v-if="flashGood.limitStock == 0 && flashSaleData.fieldList[tabIndexs].startTime < currentTime">已抢完</button>
              <button class="button button-small button-red" v-if="(flashGood.remind == 'REMIND_NO' || !flashGood.remind) && flashSaleData.fieldList[tabIndexs].startTime > currentTime" v-on:click="gotoRemind(flashGood)">提醒我</button>
              <button class="button button-small button-gray" v-if="flashGood.remind == 'REMIND_YES' && flashSaleData.fieldList[tabIndexs].startTime > currentTime">已设提醒</button>
            </div>
          </dd>
        </dl>
      </div>
    </div>
    <div v-if="!flashSaleData.id || flashSaleData.fieldList.length == 0" class="no-news" style="color: gray;">甄选商品中，敬请期待</div>
  </swiper-scroller>
</div>
</template>
<script>
import timer from '../../modal/timer.vue'
import countdown from '../../modal/countdown.vue'
import _ from 'lodash'
export default {
  data () {
    return {
      swiperOption: {
        slidesPerView: 5,
        paginationClickable: true,
        spaceBetween: 0,
        freeMode: true
      },
      currentTime: '',
      tabIndexs: 0,
      flashSaleData: {} // 抢购数据
    }
  },
  components: {
    timer,
    countdown
  },
  mounted () {
  },
  computed: {
    swiper () {
      return this.$refs.mySwiper.swiper
    },
    scroll () {
      return this.$refs.scroll
    }
  },
  activated () {
    this.scroll && this.scroll.forceUpdate(true)
  },
  created () {
    this.getFlashSaleData()
  },
  methods: {
    onTabClick: _.debounce(function (index) {
      var that = this
      that.tabIndexs = index
      // that.initSwiper(that.tabIndexs)
    }, 500, {
      'leading': true,
      'trailing': false
    }),
    getFlashSaleData (callback) { // 获取抢购数据
      var that = this
      var params = { 'userId': '' }
      that.getLocalstorage('userInfo') ? params.userId = that.getLocalstorage('userInfo').id : params = {}
      that.$loading.open()
      that.$axios.get('/sec/kill/get/now/time').then((res1) => { // 获取当前时间
        if (res1) that.currentTime = new Date(res1.nowTime.replace(/-/g, '/')).getTime()
        that.$axios.post('/flash/sale/app/list', params).then((res) => {
          if (res) {
            res.fieldList.forEach(function (item, index) {
              // UPDATE:如果活动时间是当天则只显示时间 否则显示是多少日 + 时间
              if (res1.nowTime.split(' ')[0] === item.startTime.split(' ')[0]) {
                item.test = item.startTime.split(' ')[1].substring(0, 5)
              } else {
                item.test = item.startTime.split(' ')[0].substring(8, 11) + '日 ' + item.startTime.split(' ')[1].substring(0, 5)
              }
              item.startTime = new Date(item.startTime.replace(/-/g, '/')).getTime()
              item.endTime = new Date(item.endTime.replace(/-/g, '/')).getTime()
              if (item.status === 'ALREADY_SHOPPING') that.tabIndexs = index
            })
            that.flashSaleData = res
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
    gotoRemind (flashGood) { // 提醒
      if (!this.getLocalstorage('userInfo')) {
        this.showConfirm('您没有进行登录,去登录?', 1)
      } else {
        flashGood.type = 'flashSale'
        window.eventBus.$emit('showRemindMe', flashGood)
      }
    },
    timerStart: function () {
      this.getFlashSaleData()
    },
    timerEnd: function () {
      this.getFlashSaleData()
    },
    gotoFlashSale (good) { // 去抢购
      this.$router.push({path: '/goodsDetail/' + good.skuId})
    },
    initSwiper (number) { // 初始化
      var that = this
      setTimeout(function () {
        var num = number
        if (num === 1) {
          that.swiper.setWrapperTranslate(0)
          that.swiper.setWrapperTransition(300)
        } else {
          that.swiper.slideTo(num - 2, 500, false)
        }
      })
    },
    pullingDown () {
      this.getFlashSaleData(() => {
        this.scroll.pulldownLoadEnd()
      })
    },
    pullingUp () {
      this.scroll.pulldownLoadEnd()
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
.flexUl{
  display: flex;
  li{
    flex: 1;
  }
}
.timeTop{
  border-bottom: none;
}
</style>