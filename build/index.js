'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EventEmitter = require('events'),
    _ = require('lodash'),
    util = require('@naujs/util');

var instances = {};

var Component = (function (_EventEmitter) {
  _inherits(Component, _EventEmitter);

  function Component() {
    _classCallCheck(this, Component);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Component).apply(this, arguments));
  }

  _createClass(Component, [{
    key: 'runHooks',
    value: function runHooks(name) {
      return this.getClass().runHooks(name);
    }
  }, {
    key: 'getClass',
    value: function getClass() {
      return this.constructor;
    }
  }, {
    key: 'trigger',
    value: function trigger() {
      var args = Array.prototype.slice.apply(arguments);
      return this.emit.apply(this, args);
    }
  }], [{
    key: 'getInstance',
    value: function getInstance() {
      var instance = instances[this.name];

      if (!instance) {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        instance = new (Function.prototype.bind.apply(this, [null].concat(args)))();
        instances[this.name] = instance;
      }

      return instance;
    }
  }, {
    key: 'mixin',
    value: function mixin(instanceMethods, staticMethods) {
      _.extend(this.prototype, instanceMethods || {});
      _.extend(this, staticMethods || {});
    }
  }, {
    key: 'clearInstances',
    value: function clearInstances() {
      instances = {};
    }
  }, {
    key: 'clearInstance',
    value: function clearInstance() {
      delete instances[this.name];
    }
  }, {
    key: 'watch',
    value: function watch(hook, fn) {
      this._hooks = this._hooks || {};
      this._hooks[hook] = this._hooks[hook] || [];
      this._hooks[hook].push(fn);
      return this;
    }
  }, {
    key: 'clearHooks',
    value: function clearHooks(name) {
      this._hooks = this._hooks || {};
      this._hooks[name] = [];
    }
  }, {
    key: '_runHooks',
    value: function _runHooks(hooks, args) {
      var _this2 = this;

      if (!hooks || !hooks.length) {
        return Promise.resolve(true);
      }

      var hook = hooks.shift();

      return util.tryPromise(hook.apply(this, args)).catch(function (e) {
        return Promise.reject(e);
      }).then(function () {
        return _this2._runHooks(hooks, args);
      });
    }
  }, {
    key: 'runHooks',
    value: function runHooks(name) {
      this._hooks = this._hooks || {};
      var hooks = this._hooks[name] || [];

      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      return this._runHooks(hooks, args);
    }
  }]);

  return Component;
})(EventEmitter);

module.exports = Component;