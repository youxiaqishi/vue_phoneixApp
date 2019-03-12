<template>
<div class="page">
  <m-header>
    <span slot="left"></span>
    <span slot="title">{{title}}</span>
  </m-header>
  <div class="page-content padding-top hasBg">
    <div class="special">
      <router-link :to="'/specialDetail/' + item.id" tag="dl" v-for="item in data" :key="item.id">
        <dt><!-- <img v-lazy="item.urlImg" /> --><mr-img :url="item.urlImg"></mr-img></dt>
        <dd>
          <h5>{{item.name}}</h5>
          <p>{{item.message}}</p>
        </dd>
      </router-link>          
    </div>
  </div>
</div>
</template>
<script>
import mrImg from '../../service/mrImg.vue'
export default {
  data () {
    return {
      data: {},
      title: this.$route.params.title
    }
  },
  components: {
    mrImg
  },
  activated () {
    this.getData()
  },
  methods: {
    getData () {
      var that = this
      that.$loading.open()
      that.$axios.get('/app/special/make/get/special/make/zt/' + that.$route.params.id).then((res) => { // 专题数据
        if (res) {
          that.data = res
          that.$loading.close()
        }
        that.scroll && that.scroll.forceUpdate(true)
      })
    }
  }
}
</script>
<style lang="less" scoped>
.page-content{
  background: #fafafa;
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

