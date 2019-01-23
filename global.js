/**
 * Created by yinchong on 2018/6/14
 */

global.Buffer = require('buffer').Buffer;
global.process = require('process');

if (typeof btoa === 'undefined') {
  global.btoa = function (str) {
    return new Buffer(str, 'binary').toString('base64');
  };
}

if (typeof atob === 'undefined') {
  global.atob = function (b64Encoded) {
    return new Buffer(b64Encoded, 'base64').toString('binary');
  };
}

if (require('react-native').Platform.OS === 'android' && typeof Symbol === 'undefined') {
  global.Symbol = require('core-js/es6/symbol');
  require('core-js/fn/symbol/iterator');
  require('core-js/fn/map');
  require('core-js/fn/set');
  require('core-js/fn/array/find');
}

Object.setPrototypeOf = Object.setPrototypeOf || function (obj, proto) {
  obj.__proto__ = proto;
  return obj;
};
