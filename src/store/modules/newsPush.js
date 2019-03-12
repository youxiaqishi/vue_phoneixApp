export default {
  namespaced: true,
  state: {
    selectItemList: [],
    history: []
  },
  mutations: {
    reset (state) {
      state.selectItemList = []
      state.history = []
    },
    resetHistory (state) {
      state.history = []
    },
    pushLevel (state, item) {
      state.history.push(item)
    },
    popLevel () {
      history.pop()
    },
    removeItem (state, removeItem) {
      let index = -1
      state.selectItemList.forEach((item, i) => {
        if (item.mdmCode === removeItem.mdmCode) {
          index = i
        }
      })
      if (index !== -1) {
        state.selectItemList.splice(index, 1)
      }
    },
    addItem (state, item) {
      state.selectItemList.push(item)
    },
    checkLevel (state, mdmCode) {
      if (state.history[state.history.length - 1].mdmCode !== mdmCode) {
        let index = -1
        state.history.forEach((item, i) => {
          if (item.mdmCode === mdmCode) {
            index = i
          }
        })
        if (index !== -1) {
          state.history.splice(index + 1)
        }
      }
    }
  },
  getters: {
    selectPersonCount (state, getters) {
      // TODO: 去除包含关系
      let count = 0
      state.selectItemList.forEach((item) => {
        if (item.type === 'dept') count += item.userNums
        if (item.type === 'user') count++
      })
      return count
    }
  }
}
