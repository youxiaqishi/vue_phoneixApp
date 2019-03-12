<template>
  <swiper-scroller
  ref="scroll"
  :pullDownRefresh="true"
  @pullingDown="pullingDown" 
  :pullUpLoad="true" 
  @pullingUp="pullingUp">
    <div class="banner" v-if="data.banner">
      <swiper :options="swiperOption1" class="bannerList">
        <swiper-slide v-for="(info,index) in data.banner" :key="index">
          <router-link :to="'/goodsDetail/' + info.bindingId" v-if="info.idType == 'SKU'" class="services"  tag="div">
            <img v-bind:src="info.url"/>
          </router-link>
          <router-link :to="'/specialDetail/' + info.bindingId" v-if="info.idType == 'THEME'" class="services" tag="div">
            <img v-bind:src="info.url"/>
          </router-link>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>  
      <ul class="activity">
<!--         <router-link :to="'/specliaInfo/' + info.bindingId" class="icon" style="padding-left:.9rem;font-size:.28rem;" :key="index" v-for="(info,index) in data.navList" tag="li">
          <img v-bind:src="info.url" style="width:.4rem;height:.4rem;margin-top:.05rem;">{{info.name}}
        </router-link> -->
        <li class="icon" style="padding-left:.9rem;font-size:.28rem;" :key="index" v-for="(info,index) in data.navList"><img v-bind:src="info.url" style="width:.4rem;height:.4rem;margin-top:.05rem;">{{info.name}}</li>
      </ul>         
    </div>
    <div class="recommend">
      <router-link class="title" tag="h3" :to="'/specliaInfo/' + data.textInfoDTOS[0].binDingId" v-if="data.textInfoDTOS && data.textInfoDTOS[0]">
        <i class="more">{{data.textInfoDTOS[0].name}}</i>
      </router-link>
      <div class="recommendGoods"> 
        <router-link :to="'/goodsDetail/' + recommen.bindingId" tag="div" class="cont" v-for="(recommen, index) in data.recommend" :key="index">
          <img v-bind:src="recommen.url"  />
        </router-link>
      </div>
    </div>
    <div class="neighbor">
      <router-link class="title" tag="h3" :to="'/specliaInfo/' + data.textInfoDTOS[1].binDingId" v-if="data.textInfoDTOS && data.textInfoDTOS[1]">
        <i class="more">{{data.textInfoDTOS[1].name}}</i>
      </router-link>
      <div class="neighborList">
        <swiper :options="swiperOption2" class="swiperGoods">
          <swiper-slide v-for="item in data.neighbor" :key="item.id">
            <router-link :to="'/goodsDetail/'+ item.skuId"  tag="dl" class="goods">
              <dt><img v-bind:src="item.url"/><span class="sellOut" v-if="item.sellOut"></span></dt>
              <dd>
                <h3 class="goodsName">{{item.name}}</h3>
                <p class="owner" v-if="appUserType == 'notLogin' || appUserType == 'OWNER' || appUserType == 'STAFF'">业主价￥{{item.onwerPrice | twoDecimal}}</p>
                <p class="selling" :class="{sellingAdd: appUserType != 'notLogin'}" v-if="appUserType == 'notLogin' || appUserType == 'GENERAL'">优选价￥{{item.originalPrice | twoDecimal}}</p>

                <p class="selling" style="text-decoration:line-through;" v-if="appUserType == 'OWNER' || appUserType == 'STAFF'">优选价￥{{item.originalPrice | twoDecimal}}</p>
              </dd>
            </router-link>  
          </swiper-slide>
        </swiper>
      </div>
    </div>
    <div class="style1" style="padding-bottom: 0;">
      <router-link class="title" tag="h3" :to="'/specliaInfo/' + data.textInfoDTOS[2].binDingId" v-if="data.textInfoDTOS && data.textInfoDTOS[2]">
        <i class="more">{{data.textInfoDTOS[2].name}}</i>
      </router-link>
      <div class="styleList1">
        <router-link :to="'/goodsDetail/' + item.skuId" tag="dl" v-for="item in data.goodsList2" :key="item.skuId" class="services">
          <dt><img v-bind:src="item.url"/><span class="sellOut" v-if="item.sellOut"></span></dt>
          <dd>
            <h3 class="goodsName">{{item.name}}</h3>
            <p class="owner" v-if="appUserType == 'notLogin' || appUserType == 'OWNER' || appUserType == 'STAFF'"><span>业主价</span>  ￥{{item.onwerPrice | twoDecimal}}</p>
            <p class="selling" :class="{sellingAdd: appUserType != 'notLogin'}" v-if="appUserType == 'notLogin' || appUserType == 'GENERAL'"><span>优选价</span>  ￥{{item.originalPrice | twoDecimal}}</p>

            <p class="selling" style="font-size: .36rem;text-decoration:line-through;" v-if="appUserType == 'OWNER' || appUserType == 'STAFF'"><span>优选价</span> ￥{{item.originalPrice | twoDecimal}}</p>
          </dd>
        </router-link>
      </div>
    </div>
    <div class="special">
      <router-link class="title" tag="h3" :to="'/specliaInfo/' + data.textInfoDTOS[3].binDingId" v-if="data.textInfoDTOS && data.textInfoDTOS[3]">
        <i class="more">{{data.textInfoDTOS[3].name}}</i>
      </router-link>
      <dl>
        <dt v-for="item in data.specialList" :key="item.bindingId">
          <router-link :to="'/specialDetail/' + item.bindingId" v-if="item.idType == 'THEME'" class="services">
            <img v-bind:src="item.url"/>
          </router-link>
        </dt>
        <!-- <dd>
          <h5 v-if="data.textInfoDTOS && data.textInfoDTOS[5]">{{data.textInfoDTOS[5].name}}</h5>
        </dd> -->
      </dl>
    </div>
    <div class="youLike">
      <router-link class="title" tag="h3" :to="'/specliaInfo/' + data.textInfoDTOS[4].binDingId" v-if="data.textInfoDTOS && data.textInfoDTOS[4]">
        <i class="more">{{data.textInfoDTOS[4].name}}</i>
      </router-link>
      <div class="goodsList">
        <router-link :to="'/goodsDetail/' + item.skuId" :key="item.skuId" tag="dl" v-for="item in data.goodsList3" class="goods">
          <dt><img v-bind:src="item.url"/><span class="sellOut" v-if="item.sellOut"></span></dt>
          <dd>
            <h3 class="goodsName">{{item.name}}</h3>
            <p class="owner" v-if="appUserType == 'notLogin' || appUserType == 'OWNER' || appUserType == 'STAFF'">业主价<span>￥{{item.onwerPrice | twoDecimal}}</span></p>
            <p class="selling" :class="{sellingAdd: appUserType != 'notLogin'}" v-if="appUserType == 'notLogin' || appUserType == 'GENERAL'">优选价￥{{item.originalPrice | twoDecimal}}</p>
            <p class="selling" style="text-decoration:line-through;" v-if="appUserType == 'OWNER' || appUserType == 'STAFF'">优选价￥{{item.originalPrice | twoDecimal}}</p>
          </dd>
        </router-link>
      </div>
    </div>
  </swiper-scroller>
