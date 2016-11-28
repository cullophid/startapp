// @flow
const React = require('react')
const Future = require('fluture')
const {createStore, compose} = require('redux')

const command = store => next => action => {
  return next(action)
}

const startApp= ({view, update}) => {
  const store = createStore(update, model, command)
  view(store.dispatch, store.getState())
  store.subscribe(() => view(store.dispatch, store.getState()))
  return store
}


const resolveState = (update, action) => Future((_, resolve) => {
  const resolver = (done, state) => action => {
    const next = update(state, action)
    if (!Array.isArray(next)) throw new Error('reducer must return a pair of [state, Future]')
    const [nextState, nextCommand] = next
    return nextCommand ? nextCommand.fork(resolver(done, newState), resolver(done, newState)) : done(newState)
  }
  resolver(resolve, null)(action)
})


module.exports = {startApp, resolveState}
