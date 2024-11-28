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

// src/f2.ts
function mergeCss(...cssObjs) {
  return Object.assign({}, ...cssObjs.filter((o) => o));
}
function create(tag) {
  return new DomNode(tag);
}
function nullElement() {
  return create("div").styles("display", "none").build();
}
function ifjs(condition, element, inverted = false) {
  function getElement() {
    if (element.constructor === Function) {
      return element();
    }
    return element;
  }
  if (condition && condition.constructor === Signal) {
    const state = signal(condition.value ? inverted ? nullElement() : getElement() : inverted ? getElement() : nullElement());
    condition.subscribe((newValue) => {
      if (newValue) {
        state.value = inverted ? nullElement() : getElement();
      } else {
        state.value = inverted ? getElement() : nullElement();
      }
    });
    return state;
  } else {
    return condition ? inverted ? nullElement() : getElement() : inverted ? getElement() : nullElement();
  }
}
function signalMap(arrayState, wrapper, callback, renderSequentially = false) {
  if (!arrayState.subscribe) {
    throw new Error("arrayState argument for signalMap is not subscribable");
  }
  const update = (newValue) => {
    if (!newValue) {
      return;
    }
    const tmp = [...newValue];
    const children = [];
    if (renderSequentially) {
      wrapper.overwriteChildren();
      for (let i = 0;i < tmp.length; i++) {
        wrapper.children(callback(tmp[i], i));
      }
    } else {
      for (let i = 0;i < tmp.length; i++) {
        children.push(callback(tmp[i], i));
      }
      wrapper.overwriteChildren(...children);
    }
  };
  arrayState.subscribe(update);
  update(arrayState.value);
  return wrapper.build();
}
function stack(message, debugInfo = {}) {
  console.warn(message, { debugInfo }, new Error().stack);
}
function isValidElement(element) {
  const validTypes = [HTMLElement, SVGElement];
  return validTypes.some((type) => element instanceof type);
}

