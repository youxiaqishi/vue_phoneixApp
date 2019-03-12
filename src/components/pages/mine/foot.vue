<template>
  <div class="page savePage">
    <m-header>
      <span slot="left"></span>
      <span slot="title">足迹</span>
      <span slot="right" style="font-size: .26rem;" @click="deleteFoot()">清空</span>
    </m-header>
    <div class="page-content">
      <div v-if="data.list && data.list.length < 1" class="no-news">还没有足迹</div>
      <mr-scroll-keeper>
        <mr-better-scroll ref="scroll"
        :pullDownRefresh="true" @pullingDown="pullingDown"
        :pullUpLoad="true" @pullingUp="pullingUp">
          <div class="savelist" v-on:touchmove.capture="ontouchmove" v-if="data.list && data.list.length > 0">
            <mt-cell-swipe v-for="(item,index) in data.list" :key="index" class="savedataBox" 
              :right="[{
                content: '删除',
                style: { background: 'red', color: '#fff' ,lineHeight:'2.5rem'},
                handler: () => deleteItem(index,item,data.list)
              }]">
              <router-link :to="'/goodsDetail/' + item.id" tag="div" class="footList">
                <div class="imgBox">
                  <img v-lazy="item.url[0].url">
                </div>
                <div class="savedescription">
                  <div class="savedesc">{{item.name | maxLength(35)}}</div>
                  <div class="saveprice">
                      <p class="ownerpri">业主价 <span>￥{{item.onwerPrice | twoDecimal}}</span></p>
                      <p class="prepri">优选价 <span>￥{{item.originalPrice | twoDecimal}}</span></p>
                  </div>
                </div>
              </router-link>
            </mt-cell-swipe>              
          </div>
        </mr-better-scroll>
      </mr-scroll-keeper>
    </div>
  </div>
</template>
<script>
import store from '../../../store/index.js'
export default {
  data () {
    return {
      data: {list: []},
      currentCount: 0, // 当前数据数
      infiniteCount: 0, // 数据总数
      page: 1 // 页码
    }
  },
  created () {
    this.getData(1)
  },
  computed: {
    scroll () {
      return this.$refs.scroll
    }
  },
  store,
  methods: {
    getData (page) {
      var that = this
      var appUserStatus = 'VISITOR'
      var userId = that.getLocalstorage('visitorId')
      if (that.getLocalstorage('userInfo')) {
        appUserStatus = 'USER'
        userId = that.getLocalstorage('userInfo').id
      }
      that.$axios.post('/footprint/query/footprint/list/' + appUserStatus + '/' + userId + '/?p=' + page + '&c=10').then((res) => {
        if (res) {
          if (page === 1) that.data.list = []
          that.data.list = that.data.list.concat(res.list)
          that.currentCount = parseInt(res.count * 0.1)
          setTimeout(function () { that.scroll && that.scroll.forceUpdate(true) }, 500)
        }
      })
    },
    ontouchmove () {
      if (this.scroll) {
        this.scroll.scroll.moved = true
      }
    },
    deleteItem: function (index, info, data) { // 删除足迹
      var that = this
      var params = {
        'shopId': that.getLocalstorage('shopId'),
        'goodsId': info.id,
        'id': that.getLocalstorage('visitorId'),
        'appUserStatus': 'VISITOR'
      }
      if (that.getLocalstorage('userInfo')) {
        params.appUserStatus = 'USER'
        params.id = that.getLocalstorage('userInfo').id
      }
      that.$axios.post('/footprint/delete', params).then((res) => {
        data.splice(index, 1)
      })
    },
    deleteFoot () {
      var that = this
      that.$messageBox.confirm('确认删除全部足迹?', '提示', {
        closeOnClickModal: true
      }).then(function () {
        that.$axios.get('/footprint/delete/ids').then((res) => {
          if (res) {
            that.data = { list: [] }
            that.$toast({message: '删除成功', duration: 800})
          }
        })
      }, function () {})
    },
    pullingDown () { // 下拉刷新
      setTimeout(() => {
        this.page = 1
        this.infiniteCount = 0
        this.data = {list: []}
        this.scroll.forceUpdate(true)
        this.getData(1)
      }, 1000)
    },
    pullingUp () {
      setTimeout(() => { // getData
        var that = this
        if (that.infiniteCount < that.currentCount) {
          that.page++
          that.infiniteCount++
          that.getData(that.page)
        } else {
          that.scroll.forceUpdate(false)
        }
      }, 100)
    }
  }
}
</script>
<style lang="less">
@import "../../../../static/css/mine.less";
.mint-cell:last-child{
  background: none!important;
}
.savePage{

}
</style>