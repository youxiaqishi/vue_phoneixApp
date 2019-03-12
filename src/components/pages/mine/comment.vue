<template>
<div class="page couponCont">
  <m-header>
    <span slot="left"></span>
    <span slot="title">我的评价</span>
  </m-header>
  <div class="topTabs">
    <swiper :options="swiperOption">
      <swiper-slide v-for="(tab,index) in tabs"  :class="{'active':index == tabIndex}" :key="index">
        <div @click="tabClick(tab.type,index)">{{tab.name}}</div>
      </swiper-slide>
    </swiper>    
  </div>
  <div class="page-content hasTopTabs">
    <scroller :on-refresh="onRefresh" :on-infinite="onInfinite">
      <div v-if="allData.list && allData.list.length < 1" class="no-news">还没有评价</div>
      <div class="appraise" v-if="allData.list && allData.list.length > 0">
        <div class="appraiseInfo" v-for="(item,index) in allData.list" >
          <div class="cont">
            <div class="time">
              {{item.anonymity}}
              <span>{{item.createTime}}</span>
              <div class="delete" @click="deleteInfo(item,index)">...</div>
            </div>
            <div class="content" v-for="(pic,index) in item.picture">
              <div class="custom_comment" v-if="pic.userClassify=='USER'">
                <p class="contentData">{{pic.contentData}}</p>
                <ul v-if="pic.picture.length !== 0" class="imgList">
                  <li v-for="(img,index) in pic.picture" @click="showImgList(pic.picture,index)"><img :src="img.commentariesImg"></li>
                </ul> 
              </div>
              <div class="business_reply" v-if="pic.userClassify=='SHOP'">
                <span class="arrow"></span>
                <p class="reply_custom"><span class="color_r">商家回复：</span>{{pic.contentData}}</p>
              </div>
            </div> 
          </div>
          <div class="goodsList">
            <router-link :to="'/goodsDetail/' + item.merchandiseId" tag="dl" class="infoData">
              <dt><img v-lazy="item.specification"/></dt>
              <dd>
                <h3 class="goodsName">{{item.merchandiseName}}</h3>
                <p class="owner">￥{{item.onwerPrice | twoDecimal}}</p>  
              </dd>
            </router-link>
          </div>
        </div>        
      </div>
      <div v-if="infiniteCount >= currentCount" slot="infinite" class="text-center">没有更多数据</div>
    </scroller>
  </div>
  <mt-actionsheet :actions="actions" v-model="sheetVisible"></mt-actionsheet>
  <atlas v-if="isShow" class="pics" :imagesList="imagesList" :index="curIndex" @closeatlas="closeAtlasclick"></atlas>
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
        {name: '全部', type: 'FALSE'},
        {name: '有图', type: 'TRUE'}
      ],
      tabIndex: 0,
      tabType: 'FALSE',
      Coupon: [],
      swiperOption: {
        slidesPerView: 2,
        paginationClickable: true,
        spaceBetween: 0,
        freeMode: true
      },
      allData: {},
      isShow: false,
      currentCount: 0, // 当前数据数
      infiniteCount: 0, // 数据总数
      page: 1, // 页码
      infoData: {},
      actions: [],
      sheetVisible: false
    }
  },
  created () {
    this.getData('FALSE', 0)
    this.getData('TRUE', 1)
  },
  mounted () {
    this.actions = [{
      name: '删除',
      method: this.rovemove
    }]
  },
  methods: {
    getData (type, index) {
      var that = this
      that.tabIndex = 0
      that.$axios.post('/shop/Appraise/query/My', {'picture': type}).then((res) => {
        if (res) {
          that.allData = res
        }
      }).catch(function (msg) {
        if (msg === '该店铺未上架该货品') {
          that.$toast({message: '该店铺未上架该货品', duration: 800})
        }
      })
    },
    deleteInfo (info, index) {
      this.infoData = {
        info: info,
        index: index
      }
      this.sheetVisible = true
    },
    rovemove () {
      var that = this
      that.showConfirm('提示', '确定要删除吗？', function () {
        var params = {
          'id': that.infoData.info.id,
          'state': 'DISABLE'
        }
        that.$axios.post('/shop/Appraise/updateMyState', params).then((res) => {
          if (res) {
            that.allData.list.splice(that.infoData.index, 1)
          }
        })
      })
    },
    onRefresh (done) {
      var that = this
      setTimeout(() => {
        that.page = 1
        that.infiniteCount = 0
        that.allData = {}
        that.getData(that.tabType, that.tabIndex)
        done()
      }, 1500)
    },
    onInfinite (done) {
      var that = this
      setTimeout(() => {
        if (that.infiniteCount < that.currentCount) {
          that.page++
          that.infiniteCount++
          that.$axios.post('/shop/Appraise/query/My' + '?p=' + that.page + '&c=10', {'picture': that.tabType}).then((res) => {
            res.list.forEach(function (item) {
              that.allData.list.push(item)
            })
          })
        }
        done()
      }, 1500)
    },
    showImgList (list, index) {
      this.imagesList = list
      this.curIndex = index
      this.isShow = true
    },
    tabClick (type, index) { // tab切换
      this.getData(type, index)
      this.tabIndex = index
      this.tabType = type
    },
    // 关闭图集
    closeAtlasclick () {
      this.isShow = false
    },
    showConfirm (title, cont, callback) {
      this.$messageBox.confirm(cont, title, {closeOnClickModal: false}).then(action => {
        if (action) {
          callback()
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.page-content{
  background: #fff;
  .appraise{
    .appraiseInfo{
      padding: .24rem;
      border-bottom: 1px solid #f0f0f0;
      .time{
        line-height: .5rem;
        font-size: .3rem;
        position: relative;
        span{
          display: block;
          color: #999999;
        }
        .delete{
          position: absolute;
          font-size: .7rem;
          top: -.3rem;
          right: 0;
          padding: .1rem;
        }
      }
      .business_reply{
        position: relative;
        margin-top: .3rem;
        .arrow{
          height: 0;
          width: 0;
          display: inline-block;
          border: .2rem solid transparent;
          border-top-color: transparent;
          border-left-color: transparent;
          border-bottom-color: #fafafa;
          border-right-color: transparent;
          position: absolute;
          top: -.39rem;
          left: .5rem;
        }
        .reply_custom{
          background: #fafafa;
          padding: .2rem;
          border-radius: 8px;
          .color_r{
            color: #89262a;
          }
        }        
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
          position: relative;
          img{
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
  }  
  .goodsList{
    border: 1px solid #f0f0f0;
    border-radius: 5px;
    margin-top: .3rem;
    overflow: hidden;
    .goodsName{
      margin-top: .3rem;
    }
    .owner{
      color: #89262a;
      font-size: .35rem;
      line-height: 1rem;
    }
  }
}

</style>