class DomNode {
  _node;
  svgTags = ["svg", "g", "circle", "ellipse", "line", "path", "polygon", "polyline", "rect", "text", "textPath", "tspan"];
  constructor(tag) {
    if (this.svgTags.includes(tag)) {
      this._node = document.createElementNS("http://www.w3.org/2000/svg", tag);
    } else {
      this._node = document.createElement(tag);
    }
  }
  applyGenericConfig(config) {
    return this.classes("fjsc", ...config.classes ?? []).attributes(...config.attributes ?? []).styles(...config.styles ?? []).id(config.id).css(config.css).title(config.title).role(config.role);
  }
  build() {
    if (!isValidElement(this._node)) {
      throw new Error("Invalid node type. Must be an HTMLElement or a subclass.");
    }
    return this._node;
  }
  wrapProperty(property, value) {
    if (value && value.constructor === Signal) {
      const sig = value;
      this._node[property] = sig.value;
      sig.subscribe((newValue) => {
        this._node[property] = newValue;
      });
    } else {
      if (value !== undefined && value !== null) {
        this._node[property] = value;
      }
    }
  }
  class(className) {
    return this.classes(className);
  }
  classes(...classes) {
    for (let cls of classes) {
      if (cls && cls.constructor === Signal) {
        const sig = cls;
        let previousValue = sig.value;
        this._node.classList.add(previousValue);
        sig.subscribe((newValue) => {
          this._node.classList.remove(previousValue);
          this._node.classList.add(newValue);
          previousValue = newValue;
        });
      } else {
        this._node.classList.add(cls);
      }
    }
    return this;
  }
  attribute(key, value) {
    return this.attributes(key, value);
  }
  attributes(...attributes) {
    if (arguments.length % 2 === 0) {
      for (let i = 0;i < arguments.length; i += 2) {
        const key = arguments[i];
        const value = arguments[i + 1];
        if (value && value.constructor === Signal) {
          this._node.setAttribute(key, value.value);
          value.onUpdate = (newValue) => {
            this._node.setAttribute(key, newValue);
          };
        } else {
          this._node.setAttribute(key, value);
        }
      }
    } else {
      throw new Error("Invalid number of arguments for attributes. Must be even. (key, value, key, value, ...)");
    }
    return this;
  }
  id(id) {
    this.wrapProperty("id", id);
    return this;
  }
  text(text) {
    this.wrapProperty("innerText", text);
    return this;
  }
  title(title) {
    this.wrapProperty("title", title);
    return this;
  }
  html(html) {
    this.wrapProperty("innerHTML", html);
    return this;
  }
  children(...children) {
    for (let node of arguments) {
      if (isValidElement(node)) {
        this._node.appendChild(node);
      } else if (node instanceof DomNode) {
        this._node.appendChild(node.build());
      } else if (node && node.constructor === Signal) {
        let childNode = node.value;
        if (!isValidElement(childNode)) {
          childNode = nullElement();
        }
        this._node.appendChild(childNode);
        node.onUpdate = (newValue) => {
          if (isValidElement(newValue)) {
            this._node.replaceChild(newValue, childNode);
            childNode = newValue;
          } else if (newValue.constructor === DomNode) {
            this._node.replaceChild(newValue.build(), childNode);
            childNode = newValue.build();
          } else {
            stack("Unexpected value for child. Must be an HTMLElement or a subclass.", newValue);
          }
        };
      } else if (node && node.constructor === Array) {
        for (let childNode of node) {
          this.children(childNode);
        }
      } else {
        if (node) {
          stack("Invalid node type. Must be an HTMLElement or a subclass.", node);
        }
      }
    }
    return this;
  }
  overwriteChildren() {
    this._node.innerHTML = "";
    return this.children(...arguments);
  }
  child() {
    return this.children(...arguments);
  }
  role(role) {
    this.wrapProperty("role", role);
    return this;
  }
  prefixedAttribute(prefix, key, value) {
    return this.attributes(`${prefix}-${key}`, value);
  }
  aria(key, value) {
    return this.prefixedAttribute("aria", key, value);
  }
  data(key, value) {
    return this.prefixedAttribute("data", key, value);
  }
  onclick(callback) {
    this._node.onclick = callback;
    return this;
  }
  onauxclick(callback) {
    this._node.onauxclick = callback;
    return this;
  }
  ondblclick(callback) {
    this._node.ondblclick = callback;
    return this;
  }
  onchange(callback) {
    this._node.onchange = callback;
    return this;
  }
  oninput(callback) {
    this._node.oninput = callback;
    return this;
  }
  onkeydown(callback) {
    this._node.onkeydown = callback;
    return this;
  }
  onkeyup(callback) {
    this._node.onkeyup = callback;
    return this;
  }
  onmousedown(callback) {
    this._node.onmousedown = callback;
    return this;
  }
  onmouseup(callback) {
    this._node.onmouseup = callback;
    return this;
  }
  onmouseover(callback) {
    this._node.onmouseover = callback;
    return this;
  }
  onmouseout(callback) {
    this._node.onmouseout = callback;
    return this;
  }
  onmousemove(callback) {
    this._node.onmousemove = callback;
    return this;
  }
  onmouseenter(callback) {
    this._node.onmouseenter = callback;
    return this;
  }
  onmouseleave(callback) {
    this._node.onmouseleave = callback;
    return this;
  }
  oncontextmenu(callback) {
    this._node.oncontextmenu = callback;
    return this;
  }
  onwheel(callback) {
    this._node.onwheel = callback;
    return this;
  }
  ondrag(callback) {
    this._node.ondrag = callback;
    return this;
  }
  ondragend(callback) {
    this._node.ondragend = callback;
    return this;
  }
  ondragenter(callback) {
    this._node.ondragenter = callback;
    return this;
  }
  ondragstart(callback) {
    this._node.ondragstart = callback;
    return this;
  }
  ondragleave(callback) {
    this._node.ondragleave = callback;
    return this;
  }
  ondragover(callback) {
    this._node.ondragover = callback;
    return this;
  }
  ondrop(callback) {
    this._node.ondrop = callback;
    return this;
  }
  onscroll(callback) {
    this._node.onscroll = callback;
    return this;
  }
  onfocus(callback) {
    this._node.onfocus = callback;
    return this;
  }
  onblur(callback) {
    this._node.onblur = callback;
    return this;
  }
  onresize(callback) {
    this._node.onresize = callback;
    return this;
  }
  onselect(callback) {
    this._node.onselect = callback;
    return this;
  }
  onsubmit(callback) {
    this._node.onsubmit = callback;
    return this;
  }
  onreset(callback) {
    this._node.onreset = callback;
    return this;
  }
  onabort(callback) {
    this._node.onabort = callback;
    return this;
  }
  onerror(callback) {
    this._node.onerror = callback;
    return this;
  }
  oncanplay(callback) {
    this._node.oncanplay = callback;
    return this;
  }
  oncanplaythrough(callback) {
    this._node.oncanplaythrough = callback;
    return this;
  }
  ondurationchange(callback) {
    this._node.ondurationchange = callback;
    return this;
  }
  onemptied(callback) {
    this._node.onemptied = callback;
    return this;
  }
  onended(callback) {
    this._node.onended = callback;
    return this;
  }
  onloadeddata(callback) {
    this._node.onloadeddata = callback;
    return this;
  }
  onloadedmetadata(callback) {
    this._node.onloadedmetadata = callback;
    return this;
  }
  onloadstart(callback) {
    this._node.onloadstart = callback;
    return this;
  }
  onpause(callback) {
    this._node.onpause = callback;
    return this;
  }
  onplay(callback) {
    this._node.onplay = callback;
    return this;
  }
  onplaying(callback) {
    this._node.onplaying = callback;
    return this;
  }
  onprogress(callback) {
    this._node.onprogress = callback;
    return this;
  }
  onratechange(callback) {
    this._node.onratechange = callback;
    return this;
  }
  onseeked(callback) {
    this._node.onseeked = callback;
    return this;
  }
  onseeking(callback) {
    this._node.onseeking = callback;
    return this;
  }
  onstalled(callback) {
    this._node.onstalled = callback;
    return this;
  }
  onsuspend(callback) {
    this._node.onsuspend = callback;
    return this;
  }
  ontimeupdate(callback) {
    this._node.ontimeupdate = callback;
    return this;
  }
  onvolumechange(callback) {
    this._node.onvolumechange = callback;
    return this;
  }
  onwaiting(callback) {
    this._node.onwaiting = callback;
    return this;
  }
  oncopy(callback) {
    this._node.oncopy = callback;
    return this;
  }
  oncut(callback) {
    this._node.oncut = callback;
    return this;
  }
  onpaste(callback) {
    this._node.onpaste = callback;
    return this;
  }
  onanimationstart(callback) {
    this._node.onanimationstart = callback;
    return this;
  }
  onanimationend(callback) {
    this._node.onanimationend = callback;
    return this;
  }
  onanimationiteration(callback) {
    this._node.onanimationiteration = callback;
    return this;
  }
  ontransitionend(callback) {
    this._node.ontransitionend = callback;
    return this;
  }
  on(eventName, callback) {
    this._node.addEventListener(eventName, callback);
    return this;
  }
  open(open) {
    this.wrapProperty("open", open);
    return this;
  }
  src(src) {
    this.wrapProperty("src", src);
    return this;
  }
  alt(alt) {
    this.wrapProperty("alt", alt);
    return this;
  }
  css(css) {
    if (!css) {
      return this;
    }
    for (const [key, value] of Object.entries(css)) {
      this.styles(key, value);
    }
    return this;
  }
  style(key, value) {
    return this.styles(key, value);
  }
  styles(...styles) {
    if (arguments.length % 2 === 0) {
      for (let i = 0;i < arguments.length; i += 2) {
        const key = arguments[i];
        const value = arguments[i + 1];
        if (key.constructor !== String) {
          throw new Error("Invalid key type for styles. Must be a string.");
        }
        if (value && value.constructor === Signal) {
          this._node.style[key] = value.value;
          value.onUpdate = (newValue) => {
            this._node.style[key] = newValue;
          };
        } else {
          this._node.style[key] = value;
        }
      }
    } else {
      throw new Error("Invalid number of arguments for styles. Must be even. (key, value, key, value, ...)");
    }
    return this;
  }
  width(width) {
    this.wrapProperty("width", width);
    return this;
  }
  height(height) {
    this.wrapProperty("height", height);
    return this;
  }
  type(type) {
    this.wrapProperty("type", type);
    return this;
  }
  name(name) {
    this.wrapProperty("name", name);
    return this;
  }
  value(value) {
    this.wrapProperty("value", value);
    return this;
  }
  placeholder(placeholder) {
    this.wrapProperty("placeholder", placeholder);
    return this;
  }
  for(forId) {
    this.wrapProperty("for", forId);
    return this;
  }
  checked(checked) {
    this.wrapProperty("checked", checked);
    return this;
  }
  disabled(disabled) {
    this.wrapProperty("disabled", disabled);
    return this;
  }
  selected(selected) {
    this.wrapProperty("selected", selected);
    return this;
  }
  href(href) {
    this.wrapProperty("href", href);
    return this;
  }
  target(target) {
    this.wrapProperty("target", target);
    return this;
  }
  rel(rel) {
    this.wrapProperty("rel", rel);
    return this;
  }
  required(required) {
    this.wrapProperty("required", required);
    return this;
  }
  multiple(multiple) {
    this.wrapProperty("multiple", multiple);
    return this;
  }
  accept(accept) {
    this.wrapProperty("accept", accept);
    return this;
  }
  acceptCharset(acceptCharset) {
    this.wrapProperty("acceptCharset", acceptCharset);
    return this;
  }
  action(action) {
    this.wrapProperty("action", action);
    return this;
  }
  autocomplete(autocomplete) {
    this.wrapProperty("autocomplete", autocomplete);
    return this;
  }
  enctype(enctype) {
    this.wrapProperty("enctype", enctype);
    return this;
  }
  method(method) {
    this.wrapProperty("method", method);
    return this;
  }
  novalidate(novalidate) {
    this.wrapProperty("novalidate", novalidate);
    return this;
  }
}

