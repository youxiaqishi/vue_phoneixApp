<template>
  <div class="servicePage">
    <div class="remindMeTitle"></div>
    <div class="remindText">设置开始提醒</div>
    <div class="remindContent">请留下您的手机号码, 商品开抢前, 我们会第一时间通知您</div>
    <input class="inputStyle" type='tel' v-model="phone" placeholder="请输入手机号码"></input>
    <button class="sure" v-on:click="remindMe()">确定</button>
    <div class="close" v-on:click="close()"></div>
  </div>
</template>
<script>
export default {
  props: [
    'remindData'
  ],
  data () {
    return {
      phone: ''
    }
  },
  created () {
  },
  methods: {
    close () {
      this.$emit('close')
    },
    remindMe () {
      var that = this
      var reg = /(^1[3|4|5|6|7|8|9][0-9]{9}$)/
      if (!that.phone) {
        that.$toast({message: '请输入手机号', duration: 800})
        return
      }
      if (!reg.test(that.phone)) {
        that.$toast({message: '手机号码有误', duration: 800})
        return
      }
      var params = {}
      var url = ''
      if (that.remindData.type === 'seckill') { // 秒杀
        params = {
          'userId': that.getLocalstorage('userInfo').id,
          'timeId': that.remindData.seckillTimeId,
          'skuId': that.remindData.skuId,
          'phone': that.phone
        }
        url = '/sec/kill/add/user/note/remind'
      } else if (that.remindData.type === 'flashSale') { // 限时购
        params = {
          'userId': that.getLocalstorage('userInfo').id,
          'fieldId': that.remindData.fieldId,
          'skuId': that.remindData.skuId,
          'phone': that.phone
        }
        url = '/flash/sale/add/user/note/remind'
      }
      that.$loading.open()
      that.$axios.post(url, params).then((res) => {
        if (res) {
          that.$toast({message: '设置成功', duration: 800})
          if (that.remindData.type === 'seckill') {
            that.remindData.remind = 'yes'
          } else if (that.remindData.type === 'flashSale') {
            that.remindData.remind = 'REMIND_YES'
          }
          that.$emit('close')
          that.$loading.close()
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.servicePage{
  background: #fff!important;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  background: none!important;
  width: 5.6rem;
  height: 5.6rem;
  margin: 0 auto;
  border-radius: 5px;
  z-index: 9999999!important;
  .remindText{
    color: #89262a;
    font-size: .35rem;
    text-align: center;
  }
  .remindContent{
    font-size: .3rem;
    text-align: left;
    color: #333333;
    width: 5rem;
    margin-left: .3rem;
    margin-top: .2rem;
  }
  .inputStyle{
    height: 1rem;
    width: 5rem;
    margin-left: .3rem;
    background: #f0f0f0;
    border-radius: 5px;
    padding-left: .3rem;
    font-size: .3rem;
  }
  .sure{
    width: 100%;
    height: 1rem;
    background: white;
    border-top: 1px solid #f0f0f0;
    font-size: .35rem;
    color: #333333;
  }
}
</style>
