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

Component.mixin = function(object) {
  _.extend(this.prototype, object);
};

module.exports = Component;
