<template>
  <div class="page couponCont">
    <m-header>
      <span slot="left"></span>
      <span slot="title">满减</span>
    </m-header>
    <div class="page-content bg">
      <div class="otherStyle" v-if="allData">
        <div class="goodsList">
          <dl v-for="item in allData" class="goods">
            <router-link :to="'/goodsDetail/' + item.id">
            <dt><img v-bind:src="item.url[0].url"/></dt>
            <dd>
              <h3 class="goodsName">{{item.name}}</h3>
              <p class="owner">业主价 <span>￥{{item.onwerPrice | twoDecimal}}</span></p>
              <p class="selling">优选价 ￥{{item.originalPrice | twoDecimal}}</p>
            </dd>
            </router-link>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      allData: []
    }
  },
  mounted () {
  },
  destroyed () {
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      var that = this
      var params = {
        'appSkuInfoListDTOList': that.getLocalstorage('fullCut')
      }
      that.$axios.post('/app/shop/get/app/sku/info/ids/noexc', params).then((res) => {
        if (res) that.allData = res
      })
    }
  }
}
</script>
<style lang="less" scoped>
.bg{
  background: #fff!important;
  padding: 0 .24rem;
  .otherStyle{
    padding-top: 0.3rem;
    overflow: hidden;
  }
}
</style>


