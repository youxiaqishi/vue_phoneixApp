<template>
  <swiper-scroller 
  ref="scroll"
  :pullDownRefresh="true"
  @pullingDown="pullingDown" 
  :pullUpLoad="true" 
  @pullingUp="pullingUp">
    <div class="banner" v-if="data[0] && data[0].defaultListInfoDTOS">
      <swiper :options="swiperOption1" class="bannerList">
        <swiper-slide v-for="(info,index) in data[0].defaultListInfoDTOS" :key="index">
          <router-link :to="'/goodsDetail/' + info.bindingId" v-if="info.idType == 'SKU'" class="services">
            <img v-bind:src="info.url"/>
          </router-link>
          <router-link :to="'/specialDetail/' + info.bindingId" v-if="info.idType == 'THEME'" class="services">
            <img v-bind:src="info.url"/>
          </router-link>
          <router-link :to="'/toBuyGifts'" v-if="info.idType == 'SPECIAL'" class="services">
            <img v-bind:src="info.url"/>
          </router-link>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
      <ul class="activity" v-if="data[1] && data[1].defaultListInfoDTOS">
<!--        <router-link :to="'/specliaInfo/' + info.bindingId" class="icon" style="padding-left:.9rem;font-size:.28rem;" :key="index" v-for="(info,index) in data[1].defaultListInfoDTOS" tag="li">
          <img v-bind:src="info.url" style="width:.4rem;height:.4rem;margin-top:.05rem;">{{info.name}}
        </router-link> -->
        <li class="icon" style="padding-left:.9rem;font-size:.28rem;" :key="index" v-for="(info,index) in data[1].defaultListInfoDTOS"><img v-bind:src="info.url" style="width:.4rem;height:.4rem;margin-top:.05rem;">{{info.name}}</li>
      </ul>         
    </div>
    <div class="neighbor" v-if="data[2]">
      <!-- <h3 class="title" v-if="data[2].moduleName">{{data[2].moduleName}}</h3> -->
      <router-link class="title" tag="h3" :to="'/specliaInfo/' + data[2].bindingId" v-if="data[2].moduleName">
        <i class="more">{{data[2].moduleName}}</i>
      </router-link>
      <div class="neighborList">
        <swiper :options="swiperOption2" class="swiperGoods">
          <swiper-slide v-for="item in data[2].defaultListInfoDTOS" :key="item.id">
            <div class="goods" v-on:click="goodClick(item, data[2])">
              <dt><img v-bind:src="item.idInfo[0].url"/></dt>
              <dd>
                <h3 class="goodsName">{{item.idInfo[0].name}}</h3>
                <p class="owner" v-if="appUserType == 'notLogin' || appUserType == 'OWNER' || appUserType == 'STAFF'">业主价￥{{item.idInfo[0].onwerPrice | twoDecimal}}</p>
                <p class="selling" :class="{sellingAdd: appUserType != 'notLogin'}" v-if="appUserType == 'notLogin' || appUserType == 'GENERAL'">优选价￥{{item.idInfo[0].originalPrice | twoDecimal}}</p>
                <p class="selling" style="text-decoration:line-through;" v-if="appUserType == 'OWNER' || appUserType == 'STAFF'">优选价￥{{item.idInfo[0].originalPrice | twoDecimal}}</p>
              </dd>
            </div>
          </swiper-slide>
        </swiper>
      </div>
    </div> 
    <div v-if="data[3]">
      <div v-for="item in data[3].defaultListInfoDTOS" :key="item.bindingId">
        <router-link :to="'/goodsDetail/' + item.bindingId" v-if="item.idType == 'SKU'" tag="div" class="goods">
          <img v-lazy="item.url"/> <!-- 货品 -->
        </router-link>   
        <router-link :to="'/specialDetail/' + item.bindingId" v-if="item.idType == 'THEME'" tag="div" class="goods">
          <img v-lazy="item.url"/> <!-- 专题 -->
        </router-link> 
        <router-link :to="'/specialDetail/' + item.bindingId" v-if="item.idType == 'SPECIAL'" tag="div" class="goods">
          <img v-lazy="item.url"/> <!-- 专场 -->
        </router-link> 
      </div>
    </div>
    <div class="youLike" v-if="data[4]">
      <router-link class="title" tag="h3" :to="'/explodeBack'" v-if="data[4].moduleName">
        <i class="more">{{data[4].moduleName}}</i>
      </router-link>
      <div class="goodsList">
        <div class="goods" v-on:click="goodClick(item, data[4])" v-for="item in data[4].defaultListInfoDTOS" :key="item.bindingId">
          <dt><img v-lazy="item.idInfo[0].url"/></dt>
          <dd v-if="item.idType=='SKU'">
            <h3 class="goodsName">{{item.idInfo[0].name}}</h3>
            <p class="owner" v-if="appUserType == 'notLogin' || appUserType == 'OWNER' || appUserType == 'STAFF'">业主价<span>￥{{item.idInfo[0].onwerPrice | twoDecimal}}</span></p>
            <p class="selling" :class="{sellingAdd: appUserType != 'notLogin'}" v-if="appUserType == 'notLogin' || appUserType == 'GENERAL'">优选价￥{{item.idInfo[0].originalPrice | twoDecimal}}</p>

            <p class="selling" style="text-decoration:line-through;" v-if="appUserType == 'OWNER' || appUserType == 'STAFF'">优选价￥{{item.idInfo[0].originalPrice | twoDecimal}}</p>
          </dd>
          <dd v-else>
            <h3 class="goodsName">{{item.idInfo[0].name}}</h3>
            <p class="sellingAdd">特价<span>￥{{item.idInfo[0].specialPrice | twoDecimal}}</span></p>
          </dd>
        </div>
      </div>
    </div> 
    <div class="youLike" v-if="data[5]">
      <h3 class="title" v-if="data[5].moduleName">{{data[5].moduleName}}</h3>
      <div class="goodsList">
        <div class="goods" v-on:click="goodClick(item, data[5])" v-for="item in data[5].defaultListInfoDTOS" :key="item.bindingId">
          <dt><img v-lazy="item.idInfo[0].url"/></dt>
          <dd>
            <h3 class="goodsName">{{item.idInfo[0].name}}</h3>
            <p class="owner" v-if="appUserType == 'notLogin' || appUserType == 'OWNER' || appUserType == 'STAFF'">业主价<span>￥{{item.idInfo[0].onwerPrice | twoDecimal}}</span></p>
            <p class="selling" :class="{sellingAdd: appUserType != 'notLogin'}" v-if="appUserType == 'notLogin' || appUserType == 'GENERAL'">优选价￥{{item.idInfo[0].originalPrice | twoDecimal}}</p>
            
            <p class="selling" style="text-decoration:line-through;" v-if="appUserType == 'OWNER' || appUserType == 'STAFF'">优选价￥{{item.idInfo[0].originalPrice | twoDecimal}}</p>
          </dd>
        </div>
      </div>
    </div>
  </swiper-scroller>
