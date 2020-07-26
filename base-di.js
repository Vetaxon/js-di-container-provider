const DiException = require('./diException');

class BaseDi {

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
            throw new DiException('Alias must be string.');
        }

        if (this._instances.has(alias)) {
            throw new DiException(`Entity with name ${alias} has already set. Use original aliases.`);
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
            throw new DiException('Alias must be string.');
        }

        if (!this._instances.has(alias)) {
            throw new DiException(`Entity with name ${alias} not found.`);
        }

        const instance = this._instances.get(alias);

        if (!instance.isSingleton) {
            return instance.callback(this);
        }

        if (instance.entity) {
            return instance.entity;
        }

        instance.entity = instance.callback(this);

        return instance.entity;
    }

    /**
     * @param {string} alias
     * @param {function} callback
     * @param {boolean} isSingleton
     * @return void
     */
    replace (alias, callback, isSingleton = true) {

        if (typeof alias !== 'string' || !alias.length) {
            throw new DiException('Alias must be string.');
        }

        if (!this._instances.has(alias)) {
            throw new DiException(`Entity with name "${alias}" not found. Nothing to replace.`);
        }

        this.delete(alias);

        this.set(alias, callback, isSingleton);
    }

    /**
     * @param {string} alias
     * @return boolean
     */
    delete (alias) {
        return this._instances.delete(alias);
    }

    /**
     * @return {Map}
     */
    getInstances() {
        return this._instances;
    }
}

module.exports = BaseDi;