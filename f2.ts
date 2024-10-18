export type StringOrSignal = string | Signal<string>;
export type TypeOrSignal<T> = T | Signal<T>;
export type HtmlPropertyValue = TypeOrSignal<string | number | boolean>;
export type EventHandler<T> = (this: GlobalEventHandlers, ev: T) => any;

export function create(tag: string) {
    return new DomNode(tag);
}

export function signal<T>(initialValue: T) {
    return new Signal<T>(initialValue);
}

export function nullElement() {
    return create("div").styles("display", "none").build();
}

export function ifjs(condition: TypeOrSignal<boolean>, element: HTMLElement|SVGElement, inverted = false) {
    if (condition && condition.constructor === Signal) {
        const state = signal(condition.value ? (inverted ? nullElement() : element) : (inverted ? element : nullElement()));
        condition.subscribe((newValue: any) => {
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

export function signalMap<T>(arrayState: Signal<T[]>, wrapper: DomNode, callback: Function, renderSequentially = false): any {
    if (arrayState.constructor !== Signal) {
        throw new Error('Invalid argument type for signalMap. Must be a Signal.');
    }

    const update = (newValue: T[]) => {
        if (!newValue) {
            return;
        }
        const children = [];
        for (let i = 0; i < newValue.length; i++) {
            children.push(callback(newValue[i], i));
        }
        // @ts-ignore
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
export function store(key = null, value = null) {
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

    wrapProperty(property: string, value: HtmlPropertyValue) {
        if (value && value.constructor === Signal) {
            // @ts-ignore
            this._node[property] = value.value;
            value.onUpdate = (newValue: HtmlPropertyValue) => {
                // @ts-ignore
                this._node[property] = newValue;
            };
        } else {
            // @ts-ignore
            this._node[property] = value;
        }
    }

    class(className: string) {
        return this.classes(className);
    }

    classes(...classes: HtmlPropertyValue[]) {
        for (let cls of classes) {
            if (cls && cls.constructor === Signal) {
                let previousValue = cls.value as string;
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

    attribute(key: string, value: HtmlPropertyValue) {
        return this.attributes(key, value);
    }

    attributes(...attributes: HtmlPropertyValue[]) {
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

    id(id: HtmlPropertyValue) {
        this.wrapProperty('id', id);
        return this;
    }

    text(text: HtmlPropertyValue) {
        this.wrapProperty('innerText', text);
        return this;
    }

    title(title: HtmlPropertyValue) {
        this.wrapProperty('title', title);
        return this;
    }

    html(html: HtmlPropertyValue) {
        this.wrapProperty('innerHTML', html);
        return this;
    }

    children(...children: TypeOrSignal<DomNode | HTMLElement | SVGElement>[]) {
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

    role(role: HtmlPropertyValue) {
        this.wrapProperty('role', role);
        return this;
    }

    prefixedAttribute(prefix: string, key: string, value: HtmlPropertyValue) {
        return this.attributes(`${prefix}-${key}`, value);
    }

    aria(key: string, value: HtmlPropertyValue) {
        return this.prefixedAttribute('aria', key, value);
    }

    data(key: string, value: HtmlPropertyValue) {
        return this.prefixedAttribute('data', key, value);
    }

    onclick(callback: EventHandler<MouseEvent>) {
        this._node.onclick = callback;
        return this;
    }

    onauxclick(callback: EventHandler<MouseEvent>) {
        this._node.onauxclick = callback;
        return this;
    }

    ondblclick(callback: EventHandler<MouseEvent>) {
        this._node.ondblclick = callback;
        return this;
    }

    onchange(callback: EventHandler<Event>) {
        this._node.onchange = callback;
        return this;
    }

    oninput(callback: EventHandler<Event>) {
        this._node.oninput = callback;
        return this;
    }

    onkeydown(callback: EventHandler<Event>) {
        this._node.onkeydown = callback;
        return this;
    }

    onkeyup(callback: EventHandler<Event>) {
        this._node.onkeyup = callback;
        return this;
    }

    onmousedown(callback: EventHandler<MouseEvent>) {
        this._node.onmousedown = callback;
        return this;
    }

    onmouseup(callback: EventHandler<MouseEvent>) {
        this._node.onmouseup = callback;
        return this;
    }

    onmouseover(callback: EventHandler<MouseEvent>) {
        this._node.onmouseover = callback;
        return this;
    }

    onmouseout(callback: EventHandler<MouseEvent>) {
        this._node.onmouseout = callback;
        return this;
    }

    onmousemove(callback: EventHandler<MouseEvent>) {
        this._node.onmousemove = callback;
        return this;
    }

    onmouseenter(callback: EventHandler<MouseEvent>) {
        this._node.onmouseenter = callback;
        return this;
    }

    onmouseleave(callback: EventHandler<MouseEvent>) {
        this._node.onmouseleave = callback;
        return this;
    }

    oncontextmenu(callback: EventHandler<MouseEvent>) {
        this._node.oncontextmenu = callback;
        return this;
    }

    onwheel(callback: EventHandler<MouseEvent>) {
        this._node.onwheel = callback;
        return this;
    }

    ondrag(callback: EventHandler<MouseEvent>) {
        this._node.ondrag = callback;
        return this;
    }

    ondragend(callback: EventHandler<MouseEvent>) {
        this._node.ondragend = callback;
        return this;
    }

    ondragenter(callback: EventHandler<MouseEvent>) {
        this._node.ondragenter = callback;
        return this;
    }

    ondragstart(callback: EventHandler<MouseEvent>) {
        this._node.ondragstart = callback;
        return this;
    }

    ondragleave(callback: EventHandler<MouseEvent>) {
        this._node.ondragleave = callback;
        return this;
    }

    ondragover(callback: EventHandler<MouseEvent>) {
        this._node.ondragover = callback;
        return this;
    }

    ondrop(callback: EventHandler<MouseEvent>) {
        this._node.ondrop = callback;
        return this;
    }

    onscroll(callback: EventHandler<Event>) {
        this._node.onscroll = callback;
        return this;
    }

    onfocus(callback: EventHandler<Event>) {
        this._node.onfocus = callback;
        return this;
    }

    onblur(callback: EventHandler<Event>) {
        this._node.onblur = callback;
        return this;
    }

    onresize(callback: EventHandler<Event>) {
        this._node.onresize = callback;
        return this;
    }

    onselect(callback: EventHandler<Event>) {
        this._node.onselect = callback;
        return this;
    }

    onsubmit(callback: EventHandler<Event>) {
        this._node.onsubmit = callback;
        return this;
    }

    onreset(callback: EventHandler<Event>) {
        this._node.onreset = callback;
        return this;
    }

    onabort(callback: EventHandler<Event>) {
        this._node.onabort = callback;
        return this;
    }

    onerror(callback: EventHandler<string|Event>) {
        this._node.onerror = callback;
        return this;
    }

    oncanplay(callback: EventHandler<Event>) {
        this._node.oncanplay = callback;
        return this;
    }

    oncanplaythrough(callback: EventHandler<Event>) {
        this._node.oncanplaythrough = callback;
        return this;
    }

    ondurationchange(callback: EventHandler<Event>) {
        this._node.ondurationchange = callback;
        return this;
    }

    onemptied(callback: EventHandler<Event>) {
        this._node.onemptied = callback;
        return this;
    }

    onended(callback: EventHandler<Event>) {
        this._node.onended = callback;
        return this;
    }

    onloadeddata(callback: EventHandler<Event>) {
        this._node.onloadeddata = callback;
        return this;
    }

    onloadedmetadata(callback: EventHandler<Event>) {
        this._node.onloadedmetadata = callback;
        return this;
    }

    onloadstart(callback: EventHandler<Event>) {
        this._node.onloadstart = callback;
        return this;
    }

    onpause(callback: EventHandler<Event>) {
        this._node.onpause = callback;
        return this;
    }

    onplay(callback: EventHandler<Event>) {
        this._node.onplay = callback;
        return this;
    }

    onplaying(callback: EventHandler<Event>) {
        this._node.onplaying = callback;
        return this;
    }

    onprogress(callback: EventHandler<Event>) {
        this._node.onprogress = callback;
        return this;
    }

    onratechange(callback: EventHandler<Event>) {
        this._node.onratechange = callback;
        return this;
    }

    onseeked(callback: EventHandler<Event>) {
        this._node.onseeked = callback;
        return this;
    }

    onseeking(callback: EventHandler<Event>) {
        this._node.onseeking = callback;
        return this;
    }

    onstalled(callback: EventHandler<Event>) {
        this._node.onstalled = callback;
        return this;
    }

    onsuspend(callback: EventHandler<Event>) {
        this._node.onsuspend = callback;
        return this;
    }

    ontimeupdate(callback: EventHandler<Event>) {
        this._node.ontimeupdate = callback;
        return this;
    }

    onvolumechange(callback: EventHandler<Event>) {
        this._node.onvolumechange = callback;
        return this;
    }

    onwaiting(callback: EventHandler<Event>) {
        this._node.onwaiting = callback;
        return this;
    }

    oncopy(callback: EventHandler<Event>) {
        this._node.oncopy = callback;
        return this;
    }

    oncut(callback: EventHandler<Event>) {
        this._node.oncut = callback;
        return this;
    }

    onpaste(callback: EventHandler<Event>) {
        this._node.onpaste = callback;
        return this;
    }

    onanimationstart(callback: EventHandler<Event>) {
        this._node.onanimationstart = callback;
        return this;
    }

    onanimationend(callback: EventHandler<Event>) {
        this._node.onanimationend = callback;
        return this;
    }

    onanimationiteration(callback: EventHandler<Event>) {
        this._node.onanimationiteration = callback;
        return this;
    }

    ontransitionend(callback: EventHandler<Event>) {
        this._node.ontransitionend = callback;
        return this;
    }

    on(eventName: string, callback: EventHandler<Event>) {
        this._node.addEventListener(eventName, callback);
        return this;
    }

    open(open: HtmlPropertyValue) {
        this.wrapProperty('open', open);
        return this;
    }

    src(src: HtmlPropertyValue) {
        this.wrapProperty('src', src);
        return this;
    }

    alt(alt: HtmlPropertyValue) {
        this.wrapProperty('alt', alt);
        return this;
    }

    css(css: string) {
        this._node.style.cssText = css;
        return this;
    }

    style(key: string, value: StringOrSignal) {
        return this.styles(key, value);
    }

    styles(...styles: StringOrSignal[]) {
        if (arguments.length % 2 === 0) {
            for (let i = 0; i < arguments.length; i += 2) {
                const key = arguments[i];
                const value = arguments[i + 1];
                if (key.constructor !== String) {
                    throw new Error('Invalid key type for styles. Must be a string.');
                }
                if (value && value.constructor === Signal) {
                    // @ts-ignore
                    this._node.style[key] = value.value;
                    value.onUpdate = (newValue: any) => {
                        // @ts-ignore
                        this._node.style[key] = newValue;
                    };
                } else {
                    // @ts-ignore
                    this._node.style[key] = value;
                }
            }
        } else {
            throw new Error('Invalid number of arguments for styles. Must be even. (key, value, key, value, ...)');
        }
        return this;
    }

    width(width: HtmlPropertyValue) {
        this.wrapProperty('width', width);
        return this;
    }

    height(height: HtmlPropertyValue) {
        this.wrapProperty('height', height);
        return this;
    }

    type(type: HtmlPropertyValue) {
        this.wrapProperty('type', type);
        return this;
    }

    name(name: HtmlPropertyValue) {
        this.wrapProperty('name', name);
        return this;
    }

    value(value: HtmlPropertyValue) {
        this.wrapProperty('value', value);
        return this;
    }

    placeholder(placeholder: HtmlPropertyValue) {
        this.wrapProperty('placeholder', placeholder);
        return this;
    }

    for(forId: HtmlPropertyValue) {
        this.wrapProperty('for', forId);
        return this;
    }

    checked(checked: HtmlPropertyValue) {
        this.wrapProperty('checked', checked);
        return this;
    }

    disabled(disabled: HtmlPropertyValue) {
        this.wrapProperty('disabled', disabled);
        return this;
    }

    selected(selected: HtmlPropertyValue) {
        this.wrapProperty('selected', selected);
        return this;
    }

    href(href: HtmlPropertyValue) {
        this.wrapProperty('href', href);
        return this;
    }

    target(target: HtmlPropertyValue) {
        this.wrapProperty('target', target);
        return this;
    }

    rel(rel: HtmlPropertyValue) {
        this.wrapProperty('rel', rel);
        return this;
    }

    required(required: HtmlPropertyValue) {
        this.wrapProperty('required', required);
        return this;
    }

    multiple(multiple: HtmlPropertyValue) {
        this.wrapProperty('multiple', multiple);
        return this;
    }

    accept(accept: HtmlPropertyValue) {
        this.wrapProperty('accept', accept);
        return this;
    }

    acceptCharset(acceptCharset: HtmlPropertyValue) {
        this.wrapProperty('acceptCharset', acceptCharset);
        return this;
    }

    action(action: HtmlPropertyValue) {
        this.wrapProperty('action', action);
        return this;
    }

    autocomplete(autocomplete: HtmlPropertyValue) {
        this.wrapProperty('autocomplete', autocomplete);
        return this;
    }

    enctype(enctype: HtmlPropertyValue) {
        this.wrapProperty('enctype', enctype);
        return this;
    }

    method(method: HtmlPropertyValue) {
        this.wrapProperty('method', method);
        return this;
    }

    novalidate(novalidate: HtmlPropertyValue) {
        this.wrapProperty('novalidate', novalidate);
        return this;
    }
}