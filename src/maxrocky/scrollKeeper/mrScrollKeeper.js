function getFirstComponentChild (children) {
  if (Array.isArray(children)) {
    for (let i = 0; i < children.length; i++) {
      const c = children[i]
      return c
    }
  }
}

// function getElement (root, selector) {
//   if (!selector) {
//     return root
//   } else {
//     return root['querySelector'] ? root.querySelector(selector) : null
//   }
// }

// function setScroll (element, scroll) {
//   element.scrollTop = scroll.top
//   element.scrollLeft = scroll.left
// }
// function getScroll (element) {
//   return {top: element.scrollTop, left: element.scrollLeft}
// }
// function setTransform (element, transform) {
//   element.style.transform = transform
// }
// function getTransform (element) {
//   return element.style.transform
// }

// function setPosition (element, position) {
//   if (position) {
//     if (position.scroll) {
//       setScroll(element, position.scroll)
//     }
//     if (position.transform) {
//       setTransform(element, position.transform)
//     }
//   }
// }
// function getPosition (element) {
//   return {
//     scroll: getScroll(element),
//     transform: getTransform(element)
//   }
// }

export default {
  name: 'mrScrollKeeper',
  props: ['scrollerSelector'],
  mounted () {
    // console.log('mounted')
  },
  methods: {
    init () {
      let self = this
      if (self.$slots.default &&
        self.$slots.default[0] &&
        self.$slots.default[0].componentInstance &&
        self.$slots.default[0].componentInstance.getPosition &&
        self.cachedPosition) {
        // 内部为vue-scroll
        setTimeout(() => {
          let cachedPosition = self.cachedPosition
          self.$slots.default[0].componentInstance.scrollTo(cachedPosition.left, cachedPosition.top, false)
        }, 0)
      }
      // else {
      //   var element = getElement(this.$el, this.scrollerSelector)
      //   element && setPosition(element, this.cachedPosition)
      // }

      if (this.guardRemoveHandler) this.guardRemoveHandler()
      this.guardRemoveHandler = this.$router.beforeEach((to, from, next) => {
        this.guardRemoveHandler && this.guardRemoveHandler()
        if (self.$slots.default &&
          self.$slots.default[0] &&
          self.$slots.default[0].componentInstance &&
          self.$slots.default[0].componentInstance.getPosition) {
          // 内部为vue-scroll
          self.cachedPosition = self.$slots.default[0].componentInstance.getPosition()
        }
        // else {
        //   var element = getElement(self.$el, self.scrollerSelector)
        //   self.cachedPosition = element && getPosition(element)
        // }
        next()
      })
    }
  },
  activated () {
    this.init()
  },
  created () {
    this.init()
  },
  render () {
    return getFirstComponentChild(this.$slots.default)
  }
  // deactivated () {
  //   this.guardRemoveHandler && this.guardRemoveHandler()
  // }
}
