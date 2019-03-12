<template>
  <div class="page couponCont">
    <m-header>
      <span slot="left"></span>
      <span slot="title">溯源</span>
    </m-header>
    <div class="page-content bg">
      <div class="otherStyle">
        <div class="goodsList">
          <video  autoplay="autoplay" width='100%' height="6rem" loop="loop" ref="myVideo" webkit-playsinline="" playsinline="" x5-playsinline="" x-webkit-airplay="allow">
            <source src="http://phoenix-test.oss.cn-south-1.jcloudcs.com/mp4/bb8f1e3df46a48a1ba2f2dffcb2b5269.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
    }
  },
  mounted () {
  },
  destroyed () {
  },
  created () {
  },
  methods: {
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