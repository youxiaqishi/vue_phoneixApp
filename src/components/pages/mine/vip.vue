<template>
  <div class="page has-navbar" v-nav="{title: '积分', showBackButton: true,showMenuButton:true,menuButtonText:'积分明细',onMenuButtonClick:pointsDetail}">
    <div class="page-content">
      <div class="integral">
        <div class="floor1">
          <h6><span class="memberType">{{data.mylevel}}</span>会员</h6>
          <p>我的积分</p>
          <span class="memberGrade">{{data.grade}}</span>
        </div>
        <div class="floor2">
          <ul>
            <li class="on">普通</li>
            <li>黄金</li>
            <li>白金</li>
            <li>黑金</li>
            <i style="width: 0rem;"></i>
          </ul>
          <p>距离下一等级还差<span class="jfNum">{{data.nextgrade}}</span>积分</p>
        </div>
        <div class="floor3">
          <h3>我的特权</h3>
          <ul>
            <li v-for="(item,index) in data.viplist">
                        <i> <img v-lazy="item.imgsrc" alt=""></i>
                        <span>{{item.name}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      data: {}
    }
  },
  created () {
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
  .integral{
    .floor3{
      border-top: 1px solid #EFEEEC;
        border-bottom: 1px solid #EFEEEC;
        background-color: #fff;
        padding: 0 0.25rem;
        h3{
          font-size: 0.28rem;
          color: #323333;
          font-weight: normal;
          height: 0.9rem;
          line-height: 0.9rem;
          border-bottom: 1px solid #EFEEEC;
        }
        ul{
            padding-top: 0.45rem;
          overflow: hidden;
          margin-left: -0.8rem;
          li{
            float: left;
            width: 1.8rem;
            text-align: center;
            margin-bottom: 0.45rem;
            margin-left: 0.8rem;
          i{
            display: block;
              margin: 0 auto 0.15rem;
              width: 0.66rem;
              height: 0.66rem;
              img{
                max-width: 100%;
                border: 0;
                overflow: hidden;
                vertical-align: top;
                /*background: url(../images/mine/cticon39.png) no-repeat center 100%;*/
              }
          }
          }
        }
    }
    .floor2{
      padding: 0.62rem 0.2rem 0.38rem;
        background-color: #fff;
        border-bottom: 1px solid #EFEEEC;
        margin-bottom: 0.3rem;
        margin: 0px;
      ul{
        overflow: hidden;
          position: relative;
          padding: 0px;
          margin: 0px;
        li{
          float: left;
            padding: 0 0.78rem;
            font-size: 0.28rem;
            color: #323333;
            list-style: none;
            margin: 0px;
            display: list-item;
            text-align: -webkit-match-parent;
        }
        li:first-child {
            padding-left: 0;
        }
        li:nth-child(2):after {
            display: block;
            content: '';
            width: 1px;
            height: 0.1rem;
            background-color: #fff;
            position: absolute;
            top: 0;
            left: 2.42rem;
            z-index: 10;
        }
        li:nth-child(3):after {
            display: block;
            content: '';
            width: 1px;
            height: 0.1rem;
            background-color: #fff;
            position: absolute;
            top: 0;
            left: 4.52rem;
            z-index: 10;
        }
        li:nth-child(4) {
            float: right;
            padding-right: 0;
        }
      }
      ul:before {
          display: block;
          content: '';
          width: 6.7rem;
          margin: 0 auto 0.2rem;
          height: 0.1rem;
          background-color: #EFEEEC;
          -webkit-border-radius: 0.05rem;
          -moz-border-radius: 0.05rem;
          border-radius: 0.05rem;
      }
      p{
        font-size: 0.28rem;
          color: #929999;
          text-align: center;
          margin-top: 0.38rem;
          .jfNum{
            
          }
      }
    }
    .floor1{
        width: 100%;
        height: 2.5rem;
        background-color: gray;
        /*background: url(../images/cticon36.jpg) no-repeat center 100%;*/
        text-align: center;
        h6{
          font-size: 0.32rem;
          color: #fff;
          font-weight: normal;
          padding: 0.35rem 0;
          margin: 0;
          .memberType{
            font-size: 0.32rem;
          }
        }
        p{
          font-size: 0.26rem;
          color: #fff;
          display: block;
          -webkit-margin-before: 1em;
          -webkit-margin-after: 1em;
          -webkit-margin-start: 0px;
          -webkit-margin-end: 0px;
          padding: 0px;
        margin: 0px;
        }
        .memberGrade{
          font-size: 0.8rem;
          color: #fff;
          font-family: -apple-system, BlinkMacSystemFont, "PingFang SC","Helvetica Neue",STHeiti,"Microsoft Yahei",Tahoma,Simsun,sans-serif !important;
          display: block;
          margin-top: .2rem;
        }
    }
  }
}
</style>


