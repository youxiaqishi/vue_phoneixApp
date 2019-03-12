<template>
<div class="page">
  <m-header>
    <span slot="left"></span>
    <span slot="title">添加优惠券</span>
  </m-header>
  <div class="page-content">
    <div class="inputWrap">
      <span class="input-label">已绑手机</span>
      <p class="inputStyle2">{{userInfo.phone}}</p>
    </div>
    <div class="inputWrap">
      <span class="input-label">券码</span>
      <input class="inputStyle2" type="text" v-model="data.number" placeholder="16位字母数字组合"></input>
    </div>
    <div class="ctBottom">
      <p class="button button-full-red" v-on:click="addCoupon()">确定</p>
    </div>
  </div>
</div>
</template>
<script>
export default{
  data () {
    return {
      data: {
        number: ''
      },
      userInfo: {}
    }
  },
  activated () {
    this.getData()
  },
  methods: {
    getData () {
      var that = this
      if (that.getLocalstorage('userInfo')) that.userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
    },
    addCoupon () { // 添加优惠券
      var that = this
      if (!that.data.number) {
        that.$toast({message: '请输入优惠券码', duration: 800})
        return
      }
      that.$axios.get('/app/coupon/get/coupon/' + that.data.number).then((res) => {
        if (res) {
          that.$toast({message: '添加成功', duration: 800})
          setTimeout(function () {
            window.history.go(-1)
          }, 800)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .ctBottom {
      position: fixed;
      bottom: 0.3rem;
      height: 0.98rem;
      width: 100%;
  }
  .inputWrap{
    border-bottom: 1px solid #f1f1f1;
    width: 100%;
    background:#fff;
    overflow: hidden;
      font-size: .28rem;
      height: 1rem;
      line-height: 1rem;
      padding: 0 15px;
    span{
      padding:0 10px 0 0;
      float: left;
      width: 1.6rem;
      text-align: right;
    }
    .inputStyle2{
      height: 1rem;
      width: 5rem;
      float: left;
      padding-top: 0;
      font-size: .32rem;
      color: #666;
      background: none;
    }
    .selecter{
      float: left;
      line-height: 1rem;
      color: #999;
    }
  }
</style>
