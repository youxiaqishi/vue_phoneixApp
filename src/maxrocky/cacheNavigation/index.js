import cacheContainer from './cacheContainer.js'
import MrNavigation from './mrNavigation.js'

let routeDirection = 'UNINIT'
let backStep = 0
let history = []
let first = null

function historyBack (step, toPath) {
  if (history.length <= -step) {
    // reset
    cacheContainer.reset()
    history = [toPath]
  } else {
    cacheContainer.go(step)
    history.splice(step)
  }
}

function historyReplace (toPath) {
  history[history.length - 1] = toPath
}

function historyPush (toPath) {
  history.push(toPath)
  cacheContainer.push()
}

function getIndexOfHistory (toPath) {
  return history.indexOf(toPath)
}

export default {
  install: (Vue, {router}) => {
    if (!router) {
      console.error('navigation need router')
      return
    }

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

      // 防止退冒，最多退到首页，不能退至浏览器历史
      if (-step >= history.length) {
        step = 1 - history.length
        if (step === 0) {
          console.error('已是首页无法回退')
          if (!first) { // 安卓: 一秒之内连续点击两次退出APP
            first = new Date().getTime()
            setTimeout(() => { first = null }, 1000)
          } else {
            if (new Date().getTime() - first < 1000) {
              navigator.app.exitApp()
            }
          }
          return
        }
      }

      routeDirection = 'GOBACK'
      backStep = step
      go.apply(router, [step, onComplete, onAbort])
    }

    router.reset = function (onComplete, onAbort) {
      let step = 1 - history.length
      if (step === 0) {
        console.log('当前处于根级，无需reset')
        return
      }
      historyBack(-1000)
      router.go(step, onComplete, onAbort)
    }

    let push = router.push
    router.push = function (location, onComplete, onAbort) {
      routeDirection = 'PUSH'
      push.apply(router, [location, onComplete, onAbort])
    }

    // handle router change
    router.afterEach((to, from) => {
      if (from.path === '/' && routeDirection === 'UNINIT') {
        historyPush(to.path)
        routeDirection = 'INITED'
        return
      }

      if (routeDirection === 'REPLACE') {
        historyReplace(to.path)

        // 复位标识
        routeDirection = 'INITED'
        backStep = 0
        return
      }

      if (routeDirection === 'INITED') {
        // 未通过调用router函数进行跳转，通过浏览器回退
        let index = getIndexOfHistory(to.path)
        if (index >= 0) {
          console.log('通过浏览器回退，历史有记录，正常回退')
        } else {
          console.error('通过浏览器回退，且历史未记录，将重置历史')
        }
        historyBack(index - history.length + 1, to.path)
      }

      if (routeDirection === 'PUSH') {
        // 前进
        historyPush(to.path)

        // 复位标识
        routeDirection = 'INITED'
        backStep = 0
      }

      if (routeDirection === 'GOBACK') {
        // 后退
        historyBack(backStep, to.path)

        // 复位标识
        routeDirection = 'INITED'
        backStep = 0
      }
    })
    Vue.prototype.$cacheContainer = cacheContainer

    Vue.component('mrNavigation', MrNavigation)
  }
}
