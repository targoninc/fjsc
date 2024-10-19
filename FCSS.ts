import {create, signal} from "./f2.ts";
import type {StyleClass} from "./f2.ts";

export let myRandomClass: StyleClass = signal([
    {
        property: "background-color",
        value: "red"
    },
    {
        property: "color",
        value: "white"
    }
]);

const exampleNode = create("div")
    .styleClass(myRandomClass)
    .build();

document.body.appendChild(exampleNode);

myRandomClass.value = [
    ...myRandomClass.value,
    {
        property: "border",
        value: "3px solid black"
    }
];
