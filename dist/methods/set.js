'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = function set(key, value) {
  var _this = this;

  if ((typeof key === 'undefined' ? 'undefined' : _typeof(key)) !== 'object') {
    this.queryState[key] = value;
  } else {
    Object.keys(key).forEach(function (prop) {
      _this.queryState[prop] = key[prop];
    });
  }

  if (typeof window !== 'undefined' && this.config.autoApply) {
    this.apply();
  }

  return this;
};