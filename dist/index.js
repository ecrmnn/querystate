'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function QueryState(queryString, config) {
  var _this = this;

  var userConfig = config;
  this.queryState = {};
  this.config = { autoApply: true };

  var q = queryString;

  if ((typeof q === 'undefined' ? 'undefined' : _typeof(q)) === 'object') {
    userConfig = q;
    q = undefined;
  }

  if (q === undefined && typeof window !== 'undefined') {
    q = window.location.search;
  }

  if (userConfig !== undefined) {
    Object.keys(userConfig).forEach(function (key) {
      _this.config[key] = userConfig[key];
    });
  }

  if (q !== undefined) {
    var string = q;

    if (q.indexOf('?') !== -1) {
      string = q.split('?')[1];
    }

    var params = string.split('&');

    if (params[0].length) {
      params.forEach(function (param) {
        var _param$split$map = param.split('=').map(decodeURIComponent),
            _param$split$map2 = _slicedToArray(_param$split$map, 2),
            key = _param$split$map2[0],
            value = _param$split$map2[1];

        var arrayValue = value.split(',');

        if (arrayValue.length !== 1) {
          _this.queryState[key] = arrayValue;
        } else {
          _this.queryState[key] = value;
        }
      });
    }
  }
}

QueryState.prototype.get = require('./methods/get');
QueryState.prototype.set = require('./methods/set');
QueryState.prototype.remove = require('./methods/remove');
QueryState.prototype.all = require('./methods/all');
QueryState.prototype.apply = require('./methods/apply');
QueryState.prototype.toQueryString = require('./methods/toQueryString');

module.exports = function (queryString, config) {
  return new QueryState(queryString, config);
};