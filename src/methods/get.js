'use strict';

module.exports = function get(key, defaultValue = null) {
  if (this.queryState[key] !== undefined) {
    return this.queryState[key];
  }

  if (typeof defaultValue === 'function') {
    return defaultValue();
  }

  return defaultValue;
};
