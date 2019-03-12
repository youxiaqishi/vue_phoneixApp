export default {
  namespaced: true,
  state: {
    homeNavChanged: false
  },
  mutations: {
    changed (state) {
      state.homeNavChanged = true
    },
    reset (state) {
      state.homeNavChanged = false
    }
  }
}
