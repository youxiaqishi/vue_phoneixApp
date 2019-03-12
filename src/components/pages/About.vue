<template>
<div class="page">
  <m-header>
    <span slot="left"></span>
    <span slot="title">站内信</span>
  </m-header>
  <div class="page-content">
    <swiper-scroller ref="scroll"
    :pullDownRefresh="true" @pullingDown="pullingDown"
    :pullUpLoad="true" @pullingUp="pullingUp">
      <div class="ordernotice">
        <mt-cell-swipe v-for="(item,index) in messageList" :key="index" class="savedataBox" 
          :right="[{
            content: '删除',
            style: { background: 'red', color: '#fff'},
            handler: () => deleteItem(index,item,messageList)
          }]">
<!--           <router-link :to="'/goodsDetail/' + item.id" class="needsclick services">
            <p>{{item.content}}</p>
          </router-link>  -->  
          <dl class="needsclick" v-on:click="gotoRead(item)">
            <dt v-if="item.messageType=='ORDER'">
              <i class="icon-remind">【订单】</i>
              <span class="time">{{item.createTime}}</span>
            </dt>
            <dt v-if="item.messageType=='DISCOUNTS'">
              <i class="icon-remind">【优惠券】</i>
              <span class="time">{{item.createTime}}</span>
            </dt>
            <dd>
              <p>{{item.content}}</p>
              <div class="open_order" v-if="item.messageType=='ORDER'">查看订单
                <i class="icon-arrow-right" data-pack="ios" data-tags="chevron"></i>
              </div>
              <div class="open_order" v-if="item.messageType=='DISCOUNTS'">查看优惠券
                <i class="icon-arrow-right"></i>
              </div>
            </dd>
          </dl>
        </mt-cell-swipe>
      </div>
    </swiper-scroller>
  </div>
</div>
</template>
<script>
export default {
  data () {
    return {
      messageList: [],
      page: 1,
      allListLength: 1000
    }
  },
  computed: {
    curDataLength () {
      return this.messageList.length
    },
    scroll () {
      return this.$refs.scroll
    }
  },
  activated () {
    this.getData(1)
  },
  methods: {
    getData (page, callback) { // 消息列表
      var that = this // 查询收藏
      var countPar = {
        'shopId': that.getLocalstorage('shopId')
      }
      if (this.curDataLength < this.allListLength) {
        that.$axios.post(`/msg/query?p=${page}&c=10`, countPar).then((res) => {
          if (page === 1) that.messageList = []
          if (res) {
            if (res.list.length > 0) {
              that.page = page
              that.allListLength = res.count
              that.messageList.push(...res.list)
              if (res.count > that.messageList.length) {
                that.scroll.forceUpdate(true) // 有数据（下方出现loading）
              } else {
                that.scroll.forceUpdate(false) // 无数据 （出现 没有更多数据）
              }
            } else {
              that.scroll.forceUpdate(false) // 无数据 （出现 没有更多数据）
            }
          }
        })
      }
      setTimeout(() => {
        if (callback) {
          callback()
        }
      }, 500)
    },
    pullingDown () { // 下拉刷新
      this.getData(1, () => {
        this.scroll.pulldownLoadEnd()
      })
    },
    pullingUp () {
      this.getData(this.page + 1, () => {
        if (this.scroll) {
          this.scroll.pullUpLoadEnd()
        }
      })
    },
    gotoRead (item) { // 状态修改
      var that = this
      var params = {
        'initMessageStatus': 'UNREAD',
        'resultMessageStatus': 'READ',
        'messageId': item.id,
        'shopId': that.getLocalstorage('shopId')
      }
      that.$axios.post('/msg/update', params).then((res) => { // 进订单详情or优惠券
      })
      if (item.messageType === 'DISCOUNTS') that.$router.push({ path: '/coupon' })
      if (item.messageType === 'ORDER') that.$router.push({ path: '/orderDetails/0' + '/' + item.messageId + '/CHILD' })
    },
    deleteItem (index, info, data) { // 删除
      var that = this
      var params = {
        'messageId': info.id,
        'shopId': that.getLocalstorage('shopId')
      }
      that.$axios.post('/msg/del', params).then((res) => {
        data.splice(index, 1) // 截取
      })
    }
  }
}
</script>
<style lang="less" scoped>
.page{
  background: #f2f2f2;
}
.tabs-striped .tab-item{
  font-size: .3rem!important;
}
.marginCont{
  margin-top: 10px;
}
.ordernotice{
  background: #f2f2f2;
  dt{
    line-height: .8rem;
    font-size: .3rem;
    overflow: hidden;
    i{
      float: left;
      padding-left: .3rem;
    }
    span{
      display: block;
      float: right;
      color: #666;
    }
  }
  dl{
    width: 100%;
    background: #fff;
    margin: .1rem 0;
    line-height: .4rem;
    padding: 0 .2rem;
  }
}
.mint-cell{
  margin-bottom: .2rem;
}

.open_order{
  font-size: .26rem;
  margin-top: .3rem;
  border-top: 1px solid #F7F7F7;
  padding: .5em 0;
  color: #999;
  i{
    float: right;
    width: .3rem;
    height: .4rem;
  }
} 
</style>