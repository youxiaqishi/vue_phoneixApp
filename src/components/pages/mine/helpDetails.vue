<template>
  <div class='page'>
    <m-header>
      <span slot="left"></span>
      <span slot="title">{{$route.params.name}}</span>
    </m-header>
    <div class='page-content'>
      <div class='helpContent' style='margin-top:0;padding:0.25rem;font-size: .3rem;'>
        <div v-html="helpDetailData.helpContent"></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      helpDetailData: {}
    }
  },
  activated () {
    this.getData()
  },
  methods: {
    getData () {
      var that = this
      that.$axios.get('/app/system/helpcenter/get/helpcenterdetail/' + that.$route.params.id).then((helpDetailRes) => {
        if (helpDetailRes) that.helpDetailData = helpDetailRes
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import "../../../../static/css/mine.less";
</style>