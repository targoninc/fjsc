import {create, DomNode, Signal} from "./f2.ts";

export interface ButtonConfig {
    classes: string[];
    text: string;
    onclick?: () => void;
}

export interface InputConfig {
    name: string;
    accept: string;
    type: "text" | "password" | "number" | "checkbox";
    classes: string[];
    placeholder: string;
    value: string;
    onchange?: (value: string) => void;
}

export interface ContainerConfig {
    tag: string;
    children: (DomNode|HTMLElement|SVGElement)[];
    classes: (string|Signal)[];
}

export class FJSC {
    static button(config: ButtonConfig) {
        config.classes ??= [];
        return create("button")
            .classes("fjsc-button", ...config.classes)
            .text(config.text)
            .onclick(config.onclick)
            .build();
    }

    static input(config: InputConfig) {
        return create("input")
            .type(config.type)
            .value(config.value)
            .accept(config.accept)
            .placeholder(config.placeholder)
            .onchange(config.onchange)
            .name(config.name)
            .build();
    }

    static container(config: ContainerConfig) {
        config.classes ??= [];
        config.children ??= [];

        return create(config.tag ?? "div")
            .classes(...config.classes)
            .children(...config.children)
            .build();
    }

    static text(config: { text: string|Signal, tag: string }) {
        return create(config.tag ?? "span")
            .text(config.text)
            .build();
    }
}