<template>
<div class="page addressPage">
  <m-header>
    <span slot="left"></span>
    <span slot="title">收货地址管理</span>
  </m-header>
  <div class="page-content">
    <div class="addressList" >
      <div v-if="data.list && data.list.length < 1" class="no-news">还没有收货地址</div>
      <div class="adress-items" v-if="defaultAddress && defaultAddress.id">
        <div class="adress-cont">
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
            <router-link :to="'/addAddress/' + defaultAddress.id" class="btn-edit">
              编辑
              </router-link>
            <span class="btn-del" v-on:click="deleteAddress(defaultAddress,index)">删除</span>
          </div>
        </div>
      </div>  
      <div class="adress-items" v-for="(item,index) in data.list" v-if="item.isDefault != 1">
        <div class="adress-cont">
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
            <router-link :to="'/addAddress/' + item.id" class="btn-edit">
              编辑
              </router-link>
            <span class="btn-del" v-on:click="deleteAddress(item,index)">删除</span>
          </div>
        </div>
      </div>       
    </div>
  </div>
  <div class="btnList fixed">
    <router-link :to="'/addAddress/' + 'no'" tag="p" class="button button-full-red">
      新增
    </router-link>
  </div> 
</div>
</template>
<script>
import _ from 'lodash'
export default {
  data () {
    return {
      data: {list: []},
      page: 1 // 页码
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
    getData () {
      var that = this
      var params = {
        'p': 1,
        'c': 100
      }
      that.$axios.post('/address/query/address/list', params).then((res) => {
        if (res) {
          that.data.list = res.list
        }
      })
    },
    deleteAddress (item, index) { // 删除地址
      var that = this
      that.$axios.get('/address/delete/id/' + item.id).then((res) => { // 删除地址
        if (res) that.data.list.splice(index, 1)
      })
    },
    changeDefault (info) { // 更改默认收货地址
      var params = {
        'id': info.id
      }
      this.$axios.post('/address/set/default', params).then((res) => {
        if (res) {
          info.isDefault = info.isDefault ? 0 : 1
          if (info.isDefault) {
            this.data.list.forEach(function (item) {
              if (item.id !== info.id) item.isDefault = 0
            })
          }
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import "../../../../static/css/mine.less";
</style>