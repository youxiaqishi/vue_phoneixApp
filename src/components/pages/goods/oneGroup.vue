<template>
  <div class="servicePage serviceGroup" v-if="oneGroupData.user && currentTime1">
    <div class="remindText groupTitle">参与{{oneGroupData.user[0].userName}}的拼团</div>
    <div class="oneGroupText">
      仅剩{{oneGroupData.people}}人
      <timer1 :current-time="currentTime1" class="goodsDetailGroupStyle goodsDetailOneGroupStyle" :start-time="oneGroupData.groupStartTime" :end-time="oneGroupData.groupEndTime" v-on:start_callback="timerStart(3)" v-on:end_callback="timerEnd(3)" :tipText="'距离开始时间还剩'" :tipTextEnd="''" :endText="'活动已结束'" :dayTxt="'天'" :hourTxt="':'" :minutesTxt="':'" :secondsTxt="''" :secondsFixed="true"></timer1> 后结束
    </div>
    <div class="oneGroupImg">
      <p class="groupImg" v-for="(item, index) in oneGroupData.user">
        <img v-bind:src="item.url">
      </p>
      <p class="defaultImg" v-for="item in oneGroupData.people">
        <img v-bind:src="oneGroupData.url">
      </p>
    </div>
    <div class="oneGroupButton">
      <button class="button button-red" v-if="oneGroupData.state == 'FALSE' && currentTime1 < oneGroupData.groupEndTime" v-on:click="gotoGroupShopRightNow(oneGroupData)">立即参团</button>
      <button class="button button-gray" v-if="oneGroupData.state == 'TRUE' && currentTime1 < oneGroupData.groupEndTime">已参团</button>
      <button class="button button-gray" v-if="currentTime1 > oneGroupData.groupEndTime"">已参团</button>
    </div>
    <div class="close" v-on:click="close()"></div>
  </div>
</template>
<script>
import timer1 from '../modal/timer.vue'
export default {
  props: [
    'oneGroupData'
  ],
  data () {
    return {
      currentTime1: ''
    }
  },
  components: {
    timer1
  },
  created () {
    // 获取当前时间
    var that = this
    that.$axios.get('/sec/kill/get/now/time').then((res1) => {
      if (res1) that.currentTime1 = new Date(res1.nowTime.replace(/-/g, '/')).getTime()
    })
  },
  methods: {
    timerStart: function (x) {
      console.log(x + '开始了')
    },
    timerEnd: function (x) {
      console.log(x + '结束了')
    },
    gotoGroupShopRightNow () { // 立即参团
      this.$emit('gotoGroupShopRightNow', this.oneGroupData)
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