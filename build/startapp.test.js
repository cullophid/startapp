'use strict';

var _tape = require('tape');

var _tape2 = _interopRequireDefault(_tape);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _startapp = require('./startapp');

var _startapp2 = _interopRequireDefault(_startapp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

global.document = {
  addEventListener: function addEventListener(type, f) {
    return f();
  }
}; //@flow


(0, _tape2.default)('start-app should call view with model and msg', function (t) {
  t.plan(3);
  var model = "Model";
  var view = _sinon2.default.spy();
  var update = { noop: function noop(x) {
      return [x];
    } };
  (0, _startapp2.default)({ model: model, view: view, update: update });
  t.equals(view.calledOnce, true, 'should initially call view');
  t.equals(view.args[0][0], model);
  t.deepEqual(Object.keys(view.args[0][1]), Object.keys(update));
});

(0, _tape2.default)('start-app should update state when a message is called', function (t) {
  t.plan(2);
  var model = "Model";
  var view = _sinon2.default.spy();
  var update = { set: function set(_, x) {
      return [x];
    } };
  (0, _startapp2.default)({ model: model, view: view, update: update });
  view.args[0][1].set('New Model');
  t.equals(view.callCount, 2, 'should call view twice');
  t.equals(view.args[1][0], "New Model");
});