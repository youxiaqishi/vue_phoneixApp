/**
 * Created by Administrator on 2017/6/5.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import newsPush from './modules/newsPush.js'
import home from './modules/home.js'
import currentShopInfo from './modules/currentShopInfo.js'
Vue.use(Vuex)
export default new Vuex.Store({
  modules: {
    mutations,
    newsPush,
    home,
    currentShopInfo
  }
})
