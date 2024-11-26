# FJSC (FJS Components)

FJSC is a library containing a set of components that can be used to build web applications.

## Add to repository via git submodule (recommended)

Switch to the folder where you want to add the library and run the following command:

```bash
git submodule add https://github.com/targoninc/fjsc.git
```

Alternatively, you can download the repository and include it as a subfolder.
Using submodules is recommended, as it allows you to easily update the library.

# Example usage

See [./.example/index.mjs](./.example/index.mjs) for an example of how to use FJSC.

# Using signals

```typescript
import {compute, signal} from "./signals.ts";

const s1 = signal(3);
const s2 = compute(v1 => v1 * 2, s1);
console.log(s2.value);

s2.subscribe(v => console.log(v));
s1.value *= 5;
s1.value *= 5;
s1.value *= 5;
```
