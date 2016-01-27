## Regarding Issues

tool to access an obj and return a new one which share the common part

## Installation

[Use npm.](https://docs.npmjs.com/cli/install)

```
npm install --save-dev immutable-obj
```

## API

```javascript
var update = require('immutable-obj');
/*
obj // {}
path //array which define a scope for the changing part,the rest will be shared
value //if path exist alter the path value  else create the path then define the value
*/
var newObj = update(obj,path,value);
```

#usage
```javascript

var a = {
    province: {
        address: {
            zone: 'A',
            info : {
                lastName : 'ze'
            }
        }
    },
    c: {
        x: [1,2,3],
        y: [1,2,3,4]
    }
};

var b = update(a, ['province','address','zone'], 'B');

console.log('a',a,'\n' ,'b',b,'\n', b.province.address.info === a.province.address.info);

var c = update(a, 'province.address.zone', 'C');

console.log('a',a,'\n' ,'c',c,'\n');

var d = update(a, ['c','y',1], 10);

console.log('a',a,'\n' ,'b',d,'\n', a.c.x == d.c.x , a.c.y , d.c.y);

var e = update(a, ['c','d'], 2);

console.log('a',a,'\n' ,'b',e,'\n', a.d , e.d);

```