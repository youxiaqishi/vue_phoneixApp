<template>
<div class="page">
  <m-header>
    <span slot="left"></span>
    <span slot="title">{{data.name}}</span>
  </m-header>
  <div class="page-content padding-top">
    <div class="specialCont" v-html="data.specialMakeMessage"></div>
    <div class="recommend">
      <h3 class="title">产品推荐</h3>
      <div class="goodsList">
        <router-link :to="'/goodsDetail/' + item.id" tag="dl" class="goods" :key="item.id" v-for="item in data.sku">
          <dt><!-- <img v-lazy="item.imageUrl"/> --><mr-img :url="item.imageUrl"></mr-img></dt>
          <dd>
            <h3 class="goodsName">{{item.name}}</h3>
            <p class="owner" :class="{sellingAdd: appUserType != 'notLogin'}" v-if="appUserType == 'notLogin' || appUserType == 'OWNER' || appUserType == 'STAFF'">业主价  <span>￥{{item.onwerPrice | twoDecimal}}</span></p>
            <p class="selling" :class="{sellingAdd: appUserType != 'notLogin'}" v-if="appUserType == 'notLogin' || appUserType == 'GENERAL'">优选价  ￥{{item.originalPrice | twoDecimal}}</p>
          </dd>
        </router-link>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import mrImg from '../../service/mrImg.vue'
export default {
  data () {
    return {
      appUserType: '', // 用户身份
      data: {}
    }
  },
  mounted () {
  },
  components: {
    mrImg
  },
  destroyed () {
  },
  activated () {
    var that = this
    window.$getLocalstorage('userInfo') ? this.appUserType = window.$getLocalstorage('userInfo').appUserType : this.appUserType = 'notLogin' // 身份标识
    that.$loading.open()
    that.$axios.get('/app/special/make/get/special/make/byid/' + this.$route.params.id).then((res) => {
      if (res) {
        that.data = res
        that.$loading.close()
      }
      that.scroll && that.scroll.forceUpdate(true)
    })
  },
  methods: {
  }
}
</script>
<style lang="less" scoped>
.page-content{
  background: #fafafa;
  .imgList{
    img{
      width: 100%;
      display: block;
    }
  }
}
.specialCont{
  overflow: hidden;
}
.recommend{
  background: #fff;
    margin-top: .3rem;
    overflow: hidden;
    padding: 0 .24rem 0 .24rem;
    .title{
      text-align: center;
      font-size: 0.3rem;
      color: #929999;
      font-weight: normal;
      line-height: 0.9rem;
      height: 0.9rem;
      border-bottom: 1px solid #EFEEEC;
      margin-bottom: .3rem;
    }
}
</style>

