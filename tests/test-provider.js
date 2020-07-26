const sinon = require('sinon');

const Provider = require('./../provider');

describe('Provider', function () {

    const callback = () => () => {};

    class TestProvider extends Provider {
        provide(di) {
            super.provide(di);
            di.set('test', callback);
            di.set('test_2', callback);
        }
    }

    const provider = new TestProvider();

    describe('#provide()', function () {
        it('should set to di', function () {
            const di = { set: function (alias, callback, isSingleton = false) {} };
            const mock = sinon.mock(di);
            mock.expects("set")
                .withArgs('test', callback);
            mock.expects("set")
                .withArgs('test_2', callback);
            provider.provide(di);
            mock.verify();
        });
    });
});