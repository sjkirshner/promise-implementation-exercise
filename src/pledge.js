'use strict';
/*----------------------------------------------------------------
Promises Workshop: build the pledge.js ES6-style promise library
----------------------------------------------------------------*/
// YOUR CODE HERE:

function $Promise(executor) {

  if (typeof executor !== 'function') throw new TypeError('Type error: Promise constructor invoked with no executor function.');

  this._state = 'pending';
  this._value = undefined;
  this._internalResolve = (value) => {
    if (this._state === 'pending') {
      this._state = 'fulfilled';
      this._value = value;
    }
    // console.log('I am "this":', this);
    this._callHandlers()
  }
  this._internalReject = (reason) => {
    if (this._state === 'pending') {
      this._state = 'rejected';
      this._value = reason;
    }
    this._callHandlers();
  }
  this._callHandlers = () => {
    while (this._handlerGroups.length) {
      let cb = this._handlerGroups.shift()
      if (this._state === 'fulfilled') {
        cb.successCb(this._value);
      } else {
        cb.errorCb(this._value);
      }
    }
  }

  this._handlerGroups = [];

  this.then = (onSuccess, onReject) => {
    if (typeof onSuccess !== 'function') onSuccess = null;
    if (typeof onReject !== 'function') onReject = null;
    this._handlerGroups.push({ successCb: onSuccess, errorCb: onReject });
    if (this._state === 'fulfilled') {
      this._callHandlers();
    }
  }

  const resolve = this._internalResolve.bind(this);
  const reject = this._internalReject.bind(this);
  executor(resolve, reject);

}

// const promisedValue = new Promise(function (resolve, reject) {
//   someAsynOperation('some argument', function (err, result) {
//     if (err) reject(err);
//     else resolve(result);
//   })
// })





/*-------------------------------------------------------
The spec was designed to work with Test'Em, so we don't
actually use module.exports. But here it is for reference:

module.exports = $Promise;

So in a Node-based project we could write things like this:

var Promise = require('pledge');
…
var promise = new Promise(function (resolve, reject) { … });
--------------------------------------------------------*/
