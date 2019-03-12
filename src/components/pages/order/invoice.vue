<template>
<div class="page invoicePage">
  <m-header>
    <span slot="left"></span>
    <span slot="title">发票</span>
  </m-header>
  <div class="page-content padding-top">
    <div class="contList">
      <p v-on:click="invoiceCont(0)">不开发票<i :class="{'icon-check':invoice == 0,'icon-checked':invoice != 0}"></i></p>
      <p v-on:click="invoiceCont(1)">个人发票<i :class="{'icon-check':invoice == 1,'icon-checked':invoice != 1}" ></i></p>
      <div v-if="invoice == 1">
        <input 
          class="inputStyle1"
          type="text" 
          v-model="dataMine.invoiceTitle" 
          placeholder="请输入个人姓名" 
          label="发票抬头">
        </von-input>
        <input 
          class="inputStyle1"
          type="text" 
          v-model="dataMine.email" 
          placeholder="请输入接收电子发票邮箱" 
          label="电子邮箱">
        </von-input>
      </div>
      <p v-on:click="invoiceCont(2)">公司发票<i :class="{'icon-check':invoice == 2,'icon-checked':invoice != 2}"></i></p>
      <div v-if="invoice == 2">
        <input 
          class="inputStyle1"
          type="text" 
          v-model="dataCOMPANY.companyName" 
          placeholder="请输入公司名称" 
          label="公司名称">
        </von-input>
        <input 
          class="inputStyle1"
          type="text" 
          v-model="dataCOMPANY.identifyNumber" 
          placeholder="请输入纳税人识别号"
          label="税号" onkeyup="value=value.replace(/[^\a-\z\A-\Z0-9]/g,'')" onpaste="value=value.replace(/[^\a-\z\A-\Z0-9]/g,'')" oncontextmenu = "value=value.replace(/[^\a-\z\A-\Z0-9]/g,'')">
        </von-input>
        <input 
          class="inputStyle1"
          type="text" 
          v-model="dataCOMPANY.addressPhone" 
          placeholder="（选填）请输入公司电话"  
          label="公司电话">
        </von-input>
        <input 
          class="inputStyle1"
          type="text" 
          v-model="dataCOMPANY.bankAccount" 
          placeholder="（选填）请输入公司开户行" 
          label="开户银行">
        </von-input>
        <input 
          class="inputStyle1"
          type="text" 
          v-model="dataCOMPANY.email" 
          placeholder="请输入接收电子发票邮箱" 
          label="电子邮箱">
        </von-input>
      </div>
      <p class="error" v-if="errorCont">{{errorCont}}</p>
    </div>
    <p class="button button-full-red correct mt1" v-on:click="confirm()">使用</p>
  </div>
