<template>
<div class="page refundSalesPage">
  <m-header>
    <span slot="left"></span>
    <span slot="title">{{title}}</span>
  </m-header>
  <div class="page-content">
    <div class="orderInfo">
      <p>订单编号：<span class="gray">{{data.orderNo}}</span></p>
      <p>订单总额：<span class="red">￥{{data.realPrice | twoDecimal}}</span></p>
    </div>
    <div class="goodsList">
      <dl class="infoData" v-for="(item, index) in data.childOrderDetailDTOS[0].commodityConfirmDTOS" >
        <dt><img v-lazy="item.url"/></dt>
        <dd>
          <h3>{{item.commodityName}}<br /></h3>
          <div class="price">
            <p class="owner" v-if="item.activityInfoDTO.type == 'COMMON'">业主价：<span>￥{{item.privilegePrice | twoDecimal}}</span></p>
            <p class="owner" v-if="item.activityInfoDTO.type == 'SECKILL'">秒杀价：<span>￥{{item.activityInfoDTO.activityPrice | twoDecimal}}</span></p>
            <p class="owner" v-if="item.activityInfoDTO.type == 'FLASH_SALE'">限时价：<span>￥{{item.activityInfoDTO.activityPrice | twoDecimal}}</span></p>
            <p class="owner" v-if="item.activityInfoDTO.type == 'GROUP'">拼团价：<span>￥{{item.activityInfoDTO.activityPrice | twoDecimal}}</span></p>
            <p class="selling">零售价：<span>￥{{item.originPrice | twoDecimal}}</span></p>
          </div>
          <div class="nums">x {{item.count}}</div>
        </dd>
        <button v-if="$route.params.type == 0 && item.commodityRefundStatus == 'NONE'" class="button button-small button-red" v-on:click="singleRefund(index)">申请退款</button>
        <button v-if="$route.params.type == 0 && item.commodityRefundStatus == 'AUDIT'" class="button button-small button-gray">审核中</button>
        <button v-if="$route.params.type == 0 && item.commodityRefundStatus == 'ALREADY'" class="button button-small button-gray">已退款</button>
        <i class="choose" :class="{'icon-checked':!item.choose,'icon-check':item.choose}"  v-on:click="chooseRefund(item)" v-if="title == '申请退货'"></i>
      </dl>
    </div>
    <div class="cause" v-on:click="select()">
      {{refundReason}}
      <p>
        <span v-if="!cause">请选择</span> 
        <span v-if="cause">{{cause}}</span> 
        <i class="icon-arrow-right"></i>
      </p>
    </div>
    <div class="inputDiv">
      <div class="title">
        退款金额
        <span v-if="$route.params.type == 1">您最多可以退款{{data.realPrice | twoDecimal}}元</span>
        <span v-if="$route.params.type == 0">您最多可以退款{{refundMoneyTotalPrice | twoDecimal}}元</span>
      </div>
      <input type='text' v-model="money" maxlength="10" class="moneyStyle" placeholder="金额"></input>
      <div class="mt1">
        物流费用：{{data.freightPrice | twoDecimal}}元
      </div>
    </div>
    <div class="inputDiv" v-if="this.$route.params.type == 1">
      <div class="title">
        上传凭证
      </div>
      <ul class="imgList">
        <img v-lazy="item" v-if="imgList.length > 0" v-for="(item,index) in imgList" v-on:click="deleteImage(item,index)">
          <li class="addImg" v-if="imgList.length < 3" v-on:click="newUploadHeadClick()">
          </li>
      </ul>
    </div>
    <div class="inputDiv">
      <div class="title">
        问题说明<span v-if="200 - describeCont.length >= 0">您最多可填写{{200 - describeCont.length}}字</span>
        <span v-else>您最多可填写0字</span>
      </div>
      <textarea class="textStyle" maxlength="200" placeholder="问题说明" v-model="describeCont"></textarea>
    </div>
    <p class="causeStyle">
      非质量原因退款，需支付一定的物流费用。退款完成时间：3个工作日内，按照原支付方式退回，具体到账时间以各银行到账时间为准
    </p>
    <p class="button button-full-red mt1" v-on:click="submit()">提交申请</p>
  </div>
  <mt-popup v-model="showCause" position="top" class="mint-popup-7">
    <div class="selectCause" v-if='showCause'>
      <div class="cont">
        <h4>选择一个{{refundReason}}</h4>
        <ul>
          <li v-on:click="selectCause('质量问题')">质量问题<i :class="{'icon-check':cause == '质量问题','icon-checked':cause != '质量问题'}"></i></li>
          <li v-on:click="selectCause('不买了')">不买了<i :class="{'icon-check':cause == '不买了','icon-checked':cause != '不买了'}"></i></li>
          <li v-on:click="selectCause('收货信息错误')">收货信息错误<i :class="{'icon-check':cause == '收货信息错误','icon-checked':cause != '收货信息错误'}"></i></li>
          <li v-on:click="selectCause('商家缺货')">商家缺货<i :class="{'icon-check':cause == '商家缺货','icon-checked':cause != '商家缺货'}"></i></li>
          <li v-on:click="selectCause('其他')">其他<i :class="{'icon-check':cause == '其他','icon-checked':cause != '其他'}"></i></li>
        </ul>
        <div class="btns">
          <span v-on:click="cancel()">取消</span> 
          <span v-on:click="confirm()">确定</span>
        </div>
      </div>
    </div>
  </mt-popup> 
