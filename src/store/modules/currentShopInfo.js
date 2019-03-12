// let shopId = window.localStorage.getItem('shopId')
export default {
  namespaced: true,
  state: {
    shopId: 11
  },
  mutations: {
    changed (state, shopId) {
      state.shopId = shopId
      window.localStorage.setItem('shopId', shopId)
    }
  }
}
