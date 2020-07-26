const assert = require('chai').assert;

const BaseDi = require('../src/base-di');
const diException = require('../src/diException');

describe('BaseDi', function () {
    const baseDi = new BaseDi();
    describe('#set()', function () {
        it('should throw exception if alias is empty', function () {
            assert.throws(() => baseDi.set('', () => {}), diException, 'Alias must be string.');
        });
        it('should throw exception if alias is already exists', function () {
            baseDi.set('test', () => {});
            assert.throws(() => baseDi.set('test', () => {}), diException, 'Entity with name test has already set. Use original aliases.');
        });
        it('should set and return callback', function () {
            const callback = () => 'test';
            baseDi.set('foo', () => callback);
            assert.equal(callback.toString(), baseDi.get('foo').toString());
        });
        it('should return singleton if set', function () {
            baseDi.set('date', () => new Date(), true);
            const date_1 = baseDi.get('date');
            const date_2 = baseDi.get('date');
            assert.equal(date_1.toString(), date_2.toString());
        });
        it('should return different instances', function () {
            baseDi.set('date_unique', () => new Date(), false);
            const date_1 = baseDi.get('date_unique');
            setTimeout(() => {
                const date_2 = baseDi.get('date_unique');
                assert.equal(date_1 === date_2, false);
            }, 1);
        });
    });
    describe('#get()', function () {
        it('should throw exception if alias not exists', function () {
            assert.throws(() => baseDi.get(''), diException, 'Alias must be string.');
            assert.throws(() => baseDi.get('not_exist'), diException, 'Entity with name not_exist not found.');
        });
    });
    describe('#delete()', function () {
        it('should throw exception if alias is deleted', function () {
            baseDi.delete('date_unique');
            assert.throws(() => baseDi.get('date_unique'), diException, 'Entity with name date_unique not found.');
        });
    });
    describe('#getInstances()', function () {
        it('should return map of instances', function () {
            const instances = baseDi.getInstances();
            assert.equal(instances.has('test'), true);
            assert.equal(instances.has('foo'), true);
            assert.equal(instances.has('date'), true);
        });
    });
    describe('#replace()', function () {
        it('should throw if wrong alias', function () {
            assert.throws(() => baseDi.replace(''), diException, 'Alias must be string.');
        });
    });
    describe('#replace()', function () {
        it('should throw if alias not exists', function () {
            assert.throws(() => baseDi.replace('some_not_exists'), diException, 'Entity with name "some_not_exists" not found. Nothing to replace.');
        });
    });
    describe('#replace()', function () {
        it('should replace', function () {
            const date = new Date();
            baseDi.replace('date', () => new Date());
            baseDi.get('date');
            assert.equal(baseDi.get('date').toString(), date.toString());
        });
    });
});