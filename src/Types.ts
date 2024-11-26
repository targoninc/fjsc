import {DomNode, Signal} from "./f2.ts";
import type {CssClass, EventHandler, StringOrSignal, TypeOrSignal, HtmlPropertyValue} from "./f2.ts";

type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
    ? Acc[number]
    : Enumerate<N, [...Acc, Acc['length']]>

type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>

export enum InputType {
    button = "button",
    checkbox = "checkbox",
    color = "color",
    date = "date",
    datetimelocal = "datetime-local",
    email = "email",
    file = "file",
    hidden = "hidden",
    image = "image",
    month = "month",
    number = "number",
    password = "password",
    radio = "radio",
    range = "range",
    reset = "reset",
    search = "search",
    submit = "submit",
    tel = "tel",
    text = "text",
    time = "time",
    url = "url",
    week = "week",
}

export interface BaseComponentConfig {
    classes?: StringOrSignal[];
    attributes?: StringOrSignal[];
    styles?: StringOrSignal[];
    id?: HtmlPropertyValue;
    title?: HtmlPropertyValue;
    tabindex?: HtmlPropertyValue;
    role?: HtmlPropertyValue;
    ariaLabel?: HtmlPropertyValue;
    css?: CssClass;
}

export interface ButtonConfig extends BaseComponentConfig {
    text: StringOrSignal;
    onclick: EventHandler<MouseEvent>;
    icon?: IconConfig;
    disabled?: TypeOrSignal<boolean>;
}

export type ValidatorFunction<T> = (value: T) => (string[] | null | undefined) | Promise<string[] | null | undefined>;

export interface ChangeableConfig<T = any> extends BaseComponentConfig {
    onchange?: (value: T) => void;
    validators?: ValidatorFunction<T>[];
    required?: boolean;
    autofocus?: boolean;
    label?: HtmlPropertyValue;
    disabled?: TypeOrSignal<boolean>;
}

export interface InputConfig<T> extends ChangeableConfig<T> {
    name: StringOrSignal;
    type: TypeOrSignal<InputType>;
    value: TypeOrSignal<T>;
    placeholder?: StringOrSignal;
    accept?: StringOrSignal;
    onkeydown?: EventHandler<KeyboardEvent>;
    debounce?: number;
}

export interface TextareaConfig extends ChangeableConfig<string> {
    name: StringOrSignal;
    value: StringOrSignal;
    placeholder?: StringOrSignal;
    rows?: TypeOrSignal<number>;
    resize?: "both" | "horizontal" | "vertical" | "none";
}

export interface ContainerConfig extends BaseComponentConfig {
    tag: string;
    children: (DomNode)[];
}

export interface TextConfig extends BaseComponentConfig  {
    text: HtmlPropertyValue,
    tag: string
}

export interface IconConfig extends BaseComponentConfig  {
    icon: StringOrSignal;
    adaptive?: boolean;
    isUrl?: boolean;
}

export interface SelectOption extends BaseComponentConfig  {
    image: string;
    imageIsUrl: boolean;
    name: any;
    id: any;
}

export interface SelectOptionConfig extends BaseComponentConfig  {
    option: SelectOption;
    value: Signal<any>;
    search: Signal<string>;
    optionsVisible: Signal<boolean>;
    selectedId: Signal<any>;
}

export interface SearchableSelectConfig<T = string> extends ChangeableConfig<T> {
    options: Signal<SelectOption[]>;
    value: Signal<T>;
}

export interface HeadingConfig extends BaseComponentConfig  {
    level?: IntRange<1, 6>;
    text: StringOrSignal;
}

export interface BooleanConfig extends ChangeableConfig<boolean> {
    text: HtmlPropertyValue,
    checked: TypeOrSignal<boolean>,
    name?: HtmlPropertyValue,
}