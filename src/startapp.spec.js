const {merge} = require('ramda')
const sinon = require('sinon')
const Future = require('fluture')
const test = require('tape')
const {applyMiddleware} = require('redux')
const {resolveState, startAppServer, startApp } = require('../')

const fetchMessage = Future((_, resolve) => {
  setTimeout(() => {
    resolve({type: 'SET_MESSAGE', message: 'hello world'})
  }, 10)
})

const update = (state = '', action) => {
  switch (action.type) {
    case 'FETCH_MESSAGE':
      return [state, fetchMessage]
    case 'SET_MESSAGE':
      return [action.message, null]
    default:
      return [state]
  }
}

test('startApp should set the model as the initial state', t => {
  t.plan(1)
  const view = (dispatch, state) => state
  const model = 'init'
  const {dispatch, getState} = startApp({view, update, model, enhancers: []})

  t.equals(getState(), 'init')
})

test('startApp should update the state ussing the update function', t=> {
  t.plan(1)
  const view = (dispatch, state) => state
  const model = 'init'
  const {dispatch, getState} = startApp({view, update, model, enhancers: []})
  dispatch({type: 'SET_MESSAGE', message: 'foo'})
  t.equals(getState(), 'foo')
})

test('startApp should execute Futures returned from update', t=> {
  t.plan(1)
  const view = (dispatch, state) => state
  const model = 'init'
  const store = startApp({view, update, model, enhancers: []})
  store.dispatch({type: 'FETCH_MESSAGE'})
  store.subscribe(() => {
    t.equals(store.getState(), 'hello world')
  })
})
test('startApp should support middle ware', t=> {
  t.plan(2)
  const view = (dispatch, state) => state
  const model = 'init'
  const spy = sinon.spy()
  const middleware = store => next => action => {spy(action); return next(action)}
  const store = startApp({view, update, model, enhancers: [applyMiddleware(middleware)]})
  store.dispatch({type: 'SET_MESSAGE', message: 'foo'})
  t.equals(spy.callCount, 1)
  t.deepEquals(spy.args[0][0], {type: 'SET_MESSAGE', message: 'foo'})

})


test('resolveState should return resolved state', t => {
  t.plan(1)

  const action = {type: 'FETCH_MESSAGE'}
  const expected = 'hello world'

  resolveState(update, 'init', action)
    .fork(
      e => t.fail(e),
      r => t.equals(r, expected)
    )
})

test('startAppServer should return the rendered view', t => {
  t.plan(1)
  const view = state => state.toUpperCase()

  const action = {type: 'FETCH_MESSAGE'}
  const expected = 'HELLO WORLD'

  startAppServer({update, action, view})
    .fork(
      e => t.fail(e),
      r => t.equals(r, expected)
    )
})
