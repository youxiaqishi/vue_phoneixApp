<template>
<div class="modalDiv" v-if="isShow">
  <h1>邀请好友</h1>
  <div class="row">
    <div class="col col-20">
        <a class="item shareIcon1" v-on:click="gotoShare(1)"/>
    </div>
    <div class="col col-20">
        <a class="item shareIcon2" v-on:click="gotoShare(2)"/>
    </div>
    <div class="col col-20">
        <a class="item shareIcon3" v-on:click="gotoShare(3)"/>
    </div>
    <div class="col col-20">
        <a class="item shareIcon4" v-on:click="gotoShare(4)"/>
    </div>
  </div>
  <div class="row">
    <button class="" v-on:click="hide()">取消
    </button>
  </div>
</div>
</template>
<script>
export default {
  data () {
    return {
      isShow: true
    }
  },
  methods: {
    hide () {
      this.isShow = false
    },
    gotoShare (index) {
      // 已弃用
    }
  }
}
</script>
<style lang="less" scoped >

.modalDiv{
  z-index: 999;
    height: 4rem;
    position:absolute;
  width:100%;
    background: #fff;
    border-radius: .1rem;
    bottom: 0;
    box-shadow: 0 5px 18px #777;

  h1{
    height: 1rem;
    line-height: 1rem;
    text-align: center;
    color: #333;
    font-size: .34rem;
    background: #fff;
    margin-bottom: 0;
  }
  .row {
    margin-top: .3rem;
    margin-left: .3rem;
    padding: 0;
    height: 1rem;
    button{
      width: 90%;
      height: 1rem;
      color: black;
      background: orange;
      opacity: 1!important;
      border-radius: 5px;
       font-size: .4rem;
    }
  }
  .item{
    display: inline-block;
    width: 1rem;
    height: 1rem;
    position: absolute;
    border:none;
  }
  .text{
    padding-left: .7rem;
    display: inline-block;
    margin-top: .05rem;
  }
  .close{
    width: .43rem;
    height: .43rem;
    /*background: url(../images/close.png) no-repeat;*/
    background-size:80%;
    position: absolute;
    top: .3rem;
    right: .3rem;
  }
}

/*.modal{
  background-color: rgba(0,0,0,0.5);
  .bar-header{
    height: 100%;
    background: none;
    h1{
      display: none;
    }
    .button-icon{
      z-index: 10;
      left: 45%;
      top:80%!important;
        height: .8rem;
        width: .8rem;
        border: 1.5px solid #fff;
        border-radius: 100%;
        padding:0;
    }
    .button-icon:before,.button-icon:after{
      font-size: 1.2rem;
      line-height: .7rem;
      color: #fff;
      left: 0!important;
    }
  }
} */
  /*.page-content{
    background: none!important;
    width: 5.5rem;
    height: 6.86rem;
    margin: 1rem auto 0  auto;
    border-radius: 5px;
    .servicePage{
      background: #fff;
      height: 100%;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
      h3{
        height: 1.2rem;
        line-height: 1.2rem;
        text-align: center;
        color: #fff;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        margin:0;
      }
      .serviceIcon,.serviceIcon1{
        margin:0 .24rem;
        height: 1.59rem;
        line-height: .45rem;
        padding-top: .3rem;
        padding-left: 1rem;
      }
      .serviceIcon1{
        font-size: .28rem;
        color: #929999;
        border-bottom: 1px solid #eee;
        a{
          font-size: .36rem;
          color: #333;
        }
      }
      .serviceIcon{
          line-height: 1rem;
          font-size: .36rem;      
      }
    }
  }*/
</style>
