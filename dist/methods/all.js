'use strict';

module.exports = function all() {
  var _this = this;

  var state = {};

  Object.keys(this.queryState).forEach(function (key) {
    state[key] = _this.get(key);
  });

  return state;
};