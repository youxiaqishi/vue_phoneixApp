function isAsyncPlaceholder (node) {
  return node.isComment && node.asyncFactory
}

function getFirstComponentChild (children) {
  if (Array.isArray(children)) {
    for (let i = 0; i < children.length; i++) {
      const c = children[i]
      if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
        return c
      }
    }
  }
}

function isDef (v) {
  return v !== undefined && v !== null
}

export default {
  name: 'mrNavigation',
  abstract: true,

  render () {
    const vnode = getFirstComponentChild(this.$slots.default)
    const componentOptions = vnode && vnode.componentOptions
    if (componentOptions) {
      const cache = this.$cacheContainer.currentCache(this._uid)

      const key = vnode.key == null
        ? componentOptions.Ctor.cid + (componentOptions.tag ? `::${componentOptions.tag}` : '')
        : vnode.key
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance
      } else {
        cache[key] = vnode
      }

      vnode.data.keepAlive = true
    }
    return vnode
  }
}
