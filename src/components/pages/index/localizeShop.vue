<template>
  <div class="indexPage">
    <div class="closeTit">
      <i class="btnLeft close2" v-if="cityShow" v-on:click="cityShow = !cityShow"></i>
      <i class="btnLeft close2" v-if="shopShow" v-on:click="shopShow = !shopShow"></i>
      <i class="closeModalBtn close1" v-if="currentShop.name" v-on:click="showLocalize"></i>
    </div>
    <div class="localizeShop" id="localizeShop">
      <div class="allShopData showShop" :class="{'showDiv':!cityShow && !shopShow}">
        <div class="shopCont">
          <div class="shopList">
            <dl class="shop" v-if="currentShop.name" v-on:click="intoShop(currentShop)">
              <dt><img v-bind:src="currentShop.url"></dt>
              <dd>
                <p>{{currentShop.name}}
                  <span>{{currentShop.address}}
                  </span>
                </p>
                <span class="tit">当前店铺</span>
                <i>进入此店铺</i>
              </dd>
            </dl>
            <h3 class="tit">您附近的店铺
              <span v-on:click="checkMoreShop" v-if="locateShop.length > 0" class="checkMoreShop">更多店铺 <i class="icon-arrow-right"></i></span>
            </h3>
            <dl class="shop" v-if="locateShop.length > 0 && (index == 0 || index == 1)" v-for="(locShop, index) in locateShop" v-on:click="intoShop(locShop)">
              <dt><img v-bind:src="locShop.url"></dt>
              <dd>
                <p>{{locShop.name}} 
                  <span>{{locShop.address}}
                    <span class="distance" v-if="locShop.distance < 1000">{{locShop.distance}}米</span>
                    <span class="distance" v-if="locShop.distance >= 1000">{{locShop.distance * 0.001 | twoDecimal}}公里</span>
                  </span>
                </p>
                <span class="tit">GPS定位店铺</span>
                <i>进入此店铺</i>
              </dd>
            </dl>
          </div>
          <div class="location" :class="{'location1':locateShop.length > 0}" v-on:click="reLocate()">
            <p class="locationIcon" v-if="locateShop.length == 0">
              未定位到店铺
            </p>
            <span>重新定位</span>
          </div>
        </div>
        <div class="shopCont" style="margin-top: .2rem;">
          <div class="shopList">
            <div class="inputWrap" v-on:click="intoShop(defaultShopData)">
              <div class="selecter">产地全国邮</div><i class="icon-arrow-right"></i>
            </div>
            <div class="inputWrap" v-on:click="changeCity">
              <div class="selecter">手动选择店铺</div><i class="icon-arrow-right"></i>
            </div>
          </div>
        </div>
      </div>
      <!-- 定位更多店铺 -->
      <div class="allShopData selectCity" :class="{'showDiv': shopShow}">
        <div class="mt05">
          <dl class="shop" v-for="locShop in locateShop">
            <dt><img v-bind:src="locShop.url"></dt>
            <dd>
              <p>{{locShop.name}}
                <span>{{locShop.address}}</span>
                <span class="distanceHand" v-if="locShop.distance < 1000">{{locShop.distance}}米</span>
                <span class="distanceHand" v-if="locShop.distance >= 1000">{{locShop.distance * 0.001 | twoDecimal}}公里</span>
              </p>
              <i v-on:click="intoShop(locShop)">进入此店铺</i>
            </dd>
          </dl>
        </div>
      </div>
      <!-- 手动选择店铺 -->
      <div class="allShopData selectCity" :class="{'showDiv': cityShow}">
        <h3 class="tit">手动选择店铺</h3>
        <div class="shopList">
          <div class="inputWrap" @click="popupVisible4 = true">
            <div class="selecter" v-if="!myAddressProvince">请选择所在城市<i class="icon-arrow-right"></i></div>
            <div class="selecter" v-if="myAddressProvince">{{myAddressProvince}} {{myAddressCity}} {{myAddresscounty}}<i class="icon-arrow-right"></i></div>
          </div>
          <div class="inputWrap" @click="popupVisible5 = true">
            <div class="selecter" v-if="!myAddressCommunity">请选择所在小区<i class="icon-arrow-right"></i></div>
            <div class="selecter" v-if="myAddressCommunity">{{myAddressCommunity}}<i class="icon-arrow-right"></i></div>
          </div>
        </div>
        <div class="mt05">
          <dl class="shop" v-for="item in shopCont.shopList">
            <dt><img v-bind:src="item.url"></dt>
            <dd>
              <p>{{item.name}}<span>{{item.address}}</span></p>
              <i v-on:click="intoShop(item)">进入此店铺</i>
            </dd>
          </dl>
        </div>
        <div class="noMessage">
          <i v-if="showShopMessage">当前小区下无店铺</i>
          <i v-if="showVillageMessage">当前无可用小区</i>
        </div>
      </div>
    </div> 
    <mt-popup v-model="popupVisible4" position="bottom" class="mint-popup-city">
      <div class="btns"><p class="cancel" @click="closePopup">取消</p><p class="confirm" @click="setAddress">确定</p></div>
      <city :addressData="addressData" @chooseCity="chooseCity"></city>
    </mt-popup>
    <mt-popup v-model="popupVisible5" position="bottom" class="mint-popup-city">
      <div class="btns"><p class="cancel" @click="closePopup">取消</p><p class="confirm" @click="setVillage">确定</p></div>
      <village :villageData="villageList" @chooseVillage="chooseVillage"></village>
    </mt-popup>
  </div>