// src/Types.ts
var InputType;
((InputType2) => {
  InputType2["button"] = "button";
  InputType2["checkbox"] = "checkbox";
  InputType2["color"] = "color";
  InputType2["date"] = "date";
  InputType2["datetimelocal"] = "datetime-local";
  InputType2["email"] = "email";
  InputType2["file"] = "file";
  InputType2["hidden"] = "hidden";
  InputType2["image"] = "image";
  InputType2["month"] = "month";
  InputType2["number"] = "number";
  InputType2["password"] = "password";
  InputType2["radio"] = "radio";
  InputType2["range"] = "range";
  InputType2["reset"] = "reset";
  InputType2["search"] = "search";
  InputType2["submit"] = "submit";
  InputType2["tel"] = "tel";
  InputType2["text"] = "text";
  InputType2["time"] = "time";
  InputType2["url"] = "url";
  InputType2["week"] = "week";
})(InputType ||= {});

// src/fjscVariables.ts
var fjscPrimary100 = "#f5f5f5";
var fjscPrimary200 = "#e0e0e0";
var fjscPrimary300 = "#c6c6c6";
var fjscPrimary400 = "#a8a8a8";
var fjscPrimary500 = "#8c8c8c";
var fjscPrimary600 = "#6c6c6c";
var fjscPrimary700 = "#2b2b2b";
var fjscPrimary800 = "#1b1b1b";
var fjscPrimary900 = "#0c0c0c";
var fjscPrimary1000 = "#000000";
var fjscSecondary100 = "#1ca6ff";
var fjscSecondary200 = "#1995e6";
var fjscSecondary300 = "#1685cc";
var fjscSecondary400 = "#1474b3";
var fjscSecondary500 = "#116499";
var fjscSecondary600 = "#0e5380";
var fjscSecondary700 = "#0b4266";
var fjscSecondary800 = "#08324c";
var fjscSecondary900 = "#062133";
var fjscSecondary1000 = "#161819";
var fjscRed100 = "#ff6666";
var fjscRed200 = "#ff4d4d";
var fjscRed300 = "#ff3333";
var fjscRed400 = "#ff1a1a";
var fjscRed500 = "#ff0000";
var fjscRed600 = "#cc0000";
var fjscRed700 = "#990000";
var fjscRed800 = "#660000";
var fjscRed900 = "#330000";
var fjscVars = {
  errorColor: fjscRed300,
  areaBackground: fjscPrimary900,
  areaBorder: fjscPrimary800,
  containerBackground: fjscPrimary800,
  containerBorder: fjscPrimary700,
  textColor: fjscPrimary100,
  interactiveBackground: fjscPrimary900,
  interactiveBackgroundHover: fjscPrimary700,
  interactiveBackgroundActive: fjscPrimary300,
  interactiveColor: fjscPrimary200,
  interactiveColorActive: fjscPrimary900,
  interactiveBorder: fjscPrimary700,
  interactiveBorderFocused: fjscSecondary100,
  interactiveBorderActive: fjscSecondary300,
  inputPaddingX: "0.75em",
  inputPaddingY: "0.3em",
  containerPaddingX: "8px",
  containerPaddingY: "8px",
  areaPaddingX: "16px",
  areaPaddingY: "16px",
  borderRadiusSmall: "4px",
  borderRadiusMedium: "6px",
  borderRadiusLarge: "12px",
  font: "sans-serif",
  baseFontSize: "16px",
  gap: "5px"
};

