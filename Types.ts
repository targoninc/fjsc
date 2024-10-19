import {DomNode, Signal, StringOrSignal, TypeOrSignal} from "./f2.ts";
import type {EventHandler, HtmlPropertyValue} from "./f2.ts";

type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
    ? Acc[number]
    : Enumerate<N>

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
    style?: StringOrSignal;
    id?: HtmlPropertyValue;
    title?: HtmlPropertyValue;
    tabindex?: HtmlPropertyValue;
    role?: HtmlPropertyValue;
    ariaLabel?: HtmlPropertyValue;
}

export interface ButtonConfig extends BaseComponentConfig {
    text: StringOrSignal;
    onclick: EventHandler<MouseEvent>;
    icon?: IconConfig;
}

export interface InputConfig  extends BaseComponentConfig{
    name: StringOrSignal;
    accept: StringOrSignal;
    type: TypeOrSignal<InputType>;
    placeholder: StringOrSignal;
    value: StringOrSignal;
    onchange?: (value: string) => void;
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

export interface SearchableSelectConfig extends BaseComponentConfig  {
    options: Signal<SelectOption[]>;
    value: Signal<any>;
}

export interface HeadingConfig extends BaseComponentConfig  {
    level?: IntRange<1, 6>;
    text: StringOrSignal;
}