// src/store.ts
class FjsStore {
  static keyName = "__fjs_store__";
  static get(key) {
    return window[this.keyName][key];
  }
  static set(key, value) {
    window[this.keyName][key] = value;
  }
  static clear() {
    window[this.keyName] = {};
  }
  static remove(key) {
    delete window[this.keyName][key];
  }
  static getAll() {
    return window[this.keyName];
  }
  static keys() {
    return Object.keys(window[this.keyName]);
  }
  static values() {
    return Object.values(window[this.keyName]);
  }
  static getSignalValue(key) {
    return this.get(key).value;
  }
  static setSignalValue(key, value) {
    this.get(key).value = value;
  }
}
function store(key = null, value = null) {
  if (!window) {
    console.warn("store() is not supported outside of the browser!");
    return;
  }
  if (!window[FjsStore.keyName]) {
    window[FjsStore.keyName] = {};
  }
  if (arguments.length === 1) {
    return FjsStore.get(arguments[0]);
  } else if (arguments.length === 2) {
    return FjsStore.set(arguments[0], arguments[1]);
  }
  throw new Error("Passing more than 2 arguments to store() is not supported.");
}
export {
  store,
  FjsStore
};

//# debugId=E7FC2D50F0F8834264756E2164756E21
//# sourceMappingURL=store.js.map
