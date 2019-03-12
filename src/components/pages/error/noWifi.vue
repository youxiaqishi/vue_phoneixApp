<template>
  <div class="no-wifi">网络错误，请重试<router-link :to="'/home/index/shopTemplate/default'" class="button button-red button-small goIndex">返回首页
          </router-link></div>
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