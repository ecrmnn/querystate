'use strict';

module.exports = function apply() {
  window.history.pushState(null, null, this.toQueryString());
};
