<template>
  <div class="bar bar-header">
    <div class="buttons localize">
      <slot name="address"></slot>
    </div>
    <div class="buttons btnLeft" v-on:click="backCallback()">
      <slot name="left"></slot>
    </div>
    <div class="buttons btnLeft" v-on:click="backCallback1()">
      <slot name="left1"></slot>
    </div>
    <h3 class="title">
      <slot name="title"></slot>
    </h3>
    <div class="buttons btnRight">
      <slot name="right"></slot>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: String
  },
  methods: {
    backCallback () {
      window.eventBus.$emit('updateCount') // 更新角标
      if (this.$listeners['back-callback']) {
        this.$emit('back-callback')
      } else {
        this.$router.go(-1)
      }
    },
    backCallback1 () {
      if (this.$listeners['back-callback']) {
        this.$emit('back-callback')
      } else {
        window.eventBus.$emit('updateClick')
        // if (this.getLocalstorage('shopData').admin === 'yes') {
        //   this.$router.push({path: '/home/index/shopTemplate/default'})
        // } else {
        //   this.$router.push({path: '/home/index/shopTemplate/general'})
        // }
      }
    }
  }
}
</script>
<style scoped lang='less'>
.bar-header{
  height: 44px;
  line-height: 44px;
  box-shadow: 0 0 10px rgba(0,0,0,.15);
  z-index: 9;
  /*border-bottom: 1px solid #ddd;*/
  position: relative;
  top:0;
  left: 0;
  width: 7.5rem;
  background: #fff;
  opacity: 1;
  .title{
    margin:0;
    font-size: .35rem;        
  }
}
.buttons{
  width: 44px;
  display: inline-block;
  line-height: 44px;
  position: absolute;
  bottom:0;
  span{
    height: 44px;
    width: 100%;
    font-size: .25rem;   
    display: block;   
    background: none;
    border: none;
    position: relative;
    z-index: 1;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.buttons.localize{
  width: 2rem;
}
.btnLeft{
  left: 0;
}
.btnRight{
  right: 0;
  span{
    text-align: center;
    background-position-y: center!important;
  }
}
.bar .title {
  display: block;
  position: absolute;
  bottom : 0;
  right: 0;
  left: 0;
  z-index: 0;
  overflow: hidden;
  margin: 0 10px;
  min-width: 30px;
  height: 44px;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight:normal;
  line-height: 44px;
}
</style>