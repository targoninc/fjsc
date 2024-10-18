import {DomNode, Signal} from "./f2.ts";
import type {EventHandler, HtmlPropertyValue} from "./f2.ts";

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

export interface ButtonConfig {
    classes: string[];
    text: string;
    onclick: EventHandler<MouseEvent>;
}

export interface InputConfig {
    name: string;
    accept: string;
    type: InputType;
    classes: string[];
    placeholder: string;
    value: string;
    onchange?: (value: string) => void;
}

export interface ContainerConfig {
    tag: string;
    children: (DomNode|HTMLElement|SVGElement)[];
    classes: (string|Signal<string>)[];
}

export interface TextConfig {
    text: HtmlPropertyValue,
    tag: string
}

export interface IconConfig {
    icon: string|Signal<string>;
    adaptive?: boolean;
    isUrl?: boolean;
}

export interface SelectOption {
    image: string;
    imageIsUrl: boolean;
    name: any;
    id: any;
}

export interface SelectOptionConfig {
    option: SelectOption;
    value: Signal<any>;
    search: Signal<string>;
    optionsVisible: Signal<boolean>;
    selectedId: Signal<any>;
}

export interface SearchableSelectConfig {
    options: Signal<SelectOption[]>;
    value: Signal<any>;
}