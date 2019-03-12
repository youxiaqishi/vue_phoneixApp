<template>
  <div>
    <div class="page-content hasTopTabs">
      <mr-better-scroll ref="scroll" :pullDownRefresh="true" @pullingDown="pullingDown" :pullUpLoad="true" @pullingUp="pullingUp">
        <div v-if="commentList && commentList.length > 0">
          <div class="appraise">
            <div class="appraiseInfo" v-for="(item,index) in commentList" >
              <div class="cont">
                <div class="time">{{item.anonymity}}<span>{{item.createTime}}</span>
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
        </div>
        <div v-if="!commentList.length" class="no-news">还没有评价</div>
      </mr-better-scroll>
    </div>
    <mt-popup v-model="isShow" position="bottom" class="mint-popup-4">
      <atlas v-if="isShow" class="pics" :imagesList="imagesList" :index="curIndex" @closeatlas="closeAtlasclick"></atlas> 
    </mt-popup>
    <mt-actionsheet :actions="actions" v-model="sheetVisible"></mt-actionsheet>
    <!-- <atlas v-if="isShow" class="pics" :imagesList="imagesList" :index="curIndex" @closeatlas="closeAtlasclick"></atlas>     -->
  </div>

</template>
<script>
import atlas from '../../modal/atlas.vue'
export default{
  components: {
    atlas
  },
  data () {
    return {
      tabIndex: 0,
      tabType: 'FALSE',
      commentList: [],
      isShow: false,
      allCommentCount: 10000, // 数据总数
      pageNum: 1, // 页码
      infoData: {},
      actions: [],
      sheetVisible: false
    }
  },
  computed: {
    commentCount () {
      return this.commentList.length
    },
    hasData () {
      return this.commentCount < this.allCommentCount
    },
    scroll () {
      return this.$refs.scroll
    }
  },
  activated () {
    this.type = parseInt(this.$route.params.type)
    this.getData(1)
  },
  mounted () {
    this.actions = [{
      name: '删除',
      method: this.rovemove
    }]
  },
  methods: {
    getData (pageNum) {
      var that = this
      var params = {
        'picture': that.type === 0 ? 'FALSE' : 'TRUE'
      }
      that.$loading.open()
      return that.$axios.post('/shop/Appraise/query/My?p=' + pageNum + '&c=10', params).then((res) => {
        if (res && res.list) {
          that.$loading.close()
          if (pageNum === 1) that.commentList = []
          that.commentList = that.commentList.concat(res.list)
          that.pageNum = pageNum
          that.allCommentCount = res.count
        }
        that.scroll && that.scroll.forceUpdate(true)
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
        that.$axios.get('/shop/Appraise/updateMyState/' + that.infoData.info.id).then((res) => {
          if (res) {
            that.commentList.splice(that.infoData.index, 1)
          }
        })
      })
    },
    pullingDown () {
      this.getData(1).then()
    },
    pullingUp () {
      if (this.hasData) this.getData(this.pageNum + 1).then()
      if (!this.hasData) this.scroll.forceUpdate(false)
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
.mint-popup-4{
  height: 100%;
  width: 100%;
}
</style>
