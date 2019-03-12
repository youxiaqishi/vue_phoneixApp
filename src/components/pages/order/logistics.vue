<template>
<div class="page">
  <m-header>
    <span slot="left"></span>
    <span slot="title">物流详情</span>
  </m-header>
    <div class="page-content">
      <div class="no-news" v-if="!data || !data.logisricsInfos || data.logisricsInfos.length == 0"><span>暂无物流信息~</span></div>
      <ul class="logTitle" v-if="data && data.logisricsInfos && data.logisricsInfos.length > 0 && $route.params.type == 'SELFSUPPORT'">
        <li v-for="(item,index) in 4" :class="{'curLi':index == tabIndex}">
          <div v-if="index==0">
            <span>已拣货</span><p><i></i></p>
          </div>
          <div v-if="index==1">
            <span>已接单</span><p><i></i></p>
          </div>
          <div v-if="index==2">
            <span>已取货</span><p><i></i></p>
          </div>
          <div v-if="index==3">
            <span>已送达</span><p><i></i></p>
          </div>
        </li>
      </ul>
      <ul class="log" v-if="data && data.logisricsInfos && data.logisricsInfos.length > 0 && $route.params.type == 'SELFSUPPORT'">
        <li v-for="(item,index) in data.logisricsInfos">
          <div class="dateTime">
            <span class="time">{{item.createTime}}</span>
            <!-- <span class="date">{{item.date}}</span> -->
          </div>
          <div class="info">
            <p>{{item.detail}}</p>
            <!-- <p>配送电话：{{item.phone}}</p> -->
          </div>
          <span class="border"></span>
        </li>
      </ul>
      <ul class="log" style="margin-top:0;" v-if="data && data.logisricsInfos && data.logisricsInfos.length > 0 && $route.params.type != 'SELFSUPPORT'">
        <li v-for="(item,index) in data">
          <div class="dateTime">
            <span class="time">{{item.time}}</span>
            <!-- <span class="date">{{item.date}}</span> -->
          </div>
          <div class="info">
            <p>{{item.context}}</p>
            <!-- <p>配送电话：{{item.phone}}</p> -->
          </div>
          <span class="border"></span>
        </li>
      </ul>
    </div>
</div>
</template>
<script>
export default{
  data () {
    return {
      tabs: ['已拣货', '已接单', '已取货', '已送达'],
      tabIndex: 0,
      data: {}
    }
  },
  activated () {
    this.getData()
  },
  methods: {
    getData () {
      var that = this
      if (that.$route.params.type === 'SELFSUPPORT') { // 普通店铺
        that.$axios.get('/order/app/logistic/' + that.$route.params.orderId).then((res) => {
          if (res) {
            that.data = res.logisricsInfo
            if (that.data.logisricsStatus === 'WAITCONTROLLER') { // 物流状态
              that.tabIndex = 0
            } else if (that.data.logisricsStatus === 'WAITFETCH') {
              that.tabIndex = 1
            } else if (that.data.logisricsStatus === 'WAITSEND') {
              that.tabIndex = 2
            } else if (that.data.logisricsStatus === 'ALREADYSEND') {
              that.tabIndex = 3
            }
          }
        })
      } else { // 默认店铺
        that.$axios.get('/order/getLogistics/' + that.$route.params.orderId).then((res) => {
          if (res) {
            that.data = res
            // if (that.data.logisricsStatus === 'WAITCONTROLLER') { // 物流状态
            //  that.tabIndex = 0
            // }else if (that.data.logisricsStatus === 'WAITFETCH') {
            //  that.tabIndex = 1
            // }else if (that.data.logisricsStatus === 'WAITSEND') {
            //  that.tabIndex = 2
            // }else if (that.data.logisricsStatus === 'ALREADYSEND') {
            //  that.tabIndex = 3
            // }
          }
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.logTitle{
  li{
    float: left;
    width: 25%;
    text-align:center;
    position: relative;
    color: #999;
    padding-top: .1rem;
    p{
        border-bottom: 1px solid #ddd;
        position: absolute;
        left: 50%;
        height: 10px;
        width: 100%;
        i{
          height: .15rem;
          width: .15rem;
          border-radius: .15rem;
          background: #ddd;
          display: block;
          position: absolute;
          top: .1rem;
          left: -.1rem;
        }
    }
  }
    li.curLi{
      span{
      background: #89262a;
        color: #fff;
        padding: 0 .2rem;
        border-radius: .4rem;
      }
      i{
        background: #89262a;
        box-shadow: 0 0 5px #89262a;
      }
    }
  li:last-child{
    p{
      border-bottom: none;

    }
  }

}
.log{
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  background: #fff;
  margin:1rem 0;
  li{
    overflow: hidden;
    width: 100%;
    font-size: .26rem;
    padding: .4rem .25rem .1rem .4rem;
    position: relative;
    .dateTime{
      float: left;
      width: 30%;
      padding-top: .1rem;
      span{
        display: block;
        font-size: .2rem;
        color: #999;
        line-height: .3rem;
      }
      .time{
        font-size: .28rem;
        color: #999;
      }
    }
    .info{
      float: left;
      width: 65%;
      color: #999;
    }
    .border{
        border-left: 1px solid #ddd;
        height: .5rem;
        position: absolute;
        left: .8rem;
        top: 1.2rem;
    }
  }
  li:last-child{
    .border{
      border-left: none;
    }
  }
  li:first-child{
    .info{
      color: #333;
    }
    .time{
      color: #333;
    }
  }
}
</style>


