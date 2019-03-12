<template>
<div class="page addressPage">
  <m-header>
    <span slot="left"></span>
    <span slot="title">{{title}}</span>
  </m-header>
  <div class="page-content">
    <div class="inputDiv">
      <div class="inputWrap">
        <span class="input-label">收货人</span>
        <input class="inputStyle2" type="text" maxlength="20" v-model="consigneeName" placeholder="请填写收货人" label="收货人"></input>
      </div>
      <div class="inputWrap">
        <span class="input-label">手机号</span>
        <input class="inputStyle2" type="tel" maxlength="11" v-model="consigneePhone" placeholder="请填写手机号" label="收货人"></input>
      </div>
      <div class="inputWrap">
        <span class="input-label">所在城市</span>
        <div class="selecter" @click="popupVisible4 = true" v-if="!province">请选择所在城市</div>
        <div class="selecter" @click="popupVisible4 = true" v-if="province">{{province}} {{city}} {{county}}</div>
      </div>
      <div class="inputWrap">
        <span class="input-label">详细地址</span>
        <input class="inputStyle2" type="text" v-model="villageName" maxlength="50" placeholder="请填写详细地址" label="收货人"></input>
      </div>
      <p class="error" v-if="errorCont">{{errorCont}}</p>
      <p class="setDefaults" v-on:click="changeDefault()"><i class="icon-check" :class="{'icon-checked':!(isDefault==1)}"></i>设为默认</p>
      <p class="button button-full-red mt30" v-click-one="{click:saveAdress}">保存</p>
    </div>
  </div>
    <mt-popup v-model="popupVisible4" position="bottom" class="mint-popup-city">
      <div class="btns"><p class="cancel" @click="closePopup">取消</p><p class="confirm" @click="setAddress">确定</p></div>
      <city :addressData="UplinkData" :chooseedCity="chooseedCity" @chooseCity="chooseCity"></city>
    </mt-popup>
</div>
</template>
<script>
import store from '../../../store/index'
import city from '../modal/city.vue'
export default {
  data () {
    return {
      data: {},
      title: '新增地址管理',
      consigneeName: '', // 姓名
      consigneePhone: '', // 电话
      popupVisible4: false,
      province: '', // 省
      city: '', // 市
      county: '', // 县
      villageName: '', // 详细地址
      isDefault: 0, // 是否默认
      villageList: [], // 小区
      UplinkData: [], // 省市区
      villageSelect: '', // 小区选择器
      allAddress: '',
      errorCont: '',
      chooseedCity: []
    }
  },
  store,
  components: {
    city
  },
  mounted () {
  },
  destroyed () {
  },
  activated () {
    if (this.$store.state.mutations.allCityList && this.$store.state.mutations.allCityList.length > 0) {
      this.UplinkData = this.$store.state.mutations.allCityList
    } else {
      this.getAllCity()
    }
    this.getData()
  },
  methods: {
    getData () {
      var that = this
      if (that.$route.params.id !== 'no') { // 编辑修改
        that.title = '修改收货地址'
        that.$axios.get('/address/query/address/id/' + that.$route.params.id).then((res) => {
          that.consigneeName = res.name // 收货人
          that.consigneePhone = res.phone // 电话
          that.villageName = res.address // 地址
          that.isDefault = res.isDefault // 是否默认
          that.province = res.province // 省
          that.city = res.city // 市
          that.county = res.county // 县
          that.chooseedCity = [that.province, that.city, that.county]
        })
      }
    },
    getAllCity () {
      var that = this
      that.$axios.get('/app/system/locate/getChinaLocateInfo').then((res) => { // 省市区
        if (res) {
          that.UplinkData = res.provinceDTOList
          that.$store.state.mutations.allCityList = res.provinceDTOList
        }
      })
    },
    closePopup () {
      this.popupVisible4 = false
    },
    chooseCity (province, city, county, countyId) {
      this.oldAddress = {
        province: province,
        city: city,
        county: county,
        countyId: countyId
      }
    },
    setAddress () {
      this.province = this.oldAddress.province
      this.city = this.oldAddress.city
      this.county = this.oldAddress.county
      this.countyId = this.oldAddress.countyId
      this.closePopup()
    },
    saveAdress: function () { // 保存地址
      var that = this
      var params = {
        'phone': that.consigneePhone,
        'name': that.consigneeName,
        'province': that.province,
        'city': that.city,
        'county': that.county,
        'residence': '',
        'address': that.villageName,
        'isDefault': that.isDefault
      }
      var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？ ]")
      var rs = ''
      for (var i = 0; i < that.consigneeName.length; i++) {
        rs = rs + that.consigneeName.substr(i, 1).replace(pattern, '@')
      }
      if (rs.indexOf('@') >= 0) {
        that.errorCont = '姓名不允许输入特殊字符~'
        return
      }
      if (!params.name) {
        that.errorCont = '请填写收货人~'
        return
      }
      var reg = /(^1[3|4|5|6|7|8|9][0-9]{9}$)/
      if (!params.phone || !reg.test(params.phone)) {
        that.errorCont = '手机号码输入错误~'
        return
      }
      if (!params.province) {
        that.errorCont = '请选择城市~'
        return
      }
      if (!params.address) {
        that.errorCont = '请填写详细地址~'
        return
      }

      var pattern2 = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？\\u005C ]")
      var rs2 = ''
      for (var y = 0; y < params.address.length; y++) {
        rs2 = rs2 + params.address.substr(y, 1).replace(pattern2, '@')
      }
      if (rs2.indexOf('@') >= 0) {
        that.errorCont = '详细地址不允许输入特殊字符~'
        return
      }

      that.errorCont = ''
      that.isDefault ? params.isDefault = 1 : params.isDefault = 0
      if (that.$route.params.id !== 'no') { // 修改
        params.id = that.$route.params.id
        that.$axios.post('/address/update', params).then((res) => {
          that.$toast({message: '修改成功', duration: 800})
          window.history.go(-1)
        })
      } else { // 新增
        that.$axios.post('/address/add', params).then((res) => {
          that.$toast({message: '新增成功', duration: 800})
          window.history.go(-1)
        }, () => {
          that.errorCont = '地址输入有误,请重新输入~'
        })
      }
    },
    changeDefault () { // 设为默认
      this.isDefault = !this.isDefault
    }
  }
}
</script>
<style lang="less" scoped>
@import "../../../../static/css/mine.less";
</style>