</template>
<script>
import city from '../modal/city.vue'
import village from '../modal/village.vue'
export default {
  props: [
    'defaultShopData',
    'currentShop',
    'locateShop'
  ],
  components: {
    city,
    village
  },
  activated () {
    this.cityShow = false
    this.shopShow = false
  },
  data () {
    return {
      cityShow: false,
      shopShow: false,
      popupVisible5: false,
      popupVisible4: false,
      showShopMessage: false,
      showVillageMessage: false,
      myAddressCity: '',
      myAddresscounty: '',
      myAddressProvince: '',
      myAddressCommunity: '',
      myAddressCommunityId: '',
      oldAddress: {},
      oldVillage: {},
      addressData: [],
      shopCont: { shopList: [] },
      villageList: [{'communityId': '', 'communityName': '请选择所在小区'}]
    }
  },
  mounted () {
    this.$store.state.mutations.phoneixList && this.$store.state.mutations.phoneixList.length > 0 ? this.addressData = this.$store.state.mutations.phoneixList : this.getAllAddress()
  },
  methods: {
    getAllAddress () {
      var that = this
      that.$loading.open()
      that.$axios.get('/app/system/locate/getAllLocateInfo').then((locRes) => {
        if (locRes) {
          that.addressData = locRes.provinceDTOList
          that.$store.state.mutations.phoneixList = locRes.provinceDTOList
        }
        that.$loading.close()
      })
    },
    reLocate () {
      this.$emit('reLocate')
    },
    intoShop (shop) {
      this.myAddressCity = ''
      this.myAddresscounty = ''
      this.myAddressProvince = ''
      this.myAddressCommunity = ''
      this.myAddressCommunityId = ''
      this.shopCont.shopList = []
      this.$emit('intoShop', shop)
      this.cityShow = false
      this.shopShow = false
    },
    checkMoreShop () {
      this.shopShow = !this.shopShow
    },
    changeCity () {
      window.document.getElementById('localizeShop').scrollTop = 0 // 回到顶部
      this.cityShow = !this.cityShow
      this.$store.state.mutations.phoneixList && this.$store.state.mutations.phoneixList.length > 0 ? this.addressData = this.$store.state.mutations.phoneixList : this.getAllAddress()
      this.popupVisible4 = true
    },
    closePopup () {
      this.popupVisible4 = false
      this.popupVisible5 = false
    },
    chooseCity (province, city, county, countyId) {
      this.oldAddress = {
        myAddressProvince: province,
        myAddressCity: city,
        myAddresscounty: county,
        countyId: countyId
      }
    },
    chooseVillage (village, villageId) {
      this.oldVillage = {
        myAddressCommunity: village,
        myAddressCommunityId: villageId
      }
    },
    setAddress () {
      this.myAddressProvince = this.oldAddress.myAddressProvince
      this.myAddressCity = this.oldAddress.myAddressCity
      this.myAddresscounty = this.oldAddress.myAddresscounty
      this.countyId = this.oldAddress.countyId
      this.closePopup()
      this.getVillageData(this.countyId)
    },
    setVillage () {
      this.myAddressCommunity = this.oldVillage.myAddressCommunity
      this.myAddressCommunityId = this.oldVillage.myAddressCommunityId
      this.closePopup()
      this.getShopData(this.myAddressCommunityId)
    },
    getShopData (communityId) {
      var that = this
      if (communityId) {
        that.$loading.open()
        that.$axios.get('/app/shop/get/all/shop/community/' + communityId).then((res) => {
          if (res) {
            that.shopCont.shopList = res
            res.length === 0 ? that.showShopMessage = true : that.showShopMessage = false
          }
          that.$loading.close()
        })
      }
    },
    getVillageData (id) {
      var that = this
      that.$loading.open()
      that.$axios.post('/app/system/locate/getCommunityByDid', {'districtId': id}).then((res) => {
        if (res) {
          that.villageList = res
          that.shopCont.shopList = []
          that.villageList = res.length > 0 ? res : [{'communityId': '', 'communityName': '暂无小区'}]
          res.length === 0 ? that.showVillageMessage = true : that.showVillageMessage = false
          that.myAddressCommunity = ''
        }
        that.$loading.close()
      })
    },
    showLocalize () {
      this.shopCont.shopList = []
      this.myAddressProvince = ''
      this.myAddressCity = ''
      this.myAddresscounty = ''
      this.myAddressCommunity = ''
      this.myAddressCommunityId = ''
      this.$emit('showLocalize')
      this.cityShow = false
      this.shopShow = false
    }
  }
}
</script>
<style lang="less" scoped>
@import "../../../../static/css/index.less";
.indexPage {
  width: 100%;
  height: 100%;
  background-color: #fff;
  .closeTit{
    height: 1.2rem;
    width: 100%;
    position: absolute; 
    padding-top: .2rem;   
    background: #fff;
  }
  .close2{
    height: 1rem;
    width: 1rem;
    float: left;
  }
  .close1{
    height: 1rem;
    width: 1rem;
    float: right;
    background-size: .5rem!important;
  }
}
</style>