/**
* Created by Administrator on 2017/6/5.
*/
// import * as types from './types'
const state = {
  isApp: 1,
  minePage: null,
  isIPhoneX: null,
  badge: 0,
  indexPage: {
    data: {
      banner: [],
      navList: [],
      recommend: [],
      proposal: {}
    },
    tabs: [],
    activityLength: '',
    tabsData: []
  },
  specialPage: {
    data: [], // 列表1
    specialData: [] // 列表2
  },
  classifyPage: {
    tabs: [],
    tabsData: []
  },
  affirmOrderPage: {
    invoiceData: {
      invoiceType: ''
    },
    cartData: {},
    shopCartData: {}
  },
  footPage: {},
  savePage: {},
  allCityList: [],
  phoneixList: []
}

const mutations = {
}

export default {
  state,
  mutations
}
