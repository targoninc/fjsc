import {FJSC} from "../FJSC.js";

function example() {
    const counter = signal(0);

    return FJSC.container({children: [
        FJSC.text({
            text: counter
        }),
        FJSC.button({
            text: "Click me!",
            onclick: () => {
                counter.value++;
            }
        })
    ]})
}

document.body.appendChild(example());