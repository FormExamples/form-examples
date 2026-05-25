<script lang="ts">
    // ThemeProvider component
    //
    // Applies a theme object to the consumer's content by flattening nested
    // keys into CSS custom properties on a wrapping <div>. Uses
    // display: contents so the wrapper does not affect layout.

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
            .join("")
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