// src/fjscCssClasses.ts
var baseCss = {
  fontFamily: `${fjscVars.font}, sans-serif`,
  fontSize: fjscVars.baseFontSize,
  border: "none",
  background: "none",
  color: fjscVars.textColor
};
var gapCss = mergeCss(baseCss, {
  gap: fjscVars.gap
});
var flexCss = mergeCss(baseCss, {
  display: "flex"
});
var relativeCss = mergeCss(baseCss, {
  position: "relative"
});
var flexVerticalCss = mergeCss(baseCss, flexCss, gapCss, {
  flexDirection: "column"
});
var interactiveCss = mergeCss(baseCss, {
  padding: `${fjscVars.inputPaddingY} ${fjscVars.inputPaddingX}`,
  borderRadius: fjscVars.borderRadiusSmall,
  border: `1px solid ${fjscVars.interactiveBorder}`,
  background: fjscVars.interactiveBackground,
  color: fjscVars.interactiveColor
});
var containerCss = mergeCss(baseCss, {
  background: fjscVars.containerBackground,
  padding: `${fjscVars.containerPaddingY} ${fjscVars.containerPaddingX}`,
  borderRadius: fjscVars.borderRadiusMedium,
  border: `1px solid ${fjscVars.containerBorder}`
});

// src/FJSC.ts
function getDisabledCss(config) {
  let pointerEvents, opacity;
  if (config.disabled?.subscribe) {
    pointerEvents = signal("initial");
    opacity = signal("1");
    config.disabled.subscribe((newVal) => {
      pointerEvents.value = newVal ? "none" : "initial";
      opacity.value = newVal ? ".5" : "1";
    });
  } else {
    pointerEvents = config.disabled ? "none" : "initial";
    opacity = config.disabled ? ".5" : "1";
  }
  return {
    opacity,
    pointerEvents
  };
}

