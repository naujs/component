'use strict';

var EventEmitter = require('events')
  , _ = require('lodash');

class Component extends EventEmitter {
  trigger() {
    var args = Array.prototype.slice.apply(arguments);
    return this.emit.apply(this, args);
  }
}

Component.mixin = function(object) {
  _.extend(this.prototype, object);
};

module.exports = Component;