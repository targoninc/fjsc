export class FjsStore {
    static keyName = "__fjs_store__";

    static get(key: string) {
        // @ts-ignore
        return window[this.keyName][key];
    }

    static set(key: any, value: any) {
        // @ts-ignore
        window[this.keyName][key] = value;
    }

    static clear() {
        // @ts-ignore
        window[this.keyName] = {};
    }

    static remove(key: any) {
        // @ts-ignore
        delete window[this.keyName][key];
    }

    static getAll() {
        // @ts-ignore
        return window[this.keyName];
    }

    static keys() {
        // @ts-ignore
        return Object.keys(window[this.keyName]);
    }

    static values() {
        // @ts-ignore
        return Object.values(window[this.keyName]);
    }

    static getSignalValue(key: any) {
        return this.get(key).value;
    }

    static setSignalValue(key: any, value: any) {
        this.get(key).value = value;
    }
}

/**
 * If called with one argument, gets the value for that key, otherwise saves it to the store.
 * @param key
 * @param value
 * @returns {*|void}
 */
export function store(key = null, value = null): any | void {
    if (!window) {
        console.warn("store() is not supported outside of the browser!");
        return;
    }
    // @ts-ignore
    if (!window[FjsStore.keyName]) {
        // @ts-ignore
        window[FjsStore.keyName] = {};
    }
    if (arguments.length === 1) {
        return FjsStore.get(arguments[0]);
    } else if (arguments.length === 2) {
        return FjsStore.set(arguments[0], arguments[1]);
    }

    throw new Error("Passing more than 2 arguments to store() is not supported.");
}