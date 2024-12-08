import {signal, Signal} from "./f2.ts";

function compute<T>(valueFunction: (...args: any[]) => T, ...signals: Signal<any>[]) {
    let out = signal<T|null>(null);
    const getValues = () => signals.map(s => s.value) as any[];
    for (const signal of signals) {
        signal.subscribe(() => out.value = valueFunction(...getValues()));
    }
    out.value = valueFunction(...getValues());
    return out;
}

function compute2<T, T1, T2>(valueFunction: (a1: T1, a2: T2) => T, s1: Signal<T1>, s2: Signal<T2>) {
    return compute(valueFunction, s1, s2);
}

function compute3<T, T1, T2, T3>(valueFunction: (a1: T1, a2: T2, a3: T3) => T, s1: Signal<T1>, s2: Signal<T2>, s3: Signal<T3>) {
    return compute(valueFunction, s1, s2, s3);
}

const s1 = signal(23);
const s2 = signal("me");

const out = compute2<string, number, string>((v1, v2) => {
    return v1 * 2 + " and " + v2;
}, s1, s2);

console.log(out.value);
