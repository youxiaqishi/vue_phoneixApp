<template>
  <div class="page">
    <m-header>
      <span slot="left"></span>
      <span slot="title">
        <form action="javascript:return true;">
          <input type="search" name="搜索" id="inputStyle" v-on:keyup.enter="search(startSearch)"  v-model="startSearch" placeholder="搜索商品,自有品牌健康安全">
        </form>
      </span>
      <span slot="right" class="search" @click="search(startSearch)">搜索</span>
    </m-header>
    <ul class="topTabs navList" v-if="isSearch">
      <li :class="{'curTab':curTab == 0}" v-on:click="changeTab(0)">综合</li>
      <li :class="{'curTab':curTab == 1}" v-on:click="changeTab(1)">销量 
        <p>
          <i class="icon-arrow-up" :class="{'cur':curTab == 1 && !sort1}"></i>
          <i class="icon-arrow-down" :class="{'cur':curTab == 1 && sort1}"></i>
        </p>
      </li>
      <li :class="{'curTab':curTab == 2}" v-on:click="changeTab(2)">价格 
        <p>
          <i class="icon-arrow-up" :class="{'cur':curTab == 2 && !sort2}"></i>
          <i class="icon-arrow-down" :class="{'cur':curTab == 2 && sort2}"></i>
        </p>
      </li>
    </ul>
    <div class="page-content hasTopTabs" v-if="isSearch">
      <div v-if="allData.list && allData.list.length < 1" class="no-news">暂无结果</div>
      <div class="pageCont" v-if="allData.list && allData.list.length > 0">
        <mr-better-scroll ref="scroll"
        :pullDownRefresh="true" @pullingDown="pullingDown">
          <div class="otherStyle">
            <div class="goodsList">
              <dl v-for="item in allData.list" class="goods">
              <router-link :to="'/goodsDetail/' + item.skuId">
                <dt><img v-bind:src="item.url"/></dt>
                <dd>
                  <h3 class="goodsName">{{item.name}}</h3>
                  <p class="sales" :class="{salesAdd: appUserType != 'notLogin'}" v-if="!item.sales">销量 <span>0</span></p>
                  <p class="sales" :class="{salesAdd: appUserType != 'notLogin'}" v-else>销量 <span>{{item.sales}}</span></p>
                  <p class="owner" v-if="(item.activityInfoDTO.type == 'COMMON' || item.activityInfoDTO.type == 'BUY_PRESENT' || item.activityInfoDTO.type == 'SPECIAL' || item.activityInfoDTO.type == 'GIVE' || item.activityInfoDTO.type == 'DISCOUNT') && (appUserType == 'notLogin' || appUserType == 'OWNER' || appUserType == 'STAFF')">业主价 <span>￥{{item.onwerPrice | twoDecimal}}</span></p>
                  <p class="selling" :class="{sellingAdd: appUserType != 'notLogin'}" v-if="(item.activityInfoDTO.type == 'COMMON' || item.activityInfoDTO.type == 'BUY_PRESENT' || item.activityInfoDTO.type == 'SPECIAL' || item.activityInfoDTO.type == 'GIVE' || item.activityInfoDTO.type == 'DISCOUNT') && (appUserType == 'notLogin' || appUserType == 'GENERAL')">优选价 ￥{{item.originalPrice | twoDecimal}}</p>
                  <p class="owner" v-if="item.activityInfoDTO.type == 'SECKILL'">秒杀价：<span>￥{{item.activityInfoDTO.activityPrice | twoDecimal}}</span> </p>
                  <p class="owner" v-if="item.activityInfoDTO.type == 'FLASH_SALE'">限时价：<span>￥{{item.activityInfoDTO.activityPrice | twoDecimal}}</span> </p>
                  <p class="owner" v-if="item.activityInfoDTO.type == 'OPENGROUP' || item.activityInfoDTO.type == 'JOINGROUP'">拼团价：<span>￥{{item.activityInfoDTO.activityPrice | twoDecimal}}</span> </p>
                  <p class="owner" v-if="item.activityInfoDTO.type == 'PRESELL'">预售价：<span>￥{{item.activityInfoDTO.activityPrice | twoDecimal}}</span> </p>
                  <p class="owner" v-if="item.activityInfoDTO.type == 'GROUPBUY'">团购价：<span>￥{{item.activityInfoDTO.activityPrice | twoDecimal}}</span> </p>
                  <p class="owner" v-if="item.activityInfoDTO.type == 'SPECIALOFFER'">特价：<span>￥{{item.activityInfoDTO.activityPrice | twoDecimal}}</span> </p>
                </dd>
              </router-link>
              </dl>
            </div>
          </div>
        </mr-better-scroll>
      </div>
    </div>
    <div class="page-content" v-if="!isSearch">
      <div class="searchCont">
        <h6>历史搜索<span class="icon-delete delete" v-on:click="deleteData();"></span></h6>
        <ul>
          <li v-for="item in history" v-on:click="search(item);">{{item}}</li>
        </ul>
      </div>
      <!-- <div class="searchCont">
        <h6>大家都在搜</h6>
        <ul>
          <li v-for="item in common" v-on:click="search(item);">{{item}}</li>
        </ul>
      </div> -->
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
import {getStore, setStore} from '../../../config/mUtils'
export default {
  data () {
    return {
      sort1: false, // 销量
      sort2: false, // 价格
      isSearch: false, // 是否点击搜索
      autofocus: '', // 自动聚焦
      saleParams: '', // 销量参数
      priceParams: '', // 价格参数
      startSearch: '', // 搜索输入内容
      appUserType: '', // 用户身份
      page: 1, // 页码
      curTab: 0, // 当前tab
      totalCount: 0, // 当前数据数
      initCount: 0, // 数据总数
      history: [], // 历史搜索
      allData: {list: []} // 搜索结果
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
    window.$getLocalstorage('userInfo') ? this.appUserType = window.$getLocalstorage('userInfo').appUserType : this.appUserType = 'notLogin' // 身份标识
    setTimeout(() => { window.document.getElementById('inputStyle').focus() }, 800)
    this.getData()
  },
  methods: {
    getData () { // 历史搜索
      if (getStore('searchHistory')) this.history = JSON.parse(getStore('searchHistory'))
    },
    search (cont) { // 搜索
      window.document.getElementById('inputStyle').blur() // 收起键盘
      this.allData = {} // 置空数据
      if (this.curTab !== 0) { // 非综合搜索则为排序
        this.changeTab(this.curTab)
        return
      }
      if (!cont) {
        this.isSearch = false
        this.$toast({message: '请输入搜索内容', duration: 800})
        return
      } else {
        this.startSearch = cont // 从历史记录进入赋值到搜索框
        var params = {
          'shopId': window.$getLocalstorage('shopId'),
          'skuName': cont,
          'price': '',
          'sale': ''
        }
      }
      var that = this
      that.postSearch(params).then(function (searchRes) {
        if (searchRes) {
          that.allData = searchRes
          that.page = 1
          that.initCount = 0
          that.totalCount = parseInt((searchRes.count - 1) * 0.1)
          that.history.push(params.skuName)
          that.history = _.uniq(that.history)
          setStore('searchHistory', that.history)
          if (that.initCount <= that.totalCount) {
            that.scroll && that.scroll.forceUpdate(false)
          }
        }
      })
    },
    changeTab (tab, theSort) { // 排序or下拉
      this.allData = {}
      this.curTab = tab
      var params = {
        'shopId': window.$getLocalstorage('shopId'),
        'skuName': this.startSearch,
        'price': '',
        'sale': ''
      }
      if (tab === 1) { // 销量
        this.sort2 = false
        if (theSort) { // 下拉排序规则不变
          params.sale = theSort
        } else { // tab点击改变排序规则
          this.sort1 = !this.sort1
          this.sort1 ? params.sale = 'DOWN' : params.sale = 'UP'
          this.saleParams = params.sale
        }
      } else if (tab === 2) { // 价格
        this.sort1 = false
        if (theSort) { // 下拉排序规则不变
          params.sale = theSort
        } else { // tab点击改变排序规则
          this.sort2 = !this.sort2
          this.sort2 ? params.price = 'DOWN' : params.price = 'UP'
          this.priceParams = params.price
        }
      } else {
        this.sort1 = false
        this.sort2 = false
      }
      var that = this
      that.postSearch(params).then(function (searchRes) {
        if (searchRes) {
          that.allData = searchRes
          that.page = 1
          that.initCount = 0
          that.totalCount = parseInt((searchRes.count - 1) * 0.1)
        }
      })
    },
    postSearch (params) { // 共用接口
      var that = this
      that.$loading.open()
      return new Promise((resolve, reject) => {
        that.$axios.post('/app/shop/get/myshop/sku/info/search?p=1&c=100', params).then((searchRes) => {
          that.$loading.close()
          that.isSearch = true
          that.scroll && that.scroll.forceUpdate(true)
          resolve(searchRes)
        })
      })
    },
    deleteData () { // 清空历史搜索
      this.showConfirm('清空记录', '是否清空历史搜索记录？', () => {
        this.history = []
        setStore('searchHistory', [])
      })
    },
    pullingDown () { // 下拉
      var theSort = ''
      if (this.curTab === 1) { // 销量顺序
        theSort = this.saleParams
      } else if (this.curTab === 2) { // 价格顺序
        theSort = this.priceParams
      }
      this.changeTab(this.curTab, theSort)
    },
    pullingUp () { // 上拉
      if (this.initCount < this.totalCount) {
        this.page++
        this.initCount++
        var params = {
          'shopId': this.getLocalstorage('shopId'),
          'skuName': this.startSearch,
          'price': '',
          'sale': ''
        }
        if (this.curTab === 1) { // 销量
          this.sort2 = false
          this.sort1 = !this.sort1
          this.sort1 ? params.sale = 'DOWN' : params.sale = 'UP'
        } else if (this.curTab === 2) { // 价格
          this.sort1 = false
          this.sort2 = !this.sort2
          this.sort2 ? params.price = 'DOWN' : params.price = 'UP'
        } else {
          this.sort1 = false
          this.sort2 = false
        }
        var that = this
        that.$axios.post('/app/shop/get/myshop/sku/info/search?p=' + that.page + '&c=10', params).then((res) => {
          if (res) {
            res.list.forEach(function (item) {
              that.allData.list.push(item)
            })
          }
          that.scroll.forceUpdate(true)
        })
      } else {
        that.scroll.forceUpdate(false)
      }
    },
    showConfirm (cont, title, callback) {
      this.$messageBox.confirm(cont, title, {closeOnClickModal: false}).then(action => {
        if (action) callback()
      })
    }
  }
}
</script>
<style lang="less" scoped>
.otherStyle{
  padding: .24rem;
  overflow: hidden;
  .goods{
    height: 5.3rem;
    .sales{
      font-size: .25rem;
      color: #89262a;
    }
    .salesAdd{
      margin-top: .1rem;
      margin-bottom: .2rem;
    }
  }
}
#inputStyle{
    background: #f4f4f4;
    height: 24px;
    display: block;
    font-size: .3rem;
    padding-left:10px;
    width: 77%;
    border-radius: 25px;
    margin-top: 10px;
    margin-left: 10%;
}
.search{
  font-size: .28rem;
  color: #555;
}
.page-content{
  background: #fff;
  .searchCont{
    clear: both;
    overflow: hidden;
    margin:0 .24rem;
    border-bottom: 1px solid #eee;
    h6{
      margin:0;
      font-size: .3rem;
      color: #999;
      line-height: 1rem;
      .delete{
        width: 1rem;
        height: 1rem;
        text-align: right;
        float: right;
        font-size: .45rem;
      }
    }
    li{
      padding:.01rem .1rem;
      font-size: .25rem;
      font-size: #333;
      float: left;
      border:1px solid #333;
      border-radius: 3px;
      margin-right: .25rem;
      margin-bottom: .25rem;
    }
  } 
  .searchCont:last-child{
    border-bottom:none;
  }
}
.navList{
  height: .9rem;
  line-height: .9rem;
  border-bottom: 1px solid #eee;
  position: fixed;
  width:100%;
  background: #fff;
  z-index: 7;
  left: 0;
  li{
    float: left;
    width: 33.33%;
    text-align: center;
    position: relative;
    font-size: .28rem;
    p{
      position: absolute;
      top: .3rem;
      right: .5rem;
      height: .5rem;
      width: .5rem;
      i{
        display: block;
        height: .15rem;
        font-size: .15rem;
        color: #929999;
      }
      i.cur{
        color: #89262a;
      }
    }
  }
}
.bg{
  background: #fff!important;
  padding: 0 .24rem;
  .otherStyle{
    padding-top: 0;
    overflow: hidden;
  }
}
.curTab{
  color: #89262a;
}
</style>