</template>
<script>
export default {
  data () {
    let self = this
    return {
      data: {},
      swiperOption1: {
        pagination: {
          el: '.swiper-pagination'
        },
        paginationClickable: true,
        autoplay: true,
        slidesPerView: 'auto',
        loopedSlides: 3,
        loop: true
        // onSlideChangeEnd: function (swiper) {
        //   console.log(swiper.activeIndex)
        //   if (swiper.activeIndex === self.data.banner.length * 2) {
        //     swiper.slideTo(self.data.banner.length, 0)
        //   }
        //   if (swiper.activeIndex === self.data.banner.length - 1) {
        //     swiper.slideTo(2 * self.data.banner.length - 1, 0)
        //   }
        // }
      },
      swiperOption2: {
        slidesPerView: 2.5,
        paginationClickable: true,
        spaceBetween: 0,
        freeMode: true
      },
      appUserType: '' // 用户身份
    }
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
    window.$getLocalstorage('userInfo') ? this.appUserType = window.$getLocalstorage('userInfo').appUserType : this.appUserType = 'notLogin' // 身份标识
    this.getData()
  },
  methods: {
    getData (callback) {
      var that = this
      that.$loading.open()
      that.$axios.get('/app/system/app/index/get/all/index/info').then((res) => {
        if (res) {
          that.$loading.close()
          window.eventBus.$emit('updateCount') // 更新角标
          var infoData = res
          infoData.banner = []
          infoData.navList = []
          infoData.recommend = []
          infoData.neighbor = []
          infoData.goodsList2 = []
          infoData.goodsList3 = []
          infoData.specialList = []
          infoData.pictureInfoDTOS.forEach(function (info, index, data) {
            if (info.moduleType === 'SCROLLBAR') {
              info.id = info.bindingId
              info.name = info.title
              infoData.banner.push(info)
            } else if (info.moduleType === 'SPECIAL') {
              infoData.navList.push(info)
            } else if (info.moduleType === 'TITLEONESKU') {
              infoData.recommend.push(info)
            } else if (info.moduleType === 'TITLEFORETHEME') {
              infoData.specialList.push(info)
            }
          })
          infoData.listInfoDTOS.forEach(function (info, index, data) {
            if (info.moduleType === 'TITLETWOSKU') {
              infoData.neighbor.push(info)
            } else if (info.moduleType === 'TITLETHREESKU') {
              infoData.goodsList2.push(info)
            } else if (info.moduleType === 'TITLEFIVESKU') {
              infoData.goodsList3.push(info)
            }
          })
          that.data = infoData
        }
        that.scroll && that.scroll.forceUpdate(true)
        setTimeout(() => {
          if (callback) {
            callback()
          }
        }, 500)
      })
    },
    pullingDown () {
      this.getData(() => {
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
.swiper-slide{
  text-align: center;
  font-size: .28rem;
}
.swiperGoods{
  width: 100%;
}
.style1{
  text-align: left;
}
</style>