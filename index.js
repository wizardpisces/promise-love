var tools = {
    isFunction : function(value){
        return typeof(value) == "function"
    }
}

function Promise(fn) {

    var tuples = [
        ['resolve','done','resolved'],
        ['reject','fail','rejected']
        
    ];

    var _doneFns = [],
        _failFns = [];

    var _reject = function(){

            if(promise.status == 'rejected') return;

            promise.status = 'rejected';

            var args = arguments;

            promise.args = args;

            _failFns.forEach(function(fn){
                fn.apply(promise,args);
            })
        },
        _resolve = function() {

            if(promise.status == 'resolved') return;

            promise.status = 'resolved';

            var args = arguments;

            promise.args = args;
           _doneFns.forEach(function(fn){
                fn.apply(promise,args);
            })

        };


    var promise = {

        status : 'pending',

        preArgs : [],

        _reject : _reject,

        _resolve : _resolve,

        done : function(fn){

            if(promise.status == 'pending')_doneFns.push(fn)

            else if(promise.status == 'resolved') promise.preArgs = fn.apply(promise,promise.preArgs);

            return promise;
        },


        fail : function(fn){

            if(promise.status == 'pending')_failFns.push(fn)

            else if(promise.status == 'rejected') promise.preArgs = fn.apply(promise,promise.preArgs);

            return promise;
        },

        catch : function(fn){
            promise.fail(fn);
        },

        then: function(doneFn, failFn) {
            var fns = arguments;
        	return new Promise(function(resolve,reject){
                var actions = arguments;
                tuples.forEach(function(tuple,i){

                    function fnProxy(i,tuple){

                        return function(){
                            try{

                                var ret = fns[i] && fns[i].apply(promise,promise.args);
                                if (ret && ret.isPromise) {

                                    ret['done'](resolve);
                                    ret['fail'](reject);

                                }else{

                                    actions[i](ret);

                                }

                            }catch(e){
                                reject(e);
                            }

                        }
                    }

                    promise[tuple[1]](fnProxy(i,tuple))

                })

            });
        },

        isPromise : function(){

        }

    }



    if(fn) fn.apply(promise,[_resolve,_reject]);

    // for(var i in promise) this[i] = promise[i];

    return promise;
}

Promise.race = function(fns){

    var retPromsie = new Promise();

    for(var i=0,len=fns.length;i<len;i++){

        if (fns[i].isPromise) {//fn is promise

            fns[i].done(retPromsie._resolve);
            fns[i].fail(retPromsie._reject);

        }else{//return immediately

            return new Promise(function(resolve,reject){

                var val = tools.isFunction(fns[i]) ? fns[i].call(this) : fns[i]
                resolve( val ); 

            })

        }

    }

    return retPromsie;
}

module.exports = Promise;

