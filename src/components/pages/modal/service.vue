<template>
  <!-- <div class="page-content"> -->
    <div class="servicePage">
      <h3 class="chooseService">客服服务</h3>
      <ul class="linkList">
        <a class="serviceIcon1" href="tel:4009310118">
          客服热线<br />
          <a>400-931-0118</a>
        </a>
        <!-- <li class="serviceIcon1">
          碧桂园热线<br />
          <a href="tel:13794619126">13794619126</a>
        </li> -->
        <!-- <li class="serviceIcon" v-on:click="kefu()">
          腾讯客服
        </li> -->
      </ul>

    </div>
  <!-- </div> -->
</template>
<script>
export default {
  data () {
    return {
    }
  },
  created () {
  },
  methods: {
    kefu () {
      var that = this
      that.$axios.get('/back/phone/queryAll').then((res) => {
        if (res) {
          that.QQCustom(res[0].serviceQQ).then(function () {
          })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped >
.modal{
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
} 
.servicePage{
  background: #fff!important;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  background: none!important;
  width: 5.5rem;
  margin: 0 auto;
  border-radius: 5px;
  h3{
    height: 1.2rem;
    line-height: 1.2rem;
    text-align: center;
    font-size: .32rem;
    color: #fff;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    margin:0;
  }
  .serviceIcon,.serviceIcon1{
    height: 1.59rem;
    line-height: .45rem;
    padding-top: .3rem;
    padding-left: 1rem;
    width: 100%;
    display: block;
  }
  .serviceIcon1{
    font-size: .28rem;
    color: #929999;
    /*border-bottom: 1px solid #eee;*/
    a{
      font-size: .36rem;
      color: #333;
    }
  }
  .serviceIcon{
      line-height: 1rem;
      font-size: .36rem;      
  }
  .linkList{
    padding: .24rem;
    background: #fff;
  }
}
</style>
