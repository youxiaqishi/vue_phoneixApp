<template>
  <div class="page-picker">
    <div class="page-picker-wrapper">
      <mt-picker :slots="villageSlot" @change="onChange" :visible-item-count="3"></mt-picker>
    </div>
  </div>
</template>
<script>
export default {
  props: [
    'villageData'
  ],
  data () {
    return {
      villageList: [],
      villageSlot: [{
        flex: 1,
        values: this.villageList,
        className: 'slot1'
      }]
    }
  },
  beforeUpdate () {
    this.villageData = this.villageData
    setTimeout(() => { this.getData() }, 500)
  },
  mounted () {
    setTimeout(() => { this.getData() }, 500)
  },
  methods: {
    getData () {
      if (this.villageData.length > 0) {
        this.villageList = this.getAddressName(this.villageData)
        this.villageSlot[0].values = this.villageList
      }
    },
    onChange (picker, values) {
      this.chooseVillage(values[0], this.getCountyId(values[0], this.villageData))
    },
    getAddressName (list) {
      var array = []
      list.forEach(function (info) {
        array.push(info.communityName)
      })
      return array
    },
    getCountyId (name, list) {
      var id
      list.forEach(function (info, index) {
        if (info.communityName === name) {
          id = info.communityId
        }
      })
      return id
    },
    chooseVillage (village, villageId) {
      this.$emit('chooseVillage', village, villageId)
    }
  }
}
</script>
<style>
</style>
