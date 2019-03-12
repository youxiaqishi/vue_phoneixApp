<template>
  <div id="app" :class="gradeClass">
    <transition :name="'vux-pop-' + (direction === '' ? '' : (direction === 'forward' ? 'in' : 'out'))">
      <mr-navigation>
        <router-view></router-view>
      </mr-navigation>
    </transition>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'app',
  computed: {
    ...mapState('translate', ['direction'])
  },
  created () {
    this.rootRouterView = this.$route.path
    // 判断平台
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      if (window.$getLocalstorage('mobile-iphone10')) {
        this.gradeClass = 'mobile-iphone10'
      } else {
        this.gradeClass = 'mobile-ios'
      }
    } else {
      this.gradeClass = 'mobile-android'
    }
    window.eventBus.$on('iPhoneXClass', () => {
      this.gradeClass = 'mobile-iphone10'
      this.$store.state.mutations.isIPhoneX = 'YES'
      window.localStorage.setItem('mobile-iphone10', JSON.stringify('mobile-iphone10'))
    })
  }
}
</script>

<style scoped lang='less'>
.mobile-ios .vux-pop-in-enter-active,
.mobile-ios .vux-pop-in-leave-active,
.mobile-ios .vux-pop-out-enter-active,
.mobile-ios .vux-pop-out-leave-active,
.vux-pop-in-enter-active,
.vux-pop-in-leave-active,
.vux-pop-out-enter-active,
.vux-pop-out-leave-active,
{
  transition-duration:.2s;
  transition-timing-function:cubic-bezier(.36,.66,.04,1);
  transition-property:opacity,transform;
   opacity: 1;
}

.mobile-iphone10 .vux-pop-in-enter-active,
.mobile-iphone10 .vux-pop-in-leave-active,
.mobile-iphone10 .vux-pop-out-enter-active,
.mobile-iphone10 .vux-pop-out-leave-active,
.vux-pop-in-enter-active,
.vux-pop-in-leave-active,
.vux-pop-out-enter-active,
.vux-pop-out-leave-active,
{
  transition-duration:.2s;
  transition-timing-function:cubic-bezier(.36,.66,.04,1);
  transition-property:opacity,transform;
   opacity: 1;
}

.mobile-android .vux-pop-in-enter-active,
.mobile-android .vux-pop-in-leave-activ,
.mobile-android .vux-pop-out-enter-active,
.mobile-android .vux-pop-out-enter-active{
  transition-duration:.1s;
  transition-timing-function:cubic-bezier(.4,.6,.2,1);
  opacity: 1;
}

.vux-pop-in-enter{-webkit-transform:translate3d(100%,0,0);transform:translate3d(100%,0,0);opacity:1;z-index:2}
.vux-pop-in-enter-active{box-shadow:0 0 10px rgba(0,0,0,.15)}
.vux-pop-in-enter-to{-webkit-transform:translateZ(0);transform:translateZ(0);opacity:1;z-index:2}
.vux-pop-in-leave{-webkit-transform:translateZ(0);transform:translateZ(0);opacity:.8;z-index:1}
.vux-pop-in-leave-to{-webkit-transform:translate3d(-33%,0,0);transform:translate3d(-33%,0,0);opacity:0;z-index:1}
.vux-pop-out-enter{-webkit-transform:translate3d(-33%,0,0);transform:translate3d(-33%,0,0);opacity:.8;z-index:1}
.vux-pop-out-enter-to{-webkit-transform:translateZ(0);transform:translateZ(0);opacity:1;z-index:1}
.vux-pop-out-leave{-webkit-transform:translateZ(0);transform:translateZ(0);opacity:1;z-index:2}
.vux-pop-out-leave-active{box-shadow:0 0 10px rgba(0,0,0,.15)}
.vux-pop-out-leave-to{-webkit-transform:translate3d(100%,0,0);transform:translate3d(100%,0,0);opacity:1;z-index:2}
</style>
<style lang='less'>
  @import "../static/css/main.less";
  @import "../static/css/common.less";
</style>
