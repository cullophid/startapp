const {createElement: h } = require('react')
const {startApp} = require('../')

const setMessage = message => ({type: 'SET_MESSAGE', message})






console.log('initial state', getState())
console.log('DISPATCH NOOP')
dispatch({type: 'NOOP'})

console.log('final state', getState())
