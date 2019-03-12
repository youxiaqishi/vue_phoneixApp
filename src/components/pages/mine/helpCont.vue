<template>
  <div class="page">
      <m-header>
        <span slot="left"></span>
        <span slot="title">{{$route.params.name}}</span>
      </m-header>
      <div class="page-content">
        <ul class="helpList">
          <router-link :to="{path:'/helpDetail/'+ helpcont.id + '/' + helpcont.helpName}" v-for="(helpcont, index) in helpContList" tag="li" :key="index" class="help_link">
            {{helpcont.helpName}} <i class="icon-arrow-right"></i>
          </router-link>
        </ul>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      helpContList: []
    }
  },
  activated () {
    this.getData()
  },
  methods: {
    getData () {
      var that = this
      that.$axios.get('/app/system/helpcenter/get/helpcenterdetail/app/' + that.$route.params.id).then((helpContRes) => {
        if (helpContRes) that.helpContList = helpContRes
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import "../../../../static/css/mine.less";
</style>