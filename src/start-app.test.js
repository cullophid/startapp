//@flow
import test from 'tape'
import sinon from 'sinon'
import app from './start-app'

global.document = {
  addEventListener: (type, f) => f()
}

test('start-app should call view with model and msg', t => {
  t.plan(3)
  const model = "Model"
  const view = sinon.spy()
  const update = {noop: x => [x]}
  app({model, view, update})
  t.equals(view.calledOnce, true, 'should initially call view')
  t.equals(view.args[0][0], model)
  t.deepEqual(Object.keys(view.args[0][1]), Object.keys(update))
})


test('start-app should update state when a message is called', t => {
  t.plan(2)
  const model = "Model"
  const view = sinon.spy()
  const update = {set: (_, x) => [x]}
  app({model, view, update})
  view.args[0][1].set('New Model')
  t.equals(view.callCount, 2, 'should call view twice')
  t.equals(view.args[1][0], "New Model")
})
