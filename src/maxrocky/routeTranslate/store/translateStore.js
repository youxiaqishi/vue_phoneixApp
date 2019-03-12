export default {
  namespaced: true,
  state: {
    direction: ''
  },
  mutations: {
    directionUpdated (state, direction) {
      state.direction = direction
    }
  }
}
