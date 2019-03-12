<template>
  <div class="atlasvie">
    <div class="icon-close closebtn" @click="closeAtlas"></div>
    <div class="imagesSwiper">
      <swiper :options="swiperOption" ref="mySwiper" class="bannerList">
        <swiper-slide v-for="(info,index) in imagesList" :key="index">
            <img v-bind:src="info.commentariesImg"/>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
    </div>
  </div>
</template>
<script>
export default {
  props: [
    'imagesList',
    'index'
  ],
  data () {
    return {
      swiperOption: {
        pagination: '.swiper-pagination',
        paginationClickable: true,
        autoplay: 3000,
        loop: true
      }
    }
  },
  computed: {
    swiper () {
      return this.$refs.mySwiper.swiper
    }
  },
  created () {
    console.log(this.imagesList)
  },
  mounted () {
    this.swiper.slideTo(this.index + 1, 0, false)
  },
  methods: {
    closeAtlas () {
      this.$emit('closeatlas')
    }
  }
}
</script>
<style lang="less" scoped>
.imagesSwiper {
  height: 100%;
  background: #000;
  padding: 15% 0;
  .swiper-container{
    height: 100%;
  }
}
.swiper-slide {
  height: 100%;
  /*img{*/
  display: -webkit-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
  /*}*/
  img{
    height: auto;
    width: 100%;
  }
/*  .table{
    width: 7.5rem;
    height: 100%;
    border: 1px dashed #ccc;
    display: table-cell; //主要是这个属性
    vertical-align: middle;
    text-align: center;
    img{
      display: table-cell;
      vertical-align: middle;
      text-align: center;
    }    
  }*/


}  

.atlasvie{
  position: absolute;
  top:0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.6);
  z-index: 991;
}

.closebtn {
    position: absolute;
    color: #fff;
    right: 0;
    top: 0rem;
    z-index: 999;
    font-size: 1rem;
    width: 1rem;
    height: 1rem;
    text-align: center;
    line-height: 1rem;
}

</style>
