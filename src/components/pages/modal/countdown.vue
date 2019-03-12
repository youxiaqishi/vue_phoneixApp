<template>
  <div class="timer">
    <p class="text">{{activityStatus}}</p>
    <p class="count">{{remainTimesString}}</p>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    //  活动开始时间
    startTime: {
      type: Number
    },
    //  活动结束时间
    endTime: {
      type: Number
    },
    //  当前时间
    currentTime: {
      type: Number
    }
  },
  methods: {
    init () {
      if (this.endTime < this.currentTime) {
        // 结束时间小于当前时间 活动已结束
        this.$emit('end_callback')
      } else if (this.currentTime < this.startTime) {
        // 当前时间小于开始时间 活动尚未开始
        clearInterval(this.intervalHandler)
        this.intervalHandler = setInterval(() => {
          this.remainAllSeconds = Math.floor((new Date(this.startTime).getTime() - new Date().getTime()) / 1000)
        }, 500)
      } else if ((this.endTime > this.startTime) && (this.startTime < this.currentTime)) {
        // 结束时间大于当前并且开始时间小于当前时间，执行活动开始倒计时
        this.$emit('start_callback')
        clearInterval(this.intervalHandler)
        this.intervalHandler = setInterval(() => {
          this.remainAllSeconds = Math.floor((new Date(this.endTime).getTime() - new Date().getTime()) / 1000)
        }, 500)
      }
    }
  },
  data () {
    return {
      remainAllSeconds: 0,
      isStart: true,
      isEnd: true
    }
  },
  created () {
    this.init()
  },
  activated () {
    this.init()
  },
  deactivated () {
    clearInterval(this.intervalHandler)
  },
  destroyed () {
    clearInterval(this.intervalHandler)
  },
  computed: {
    remainSeconds () {
      return ('00' + this.remainAllSeconds % 60).slice(-2)
    },
    remainMinutes () {
      return ('00' + Math.floor(this.remainAllSeconds / 60) % 60).slice(-2)
    },
    remainHours () {
      return ('00' + Math.floor(this.remainAllSeconds / 60 / 60) % 24).slice(-2)
    },
    remainDays () {
      return ('00' + Math.floor(this.remainAllSeconds / 60 / 60 / 24)).slice(-2)
    },
    activityStatus () {
      if (new Date(this.startTime).getTime() > new Date().getTime()) return '距离开始时间还剩'
      else if (new Date(this.endTime).getTime() < new Date().getTime()) return '活动已结束'
      else return '距离结束时间还剩'
    },
    remainTimesString () {
      if (new Date(this.endTime).getTime() < new Date().getTime()) {
        if (this.isEnd) {
          this.$emit('end_callback')
          this.isEnd = false
        }
        return '已结束'
      } else if (new Date(this.startTime).getTime() > new Date().getTime()) {
        if (this.isStart) {
          this.$emit('start_callback')
          this.isStart = false
        }
        return `${this.remainDays}天${this.remainHours}小时${this.remainMinutes}分${this.remainSeconds}秒`
      } else {
        return `${this.remainDays}天${this.remainHours}小时${this.remainMinutes}分${this.remainSeconds}秒`
      }

      // if (new Date(this.endTime).getTime() < new Date().getTime()) return '已结束'
      // else if (new Date(this.startTime).getTime() > new Date().getTime()) return `${this.remainDays}天${this.remainHours}小时${this.remainMinutes}分${this.remainSeconds}秒`
      // else return `${this.remainDays}天${this.remainHours}小时${this.remainMinutes}分${this.remainSeconds}秒`
    }
  }
}
</script>
<style lang="less" scoped>
.timer{
  .text{
    font-size: .3rem;
    border-bottom: 1px solid #ddd;
    height: .8rem;
  }
  .count{
    position: relative;
    top: -.8rem;
    background: #f7f7f7;
    display: inline-block;
    padding: .05rem .3rem;
    font-size: .35rem;
  }  
}

</style>