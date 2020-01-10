'use strict';

const expect = require('chai').expect;
const it = require('mocha').it;
const describe = require('mocha').describe;
const QueryState = require('../dist');

describe('Parsing', () => {
  it('should return an empty object when initialized without a value', () => {
    expect(QueryState().all()).to.eql({});
  });


  it('should return parsed the parsed query string of window when window is available', () => {
    global.window = {
      location: {
        pathname: '/yolo',
        search: '?rainbow=unicorn',
      },
      history: {
        pushState(x, y, pathname) {
          this.parent.location.pathname = pathname;
        },
      },
    };

    expect(QueryState().all()).to.eql({ rainbow: 'unicorn' });

    delete global.window;
  });

  it('should be able to parse query string within fully qualified URL', () => {
    expect(QueryState('https://rainbow.xyz/report/time?fromDate=01.04.2017&toDate=04.04.2017').all()).to.eql({
      fromDate: '01.04.2017',
      toDate: '04.04.2017',
    });
  });

  it('should be able to parse query string without fully qualified URL', () => {
    expect(QueryState('?fromDate=01.04.2017&toDate=04.04.2017').all()).to.eql({
      fromDate: '01.04.2017',
      toDate: '04.04.2017',
    });
  });

  it('should be able to parse spaces', () => {
    expect(QueryState('a%20%20b%20c%20%20%20=%20kek').all()).to.eql({ 'a  b c   ': ' kek' });
  });

  it('should be able to parse query string without ? prefix', () => {
    expect(QueryState('foo=bar').all()).to.eql({ foo: 'bar' });

    expect(QueryState('foo=bar&abc=xyz').all()).to.eql({
      foo: 'bar',
      abc: 'xyz',
    });
  });

  it('should return overwrite existing keys when passed as separate parameters', () => {
    expect(QueryState('foo=bar&abc=xyz&abc=123').all()).to.eql({
      foo: 'bar',
      abc: '123',
    });
  });

  it('should return convert comma separated values to an array', () => {
    expect(QueryState('foo=bar&abc=xyz,123').all()).to.eql({
      foo: 'bar',
      abc: ['xyz', '123'],
    });
  });

  it('should be able to parse empty value', () => {
    expect(QueryState('foo').all()).to.eql({
      foo: null,
    });
  });
});

describe('Retrieving params', () => {
  it('should return the value when passed an existing key', () => {
    expect(QueryState('foo=bar&abc=xyz,123').get('foo')).to.eql('bar');
  });

  it('should return null when passed an non-existing key', () => {
    expect(QueryState('foo=bar&abc=xyz,123').get('xoxo')).to.eql(null);
  });

  it('should return default value when passed an non-existing key and default is provided', () => {
    expect(QueryState('foo=bar&abc=xyz,123').get('xoxo', 0)).to.eql(0);
    expect(QueryState('foo=bar&abc=xyz,123').get('xoxo', 'xxx')).to.eql('xxx');
    expect(QueryState('foo=bar&abc=xyz,123').get('xoxo', 999)).to.eql(999);
    expect(QueryState('foo=bar&abc=xyz,123').get('xoxo', () => 999)).to.eql(999);
    expect(QueryState('foo=bar&abc=xyz,123').get('xoxo', () => 1 + 2 + 3 + 4)).to.eql(10);
  });
});

describe('Setting params', () => {
  it('should set the value on the key', () => {
    expect(QueryState().set('name', 'Daniel').all()).to.eql({ name: 'Daniel' });
    expect(QueryState('foo=bar').set(5, 5).all()).to.eql({ foo: 'bar', 5: 5 });
  });

  it('should set the value to an array on the key', () => {
    expect(QueryState().set('number', [1, 2, 3, 4]).all()).to.eql({ number: [1, 2, 3, 4] });
  });
});

describe('Deleting params', () => {
  it('should delete the value on the key', () => {
    expect(QueryState().remove('name').all()).to.eql({});
    expect(QueryState().set('name', 'Daniel').remove('name').all()).to.eql({});

    const state = QueryState('foo=bar');
    state.set('name', 'Daniel');
    state.remove('foo');

    expect(state.all()).to.eql({ name: 'Daniel' });
  });
});

describe('Convert to query string', () => {
  it('should return the state as a query string', () => {
    expect(QueryState('foo=bar').set('name', 'Daniel').toQueryString()).to.eql('?foo=bar&name=Daniel');
    expect(QueryState().set('name', 'Daniel').set('x', '12').remove('x').toQueryString()).to.eql('?name=Daniel');
    expect(QueryState().set(4, 2).toQueryString()).to.eql('?4=2');
    expect(QueryState().set('name', 'Daniel Eckermann').toQueryString()).to.eql('?name=Daniel%20Eckermann');
    expect(QueryState('foo=bar').set('f o o', 'b  a r_x ').toQueryString()).to.eql('?foo=bar&f%20o%20o=b%20%20a%20r_x%20');
    expect(QueryState('a=b').set({ c: 'd', 6: 6, '<': '00' }).toQueryString()).to.eql('?6=6&a=b&c=d&%3C=00');
  });

  it('should not encode commas', () => {
    expect(QueryState().set('lang', ['a', 'b', 'c']).toQueryString()).to.eql('?lang=a,b,c');
  });
});

describe('Auto applied state', () => {
  it('changed the state should automatically be applied', () => {
    global.window = {
      location: {
        search: '?rainbow=unicorn',
      },
      history: {
        pushState(x, y, newQueryString) {
          global.window.location.search = newQueryString;
        },
      },
    };

    QueryState().set('magic', true);
    expect(global.window.location.search).to.eql('?rainbow=unicorn&magic=true');

    QueryState().remove('rainbow');
    expect(global.window.location.search).to.eql('?magic=true');

    delete global.window;
  });
});

describe('Push state query string', () => {
  it('should return the state as a query string', () => {
    global.window = {
      location: {
        search: '?rainbow=unicorn',
      },
      history: {
        pushState(x, y, newQueryString) {
          global.window.location.search = newQueryString;
        },
      },
    };

    QueryState({ autoApply: false }).set('language', 'javascript');
    expect(global.window.location.search).to.eql('?rainbow=unicorn');

    QueryState().set('magic', true).apply();
    expect(global.window.location.search).to.eql('?rainbow=unicorn&magic=true');

    QueryState().remove('rainbow').apply();
    expect(global.window.location.search).to.eql('?magic=true');
  });
});

describe('Config: Casts to array', () => {
  it('should always return as array', () => {
    expect(QueryState('foo=bar&abc=xyz,123', { castsToArray: true }).get('foo')).to.eql(['bar']);
    expect(QueryState('foo=bar&abc=xyz,123', { castsToArray: true }).all()).to.eql({
      foo: ['bar'],
      abc: ['xyz', '123'],
    });
  });

  it('should always return as array, but not defaults', () => {
    expect(QueryState('foo=bar&abc=xyz,123', { castsToArray: true }).get('xoxo')).to.eql(null);
    expect(QueryState('foo=bar&abc=xyz,123', { castsToArray: true }).get('xoxo', 0)).to.eql(0);
  });
});
