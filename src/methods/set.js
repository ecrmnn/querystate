'use strict';

module.exports = function set(key, value) {
  if (typeof key !== 'object') {
    this.queryState[key] = value;
  } else {
    Object.keys(key).forEach((prop) => {
      this.queryState[prop] = key[prop];
    });
  }

  if (typeof window !== 'undefined' && this.config.autoApply) {
    this.apply();
  }

  return this;
};
