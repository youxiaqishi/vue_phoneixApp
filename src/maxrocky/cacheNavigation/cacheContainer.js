let cache = []
function getNewLevel () {
  return {}
}
function addLevel () {
  cache.push(getNewLevel())
}
function back (step) {
  if (step >= 0) {
    throw new Error('step参数错误')
  }
  for (let i = 0; i > step; i--) {
    clearCache(cache.pop())
  }
}
function clearCache (cacheLevel) {
  cacheLevel && Object.keys(cacheLevel).forEach((navigationKey) => {
    cacheLevel[navigationKey] && Object.keys(cacheLevel[navigationKey]).forEach((componentKey) => {
      console.log('clear' + componentKey)
      cacheLevel[navigationKey][componentKey] && cacheLevel[navigationKey][componentKey].componentInstance && cacheLevel[navigationKey][componentKey].componentInstance.$destroy()
    })
  })
}
export default {
  push () {
    addLevel()
  },
  go (step) {
    back(step)
  },
  reset () {
    this.go(-cache.length)
    this.push()
  },
  currentLevelCache () {
    return cache[cache.length - 1]
  },
  currentCache (key) {
    let currentLevel = this.currentLevelCache()
    currentLevel[key] || (currentLevel[key] = {})
    return currentLevel[key]
  }
}
