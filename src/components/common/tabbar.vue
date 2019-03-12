<template>
  <div class="footTab tabs">
    <div v-for="(tabItem, index) in tabItems" 
    @click="tabClicked(tabItem,index)" 
    class="footTab-item" 
    :class="{'active': activeIndex == index}">
    <i :class=tabItem.iconOff ></i>
    <span>{{tabItem.text}}</span>
    </div>
    <i class="badge" v-if="badge > 0 && badge < 100">{{badge}}</i>
    <i class="badge" v-if="badge > 99">99</i>
  </div>
</template>
<script>
  import store from '../../store/index.js'
  // badge
  export default {
    store,
    data () {
      return {
        tabItems: [
          {
            iconOn: 'icon-home-on',
            iconOff: 'icon-home',
            text: '首页',
            name: 'index',
            path: '/home/index/shopTemplate/general'
          },
          {
            iconOn: 'icon-subject-on',
            iconOff: 'icon-subject',
            text: '专题',
            name: 'special',
            path: '/home/special'
          },
          {
            iconOn: 'icon-shopCart-on',
            iconOff: 'icon-shopCart',
            text: '购物袋',
            name: 'shopCart',
            path: '/home/shopCart/0'
          },
          {
            iconOn: 'icon-mine-on',
            iconOff: 'icon-mine',
            text: '我的',
            name: 'mine',
            path: '/home/mine'
          }
        ],
        activeIndex: 0,
        badge: 0
      }
    },
    computed: {
      pageNameList () {
        return this.$route.matched.map(route => route.meta)
      }
    },
    created () {
      var that = this
      this.getCount()
      window.eventBus.$on('updateCount', function () {
        setTimeout(function () { that.getCount() }, 0)
      })
    },
    mounted () {
      var that = this
      this.tabItems.forEach(function (info, index) {
        if (info.name === that.pageNameList[1].pageName) {
          that.activeIndex = index
        }
      })
      window.eventBus.$on('updateClick', function () {
        that.activeIndex = 0
        that.$emit('tabChanged', that.tabItems[0].text)
        that.$router.replace(that.tabItems[0].path)
      })
    },
    methods: {
      getCount () { // 购物车角标
        var self = this
        if (self.getLocalstorage('shopId')) { // 是否已选择店铺
          self.$axios.get('/cart/count').then((res) => {
            if (res || res === '0' || res === 0) self.badge = res
          }).catch(function (msg) {
            var params = {
              'shopId': self.getLocalstorage('shopId'),
              'accessToken': JSON.parse(window.localStorage.getItem('Token')).accessToken
            }
            self.$axios.post('/app/userauth/addshopid', params).then((res) => {
            })
          })
        }
      },
      tabClicked (info, index) {
        this.tabItems[this.activeIndex].path = this.$route.path
        this.activeIndex = index
        console.log(info.path)
        this.$router.replace(info.path)
        this.$emit('tabChanged', info.text)
      }
    }
  }
</script>
<style scoped lang="less">
.tabs{
  border-top:1px solid #ddd;
  height: 1rem;
  position: fixed;
  width: 100%;
  bottom: 0;
  left: 0;
  cursor: pointer;
  background: #fff;
  .footTab-item{
    width: 25%;
    float: left;
    text-align: center;
    position: relative;
    span{
      font-size: .24rem!important;
      display: block;
    }
  } 
  i.badge{
    display: block;
    min-width: 0.35rem;
    height: 0.35rem;
    font-size: .2rem;
    background: white;
    color: #89262a;
    position: absolute;
    top: 0;
    right: 32%;
    border-radius: .35rem;
    line-height: .33rem;
    border-style: solid;
    border-width: 1px;
    border-color: #89262a;
    text-align: center;
    .add{
      position: absolute;
      top: -.04rem;
    }
  }
}

</style>