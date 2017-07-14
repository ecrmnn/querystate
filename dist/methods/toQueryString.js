'use strict';

module.exports = function toQueryString() {
  var _this = this;

  var params = Object.keys(this.queryState).map(function (key) {
    var value = _this.queryState[key];

    if (Array.isArray(value)) {
      return encodeURIComponent(key) + '=' + encodeURIComponent(value.join(','));
    }

    return encodeURIComponent(key) + '=' + encodeURIComponent(value);
  });

  if (params.length) {
    return '?' + params.join('&');
  }

  return '';
};