</div>
</template>
<script>
import _ from 'lodash'
import store from '../../../store/index'
export default{
  data () {
    return {
      data: {},
      money: '', // 退款金额
      cause: '', // 原因
      submitCause: '', // 原因格式化
      describeCont: '', // 描述
      showCause: false, // 原因显隐
      title: '申请退款', // 定制标题
      refundReason: '退款原因', // 退款/退货原因
      refundMoneyTotalPrice: 0,
      imgList: [],
      chooseMoney: 0,
      isUseFreight: false,
      chooseGoodsId: []
    }
  },
  store,
  activated () {
    this.getData()
  },
  methods: {
    getData () {
      var that = this
      that.data = that.getLocalstorage('orderData')
      if (that.$route.params.type === '0') {
        // that.money = that.realPrice
        that.chooseMoney = that.data.freightPrice
        that.refundMoneyTotalPrice = that.data.freightPrice
        that.data.childOrderDetailDTOS[0].commodityConfirmDTOS.forEach(function (item) {
          if (item.commodityRefundStatus === 'NONE') {
            that.chooseMoney += parseFloat(item.totalPrice)
            that.refundMoneyTotalPrice += parseFloat(item.totalPrice)
            that.chooseGoodsId.push(item.orderCommodityId)
          }
        })
        that.money = that.chooseMoney
      }
      if (that.$route.params.type === '1') {
        that.title = '申请退货'
        that.refundReason = '退货原因'
        that.money = 0
        that.data.childOrderDetailDTOS[0].commodityConfirmDTOS.forEach(function (item) {
          that.$set(item, 'choose', false)
        })
      }
    },
    chooseRefund (info) { // 勾选
      var that = this
      info.choose = !info.choose
      that.chooseMoney = 0.00
      that.data.childOrderDetailDTOS[0].commodityConfirmDTOS.forEach(function (item) {
        if (item.choose) that.chooseMoney += parseFloat(item.totalPrice)
      })
      // 1 一开始未选择质量原因 勾选金额为退款金额
      // 2 一开始勾选质量原因 勾选金额+运费为退款金额
      // 3 取消勾选 金额减除
      if (!info.choose) {
        that.money -= parseFloat(info.totalPrice)
        that.money = that.money.toFixed(2)
        return
      }
      if (that.submitCause !== 'QUALITY') that.money = that.chooseMoney
      if (that.submitCause === 'QUALITY') that.money = that.chooseMoney + parseFloat(that.freightPrice)
      that.money = that.money.toFixed(2)
    },
    singleRefund (index) { // 单个商品申请退款
      this.$router.push({path: '/refundSalesApplySingle2/' + index})
    },
    select () { // 弹出选择原因
      this.showCause = true
    },
    cancel () {  // 取消选择原因
      this.showCause = false
      this.cause = ''
    },
    confirm () { // 确定原因
      this.showCause = false
      if (this.$route.params.type === '1') { // 申请退货是质量原因退还运费
        if (this.submitCause === 'QUALITY' && !this.isUseFreight) {
          this.money = parseFloat(this.chooseMoney) + parseFloat(this.data.freightPrice)
          this.isUseFreight = true
        } else if (this.submitCause !== 'QUALITY') {
          this.money = parseFloat(this.chooseMoney)
          this.isUseFreight = false
        }
        this.money = this.money.toFixed(2)
      }
    },
    selectCause (cont) { // 原因选择
      if (cont) {
        this.cause = cont
        if (cont === '质量问题') {
          this.submitCause = 'QUALITY'
        } else if (cont === '不买了') {
          this.submitCause = 'NOBUY'
        } else if (cont === '收货信息错误') {
          this.submitCause = 'RECEIVEERROR'
        } else if (cont === '商家缺货') {
          this.submitCause = 'STOCKOUT'
        } else if (cont === '其他') {
          this.submitCause = 'OTHER'
        }
      }
    },
    deleteImage (item, index) {
      this.imgList.splice(index, 1)
    },
    newUploadHeadClick: _.debounce(function () {
      var that = this
      if (that.imgList.length >= 3) {
        that.$toast({message: '您只能选择三张图片', duration: 1000})
        return false
      }
      if (that.$store.state.mutations.isApp === 1) {
        that.ActionSheet().then(function (buttonIndex) {
          if (buttonIndex === 2) {
            that.Camera().then(function (imageData) {
              var img = 'data:image/png;base64,' + imageData
              that.dataURItoBlob(img).then(function (base64Data) {
                console.log('base64Data', base64Data)
                that.newUploadHead(base64Data).then(function (params) {
                  that.imgList.push(params)
                })
              })
            }, function (err) {
              console.log(err)
            })
          }
          if (buttonIndex === 1) {
            that.ImagePicker(3 - that.imgList.length).then(function (imageUrlArray) {
              imageUrlArray.forEach(function (item) {
                setTimeout(function () {
                  var img = new Image()
                  img.src = item
                  img.onload = function () {
                    var w = Math.min(400, img.width)
                    var h = img.height * (w / img.width)
                    var canvas = document.createElement('canvas')
                    var ctx = canvas.getContext('2d')
                    canvas.width = w
                    canvas.height = h
                    ctx.drawImage(img, 0, 0, w, h)
                    var dataURL = canvas.toDataURL('image/png')
                    that.dataURItoBlob(dataURL).then(function (base64Data) {
                      that.newUploadHead(base64Data).then(function (params) {
                        that.imgList.push(params)
                      })
                    })
                  }
                }, 100)
              })
            }, function (err) {
              console.log(err)
            })
          }
        }, function (err) {
          console.log(err)
        })
      } else if (that.$store.state.mutations.isApp === 3) {
        window.selectPhotoCallback = function (imageData) {
          var img = 'data:image/png;base64,' + imageData
          that.URItoBlob(img).then(function (base64Data) {
            console.log('base64Data', base64Data)
            that.newUploadHead(base64Data).then(function (params) {
              that.imgList.push(params)
            })
          })
        }
        window.app.selectPhotoWithScaleKBCallBack(30, window.selectPhotoCallback, 'selectPhotoCallback')
      }
    }, 1000, {
      'leading': true,
      'trailing': false
    }),
    newUploadHead (info) {
      var that = this
      return new Promise((resolve, reject) => {
        var formData = new FormData()
        formData.append('name', new Date().getTime())
        formData.append('file', info)
        var config = {
          headers: {'content-type': 'multipart/form-data'}
        }
        setTimeout(function () {
          that.$axios.post('http://125.94.39.195:8063/storage/upload', formData, config).then((res) => {
            // window.alert(res)
            resolve(res)
          })
        }, 300)
      })
    },
    dataURItoBlob (dataURI) {
      return new Promise((resolve, reject) => {
        setTimeout(function () {
          var byteString = atob(dataURI.split(',')[1])
          var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
          var ab = new ArrayBuffer(byteString.length)
          var ia = new Uint8Array(ab)
          for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i)
          }
          resolve(new Blob([ab], {type: mimeString}))
        }, 200)
      })
    },
    submit: _.debounce(function () {
      var that = this
      if (that.$route.params.type === '0') { // 退款
        var params = {
          'orderId': that.data.id,
          'refundReason': that.submitCause, // 原因
          'refundPrice': that.money, // 退款金额
          'message': that.describeCont, // 信息
          'goodsId': that.chooseGoodsId
        }
        if (!that.submitCause) {
          that.$toast({message: '请选择退款原因', duration: 1000})
          return
        }
        if (!that.money) {
          that.$toast({message: '请输入退款金额', duration: 1000})
          return false
        }
        var reg = /^\d+(\.{0,1}\d+){0,1}$/
        if (!reg.test(that.money)) {
          that.$toast({message: '请输入正确金额', duration: 1000})
          return false
        }
        if (that.money > that.refundMoneyTotal) {
          that.$toast({message: '您最多退款' + that.refundMoneyTotal + '元', duration: 1000})
          return false
        }
        that.$loading.open()
        that.$axios.post('/order/app/refundMoney', params).then((res) => {
          if (res) {
            that.$loading.close()
            window.history.go(-1)
          }
        })
      } else { // 退货
        var goodsList = []
        that.data.childOrderDetailDTOS[0].commodityConfirmDTOS.forEach(function (item) {
          if (item.choose === true) {
            goodsList.push(item.orderCommodityId)
          }
        })
        if (goodsList.length === 0) {
          that.$toast({message: '请选择退货商品', duration: 1000})
          return
        }
        if (!that.submitCause) {
          that.$toast({message: '请选择退款原因', duration: 1000})
          return
        }
        if (!that.money) {
          that.$toast({message: '请输入退款金额', duration: 1000})
          return false
        }
        var reg1 = /^\d+(\.{0,1}\d+){0,1}$/
        if (!reg1.test(that.money)) {
          that.$toast({message: '请输入正确金额', duration: 1000})
          return false
        }
        var params1 = {
          'orderId': that.id,
          'goodsId': goodsList,
          'refundReason': that.submitCause, // 原因
          'refundPrice': that.money, // 退货金额
          'type': 'REFUNDGOOD',
          'message': that.describeCont, // 信息
          'imgUrls': that.imgList
        }
        that.$loading.open()
        that.$axios.post('/order/app/refundGood', params1).then((res) => {
          that.$loading.close()
          window.history.go(-1)
        })
      }
    }, 1000, {
      'leading': true,
      'trailing': false
    })
  }
}
</script>
<style lang="less" scoped>
@import "../../../../static/css/mine.less";
.infoData{
  .button{
    margin-right: .3rem;
  }
}
</style>
