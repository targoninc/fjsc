export function create(tag: string) {
    return new DomNode(tag);
}

export function signal<T>(initialValue: T) {
    return new Signal<T>(initialValue);
}

export function nullElement() {
    return create("div").styles("display", "none").build();
}

export function ifjs(condition, element, inverted = false) {
    if (condition && condition.constructor === Signal) {
        const state = signal(condition.value ? (inverted ? nullElement() : element) : (inverted ? element : nullElement()));
        condition.subscribe((newValue) => {
            if (newValue) {
                state.value = inverted ? nullElement() : element;
            } else {
                state.value = inverted ? element : nullElement();
            }
        });
        return state;
    } else {
        return condition ? (inverted ? nullElement() : element) : (inverted ? element : nullElement());
    }
}

/**
 *
 * @param arrayState {Signal} An FjsObservable that represents an array.
 * @param wrapper {DomNode} A DomNode that will be used to wrap each element of the array. DO NOT CALL .build() on this.
 * @param callback {Function} A function that will be called with the new value of the arrayState.
 * @returns {*}
 */
export function signalMap(arrayState, wrapper, callback) {
    if (arrayState.constructor !== Signal) {
        throw new Error('Invalid argument type for signalMap. Must be a Signal.');
    }

    const update = (newValue) => {
        if (!newValue) {
            return;
        }
        const children = [];
        for (let i = 0; i < newValue.length; i++) {
            children.push(callback(newValue[i], i));
        }
        wrapper.overwriteChildren(...children);
    };
    arrayState.subscribe(update);
    update(arrayState.value);

    return wrapper.build();
}

/**
 * Short wrapper to make dependent signals easier.
 * @param sourceSignal {Signal} Whenever the source signal is updated, the updateMethod gets called to update the output signal.
 * @param updateMethod {Function} Should return the value to update the output signal with.
 */
export function computedSignal<T>(sourceSignal: Signal<any>, updateMethod: Function) {
    const returnSignal = signal<T>(updateMethod(sourceSignal.value));
    sourceSignal.subscribe((newVal: (T)) => {
        try {
            returnSignal.value = updateMethod(newVal);
        } catch (e) {
            // @ts-ignore
            returnSignal.value = null;
        }
    });
    return returnSignal;
}

export function signalFromProperty(sourceSignal: Signal<any>, propertyName: string) {
    return computedSignal(sourceSignal, (source: any) => {
        if (!source) {
            return null;
        }
        return source[propertyName];
    });
}

export function stack(message: string, debugInfo = {}) {
    console.warn(message, { debugInfo }, (new Error()).stack);
}

export class TypeHelper {
    static assertString(value: any, valueName = 'value') {
        const result = value.constructor === String;
        if (!result) {
            console.log('TypeHelper.isString: value is not a string for ' + valueName + ': ', value);
        }
        return result;
    }

    static assertFunction(value: any, valueName = 'value') {
        const result = value.constructor === Function;
        if (!result) {
            console.log('TypeHelper.isFunction: value is not a function for ' + valueName + ': ', value);
        }
        return result;
    }
}

export class FjsStore {
    static keyName = "__fjs_store__";