class FJSC {
  static button(config) {
    config.classes ??= [];
    config.css = mergeCss(interactiveCss, getDisabledCss(config), config.css);
    return create("button").applyGenericConfig(config).onclick(config.onclick).children(ifjs(config.icon, () => FJSC.icon(config.icon)), ifjs(config.text, () => FJSC.text({
      text: config.text
    }))).build();
  }
  static input(config) {
    const errors = signal([]);
    const hasError = compute((e) => [...e].length > 0, errors);
    const invalidClass = compute((has) => has ? "invalid" : "valid", hasError);
    const touched = signal(false);
    const isPassword = config.type === "password" /* password */;
    const toggleState = signal(false);
    const configTypeSignal = config.type.constructor === Signal ? config.type : signal(config.type);
    const actualType = compute((t) => t ? "text" /* text */ : configTypeSignal.value, toggleState);
    let lastChange = 0;
    let debounceTimeout;
    function validate(newValue) {
      errors.value = [];
      if (config.debounce) {
        if (Date.now() - lastChange < config.debounce) {
          if (debounceTimeout) {
            clearTimeout(debounceTimeout);
          }
          debounceTimeout = setTimeout(() => {
            debounceTimeout = undefined;
            validate(newValue);
          }, config.debounce);
          return;
        }
      }
      config.validators?.forEach(async (valFunction) => {
        const valErrors = await valFunction(newValue);
        if (valErrors) {
          errors.value = errors.value.concat(valErrors);
        }
      });
      if (config.required && (newValue === null || newValue === undefined || newValue === "") && touched.value) {
        errors.value = errors.value.concat(["This field is required."]);
      }
    }
    let value = config.value;
    if (config.value?.subscribe) {
      config.value.subscribe(validate);
      validate(config.value.value);
    } else {
      validate(config.value);
      value = signal(config.value ?? "");
    }
    config.css = mergeCss(getDisabledCss(config), config.css);
    return create("div").css(flexVerticalCss).children(create("label").css(flexVerticalCss).text(config.label ?? "").for(config.title).children(create("input").classes(invalidClass).applyGenericConfig(config).type(actualType).value(value).accept(config.accept ?? "").required(config.required ?? false).placeholder(config.placeholder ?? "").attributes("autofocus", config.autofocus ?? "").oninput((e) => {
      touched.value = true;
      lastChange = Date.now();
      if (!config.value?.subscribe) {
        validate(e.target.value);
      }
      if (config.onchange) {
        config.onchange(e.target.value);
      }
    }).onchange((e) => {
      touched.value = true;
      lastChange = Date.now();
      if (!config.value?.subscribe) {
        validate(e.target.value);
      }
      if (config.onchange) {
        config.onchange(e.target.value);
      }
    }).onkeydown(config.onkeydown ?? (() => {
    })).name(config.name).build(), ifjs(isPassword, FJSC.eyeButton(toggleState, () => {
      toggleState.value = !toggleState.value;
    }))).build(), ifjs(hasError, FJSC.errorList(errors))).build();
  }
  static eyeButton(toggleState, onClick) {
    const icon = compute((t) => t ? "visibility" : "visibility_off", toggleState);
    return create("div").classes("fjsc-eye-button").onclick(onClick).children(FJSC.icon({
      icon,
      adaptive: true,
      isUrl: false
    })).build();
  }
  static textarea(config) {
    const errors = signal([]);
    const hasError = compute((e) => e.length > 0, errors);
    const invalidClass = compute((has) => has ? "invalid" : "valid", hasError);
    function validate(newValue) {
      errors.value = [];
      config.validators?.forEach(async (valFunction) => {
        const valErrors = await valFunction(newValue);
        if (valErrors) {
          errors.value = errors.value.concat(valErrors);
        }
      });
      if (config.required && (newValue === null || newValue === undefined || newValue === "")) {
        errors.value = errors.value.concat(["This field is required."]);
      }
    }
    if (config.value?.subscribe) {
      config.value.subscribe(validate);
      validate(config.value.value);
    } else {
      validate(config.value);
    }
    return create("div").css(flexVerticalCss).children(create("label").css(flexVerticalCss).text(config.label ?? "").for(config.name).children(create("textarea").classes(invalidClass).applyGenericConfig(config).styles("resize", config.resize ?? "vertical").value(config.value).required(config.required ?? false).placeholder(config.placeholder ?? "").attributes("autofocus", config.autofocus ?? "", "rows", config.rows?.toString() ?? "3").oninput((e) => {
      if (!config.value?.subscribe) {
        validate(e.target.value);
      }
      if (config.onchange) {
        config.onchange(e.target.value);
      }
    }).onchange((e) => {
      if (!config.value?.subscribe) {
        validate(e.target.value);
      }
      if (config.onchange) {
        config.onchange(e.target.value);
      }
    }).name(config.name).build()).build(), ifjs(hasError, FJSC.errorList(errors))).build();
  }
  static errorList(errors) {
    return signalMap(errors, create("div").css(flexVerticalCss), FJSC.error);
  }
  static error(error) {
    return create("span").css({
      color: fjscVars.errorColor,
      fontSize: "0.9em"
    }).text(error).build();
  }
  static area(config) {
    config.classes ??= [];
    config.children ??= [];
    return create(config.tag ?? "div").applyGenericConfig(config).classes("fjsc-area").children(...config.children).build();
  }
  static container(config) {
    config.classes ??= [];
    config.children ??= [];
    return create(config.tag ?? "div").applyGenericConfig(config).css(containerCss).children(...config.children).build();
  }
  static text(config) {
    return create(config.tag ?? "span").applyGenericConfig(config).text(config.text).build();
  }
  static heading(config) {
    return create(`h${config.level ?? 1}`).applyGenericConfig(config).css(mergeCss(baseCss, {
      fontSize: "2em"
    })).text(config.text).build();
  }
  static icon(config) {
    const icon = config.icon;
    const isMaterial = !config.isUrl;
    const iconClass = config.adaptive ? "adaptive-icon" : "static-icon";
    const pointerClass = config.title ? "_" : "no-pointer";
    if (isMaterial) {
      return create("i").applyGenericConfig(config).classes(iconClass, "material-symbols-outlined", pointerClass).text(icon).build();
    }
    return create("img").applyGenericConfig(config).classes(iconClass, pointerClass).attributes("src", icon).build();
  }
  static searchableSelect(config) {
    const options = config.options ?? signal([]);
    const value = config.value ?? signal(null);
    const search = signal(options.value.find((o) => o.id === value.value)?.name ?? "");
    const optionsVisible = signal(false);
    const filtered = signal(options.value);
    const selectedIndex = signal(0);
    const filter = () => {
      filtered.value = options.value.filter((o) => o.name.toLowerCase().includes(search.value.toLowerCase()));
    };
    options.subscribe(filter);
    search.subscribe(filter);
    filter();
    const selectedId = signal(options.value[0]?.id ?? null);
    const updateSelectedId = () => {
      selectedId.value = filtered.value[selectedIndex.value]?.id;
    };
    selectedIndex.subscribe(updateSelectedId);
    filtered.subscribe(updateSelectedId);
    updateSelectedId();
    const currentIcon = compute((vis) => vis ? "arrow_drop_up" : "arrow_drop_down", optionsVisible);
    return create("div").applyGenericConfig(config).classes("fjsc-search-select").css(mergeCss(flexVerticalCss, relativeCss)).children(create("div").classes("fjsc-search-select-visible", "fjsc").css(flexCss).children(create("input").classes("fjsc", "fjsc-search-select-input").css(getDisabledCss(config)).value(search).onfocus(() => {
      optionsVisible.value = true;
    }).onkeydown((e) => {
      switch (e.key) {
        case "Enter":
          e.preventDefault();
          e.stopPropagation();
          const selectedOption = filtered.value[selectedIndex.value];
          value.value = selectedOption?.id ?? value.value;
          search.value = selectedOption?.name ?? search.value;
          optionsVisible.value = false;
          break;
        case "ArrowDown":
          e.preventDefault();
          e.stopPropagation();
          selectedIndex.value = (selectedIndex.value + 1) % filtered.value.length;
          break;
        case "ArrowUp":
          e.preventDefault();
          e.stopPropagation();
          selectedIndex.value = (selectedIndex.value - 1 + filtered.value.length) % filtered.value.length;
          break;
        case "Escape":
        case "Tab":
          optionsVisible.value = false;
          break;
        default:
          if (e.keyCode > 32 && e.keyCode < 126 || e.key === "Backspace") {
            setTimeout(() => {
              search.value = e.target.value;
              selectedIndex.value = 0;
            });
          }
          break;
      }
    }).build(), create("div").classes("fjsc-search-select-dropdown").css(getDisabledCss(config)).onclick(() => {
      optionsVisible.value = !optionsVisible.value;
    }).children(FJSC.icon({
      icon: currentIcon,
      adaptive: true,
      isUrl: false
    })).build()).build(), ifjs(optionsVisible, signalMap(filtered, create("div").classes("fjsc-search-select-options", "flex-v"), (option) => FJSC.searchSelectOption({ option, value, search, optionsVisible, selectedId })))).build();
  }
  static searchSelectOption(config) {
    let element;
    const selectedClass = compute((id) => {
      element?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      return id === config.option.id ? "selected" : "_";
    }, config.selectedId);
    element = create("div").classes("fjsc-search-select-option", "gap", "padded", selectedClass).css(mergeCss(gapCss, flexCss)).onclick(() => {
      config.value.value = config.option.id;
      config.search.value = config.option.name;
      config.optionsVisible.value = false;
    }).children(ifjs(config.option.image, FJSC.icon({
      icon: config.option.image,
      isUrl: config.option.imageIsUrl,
      adaptive: true
    })), create("span").text(config.option.name).build()).build();
    return element;
  }
  static checkbox(config) {
    const errors = signal([]);
    const hasError = compute((e) => e.length > 0, errors);
    const invalidClass = compute((has) => has ? "invalid" : "valid", hasError);
    function validate(newValue) {
      errors.value = [];
      config.validators?.forEach(async (valFunction) => {
        const valErrors = await valFunction(newValue);
        if (valErrors) {
          errors.value = errors.value.concat(valErrors);
        }
      });
      if (config.required && (newValue === null || newValue === undefined || newValue === false)) {
        errors.value = errors.value.concat(["This field is required."]);
      }
    }
    let checked;
    if (config.checked && config.checked.subscribe) {
      const sig = config.checked;
      sig.subscribe(validate);
      validate(sig.value);
      checked = compute((c) => c.toString(), sig);
    } else {
      validate(config.checked);
      checked = config.checked.toString();
    }
    return create("div").css(flexVerticalCss).children(create("label").applyGenericConfig(config).classes("fjsc-checkbox-container", invalidClass).css(getDisabledCss(config)).text(config.text).children(create("input").type("checkbox" /* checkbox */).name(config.name ?? "").id(config.name ?? "").required(config.required ?? false).checked(checked).onclick((e) => {
      const checked2 = e.target.checked;
      if (!config.checked.subscribe) {
        validate(checked2);
      }
      config.onchange && config.onchange(checked2);
    }).build(), create("span").classes("fjsc-checkmark").children(create("span").classes("fjsc-checkmark-icon").text("✓").build()).build()).build(), ifjs(hasError, FJSC.errorList(errors))).build();
  }
  static toggle(config) {
    const errors = signal([]);
    const hasError = compute((e) => e.length > 0, errors);
    const invalidClass = compute((has) => has ? "invalid" : "valid", hasError);
    function validate(newValue) {
      errors.value = [];
      config.validators?.forEach(async (valFunction) => {
        const valErrors = await valFunction(newValue);
        if (valErrors) {
          errors.value = errors.value.concat(valErrors);
        }
      });
      if (config.required && (newValue === null || newValue === undefined || newValue === false)) {
        errors.value = errors.value.concat(["This field is required."]);
      }
    }
    let checked;
    if (config.checked.subscribe) {
      const sig = config.checked;
      sig.subscribe(validate);
      validate(sig.value);
      checked = compute((c) => c.toString(), sig);
    } else {
      validate(config.checked);
      checked = config.checked.toString();
    }
    return create("div").classes("flex-v", "fjsc").children(create("label").applyGenericConfig(config).classes("align-children", invalidClass).css(mergeCss(flexCss, gapCss, getDisabledCss(config))).for(config.name ?? "").children(create("input").type("checkbox" /* checkbox */).classes("hidden", "fjsc-slider").id(config.name ?? "").required(config.required ?? false).checked(checked).onclick((e) => {
      const checked2 = e.target.checked;
      if (!config.checked.subscribe) {
        validate(checked2);
      }
      config.onchange && config.onchange(checked2);
    }).build(), create("div").classes("fjsc-toggle-container").children(create("span").classes("fjsc-toggle-slider").build()).build(), create("span").classes("fjsc-toggle-text").text(config.text ?? "").build()).build(), ifjs(hasError, FJSC.errorList(errors))).build();
  }
}
export {
  FJSC
};

//# debugId=28CC3BC6B379760364756E2164756E21
//# sourceMappingURL=FJSC.js.map
