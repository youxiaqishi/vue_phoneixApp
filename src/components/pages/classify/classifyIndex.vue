<template>
  <div class="page indexPage" >
    <m-header>
      <span slot="left"></span>
      <span slot="title"><p v-click-one="{click:search}" class="inputStyle">搜索商品,自有品牌健康安全</p></span>
    </m-header>
    <div class="topTabs">
      <swiper :options="swiperOption" ref="mySwiper">
        <swiper-slide v-for="(tab,index) in tabs"  :class="{'active':tabIndex==index}" :key="tab.id">
          <div  @click="onTabClick(index)">{{tab.label}}</div>
        </swiper-slide>
      </swiper>      
    </div>
    <!-- <mr-navigation> -->
    <keep-alive v-if="level1RouterViewKey">
      <router-view @changeLevel2="changeLevel2" :key="level1RouterViewKey"></router-view>
    </keep-alive>
    <!-- </mr-navigation> -->
  </div>
</template>
<script>
export default {
  data () {
    return {
      tabs: [],
      tabIndex: 0,
      level1RouterViewKey: '',
      swiperOption: {
        slidesPerView: 5,
        paginationClickable: true,
        spaceBetween: 0,
        freeMode: true
      }
    }
  },
  computed: {
    swiper () {
      return this.$refs.mySwiper.swiper
    }
  },
  mounted () {
    // this.initSwiper()
  },
  created () {
    this.getTabData().then(() => {
      let index = this.getCurrentTabIndex(this.$route.params.level1Id)
      if (index !== -1) {
        this.tabIndex = index
        let tab = this.tabs[this.tabIndex]
        this.level1RouterViewKey = `classify_${tab.id}`
      }
    })
  },
  watch: {
    '$route' (to) {
      let index = this.getCurrentTabIndex(to.params.level1Id)
      if (index !== -1) {
        this.tabIndex = index
      }
    }
  },
  methods: {
    changeLevel2 (level2Id) {
      let index = this.getCurrentTabIndex(this.$route.params.level1Id)
      if (index !== -1) this.tabs[index].level2Id = level2Id
    },
    getCurrentTabIndex (level1Id) {
      if (!level1Id) return 0
      let index = -1
      this.tabs.forEach((tab, i) => {
        if (tab.id === parseInt(level1Id)) {
          index = i
        }
      })
      return index
    },
    getTabData () {
      this.$loading.open()
      return this.$axios.get('/app/shop/getCategoryTree').then((res) => { // 选项卡
        if (res) {
          this.$loading.close()
          this.tabs = [
            { label: '全部', id: 'all' }
          ]
          res.forEach((item) => {
            let tab = { label: item.label, id: item.id, level2Id: 0 }
            if (item.children.length) {
              tab.level2Id = item.children[0].id
              this.tabs.push(tab)
            }
          })
        }
      })
    },
    isCurrent (id) {
      if (this.$route.params.level1Id === parseInt(id)) return true
      if (!this.$route.params.level1Id && id === 'all')  return true
      return false
    },
    search () { // 搜索
      this.$router.push({path: '/search'})
    },
    onTabClick (index) {
      if (index === this.tabIndex) return
      const tab = this.tabs[index]
      if (tab.id === 'all') {
        this.$router.replace('/classify')
      } else {
        this.$router.replace(`/classify/level1/${tab.id}/level2/${tab.level2Id}`)
      }
      this.level1RouterViewKey = `classify_${tab.id}`
    }
  }
}
</script>
<style lang="less" scoped>
@import "../../../../static/css/index.less";
.inputStyle {
  color: #666;
  width: 77%;
  margin-left: 10%;
}
</style>
