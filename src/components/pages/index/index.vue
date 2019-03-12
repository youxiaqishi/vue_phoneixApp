<template>
  <div class="page has-footerBar indexPage">
    <m-header>
      <div slot="address" v-on:click="showLocalize">
        <div class="icon-address">
          <span v-if="currentShop.name">{{currentShop.name}}</span>
          <span v-if="!currentShop.name">请选择店铺</span>
        </div>        
      </div>
      <span slot="title"><p v-click-one="{click:search}" class="inputStyle">搜索商品,自有品牌健康安全</p></span>
      <span slot="right" class="kefu kefuBtn" @click="showService()"></span>
    </m-header>
    <div class="topTabs">
      <swiper :options="swiperOption" class="tabs topTab" ref="mySwiper">
        <swiper-slide v-for="(tab,index) in tabsName" :key="index" :class="{'blur':localizeShop,'active':index == curIndex}">
          <!-- 如果店铺为全国且名字为活动的不显示 -->
          <div v-on:click="onTabClick(index)"><span class="border">{{tab}}</span></div>
        </swiper-slide>
      </swiper>
      <router-link :to="'/classify'" v-if="tabsName" tag="div" class="tabs allData">
      </router-link>
    </div>
    <div class="page-content hasTopTabs hasTopBottomTabs" :class="{'blur':localizeShop, 'fullHeight': secShowRemind}">
      <swiper :options="mainSwiperOption" ref="mainSwiper" class="swiperContent">
        <swiper-slide v-for="(tab,index) in tabsData" :key="index">
          <component  v-if="attached(index)" :is="getComponentType(tab,index)" :id="tabsData[index].id"></component>
          <div v-if="!attached(index)"></div>
        </swiper-slide>
        <!-- <router-view :key="routerViewKey" v-if="routerViewKey"></router-view> -->
      </swiper>
    </div>
    <mt-popup v-model="localizeShop" position="right" class="mint-popup-3" :modal="false">
      <localize-shop :defaultShopData='defaultShopData' :currentShop="currentShop" :locateShop="locateShop" @intoShop="intoShop" @showLocalize="showLocalize" @reLocate="reLocate"></localize-shop>
    </mt-popup>
    <mt-popup v-model="showRemind" position="top" class="mint-popup-5" :closeOnClickModal="false">
      <remind-me :remindData="remindData" @close="close"></remind-me>
    </mt-popup>
    <mt-popup v-model="popupVisible" position="top" class="mint-popup-2">
      <service-modal></service-modal>
    </mt-popup>
    <mt-popup v-model="showNewGiftsBag" position="top" class="mint-popup-6">
      <new-gifts-bag :newGiftsBagData="newGiftsBagData" @close="close"></new-gifts-bag>
    </mt-popup>
  </div>
