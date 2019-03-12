<template>
  <div class="page">
    <m-header>
      <span slot="left"></span>
      <span slot="title">填写评价</span>
    </m-header>
    <div class="page-content padding-top">
      <div class="Info_center">
      <dl class="infoData">
        <dt v-if='data.url'><img v-lazy="data.url[0].url"/></dt>
        <dd>
          <h3>{{data.name}}<br /></h3>
          <p class="owner"><span>￥{{price | twoDecimal}}</span> </p>
        </dd>
      </dl>
      </div>
      <div class="grade">
        <!-- <h4>商品评分</h4> -->
        <div class="gradeItem">
          商品评分:     <p> <i v-for="i in [1,2,3,4,5]" class="gradeStar" v-on:click="changeStar(i,1)" :class="{'gradeStar1':i <= desStar}"></i></p>
        </div>
        <!-- <div class="gradeItem">
          卖家服务： <p> <i v-for="i in [1,2,3,4,5]" class="gradeStar" v-on:click="changeStar(i,2)" :class="{'gradeStar1':i <= seller}"></i></p>
        </div>
        <div class="gradeItem">
          物流服务： <p> <i v-for="i in [1,2,3,4,5]" class="gradeStar" v-on:click="changeStar(i,3)" :class="{'gradeStar1':i <= logistics}"></i></p>
        </div> -->
      </div>
      <div class="evaluate">
        <textarea placeholder="请输入评价内容(不超过五十字)" maxLength="50" v-model="evaluate"></textarea>
        <ul class="imgList">
          <img v-lazy="item.img" v-if="imgList.length > 0" v-for="(item,index) in imgList" v-on:click="deleteImage(item,index)">
          <li class="addImg" v-if="imgList.length < 3" v-on:click="newUploadHeadClick()">
          </li>
        </ul>
        <p class="anonymity" v-on:click="changeAnonymity">
          <i :class="{'icon-check':anonymity,'icon-checked':!anonymity}"></i>匿名
        </p>
      </div>
      <p class="button button-full-red" v-on:click="submit()">提交</p>
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
import store from '../../../store/index'
export default{
  store,
  data () {
    return {
      data: {},
      evaluate: '', // 评论
      anonymity: true, // 匿名
      desStar: 0, // 商品分数
      seller: 0, // 服务分数
      logistics: 0, // 物流分数
      price: 0,
      imgList: [],
      imgListLength: 3
    }
  },
  activated () {
    this.getData()
  },
  methods: {
    getData () {
      var that = this
      that.price = this.$route.params.price
      var params = {
        'skuId': this.$route.params.commodityId,
        'shopId': this.$route.params.shopId
      }
      that.$loading.open()
      that.$axios.post('/app/shop/get/app/sku/info/id', params).then((res) => { // 商品详情
        if (res) {
          that.$loading.close()
          that.data = res
        }
      })
    },
    changeAnonymity () { // 匿名
      this.anonymity = !this.anonymity
    },
    changeStar (i, type) { // 分数
      if (type === 1) {
        this.desStar = i
      }
      // else if(type == 2){
      //  this.seller = i
      // }else if(type == 3){
      //  this.logistics = i
      // }
    },
    deleteImage (item, index) {
      this.imgList.splice(index, 1)
    },
    submit: _.debounce(function () { // 提交
      var that = this
      if (!that.desStar) {
        that.$toast({message: '请先打分', duration: 1000})
        return
      }
      if (!that.evaluate) {
        that.$toast({message: '请填写评论内容', duration: 1000})
        return
      }
      var isAnonymity = ''
      if (that.anonymity) isAnonymity = '匿名'
      var params = {
        'orderId': that.$route.params.orderId, // 订单编号
        'merchandiseId': that.$route.params.commodityId, // 货品Id
        'shopId': that.$route.params.shopId, // 商铺Id
        'merchandiseScore': that.desStar, // 商品分数
        // 'logisticsScore': that.logistics,// 物流分数
        // 'serviceScore': that.seller,// 服务分数
        'contentData': that.evaluate, // 评论内容
        'anonymity': isAnonymity, // 匿名
        'imgs': that.imgList // 新增图片
      }
      that.$axios.post('/shop/Appraise/appProduct', params).then((res) => {
        window.history.go(-1)
      })
    }, 1000, {
      'leading': true,
      'trailing': false
    }),
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
                that.newUploadHead(base64Data).then(function (params) {
                  that.imgList.push(params)
                })
              })
            }, function (err) {
              console.log(err)
            })
          };
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
                      console.log('base64Data', base64Data)
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
          that.dataURItoBlob(img).then(function (base64Data) {
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
            var params = {
              img: res
            }
            resolve(params)
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
    }
  }
}
</script>
<style lang="less" scoped>
.page-content{
  background: #fafafa;
  .Info_center{
    overflow: hidden;
    padding:.2rem .2rem;
    .infoData{
      margin-bottom: .2rem;
      h3{
        margin-top: .2rem;
      }
      dd{
        width: 4.8rem;
      }
      .evaluate{
        float: right;
        .textarea{
          resize: none;
        }
      }
      .owner{
        color: #89262a;
        font-size: .32rem;
        margin-top: .3rem;
        width: 30%;
      }
    }
  }
  .grade{
    background: #fff;
    border-bottom: 1px solid #eee;
    margin-bottom: .3rem;
    padding:.3rem .24rem;
    font-size: .3rem;
    color: #333;
    h4{
      height: .9rem;
      line-height: .9rem;
      font-size: .3rem;
    }
    .gradeItem{
      height: .6rem;
      line-height: .6rem;
      margin-left: .3rem;
      p{
        display: inline-block;
        position: absolute;
        margin-left: .5rem;
      }
    }
  } 
  .evaluate{
    background: #fff;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
    padding: 0 .24rem;
    textarea{
      width: 100%;
      height: 2.5rem;
      padding: .24rem 0;
      font-size: .3rem;
      resize: none;
    }
    .anonymity{
      height: 1rem;
      line-height: 1rem;
      border-top: 1px solid #eee;
      i{
        height: .9rem;
        width: .4rem;
        float: left;
        position: relative;
        top:.03rem;
        margin-right: .2rem;
      }
    }
  }
  .imgList{
    overflow: hidden;
    li{
      height: 1.57rem;
      width: 1.57rem;
      float: left;
      margin-bottom: .2rem;
      margin-right: .2rem;
      position: relative;
      input{
        position: absolute;
          width: 100%;
          right: 0;
          top: 0;
          height: 1.57rem;
          opacity: 0;
          margin-bottom: .2rem;
        margin-right: .2rem;
      }
    }
    img{
      height: 1.57rem;
      width: 1.57rem;
      float: left;
      margin-bottom: .2rem;
      margin-right: .2rem;
    }
  }
}
.gray{
  color: #929999;
}
.red{
  color: #89262a;
}
</style>
