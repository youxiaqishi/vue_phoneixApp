<template>
<div class="page addressPage">
  <m-header>
    <span slot="left"></span>
    <span slot="title">收货地址管理</span>
  </m-header>
  <div class="page-content">
    <div class="addressList" >
      <div v-if="data.list && data.list.length < 1" class="no-news">还没有收货地址</div>
      <!--默认地址置顶-->
      <div class="adress-items" v-if="defaultAddress && defaultAddress.id">
        <div class="adress-cont" v-on:click="curIndex(defaultAddress)" v-if="defaultAddress.usable">
          <h3>{{defaultAddress.name}}<span class="adress-userTel">{{defaultAddress.phone}}</span></h3>
          <p class="adress-detail">{{defaultAddress.province}}  {{defaultAddress.city}}  {{defaultAddress.county}}  {{defaultAddress.residence}}
            <span class="smallarea">{{defaultAddress.address}}</span>
          </p>
        </div>
        <div class="adress-cont disabled" v-if="!defaultAddress.usable" v-on:click="showToast()">
          <h3>{{defaultAddress.name}}<span class="adress-userTel">{{defaultAddress.phone}}</span></h3>
          <p class="adress-detail">{{defaultAddress.province}}  {{defaultAddress.city}}  {{defaultAddress.county}}  {{defaultAddress.residence}}
            <span class="smallarea">{{defaultAddress.address}}</span>
          </p>
        </div>
        <div class="adress-edit">
          <div class="isdefault">
            <p v-on:click="changeDefault(defaultAddress)"><i class="icon-check" :class="{'icon-checked':!(defaultAddress.isDefault==1)}"></i>默认地址</p>
          </div>
          <div class="adress-edit-btn">
            <router-link :to="'/addAddress/' + defaultAddress.id" class="btn-edit">编辑</router-link>
            <span class="btn-del" v-on:click="deleteAddress(defaultAddress,index)">删除</span>
          </div>
        </div>
      </div>
      <!--普通地址--> 
      <div class="adress-items" v-for="(item,index) in data.list" v-if="item.isDefault != 1">
        <div class="adress-cont" v-on:click="curIndex(item)" v-if="item.usable">
          <h3>{{item.name}}<span class="adress-userTel">{{item.phone}}</span></h3>
          <p class="adress-detail">{{item.province}}  {{item.city}}  {{item.county}}  {{item.residence}}
            <span class="smallarea">{{item.address}}</span>
          </p>
        </div>
        <div class="adress-cont disabled" v-if="!item.usable" v-on:click="showToast()">
          <h3>{{item.name}}<span class="adress-userTel">{{item.phone}}</span></h3>
          <p class="adress-detail">{{item.province}}  {{item.city}}  {{item.county}}  {{item.residence}}
            <span class="smallarea">{{item.address}}</span>
          </p>
        </div>
        <div class="adress-edit">
          <div class="isdefault">
            <p v-on:click="changeDefault(item)"><i class="icon-check" :class="{'icon-checked':!(item.isDefault==1)}"></i>默认地址</p>
          </div>
          <div class="adress-edit-btn">
            <router-link :to="'/addAddress/' + item.id" class="btn-edit">编辑</router-link>
            <span class="btn-del" v-on:click="deleteAddress(item,index)">删除</span>
          </div>
        </div>
      </div>
      <div class="btnList fixed">
        <p class="button button-full-red" v-on:click="add()">新增</p>
      </div>
    </div>
  </div>
  <!-- <p class="button button-full-red mt30 fixed" v-on:click="toUse()">使用</p> -->
</div>
</template>
<script>
import _ from 'lodash'
export default {
  data () {
    return {
      data: {list: []},
      curAddressId: '',
      testData: {}
    }
  },
  mounted () {
  },
  destroyed () {
  },
  activated () {
    this.getData()
  },
  computed: {
    defaultAddress () {
      if (this.data.list && this.data.list.length > 0) {
        return _.find(this.data.list, function (info) {
          return info.isDefault === 1
        })
      }
    }
  },
  created () {
  },
  methods: {
    showToast () {
      this.$toast({message: '当前地址不在配送范围内', duration: 1000})
    },
    getData (page) {
      var that = this
      var params = {
        'p': page,
        'c': 100
      }
      that.data.list = []
      that.$axios.post('/address/query/address/list/shop', params).then((res) => {
        if (res) {
          res.list.forEach(function (item) {
            that.data.list.push(item)
            if (item.isDefault === 1) {
              window.eventBus.$emit('address', item)
            }
          })
          that.currentCount = parseInt((res.count - 1) * 0.1)
        }
      })
    },
    add () {
      this.$router.push({'path': '/addAddress/no'})
    },
    curIndex (info) {
      this.curAddressId = info.id
      this.testData = info
      this.toUse()
    },
    toUse: _.debounce(function () {
      if (!this.testData.id) {
        this.$toast({message: '请先选择收货地址', duration: 1000})
        return
      }
      window.eventBus.$emit('address', this.testData)
      window.history.go(-1)
    }, 500, {
      'leading': true,
      'trailing': false
    }),
    deleteAddress (item, index) { // 删除地址
      var that = this
      that.$axios.get('/address/delete/id/' + item.id).then((res) => { // 删除地址
        if (res) that.data.list.splice(index, 1)
      })
    },
    changeDefault (info) { // 更改默认收货地址
      var that = this
      window.eventBus.$emit('address', info)
      that.$axios.post('/address/set/default', {'id': info.id}).then((res) => {
        info.isDefault = info.isDefault ? 0 : 1
        if (info.isDefault) {
          that.data.list.forEach(function (item) {
            if (item.id !== info.id) item.isDefault = 0
          })
        }
      })
    },
    onRefresh (done) { // 下拉刷新
      setTimeout(() => {
        this.page = 1
        this.infiniteCount = 0
        this.data = {}
        this.getData(1)
        done()
      }, 1000)
    },
    onInfinite (done) {
      setTimeout(() => { // getData
        var that = this
        if (that.infiniteCount < that.currentCount) {
          that.page++
          that.infiniteCount++
          that.getData(that.page)
        }
        done()
      }, 100)
    }
  }
}
</script>
<style lang="less" scoped>
@import "../../../../static/css/mine.less";
.disabled{
  color: #999;
}
</style>