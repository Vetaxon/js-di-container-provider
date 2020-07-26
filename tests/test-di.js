const assert = require('chai').assert;

const diException = require('./../diException');
const Di = require('./../di-instance');

describe('Di', function () {

    let di;

    beforeEach(() => {
        di = new Di();
    });

    describe('#setProvider()', function () {
        it ('should throw exception if wrong provide', function () {
            assert.throws(() => di.setProvider({}), diException, 'Provider must has method "provide"');
        });
        it ('should throw exception if duplicate provider alias', function () {
            di.setProvider({name: 'test', provide: () => {} });
            assert.throws(() => di.setProvider({name: 'test', provide: () => {} }), diException, 'Provider with alias test already exist');
        });

        it('should set provider', function () {
            const provider = {
                name: 'testProvider',
                provide: di => {
                    di.set('test_1', () => () => 'test_1');
                    di.set('test_2', () => () => 'test_2');
                }
            };

            di.setProvider(provider);
            assert.equal(di.getProviders().has('testProvider'), true);
        });

        it('should init providers during getting', function () {
            const provider = {
                name: 'testProvider',
                provide: di => {
                    di.set('test_1', () => () => 'test_1');
                    di.set('test_2', () => () => 'test_2');
                }
            };

            di.setProvider(provider);
            assert.equal(typeof di.get('test_1'), 'function');
            assert.equal(typeof di.get('test_2'), 'function');
        });
        it('should take provider alias from proto', function () {
            const ProviderTest = function () {
                this.provide =  di => {
                    di.set('test_1', () => () => 'test_1');
                }
            };

            di.setProvider(new ProviderTest());
            assert.equal(di.getProviders().has('ProviderTest'), true);
        });

        it('should skip init if provider inited', function () {
            const ProviderTest = function () {
                this.provide =  di => {
                    di.set('test_1', () => () => 'test_1');
                }
            };

            di.setProvider(new ProviderTest());
            di.get('test_1');

            const ProviderTest2 = function () {
                this.provide =  di => {
                    di.set('test_2', () => () => 'test_2');
                }
            };

            di.setProvider(new ProviderTest2());
            assert.equal(di.get('test_1')(), 'test_1');
            assert.equal(di.get('test_2')(), 'test_2');
        });
    });
});