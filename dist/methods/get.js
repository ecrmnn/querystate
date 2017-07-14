'use strict';

module.exports = function get(key) {
  var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  if (this.queryState[key] !== undefined) {
    if (this.config.castsToArray && !Array.isArray(this.queryState[key])) {
      return [this.queryState[key]];
    }

    return this.queryState[key];
  }

  if (typeof defaultValue === 'function') {
    return defaultValue();
  }

  return defaultValue;
};