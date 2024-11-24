import type {CssClass} from "./f2.ts";
import {fjscVars} from "./fjscVariables.ts";

export const interactiveCss: CssClass = {
    padding: `${fjscVars.fjscInputPaddingY} ${fjscVars.fjscInputPaddingX}`,
    borderRadius: fjscVars.fjscBorderRadiusSmall,
    border: `1px solid ${fjscVars.fjscInteractiveBorder}`,
    background: fjscVars.fjscInteractiveBackground,
    color: fjscVars.fjscInteractiveColor,
};
