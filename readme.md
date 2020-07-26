# Light-weight and power di for nodejs with various providers

## Install
```
npm i js-di-container-provider
```

### Example
```
const {Provider, Di} = require('js-di-container-provider');

const di = new Di();
di.set('test', () => () => console.log('test'));
di.get('test')();
$ test
di.replace('test', () => () => console.log('new test'))
di.get('test')();
$ new test
```

### Singleton

```
di.set('date', () => new Date(), true);
console.log(di.get('date'))
setTimeout(() => {
    console.log(di.get('date'));
}, 1000);

$ 2020-07-26T11:57:49.298Z
$ 2020-07-26T11:57:49.298Z
```

### Dependency injection
```
class Foo {
    constructor(date) {
        this.date = date;
    }
    getDate () {
        return this.date;
    }
}
di.set('foo', di =>  new Foo(di.get('date')), true);
console.log(di.get('foo').getDate());
$ 2020-07-26T11:57:49.298Z

```

### Provider
```
class FooProvider extends Provider {

    provide (di) {
        super.provide(di);
        di.set('testprovider', function (di) {
            return function () {
                console.log(di.get('foo').getDate());
            }
        });
    }
}

di.setProvider(new FooProvider());
di.get('testprovider')();
$ 2020-07-26T11:57:49.298Z

class FooProvider extends Provider {

    name = 'ORIGINAL_NAME_OF_PROVIDER';
    provide (di) {
        super.provide(di);
        di.set('testprovider', function (di) {
            return function () {
                console.log(di.get('foo').getDate());
            }
        });
    }
}
```

### Test (100% covered)
```
    npm run test
```

