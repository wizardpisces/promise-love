var tools = {
    isFunction: function(value) {
        return typeof(value) == "function"
    }
}

function Promise(fn) {

    var tuples = [
        ['resolve', 'done', 'resolved'],
        ['reject', 'fail', 'rejected']

    ];

    var _doneFns = [],
        _failFns = [];

    var _reject = function() {

            if (promise.status == 'rejected') return;

            promise.status = 'rejected';

            var args = arguments;

            promise.preArgs = args;

            _failFns.forEach(function(fn) {
                fn.apply(promise, args);
            })
        },
        _resolve = function() {

            if (promise.status == 'resolved') return;

            promise.status = 'resolved';

            var args = arguments;

            promise.preArgs = args;

            _doneFns.forEach(function(fn) {
                fn.apply(promise, args);
            })

        };


    var promise = {

        status: 'pending',

        preArgs: [],//when resolved before then,keep args to use afterwards

        _reject: _reject,

        _resolve: _resolve,

        done: function(fn) {

            if (promise.status == 'pending') _doneFns.push(fn)

            else if (promise.status == 'resolved') fn.apply(promise, promise.preArgs);

            return promise;
        },


        fail: function(fn) {

            if (promise.status == 'pending') _failFns.push(fn)

            else if (promise.status == 'rejected') fn.apply(promise, promise.preArgs);

            return promise;
        },

        catch: function(fn) {
            promise.fail(fn);
        },

        then: function(doneFn, failFn) {
            var fns = arguments;
            return new Promise(function(resolve, reject) {
                var actions = arguments;
                tuples.forEach(function(tuple, i) {

                    function fnProxy(i, tuple) {

                        return function() {
                            try {

                                var ret = fns[i] && fns[i].apply(promise, promise.preArgs);
                                if (ret && ret.isPromise) {

                                    ret.done(resolve).fail(reject);

                                } else {

                                    actions[i](ret);

                                }

                            } catch (e) {
                                reject(e);
                            }

                        }
                    }

                    promise[tuple[1]](fnProxy(i, tuple))

                })

            });
        },

        isPromise: function() {

        }

    }

    if (fn) fn.apply(promise, [_resolve, _reject]);

    return promise;
}

Promise.race = function(fns) {

    var retPromsie = new Promise();

    for (var i = 0, len = fns.length; i < len; i++) {

        if (fns[i].isPromise) { //fn is promise

            fns[i].done(retPromsie._resolve);
            fns[i].fail(retPromsie._reject);

        } else { //return immediately

            return new Promise(function(resolve, reject) {

                var val = tools.isFunction(fns[i]) ? fns[i].call(this) : fns[i]
                resolve(val);

            })

        }

    }

    return retPromsie;
}

Promise.all = function(fns) {

    var retPromsie = new Promise();

    var len = fns.length;

    var count = 0;

    var doneAgs = [];


    var resolveFn = function(i, doneAgs) {

        return function(value) {

            doneAgs[i] = arguments.length > 1 ? slice.call(arguments) : value

            if (++count === len){

                retPromsie._resolve(doneAgs)

            } 

        }

    }

    for (var i = 0; i < len; i++) {
        if (fns[i].isPromise) { //fn is promise

            fns[i].done(resolveFn(i, doneAgs)).fail(retPromsie._reject);

        } else {

            doneAgs[i] = tools.isFunction(fns[i]) ? fns[i].call(this) : fns[i]
            count++;
        }
    }

    return retPromsie;
}

module.exports = Promise;