</div>
</template>
<script>
import {setStore} from '../../../config/mUtils'
import _ from 'lodash'
export default{
  data () {
    return {
      invoice: 0,
      errorCont: '',
      invoiceDataMine: {}, // 获取个人
      invoiceDataCOMPANY: {}, // 获取公司
      isHaveInvoiceMine: false, // 个人
      isHaveInvoiceCOMPANY: false, // 公司
      dataMine: {
        id: '',
        invoiceTitle: '', // 抬头
        email: '' // 邮箱
      },
      dataCOMPANY: {
        id: '',
        companyName: '', // 公司名称
        identifyNumber: '', // 纳税人识别号
        addressPhone: '', // 公司电话
        email: '', // 公司邮箱
        invoicOpeningBank: '', // 开户银行
        bankAccount: '' // 开户账号
      },
      test: 0
    }
  },
  activated () {
    this.getData(0)
  },
  methods: {
    getData (number) { // 获取发票
      var that = this
      that.$axios.get('invoice/query/invoice/all/' + 'MINE').then((res) => { // 是否有个人发票
        if (res) { // 标识 存储
          that.isHaveInvoiceMine = true
          that.dataMine = res
          setStore('invoiceDataMine', res)
        }
        that.$axios.get('invoice/query/invoice/all/' + 'COMPANY').then((res) => {
          if (res) {
            that.isHaveInvoiceCOMPANY = true
            that.dataCOMPANY = res
            setStore('invoiceDataCOMPANY', res)
          }
          if (number === 1) that.toUse()
          if (number !== 1) that.getStoreData()
        })
      })
    },
    getStoreData () { // 获取存储
      var that = this
      if (that.$route.params.type === 'NULL') that.invoice = 0
      if (that.$route.params.type === 'MINE') that.invoice = 1
      if (that.$route.params.type === 'COMPANY') that.invoice = 2
    },
    invoiceCont (type) { // 切换
      this.invoice = type
    },
    confirm () {
      var that = this
      var params = {}
      that.errorCont = ''
      // 邮箱校验
      var emailTest = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      // 特殊字符校验
      var specialTest = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？ ]")
      // 数字校验
      var numberTest = new RegExp('[1234567890]')
      // 手机号校验
      var phoneTest = /(^1[3|4|5|6|7|8|9][0-9]{9}$)/
      if (that.invoice === 1) { // 个人发票
        if (that.dataMine.invoiceTitle === '') {
          that.errorCont = '请填写个人姓名~'
          return
        }
        var numberTestRes = ''
        for (var i = 0; i < that.dataMine.invoiceTitle.length; i++) {
          numberTestRes = numberTestRes + that.dataMine.invoiceTitle.substr(i, 1).replace(numberTest, '@')
        }
        if (numberTestRes.indexOf('@') >= 0) {
          that.errorCont = '姓名不允许输入数字~'
          return
        }
        var specialTestRes = ''
        for (var t = 0; t < that.dataMine.invoiceTitle.length; t++) {
          specialTestRes = specialTestRes + that.dataMine.invoiceTitle.substr(t, 1).replace(specialTest, '@')
        }
        if (specialTestRes.indexOf('@') >= 0) {
          that.errorCont = '姓名不允许输入特殊字符~'
          return
        }
        if (!emailTest.test(that.dataMine.email)) {
          that.errorCont = '请输入正确邮箱~'
          return
        }
        params = {
          'invoiceTitle': that.dataMine.invoiceTitle,
          'email': that.dataMine.email,
          'invoiceType': 'MINE'
        }
        if (that.isHaveInvoiceMine) { // 修改
          params.id = that.dataMine.id
          that.$axios.post('/invoice/update', params).then((res) => {
            that.getData(1)
          })
        } else { // 新增
          that.$axios.post('/invoice/add', params).then((res) => {
            that.isHaveInvoiceMine = true
            that.getData(1)
          })
        }
      } else if (that.invoice === 2) { // 公司发票
        if (that.dataCOMPANY.companyName === '') {
          that.errorCont = '请填写公司名称~'
          return
        };
        var specialTestResult = ''
        for (var k = 0; k < that.dataCOMPANY.companyName.length; k++) {
          specialTestResult = specialTestResult + that.dataCOMPANY.companyName.substr(k, 1).replace(specialTest, '@')
        }
        if (specialTestResult.indexOf('@') >= 0) {
          that.errorCont = '公司名称不允许输入特殊字符~'
          return
        };
        if (that.dataCOMPANY.addressPhone !== '') {
          if (!phoneTest.test(that.dataCOMPANY.addressPhone)) {
            that.errorCont = '请输入正确手机号码~'
            return
          }
        }
        if (that.dataCOMPANY.identifyNumber === '') {
          that.errorCont = '请填写纳税人识别号~'
          return
        }
        var addressCode = that.dataCOMPANY.identifyNumber
        var specialTestResId = ''
        for (var g = 0; g < addressCode.length; g++) {
          specialTestResId = specialTestResId + addressCode.substr(g, 1).replace(specialTest, '@')
        }
        if (specialTestResId.indexOf('@') >= 0) {
          that.errorCont = '请输入正确的纳税人识别号~'
          return
        }
        if (that.dataCOMPANY.email === '') {
          that.errorCont = '请填写接收邮箱~'
          return
        }
        if (!emailTest.test(that.dataCOMPANY.email)) {
          that.errorCont = '请输入正确邮箱~'
          return
        }
        params = {
          'companyName': that.dataCOMPANY.companyName,
          'email': that.dataCOMPANY.email,
          'identifyNumber': that.dataCOMPANY.identifyNumber,
          'addressPhone': that.dataCOMPANY.addressPhone,
          'bankAccount': that.dataCOMPANY.bankAccount,
          'invoiceType': 'COMPANY'
        }
        if (that.isHaveInvoiceCOMPANY) { // 修改
          params.id = that.dataCOMPANY.id
          that.$axios.post('/invoice/update', params).then((res) => {
            that.test = 1
            that.getData(1)
          })
        } else { // 新增
          that.$axios.post('/invoice/add', params).then((res) => {
            that.test = 1
            that.getData(1)
            that.isHaveInvoiceCOMPANY = true
          })
        }
      } else {
        that.getData(1)
      }
    },
    toUse: _.debounce(function () {
      var that = this
      var params = {
        'id': 'NULL',
        'type': 'NULL'
      }
      if (that.invoice === 1) {
        if (!that.dataMine.id) {
          that.errorCont = '请填写个人发票信息'
          return
        }
        params.id = that.dataMine.id
        params.type = 'MINE'
      } else if (that.invoice === 2) {
        if (!that.dataCOMPANY.id) {
          that.errorCont = '请填写公司发票信息'
          return
        }
        params.id = that.dataCOMPANY.id
        params.type = 'COMPANY'
      }
      window.eventBus.$emit('invoice', params)
      window.history.go(-1)
    }, 1000, {
      'leading': true,
      'trailing': false
    }),
    showAlert (cont) {
      this.$toast({message: cont, duration: 800})
    }
  }
}
</script>
<style lang="less" scoped>
.contList{
  padding: 0 0.25rem;
  background:#fff;
  font-size: .28rem;
  p{
    height: 1rem;
    line-height: 1rem;
    border-bottom: 1px solid #EFEEEC;
      i{
        height: .95rem;
        width: .7rem;
        float: right;
      }
  }
  p.error{
    padding-left: .4rem;
    border-bottom: none;
  }
}
.inputStyle1{
  border-bottom: 1px solid #EFEEEC!important;
}
.gray{
  color: #ddd;
}
.red{
  color: #89262a;
} 
.mt1{
  margin-top: 1rem;
}
</style>
