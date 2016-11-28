// @flow
const React = require('react')
const Future = require('fluture')
const {createStore, compose, applyMiddleware} = require('redux')


const forkFutures = (dispatch, state) => {
  if (!Array.isArray(state)) throw new Error('Update function must return a pair of [State, Future]')
  const [nextState, future] = state
  if (future) future.fork(dispatch, dispatch)
  return nextState
}

const futureEnhancer = createStore => (reducer, initState, enhancer) => {
  const store = createStore(reducer, initState, enhancer)
  const getState = () => forkFutures(store.dispatch, store.getState())

  return Object.assign({}, store, {getState})
}



const startApp= ({view, model, update, enhancers}) => {
  const store = createStore(update, model, compose(...enhancers, futureEnhancer))
  view(store.dispatch, store.getState())
  store.subscribe(() => view(store.dispatch, store.getState()))
  return store
}


const resolveState = (update, model, action) => Future((_, resolve) => {
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
  resolver(resolve, model)(action)
})

const startAppServer = ({update, view, model, action}) => Future((_, resolve) => {
  resolveState(update, model, action)
    .fork(
      () => {},
      state => resolve(view(state))
    )
})


module.exports = {startApp, resolveState, startAppServer}
