'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//@flow weak

var merge = function merge(a, b) {
  return Object.assign({}, a, b);
};

exports.default = function (_ref) {
  var model = _ref.model,
      view = _ref.view,
      update = _ref.update,
      _ref$subs = _ref.subs,
      subs = _ref$subs === undefined ? [] : _ref$subs,
      _ref$hooks = _ref.hooks,
      hooks = _ref$hooks === undefined ? {} : _ref$hooks;

  var state = model;
  var msg = void 0;
  var callHook = function callHook(hook) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return hooks[hook] && hooks[hook].apply(hooks, args);
  };

  var dispatch = function dispatch(action) {
    return function () {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      callHook.apply(undefined, ['onAction', action].concat(args));
      var next = update[action].apply(update, [state].concat(args, [msg]));
      if (!Array.isArray(next)) throw new Error('Update must return a tuple');
      callHook('onUpdate', state, next[0]);
      state = next[0];

      if (next[1]) {
        setTimeout(function () {
          return (// we dont want to fire action in the middle of a render cycle
            next[1].fork(console.error, function (x) {
              return x;
            })
          );
        }, 0);
      }

      view(state, msg);
    };
  };

  document.addEventListener("DOMContentLoaded", function () {
    subs.forEach(function (sub) {
      return sub(state, msg);
    });
  });

  msg = Object.keys(update).reduce(function (o, k) {
    return merge(o, _defineProperty({}, k, dispatch(k)));
  }, {});

  view(state, msg);
};