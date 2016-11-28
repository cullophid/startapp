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
    if (nextCommand) {
      nextCommand.fork(
        resolver(done, nextState),
        resolver(done, nextState)
      )
    } else {
      done(nextState)
    }
  }
  resolver(resolve, null)(action)
})

const startAppServer = ({update, view, action}) => Future((_, resolve) => {
  resolveState(update, action)
    .fork(
      () => {},
      state => resolve(view(state))
    )
})


module.exports = {startApp, resolveState, startAppServer}
