<template>
<div class="page">
  <m-header><!--  style="font-size: 23px;color: #7f7f7f;" -->
    <span slot="left"></span>
    <span slot="title">评价</span>
  </m-header>
  <div class="topTabs">
    <swiper :options="swiperOption">
      <swiper-slide v-for="(tab,index) in tabs"  :class="{'active':index == tabIndex}" :key="tab.index">
        <div @click="onTabClick(index)">{{tab}}</div>
      </swiper-slide>
    </swiper>    
  </div>
  <div class="page-content hasTopTabs">
    <div class="cont" v-if="tabIndex == 0">
      <scroller class="hasBg" :on-refresh="onRefresh" :on-infinite="onInfinite">
        <div class="assess_items" v-for="item in data.list">
          <p class="userImg"><img v-bind:src="item.userUrl"></p>
          <div class="assess_username">
            <div>{{item.userName}}</div>
            <div class="assess_time">{{item.createTime}}</div>
          </div>
          <div v-for="pic in item.picture">
            <div v-if="pic.userClassify == 'USER'">
              <div class="assess_text">{{pic.contentData}}</div>
              <div class="imgList" v-if="pic.picture">
                <ul>
                  <li v-for="(picc,index) in pic.picture">
                    <img v-bind:src="picc.commentariesImg" @click="showImgList(pic.picture,index)">
                  </li>
                </ul>
              </div>              
            </div>
            <div class="assess_text" v-if="pic.userClassify == 'SHOP'">
              客服回复：{{pic.contentData}}
            </div>
          </div>
        </div>
        <div v-if="infiniteCount >= 12" slot="infinite" class="text-center">没有更多数据</div>
      </scroller>
    </div>
    <div class="cont" v-if="tabIndex == 1">
      <scroller class="hasBg" :on-refresh="onRefresh" :on-infinite="onInfinite">
        <div class="assess_items" v-for="item in data.list">
          <p class="userImg"><img v-bind:src="item.userUrl"></p>
          <div class="assess_username">
            {{item.userName}}<div class="assess_time">{{item.createTime}}</div>
          </div>
          <div v-for="pic in item.picture">
            <div v-if="pic.userClassify == 'USER'">
              <div class="assess_text">{{pic.contentData}}</div>
              <div class="imgList" v-if="pic.picture">
                <ul>
                  <li v-for="(picc,index) in pic.picture">
                    <img v-bind:src="picc.commentariesImg" @click="showImgList(pic.picture,index)">
                  </li>
                </ul>
              </div>              
            </div>
            <div class="assess_text" v-if="pic.userClassify == 'SHOP'">
              客服回复：{{pic.contentData}}
            </div>
          </div>
        </div>
        <div v-if="infiniteCount >= 12" slot="infinite" class="text-center">没有更多数据</div>
      </scroller>
    </div>
  </div>
  <mt-popup v-model="isShow" position="bottom" class="mint-popup-4">
    <atlas v-if="isShow" class="pics" :imagesList="imagesList" :index="curIndex" @closeatlas="closeAtlasclick"></atlas> 
  </mt-popup>
  <!-- <atlas v-if="isShow" class="pics" :imagesList="imagesList" :index="curIndex" @closeatlas="closeAtlasclick"></atlas> -->
</div>
</template>
<script>
import atlas from '../modal/atlas.vue'
export default{
  components: {
    atlas
  },
  data () {
    return {
      tabs: [
        '全部',
        '有图'
      ],
      tabIndex: 0,
      data: {},
      infiniteCount: 12,
      isShow: false,
      imagesList: [],
      curIndex: '',
      swiperOption: {
        slidesPerView: 2,
        paginationClickable: true,
        spaceBetween: 0,
        freeMode: true
      }
    }
  },
  created () {
    this.onTabClick(0)
  },
  methods: {
    getData (params) {
      var that = this
      that.$loading.open()
      that.$axios.post('/shop/Appraise/productList', params).then((res) => {
        if (res) {
          that.$loading.close()
          that.data = res
        }
      })
    },
    onTabClick (index) {
      var that = this
      that.tabIndex = index
      var params
      if (index === 0) {
        params = { // 全部
          'picture': 'FALSE',
          'merchandiseId': that.$route.params.id,
          'shopId': that.getLocalstorage('shopId')
        } // 商品评论
      } else {
        params = { // 有图
          'picture': 'TRUE',
          'merchandiseId': that.$route.params.id,
          'shopId': that.getLocalstorage('shopId')
        }
      }
      that.data = {}
      that.getData(params)
    },
    onRefresh (done) {
      var that = this
      setTimeout(() => {
        that.onTabClick(that.tabIndex)
        done()
      }, 1000)
    },
    onInfinite (done) {
      setTimeout(() => {
        done()
      }, 1000)
    },
    showImgList (list, index) {
      this.imagesList = list
      this.curIndex = index
      this.isShow = true
    },
    // 关闭图集
    closeAtlasclick () {
      this.isShow = false
    }
  }
}
</script>
<style lang="less" scoped>
.assess_items{
  background: #fafafa;
  padding: .2rem .2rem .2rem 1.1rem;
  border-bottom: 1px solid #eee;
  position: relative;
  overflow: hidden;
  .userImg{
    height: .8rem;
    width: .8rem;
    border: 1px solid #eee;
    position: absolute;
    top:.2rem;
    left: .2rem;
    border-radius: .8rem;
    overflow: hidden;
    img{
      height: .8rem;
      width: .8rem;
      border-radius: .8rem;
        height: 100%;
        position: absolute;
        top: -9999px;
        bottom: -9999px;
        left: -9999px;
        right: -9999px;
        margin: auto;
        max-width: none;
    }
  }
  .assess_username{
    height: .7rem;
    color: #323333;
    font-size: .3rem;
    margin-left: .1rem;
    position: relative;
    line-height: .6rem;
    span{
      display: block;
      color: #929999;
      font-size: .24rem;
    }
  }
  .assess_time{
    position: absolute;
    top:0;
    right: .24rem;
    color: #929999;
    font-size: .24rem;
  }
  .assess_text{
    color: #323333;
    font-size: .28rem;
    line-height: .4rem;
    margin-left: .1rem;
    padding: .1rem 0;
  }
  .imgList{
    margin-top:.1rem;
    margin-left: .1rem;
    clear: both;
    overflow: hidden;
    li{
      float: left;
      width: 1.5rem;
      height: 1.5rem;
      margin-right: .26rem;
      margin-bottom: .16rem;
      overflow: hidden;
      position: relative;
      img{
        width: 100%;
        position: absolute;
        top: -9999px;
        bottom: -9999px;
        left: -9999px;
        right: -9999px;
        margin: auto;
      }
    }
  }
}
.mint-popup-4{
  height: 100%;
  width: 100%;
}
</style>
