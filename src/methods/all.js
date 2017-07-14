'use strict';

module.exports = function all() {
  const state = {};

  Object.keys(this.queryState).forEach((key) => {
    state[key] = this.get(key);
  });

  return state;
};
