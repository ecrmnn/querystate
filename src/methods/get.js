'use strict';

module.exports = function get(key, defaultValue = null) {
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
