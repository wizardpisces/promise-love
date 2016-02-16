## Regarding Issues

Simple implementation(frequently used methods) of CommonJS Promises/A.

## Installation

[Use npm.](https://docs.npmjs.com/cli/install)

```
npm install --save-dev promise-love
```

## API

then
done
fail
catch
all
race

##usage

refer to promise api

##example

```
// example

var p1 = new Promise(function (resolve, reject) {

        console.log('start promise1');

        global.setTimeout(function () {
            resolve(1)
        }, 2000);
    });


    p1.then(function (val) {

        console.log(val,'resolved 1');

        var p2 = new Promise(function (resolve, reject) {

                console.log('start promise2');
                 // throw Error('My Error !')

                global.setTimeout(function () {
                    reject(2)
                }, 2000);
            });

        return p2;

    },function(val){

        console.log('rejected promise1')

    }).then(function(val){

        console.log(val,'resolved promise2')
        return val;

    },function(val){

        console.log(val,'rejected promise2')
         return false

    }).then(function(val){
        console.log(val,'passed arguments')
    },function(val){
        console.log(val)
    });

var p2 = new Promise(function (resolve, reject) {

        console.log('start promise2');

        global.setTimeout(function () {
            resolve(1000)
        }, 1000);
    });

var p3 = new Promise(function (resolve, reject) {

        console.log('start promise3');

        global.setTimeout(function () {
            resolve(3000)
        }, 3000);
    });

Promise.race([p2,p3,function(){return 2}]).then(function(val){

    console.log(val)

},function(val){
    console.log(val)
})

Promise.all([p2,p3,function(){return 2}]).then(function(val){

    console.log(val)

},function(val){
    console.log(val)
})

```