'use strict';

function QueryState(queryString, config) {
  let userConfig = config;
  this.queryState = {};
  this.config = { autoApply: true };

  let q = queryString;

  if (typeof q === 'object') {
    userConfig = q;
    q = undefined;
  }

  if (q === undefined && typeof window !== 'undefined') {
    q = window.location.search;
  }

  if (userConfig !== undefined) {
    Object.keys(userConfig).forEach((key) => {
      this.config[key] = userConfig[key];
    });
  }

  if (q !== undefined) {
    let string = q;

    if (q.indexOf('?') !== -1) {
      string = q.split('?')[1];
    }

    const params = string.split('&');

    params.forEach((param) => {
      const [key, value] = param.split('=').map(decodeURIComponent);
      const arrayValue = value.split(',');

      if (arrayValue.length !== 1) {
        this.queryState[key] = arrayValue;
      } else {
        this.queryState[key] = value;
      }
    });
  }
}

QueryState.prototype.get = require('./methods/get');
QueryState.prototype.set = require('./methods/set');
QueryState.prototype.remove = require('./methods/remove');
QueryState.prototype.all = require('./methods/all');
QueryState.prototype.apply = require('./methods/apply');
QueryState.prototype.toQueryString = require('./methods/toQueryString');

module.exports = (queryString, config) => new QueryState(queryString, config);
