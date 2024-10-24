import {FJSC} from "../FJSC.js";
import {signal} from "../f2.js";
import {InputType} from "../Types.js";

const options = [
    {
        id: "1",
        name: "Set 1",
        image: "https://placehold.co/10x10",
        imageIsUrl: true,
    },
    {
        id: "2",
        name: "Set 2",
        image: "water_drop",
        imageIsUrl: false,
    },
    {
        id: "3",
        name: "Set 3",
    },
]

function example() {
    const counter = signal(0);

    return FJSC.area({
        classes: ["flex-v", "gap"],
        children: [
            FJSC.heading({
                level: 1,
                text: "Counter example"
            }),
            FJSC.container({
                classes: ["flex", "gap", "wrap"],
                children: [
                    FJSC.text({
                        text: counter
                    }),
                    FJSC.button({
                        text: "Click me!",
                        onclick: () => {
                            counter.value++;
                        }
                    }),
                    FJSC.input({
                        onchange: (value) => {
                            counter.value = value;
                        },
                        type: InputType.number,
                        value: counter,
                        placeholder: "Enter a number",
                        validators: [
                            (value) => {
                                if (parseInt(value) % 2 === 0) {
                                    return ["number must not be even"];
                                }
                            },
                            (value) => {
                                if (value === "4") {
                                    return ["number must not be 4"];
                                }
                            },
                            (value) => {
                                if (value === "") {
                                    return ["number must not be empty"];
                                }
                            }
                        ]
                    }),
                    FJSC.searchableSelect({
                        value: counter,
                        options: signal(options)
                    }),
                    FJSC.checkbox({
                        onchange: (value) => {
                            console.log("checkbox changed to " + value);
                        },
                        checked: true,
                        text: "Checkbox"
                    }),
                    FJSC.toggle({
                        onchange: (value) => {
                            console.log("toggle changed to " + value);
                        },
                        checked: true,
                        text: "Toggle"
                    }),
                ]
            }),
        ]
    })
}

document.body.appendChild(example());