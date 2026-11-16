<script lang="ts">
    // ThemeProvider component
    //
    // Applies a theme object to the consumer's content by flattening its nested keys into CSS custom
    // properties on a wrapping <div>. The wrapper uses display: contents so it does not affect layout.
    // Keys become `--theme-{path}`: {color: {primary: "#2563eb"}} sets --theme-color-primary.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   theme — Record<string, unknown>, required. A nested object; null, undefined and array values are skipped, other leaves are stringified.
    //   base — "light" | "dark", default "light". Rendered as data-theme so the consumer's CSS can swap variables.
    //   children — Snippet, required. The content.
    //   ...restProps — additional HTML attributes spread onto the root <div>.
    //
    // Syntax:
    //   <ThemeProvider theme={…} base="dark">…</ThemeProvider>
    //
    // Examples:
    //   <ThemeProvider theme={{ color: { primary: "#2563eb" }, space: { md: "1rem" } }}><App /></ThemeProvider>
    //
    // Keyboard:
    //   - None -- not interactive; any interactive children handle their own keys
    //
    // Accessibility:
    //   - No role or ARIA: a styling wrapper
    //   - Choose token values that meet contrast (WCAG 1.4.3); the provider does not check them
    //
    // Internationalization:
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - The one place a headless component writes an inline style (display: contents plus the custom properties), because the values are runtime data
    //   - Arrays are skipped, not flattened, so pass objects
    //
    // References:
    //   - MDN custom properties: https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties
    //   - Reuters Graphics ThemeProvider (the inspiration): https://github.com/reuters-graphics/graphics-components

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        theme,
        base = "light" as "light" | "dark",
        children,
        ...restProps
    }: {
        theme: Record<string, unknown>;
        base?: "light" | "dark";
        children: Snippet;
        [key: string]: unknown;
    } = $props();

    function flatten(obj: Record<string, unknown>, prefix = "--theme"): Record<string, string> {
        const out: Record<string, string> = {};
        for (const [key, value] of Object.entries(obj)) {
            const k = `${prefix}-${key}`;
            if (value !== null && typeof value === "object" && !Array.isArray(value)) {
                Object.assign(out, flatten(value as Record<string, unknown>, k));
            } else if (value !== undefined && value !== null) {
                out[k] = String(value);
            }
        }
        return out;
    }

    let styleString = $derived(
        "display: contents;" +
            Object.entries(flatten(theme))
                .map(([k, v]) => ` ${k}: ${v};`)
                .join(""),
    );
</script>

<!-- ThemeProvider.svelte -->
<div
    class={`theme-provider ${className}`}
    data-theme={base}
    style={styleString}
    {...restProps}
>
    {@render children?.()}
</div>
