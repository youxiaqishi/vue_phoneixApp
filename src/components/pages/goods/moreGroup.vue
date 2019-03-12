<template>
  <div class="servicePage serviceGroup" v-if="currentTime">
    <div class="remindText groupTitle">{{groupShoppingData.count}}人正在开团</div>
    <div class="shoppingChecked" v-if="">
      <div v-for="(item, index) in groupShoppingData.list" class="shopPeople">
        <p class="userImg groupImg"><img v-bind:src="item.user[0].url"></p>
        <p class="userName groupName">{{item.user[0].userName}}<i> 还差{{item.people}}人</i></p>
        <button class="button button-small button-red groupButton" v-if="item.state == 'FALSE' && currentTime < item.groupEndTime"" v-on:click="gotoGroupShopping(item)">去参团</button>
        <button class="button button-small button-gray groupButton" v-if="item.state == 'TRUE' && currentTime < item.groupEndTime">已参团</button>
        <button class="button button-small button-gray groupButton" v-if="currentTime > item.groupEndTime">已结束</button>
      </div>
    </div>
    <div class="close" v-on:click="close()"></div>
  </div>
</template>
<script>
export default {
  props: [
    'groupShoppingData'
  ],
  data () {
    return {
      currentTime: ''
    }
  },
  created () {
    // 获取当前时间
    var that = this
    that.$axios.get('/sec/kill/get/now/time').then((res1) => {
      if (res1) that.currentTime = new Date(res1.nowTime.replace(/-/g, '/')).getTime()
    })
  },
  methods: {
    gotoGroupShopping (item) { // 去参团
      this.$emit('gotoGroupShopping', item)
    },
    close (done) {
      this.$emit('close', done)
    }
  }
}
</script>
<style lang="less" scoped>
@import "../../../../static/css/activity.less";
</style>