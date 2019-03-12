<template>
  <div class="page">
    <m-header>
      <span slot="left"></span>
      <span slot="title">{{specialData.name}}</span>
    </m-header>
    <div class="page-content">
      <mr-scroll-keeper>
        <scroller>
          <div class="banner">
            <img v-lazy="specialData.url" class="services"/>
          </div>
          <div class="cont" v-if="goodsList.length > 0">
            <div class="youLike otherStyle">
              <div class="goodsList">
                <router-link :to="'/goodsDetail/' + item.id" tag="dl" :key="item.id" v-for="item in goodsList" class="goods">
                  <dt><img v-lazy="item.url[0].url"/></dt>
                  <dd v-if="item.activityInfoDTO && item.activityInfoDTO.type=='SPECIALOFFER'">
                    <h3 class="goodsName">{{item.name}}</h3>
                    <p class="owner">特价<span>￥{{item.activityInfoDTO.activityPrice | twoDecimal}}</span></p>
                  </dd>
                  <dd v-else>
                    <h3 class="goodsName">{{item.name}}</h3>
                    <p class="owner" :class="{sellingAdd: appUserType != 'notLogin'}" v-if="appUserType == 'notLogin' || appUserType == 'OWNER' || appUserType == 'STAFF'">业主价<span>￥{{item.onwerPrice | twoDecimal}}</span></p>
                    <p class="selling" :class="{sellingAdd: appUserType != 'notLogin'}" v-if="appUserType == 'GENERAL'">优选价￥{{item.originalPrice | twoDecimal}}</p>
                  </dd>
                </router-link>
              </div>
            </div>
          </div>
        </scroller>
      </mr-scroll-keeper>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      appUserType: '', // 用户标识
      specialData: {},
      goodsList: []
    }
  },
  mounted () {
  },
  computed: {
  },
  activated () {
    window.$getLocalstorage('userInfo') ? this.appUserType = window.$getLocalstorage('userInfo').appUserType : this.appUserType = 'notLogin' // 身份标识
    this.getData()
  },
  methods: {
    getData () {
      var that = this
      function getGoodsLise () {
        return that.$axios.get('/special/genre/activiy/app/query/id/sku/' + that.$route.params.id)
      }

      function getInfo () {
        return that.$axios.get('/special/genre/activiy/back/query/special/' + that.$route.params.id)
      }
      that.$axios.all([getGoodsLise(), getInfo()])
      .then(that.$axios.spread(function (list, info) {
      // 两个请求现在都执行完成
        that.loading = false
        if (list && info) {
          that.goodsList = list
          that.specialData = info
        }
      })).catch(function (msg) {
        that.$loading.close()
        that.showConfim('该专场未开启', 1)
      })
    },
    showConfim (cont, index) {
      var that = this
      that.$messageBox.confirm(cont, '提示', {closeOnClickModal: false}).then(function () {
        if (index === 1) {
          window.history.go(-1)
        }
      }, function () {
        if (index === 1) {
          window.history.go(-1)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.cont{
  padding: .22rem;
}
.services{
  width: 100%;
}
</style>