</template>
<script>
export default {
  data () {
    // let self = this
    return {
      data: {},
      swiperOption1: {
        pagination: {
          el: '.swiper-pagination'
        },
        paginationClickable: true,
        autoplay: true,
        slidesPerView: 'auto',
        loop: true
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
    goto (url) {
      this.$router.push(url)
    },
    goodClick (item, data) {
      console.log(item)
      var that = this
      that.$loading.open()
      if (data.bindingId) {
        that.$axios.get('/special/genre/activiy/get/app/check/buy/' + data.bindingId).then((res) => {
          if (res) {
            that.$router.push({path: '/goodsDetail/' + item.bindingId})
          }
          that.$loading.close()
          that.scroll && that.scroll.forceUpdate(true)
        })
      } else {
        that.$router.push({path: '/goodsDetail/' + item.bindingId})
      }
    },
    gotoBuyGifts () {
      this.$router.push({path: '/toBuyGifts'})
    },
    pullingDown () {
      this.getData(() => {
        this.scroll.pulldownLoadEnd()
      })
    },
    pullingUp () {
      this.scroll.pulldownLoadEnd()
    },
    getData (callback) {
      var that = this
      // that.$loading.open()
      that.$axios.get('/app/system/app/index/get/all/default/index/info/app').then((res) => {
        if (res) {
          that.data = res
          // that.$loading.close()
          that.scroll && that.scroll.forceUpdate(true)
        }
        setTimeout(() => {
          if (callback) {
            callback()
          }
        }, 500)
      })
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
</style>