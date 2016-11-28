const {merge} = require('ramda')
const Future = require('fluture')
const test = require('tape')
const {resolveState, startAppServer } = require('../')

const fetchMessage = Future((_, resolve) => {
  setTimeout(() => {
    resolve({type: 'SET_MESSAGE', message: 'hello world'})
  }, 100)
})

const update = (state = '', action) => {
  console.log(action)
  switch (action.type) {
    case 'FETCH_MESSAGE':
      return [state, fetchMessage]
    case 'SET_MESSAGE':
      return [action.message]
    default:
      return [state]
  }
}

const {statAppServer} = require('./startapp.js')
test('should return resolved state', t => {
  t.plan(1)

  const action = {type: 'FETCH_MESSAGE'}
  const expected = 'hello world'

  resolveState(update, action)
    .fork(
      e => t.fail(e),
      r => t.equals(r, expected)
    )
})

test('should return resolved state', t => {
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
