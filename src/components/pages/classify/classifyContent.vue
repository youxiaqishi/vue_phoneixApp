<template>
  <div class="page-content hasTopTabs">
    <div class="cont" v-if="tabIndex != 0">
      <div class="leftCont scroll1">
        <ul class="leftCont scroll-inner1 " style="transform: translate3d(0px, 0px, 0px)">
          <li v-for="(item,index) in data.menuList" v-on:click="changeClassify(item,index)" :class="{'curClass':goodsIndex == index}">{{item.label}}</li>
        </ul>
      </div>
      <mr-better-scroll ref="scroll2" class="rightCont"
      :pullDownRefresh="true" 
      @pullingDown="pullingDown"
      :pullUpLoad="infiniteCount < currentCount" 
      @pullingUp="pullingUp" v-if="contData.length > 0 && tabIndex != 0">
        <router-link :to="'/goodsDetail/' + cont.skuId" tag="dl" class="infoData" v-for="cont in contData" :key="cont.skuId">
          <dt><img v-bind:src="cont.url"/><span class="sellOut" v-if="cont.sellOut"></span></dt>
          <dd>
            <h3>{{cont.name}}<br/>
            </h3>
            <div class="price">
              <p class="owner">业主价：<span>￥{{cont.onwerPrice | twoDecimal}}</span> </p>
              <p class="selling">优选价：<span>￥{{cont.originalPrice | twoDecimal}}</span></p>
            </div>
          </dd>
        </router-link>
      </mr-better-scroll>
      <div v-if="contData.length < 1" class="no-news" style="color: gray;margin-left: 3rem;">甄选商品中，敬请期待</div>
    </div>
    <div class="cont" v-if="tabIndex == 0">
      <mr-better-scroll ref="scroll1"
      :pullDownRefresh="true" 
      @pullingDown="pullingDown"
      :pullUpLoad="pullUpLoad" 
      @pullingUp="pullingUp" v-if="tabIndex == 0">
        <div class="otherStyle">
          <div class="goodsList">
            <router-link :to="'/goodsDetail/' + item.skuId" tag="dl" :key="item.skuId" v-for="item in otherData.list" class="goods">
              <dt><img v-bind:src="item.url"/></dt>
              <dd>
                <h3 class="goodsName">{{item.name}}</h3>
                <p class="owner">业主价<span>￥{{item.onwerPrice | twoDecimal}}</span></p>
                <p class="selling">优选价￥{{item.originalPrice | twoDecimal}}</p>
              </dd>
            </router-link>
          </div>
        </div>
      </mr-better-scroll>
    </div>
  </div>
