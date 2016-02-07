'use strict';

var EventEmitter = require('events')
  , _ = require('lodash');

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

  getClass() {
    return this.constructor;
  }

  trigger() {
    var args = Array.prototype.slice.apply(arguments);
    return this.emit.apply(this, args);
  }
}

module.exports = Component;
