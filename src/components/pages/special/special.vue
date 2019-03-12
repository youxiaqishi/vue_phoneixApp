<template>
  <div class="page has-navbar has-tabbar">
    <m-header>
      <span slot="title">专题</span>
    </m-header>
    <div class="introduce">
      <swiper :options="swiperOption"  ref="mySwiper">
        <swiper-slide v-for="(item,index) in data" :key="index" >
          <router-link class="itemStyle" tag="div" :to="{name:'specialList',params:{title:item.name,id:item.id}}">
            <!-- <img v-lazy="item.urlImg" /> -->
            <mr-img :url="item.urlImg"> </mr-img>
          </router-link>
        </swiper-slide>
      </swiper>
    </div>
    <div class="page-content hasBg">
      <mr-better-scroll ref="scroll" :pullDownRefresh="true" @pullingDown="pullingDown">
        <div class="special">
          <router-link :to="'/specialDetail/' + item.id" tag="dl" v-for="item in specialData" :key="item.id" v-if="item.status=='ENABLE'">
            <dt><img v-lazy="item.urlImg" /></dt>
            <dd>
              <h5>{{item.name}}</h5>
              <p>{{item.message}}</p>
            </dd>
          </router-link>          
        </div>        
      </mr-better-scroll>
    </div>
  </div>
</template>
<script>
import mrImg from '../../service/mrImg.vue'
import store from '../../../store/index.js'
export default {
  data () {
    return {
      data: {},
      specialData: [],
      swiperOption: {
        slidesPerView: 2.3,
        paginationClickable: true,
        spaceBetween: 0,
        freeMode: true
      }
    }
  },
  store,
  mounted () {
  },
  computed: {
    scroll () {
      return this.$refs.scroll
    }
  },
  components: {
    mrImg
  },
  destroyed () {
  },
  activated () {
    this.scroll && this.scroll.forceUpdate(true)
    if (this.$store.state.mutations.specialPage.data && this.$store.state.mutations.specialPage.data.length > 1) {
      this.data = this.$store.state.mutations.specialPage.data
      this.specialData = this.$store.state.mutations.specialPage.specialData
    } else {
      this.getData()
    }
  },
  methods: {
    getData () {
      var that = this
      that.$loading.open()
      that.$axios.post('/app/special/genre/get/list?p=1&c=500', {name: ''}).then((res) => {
        if (res) {
          that.data = res.list
          that.$store.state.mutations.specialPage.data = res.list
          that.$loading.close()
        }
        that.scroll && that.scroll.forceUpdate(true)
      })
      that.$axios.post('/app/special/make/get/list?p=1&c=500', {type: 'ZT'}).then((res) => {
        if (res) {
          that.specialData = res.list
          that.$store.state.mutations.specialPage.specialData = res.list
          that.$loading.close()
        }
        that.scroll && that.scroll.forceUpdate(true)
      })
    },
    pullingDown () { // 下拉刷新
      this.getData()
    }
  }
}
</script>
<style lang="less" scoped>
.introduce{ 
  position: absolute;
  z-index: 9;
  width: 100%;
  height: 2.1rem;
  padding: .2rem 0 .1rem 0;
  /*margin: 0 .24rem;*/
  .swiper-slide{
    overflow: hidden;
    border-radius: 5px;
    height: 2rem;
    .itemStyle{
      width: 2.7rem;
      min-width: 2.7rem;  
      margin-right: .4rem; 
      height: 1.6rem;     
      display: block;
      border-radius: 5px;
      box-shadow:0px 3px 9px #a1a0a0;
      overflow: hidden;
      margin: 0 auto;
    }
    img{
      width: 100%;
      height: 100%;
    }
  }
}
.page-content{
  margin-top: 2.1rem;
  background: #fafafa;
  ._v-container{
    padding-top: .3rem;
  }
  .special{
    background: #fafafa;
  }
}
.special{
  background: none;
  padding:0;
  margin:0;
  dl{
    background: #fff;
    margin-bottom: .3rem;
  }
}
</style>

