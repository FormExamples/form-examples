<script lang="ts">
    // ValidationList component
    //
    // A headless `<ul>` that hosts a live-feedback list of validation rules.
    // Each child is typically a `ValidationListItem`. The list applies a
    // REQUIRED `aria-label` and `aria-live="polite"` so that status changes
    // on its descendants are announced unobtrusively by screen readers.
    //
    // Props:
    //   class — string, optional. CSS class appended to the base class.
    //   label — string, REQUIRED. aria-label naming the field/list.
    //   children — Snippet, required. Validation list items.
    //   ...restProps — additional HTML attributes spread onto the <ul>.
    //
    // Syntax:
    //   <ValidationList label="Password requirements">…</ValidationList>
    //
    // Accessibility:
    //   - <ul> conveys list semantics
    //   - aria-label names the list
    //   - aria-live="polite" announces dynamic changes
    //
    // Internationalization:
    //   - label is consumer-supplied
    //
    // Claude rules:
    //   - Headless: no styles
    //   - label is REQUIRED
    //   - aria-live="polite" is the headless contract

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        children,
        ...restProps
    }: {
        /** Optional CSS class appended to the base class */
        class?: string;
        /** Accessible label naming the list (REQUIRED) */
        label: string;
        /** Validation list item children */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- ValidationList.svelte -->
<ul
    class={`validation-list ${className}`}
    aria-label={label}
    aria-live="polite"
    {...restProps}
>
    {@render children?.()}
</ul>
