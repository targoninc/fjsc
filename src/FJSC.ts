import type {AnyElement, StringOrSignal, TypeOrSignal} from "./f2.ts";
import {create, ifjs, signalMap} from "./f2.ts";
import type {
    BooleanConfig,
    ButtonConfig,
    ContainerConfig,
    HeadingConfig,
    IconConfig,
    InputConfig,
    SearchableSelectConfig,
    SelectOption,
    SelectOptionConfig,
    TextareaConfig,
    TextConfig,
} from "./Types.ts";
import {InputType} from "./Types.ts";
import {compute, Signal, signal} from "./signals.ts";

function getDisabledClass(config: { disabled?: TypeOrSignal<boolean> }) {
    let disabledClass;
    if (config.disabled?.subscribe) {
        disabledClass = compute((newValue): string =>
            newValue ? "disabled" : "enabled", config.disabled as Signal<boolean>);
    } else {
        disabledClass = config.disabled ? "disabled" : "enabled";
    }

    return disabledClass;
}

export class FJSC {
    static button(config: ButtonConfig) {
        config.classes ??= [];

        return create("button")
            .applyGenericConfig(config)
            .onclick(config.onclick)
            .classes(getDisabledClass(config))
            .attributes("tabindex", config.tabindex ?? "0")
            .children(
                ifjs(config.icon, () => FJSC.icon(config.icon!)),
                ifjs(config.text, () => FJSC.text(<TextConfig>{
                    text: config.text!,
                }))
            ).build();
    }

    static input<T>(config: InputConfig<T>) {
        const errors = signal<string[]>([]);
        const hasError = compute((e) => [...e].length > 0, errors);
        const invalidClass = compute((has: boolean): string => has ? "invalid" : "valid", hasError);
        const touched = signal(false);
        const isPassword = config.type === InputType.password;
        const passwordClass: string = isPassword ? "fjsc-password-input" : "_";
        const toggleState = signal(false);
        const configTypeSignal = config.type.constructor === Signal ? config.type as Signal<InputType> : signal(config.type as InputType);
        const actualType = compute((t: boolean) => t ? InputType.text : configTypeSignal.value, toggleState);
        let lastChange = 0;
        let debounceTimeout: number | Timer | undefined;

        function validate(newValue: any) {
            errors.value = [];
            if (config.debounce) {
                if (Date.now() - lastChange < config.debounce) {
                    if (debounceTimeout) {
                        clearTimeout(debounceTimeout);
                    }
                    debounceTimeout = setTimeout(() => {
                        debounceTimeout = undefined;
                        validate(newValue);
                    }, config.debounce);
                    return;
                }
            }
            config.validators?.forEach(async valFunction => {
                const valErrors = await valFunction(newValue);
                if (valErrors) {
                    errors.value = errors.value.concat(valErrors);
                }
            });
            if (config.required && (newValue === null || newValue === undefined || newValue === "") && touched.value) {
                errors.value = errors.value.concat(["This field is required."]);
            }
        }

        let value: Signal<T> = config.value as Signal<T>;
        if (config.value?.subscribe) {
            config.value.subscribe(validate);
            validate(config.value.value);
        } else {
            validate(config.value as T);
            // @ts-ignore
            value = signal<T>(config.value ?? "");
        }

        return create("div")
            .classes("flex-v", "fjsc")
            .children(
                create("label")
                    .classes("flex-v", "fjsc", getDisabledClass(config))
                    .text(config.label ?? "")
                    .for(config.title)
                    .children(
                        create("input")
                            .classes(invalidClass, passwordClass)
                            .applyGenericConfig(config)
                            .type(actualType)
                            .value(value)
                            .accept(config.accept ?? "")
                            .required(config.required ?? false)
                            .placeholder(config.placeholder ?? "")
                            .attributes("autofocus", config.autofocus ?? "")
                            .oninput((e: any) => {
                                touched.value = true;
                                lastChange = Date.now();
                                if (!config.value?.subscribe) {
                                    validate(e.target.value);
                                }

                                if (config.onchange) {
                                    config.onchange(e.target.value);
                                }
                            })
                            .onchange((e: any) => {
                                touched.value = true;
                                lastChange = Date.now();
                                if (!config.value?.subscribe) {
                                    validate(e.target.value);
                                }

                                if (config.onchange) {
                                    config.onchange(e.target.value);
                                }
                            })
                            .onkeydown(config.onkeydown ?? (() => {}))
                            .name(config.name)
                            .build(),
                        ifjs(isPassword, FJSC.eyeButton(toggleState, () => {
                            toggleState.value = !toggleState.value;
                        })),
                    ).build(),
                ifjs(hasError, FJSC.errorList(errors))
            ).build();
    }

