<template>
  <div class="page" v-if="addressData">
    <mt-picker :slots="myAddressSlots" :itemHeight="40" @change="onMyAddressChange"></mt-picker>
  </div>
</template>
<script>
export default {
  props: [
    'addressData',
    'chooseedCity'
  ],
  data () {
    return {
      myAddressSlots: [
        {
          flex: 1,
          defaultIndex: 1,
          values: this.addressList, // Object.keys(myaddress),    // 省份数组
          textAlign: 'center'
        },
        {
          flex: 1,
          values: [],
          textAlign: 'center'
        },
        {
          flex: 1,
          values: [],
          textAlign: 'center'
        }
      ],
      countyId: '',
      isFrist: true,
      addressList: []
    }
  },
  activated () {
    setTimeout(() => { this.getData() }, 500)
  },
  mounted () {
    setTimeout(() => { this.getData() }, 500)
  },
  methods: {
    chooseCity (province, city, county, countyId) {
      this.$emit('chooseCity', province, city, county, countyId)
    },
    getData () {
      setTimeout(() => {
        this.addressList = this.getAddressName(this.addressData)
        this.myAddressSlots[0].values = this.addressList
      }, 500)
    },
    onMyAddressChange (picker, values) {
      if (this.addressData) {
        if (values[0]) picker.setSlotValues(1, this.getAddressName(this.addressData[this.getAddressIndex(values[0], this.addressData)].child))
        if (values[1]) {
          var index = this.getAddressIndex(values[1], this.addressData[this.getAddressIndex(values[0], this.addressData)].child)
          var childList = this.addressData[this.getAddressIndex(values[0], this.addressData)].child[index] ? this.addressData[this.getAddressIndex(values[0], this.addressData)].child[index].child : []
          if (childList) picker.setSlotValues(2, this.getAddressName(childList))
          this.countyId = this.getCountyId(values[2], childList)
        }
      }
      if ((this.chooseedCity && this.chooseedCity.length === 3) && this.isFrist) {
        picker.setValues(this.chooseedCity)
        this.isFrist = false
      }
      this.chooseCity(values[0], values[1], values[2], this.countyId)
    },
    getAddressIndex (name, list) {
      var curIndex = ''
      var isTrue = true
      list.forEach(function (info, index) {
        if (isTrue) {
          if (info.name === name) {
            curIndex = index
            isTrue = false
          }
        }
      })
      return curIndex
    },
    getAddressName (list) {
      var array = []
      list.forEach(function (info) {
        array.push(info.name)
      })
      return array
    },
    getCountyId (name, list) {
      var id
      list.forEach(function (info, index) {
        if (info.name === name) {
          id = info.id
        }
      })
      return id
    }
  }
}
</script>
<style lang="less" scoped>
.page{
  top: 1rem;
}
.picker-slot{
  font-size: .3rem!important;
}
</style>