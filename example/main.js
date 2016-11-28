const {createElement: h } = require('react')
const startApp = require('../')

const setMessage = message => ({type: 'SET_MESSAGE', message})

const update = (state, action) => {
  switch (action.type) {
    case
    case 'SET_MESSAGE':
      return [{...state, message: action.message }, null]
    default:
      return [state, null]
  }
}

const view = (dispatch, {message}) =>
  h('div', {},
    h('h1', {}, message),
    h('input', {type: 'text', onChange: (e) => dispatch(setMessage(e.target.value))})
  )

statApp({
  view,
  update,
  middleware: []
})
