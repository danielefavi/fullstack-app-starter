/**
 * Service container to register and retrieve dependencies.
 */
export class AppServiceContainer {

  /**
   * Singleton instance of the AppServiceContainer.
   *
   * @type {AppServiceContainer | null}
   */
  static instance = null;

  /**
   * Initializes a new instance of the AppServiceContainer.
   */
  constructor() {
    if (AppServiceContainer.instance) {
      return AppServiceContainer.instance;
    }

    this.factories = {};
    this.services = {};
    
    AppServiceContainer.instance = this;
  }

  /**
   * Registers a dependency to be lazy-loaded.
   *
   * @param {string} name - The name of the service.
   * @param {Function} callback - The callback that initializes the service.
   * @throws {Error} Throws an error if the name or callback is invalid.
   */
  register(name, callback) {
    if (typeof name !== 'string' || typeof callback !== 'function') {
      throw new Error('Invalid parameters. `name` should be a string and `callback` should be a function.');
    }
    this.factories[name] = callback;
  }

  /**
   * Sets a dependency instance immediately.
   *
   * @param {string} name - The name of the service.
   * @param {any} dependency - The instance of the service.
   * @throws {Error} Throws an error if the name is not a string.
   */
  set(name, dependency) {
    if (typeof name !== 'string') {
      throw new Error('Invalid parameter. `name` should be a string.');
    }

    this.services[name] = dependency;
  }


  /**
   * Retrieves a dependency.
   *
   * @param {string} name - The name of the service.
   * @return {any} The instance of the service.
   * @throws {Error} Throws an error if the service is not found.
   */
  get(name) {
    if (!this.services[name]) {
      if (!this.factories[name]) {
        throw new Error(`Service ${name} not found.`);
      }
      this.services[name] = this.factories[name]();
    }

    return this.services[name];
  }

}

const appServiceContainer = new AppServiceContainer();

export default appServiceContainer;