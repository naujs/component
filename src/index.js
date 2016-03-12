'use strict';

var EventEmitter = require('events')
  , _ = require('lodash')
  , util = require('@naujs/util');

var instances = {};

class Component extends EventEmitter {
  static getInstance(...args) {
    var instance = instances[this.name];

    if (!instance) {
      instance = new this(...args);
      instances[this.name] = instance;
    }

    return instance;
  }

  static mixin(instanceMethods, staticMethods) {
    _.extend(this.prototype, instanceMethods || {});
    _.extend(this, staticMethods || {});
  }

  static clearInstances() {
    instances = {};
  }

  static clearInstance() {
    delete instances[this.name];
  }

  static watch(hook, fn) {
    this._hooks = this._hooks || {};
    this._hooks[hook] = this._hooks[hook] || [];
    this._hooks[hook].push(fn);
    return this;
  }

  static clearHook(name) {
    this._hooks = this._hooks || {};
    this._hooks[name] = [];
  }

  static clearHooks() {
    this._hooks = {};
  }

  static _runHookFunctions(hooks, args) {
    if (!hooks || !hooks.length) {
      return Promise.resolve(true);
    }

    let hook = hooks.shift();

    return util.tryPromise(hook.apply(this, args)).catch((e) => {
      return Promise.reject(e);
    }).then(() => {
      return this._runHookFunctions(hooks, args);
    });
  }

  static runHook(name, ...args) {
    this._hooks = this._hooks || {};
    let hooks = this._hooks[name] || [];

    return this._runHookFunctions(hooks, args);
  }

  runHook(name) {
    return this.getClass().runHook(name);
  }

  getClass() {
    return this.constructor;
  }

  trigger() {
    var args = Array.prototype.slice.apply(arguments);
    return this.emit.apply(this, args);
  }
}

module.exports = Component;
