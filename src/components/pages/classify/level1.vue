<template>
  <div class="page-content hasTopTabs">
    <div class="cont">
      <div class="leftCont scroll1">
        <ul class="leftCont scroll-inner1 " style="transform: translate3d(0px, 0px, 0px)">
          <li v-for="item in leftConts" 
            @click="changeClassify(item)" 
            :class="{'curClass':isCurrent(item)}">
            {{item.label}}
          </li>
        </ul>
      </div>
      <!-- <mr-navigation> -->
      <keep-alive>
        <router-view :key="level2RouterViewKey" v-if="level2RouterViewKey"></router-view>
      </keep-alive>
      <!-- </mr-navigation> -->
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      leftConts: [],
      level2RouterViewKey: ''
    }
  },
  computed: {
  },
  created () {
    this.level1Id = this.$route.params.level1Id
    this.level2RouterViewKey = `classify_${this.level1Id}_${this.$route.params.level2Id}`
    this.getLeftContsData()
  },
  methods: {
    getLeftContsData () {
      this.$axios.get(`/app/shop/getCategoryTreeFinalId/${this.$route.params.level1Id}`).then((res) => {
        if (res) {
          this.leftConts = res
        }
      })
    },
    isCurrent (left) {
      return left.id === parseInt(this.$route.params.level2Id)
    },
    changeClassify (leftCont) {
      this.$emit('changeLevel2', leftCont.id)
      this.$router.replace(`/classify/level1/${this.$route.params.level1Id}/level2/${leftCont.id}`)
      this.level2RouterViewKey = `classify_${this.level1Id}_${leftCont.id}`
    }
  }
}
</script>
<style lang="less" scoped>
@import "../../../../static/css/index.less";
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
    top: 0.1rem;
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
</style>
