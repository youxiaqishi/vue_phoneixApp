import translateStore from './store/translateStore.js'
let routeDirection = 'UNINIT'

export default {
  install: (Vue, {router, store}) => {
    if (!router) {
      console.error('translate need router')
      return
    }

    if (!store) {
      console.error('translate need store')
      return
    }

    store.registerModule('translate', translateStore)

    let replace = router.replace
    router.replace = function (location, onComplete, onAbort) {
      routeDirection = 'REPLACE'
      replace.apply(router, [location, onComplete, onAbort])
    }

    let go = router.go
    router.go = function (step, onComplete, onAbort) {
      if (step > 0) {
        throw new Error('暂不支持前进操作')
      }

      if (step === 0) {
        throw new Error('参数错误')
      }

      routeDirection = 'GOBACK'
      go.apply(router, [step, onComplete, onAbort])
    }

    let push = router.push
    router.push = function (location, onComplete, onAbort) {
      routeDirection = 'PUSH'
      push.apply(router, [location, onComplete, onAbort])
    }

    router.afterEach((to, from) => {
      if (from.path === '/' && routeDirection === 'UNINIT') {
        store.commit('translate/directionUpdated', '')
        routeDirection = 'INITED'
        return
      }

      if (routeDirection === 'REPLACE') {
        // 复位标识
        routeDirection = 'INITED'
        return
      }

      if (routeDirection === 'INITED') {
        // 未通过调用router函数进行跳转，通过浏览器回退
        store.commit('translate/directionUpdated', 'reverse')
      }

      if (routeDirection === 'PUSH') {
        // 前进
        store.commit('translate/directionUpdated', 'forward')

        // 复位标识
        routeDirection = 'INITED'
      }

      if (routeDirection === 'GOBACK') {
        // 后退
        store.commit('translate/directionUpdated', 'reverse')

        // 复位标识
        routeDirection = 'INITED'
      }
    })
  }
}
