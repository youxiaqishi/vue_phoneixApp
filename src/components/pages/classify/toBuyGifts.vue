<template>
  <div class="page indexPage" >
    <m-header>
      <span slot="left"></span>
      <span slot="title">买赠</span>
    </m-header>
    <div class="page-content">
      <mr-better-scroll ref="scroll"
      :pullDownRefresh="true" @pullingDown="pullingDown"
      :pullUpLoad="true" @pullingUp="pullingUp">
        <div class="cont" v-if="buyGiftsData.id">
            <div class="youLike otherStyle">
              <div class="goodsList">
                <router-link :to="'/goodsDetail/' + item.skuId" tag="dl" :key="item.skuId" v-for="item in buyGiftsData.skuList" class="goods">
                  <dt><img v-bind:src="item.getAppSkuInfoDTO.defaultUrl"/></dt>
                  <dd>
                    <h3 class="goodsName">
                      <i class="activity">买赠</i>
                      {{item.getAppSkuInfoDTO.name}}
                    </h3>
                    <p class="owner">业主价<span>￥{{item.getAppSkuInfoDTO.onwerPrice | twoDecimal}}</span></p>
                    <p class="selling">优选价￥{{item.getAppSkuInfoDTO.originalPrice | twoDecimal}}</p>
                  </dd>
                </router-link>
              </div>
            </div>
        </div>
        <div v-else class="no-news" style="color: gray;">甄选商品中，敬请期待</div>
      </mr-better-scroll>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      buyGiftsData: {} // 买赠数据
    }
  },
  computed: {
    scroll () {
      return this.$refs.scroll
    }
  },
  mounted () {
  },
  created () {
    this.getBuyGiftsData()
  },
  methods: {
    getBuyGiftsData () { // 获取抢购数据
      var that = this
      that.$loading.open()
      that.$axios.get('/buy/present/get/app/list/' + that.getLocalstorage('shopId')).then((res) => {
        if (res) {
          that.buyGiftsData = res
        }
        that.$loading.close()
        that.scroll && that.scroll.forceUpdate(true)
      })
    },
    pullingDown () {
      this.getBuyGiftsData()
    },
    pullingUp () {
      this.scroll.forceUpdate(false)
    }
  }
}
</script>
<style lang="less" scoped>
@import "../../../../static/css/index.less";
.goodsName{
  position: relative;
  .activity{
    font-size: .24rem;
    color: #89262a;
    border: 1px solid #89262a;
    border-radius: 3px;
    padding: 0 .05rem;
    display: inline-block;
    position: relative;
    top: .1rem;
    line-height: .4rem;
  }
}
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
