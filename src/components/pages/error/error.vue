<template>
  <div class="page">
    <m-header>
      <span slot="left"></span>
      <span slot="title">意外错误</span>
    </m-header>
    <div class="no-page">页面加载出错
      <router-link :to="'/home/index/shopTemplate/default'" class="button button-red button-small goIndex">返回首页</router-link>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
    }
  },
  components: {
  },
  created () {
  },
  mounted: function () {
  },
  methods: {
  }
}
</script>
<style lang="less" scoped>
  .goIndex{
    float: none;
    display: inline-block;
    margin: .3rem 0;
  }
</style>