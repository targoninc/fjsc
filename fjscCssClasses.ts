import {mergeCss} from "./f2.ts";
import type {CssClass} from "./f2.ts";
import {fjscVars} from "./fjscVariables.ts";

export const baseCss: CssClass = {
    fontFamily: `${fjscVars.font}, sans-serif`,
    fontSize: fjscVars.baseFontSize,
    border: "none",
    background: "none",
    color: fjscVars.textColor
}

export const gapCss: CssClass = mergeCss(baseCss, {
    gap: fjscVars.gap
});

export const flexCss: CssClass = mergeCss(baseCss, {
    display: "flex"
});

export const relativeCss: CssClass = mergeCss(baseCss, {
    position: "relative"
});

export const flexVerticalCss: CssClass = mergeCss(baseCss, flexCss, gapCss, {
    flexDirection: "column"
});

export const interactiveCss: CssClass = mergeCss(baseCss, {
    padding: `${fjscVars.inputPaddingY} ${fjscVars.inputPaddingX}`,
    borderRadius: fjscVars.borderRadiusSmall,
    border: `1px solid ${fjscVars.interactiveBorder}`,
    background: fjscVars.interactiveBackground,
    color: fjscVars.interactiveColor,
});
