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

    var doneFns = [],
        failFns = [];

    var promise = {

        status : 'pending',

        preArgs : [],

        done : function(fn){

            if(promise.status == 'pending') doneFns.push(fn)

            else if(promise.status == 'resolved') promise.preArgs = fn.apply(promise,promise.preArgs);

            return promise;
        },


        fail : function(fn){

            if(promise.status == 'pending') doneFns.push(fn)

            else if(promise.status == 'rejected') promise.preArgs = fn.apply(promise,promise.preArgs);

            failFns.push(fn)
            return promise;
        },

        catch : function(fn){
            // promise.then(,)
            promise.fail(fn);
        },



    	reject : function(){

            if(promise.status == 'rejected') return;

            promise.status = 'rejected';

            var args = arguments;

            promise.args = args;

        	failFns.forEach(function(fn){
        		fn.apply(promise,args);
        	})
    	},

        resolve: function() {

            if(promise.status == 'resolved') return;

            promise.status = 'resolved';

            var args = arguments;

            promise.args = args;

        	doneFns.forEach(function(fn){
        		fn.apply(promise,args);
        	})

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



    if(fn) fn.apply(promise,[promise.resolve,promise.reject]);

    // for(var i in promise) this[i] = promise[i];

    return promise;
}

Promise.race = function(fns){

    var retPromsie = new Promise();

    for(var i=0,len=fns.length;i<len;i++){

        if (fns[i].isPromise) {//fn is promise

            fns[i].done(retPromsie.resolve);
            fns[i].fail(retPromsie.reject);

        }else{//return immediately

            return new Promise(function(resolve,reject){

                var val = tools.isFunction(fns[i]) ? fns[i].call(this) : fns[i]
                // this.isPromise = 'haha'
                resolve( val ); 

            })

        }

    }

    return retPromsie;
}

module.exports = Promise;
//example
// var p1 = new Promise(function (resolve, reject) {

//         console.log('start promise');

//         // global.setTimeout(function () {
//             resolve(1)
//         // }, 2000);
//     });


//     p1.then(function (val) {

//         console.log(val,'resolved 1');
//         return val;

//     }).then(function(val){

//         var p2 = new Promise(function (resolve, reject) {

//                 console.log('start promise2');
//                  // throw Error('My Error !')

//                 global.setTimeout(function () {
//                     reject(2)
//                 }, 2000);
//             });

//         return p2;

//     },function(val){

//         console.log('rejected promise1')

//     }).then(function(val){

//         console.log(val,'resolved promise2')
//         return val;

//     },function(val){

//         console.log(val,'rejected promise2')
//          return false

//     }).then(function(val){
//         console.log(val,'passed arguments')
//     },function(val){
//         console.log(val)
//     });

// var p2 = new Promise(function (resolve, reject) {

//         console.log('start promise2');

//         global.setTimeout(function () {
//             resolve(4000)
//         }, 4000);
//     });
// var p3 = new Promise(function (resolve, reject) {

//         console.log('start promise3');

//         global.setTimeout(function () {
//             resolve(3000)
//         }, 3000);
//     });

// // console.log(Promise.prototype)
// console.log(Promise.race([p2,p3,1]))
// Promise.race([p2,p3,function(){return 2}]).then(function(val){

//     console.log(val)

// },function(val){
//     console.log(val)
// })

