<template>
  <div class="page has-navbar" v-nav="{title: '积分详情', showBackButton: true,showMenuButton:true,menuButtonText:'积分规则',onMenuButtonClick:pointsDetail}">
    <div class="page-content">
      <div class="jifen">
        <div class="jifendetail" v-for="(item,index) in data.list">
          <div>{{item.name}}</div>
          <div v-if="item.type == '正'"><span>+</span>{{item.grade}}</div>
          <div v-if="item.type == '负'"><span>-</span>{{item.grade}}</div>
        </div>
      </div>
      <div class="nojifen" v-if="data.list.length == 0">
            <img alt="">
            <p>暂无积分，您可通过消费累计积分<br>详情请点击“<a>积分规则</a>”</p>
        </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      data: {
      }
    }
  },
  created () {
    var that = this
    that.$axios.get('/mine/integralDetail').then((res) => {
    })
  },
  methods: {
  }
}
</script>
<style lang="less" scoped>
.page-content{
  background: #FAFAF9;
    padding: 0px;
    margin: 0px auto;
    font-size: 0.26rem;
    .jifen{
      .jifendetail{
        width: 100%;
        text-align: center;
        font-size: 0.3rem;
        background-color: white;
        margin-top: .1rem;
      }
    }
    .nojifen {
      width: 100%;
      text-align: center;
      margin-top: 1.7rem;
      img{
        width: 3.1rem;
        height: 3.52rem;
        margin: 0 auto;
        background-color: gray;
      }
      p {
        font-size: 0.3rem;
        color: #323333;
        a {
          text-decoration: underline;
          color: #666;
      }
    }
  }
    p{
    padding: 0px;
    margin: 0px;
  }
  h3{
    color: inherit;
      font-weight: 400;
  }
  div{
    margin: 0;
      padding: 0;
      border: 0;
      vertical-align: baseline;
      line-height: inherit;
      color: inherit;
      font-weight: 400;
  }
}
</style>


