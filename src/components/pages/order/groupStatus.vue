<template>
  <div class="page">
    <m-header>
      <span slot="left"></span>
      <span slot="title">拼团详情</span>
    </m-header>
    <div class="page-content">
      <div class="orderGroupUp">
        <div v-if="orderGroupData.state == 'WAIT'">
          <i class="icon icon-wait">拼团中</i>
          <p>再拼{{orderGroupData.people}}人就可以成团啦~</p>
        </div>

        <div v-if="orderGroupData.state == 'SUCCESS'">
          <i class="icon icon-success">拼团成功</i>
          <p>凤凰优选已受理您的订单，请您耐心等待发货</p>
        </div>
        <div v-if="orderGroupData.state == 'FAIL'">
        <i class="icon icon-fail">拼团失败</i>
        <p>很遗憾，没有拼购{{orderGroupData.people + orderGroupData.regimentUrlDTOList.length}}人<br/>您已支付的金额将原路返回至您的账户中</p>
      </div>
      </div>
      <div class="orderGroupDown">
        <ul class="userList">
          <li class="userInfo" v-for="user in orderGroupData.regimentUrlDTOList">
            <img class="imgUrl" v-lazy="user.url" />
            <span class="bg" v-if="user.userGrade == 'COLONEL'">团长</span>
            <span class="bg" v-if="user.userGrade == 'MEMBER'">团员</span>
          </li>
        </ul>
      </div>
      <router-link :to="'/home/index/shopTemplate/default'" tag="div" class="button button-red button-small goIndex">
        去逛逛
      </router-link>
    </div>
  </div>
</template>
<script>
export default{
  data () {
    return {
      orderGroupData: {}
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      var that = this
      if (that.$route.params.id) {
        that.$axios.get('/spell/group/group/order/' + that.$route.params.id).then((res) => {
          if (res) {
            that.orderGroupData = res
            console.log(that.orderGroupData)
          }
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.orderGroupUp{
  text-align: center;
  .icon{
    display: inline-block;
    padding-left: .4rem;
    font-size: .35rem;
  }
}
.orderGroupDown{
  clear: both;
  .userList{
    text-align: center;
    margin-top: .6rem;
  }
  .userInfo{
    width: 1rem;
    height: 1rem;
    margin-right: .2rem;
    display: inline-block;
    position: relative;
    .imgUrl{
      border-radius: 1rem;
      height: 1rem;
      width: 1rem;
      overflow: hidden;
    }
    .bg{
      background: #89262a;
      color: #fff;
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      text-align: center;
      border-radius: 4rem;
      font-size: .18rem;
    }
  }  
}
.goIndex{
  margin: 1.5rem auto!important;
  float: none!important;
  width: 50%;
  text-align: center;
  height: .65rem;
  line-height: .65rem;
  background: #89262a;
  color: #fff;
}
</style>
