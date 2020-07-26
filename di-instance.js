const DiException = require('./diException');
const Provider = require('./provider');

class Di extends Provider {

    /**
     * @param {string} alias
     * @param {function} callback
     * @param {boolean} isSingleton
     * @return void
     */
    replace(alias, callback, isSingleton = true) {

        if (typeof alias !== 'string' || !alias.length) {
            throw new DiException('Alias must me string.');
        }

        if (!this._instances.has(alias)) {
            throw new DiException(`Entity with name "${alias}" not found. Nothing to replace.`);
        }

        this._instances.delete(alias);

        this._instances.set(alias, {
            isSingleton: isSingleton,
            callback: callback,
            entity: null
        });
    }


    /**
     * @param {Provider} provider
     */
    setProvider(provider) {
        provider.getInstances().forEach((instance, key) => {
            this.set(key, instance.callback, instance.isSingleton);
        });
    }
}

module.exports = Di;