import {FJSC} from "../FJSC.js";
import {signal} from "../f2.js";

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
            FJSC.container({
                classes: ["flex", "gap", "align-children"],
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
                        type: "number",
                        value: counter,
                        placeholder: "Enter a number"
                    }),
                    FJSC.searchableSelect({
                        value: counter,
                        options: signal(options)
                    })
                ]
            })
        ]
    })
}

document.body.appendChild(example());