    static eyeButton(toggleState: Signal<boolean>, onClick: Function): AnyElement {
        const icon = compute((t: boolean): string => t ? "visibility" : "visibility_off", toggleState);

        return create("div")
            .classes("fjsc-eye-button")
            .onclick(onClick)
            .children(
                FJSC.icon({
                    icon,
                    adaptive: true,
                    isUrl: false,
                })
            ).build();
    }

    static textarea(config: TextareaConfig) {
        const errors = signal<string[]>([]);
        const hasError = compute((e) => e.length > 0, errors);
        const invalidClass = compute((has: boolean): string => has ? "invalid" : "valid", hasError);

        function validate(newValue: any) {
            errors.value = [];
            config.validators?.forEach(async valFunction => {
                const valErrors = await valFunction(newValue);
                if (valErrors) {
                    errors.value = errors.value.concat(valErrors);
                }
            });
            if (config.required && (newValue === null || newValue === undefined || newValue === "")) {
                errors.value = errors.value.concat(["This field is required."]);
            }
        }

        if (config.value?.subscribe) {
            config.value.subscribe(validate);
            validate(config.value.value);
        } else {
            validate(config.value as string);
        }

        return create("div")
            .classes("flex-v", "fjsc")
            .children(
                create("label")
                    .classes("flex-v", "fjsc", getDisabledClass(config))
                    .text(config.label ?? "")
                    .for(config.name)
                    .children(
                        create("textarea")
                            .classes(invalidClass)
                            .applyGenericConfig(config)
                            .styles("resize", config.resize ?? "vertical")
                            .value(config.value)
                            .required(config.required ?? false)
                            .placeholder(config.placeholder ?? "")
                            .attributes("autofocus", config.autofocus ?? "", "rows", config.rows?.toString() ?? "3")
                            .oninput((e: any) => {
                                if (!config.value?.subscribe) {
                                    validate(e.target.value);
                                }

                                if (config.onchange) {
                                    config.onchange(e.target.value);
                                }
                            })
                            .onchange((e: any) => {
                                if (!config.value?.subscribe) {
                                    validate(e.target.value);
                                }

                                if (config.onchange) {
                                    config.onchange(e.target.value);
                                }
                            })
                            .name(config.name)
                            .build(),
                    ).build(),
                ifjs(hasError, FJSC.errorList(errors))
            ).build();
    }

    static errorList(errors: Signal<string[]>) {
        return signalMap(errors, create("div")
            .classes("flex-v", "fjsc", "fjsc-error-list"), FJSC.error);
    }

    static error(error: StringOrSignal) {
        return create("span")
            .classes("fjsc-error")
            .text(error)
            .build();
    }

    static area(config: ContainerConfig) {
        config.classes ??= [];
        config.children ??= [];

        return create(config.tag ?? "div")
            .applyGenericConfig(config)
            .classes("fjsc-area")
            .children(...config.children)
            .build();
    }

    static container(config: ContainerConfig) {
        config.classes ??= [];
        config.children ??= [];

        return create(config.tag ?? "div")
            .applyGenericConfig(config)
            .classes("fjsc-container")
            .children(...config.children)
            .build();
    }

    static text(config: TextConfig) {
        return create(config.tag ?? "span")
            .applyGenericConfig(config)
            .text(config.text)
            .build();
    }

    static heading(config: HeadingConfig) {
        return create(`h${config.level ?? 1}`)
            .applyGenericConfig(config)
            .text(config.text)
            .build();
    }

