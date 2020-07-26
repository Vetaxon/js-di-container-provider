const DiException = require('./diException');
const BaseDi = require('./base-di');
const Provider = require('./provider');

class Di extends BaseDi {

    constructor() {
        super();
        this._providers = new Map();
        this._initializedProviders = new Map();
        this._isProvidersInites = true;
    }

    get(alias) {
        this._initializeProviders();
        return super.get(alias);
    }

    /**
     * @param {Provider} provider
     * @return {void}
     */
    setProvider (provider) {

        if (typeof provider.provide !== 'function') {
            throw new DiException('Provider must has method "provide"');
        }

        const alias = provider.name || provider.constructor.name;

        if (this._providers.has(alias)) {
            throw new DiException(`Provider with alias ${alias} already exist`);
        }

        this._providers.set(alias, provider.provide);
        this._isProvidersInites = false;
    }

    /**
     * @return {Map}
     */
    getProviders () {
        return this._providers;
    }


    /**
     * @return {void}
     */
    _initializeProviders() {

        if (this._isProvidersInites) {
            return;
        }

        this._providers.forEach((provide, alias) => {
            if (!this._initializedProviders.has(alias)) {
                provide(this);
                this._initializedProviders.set(alias, provide);
            }
        });

        this._isProvidersInites = true;
    }
}

module.exports = Di;