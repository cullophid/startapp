//@flow weak

const merge = (a, b) => Object.assign({}, a, b)


export default ({model, view, update, subs = [], hooks = {}}) => {
  let state = model
  let msg
  const callHook = (hook, ...args) =>
    hooks[hook] && hooks[hook](...args)

  const dispatch = action => (...args) => {
    callHook('onAction', action, ...args)
    const next = update[action](state, ...args, msg)
    if (!Array.isArray(next)) throw new Error('Update must return a tuple')
    callHook('onUpdate', state, next[0])
    state = next[0]

    if (next[1]) {
      setTimeout(() => // we dont want to fire action in the middle of a render cycle
        next[1].fork(console.error, x => x)
        , 0)
    }

    view(state, msg)
  }

  document.addEventListener("DOMContentLoaded", () => {
    subs.forEach(sub => sub(state, msg))
  })

  msg = Object.keys(update).reduce((o, k) => merge(o, {[k]: dispatch(k)}), {})

  view(state, msg)
}
