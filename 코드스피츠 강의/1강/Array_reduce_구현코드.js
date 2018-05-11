/*
  ES6의 reduce 코드
  출처: MDN
*/
Array.prototype.reduce = function (callback /*, initialValue*/) {
    'use strict';
    if (this == null) {
        throw new TypeError('Array.prototype.reduce called on null or undefined');
    }
    if (typeof callback !== 'function') {
        throw new TypeError(callback + ' is not a function');
    }
    var target = Object(this), len = target.length >>> 0, key = 0, value;
    if (arguments.length == 2) {
        value = arguments[1];
    } else {
        while (key < len && !(key in target)) {
            key++;
        }
        if (key >= len) {
            throw new TypeError('Reduce of empty array with no initial value');
        }
        value = target[key++];
    }
    for (; key < len; key++) {
        if (key in target) {
            value = callback(value, target[key], key, target);
        }
    }
    return value;
};