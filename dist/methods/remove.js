'use strict';

module.exports = function remove(key) {
  if (this.queryState[key] !== undefined) {
    delete this.queryState[key];
  }

  if (typeof window !== 'undefined' && this.config.autoApply) {
    this.apply();
  }

  return this;
};