const DiException = require('./diException');

class Provider {

    constructor() {
        this._instances = new Map();
    }

    /**
     * @param {string} alias
     * @param {function} callback
     * @param {boolean} isSingleton
     * @return void
     */
    set (alias, callback, isSingleton = true) {

        if (typeof alias !== 'string' || !alias.length) {
            throw new DiException('Alias must me string.');
        }

        if (this._instances.has(alias)) {
            throw new DiException(`Entity with name "${alias}" has already set. Use original aliases.`);
        }

        this._instances.set(alias, {
            isSingleton: isSingleton,
            callback: callback,
            entity: null
        });
    }

    /**
     * @param {string} alias
     * @return {function, object}
     */
    get (alias) {
        if (typeof alias !== 'string' || !alias.length) {
            throw new DiException('Alias must me string.');
        }

        if (!this._instances.has(alias)) {
            throw new DiException(`Entity with name ${alias} not found.`);
        }

        const instance = this._instances.get(alias);

        if (instance.isSingleton && instance.entity) {
            return instance.entity;
        }

        if (!instance.entity) {
            instance.entity = instance.callback(this);
            return instance.entity;
        }

        return instance.entity;
    }

    /**
     * @return {Map}
     */
    getInstances() {
        return this._instances;
    }
}

module.exports = Provider;