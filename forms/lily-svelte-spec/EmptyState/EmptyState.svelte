<script lang="ts">
    // EmptyState component
    //
    // A headless container for the "nothing here yet" state of a list, table,
    // search or inbox. The consumer supplies the heading, explanation and action
    // as children; there is no icon and no default text.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. When given, the root becomes role="group" with this aria-label.
    //   children — Snippet. Heading, text, action.
    //   ...restProps — additional HTML attributes spread onto the root <div>.
    //
    // Keyboard:
    //   - None; any action inside is a native control
    //
    // Accessibility:
    //   - role="group" + aria-label only when label is supplied; otherwise a plain <div>
    //   - Not a live region: use InfoState (role="status") for announced states
    //
    // Claude rules:
    //   - Headless: no CSS, no icon, no hardcoded strings
    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label = undefined,
        children,
        ...restProps
    }: {
        /** Optional accessible name; adds role="group". */
        label?: string;
        /** Heading, text and action supplied by the consumer. */
        children?: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- EmptyState.svelte -->
<div
    class={`empty-state ${className}`}
    role={label ? "group" : undefined}
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</div>