</template>
<script>
import _ from 'lodash'
import remindMe from './template/remindMe.vue' // 提醒我
import newGiftsBag from '../modal/newGiftsBag.vue' // 新人礼包
import store from '../../../store/index'
import localizeShop from './localizeShop.vue' // 选择店铺
import serviceModal from '../modal/service.vue' // 客服
import shopDefault from './template/defaultIndex.vue' // 首页默认店铺
import shopGeneral from './template/generalIndex.vue' // 首页普通店铺
import secKill from './template/secKill.vue' // 秒杀
import timeLimit from './template/flashSale.vue' // 限时购
import group from './template/groupShopping.vue' // 组团
import teamBuying from './template/teamBuying.vue' // 团购
import advanceBooking from './template/advanceBooking.vue' // 预售
import typeTemplate from './template/typeTemplate.vue' // 商品列表
export default {
  store,
  data () {
    let self = this
    return {
      swiperOption: { // swiper option
        slidesPerView: 5,
        paginationClickable: true,
        spaceBetween: 0,
        freeMode: true
      },
      mainSwiperOption: {
        slidesPerView: 1,
        spaceBetween: 2,
        resistanceRatio: 0,
        noSwiping: false,
        preloadImages: false,
        touchMoveStopPropagation: false,
        threshold: 30,
        on: {
          slideChange: function () {
            self.curIndex = this.activeIndex
            self.swiper.slideTo(this.activeIndex - 2, 500, false)
          }
        }
      },
      showRemind: false,
      showNewGiftsBag: false,
      newGiftsBagData: [],
      remindData: {},
      curIndex: 0,
      secShowRemind: false, // 提醒我
      popupVisible: false, // 客服
      localizeShop: false, // 选择店铺
      routerViewKey: '', // 当前router
      tabIndex: 0, // swiper位置
      tabsName: [], // 选项卡名称
      tabsData: [], // 选项卡数据
      locateShop: [], // 定位店铺
      currentShop: {}, // 当前店铺
      defaultShopData: {} // 默认店铺数据
    }
  },
  computed: {
    swiper () {
      return this.$refs.mySwiper.swiper
    },
    mainSwiper () {
      return this.$refs.mainSwiper.swiper
    }
  },
  components: {
    localizeShop,
    newGiftsBag,
    serviceModal,
    shopDefault,
    shopGeneral,
    secKill,
    timeLimit,
    group,
    remindMe,
    teamBuying,
    advanceBooking,
    typeTemplate
  },
  mounted () {
    if (this.$router.currentRoute.meta.isCached) return false
    this.initSwiper()
  },
  activated () {
    this.scroll && this.scroll.forceUpdate(true) // 防错: 有可能切页之后无法滑动
    if (window.localStorage.getItem('thisIsIndex')) window.localStorage.removeItem('thisIsIndex') // 防错: 清除服务弹窗标识
    window.eventBus.$emit('updateCount') // 更新角标
    window.eventBus.$on('thisIsIndex', () => { // 安卓物理返回键问题: 关闭客服框
      this.popupVisible = false
      window.localStorage.removeItem('thisIsIndex')
    })
    window.eventBus.$on('showRemindMe', (remindData) => {
      this.remindData = remindData
      this.showRemind = true
    })
  },
  created () {
    if (!window.$getLocalstorage('shopData')) { // 首次获取默认店铺
      this.showLocalize()
      // this.$loading.open()
      // this.$axios.get('/app/shop/get/default/shop/community').then((defaultShopRes) => {
      //   if (defaultShopRes) this.intoShop(defaultShopRes[0])
      //   this.$loading.close()
      // })
    } else { // 默认店铺or普通店铺
      this.currentShop = window.$getLocalstorage('shopData')
      this.currentShop.admin && this.currentShop.admin === 'yes' ? this.$router.replace(`/home/index/shopTemplate/default`) : this.$router.replace(`/home/index/shopTemplate/general`)
    }
    this.getData().then(() => { // 查看当前tab
      this.routerViewKey = this.getTabUrl(this.curTabIndex())
      if (this.routerViewKey === `/home/index/shopTemplate/general`) this.routerViewKey = `/home/index/shopTemplate/general${this.getLocalstorage('shopId')}`
    })
  },
  methods: {
    getData () {
      var that = this
      if (window.$getLocalstorage('userInfo')) { // 查询新人礼包
        that.$axios.get('/novice/app/user/display/novice').then((res) => {
          if (res && res.isDisplay === 'TRUE') {
            res.couponDetailDTOS.forEach(function (item) {
              item.expireDate = item.expireDate.split(' ')[0]
            })
            that.newGiftsBagData = res.couponDetailDTOS
            that.showNewGiftsBag = true
          }
        })
      }
      return this.$axios.get('/commodity/configuration/getAppNavigationBar').then((barRes) => {
        that.tabsName = ['推荐']
        that.tabsData = ['推荐']
        if (barRes) {
          // 如果是全国店铺 则不显示活动数据
          if (that.currentShop.admin !== 'yes') {
            _.forEach(barRes, function (value, key) {
              that.tabsName.push(value.nameNavigation)
              that.tabsData.push(value)
            })
          }
        }
        that.$axios.get('/app/shop/getCategoryTree').then((treeRes) => { // 选项卡
          if (treeRes) {
            _.forEach(treeRes, function (value, key) {
              that.tabsName.push(value.label)
              that.tabsData.push(value)
            })
          }
          that.$loading.close()
        })
      })
    },
    getComponentType: function (tab, index) {
      let componentType = ''
      if (index === 0) { // 推荐
        this.getLocalstorage('shopData') && this.getLocalstorage('shopData').admin === 'yes' ? componentType = `shopDefault` : componentType = `shopGeneral`
      } else { // 活动or商品
        if (this.tabsData[index].nameRule === '秒杀') {
          componentType = `secKill`
        } else if (this.tabsData[index].nameRule === '拼团') {
          componentType = `group`
        } else if (this.tabsData[index].nameRule === '团购') {
          componentType = `teamBuying`
        } else if (this.tabsData[index].nameRule === '预售') {
          componentType = `advanceBooking`
        } else if (this.tabsData[index].nameRule === '限时购') {
          componentType = `timeLimit`
        } else {
          componentType = `typeTemplate`
        }
      }
      return componentType
    },
    onTabClick: function (index) { // 选项卡
      this.curIndex = index
      this.mainSwiper.slideTo(index, 0)
      // this.swiper.slideTo(index)
      // this.swiper.slideTo(index - 2, 500, false)
    },
    attached (index) {
      // if (index === this.curIndex || index === this.curIndex) return true
      // if (index < this.curIndex || index > this.curIndex) return false
      if (index === this.curIndex || index === this.curIndex - 1 || index === this.curIndex + 1) return true
      if (index < this.curIndex - 1 || index > this.curIndex + 1) return false
    },
    getTabUrl: function (index) {
      let targetUrl = ''
      if (index === 0) { // 推荐
        this.getLocalstorage('shopData') && this.getLocalstorage('shopData').admin === 'yes' ? targetUrl = `/home/index/shopTemplate/default` : targetUrl = `/home/index/shopTemplate/general`
      } else { // 活动or商品
        if (this.tabsData[index].nameRule === '秒杀') {
          targetUrl = `/home/index/activityTemplate/secKill`
        } else if (this.tabsData[index].nameRule === '拼团') {
          targetUrl = `/home/index/activityTemplate/group`
        } else if (this.tabsData[index].nameRule === '团购') {
          targetUrl = `/home/index/activityTemplate/teamBuying`
        } else if (this.tabsData[index].nameRule === '预售') {
          targetUrl = `/home/index/activityTemplate/advanceBooking`
        } else if (this.tabsData[index].nameRule === '限时购') {
          targetUrl = `/home/index/activityTemplate/timeLimit`
        } else {
          targetUrl = `/home/index/typeTemplate/${this.tabsData[index].id}`
        }
      }
      return targetUrl
    },
    curTabIndex () {
      var tabsIndex = ''
      var tabsName = ''
      var categoryId = parseInt(this.$route.params.categoryId)
      if (this.$route.path.split('/')[this.$route.path.split('/').length - 1] === 'group') {
        tabsName = '拼团'
      } else if (this.$route.path.split('/')[this.$route.path.split('/').length - 1] === 'secKill') {
        tabsName = '秒杀'
      } else if (this.$route.path.split('/')[this.$route.path.split('/').length - 1] === 'timeLimit') {
        tabsName = '限时购'
      } else if (this.$route.path.split('/')[this.$route.path.split('/').length - 1] === 'teamBuying') {
        tabsName = '团购'
      } else if (this.$route.path.split('/')[this.$route.path.split('/').length - 1] === 'advanceBooking') {
        tabsName = '预售'
      } else if (this.$route.path.split('/')[this.$route.path.split('/').length - 1] === 'default') {
        tabsName = '推荐'
      } else if (this.$route.path.split('/')[this.$route.path.split('/').length - 1] === 'general') {
        tabsName = '推荐'
      }
      _.forEach(this.tabsData, function (info, index) {
        if (info.id === categoryId) {
          tabsIndex = index
        } else if (info.nameRule === tabsName || info === tabsName) {
          tabsIndex = index
        }
      })
      this.tabIndex = tabsIndex
      this.initSwiper()
      return tabsIndex
    },
    intoShop: _.debounce(function (shopData) { // 进入店铺
      this.currentShop = shopData
      this.getData().then(() => {
        this.localizeShop = false
        window.localStorage.setItem('shopData', JSON.stringify(shopData))
        window.localStorage.setItem('shopId', JSON.stringify(shopData.id))
        var params = {
          'shopId': shopData.id,
          'accessToken': window.$getLocalstorage('Token').accessToken
        }
        this.$loading.open()
        var that = this
        that.$axios.post('/app/userauth/addshopid', params).then((res) => { // 存储店铺ID
          // ***凤凰会存储用户信息***
          if (store.state.mutations.isApp === 3) {
            that.$axios.get('/AppUser/GetById').then((userRes) => {
              if (userRes) window.localStorage.setItem('userInfo', JSON.stringify(userRes))
              that.$loading.close()
            })
          }
          // ***凤凰会存储用户信息***
          // that.getData()
          that.tabIndex = 0
          this.$loading.close()
          window.eventBus.$emit('updateCount') // 更新角标
          console.log('切换店铺')
          if (shopData.admin && shopData.admin === 'yes') {
            that.$router.replace(`/home/index/shopTemplate/default`)
            that.onTabClick(0)
            that.routerViewKey = `/home/index/shopTemplate/default`
          } else {
            that.$router.replace(`/home/index/shopTemplate/general`)
            that.onTabClick(0)
            that.routerViewKey = `/home/index/shopTemplate/general/${that.getLocalstorage('shopId')}`
          }
        })
      })
    }, 500, {
      'leading': true,
      'trailing': false
    }),
    reLocate () { // 定位信息
      var that = this
      that.$loading.open()
      that.$axios.get('/app/shop/get/default/shop/community').then((defaultShopRes) => {
        if (defaultShopRes) that.defaultShopData = defaultShopRes[0]
        that.GerCurrentPosition().then(function (currentPosition) {
          var params = {
            'lon': currentPosition.coords.longitude,
            'lat': currentPosition.coords.latitude
          }
          // /shopaop/shop/get/shop/info/lon/lat(旧)
          that.$axios.post('/shopaop/shop/get/shop/info/district/lon/lat', params).then((locRes) => {
            if (locRes) that.locateShop = locRes
            that.$loading.close()
          })
        }, function () { that.$loading.close() })
      })
    },
    initSwiper () {
      setTimeout(() => {
        var num = this.tabIndex
        if (num === 1) {
          this.swiper.setWrapperTranslate(0)
          this.swiper.setWrapperTransition(300)
        } else {
          this.swiper.slideTo(num - 2, 500, false)
        }
      })
    },
    close () {
      this.showRemind = false
      this.showNewGiftsBag = false
    },
    showLocalize () { // 定位
      this.localizeShop = !this.localizeShop
      this.reLocate()
    },
    gotoShowRemind (isShow) { // 提醒我
      this.secShowRemind = isShow
    },
    showService () { // 显示客服
      this.popupVisible = true
      window.localStorage.setItem('thisIsIndex', 'thisIsIndex')
    },
    search () { // 搜索
      this.$router.push({path: '/search'})
    }
  }
}
</script>
<style lang="less" scoped>
@import "../../../../static/css/index.less";
.swiper-slide{
  text-align: center;
}
.swiperContent{
  height: 100%;
}
.tabs{
  width: 88%;
  float: left;
  .active{
    .border{
      height: .9rem;
      display: inline-block;
      border-bottom: 2px solid #89262a;
    }
  }
}
.activitBorder{
  width: 20%;
  border-bottom: 2px solid #89262a;
  position: absolute;
  top:.9rem;
}
.allData{
  width: 12%;
  position: relative;
  top: -1px;
  float: right;
  height: .9rem;
  text-align: center;
  border-left: 1px solid #ddd;
  box-shadow: 0 0 10px #ddd;
}
.mint-popup-3 {
  width: 100%;
  height: 100%;
  background-color: #fff;
  .closeTit{
    height: 1.2rem;
    width: 100%;
    position: absolute; 
    padding-top: .2rem;   
    background: #fff;
  }
  .close1{
    height: 1rem;
    width: 1rem;
    float: right;
    background-size: .5rem!important;
  }
}
.fullHeight{
  top:0!important;
  bottom: 0!important;
}
.mint-popup-5{
  border-radius: 5px;
  top:20%;
}
.mint-popup-6{
  border-radius: 5px;
  background: none!important;
  top: 23%!important;
}
/*.topTab .swiper-slide{
  width: auto!important;
  padding:0 15px;
}*/

</style>