    static get(key: string) {
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

/**
 * If called with one argument, gets the value for that key, otherwise saves it to the store.
 * @param key
 * @param value
 * @returns {*|void}
 */
export function store(key = null, value = null) {
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

export interface BoolValueAssignments<T> {
    [key: string]: {
        onTrue: T,
        onFalse: T,
    }
}

export class Signal<T> {
    _callbacks: Function[] = [];
    _value: T;
    _values: { [key: string]: Signal<T> } = {};

    constructor(initialValue: T, updateCallback: Function = () => {
    }, key = null) {
        this._value = initialValue;
        this._values = {};
        this._callbacks.push(updateCallback);
        if (key) {
            store().set(key, this);
        }
    }

    /**
     * Creates an object with boolean signals that update when {this} updates.
     * @param assignments {Object} e.g. { someKey: { onTrue: value1, onFalse: value2 } }
     */
    boolValues(assignments: BoolValueAssignments<T> = {}) {
        for (let key in assignments) {
            this._values[key] = signal<T>(this._value ? assignments[key].onTrue : assignments[key].onFalse);
        }
        this.subscribe((newValue: T) => {
            for (let key in assignments) {
                this._values[key].value = newValue ? assignments[key].onTrue : assignments[key].onFalse;
            }
        });
        return this._values;
    }

    unsubscribeAll() {
        this._callbacks = [];
    }

    subscribe(callback: Function) {
        this._callbacks.push(callback);
    }

    unsubscribe(callback: Function) {
        const index = this._callbacks.indexOf(callback);
        if (index >= 0) {
            this._callbacks.splice(index, 1);
        }
    }

    get onUpdate(): Function[] {
        return this._callbacks;
    }

    set onUpdate(callback: Function) {
        this._callbacks.push(callback);
    }

    get value(): T {
        return this._value;
    }

    set value(value: T) {
        const changed = this._value !== value;
        this._value = value;
        this._callbacks.forEach(callback => callback(value, changed));
    }
}

export function isValidElement(element: any) {
    const validTypes = [HTMLElement, SVGElement];
    return validTypes.some(type => element instanceof type);
}

export class DomNode {
    _node: HTMLElement|SVGElement;
    svgTags = ['svg', 'g', 'circle', 'ellipse', 'line', 'path', 'polygon', 'polyline', 'rect', 'text', 'textPath', 'tspan'];

    constructor(tag: string) {
        if (this.svgTags.includes(tag)) {
            this._node = document.createElementNS("http://www.w3.org/2000/svg", tag);
        } else {
            this._node = document.createElement(tag);
        }
    }

    build() {
        if (!isValidElement(this._node)) {
            throw new Error('Invalid node type. Must be an HTMLElement or a subclass.');
        }
        return this._node;
    }

    wrapProperty(property: string, value: any) {
        if (value && value.constructor === Signal) {
            this._node[property] = value.value;
            value.onUpdate = (newValue) => {
                this._node[property] = newValue;
            };
        } else {
            this._node[property] = value;
        }
    }

    class(className: string) {
        return this.classes(className);
    }

    classes(...classes: (string|Signal<string>)[]) {
        for (let cls of classes) {
            if (cls && cls.constructor === Signal) {
                let previousValue = cls.value;
                this._node.classList.add(previousValue);
                cls.onUpdate = (newValue: string) => {
                    this._node.classList.remove(previousValue);
                    this._node.classList.add(newValue);
                    previousValue = newValue;
                };
            } else {
                this._node.classList.add(cls as string);
            }
        }
        return this;
    }

    attribute(key: string, value: string|number|boolean) {
        return this.attributes(key, value);
    }

    attributes(...attributes: (string|number|boolean|Signal<string|number|boolean>)[]) {
        if (arguments.length % 2 === 0) {
            for (let i = 0; i < arguments.length; i += 2) {
                const key = arguments[i];
                const value = arguments[i + 1];
                TypeHelper.assertString(key, 'attributes/key');
                if (value && value.constructor === Signal) {
                    this._node.setAttribute(key, value.value);
                    value.onUpdate = (newValue: string) => {
                        this._node.setAttribute(key, newValue);
                    };
                } else {
                    this._node.setAttribute(key, value);
                }
            }
        } else {
            throw new Error('Invalid number of arguments for attributes. Must be even. (key, value, key, value, ...)');
        }
        return this;
    }

    id(id: string) {
        this.wrapProperty('id', id);
        return this;
    }

    text(text: string|Signal<string>) {
        this.wrapProperty('innerText', text);
        return this;
    }

    title(title: string) {
        this.wrapProperty('title', title);
        return this;
    }

    html(html: string) {
        this.wrapProperty('innerHTML', html);
        return this;
    }

    children(...children: (DomNode|HTMLElement|SVGElement|Signal<DomNode|HTMLElement|SVGElement>)[]) {
        for (let node of arguments) {
            if (isValidElement(node)) {
                this._node.appendChild(node);
            } else if (node instanceof DomNode) {
                this._node.appendChild(node.build());
            } else if (node && node.constructor === Signal) {
                let childNode = node.value;
                if (!isValidElement(childNode)) {
                    // Create a placeholder div if the value is not an HTMLElement so we can swap it out later
                    childNode = nullElement();
                }
                this._node.appendChild(childNode);
                node.onUpdate = (newValue: DomNode|HTMLElement|SVGElement) => {
                    if (isValidElement(newValue)) {
                        this._node.replaceChild(newValue as HTMLElement, childNode);
                        childNode = newValue;
                    } else if (newValue.constructor === DomNode) {
                        this._node.replaceChild(newValue.build(), childNode);
                        childNode = newValue.build();
                    } else {
                        stack('Unexpected value for child. Must be an HTMLElement or a subclass.', newValue);
                    }
                };
            } else if (node && node.constructor === Array) {
                for (let childNode of node) {
                    this.children(childNode);
                }
            } else {
                if (node) {
                    stack('Invalid node type. Must be an HTMLElement or a subclass.', node);
                }
            }
        }
        return this;
    }

    overwriteChildren() {
        this._node.innerHTML = '';
        return this.children(...arguments);
    }

    child() {
        return this.children(...arguments);
    }

    role(role) {
        this.wrapProperty('role', role);
        return this;
    }

    prefixedAttribute(prefix, key, value) {
        return this.attributes(`${prefix}-${key}`, value);
    }

    aria(key, value) {
        return this.prefixedAttribute('aria', key, value);
    }

    data(key, value) {
        return this.prefixedAttribute('data', key, value);
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

    onfocusin(callback) {
        this._node.onfocusin = callback;
        return this;
    }

    onfocusout(callback) {
        this._node.onfocusout = callback;
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
        this.wrapProperty('open', open);
        return this;
    }

    src(src) {
        this.wrapProperty('src', src);
        return this;
    }

    alt(alt) {
        this.wrapProperty('alt', alt);
        return this;
    }

    css(css) {
        this._node.style.cssText = css;
        return this;
    }

    style(key, value) {
        return this.styles(key, value);
    }

    styles() {
        if (arguments.length % 2 === 0) {
            for (let i = 0; i < arguments.length; i += 2) {
                const key = arguments[i];
                const value = arguments[i + 1];
                if (key.constructor !== String) {
                    throw new Error('Invalid key type for styles. Must be a string.');
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
            throw new Error('Invalid number of arguments for styles. Must be even. (key, value, key, value, ...)');
        }
        return this;
    }

    width(width) {
        this.wrapProperty('width', width);
        return this;
    }

    height(height) {
        this.wrapProperty('height', height);
        return this;
    }

    type(type) {
        this.wrapProperty('type', type);
        return this;
    }

    name(name) {
        this.wrapProperty('name', name);
        return this;
    }

    value(value) {
        this.wrapProperty('value', value);
        return this;
    }

    placeholder(placeholder) {
        this.wrapProperty('placeholder', placeholder);
        return this;
    }

    for(forId) {
        this.wrapProperty('for', forId);
        return this;
    }

    checked(checked) {
        this.wrapProperty('checked', checked);
        return this;
    }

    disabled(disabled) {
        this.wrapProperty('disabled', disabled);
        return this;
    }

    selected(selected) {
        this.wrapProperty('selected', selected);
        return this;
    }

    href(href) {
        this.wrapProperty('href', href);
        return this;
    }

    target(target) {
        this.wrapProperty('target', target);
        return this;
    }

    rel(rel) {
        this.wrapProperty('rel', rel);
        return this;
    }

    required(required) {
        this.wrapProperty('required', required);
        return this;
    }

    multiple(multiple) {
        this.wrapProperty('multiple', multiple);
        return this;
    }

    accept(accept) {
        this.wrapProperty('accept', accept);
        return this;
    }

    acceptCharset(acceptCharset) {
        this.wrapProperty('acceptCharset', acceptCharset);
        return this;
    }

    action(action) {
        this.wrapProperty('action', action);
        return this;
    }

    autocomplete(autocomplete) {
        this.wrapProperty('autocomplete', autocomplete);
        return this;
    }

    enctype(enctype) {
        this.wrapProperty('enctype', enctype);
        return this;
    }

    method(method) {
        this.wrapProperty('method', method);
        return this;
    }

    novalidate(novalidate) {
        this.wrapProperty('novalidate', novalidate);
        return this;
    }
}