import {computedSignal, create, ifjs, signal, signalMap} from "./f2.ts";
import type {
    ButtonConfig,
    ContainerConfig,
    IconConfig,
    InputConfig,
    SearchableSelectConfig, SelectOptionConfig,
    TextConfig
} from "./Types.ts";

export class FJSC {
    static button(config: ButtonConfig) {
        config.classes ??= [];
        return create("button")
            .classes("fjsc", ...config.classes)
            .text(config.text)
            .onclick(config.onclick)
            .build();
    }

    static input(config: InputConfig) {
        return create("input")
            .classes("fjsc")
            .type(config.type)
            .value(config.value)
            .accept(config.accept)
            .placeholder(config.placeholder)
            .onchange((e: any) => {
                if (config.onchange) {
                    config.onchange(e.target.value);
                }
            })
            .name(config.name)
            .build();
    }

    static area(config: ContainerConfig) {
        config.classes ??= [];
        config.children ??= [];

        return create(config.tag ?? "div")
            .classes("fjsc", "fjsc-area", ...config.classes)
            .children(...config.children)
            .build();
    }

    static container(config: ContainerConfig) {
        config.classes ??= [];
        config.children ??= [];

        return create(config.tag ?? "div")
            .classes("fjsc", "fjsc-container", ...config.classes)
            .children(...config.children)
            .build();
    }

    static text(config: TextConfig) {
        return create(config.tag ?? "span")
            .classes("fjsc")
            .text(config.text)
            .build();
    }

    static icon(config: IconConfig) {
        const icon = config.icon;
        const isMaterial = !config.isUrl;
        const iconClass = config.adaptive ? "adaptive-icon" : "static-icon";

        if (isMaterial) {
            return create("i")
                .classes(iconClass, "fjsc", "material-symbols-outlined", "no-pointer")
                .text(icon)
                .build();
        }

        return create("img")
            .classes(iconClass, "fjsc", "no-pointer")
            .attributes("src", icon)
            .build();
    }

    static searchableSelect(config: SearchableSelectConfig) {
        const options = config.options ?? signal([]);
        const value = config.value ?? signal(null);

        const search = signal(options.value.find(o => o.id === value.value)?.name ?? "");
        const optionsVisible = signal(false);
        const filtered = signal(options.value);
        const selectedIndex = signal(0);
        const filter = () => {
            filtered.value = options.value.filter(o => o.name.toLowerCase().includes(search.value.toLowerCase()));
        }
        options.subscribe(filter);
        search.subscribe(filter);
        filter();
        const selectedId = signal(options.value[0].id);
        const updateSelectedId = () => {
            selectedId.value = filtered.value[selectedIndex.value]?.id;
        }
        selectedIndex.subscribe(updateSelectedId);
        filtered.subscribe(updateSelectedId);
        updateSelectedId();
        const currentIcon = computedSignal(optionsVisible, (vis: boolean) => vis ? "arrow_drop_up" : "arrow_drop_down");

        return create("div")
            .classes("fjsc-search-select", "flex-v", "relative")
            .children(
                create("div")
                    .classes("flex", "fjsc-search-select-visible")
                    .children(
                        create("input")
                            .classes("fjsc", "fjsc-search-select-input")
                            .value(search)
                            .onfocus(() => {
                                optionsVisible.value = true;
                            })
                            .onkeydown((e: any) => {
                                switch (e.key) {
                                    case "Enter":
                                        e.preventDefault();
                                        e.stopPropagation();
                                        const selectedOption = filtered.value[selectedIndex.value];
                                        value.value = selectedOption?.id ?? value.value;
                                        search.value = selectedOption?.name ?? search.value;
                                        optionsVisible.value = false;
                                        break;
                                    case "ArrowDown":
                                        e.preventDefault();
                                        e.stopPropagation();
                                        selectedIndex.value = (selectedIndex.value + 1) % filtered.value.length;
                                        break;
                                    case "ArrowUp":
                                        e.preventDefault();
                                        e.stopPropagation();
                                        selectedIndex.value = (selectedIndex.value - 1 + filtered.value.length) % filtered.value.length;
                                        break;
                                    case "Escape":
                                    case "Tab":
                                        optionsVisible.value = false;
                                        break;
                                    default:
                                        if ((e.keyCode > 32 && e.keyCode < 126) || e.key === "Backspace") {
                                            setTimeout(() => {
                                                search.value = e.target.value;
                                                selectedIndex.value = 0;
                                            });
                                        }
                                        break;
                                }
                            })
                            .build(),
                        create("div")
                            .classes("fjsc-search-select-dropdown")
                            .onclick(() => {
                                optionsVisible.value = !optionsVisible.value;
                            })
                            .children(
                                FJSC.icon(<IconConfig>{
                                    icon: currentIcon,
                                    adaptive: true,
                                    isUrl: false,
                                })
                            ).build()
                    ).build(),
                ifjs(optionsVisible, signalMap(filtered, create("div").classes("fjsc-search-select-options", "flex-v"), (option: SelectOption) =>
                    FJSC.searchSelectOption({ option, value, search, optionsVisible, selectedId })))
            ).build();
    }

    static searchSelectOption(config: SelectOptionConfig) {
        let element: any;
        const selectedClass = computedSignal<string>(config.selectedId, (id: string) => {
            element?.scrollIntoView({ behavior: "smooth", block: "nearest" });
            return id === config.option.id ? "selected" : "_";
        });

        element = create("div")
            .classes("fjsc-search-select-option", "flex", "gap", "padded", selectedClass)
            .onclick(() => {
                config.value.value = config.option.id;
                config.search.value = config.option.name;
                config.optionsVisible.value = false;
            })
            .children(
                ifjs(config.option.image, FJSC.icon({
                    icon: config.option.image,
                    isUrl: config.option.imageIsUrl,
                    adaptive: true
                })),
                create("span")
                    .text(config.option.name)
                    .build()
            ).build();
        return element;
    }
}