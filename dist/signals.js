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

// src/signals.ts
class Signal {
  _callbacks = [];
  _value;
  _values = {};
  constructor(initialValue, updateCallback = () => {
  }, key = null) {
    this._value = initialValue;
    this._values = {};
    this._callbacks.push(updateCallback);
    if (key) {
      store().set(key, this);
    }
  }
  boolValues(assignments = {}) {
    for (let key in assignments) {
      this._values[key] = signal(this._value ? assignments[key].onTrue : assignments[key].onFalse);
    }
    this.subscribe((newValue) => {
      for (let key in assignments) {
        this._values[key].value = newValue ? assignments[key].onTrue : assignments[key].onFalse;
      }
    });
    return this._values;
  }
  unsubscribeAll() {
    this._callbacks = [];
  }
  subscribe(callback) {
    this._callbacks.push(callback);
  }
  unsubscribe(callback) {
    const index = this._callbacks.indexOf(callback);
    if (index >= 0) {
      this._callbacks.splice(index, 1);
    }
  }
  get onUpdate() {
    return this._callbacks;
  }
  set onUpdate(callback) {
    this._callbacks.push(callback);
  }
  get value() {
    return this._value;
  }
  set value(value) {
    const changed = this._value !== value;
    this._value = value;
    this._callbacks.forEach((callback) => callback(value, changed));
  }
}
function signal(initialValue) {
  return new Signal(initialValue);
}
function compute(valueFunction, ...signals) {
  const getValues = () => signals.map((s) => s.value);
  let out = signal(valueFunction(...getValues()));
  for (const sig of signals) {
    sig.subscribe((_, changed) => {
      if (!changed) {
        return;
      }
      out.value = valueFunction(...getValues());
    });
  }
  return out;
}
async function asyncCompute(valueFunction, ...signals) {
  const getValues = () => signals.map((s) => s.value);
  let out = signal(await valueFunction(...getValues()));
  for (const sig of signals) {
    sig.subscribe(async (_, changed) => {
      if (!changed) {
        return;
      }
      out.value = await valueFunction(...getValues());
    });
  }
  return out;
}
function computedSignal(sourceSignal, updateMethod) {
  const returnSignal = signal(updateMethod(sourceSignal.value));
  sourceSignal.subscribe((newVal) => {
    try {
      returnSignal.value = updateMethod(newVal);
    } catch (e) {
      returnSignal.value = null;
    }
  });
  return returnSignal;
}
function signalFromProperty(sourceSignal, propertyName) {
  return compute((source) => {
    if (!source) {
      return null;
    }
    return source[propertyName];
  }, sourceSignal);
}
export {
  signalFromProperty,
  signal,
  computedSignal,
  compute,
  asyncCompute,
  Signal
};

//# debugId=E3AF199ECF4F761F64756E2164756E21
//# sourceMappingURL=signals.js.map
