'use strict';

module.exports = function toQueryString() {
  const params = Object.keys(this.queryState).map((key) => {
    const value = this.queryState[key];

    if (Array.isArray(value)) {
      return `${encodeURIComponent(key)}=${encodeURIComponent(value.join(','))}`;
    }

    return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
  });

  return `?${params.join('&')}`;
};
