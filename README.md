# querystate
> Simple and dependency free query string state management

[![travis](https://img.shields.io/travis/ecrmnn/querystate/master.svg?style=flat-square)](https://travis-ci.org/ecrmnn/querystate/builds)
[![npm version](https://img.shields.io/npm/v/querystate.svg?style=flat-square)](http://badge.fury.io/js/querystate)
[![npm downloads](https://img.shields.io/npm/dm/querystate.svg?style=flat-square)](http://badge.fury.io/js/querystate)
[![npm license](https://img.shields.io/npm/l/querystate.svg?style=flat-square)](http://badge.fury.io/js/querystate)
[![prs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![eslint](https://img.shields.io/badge/code_style-airbnb-blue.svg?style=flat-square)](https://github.com/airbnb/javascript)

### Installation
```bash
npm install querystate --save
```

### Usage

#### ``all()``
Get all parameters in the query string
```js
// URL: xo.com/?rainbow=awesome&colors=red,blue,green

const state = require('querystate')();

state.all();

//=> {
//=>   rainbow: 'awesome',
//=>   colors: [
//=>     'red',
//=>     'blue',
//=>     'green',
//=>   ]
//=> }
```

#### ``get(key, [default = null])``
Get a value from the query string by key, or a provided default.
```js
// URL: xo.com/?rainbow=awesome&colors=red,blue,green

const state = require('querystate')();

state.get('colors');
//=> ['red', 'blue', 'green']

state.get('pony');
//=> null

state.get('wizard', 'Merlin');
//=> Merlin

state.get('wizard', () => 1 + 2 + 3 + 4);
//=> 10
```

#### ``set(key, value)``
Set a key and value pair in to the query string
*``set()`` will by default update the actual URL when called. This can be avoided using a config [Disable auto applying](#config)**
```js
// URL: xo.com/?a=b

const state = require('querystate')();

state.set('c', 'd');
// URL: xo.com/?a=b&c=d

state.all();

//=> {
//=>   a: 'b',
//=>   c: 'd',
//=> }
```

#### ``remove(key)``
Remove a key and value pair in to the query string
*``remove()`` will by default update the actual URL when called. This can be avoided using a config. [Disable auto applying](#config)*
```js
// URL: xo.com/?a=b&c=d

const state = require('querystate')();

state.remove('c');
// URL: xo.com/?a=b

state.all();

//=> {
//=>   a: 'b',
//=> }
```

#### ``toQueryString()``
If you want the current state as a simple query string, you can call this method
```js
// URL: xo.com/?a=b

const state = require('querystate')();

state.set('c', 'd');

state.toQueryString();
//=> ?a=b&c=d
```

### Config
If you want to disable auto applying state when using ``set()`` and ``remove()``, you may pass a config to ``querystate``
```js
// Using [window.location.search] as default state
const state = require('querystate')({ autoApply: false });

// Custom state
const state = require('querystate')state('?foo=bar', { autoApply: false });
```

When setting ``autoApply`` to ``false`` you need to explicitly tell ``querystate`` to update after a change.
```js
// URL: xo.com/?a=b&c=d

const state = require('querystate')({ autoApply: false });

state.remove('c');
// URL: xo.com/?a=b&c=d

state.apply();
// URL: xo.com/?a=b
```

### License
MIT © [Daniel Eckermann](http://danieleckermann.com)