</template>
<script>
import store from '../../../store/index'
export default {
  data () {
    return {
      tabsData: [],
      tabIndex: 0,
      swiperOption: {
        slidesPerView: 5,
        paginationClickable: true,
        spaceBetween: 0,
        freeMode: true
      },
      data: {
        menuList: [] // 左边栏
      },
      contData: [], // 右边栏
      otherData: {}, // 全部商品
      goodsIndex: 0, // 左边栏下标
      currentId: '', // 当前左边栏ID
      page: 1, // 页码
      currentCount: 0, // 当前数据数
      infiniteCount: 0, // 数据总数
      pullUpLoad: true
    }
  },
  store,
  computed: {
    swiper () {
      return this.$refs.mySwiper.swiper
    },
    scroll1 () {
      return this.$refs.scroll1
    },
    scroll2 () {
      return this.$refs.scroll2
    }
  },
  mounted () {
    this.initSwiper()
  },
  created () {
    var that = this
    that.getData()
  },
  methods: {
    initSwiper (index) { // 初始化banner
      var that = this
      setTimeout(function () {
        var num = that.tabIndex
        if (num === 1) {
          that.swiper.setWrapperTranslate(0)
          that.swiper.setWrapperTransition(300)
        } else {
          that.swiper.slideTo(num - 1, 500, false)
        }
      })
    },
    getData () {
      var that = this
      that.$loading.open()
      that.$axios.get('/app/shop/getCategoryTree').then((res) => { // 选项卡
        if (res) {
          that.$loading.close()
          that.$store.state.mutations.indexPage.tabs = ['全部']
          that.tabsData = res
          that.tabsData.forEach(function (item) {
            that.$store.state.mutations.indexPage.tabs.push(item.label)
          })
          that.onTabClick(0)
          // if (res[0]) { // 左边栏
          //   that.$axios.get('/app/shop/getCategoryTreeFinalId/' + res[0].id).then((res) => {
          //     if (res) {
          //       that.data.menuList = res
          //       if (res[0]) that.changeClassify(res[0], 0)
          //       that.scroll.forceUpdate(true)
          //     }
          //   })
          // }
        }
      })
      // that.onTabClick(0)
    },
    changeClassify (item, index) { // 右边栏
      var that = this
      that.goodsIndex = index
      that.currentId = item.id// 上拉使用
      that.page = 1// 默认分页
      if (!item) return
      var params = {
        'shopId': that.getLocalstorage('shopId'),
        'categoryId': item.id
      }
      that.$axios.post('/app/shop/get/all/myshop/sku/info?p=1&c=10', params).then((res) => {
        if (res) {
          that.contData = res.list
          that.currentCount = parseInt((res.count - 1) * 0.1)
          // that.scroll2.forceUpdate(true)
        }
      })
    },
    onTabClick (index) { // 选项卡切换
      var that = this
      that.page = 1
      that.tabIndex = index
      that.pullUpLoad = true
      that.infiniteCount = 0
      if (index !== 0) { // 左边栏
        that.$axios.get('/app/shop/getCategoryTreeFinalId/' + that.tabsData[index - 1].id).then((res) => {
          if (res) {
            that.data.menuList = res
            if (res[0]) that.changeClassify(res[0], 0)
            that.scroll2 && that.scroll2.forceUpdate(true)
          }
        })
        that.initSwiper()
      } else {
        var params = {
          'shopId': that.getLocalstorage('shopId'),
          'skuName': '',
          'price': '',
          'sale': ''
        }
        that.$axios.post('/app/shop/get/myshop/sku/info/search?p=1&c=10', params).then((res) => {
          if (res) {
            that.otherData = res
            that.currentCount = parseInt((res.count - 1) * 0.1)
            if (that.infiniteCount < that.currentCount) {
              that.pullUpLoad = true
            }
            that.scroll1 && that.scroll1.forceUpdate(true)
          }
        })
      }
    },
    search () { // 搜索
      this.$router.push({path: '/search'})
    },
    pullingDown () { // 下拉
      setTimeout(() => {
        this.page = 1
        this.infiniteCount = 0
        this.currentCount = 0
        this.pullUpLoad = true
        this.onTabClick(this.tabIndex)
        // done()
      }, 500)
    },
    pullingUp () { // 上拉
      setTimeout(() => {
        var that = this
        console.log(that.infiniteCount, that.currentCount)
        if (that.infiniteCount < that.currentCount) {
          that.page++
          that.infiniteCount++
          if (that.infiniteCount >= that.currentCount) {
            that.pullUpLoad = false
          }
          if (that.tabIndex !== 0) { // 分类商品
            var params = {
              'shopId': that.getLocalstorage('shopId'),
              'categoryId': that.currentId
            }
            that.$axios.post('/app/shop/get/all/myshop/sku/info?p=' + that.page + '&c=10', params).then((res) => {
              if (res) {
                res.list.forEach(function (item) {
                  that.contData.push(item)
                })
                that.scroll2.forceUpdate(true)
              }
            })
          } else { // 全部商品
            var params1 = {
              'shopId': that.getLocalstorage('shopId'),
              'skuName': '',
              'price': '',
              'sale': ''
            }
            that.$axios.post('/app/shop/get/myshop/sku/info/search?p=' + that.page + '&c=10', params1).then((res) => {
              if (res) {
                res.list.forEach(function (item) {
                  that.otherData.list.push(item)
                })
                that.scroll1.forceUpdate(true)
              }
            })
          }
        }
        // done()
      }, 500)
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
</style>