    static icon(config: IconConfig) {
        const icon = config.icon;
        const isMaterial = !config.isUrl;
        const iconClass = config.adaptive ? "adaptive-icon" : "static-icon";
        const pointerClass = config.title ? "_" : "no-pointer";

        if (isMaterial) {
            return create("i")
                .applyGenericConfig(config)
                .classes(iconClass, "material-symbols-outlined", pointerClass)
                .text(icon)
                .onclick(config.onclick)
                .build();
        }

        return create("img")
            .applyGenericConfig(config)
            .classes(iconClass, pointerClass)
            .attributes("src", icon)
            .onclick(config.onclick)
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
        const selectedId = signal(options.value[0]?.id ?? null);
        const updateSelectedId = () => {
            selectedId.value = filtered.value[selectedIndex.value]?.id;
        }
        selectedIndex.subscribe(updateSelectedId);
        filtered.subscribe(updateSelectedId);
        updateSelectedId();
        const currentIcon = compute((vis: boolean): string => vis ? "arrow_drop_up" : "arrow_drop_down", optionsVisible);

        return create("div")
            .applyGenericConfig(config)
            .classes("fjsc-search-select", "flex-v", "relative")
            .children(
                ifjs(config.label, create("label")
                    .classes("fjsc")
                    .text(config.label)
                    .build()),
                create("div")
                    .classes("flex", "fjsc-search-select-visible", "fjsc")
                    .children(
                        create("input")
                            .classes("fjsc", "fjsc-search-select-input", getDisabledClass(config))
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
                            .classes("fjsc-search-select-dropdown", getDisabledClass(config))
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
                    FJSC.searchSelectOption({option, value, search, optionsVisible, selectedId})))
            ).build();
    }

    static searchSelectOption(config: SelectOptionConfig) {
        let element: any;
        const selectedClass = compute((id: string): string => {
            element?.scrollIntoView({behavior: "smooth", block: "nearest"});
            return id === config.option.id ? "selected" : "_";
        }, config.selectedId);

        element = create("div")
            .classes("fjsc-search-select-option", "flex", "gap", "padded", selectedClass)
            .onclick(() => {
                config.value.value = config.option.id;
                config.search.value = config.option.name;
                config.optionsVisible.value = false;
            })
            .children(
                ifjs(config.option.image, FJSC.icon({
                    icon: config.option.image ?? "",
                    isUrl: config.option.imageIsUrl,
                    adaptive: true
                })),
                create("span")
                    .text(config.option.name)
                    .build()
            ).build();
        return element;
    }

    static checkbox(config: BooleanConfig) {
        const errors = signal<string[]>([]);
        const hasError = compute((e) => e.length > 0, errors);
        const invalidClass = compute((has: boolean): string => has ? "invalid" : "valid", hasError);

        function validate(newValue: boolean) {
            errors.value = [];
            config.validators?.forEach(async valFunction => {
                const valErrors = await valFunction(newValue);
                if (valErrors) {
                    errors.value = errors.value.concat(valErrors);
                }
            });
            if (config.required && (newValue === null || newValue === undefined || newValue === false)) {
                errors.value = errors.value.concat(["This field is required."]);
            }
        }

        let checked: StringOrSignal;
        if (config.checked && config.checked.subscribe) {
            const sig = config.checked as Signal<boolean>;
            sig.subscribe(validate);
            validate(sig.value);
            checked = compute(c => c.toString(), sig);
        } else {
            validate(config.checked as boolean);
            checked = config.checked.toString();
        }

        return create("div")
            .classes("flex-v", "fjsc")
            .children(
                create("label")
                    .applyGenericConfig(config)
                    .classes("fjsc-checkbox-container", invalidClass, getDisabledClass(config))
                    .text(config.text)
                    .children(
                        create("input")
                            .type(InputType.checkbox)
                            .name(config.name ?? "")
                            .id(config.name ?? "")
                            .required(config.required ?? false)
                            .checked(checked)
                            .onclick((e) => {
                                const c = (e.target as HTMLInputElement).checked;
                                if (!config.checked.subscribe) {
                                    validate(c);
                                }

                                config.onchange && config.onchange(c);
                            })
                            .build(),
                        create("span")
                            .classes("fjsc-checkmark")
                            .children(
                                ifjs(config.checked, create("span")
                                    .classes("fjsc-checkmark-icon")
                                    .text("✓")
                                    .build())
                            ).build(),
                    ).build(),
                ifjs(hasError, FJSC.errorList(errors))
            ).build();
    }

    static toggle(config: BooleanConfig) {
        const errors = signal<string[]>([]);
        const hasError = compute((e) => e.length > 0, errors);
        const invalidClass = compute((has: boolean): string => has ? "invalid" : "valid", hasError);

        function validate(newValue: boolean) {
            errors.value = [];
            config.validators?.forEach(async valFunction => {
                const valErrors = await valFunction(newValue);
                if (valErrors) {
                    errors.value = errors.value.concat(valErrors);
                }
            });
            if (config.required && (newValue === null || newValue === undefined || newValue === false)) {
                errors.value = errors.value.concat(["This field is required."]);
            }
        }

        if (config.checked.subscribe) {
            const sig = config.checked as Signal<boolean>;
            sig.subscribe(validate);
            validate(sig.value);
        } else {
            validate(config.checked as boolean);
        }

        return create("div")
            .classes("flex-v", "fjsc")
            .children(
                create("label")
                    .applyGenericConfig(config)
                    .classes("flex", "gap", "align-children", invalidClass, getDisabledClass(config))
                    .for(config.name ?? "")
                    .children(
                        create("input")
                            .type(InputType.checkbox)
                            .classes("hidden", "fjsc-slider")
                            .id(config.name ?? "")
                            .required(config.required ?? false)
                            .checked(config.checked)
                            .onclick((e) => {
                                const checked = (e.target as HTMLInputElement).checked;
                                if (!config.checked.subscribe) {
                                    validate(checked);
                                }

                                config.onchange && config.onchange(checked);
                            })
                            .build(),
                        create("div")
                            .classes("fjsc-toggle-container")
                            .children(
                                create("span")
                                    .classes("fjsc-toggle-slider")
                                    .build()
                            ).build(),
                        create("span")
                            .classes("fjsc-toggle-text")
                            .text(config.text ?? "")
                            .build(),
                    ).build(),
                ifjs(hasError, FJSC.errorList(errors))
            ).build();
    }
}